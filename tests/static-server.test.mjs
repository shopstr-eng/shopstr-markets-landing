import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import { request as httpRequest } from "node:http";
import { once } from "node:events";
import {
  cp,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { createStaticApp } from "../server/static-app.mjs";

const PUBLIC_DIR = fileURLToPath(new URL("../dist/public/", import.meta.url));
const ROUTES = [
  "/",
  "/about",
  "/contact",
  "/privacy",
  "/privacy-policy",
  "/faq",
  "/terms-of-service",
];
const BROWSER_ACCEPT =
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8";
const MARKDOWN_TYPE = /^text\/markdown\s*;\s*charset=utf-8$/i;
const HTML_TYPE = /^text\/html\s*;\s*charset=utf-8$/i;
let server;
let exportedFiles;

function pageFile(route, extension) {
  return `${route === "/" ? "" : `${route.slice(1)}/`}index.${extension}`;
}

function aliases(route) {
  return route === "/"
    ? ["/", "/index.html"]
    : [route, `${route}/`, `${route}/index.html`];
}

async function filesUnder(directory, prefix = "") {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relative = `${prefix}${entry.name}`;
    if (entry.isDirectory()) {
      files.push(
        ...(await filesUnder(join(directory, entry.name), `${relative}/`)),
      );
    } else if (entry.isFile()) {
      files.push(relative);
    }
  }
  return files.sort();
}

async function listen(app) {
  const listener = app.listen(0, "127.0.0.1");
  await once(listener, "listening");
  return listener;
}

async function close(listener) {
  if (!listener) return;
  await new Promise((resolve, reject) => {
    listener.close((error) => (error ? reject(error) : resolve()));
    listener.closeIdleConnections?.();
  });
}

// Use HTTP directly: URL/fetch normalization would hide traversal paths from the server.
function request(
  path,
  { accept, method = "GET", headers = {}, listener = server } = {},
) {
  return new Promise((resolve, reject) => {
    const outgoing = httpRequest(
      {
        hostname: "127.0.0.1",
        port: listener.address().port,
        path,
        method,
        headers: {
          ...headers,
          ...(accept === undefined ? {} : { Accept: accept }),
        },
        agent: false,
      },
      (incoming) => {
        const chunks = [];
        incoming.on("data", (chunk) => chunks.push(chunk));
        incoming.on("error", reject);
        incoming.on("end", () => {
          const body = Buffer.concat(chunks);
          resolve({
            status: incoming.statusCode,
            headers: incoming.headers,
            body,
            text: body.toString("utf8"),
          });
        });
      },
    );
    outgoing.setTimeout(10_000, () =>
      outgoing.destroy(new Error(`HTTP request timed out: ${method} ${path}`)),
    );
    outgoing.on("error", reject);
    outgoing.end();
  });
}

function assertVaryAccept(response) {
  const fields = (response.headers.vary ?? "")
    .split(",")
    .map((field) => field.trim().toLowerCase());
  assert.ok(
    fields.includes("accept"),
    `Expected Vary: Accept, got ${response.headers.vary}`,
  );
}

function assertRepresentation(response, extension, expected, context) {
  assert.equal(response.status, 200, context);
  assert.match(
    response.headers["content-type"] ?? "",
    extension === "md" ? MARKDOWN_TYPE : HTML_TYPE,
    context,
  );
  assertVaryAccept(response);
  assert.deepEqual(
    response.body,
    expected,
    `Representation differs from static export: ${context}`,
  );
  assert.ok(response.text.trim().length > 0, context);
  if (extension === "md") {
    assert.doesNotMatch(response.text, /<!doctype|<\/?[a-z][^>]*>/i, context);
  } else {
    assert.match(response.text, /<!doctype html|<html\b/i, context);
  }
}

before(async () => {
  exportedFiles = new Map(
    await Promise.all(
      (await filesUnder(PUBLIC_DIR)).map(async (file) => [
        file,
        await readFile(join(PUBLIC_DIR, file)),
      ]),
    ),
  );
  server = await listen(createStaticApp({ publicDir: PUBLIC_DIR }));
});

after(async () => {
  await close(server);
});

