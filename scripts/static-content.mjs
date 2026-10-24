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
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1];
  const content = main ?? html.replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi, "");
  const clean = content
    .replace(/<(footer|script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<\/a>\s*(?=<a\b)/gi, "</a> ")
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
