import test from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  routes,
  renderRoute,
  pageSource,
} from "../dist/prerender/entry-server.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const publicDir = join(root, "dist/public");
const manifest = JSON.parse(
  await readFile(join(root, "dist/client-manifest.json"), "utf8"),
);
const pageEntries = Object.entries(manifest).filter(([key]) =>
  /^src\/pages\/.+\.tsx$/.test(key),
);

function outputFile(path) {
  return join(
    publicDir,
    path === "/" ? "index.html" : `${path.slice(1)}/index.html`,
  );
}

test("every exported document contains exactly its React-rendered page", async (t) => {
  assert.equal(routes.length, 7);
  assert.equal(new Set(routes.map(({ path }) => path)).size, 7);
  for (const route of routes) {
    await t.test(route.path, async () => {
      const rendered = await renderRoute(route.path);
      const html = await readFile(outputFile(route.path), "utf8");
      assert.ok(
        html.includes(
          `<div id="root" data-route="${route.path}">${rendered.html}</div>`,
        ),
      );
      assert.match(rendered.html, /data-overlay-container="true"/);
      assert.equal((rendered.html.match(/<main\b/g) ?? []).length, 1);
      assert.equal((rendered.html.match(/<h1\b/g) ?? []).length, 1);
      assert.doesNotMatch(rendered.html, /grid-rows-\[0fr\]/);
    });
  }
});

test("route aliases render the same tree and unknown paths remain unknown", async () => {
  for (const route of routes) {
    const original = await renderRoute(route.path);
    for (const alias of route.path === "/"
      ? ["/index.html"]
      : [`${route.path}/`, `${route.path}/index.html`]) {
      const rendered = await renderRoute(alias);
      assert.equal(rendered.html, original.html);
      assert.deepEqual(rendered.route, original.route);
    }
  }
  assert.equal((await renderRoute("/%66aq")).route.path, "/faq");
  const privacy = await renderRoute("/privacy");
  const policy = await renderRoute("/privacy-policy");
  assert.equal(privacy.html, policy.html);
  assert.equal(privacy.route.canonicalPath, "/privacy-policy");
  for (const path of ["/unknown", "/faq/extra", "/faq//", "/ABOUT", "/%zz"]) {
    await assert.rejects(renderRoute(path), /No public route/);
  }
});

test("documents preload only the selected page and static dependencies that exist", async (t) => {
  assert.equal(pageEntries.length, 7);
  for (const route of routes) {
    await t.test(route.path, async () => {
      const html = await readFile(outputFile(route.path), "utf8");
      const preloads = new Set(
        [
          ...html.matchAll(/<link rel="modulepreload"[^>]*href="\/([^\"]+)"/g),
        ].map((match) => match[1]),
      );
      const selectedKey = pageSource(route.page);
      const selected = manifest[selectedKey];
      assert.ok(selected, `Missing split module for ${route.path}`);
      assert.ok(
        preloads.has(selected.file),
        "Selected page must be discoverable without executing bootstrap JavaScript",
      );
      const required = new Set();
      function visit(key) {
        const entry = manifest[key];
        assert.ok(entry, key);
        if (required.has(entry.file)) return;
        required.add(entry.file);
        for (const dependency of entry.imports ?? []) visit(dependency);
      }
      visit(selectedKey);
      for (const file of required)
        assert.ok(preloads.has(file), `Missing static dependency ${file}`);
      for (const [key, entry] of pageEntries) {
        if (key !== selectedKey)
          assert.ok(
            !preloads.has(entry.file),
            `Unrelated page preloaded: ${key}`,
          );
      }
      for (const file of preloads)
        assert.ok((await stat(join(publicDir, file))).isFile());
      for (const match of html.matchAll(/(?:src|href)="(\/assets\/[^"#?]+)"/g))
        assert.ok((await stat(join(publicDir, match[1]))).isFile());
    });
  }
});

test("native disclosures, product links and FAQ schema exist before JavaScript", async () => {
  for (const path of ["/faq", "/privacy-policy", "/terms-of-service"]) {
    const { html } = await renderRoute(path);
    const details = html.match(/<details\b/g) ?? [];
    assert.ok(
      details.length >= 10,
      `${path} must expose its content through native controls`,
    );
    assert.equal((html.match(/<summary\b/g) ?? []).length, details.length);
  }
  const faq = await readFile(outputFile("/faq"), "utf8");
  assert.equal((faq.match(/"@type":"FAQPage"/g) ?? []).length, 1);
  assert.equal((faq.match(/id="faq-schema"/g) ?? []).length, 1);
  const { html } = await renderRoute("/");
  for (const destination of [
    "https://shopstr.market",
    "https://self-sown.com",
    "https://naughtygoat.co",
  ]) {
    assert.ok(html.includes(`href="${destination}"`));
  }
});

test("the published directory excludes server rendering and build metadata", async () => {
  for (const file of [
    "entry-server.js",
    "prerender/entry-server.js",
    "client-manifest.json",
    ".vite/manifest.json",
  ]) {
    await assert.rejects(stat(join(publicDir, file)), { code: "ENOENT" });
  }
  const bootstrap = manifest["index.html"];
  assert.ok(bootstrap);
  const source = await readFile(join(publicDir, bootstrap.file), "utf8");
  assert.ok(
    !source.includes("When contacting us, identify the product"),
    "Trust-page body content must remain in its lazy page chunk",
  );
});

test("each exported root declares the exact route identity used for hydration", async () => {
  for (const route of routes) {
    const html = await readFile(outputFile(route.path), "utf8");
    assert.ok(
      html.includes(`<div id="root" data-route="${route.path}">`),
      `Missing served document identity: ${route.path}`,
    );
  }
});

test("trust-page Markdown preserves every related-resource destination", async () => {
  for (const path of ["/about", "/contact"]) {
    const markdown = await readFile(
      outputFile(path).replace(/\.html$/, ".md"),
      "utf8",
    );
    for (const url of [
      "https://shopstrmarkets.com/faq",
      "https://shopstrmarkets.com/privacy",
      `https://shopstrmarkets.com/${path === "/about" ? "contact" : "about"}`,
      "https://shopstrmarkets.com/#marketplaces",
      "https://github.com/shopstr-eng",
      "https://njump.me/npub15dc33fyg3cpd9r58vlqge2hh8dy6hkkrjxkhluv2xpyfreqkmsesesyv6e",
    ]) {
      assert.ok(markdown.includes(`](${url})`), `Missing ${url} on ${path}`);
    }
  }
});

test("homepage Markdown keeps product categories and adjacent calls to action readable", async () => {
  const markdown = await readFile(join(publicDir, "index.md"), "utf8");
  for (const label of [
    "Electronics",
    "Art & Collectibles",
    "Books",
    "Clothing",
    "Local Farms",
    "Food Makers",
    "Artisan Goods",
    "Zero Platform Fees",
    "Honey Cajeta",
    "Goat Milk Caramel",
    "Regenerative Farms",
    "Locally Sourced",
  ]) {
    assert.ok(
      markdown.split("\n").includes(`- ${label}`),
      `Missing category boundary for ${label}`,
    );
  }
  assert.ok(
    markdown.includes(
      "[Start Shopping ⚡](https://shopstrmarkets.com/#marketplaces) [Learn More](https://shopstrmarkets.com/#mission)",
    ),
  );
});