describe("production page negotiation uses the actual static exports", () => {
  for (const route of ROUTES) {
    test(`${route}: clean, trailing-slash and index.html URLs support both representations`, async () => {
      for (const path of aliases(route)) {
        const markdown = await request(path, { accept: "text/markdown" });
        assertRepresentation(
          markdown,
          "md",
          exportedFiles.get(pageFile(route, "md")),
          path,
        );
        for (const accept of [
          undefined,
          "text/html",
          "*/*",
          "text/*",
          BROWSER_ACCEPT,
        ]) {
          const html = await request(path, { accept });
          assertRepresentation(
            html,
            "html",
            exportedFiles.get(pageFile(route, "html")),
            `${path}, Accept: ${accept}`,
          );
        }
      }
    });

    test(`${route}: unacceptable representations return 406, including aliases and HEAD`, async () => {
      for (const path of aliases(route)) {
        const get = await request(path, { accept: "application/json" });
        assert.equal(get.status, 406, path);
        assertVaryAccept(get);
        assert.ok(get.text.trim().length > 0, "406 must explain the failure");
        const head = await request(path, {
          accept: "application/json",
          method: "HEAD",
        });
        assert.equal(head.status, 406, path);
        assertVaryAccept(head);
        assert.equal(head.body.length, 0);
        assert.equal(head.headers["content-type"], get.headers["content-type"]);
      }
    });

    test(`${route}: HEAD has the selected representation's headers, but no body`, async () => {
      for (const path of aliases(route)) {
        for (const [accept, extension] of [
          ["text/markdown", "md"],
          ["text/html", "html"],
          [undefined, "html"],
        ]) {
          const get = await request(path, { accept });
          const head = await request(path, { accept, method: "HEAD" });
          assert.equal(head.status, 200, path);
          assert.equal(head.body.length, 0, path);
          assert.match(
            head.headers["content-type"] ?? "",
            extension === "md" ? MARKDOWN_TYPE : HTML_TYPE,
          );
          assert.equal(
            head.headers["content-type"],
            get.headers["content-type"],
          );
          assert.equal(head.headers.etag, get.headers.etag);
          assert.equal(
            Number(head.headers["content-length"]),
            exportedFiles.get(pageFile(route, extension)).length,
          );
          assertVaryAccept(head);
        }
      }
    });
  }
});

describe("Accept quality and specificity", () => {
  const cases = [
    ["text/html;q=0.9, text/markdown;q=0.2", "html"],
    ["text/markdown;q=0.2, text/html;q=0.9", "html"],
    ["text/html;q=0.2, text/markdown;q=0.9", "md"],
    ["text/markdown;q=0.9, text/html;q=0.2", "md"],
    ["text/markdown, text/html;q=0.9", "md"],
    ["text/html, text/markdown;q=0.9", "html"],
    ["text/markdown;q=0.5, text/html;q=0.5", "md"],
    ["text/html;q=0.5, text/markdown;q=0.5", "html"],
    ["text/markdown, text/html", "md"],
    ["text/html, text/markdown", "html"],
    ["text/markdown;q=0, text/html", "html"],
    ["text/markdown;q=0, */*;q=1", "html"],
    ["text/html;q=0, text/markdown;q=0.5", "md"],
    ["text/html;q=0, */*;q=0.5", "md"],
    ["application/json, */*;q=0.1", "html"],
    ["text/markdown;q=0", null],
    ["text/html;q=0, text/markdown;q=0", null],
    ["*/*;q=0", null],
  ];

  for (const [accept, extension] of cases) {
    test(`Accept: ${accept}`, async () => {
      for (const route of ROUTES) {
        const response = await request(route, { accept });
        if (extension) {
          assertRepresentation(
            response,
            extension,
            exportedFiles.get(pageFile(route, extension)),
            route,
          );
        } else {
          assert.equal(response.status, 406, route);
          assertVaryAccept(response);
          assert.doesNotMatch(
            response.headers["content-type"] ?? "",
            /^text\/markdown\b/i,
          );
        }
      }
    });
  }
});

