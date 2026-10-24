#!/usr/bin/env node
import assert from "node:assert/strict";
import { once } from "node:events";
import { readFile, mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir, cpus, loadavg } from "node:os";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { createStaticApp } from "../server/static-app.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const args = process.argv.slice(2);
const options = new Map();
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--help") {
    console.log(
      "Usage: npm run verify:browser -- [--public-dir PATH] [--output-dir PATH] [--baseline-dir PATH] [--samples N] [--doctor URL]\nUses an owned ephemeral server and fresh browser contexts. Set PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH for an existing Chromium. Doctor only reads the supplied URL. Comparison uses at least five alternating cold loads. All evidence survives cleanup.",
    );
    process.exit(0);
  }
  assert.ok(
    [
      "--public-dir",
      "--output-dir",
      "--baseline-dir",
      "--samples",
      "--doctor",
    ].includes(args[i]),
    `Unknown option ${args[i]}`,
  );
  assert.ok(
    args[i + 1] && !args[i + 1].startsWith("--"),
    `Missing value for ${args[i]}`,
  );
  options.set(args[i], args[++i]);
}

async function doctor(url) {
  const response = await fetch(url);
  const html = await response.text();
  assert.equal(
    response.status,
    200,
    "Doctor requires a successful homepage response",
  );
  assert.match(html, /Shopstr Markets/);
  assert.match(html, /<main\b/);
  return {
    url,
    status: response.status,
    contentType: response.headers.get("content-type"),
    bytes: Buffer.byteLength(html),
  };
}
if (options.has("--doctor")) {
  console.log(JSON.stringify(await doctor(options.get("--doctor")), null, 2));
  process.exit(0);
}

const output = options.has("--output-dir")
  ? resolve(options.get("--output-dir"))
  : await mkdtemp(join(tmpdir(), "shopstr-browser-proof-"));
await mkdir(output, { recursive: true });
const samples = Number(options.get("--samples") ?? 5);
assert.ok(
  Number.isInteger(samples) && samples >= 5 && samples <= 20,
  "Samples must be an integer from 5 to 20",
);
const publicDir = resolve(
  options.get("--public-dir") ?? join(root, "dist/public"),
);
const result = {
  status: "running",
  settings: {
    publicDir,
    samples,
    cores: cpus().length,
    load: loadavg(),
    externalRequests: "blocked",
    comparison:
      "150ms latency, 1.6Mbps download, 4x CPU slowdown, fresh contexts",
  },
  routes: [],
  measurements: [],
};
const servers = [];
let browser;
async function serve(directory) {
  const server = createStaticApp({ publicDir: directory }).listen(
    0,
    "127.0.0.1",
  );
  await once(server, "listening");
  servers.push(server);
  return `http://127.0.0.1:${server.address().port}`;
}
async function contextFor(
  url,
  { javaScriptEnabled = true, mobile = false } = {},
) {
  const context = await browser.newContext({
    javaScriptEnabled,
    viewport: mobile
      ? { width: 390, height: 844 }
      : { width: 1440, height: 900 },
  });
  await context.route("**/*", (route) =>
    new URL(route.request().url()).origin === url
      ? route.continue()
      : route.abort(),
  );
  return context;
}
const pageModules = new Map([
  ["/", "home"],
  ["/faq", "faq"],
  ["/about", "about"],
  ["/contact", "contact"],
  ["/privacy", "privacy-policy"],
  ["/privacy-policy", "privacy-policy"],
  ["/terms-of-service", "terms-of-service"],
]);

