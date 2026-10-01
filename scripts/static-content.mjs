// These helpers consume our own trusted page templates, not arbitrary HTML.
export function escapeHtml(value) {
  return String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char],
  );
}

export function renderTrustPage(page, { nav, footer, contact = false }) {
  return `<div style="min-height:100vh;font-family:system-ui,sans-serif;">
    ${nav}
    <main style="max-width:960px;margin:0 auto;padding:8rem 2rem 4rem;">
      <h1 style="font-size:2.5rem;font-weight:900;">${escapeHtml(page.title)}</h1>
      <p style="font-size:1.25rem;color:#4b5563;line-height:1.7;">${escapeHtml(page.description)}</p>
      ${contact ? `<p><a href="mailto:biz@shopstrmarkets.com">biz@shopstrmarkets.com</a> · <a href="tel:+12062909736">+1 (206) 290-9736</a></p>` : ""}
      ${page.sections
        .map(
          (
            section,
          ) => `<section style="margin:2rem 0;padding:2rem;border:2px solid #111;border-radius:0.75rem;box-shadow:6px 6px 0 #000;">
        <h2 style="font-size:1.5rem;font-weight:900;">${escapeHtml(section.title)}</h2>
        ${section.paragraphs.map((text) => `<p style="color:#4b5563;line-height:1.7;">${escapeHtml(text)}</p>`).join("\n")}
      </section>`,
        )
        .join("\n")}
      <section aria-label="Helpful links">
        <h2>Helpful links</h2>
        <ul>
          <li><a href="/faq">FAQ</a></li>
          <li><a href="/privacy">Privacy Policy</a></li>
          <li><a href="/${contact ? "about" : "contact"}">${contact ? "About us" : "Contact us"}</a></li>
          <li><a href="/#marketplaces">Our products</a></li>
          <li><a href="https://njump.me/npub15dc33fyg3cpd9r58vlqge2hh8dy6hkkrjxkhluv2xpyfreqkmsesesyv6e">Official Nostr</a></li>
          <li><a href="https://github.com/shopstr-eng">Official GitHub</a></li>
        </ul>
      </section>
    </main>
    ${footer}
  </div>`;
}

function decodeEntities(text) {
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
  return text.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (entity, code) => {
    if (code.startsWith("#"))
      return String.fromCodePoint(
        parseInt(
          code.slice(code[1].toLowerCase() === "x" ? 2 : 1),
          code[1].toLowerCase() === "x" ? 16 : 10,
        ),
      );
    return named[code] ?? entity;
  });
}

export function pageToMarkdown(html, canonicalUrl) {
  const clean = html
    .replace(/<(nav|footer|script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(
      /<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi,
      (_match, href, label) => {
        const text = label.replace(/<[^>]+>/g, "").trim();
        return `[${text}](${new URL(decodeEntities(href), canonicalUrl).href})`;
      },
    )
    .replace(
      /<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi,
      (_match, depth, text) =>
        `\n\n${"#".repeat(Number(depth))} ${text.replace(/<[^>]+>/g, "").trim()}\n\n`,
    )
    .replace(/<li\b[^>]*>/gi, "\n- ")
    .replace(/<\/(?:p|section|div|ul|ol|article|main)>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");
  return `${decodeEntities(clean).trim()}\n\nSource: ${canonicalUrl}\n\n[Agent guidance](https://shopstrmarkets.com/llms.txt)\n`;
}