test("explicit index.md files stay Markdown regardless of Accept", async () => {
  for (const route of ROUTES) {
    const path = `/${pageFile(route, "md")}`;
    for (const accept of [
      undefined,
      "text/markdown",
      "text/html",
      "application/json",
    ]) {
      const response = await request(path, { accept });
      assert.equal(response.status, 200, path);
      assert.match(response.headers["content-type"] ?? "", MARKDOWN_TYPE);
      assert.deepEqual(
        response.body,
        exportedFiles.get(pageFile(route, "md")),
        path,
      );
    }
    const head = await request(path, { accept: "text/html", method: "HEAD" });
    assert.equal(head.status, 200);
    assert.match(head.headers["content-type"] ?? "", MARKDOWN_TYPE);
    assert.equal(head.body.length, 0);
    assert.equal(
      Number(head.headers["content-length"]),
      exportedFiles.get(pageFile(route, "md")).length,
    );
  }
});

test("every built static file is served byte-for-byte, with assets and machine files exempt from negotiation", async () => {
  assert.ok(
    exportedFiles.size > ROUTES.length * 2,
    "Expected static assets as well as page exports",
  );
  for (const [file, bytes] of exportedFiles) {
    const path = `/${file}`;
    const accepts =
      file.endsWith("/index.html") || file === "index.html"
        ? ["text/html"]
        : ["text/html", "text/markdown"];
    for (const accept of accepts) {
      const response = await request(path, { accept });
      assert.equal(response.status, 200, `${path}, Accept: ${accept}`);
      assert.deepEqual(
        response.body,
        bytes,
        `${path} must preserve its exported bytes`,
      );
      assert.ok(
        response.headers["content-type"],
        `Missing content type: ${path}`,
      );
      if (!file.endsWith(".md") && !file.endsWith(".html")) {
        assert.doesNotMatch(
          response.headers["content-type"],
          /^text\/(?:markdown|html)\b/i,
          path,
        );
      }
    }
  }

  const machineTypes = [
    ["/llms.txt", /^text\/plain\b/i],
    ["/robots.txt", /^text\/plain\b/i],
    ["/sitemap.xml", /^(?:application|text)\/xml\b/i],
    ["/.well-known/nostr.json", /^application\/json\b/i],
  ];
  for (const [path, type] of machineTypes) {
    const get = await request(path, { accept: "text/markdown" });
    assert.equal(get.status, 200, path);
    assert.match(get.headers["content-type"] ?? "", type, path);
    const head = await request(path, {
      accept: "text/markdown",
      method: "HEAD",
    });
    assert.equal(head.status, 200, path);
    assert.equal(head.body.length, 0, path);
    assert.equal(
      head.headers["content-type"],
      get.headers["content-type"],
      path,
    );
  }
});

test("Nostr discovery returns authentic JSON and permissive CORS even for Markdown clients", async () => {
  for (const accept of [
    undefined,
    "application/json",
    "text/html",
    "text/markdown",
  ]) {
    for (const method of ["GET", "HEAD"]) {
      const response = await request("/.well-known/nostr.json", {
        accept,
        method,
      });
      assert.equal(response.status, 200);
      assert.match(
        response.headers["content-type"] ?? "",
        /^application\/json\b/i,
      );
      assert.equal(response.headers["access-control-allow-origin"], "*");
      if (method === "GET") {
        assert.deepEqual(
          JSON.parse(response.text),
          JSON.parse(
            exportedFiles.get(".well-known/nostr.json").toString("utf8"),
          ),
        );
      } else {
        assert.equal(response.body.length, 0);
      }
    }
  }
});

test("Nostr OPTIONS returns 204 and advertises GET, HEAD and OPTIONS", async () => {
  const response = await request("/.well-known/nostr.json", {
    method: "OPTIONS",
    headers: {
      Origin: "https://example.com",
      "Access-Control-Request-Method": "GET",
    },
  });
  assert.equal(response.status, 204);
  assert.equal(response.body.length, 0);
  assert.equal(response.headers["access-control-allow-origin"], "*");
  const methods = (response.headers["access-control-allow-methods"] ?? "")
    .split(",")
    .map((method) => method.trim().toUpperCase());
  for (const method of ["GET", "HEAD", "OPTIONS"]) {
    assert.ok(
      methods.includes(method),
      `Missing ${method} in Access-Control-Allow-Methods`,
    );
  }
});