try {
  const candidate = await serve(publicDir);
  result.doctor = await doctor(candidate);
  browser = await chromium.launch({
    executablePath:
      process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
    headless: true,
  });
  const manifest = JSON.parse(
    await readFile(join(publicDir, "../client-manifest.json"), "utf8"),
  );
  const dynamicPages = Object.entries(manifest).filter(([key]) =>
    /(?:^|\/)pages\/[^/]+\.tsx$/.test(key),
  );
  assert.ok(
    dynamicPages.length >= 6,
    "Build must expose split page modules in its manifest",
  );
  for (const [path, slug] of pageModules) {
    const proof = { path, noJavaScript: {}, hydrated: {} };
    const plainContext = await contextFor(candidate, {
      javaScriptEnabled: false,
    });
    try {
      const page = await plainContext.newPage();
      assert.equal((await page.goto(candidate + path)).status(), 200);
      await page.locator("main h1").waitFor();
      assert.equal(await page.locator("main").count(), 1);
      proof.noJavaScript.heading = await page.locator("main h1").innerText();
      assert.ok((await page.locator("main").innerText()).length > 100);
      const details = page.locator("main details");
      const count = await details.count();
      if (["faq", "privacy-policy", "terms-of-service"].includes(slug))
        assert.ok(count > 0, "Disclosures must work without JavaScript");
      for (let i = 0; i < count; i++) {
        const item = details.nth(i);
        if (!(await item.evaluate((node) => node.open)))
          await item.locator("summary").click();
        assert.ok(await item.evaluate((node) => node.open));
        assert.ok(
          (await item.innerText()).length >
            (await item.locator("summary").innerText()).length + 20,
        );
      }
      proof.noJavaScript.disclosuresOpened = count;
      if (path === "/") {
        for (const href of [
          "https://shopstr.market",
          "https://self-sown.com",
          "https://naughtygoat.co",
        ])
          assert.ok(
            await page.locator(`main a[href="${href}"]`).count(),
            `Missing native product link ${href}`,
          );
        await page.screenshot({ path: join(output, "home-no-js-desktop.png") });
      }
      if (path === "/contact") {
        assert.ok(
          await page
            .locator('main a[href="mailto:biz@shopstrmarkets.com"]')
            .count(),
        );
        assert.ok(
          await page.locator('main a[href="tel:+12062909736"]').count(),
        );
      }
      const link = page.locator('footer a[href="/about"]').first();
      await Promise.all([page.waitForURL(candidate + "/about"), link.click()]);
      assert.ok((await page.locator("main h1").innerText()).length);
      proof.noJavaScript.documentNavigation = true;
    } finally {
      await plainContext.close();
    }
    const context = await contextFor(candidate, { mobile: true });
    try {
      const page = await context.newPage();
      const errors = [];
      const requests = [];
      const httpFailures = [];
      page.on("response", (response) => {
        if (response.url().startsWith(candidate) && response.status() >= 400)
          httpFailures.push(`${response.status()} ${response.url()}`);
      });
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (
          message.type() === "error" &&
          !/Failed to load resource/.test(message.text())
        )
          errors.push(message.text());
      });
      page.on("request", (request) => {
        if (
          request.resourceType() === "script" &&
          request.url().startsWith(candidate)
        )
          requests.push(new URL(request.url()).pathname);
      });
      await page.addInitScript(() => {
        window.__prerenderProof = { node: null };
        const observer = new MutationObserver(() => {
          const node = document.querySelector("#root main");
          if (node && !window.__prerenderProof.node) {
            window.__prerenderProof.node = node;
            observer.disconnect();
          }
        });
        observer.observe(document, { childList: true, subtree: true });
      });
      assert.equal(
        (
          await page.goto(candidate + path, { waitUntil: "networkidle" })
        ).status(),
        200,
      );
      await page.waitForFunction(
        () => document.body.style.overflow === "unset",
      );
      assert.ok(
        await page.evaluate(
          () =>
            window.__prerenderProof.node ===
            document.querySelector("#root main"),
        ),
        `Hydration replaced SSR main on ${path}`,
      );
      for (const [key, entry] of dynamicPages) {
        const requested = requests.includes("/" + entry.file);
        if (key.endsWith(`/pages/${slug}.tsx`))
          assert.ok(requested, `Selected page was not loaded: ${key}`);
        else
          assert.equal(requested, false, `Unrelated page downloaded: ${key}`);
      }
      await page.getByRole("button", { name: "Toggle menu" }).click();
      await page.getByRole("button", { name: "Close menu" }).waitFor();
      await page.getByRole("button", { name: "Close menu" }).click();
      assert.equal(
        await page.getByRole("button", { name: "Close menu" }).count(),
        0,
      );
      const first = page.locator("main details").first();
      if (await first.count()) {
        const before = await first.evaluate((node) => node.open);
        await first.locator("summary").click();
        assert.equal(await first.evaluate((node) => node.open), !before);
      }
      assert.deepEqual(errors, [], `Browser errors on ${path}`);
      assert.deepEqual(httpFailures, [], `Failed local resources on ${path}`);
      proof.hydrated = {
        nodePreserved: true,
        errors,
        scriptRequests: requests,
        menuToggle: true,
      };
      if (path === "/")
        await page.screenshot({
          path: join(output, "home-hydrated-mobile.png"),
        });
      if (path === "/faq")
        await page.screenshot({
          path: join(output, "faq-hydrated-mobile.png"),
        });
      await writeFile(
        join(
          output,
          `${slug}-${path === "/privacy" ? "alias-" : ""}accessibility.yml`,
        ),
        await page.locator("body").ariaSnapshot(),
      );
    } finally {
      await context.close();
    }
    result.routes.push(proof);
  }
  {
    const context = await contextFor(candidate);
    let releaseScripts;
    const gate = new Promise((done) => {
      releaseScripts = done;
    });
    try {
      await context.route("**/*.js", async (route) => {
        if (!route.request().url().startsWith(candidate)) return route.abort();
        await gate;
        await route.continue();
      });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (
          message.type() === "error" &&
          !/Failed to load resource/.test(message.text())
        )
          errors.push(message.text());
      });
      await page.goto(candidate + "/faq", { waitUntil: "commit" });
      const detail = page.locator("main details").first();
      await detail.waitFor();
      const before = await detail.evaluate((node) => node.open);
      await detail.locator("summary").click();
      const changed = await detail.evaluate((node) => node.open);
      assert.equal(changed, !before);
      releaseScripts();
      await page.waitForLoadState("networkidle");
      await page.waitForFunction(
        () => document.body.style.overflow === "unset",
      );
      assert.equal(
        await detail.evaluate((node) => node.open),
        changed,
        "Hydration must preserve a disclosure changed before JS arrived",
      );
      assert.deepEqual(
        errors,
        [],
        "Early disclosure interaction must not produce hydration errors",
      );
      result.earlyDisclosure = { statePreserved: true, errors };
    } finally {
      releaseScripts();
      await context.close();
    }
  }
  {
    const context = await contextFor(candidate);
    try {
      const entry = dynamicPages.find(([key]) =>
        key.endsWith("/pages/faq.tsx"),
      );
      assert.ok(entry);
      await context.route(candidate + "/" + entry[1].file, (route) =>
        route.abort(),
      );
      const page = await context.newPage();
      await page.goto(candidate + "/faq", { waitUntil: "networkidle" });
      assert.match(
        await page.locator("main h1").innerText(),
        /Frequently Asked Questions/,
      );
      const detail = page.locator("main details").first();
      const before = await detail.evaluate((node) => node.open);
      await detail.locator("summary").click();
      assert.equal(await detail.evaluate((node) => node.open), !before);
      result.failedPageImport = {
        contentPreserved: true,
        disclosureWorks: true,
      };
    } finally {
      await context.close();
    }
  }
  result.aliases = [];
  for (const path of [
    "/faq/",
    "/faq/index.html",
    "/privacy/index.html",
    "/%66aq",
    "/faq/?from=verification",
  ]) {
    const context = await contextFor(candidate);
    try {
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (
          message.type() === "error" &&
          !/Failed to load resource/.test(message.text())
        )
          errors.push(message.text());
      });
      assert.equal(
        (
          await page.goto(candidate + path, { waitUntil: "networkidle" })
        ).status(),
        200,
      );
      await page.waitForFunction(
        () => document.body.style.overflow === "unset",
      );
      const heading = await page.locator("main h1").innerText();
      assert.match(
        heading,
        path.includes("privacy")
          ? /Privacy Policy/
          : /Frequently Asked Questions/,
      );
      assert.equal(
        (await page.reload({ waitUntil: "networkidle" })).status(),
        200,
      );
      await page.waitForFunction(
        () => document.body.style.overflow === "unset",
      );
      assert.equal(await page.locator("main h1").innerText(), heading);
      assert.deepEqual(errors, [], `Alias hydration failed: ${path}`);
      result.aliases.push({ path, heading, refresh: true, errors });
    } finally {
      await context.close();
    }
  }
  for (const path of ["/missing-page", "/assets/missing-file.js"])
    assert.equal((await fetch(candidate + path)).status, 404);
  if (options.has("--baseline-dir")) {
    const baseline = await serve(resolve(options.get("--baseline-dir")));
    for (let i = 0; i < samples; i++)
      for (const [label, url] of [
        ["baseline", baseline],
        ["candidate", candidate],
      ]) {
        const context = await contextFor(url);
        try {
          const page = await context.newPage();
          const cdp = await context.newCDPSession(page);
          await cdp.send("Network.enable");
          await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
          await cdp.send("Network.emulateNetworkConditions", {
            offline: false,
            latency: 150,
            downloadThroughput: 1600000 / 8,
            uploadThroughput: 750000 / 8,
            connectionType: "cellular3g",
          });
          await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
          await page.addInitScript(() => {
            window.__perf = {
              lcpMs: null,
              lcpUrl: null,
              longTaskBlockingMs: 0,
            };
            new PerformanceObserver((list) => {
              for (const item of list.getEntries()) {
                window.__perf.lcpMs = item.startTime;
                window.__perf.lcpUrl =
                  item.url || item.element?.tagName || null;
              }
            }).observe({ type: "largest-contentful-paint", buffered: true });
            new PerformanceObserver((list) => {
              for (const item of list.getEntries())
                window.__perf.longTaskBlockingMs += Math.max(
                  0,
                  item.duration - 50,
                );
            }).observe({ type: "longtask", buffered: true });
          });
          const bodies = [];
          const failures = [];
          page.on("pageerror", (error) => failures.push(error.message));
          page.on("response", (response) => {
            if (response.url().startsWith(url) && response.status() >= 400)
              failures.push(`${response.status()} ${response.url()}`);
          });
          page.on("requestfailed", (request) => {
            if (request.url().startsWith(url)) failures.push(request.url());
          });
          page.on("response", (response) => {
            if (
              response.url().startsWith(url) &&
              response.request().resourceType() === "script"
            )
              bodies.push(
                (async () => {
                  assert.equal(response.status(), 200);
                  return {
                    url: new URL(response.url()).pathname,
                    bytes: (await response.body()).length,
                  };
                })().catch((error) => {
                  failures.push(error.message);
                  return { url: new URL(response.url()).pathname, bytes: 0 };
                }),
              );
          });
          assert.equal(
            (await page.goto(url, { waitUntil: "networkidle" })).status(),
            200,
          );
          await page.getByRole("heading", { level: 1 }).waitFor();
          const scripts = await Promise.all(bodies);
          assert.deepEqual(failures, []);
          assert.ok(scripts.length > 0);
          result.measurements.push({
            label,
            sample: i + 1,
            javascriptBytes: scripts.reduce(
              (sum, script) => sum + script.bytes,
              0,
            ),
            scripts,
            ...(await page.evaluate(() => ({
              ...window.__perf,
              resources: performance
                .getEntriesByType("resource")
                .map((item) => ({
                  name: new URL(item.name).pathname,
                  initiator: item.initiatorType,
                  startMs: item.startTime,
                  responseEndMs: item.responseEnd,
                  durationMs: item.duration,
                  encodedBytes: item.encodedBodySize,
                  decodedBytes: item.decodedBodySize,
                })),
            }))),
            failures,
          });
        } finally {
          await context.close();
        }
      }
    const summary = {};
    for (const label of ["baseline", "candidate"]) {
      summary[label] = {};
      for (const metric of ["javascriptBytes", "lcpMs", "longTaskBlockingMs"]) {
        const values = result.measurements
          .filter((item) => item.label === label)
          .map((item) => item[metric])
          .filter((value) => value !== null)
          .sort((a, b) => a - b);
        summary[label][metric] = {
          count: values.length,
          median:
            (values[Math.floor((values.length - 1) / 2)] +
              values[Math.floor(values.length / 2)]) /
            2,
          min: values[0],
          max: values.at(-1),
        };
      }
    }
    result.summary = summary;
  }
  result.status = "passed";
} catch (error) {
  result.status = "failed";
  result.error = error.stack;
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  await Promise.all(
    servers.map(
      (server) =>
        new Promise((done, reject) => {
          server.close((error) => (error ? reject(error) : done()));
          server.closeAllConnections();
        }),
    ),
  );
  await writeFile(
    join(output, "results.json"),
    JSON.stringify(result, null, 2),
  );
  console.log(
    JSON.stringify(
      {
        status: result.status,
        routes: result.routes.length,
        evidence: join(output, "results.json"),
        summary: result.summary,
        error: result.error,
      },
      null,
      2,
    ),
  );
}
