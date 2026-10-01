import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { once } from "node:events";
import express from "express";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const DIST = join(ROOT, "dist/public");
const PUBLIC = join(ROOT, "client/public");
const BASE_URL = "https://shopstrmarkets.com";
const EMAIL = "biz@shopstrmarkets.com";
const TELEPHONE = "+12062909736";
const trustPages = JSON.parse(
  await readFile(join(ROOT, "shared/trust-pages.json"), "utf8"),
);
const routes = [
  {
    path: "/",
    title: "Shopstr Markets - Commerce Without Boundaries",
    h1: "Commerce Without Boundaries 🚀",
    ogTitle: "Shopstr Markets - Our Products",
  },
  {
    path: "/faq",
    title: "FAQ | Shopstr Markets",
    h1: "Frequently Asked Questions",
  },
  { path: "/about", title: trustPages.about.title, h1: trustPages.about.title },
  {
    path: "/contact",
    title: trustPages.contact.title,
    h1: trustPages.contact.title,
  },
  {
    path: "/privacy",
    canonical: "/privacy-policy",
    title: "Privacy Policy | Shopstr Markets",
    h1: "Privacy Policy",
  },
  {
    path: "/privacy-policy",
    title: "Privacy Policy | Shopstr Markets",
    h1: "Privacy Policy",
  },
  {
    path: "/terms-of-service",
    title: "Terms of Service | Shopstr Markets",
    h1: "Terms of Service",
  },
];
const canonicalRoutes = routes.filter((route) => !route.canonical);
const trustLinks = [
  "/about",
  "/contact",
  "/faq",
  "/privacy",
  "/terms-of-service",
];

function routeFile(route, extension) {
  return `${route.path === "/" ? "" : route.path.slice(1) + "/"}index.${extension}`;
}

function decodeEntities(value) {
  const named = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    nbsp: " ",
    copy: "©",
    mdash: "—",
    ndash: "–",
  };
  return value.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (entity, code) => {
    if (/^#x/i.test(code))
      return String.fromCodePoint(parseInt(code.slice(2), 16));
    if (code.startsWith("#"))
      return String.fromCodePoint(parseInt(code.slice(1), 10));
    return named[code.toLowerCase()] ?? entity;
  });
}

function textContent(html) {
  return decodeEntities(
    html
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<(script|style|nav|footer)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
      .replace(/<[^>]*>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

function elementContents(html, tag) {
  return [
    ...html.matchAll(
      new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, "gi"),
    ),
  ].map((match) => match[1]);
}

function attributes(tag) {
  return Object.fromEntries(
    [...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(
      ([, name, double, single]) => [
        name.toLowerCase(),
        decodeEntities(double ?? single),
      ],
    ),
  );
}

function tags(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "gi"))].map(
    (match) => attributes(match[0]),
  );
}

function metadata(html, key) {
  return tags(html, "meta").find(
    (tag) => tag.name === key || tag.property === key,
  )?.content;
}

function linkByRel(html, relation) {
  const matches = tags(html, "link").filter((tag) =>
    tag.rel?.split(/\s+/).includes(relation),
  );
  assert.equal(matches.length, 1, `Expected one ${relation} discovery link`);
  return matches[0];
}

function schemaNodes(html) {
  const nodes = [];
  for (const match of html.matchAll(
    /<script\b([^>]*)>([\s\S]*?)<\/script>/gi,
  )) {
    if (attributes(match[1]).type !== "application/ld+json") continue;
    const data = JSON.parse(match[2]);
    nodes.push(...(Array.isArray(data) ? data : (data["@graph"] ?? [data])));
  }
  return nodes;
}

function markdownLinks(markdown) {
  return [...markdown.matchAll(/\[([^\]\n]+)\]\(([^)\s]+)\)/g)].map(
    ([, label, href]) => ({ label, href }),
  );
}

async function htmlFor(route) {
  return readFile(join(DIST, routeFile(route, "html")), "utf8");
}

async function allFiles(directory, prefix = "") {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory())
      files.push(...(await allFiles(join(directory, entry.name), relative)));
    else if (entry.isFile()) files.push(relative);
  }
  return files;
}

