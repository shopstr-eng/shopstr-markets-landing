import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  renameSync,
  rmdirSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { escapeHtml, pageToMarkdown } from "./static-content.mjs";
import {
  routes,
  renderRoute,
  pageSource,
} from "../dist/prerender/entry-server.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, "../dist/public");
const BASE_URL = "https://shopstrmarkets.com";
const manifestPath = join(distDir, ".vite/manifest.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
renameSync(manifestPath, join(distDir, "../client-manifest.json"));
rmdirSync(join(distDir, ".vite"));

const baseHtml = readFileSync(join(distDir, "index.html"), "utf-8");

for (const route of routes) {
  const outDir = route.path === "/" ? "" : route.path.slice(1);
  const canonicalUrl = `${BASE_URL}${route.canonicalPath ?? route.path}`;
  const { html: bodyContent } = await renderRoute(route.path);
  for (const match of bodyContent.matchAll(
    /(?:src|href)="(\/assets\/[^"#?]+)"/g,
  )) {
    if (!existsSync(join(distDir, match[1])))
      throw new Error(`Missing rendered asset: ${match[1]}`);
  }

  let html = baseHtml;
  const preloads = new Set();
  const styles = new Set();
  function collect(key) {
    const chunk = manifest[key];
    if (!chunk) throw new Error(`Missing client manifest entry: ${key}`);
    if (preloads.has(chunk.file)) return;
    if (!existsSync(join(distDir, chunk.file)))
      throw new Error(`Missing client asset: ${chunk.file}`);
    preloads.add(chunk.file);
    for (const file of chunk.css ?? []) {
      if (!existsSync(join(distDir, file)))
        throw new Error(`Missing stylesheet: ${file}`);
      styles.add(file);
    }
    for (const dependency of chunk.imports ?? []) collect(dependency);
  }
  const pageEntry = manifest[pageSource(route.page)];
  if (!pageEntry) throw new Error(`Missing page entry: ${route.page}`);
  collect(pageSource(route.page));
  const links = [
    ...[...preloads].map(
      (file) => `<link rel="modulepreload" crossorigin href="/${file}" />`,
    ),
    ...[...styles].map(
      (file) => `<link rel="stylesheet" crossorigin href="/${file}" />`,
    ),
  ];
  html = html.replace("</head>", `${links.join("\n")}\n</head>`);
  const markdownPath = `${route.path === "/" ? "" : route.path}/index.md`;
  html = html.replace(
    /<link rel="alternate" type="text\/markdown" href="[^"]*" \/>/,
    `<link rel="alternate" type="text/markdown" href="${markdownPath}" />`,
  );
  const pageSchema = {
    "@context": "https://schema.org",
    "@type":
      route.path === "/about"
        ? "AboutPage"
        : route.path === "/contact"
          ? "ContactPage"
          : "WebPage",
    "@id": `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: route.title,
    description: route.description,
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: { "@id": `${BASE_URL}/#organization` },
  };
  html = html.replace(
    "</head>",
    `<script type="application/ld+json">${JSON.stringify(pageSchema).replace(/</g, "\\u003c")}</script>\n</head>`,
  );

  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${escapeHtml(route.title)}</title>`,
  );

  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
    `<meta name="description" content="${escapeHtml(route.description)}" />`,
  );

  if (html.includes('<link rel="canonical"')) {
    html = html.replace(
      /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/,
      `<link rel="canonical" href="${canonicalUrl}" />`,
    );
  } else {
    html = html.replace(
      '<link rel="icon"',
      `<link rel="canonical" href="${canonicalUrl}" />\n    <link rel="icon"`,
    );
  }

  html = html.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:url" content="${canonicalUrl}" />`,
  );

  html = html.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${escapeHtml(route.ogTitle)}" />`,
  );

  html = html.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${escapeHtml(route.ogDescription)}" />`,
  );

  html = html.replace(
    /<meta\s+name="twitter:url"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:url" content="${canonicalUrl}" />`,
  );

  html = html.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:title" content="${escapeHtml(route.ogTitle)}" />`,
  );

  html = html.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:description" content="${escapeHtml(route.ogDescription)}" />`,
  );

  html = html.replace(
    '<div id="root"></div>',
    `<div id="root">${bodyContent}</div>`,
  );

  const outPath =
    outDir === ""
      ? join(distDir, "index.html")
      : join(distDir, outDir, "index.html");

  if (outDir !== "") {
    mkdirSync(join(distDir, outDir), { recursive: true });
  }

  writeFileSync(outPath, html, "utf-8");
  writeFileSync(
    join(dirname(outPath), "index.md"),
    pageToMarkdown(bodyContent, canonicalUrl).replace(/^[\s\S]*?(?=^# )/m, ""),
    "utf-8",
  );
  console.log(`Generated: ${outPath}`);
}

console.log("Static HTML prerender complete.");