test("unknown routes remain helpful 404s in HTML and Markdown, never the home page", async () => {
  for (const path of [
    "/not-a-page",
    "/not-a-page/",
    "/not-a-page/index.html",
    "/about/not-a-page",
  ]) {
    for (const [accept, type] of [
      ["text/markdown", MARKDOWN_TYPE],
      ["text/html", HTML_TYPE],
      [undefined, HTML_TYPE],
    ]) {
      const get = await request(path, { accept });
      assert.equal(get.status, 404, path);
      assert.match(get.headers["content-type"] ?? "", type, path);
      assertVaryAccept(get);
      assert.match(
        get.text,
        /not found|404/i,
        "404 must explain the missing page",
      );
      if (accept === "text/markdown") {
        assert.match(
          get.text,
          /\[[^\]]+\]\([^)\s]*\/llms\.txt\)/,
          "Markdown 404 must link to agent guidance",
        );
        assert.doesNotMatch(get.text, /<!doctype|<\/?[a-z][^>]*>/i);
      } else {
        assert.match(
          get.text,
          /<a\b[^>]*href=["'][^"']*\/llms\.txt["']/i,
          "HTML 404 must link to agent guidance",
        );
      }
      assert.notDeepEqual(
        get.body,
        exportedFiles.get(
          pageFile("/", accept === "text/markdown" ? "md" : "html"),
        ),
      );
      const head = await request(path, { accept, method: "HEAD" });
      assert.equal(head.status, 404, path);
      assert.equal(head.body.length, 0);
      assert.equal(head.headers["content-type"], get.headers["content-type"]);
      assertVaryAccept(head);
    }
  }
});

function assertAllowGetHead(response) {
  const allowed = (response.headers.allow ?? "")
    .split(",")
    .map((method) => method.trim().toUpperCase());
  assert.ok(allowed.includes("GET"), "405 must include GET in Allow");
  assert.ok(allowed.includes("HEAD"), "405 must include HEAD in Allow");
  assert.ok(
    !allowed.includes("POST"),
    "POST must not be advertised as supported",
  );
}

test("POST returns 405 with Allow: GET, HEAD rather than serving content", async () => {
  const asset = [...exportedFiles.keys()].find((file) =>
    file.startsWith("assets/"),
  );
  assert.ok(asset, "Build should contain a real static asset");
  const paths = [
    ...ROUTES.flatMap(aliases),
    "/index.md",
    "/about/index.md",
    "/llms.txt",
    "/robots.txt",
    "/sitemap.xml",
    "/.well-known/nostr.json",
    `/${asset}`,
    "/not-a-page",
  ];
  for (const path of paths) {
    for (const accept of ["text/html", "text/markdown"]) {
      const response = await request(path, { accept, method: "POST" });
      assert.equal(response.status, 405, path);
      assertAllowGetHead(response);
    }
  }
});

describe("conditional requests do not confuse HTML and Markdown validators", () => {
  for (const route of ROUTES) {
    test(`${route}: representation-specific ETags and 304 Vary`, async () => {
      const html = await request(route, { accept: "text/html" });
      const markdown = await request(route, { accept: "text/markdown" });
      for (const response of [html, markdown]) {
        assert.equal(response.status, 200);
        assert.match(response.headers.etag ?? "", /^(?:W\/)?"[^"]+"$/);
      }
      assert.notEqual(
        html.headers.etag,
        markdown.headers.etag,
        "Representations need distinct validators",
      );

      for (const [accept, original] of [
        ["text/html", html],
        ["text/markdown", markdown],
      ]) {
        for (const method of ["GET", "HEAD"]) {
          const cached = await request(route, {
            accept,
            method,
            headers: { "If-None-Match": original.headers.etag },
          });
          assert.equal(cached.status, 304, `${route}, ${accept}, ${method}`);
          assert.equal(cached.body.length, 0);
          assert.equal(cached.headers.etag, original.headers.etag);
          assertVaryAccept(cached);
        }
      }

      for (const [accept, other, extension] of [
        ["text/markdown", html, "md"],
        ["text/html", markdown, "html"],
      ]) {
        const uncached = await request(route, {
          accept,
          headers: { "If-None-Match": other.headers.etag },
        });
        assertRepresentation(
          uncached,
          extension,
          exportedFiles.get(pageFile(route, extension)),
          route,
        );
      }
    });
  }
});