function assertOrganization(html) {
  const organizations = schemaNodes(html).filter(
    (node) => node["@type"] === "Organization",
  );
  assert.equal(organizations.length, 1);
  const organization = organizations[0];
  assert.equal(organization.name, "Shopstr Markets");
  assert.equal(organization.url, `${BASE_URL}/`);
  assert.equal(
    organization.description,
    "Shopstr Markets builds permissionless commerce on Nostr and Bitcoin and showcases Shopstr, Self-sown, and Naughty Goat Co.",
  );
  const points = Array.isArray(organization.contactPoint)
    ? organization.contactPoint
    : [organization.contactPoint];
  assert.ok(points.length > 0);
  const contact = points.find((point) => point?.email === EMAIL);
  assert.ok(
    contact,
    "Organization must publish its actual email in a ContactPoint",
  );
  assert.equal(contact["@type"], "ContactPoint");
  assert.equal(contact.contactType, "business inquiries");
  assert.equal(contact.telephone, TELEPHONE);
  assert.equal(contact.url, `${BASE_URL}/contact`);
  function noFabricatedAddress(value) {
    if (!value || typeof value !== "object") return;
    assert.notEqual(
      value["@type"],
      "PostalAddress",
      "No postal address is published",
    );
    for (const [key, child] of Object.entries(value)) {
      assert.ok(
        !/^(?:address|streetAddress|postalCode|postOfficeBoxNumber|addressLocality|addressRegion|addressCountry)$/i.test(
          key,
        ),
        `Unexpected unpublished address field: ${key}`,
      );
      noFabricatedAddress(child);
    }
  }
  noFabricatedAddress(organization);
}

test("every static route has substantive server-readable content and canonical title metadata", async (t) => {
  for (const route of routes) {
    await t.test(route.path, async () => {
      const html = await htmlFor(route);
      const main = elementContents(html, "main");
      assert.equal(
        main.length,
        1,
        "Content must exist without executing the React bundle",
      );
      const headings = elementContents(main[0], "h1");
      assert.equal(headings.length, 1);
      assert.equal(textContent(headings[0]), route.h1);
      assert.equal(textContent(elementContents(html, "title")[0]), route.title);
      const canonical = `${BASE_URL}${route.canonical ?? route.path}`;
      assert.equal(linkByRel(html, "canonical").href, canonical);
      assert.equal(metadata(html, "og:url"), canonical);
      assert.equal(metadata(html, "twitter:url"), canonical);
      assert.equal(metadata(html, "og:title"), route.ogTitle ?? route.title);
      assert.equal(
        metadata(html, "twitter:title"),
        route.ogTitle ?? route.title,
      );
      assert.ok(metadata(html, "description")?.trim());
      assert.ok(metadata(html, "og:description")?.trim());
      assert.ok(metadata(html, "twitter:description")?.trim());
      assert.ok(
        textContent(main[0]).length > 100,
        "Empty SPA shells do not count as page content",
      );
      if (
        ["/about", "/contact", "/privacy", "/privacy-policy"].includes(
          route.path,
        )
      ) {
        // Count visible content only: attributes, JSON-LD and shared chrome do not count.
        assert.ok(
          textContent(main[0]).length > 500,
          "Expected more than 500 actual body characters",
        );
      }
    });
  }
});

test("privacy alias shares the actual policy, metadata, canonical and Markdown content", async () => {
  const alias = routes.find((route) => route.path === "/privacy");
  const policy = routes.find((route) => route.path === "/privacy-policy");
  const aliasHtml = await htmlFor(alias);
  const policyHtml = await htmlFor(policy);
  assert.equal(
    elementContents(aliasHtml, "main")[0],
    elementContents(policyHtml, "main")[0],
  );
  assert.equal(
    linkByRel(aliasHtml, "canonical").href,
    `${BASE_URL}/privacy-policy`,
  );
  for (const key of [
    "description",
    "og:title",
    "og:description",
    "og:url",
    "twitter:title",
    "twitter:url",
  ]) {
    assert.equal(metadata(aliasHtml, key), metadata(policyHtml, key));
  }
  assert.equal(
    await readFile(join(DIST, routeFile(alias, "md")), "utf8"),
    await readFile(join(DIST, routeFile(policy, "md")), "utf8"),
  );
});

