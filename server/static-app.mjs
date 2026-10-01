import express from "express";
import { existsSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const defaultPublicDir = fileURLToPath(
  new URL("../dist/public/", import.meta.url),
);

// Only pre-rendered pages with both representations participate in negotiation.
// The map avoids a user-controlled path being used to read an arbitrary file.
function discoverPages(root) {
  const pages = new Map();
  function visit(directory, url = "") {
    const html = join(directory, "index.html");
    const markdown = join(directory, "index.md");
    if (existsSync(html)) {
      if (!existsSync(markdown))
        throw new Error(`Missing Markdown export: ${markdown}`);
      const page = { html, markdown };
      pages.set(url || "/", page);
      pages.set(`${url}/`, page);
      pages.set(`${url}/index.html`, page);
    }
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (entry.isDirectory() && !entry.name.startsWith(".")) {
        visit(join(directory, entry.name), `${url}/${entry.name}`);
      }
    }
  }
  visit(root);
  return pages;
}

function sendError(req, res, status, title, description) {
  res.vary("Accept").set("Cache-Control", "no-store");
  if (req.accepts(["html", "text/markdown"]) === "text/markdown") {
    return res
      .status(status)
      .type("text/markdown")
      .send(
        `# ${status} — ${title}\n\n${description}\n\n` +
          "[Agent guidance](/llms.txt) · [Sitemap](/sitemap.xml) · [Homepage](/)\n",
      );
  }
  return res
    .status(status)
    .type("html")
    .send(
      `<!doctype html><html lang="en"><head><meta charset="utf-8">` +
        `<meta name="viewport" content="width=device-width,initial-scale=1">` +
        `<title>${status} — ${title} | Shopstr Markets</title></head>` +
        `<body style="font:18px system-ui;max-width:48rem;margin:10vh auto;padding:2rem">` +
        `<h1>${status} — ${title}</h1><p>${description}</p>` +
        `<nav><a href="/">Homepage</a> · <a href="/llms.txt">Agent guidance</a> · ` +
        `<a href="/sitemap.xml">Sitemap</a></nav></body></html>`,
    );
}

export function createStaticApp({ publicDir = defaultPublicDir } = {}) {
  const root = resolve(publicDir);
  if (
    !existsSync(join(root, "index.html")) ||
    !existsSync(join(root, "index.md"))
  ) {
    throw new Error(
      "Static export missing. Run npm run build:static before starting the server.",
    );
  }
  const pages = discoverPages(root);
  const app = express();
  app.disable("x-powered-by");
  app.set("case sensitive routing", true);
  app.use((_req, res, next) => {
    res.set("X-Content-Type-Options", "nosniff");
    next();
  });

  // Explicitly expose only this well-known file, never arbitrary dotfiles.
  app.options("/.well-known/nostr.json", (_req, res) => {
    res
      .set({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
        "Access-Control-Max-Age": "86400",
      })
      .sendStatus(204);
  });
  app.use((req, res, next) => {
    if (req.method === "GET" || req.method === "HEAD") return next();
    res.set("Allow", "GET, HEAD");
    return sendError(
      req,
      res,
      405,
      "Method not allowed",
      "This informational website supports read-only GET and HEAD requests.",
    );
  });
  app.get("/.well-known/nostr.json", (_req, res, next) => {
    res.set("Access-Control-Allow-Origin", "*").type("application/json");
    res.sendFile(
      join(root, ".well-known", "nostr.json"),
      { dotfiles: "allow" },
      (error) => {
        if (error) next(error);
      },
    );
  });

  app.use((req, res, next) => {
    let pathname;
    try {
      pathname = decodeURIComponent(req.path);
    } catch {
      return sendError(
        req,
        res,
        400,
        "Bad request",
        "The requested URL is not correctly encoded.",
      );
    }
    const page = pages.get(pathname);
    if (!page) return next();
    res.vary("Accept");
    // Express's Accept parser respects specificity, q weights, and exclusions.
    // Put HTML first for absent/wildcard headers; explicit ties respect client order.
    const representation = req.accepts(["html", "text/markdown"]);
    if (!representation) {
      return res
        .status(406)
        .set("Cache-Control", "no-store")
        .type("text/plain")
        .send(
          "Supported representations: text/html and text/markdown. See /llms.txt for explicit Markdown links.\n",
        );
    }
    res.type(representation === "text/markdown" ? "text/markdown" : "html");
    res.sendFile(
      representation === "text/markdown" ? page.markdown : page.html,
      (error) => {
        if (error) next(error);
      },
    );
  });

  app.use(
    express.static(root, {
      index: false,
      redirect: false,
      dotfiles: "ignore",
      setHeaders(res, path) {
        // Explicit Markdown URLs are always Markdown, independent of Accept.
        if (path.endsWith(".md"))
          res.setHeader("Content-Type", "text/markdown; charset=utf-8");
      },
    }),
  );
  app.use((req, res) =>
    sendError(
      req,
      res,
      404,
      "Page not found",
      "The requested page or file does not exist. Use the links below to find available pages and agent documentation.",
    ),
  );
  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    const status =
      error.status === 404 ? 404 : error.status === 400 ? 400 : 500;
    if (status === 500) console.error("Static server error:", error.message);
    sendError(
      req,
      res,
      status,
      status === 404
        ? "Page not found"
        : status === 400
          ? "Bad request"
          : "Server error",
      status === 404
        ? "The requested page or file does not exist. Consult the sitemap or agent documentation."
        : "The request could not be completed. Please check the URL or try again later.",
    );
  });
  return app;
}