test("the factory's default publicDir serves the generated production output", async () => {
  const listener = await listen(createStaticApp());
  try {
    const response = await request("/", { listener, accept: "text/markdown" });
    assertRepresentation(
      response,
      "md",
      exportedFiles.get("index.md"),
      "default publicDir",
    );
  } finally {
    await close(listener);
  }
});

test("startup fails explicitly when either root representation is missing", async () => {
  const temporary = await mkdtemp(join(tmpdir(), "shopstr-static-startup-"));
  try {
    for (const file of ["index.html", "index.md"]) {
      const publicDir = join(
        temporary,
        file === "index.html" ? "missing-html" : "missing-markdown",
      );
      await cp(PUBLIC_DIR, publicDir, { recursive: true });
      await rm(join(publicDir, file));
      assert.throws(
        () => createStaticApp({ publicDir }),
        (error) => {
          assert.ok(error instanceof Error);
          assert.match(
            error.message,
            /index\.(?:html|md)|build|missing|static/i,
            "Startup failure must explain the missing build output",
          );
          return true;
        },
        `Missing ${file} must prevent startup`,
      );
    }
    assert.throws(() =>
      createStaticApp({ publicDir: join(temporary, "does-not-exist") }),
    );
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test("arbitrary dotfiles, traversal and application sources cannot be exposed", async () => {
  const temporary = await mkdtemp(join(tmpdir(), "shopstr-static-security-"));
  let listener;
  const marker = "STATIC_SERVER_TEST_PRIVATE_FILE_MUST_NOT_BE_SERVED";
  try {
    const publicDir = join(temporary, "public");
    await cp(PUBLIC_DIR, publicDir, { recursive: true });
    await mkdir(join(publicDir, ".git"), { recursive: true });
    await mkdir(join(publicDir, "assets", ".private"), { recursive: true });
    for (const file of [
      ".env",
      ".hidden",
      ".git/config",
      "about/.env",
      "assets/.private/token",
      ".well-known/.env",
      ".well-known/private.json",
    ]) {
      await writeFile(join(publicDir, file), marker);
    }
    await writeFile(join(temporary, "outside-secret.txt"), marker);
    listener = await listen(createStaticApp({ publicDir }));

    const blockedPaths = [
      "/.env",
      "/%2eenv",
      "/.hidden",
      "/.git/config",
      "/about/.env",
      "/assets/.private/token",
      "/.well-known/.env",
      "/.well-known/private.json",
      "/../outside-secret.txt",
      "/%2e%2e/outside-secret.txt",
      "/..%2foutside-secret.txt",
      "/%2e%2e%2foutside-secret.txt",
      "/about/../../outside-secret.txt",
      "/assets/..%2f..%2foutside-secret.txt",
      "/%5c..%5coutside-secret.txt",
      "/..%252foutside-secret.txt",
      "/%00",
      "/.env%00",
      "/server/static-app.mjs",
      "/server/index.ts",
      "/client/src/main.tsx",
      "/package.json",
      "/vite.config.ts",
      "/scripts/generate-static-html.mjs",
    ];
    for (const path of blockedPaths) {
      for (const accept of ["text/html", "text/markdown"]) {
        const response = await request(path, { listener, accept });
        assert.ok(
          [400, 403, 404].includes(response.status),
          `${path} should be blocked, got ${response.status}`,
        );
        assert.ok(
          !response.text.includes(marker),
          `${path} exposed private file content`,
        );
        assert.doesNotMatch(
          response.text,
          /export\s+(?:function|const)|import\s+.*\s+from\s+["']/,
          `${path} exposed application source`,
        );
      }
    }
    const nostr = await request("/.well-known/nostr.json", {
      listener,
      accept: "text/markdown",
    });
    assert.equal(
      nostr.status,
      200,
      "Blocking dotfiles must not block the public Nostr exception",
    );
    assert.equal(nostr.headers["access-control-allow-origin"], "*");
    assert.deepEqual(nostr.body, exportedFiles.get(".well-known/nostr.json"));
  } finally {
    await close(listener);
    await rm(temporary, { recursive: true, force: true });
  }
});