test("about and contact prose exactly matches the shared JSON used by React", async (t) => {
  for (const slug of ["about", "contact"]) {
    await t.test(slug, async () => {
      const content = trustPages[slug];
      const route = routes.find((route) => route.path === `/${slug}`);
      const html = await htmlFor(route);
      const main = elementContents(html, "main")[0];
      const paragraphs = elementContents(main, "p").map(textContent);
      const headings = elementContents(main, "h2").map(textContent);
      assert.equal(metadata(html, "description"), content.description);
      assert.equal(metadata(html, "og:description"), content.description);
      assert.equal(metadata(html, "twitter:description"), content.description);
      assert.equal(paragraphs[0], content.description);
      for (const section of content.sections) {
        assert.ok(headings.includes(section.title));
        for (const paragraph of section.paragraphs) {
          assert.equal(
            paragraphs.filter((value) => value === paragraph).length,
            1,
            `Missing shared paragraph: ${section.title}`,
          );
        }
      }
      const markdown = await readFile(
        join(DIST, routeFile(route, "md")),
        "utf8",
      );
      for (const section of content.sections) {
        assert.ok(markdown.includes(`## ${section.title}`));
        for (const paragraph of section.paragraphs)
          assert.ok(markdown.includes(paragraph));
      }
      const reactPage = await readFile(
        join(ROOT, `client/src/pages/${slug}.tsx`),
        "utf8",
      );
      assert.match(reactPage, new RegExp(`<TrustPage\\s+page="${slug}"\\s*/>`));
    });
  }
  const react = await readFile(
    join(ROOT, "client/src/components/TrustPage.tsx"),
    "utf8",
  );
  assert.match(
    react,
    /import\s+\w+\s+from\s+["']@shared\/trust-pages\.json\?raw["']/,
  );
  assert.match(react, /JSON\.parse\(trustPagesJson\)/);
  for (const binding of [
    "content.title",
    "content.description",
    "section.title",
    "paragraph",
  ]) {
    assert.ok(
      react.includes(`{${binding}}`),
      `React must render shared content: ${binding}`,
    );
  }
});

test("contact page renders working mailto and tel anchors as well as Markdown links", async () => {
  const route = routes.find((route) => route.path === "/contact");
  const html = await htmlFor(route);
  const anchors = [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].map(
    (match) => ({ ...attributes(match[1]), label: textContent(match[2]) }),
  );
  assert.ok(
    anchors.some(
      (anchor) => anchor.href === `mailto:${EMAIL}` && anchor.label === EMAIL,
    ),
  );
  assert.ok(
    anchors.some(
      (anchor) =>
        anchor.href === `tel:${TELEPHONE}` &&
        anchor.label === "+1 (206) 290-9736",
    ),
  );
  const markdown = await readFile(join(DIST, routeFile(route, "md")), "utf8");
  assert.ok(markdown.includes(`[${EMAIL}](mailto:${EMAIL})`));
  assert.ok(markdown.includes(`[+1 (206) 290-9736](tel:${TELEPHONE})`));
  const react = await readFile(
    join(ROOT, "client/src/components/TrustPage.tsx"),
    "utf8",
  );
  assert.ok(react.includes(`href="mailto:${EMAIL}"`));
  assert.ok(react.includes(`href="tel:${TELEPHONE}"`));
});

test("source and every generated page preserve accurate Organization contact schema without an address", async (t) => {
  assertOrganization(await readFile(join(ROOT, "client/index.html"), "utf8"));
  for (const route of routes) {
    await t.test(route.path, async () =>
      assertOrganization(await htmlFor(route)),
    );
  }
});

test("AboutPage and ContactPage schemas describe the correct canonical URLs and shared content", async (t) => {
  for (const [slug, type] of [
    ["about", "AboutPage"],
    ["contact", "ContactPage"],
  ]) {
    await t.test(slug, async () => {
      const nodes = schemaNodes(
        await htmlFor(routes.find((route) => route.path === `/${slug}`)),
      );
      const pages = nodes.filter((node) => node["@type"] === type);
      assert.equal(pages.length, 1);
      assert.equal(pages[0].url, `${BASE_URL}/${slug}`);
      assert.equal(pages[0]["@id"], `${BASE_URL}/${slug}#webpage`);
      assert.equal(pages[0].name, trustPages[slug].title);
      assert.equal(pages[0].description, trustPages[slug].description);
      assert.equal(pages[0].isPartOf["@id"], `${BASE_URL}/#website`);
      assert.equal(pages[0].about["@id"], `${BASE_URL}/#organization`);
    });
  }
});

test("every route has nonempty HTML-free Markdown and matching alternate and agent discovery links", async (t) => {
  for (const route of routes) {
    await t.test(route.path, async () => {
      const html = await htmlFor(route);
      const markdownPath = `/${routeFile(route, "md")}`;
      const alternate = linkByRel(html, "alternate");
      assert.equal(alternate.type, "text/markdown");
      assert.equal(alternate.href, markdownPath);
      assert.equal(linkByRel(html, "describedby").href, "/llms.txt");
      const markdown = await readFile(
        join(DIST, markdownPath.slice(1)),
        "utf8",
      );
      assert.ok(markdown.trim().length > 100);
      assert.ok(markdown.startsWith(`# ${route.h1}\n`));
      assert.doesNotMatch(markdown, /<\/?[a-z][^>]*>|<!doctype|<!--/i);
      assert.ok(
        markdown.includes(
          `Source: ${BASE_URL}${route.canonical ?? route.path}`,
        ),
      );
      assert.ok(markdown.includes(`[Agent guidance](${BASE_URL}/llms.txt)`));
      assert.doesNotMatch(markdown, /Get Started|© 2025 Shopstr Markets Inc\./);
      for (const { href } of markdownLinks(markdown)) {
        assert.match(
          href,
          /^(?:https?:\/\/|mailto:|tel:)/,
          `Link must be absolute: ${href}`,
        );
      }
    });
  }
  const source = await readFile(join(ROOT, "client/index.html"), "utf8");
  assert.equal(linkByRel(source, "alternate").href, "/index.md");
  assert.equal(linkByRel(source, "alternate").type, "text/markdown");
  assert.equal(linkByRel(source, "describedby").href, "/llms.txt");
});

test("llms.txt follows llmstxt.org structure with actionable guidance, hyperlink lists and real Markdown targets", async () => {
  const source = await readFile(join(PUBLIC, "llms.txt"), "utf8");
  const output = await readFile(join(DIST, "llms.txt"), "utf8");
  assert.equal(output, source);
  const nonempty = output.split("\n").filter((line) => line.trim());
  assert.equal(nonempty[0], "# Shopstr Markets");
  assert.match(nonempty[1], /^> \S/);
  assert.equal(output.match(/^# /gm)?.length, 1);
  const introduction = output.split(/^## /m)[0];
  assert.match(introduction, /When to use/i);
  assert.match(introduction, /How to use/i);
  assert.match(introduction, /ordinary HTTP GET/i);
  assert.match(introduction, /No login or API key is needed/i);
  assert.match(introduction, /not a shopping API or MCP server/i);
  assert.match(introduction, /do not invent API endpoints/i);
  assert.match(introduction, /must be authorized by the user/i);
  assert.match(introduction, /Accept:\s*text\/markdown/i);
  assert.match(introduction, /HTML pages do not negotiate Markdown/i);
  assert.match(introduction, /does not offer negotiated Markdown 404s/i);
  assert.match(introduction, /hosting provider's HTTP 404 response/i);
  assert.match(introduction, /explicit index\.md links/i);
  assert.doesNotMatch(
    output,
    /https?:\/\/shopstrmarkets\.com\/(?:api|mcp)(?:[\/\s)]|$)|(?:curl|POST|PUT|DELETE)\s+\/api\//i,
  );
  // Split rather than relying on a Markdown parser: this intentionally validates the llms.txt list format.
  const lists = output.split(/^## [^\n]+\n/m).slice(1);
  assert.ok(lists.length >= 2, "Expected H2 link-list sections");
  for (const list of lists) {
    const lines = list.split("\n").filter((line) => line.trim());
    assert.ok(lines.length > 0, "H2 sections must contain links");
    for (const line of lines) {
      assert.match(
        line,
        /^- \[[^\]]+\]\(https?:\/\/[^)\s]+\)(?:: .+)?$/,
        "H2 lists must use Markdown hyperlinks, not bare URLs",
      );
    }
  }
  const links = markdownLinks(output);
  const localLinks = links.filter(
    (link) => new URL(link.href).origin === BASE_URL,
  );
  const markdownTargets = localLinks.filter((link) =>
    new URL(link.href).pathname.endsWith(".md"),
  );
  assert.ok(markdownTargets.length >= canonicalRoutes.length);
  for (const route of canonicalRoutes) {
    assert.ok(
      markdownTargets.some(
        (link) => new URL(link.href).pathname === `/${routeFile(route, "md")}`,
      ),
      `Missing llms.txt Markdown target for ${route.path}`,
    );
  }
  for (const { href } of localLinks) {
    const path = new URL(href).pathname;
    const target = join(DIST, path.slice(1));
    assert.ok(
      (await stat(target)).isFile(),
      `Linked public target does not exist: ${href}`,
    );
    assert.ok(
      (await readFile(target)).length > 0,
      `Linked public target is empty: ${href}`,
    );
  }
});

test("sitemap includes about and contact plus canonical pre-existing pages, never the privacy alias", async () => {
  const xml = await readFile(join(DIST, "sitemap.xml"), "utf8");
  assert.equal(xml, await readFile(join(PUBLIC, "sitemap.xml"), "utf8"));
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(
    [...urls].sort(),
    canonicalRoutes.map((route) => `${BASE_URL}${route.path}`).sort(),
  );
  assert.equal(new Set(urls).size, urls.length);
  assert.ok(!urls.includes(`${BASE_URL}/privacy`));
  for (const route of canonicalRoutes) {
    assert.equal(
      linkByRel(await htmlFor(route), "canonical").href,
      `${BASE_URL}${route.path}`,
    );
  }
});

test("existing products, product links, logos and public Nostr mappings are preserved", async () => {
  const html = await htmlFor(routes[0]);
  const main = elementContents(html, "main")[0];
  for (const [name, url] of [
    ["Shopstr", "https://shopstr.market"],
    ["Self-sown", "https://self-sown.com"],
    ["Naughty Goat Co.", "https://naughtygoat.co"],
  ]) {
    assert.ok(textContent(main).includes(name));
    assert.ok(
      tags(main, "a").some((anchor) => anchor.href === url),
      `Missing product URL: ${url}`,
    );
  }
  const productLists = schemaNodes(html).filter(
    (node) => node["@type"] === "ItemList" && node.name === "Our Products",
  );
  assert.equal(productLists.length, 1);
  assert.equal(productLists[0].numberOfItems, 3);
  assert.deepEqual(
    productLists[0].itemListElement.map((item) => [item.name, item.url]),
    [
      ["Shopstr", "https://shopstr.market"],
      ["Self-sown", "https://self-sown.com"],
      ["Naughty Goat Co.", "https://naughtygoat.co"],
    ],
  );
  for (const logo of ["self-sown-icon.png", "naughty-goat-icon.webp"]) {
    assert.ok(
      tags(main, "img").some(
        (image) => image.src === `/${logo}` && image.alt?.trim(),
      ),
    );
  }
  for (const logo of [
    "favicon.png",
    "self-sown-icon.png",
    "naughty-goat-icon.webp",
  ]) {
    const source = await readFile(join(PUBLIC, logo));
    assert.ok(source.length > 0);
    assert.deepEqual(await readFile(join(DIST, logo)), source);
  }
  const expected = {
    names: {
      shopstr:
        "a37118a4888e02d28e8767c08caaf73b49abdac391ad7ff18a304891e416dc33",
      calvadev:
        "d36e8083fa7b36daee646cb8b3f99feaa3d89e5a396508741f003e21ac0b6bec",
      TommySatoshi:
        "af2b1ccca618ae557f64392da4823bde7cc273fe36b5350bfa246988cd7123fe",
      eric: "019bdf4169327bce27b5dd90092bfc1be4d09be1982e06e16efa97aedb83e3a2",
      Welliv:
        "d2b4168467439f03eb7e0e30be9412d5a29d050aac77dc60de3dcb9f45f91b07",
    },
  };
  for (const directory of [PUBLIC, DIST]) {
    assert.deepEqual(
      JSON.parse(
        await readFile(join(directory, ".well-known/nostr.json"), "utf8"),
      ),
      expected,
    );
  }
});

test("all source public files, including dotfiles, are copied unchanged to the static output", async (t) => {
  for (const path of await allFiles(PUBLIC)) {
    await t.test(path, async () => {
      assert.deepEqual(
        await readFile(join(DIST, path)),
        await readFile(join(PUBLIC, path)),
      );
    });
  }
});

test("static and React footers expose trust links and React registers every public route", async () => {
  for (const route of routes) {
    const footers = elementContents(await htmlFor(route), "footer");
    assert.equal(footers.length, 1);
    const hrefs = tags(footers[0], "a").map((anchor) => anchor.href);
    for (const href of trustLinks)
      assert.ok(
        hrefs.includes(href),
        `Missing static footer link ${href} on ${route.path}`,
      );
  }
  const footer = (
    await readFile(join(ROOT, "client/src/components/Footer.tsx"), "utf8")
  ).replace(/\{\/\*[\s\S]*?\*\/\}/g, "");
  const hrefs = tags(footer, "a").map((anchor) => anchor.href);
  for (const href of trustLinks)
    assert.ok(hrefs.includes(href), `Missing React footer link ${href}`);
  const app = await readFile(join(ROOT, "client/src/App.tsx"), "utf8");
  const registered = [
    ...app.matchAll(/<Route\s+path="([^"]+)"\s+component=\{(\w+)\}\s*\/>/g),
  ];
  const expected = new Map([
    ["/", "Home"],
    ["/faq", "FAQ"],
    ["/about", "About"],
    ["/contact", "Contact"],
    ["/privacy", "PrivacyPolicy"],
    ["/privacy-policy", "PrivacyPolicy"],
    ["/terms-of-service", "TermsOfService"],
  ]);
  for (const [path, component] of expected) {
    assert.equal(
      registered.filter((match) => match[1] === path && match[2] === component)
        .length,
      1,
      `Missing or wrong React route: ${path}`,
    );
  }
  assert.match(app, /<Route\s+component=\{NotFound\}\s*\/>/);
  for (const [component, slug] of [
    ["Home", "home"],
    ["FAQ", "faq"],
    ["About", "about"],
    ["Contact", "contact"],
    ["PrivacyPolicy", "privacy-policy"],
    ["TermsOfService", "terms-of-service"],
  ]) {
    assert.match(
      app,
      new RegExp(`import\\s+${component}\\s+from\\s+["']@/pages/${slug}["']`),
    );
    const source = await readFile(
      join(ROOT, `client/src/pages/${slug}.tsx`),
      "utf8",
    );
    assert.match(
      source,
      /<(?:Footer|TrustPage)\b/,
      `${component} must expose the common footer`,
    );
  }
  assert.match(
    await readFile(join(ROOT, "client/src/components/TrustPage.tsx"), "utf8"),
    /<Footer\s*\/>/,
  );
});

// This is a local plain-static HTTP fixture, NOT verification of production hosting.
// It deliberately has no SPA fallback, content negotiation or custom redirect rules.
test("plain-static HTTP fixture (not production hosting verification)", async (t) => {
  const app = express();
  app.use(express.static(DIST, { dotfiles: "allow" }));
  app.use((_request, response) =>
    response
      .status(404)
      .type("text/plain")
      .send("Static test fixture: file not found"),
  );
  const server = app.listen(0, "127.0.0.1");
  t.after(
    () =>
      new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
        server.closeAllConnections();
      }),
  );
  await once(server, "listening");
  const origin = `http://127.0.0.1:${server.address().port}`;
  const types = {
    html: /^text\/html\b/,
    md: /^text\/markdown\b/,
    txt: /^text\/plain\b/,
    json: /^application\/json\b/,
    xml: /^(?:application|text)\/xml\b/,
    js: /^(?:application|text)\/javascript\b/,
    css: /^text\/css\b/,
    png: /^image\/png\b/,
    webp: /^image\/webp\b/,
    gif: /^image\/gif\b/,
    jpg: /^image\/jpeg\b/,
    jpeg: /^image\/jpeg\b/,
    svg: /^image\/svg\+xml\b/,
  };
  const files = await allFiles(DIST);
  assert.ok(files.length > 0, "Build output is required");
  await t.test(
    "every public output file is readable over HTTP, including assets and .well-known JSON",
    async (filesTest) => {
      for (const path of files) {
        await filesTest.test(path, async () => {
          const url = `${origin}/${path.split("/").map(encodeURIComponent).join("/")}`;
          const response = await fetch(url, { redirect: "manual" });
          assert.equal(response.status, 200, path);
          assert.deepEqual(
            Buffer.from(await response.arrayBuffer()),
            await readFile(join(DIST, path)),
            path,
          );
          const type = types[path.split(".").at(-1)];
          if (type)
            assert.match(
              response.headers.get("content-type") ?? "",
              type,
              path,
            );
        });
      }
    },
  );
  await t.test(
    "all page clean paths and slash paths reach their own HTML files",
    async (pagesTest) => {
      for (const route of routes) {
        await pagesTest.test(route.path, async () => {
          const response = await fetch(`${origin}${route.path}`, {
            redirect: "manual",
          });
          const expected = await htmlFor(route);
          if (route.path === "/") {
            assert.equal(response.status, 200);
            assert.equal(await response.text(), expected);
          } else {
            assert.equal(
              response.status,
              301,
              "express.static redirects directory clean paths to slash paths",
            );
            assert.equal(response.headers.get("location"), `${route.path}/`);
            await response.arrayBuffer();
            const slash = await fetch(`${origin}${route.path}/`, {
              redirect: "manual",
            });
            assert.equal(slash.status, 200);
            assert.match(slash.headers.get("content-type"), /^text\/html\b/);
            assert.equal(await slash.text(), expected);
            const followed = await fetch(`${origin}${route.path}`);
            assert.equal(followed.status, 200);
            assert.equal(new URL(followed.url).pathname, `${route.path}/`);
            assert.equal(await followed.text(), expected);
          }
          const markdown = await fetch(`${origin}/${routeFile(route, "md")}`);
          assert.equal(markdown.status, 200);
          assert.equal(
            await markdown.text(),
            await readFile(join(DIST, routeFile(route, "md")), "utf8"),
          );
        });
      }
    },
  );
  await t.test(
    "Accept: text/markdown does not turn an existing HTML page into Markdown",
    async (negotiationTest) => {
      for (const route of routes) {
        await negotiationTest.test(route.path, async () => {
          const response = await fetch(`${origin}${route.path}`, {
            headers: { Accept: "text/markdown" },
          });
          assert.equal(response.status, 200);
          assert.match(response.headers.get("content-type"), /^text\/html\b/);
          assert.equal(await response.text(), await htmlFor(route));
        });
      }
    },
  );
  await t.test(
    "missing routes stay 404 for HTML and Markdown, never a successful SPA fallback",
    async (missingTest) => {
      for (const accept of ["text/html", "text/markdown"]) {
        for (const path of [
          "/missing-regression-route",
          "/missing-regression-route/",
          "/missing-regression-route/index.html",
          "/missing-regression-route/index.md",
          "/missing-regression-route.md",
        ]) {
          await missingTest.test(`${accept}: ${path}`, async () => {
            const response = await fetch(`${origin}${path}`, {
              headers: { Accept: accept },
              redirect: "manual",
            });
            assert.equal(response.status, 404);
            assert.equal(response.headers.get("location"), null);
            assert.match(
              response.headers.get("content-type"),
              /^text\/plain\b/,
            );
            assert.equal(
              await response.text(),
              "Static test fixture: file not found",
            );
          });
        }
      }
    },
  );
});
