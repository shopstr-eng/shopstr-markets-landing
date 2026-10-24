import test from "node:test";
import assert from "node:assert/strict";
import { escapeHtml, pageToMarkdown } from "../scripts/static-content.mjs";

const BASE_URL = "https://shopstrmarkets.com";
test("escapeHtml escapes all HTML-sensitive characters without losing text", () => {
  assert.equal(escapeHtml(`&<>"'`), "&amp;&lt;&gt;&quot;&#39;");
  assert.equal(escapeHtml("Nostr — Bitcoin"), "Nostr — Bitcoin");
  assert.equal(escapeHtml(123), "123");
});

test("pageToMarkdown converts all heading levels, inline text, lists and line breaks", () => {
  const headings = Array.from(
    { length: 6 },
    (_, index) =>
      `<h${index + 1} class="heading">Level <strong>${index + 1}</strong></h${index + 1}>`,
  ).join("\n");
  const markdown = pageToMarkdown(
    `<main>${headings}<p>First<br />Second</p><ul><li>One</li><li>Two</li></ul></main>`,
    `${BASE_URL}/faq`,
  );
  for (let depth = 1; depth <= 6; depth++) {
    assert.ok(
      markdown.split("\n").includes(`${"#".repeat(depth)} Level ${depth}`),
    );
  }
  assert.ok(markdown.includes("First\nSecond"));
  assert.ok(markdown.includes("- One"));
  assert.ok(markdown.includes("- Two"));
  assert.doesNotMatch(markdown, /<\/?[a-z][^>]*>/i);
  assert.doesNotMatch(markdown, /\n{3,}/);
  assert.ok(
    markdown.endsWith(
      `Source: ${BASE_URL}/faq\n\n[Agent guidance](${BASE_URL}/llms.txt)\n`,
    ),
  );
});

test("pageToMarkdown resolves relative, root, fragment and protocol-relative links absolutely", () => {
  const markdown = pageToMarkdown(
    `
    <p><a href="/faq"><strong>FAQ</strong></a>
    <a href="details">Details</a>
    <a href="../contact">Contact</a>
    <a href="#payments">Payments</a>
    <a href="//github.com/shopstr-eng">GitHub</a>
    <a href="https://shopstr.market">Shopstr</a>
    <a href="mailto:biz@shopstrmarkets.com">Email</a>
    <a href="tel:+12062909736">Phone</a></p>
  `,
    `${BASE_URL}/about/`,
  );
  for (const link of [
    `[FAQ](${BASE_URL}/faq)`,
    `[Details](${BASE_URL}/about/details)`,
    `[Contact](${BASE_URL}/contact)`,
    `[Payments](${BASE_URL}/about/#payments)`,
    "[GitHub](https://github.com/shopstr-eng)",
    "[Shopstr](https://shopstr.market/)",
    "[Email](mailto:biz@shopstrmarkets.com)",
    "[Phone](tel:+12062909736)",
  ])
    assert.ok(markdown.includes(link), `Missing Markdown link: ${link}`);
  assert.doesNotMatch(markdown, /<a\b|<\/a>|<strong>/i);
});

test("pageToMarkdown decodes named, decimal and hex entities in text and links", () => {
  const markdown = pageToMarkdown(
    `
    <h1>Bitcoin &amp; Nostr</h1>
    <p>&lt;literal&gt; &quot;quoted&quot; &apos;apostrophe&apos; &#39;decimal&#39;
    &#x1F680; &nbsp; &copy; &mdash; &ndash;</p>
    <a href="/faq?one=1&amp;two=2">Help &amp; answers &#x26;</a>
  `,
    `${BASE_URL}/about`,
  );
  assert.ok(markdown.includes("# Bitcoin & Nostr"));
  assert.ok(markdown.includes(`<literal> "quoted" 'apostrophe' 'decimal'`));
  assert.ok(markdown.includes("🚀"));
  assert.ok(markdown.includes("© — –"));
  assert.ok(
    markdown.includes(`[Help & answers &](${BASE_URL}/faq?one=1&two=2)`),
  );
  assert.doesNotMatch(
    markdown,
    /&(?:amp|lt|gt|quot|apos|nbsp|copy|mdash|ndash|#39|#x1F680);/,
  );
});

test("pageToMarkdown excludes navigation, footer, scripts and styles, not main content links", () => {
  const markdown = pageToMarkdown(
    `
    <NAV class="site-nav"><h1>Navigation-only title</h1><a href="/nav-only">Nav-only link</a></NAV>
    <script type="application/ld+json">{"name":"Script-only data"}</script>
    <style>.style-only-marker { color: red; }</style>
    <main><h1>Page content</h1><p>Readable prose.</p><a href="/contact">Contact</a></main>
    <footer><h2>Footer-only heading</h2><a href="/footer-only">Footer-only link</a></footer>
  `,
    `${BASE_URL}/about`,
  );
  assert.ok(markdown.startsWith("# Page content\n"));
  assert.ok(markdown.includes("Readable prose."));
  assert.ok(markdown.includes(`[Contact](${BASE_URL}/contact)`));
  for (const marker of [
    "Navigation-only",
    "Nav-only",
    "nav-only",
    "Script-only",
    "style-only",
    "Footer-only",
    "footer-only",
  ]) {
    assert.ok(
      !markdown.includes(marker),
      `Leaked chrome or executable content: ${marker}`,
    );
  }
});

test("pageToMarkdown retains related navigation inside main but excludes site chrome", () => {
  const markdown = pageToMarkdown(
    '<nav><a href="/chrome">Chrome</a></nav><main><h1>Page</h1><nav aria-label="Related resources"><a href="/faq">FAQ</a><a href="/privacy">Privacy Policy</a></nav></main><footer>Footer text</footer>',
    `${BASE_URL}/about`,
  );
  assert.ok(markdown.includes(`[FAQ](${BASE_URL}/faq)`));
  assert.ok(markdown.includes(`[Privacy Policy](${BASE_URL}/privacy)`));
  assert.doesNotMatch(markdown, /Chrome|Footer text/);
});

test("pageToMarkdown separates adjacent links without spacing away punctuation", () => {
  const markdown = pageToMarkdown(
    '<main><h1>Page</h1><p><a href="/start">Start</a><a href="/learn">Learn</a>.</p></main>',
    `${BASE_URL}/`,
  );
  assert.ok(
    markdown.includes(`[Start](${BASE_URL}/start) [Learn](${BASE_URL}/learn).`),
  );
});
