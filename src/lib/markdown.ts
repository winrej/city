/**
 * src/lib/markdown.ts — Shared Markdown → HTML renderer
 *
 * Single source of truth used by:
 *   - The public guide reader  (`guides.$slug.tsx`)
 *   - The blog editor preview  (`portal/blogs.$id.tsx`)
 *   - The property shortcode renderer
 *
 * Features
 *   • Heading IDs (slugified) so TOC anchor links work in the reader
 *   • External links → target="_blank" rel="noopener noreferrer"
 *   • Internal links (/, #) → same tab
 *   • GFM tables wrapped in <div class="table-scroll"> for mobile
 *   • ::property[slug]:: shortcode → replaced via optional properties map
 *
 * Keep this renderer dependency-free (no marked, no remark) so it can run
 * on both client and server without bundle bloat.
 */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Slugify heading text for anchor IDs */
function slugifyId(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

// ---------------------------------------------------------------------------
// Property shortcode
// ---------------------------------------------------------------------------

export type PropertyStub = {
  id: string;
  slug: string;
  name: string;
  location?: string | null;
  cover_image_url?: string | null;
  price_from?: string | null;
};

/**
 * Replace `::property[slug]::` shortcodes.
 *
 * If `properties` map is provided and contains the slug, renders a styled
 * inline card. Otherwise renders a muted inline placeholder so the editor
 * gives feedback without crashing.
 */
function resolvePropertyShortcodes(html: string, properties?: Map<string, PropertyStub>): string {
  return html.replace(/::property\[([^\]]+)\]::/g, (_match, slug: string) => {
    const prop = properties?.get(slug);
    if (!prop) {
      return `<span class="property-shortcode-placeholder" title="Property '${slug}' not found">📍 ${slug}</span>`;
    }
    const img = prop.cover_image_url
      ? `<img src="${prop.cover_image_url}" alt="${prop.name}" class="property-card-img" loading="lazy" />`
      : "";
    const location = prop.location
      ? `<span class="property-card-location">${prop.location}</span>`
      : "";
    const price = prop.price_from
      ? `<span class="property-card-price">From ${prop.price_from}</span>`
      : "";
    return `<a href="/properties" class="property-shortcode-card" aria-label="${prop.name}">
  ${img}
  <span class="property-card-body">
    <span class="property-card-name">${prop.name}</span>
    ${location}
    ${price}
  </span>
</a>`;
  });
}

// ---------------------------------------------------------------------------
// Core renderer
// ---------------------------------------------------------------------------

export type MarkdownOptions = {
  /** Map of slug → PropertyStub used to expand ::property[slug]:: shortcodes */
  properties?: Map<string, PropertyStub>;
};

/**
 * Convert a Markdown string to an HTML string.
 *
 * @param md  Raw Markdown content
 * @param opts Optional render options (e.g. property map for shortcodes)
 */
export function markdownToHtml(md: string, opts?: MarkdownOptions): string {
  if (!md) return "";

  // ── 1. Normalise line endings ──────────────────────────────────────────
  let html = md.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // ── 2. Property shortcodes (pre-escape so slugs survive &amp; etc.) ────
  // Replace ::property[slug]:: with a unique placeholder token first so the
  // slug text doesn't get mangled by HTML escaping. We substitute back later.
  const shortcodePlaceholders = new Map<string, string>();
  html = html.replace(/::property\[([^\]]+)\]::/g, (_match, slug: string) => {
    const token = `PROPCARDTOKEN_${shortcodePlaceholders.size}_END`;
    shortcodePlaceholders.set(token, slug);
    return token;
  });

  // ── 3. Escape HTML ─────────────────────────────────────────────────────
  html = html
    .replace(/&/g, "&amp;")
    // Preserve allowed inline tags (b, i, em, strong, code, a, br)
    .replace(/<(?!\/?(br|b|i|em|strong|code|a)\b)/g, "&lt;");

  // ── 4. Block-level elements ────────────────────────────────────────────
  html = html
    // Headings with IDs
    .replace(/^###### (.+)$/gm, (_, t) => `<h6 id="${slugifyId(t)}">${t}</h6>`)
    .replace(/^##### (.+)$/gm, (_, t) => `<h5 id="${slugifyId(t)}">${t}</h5>`)
    .replace(/^#### (.+)$/gm, (_, t) => `<h4 id="${slugifyId(t)}">${t}</h4>`)
    .replace(/^### (.+)$/gm, (_, t) => `<h3 id="${slugifyId(t)}">${t}</h3>`)
    .replace(/^## (.+)$/gm, (_, t) => `<h2 id="${slugifyId(t)}">${t}</h2>`)
    .replace(/^# (.+)$/gm, (_, t) => `<h1 id="${slugifyId(t)}">${t}</h1>`)
    // Blockquote — accept both literal > and HTML-escaped &gt;
    .replace(/^(?:&gt;|>) (.+)$/gm, "<blockquote>$1</blockquote>")
    // Horizontal rule
    .replace(/^---$/gm, "<hr />")
    // Unordered list items
    .replace(/^[-*] (.+)$/gm, "<li>$1</li>")
    // Ordered list items
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>");

  // ── 5. Code blocks (must run before inline code) ──────────────────────
  html = html.replace(/```[\w]*\n?([\s\S]*?)```/gm, "<pre><code>$1</code></pre>");

  // ── 6. Inline elements ─────────────────────────────────────────────────
  html = html
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/__(.+?)__/g, "<strong>$1</strong>")
    .replace(/_(.+?)_/g, "<em>$1</em>")
    // Links — internal (/, #) same tab; external new tab
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m: string, text: string, href: string) =>
      /^(\/|#)/.test(href)
        ? `<a href="${href}">${text}</a>`
        : `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`,
    )
    // Images
    .replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      (_m, alt: string, src: string) =>
        `<img src="${src}" alt="${alt}" class="md-img" loading="lazy" />`,
    );

  // ── 7. GFM tables → <table> wrapped in scroll container ───────────────
  html = html.replace(/^\|.+\|[ \t]*\n\|[ \t:|-]+\|[ \t]*\n(?:\|.+\|[ \t]*\n?)+/gm, (block) => {
    const lines = block.trim().split("\n");
    const splitRow = (row: string) =>
      row
        .replace(/^\s*\|/, "")
        .replace(/\|\s*$/, "")
        .split("|")
        .map((c) => c.trim());
    const head = splitRow(lines[0])
      .map((c) => `<th>${c}</th>`)
      .join("");
    const body = lines
      .slice(2)
      .map(
        (r) =>
          "<tr>" +
          splitRow(r)
            .map((c) => `<td>${c}</td>`)
            .join("") +
          "</tr>",
      )
      .join("");
    return `<div class="table-scroll"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
  });

  // ── 8. Paragraphs & line breaks ────────────────────────────────────────
  html = html.replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br />");
  html = `<p>${html}</p>`;

  // ── 9. List wrapping ───────────────────────────────────────────────────
  html = html.replace(/(<li>[\s\S]*?<\/li>)/g, (m) => `<ul>${m}</ul>`);

  // ── 10. Strip spurious <p> wrappers around block elements ─────────────
  const BLOCK = ["h[1-6]", "blockquote", "pre", "ul", "hr\\s*\\/", "table", "div"];
  for (const tag of BLOCK) {
    const open = new RegExp(`<p>(<${tag}>)`, "g");
    const close = new RegExp(`(<\\/${tag.replace(/\\s.*/, "")}>)<\\/p>`, "g");
    html = html.replace(open, "$1").replace(close, "$1");
  }
  html = html
    .replace(/<p>\s*<\/p>/g, "")
    .replace(/<br \/>(<(?:h[1-6]|table|div|pre|ul|blockquote|hr))/g, "$1")
    .replace(
      /((?:<\/h[1-6]>|<\/table>|<\/div>|<\/pre>|<\/ul>|<\/blockquote>|<hr\s*\/>))<br \/>/g,
      "$1",
    );

  // ── 11. Restore property shortcode tokens ─────────────────────────────
  for (const [token, slug] of shortcodePlaceholders) {
    const prop = opts?.properties?.get(slug);
    if (!prop) {
      html = html.replace(
        token,
        `<span class="property-shortcode-placeholder" title="Property '${slug}' not found">📍 ${slug}</span>`,
      );
    } else {
      const img = prop.cover_image_url
        ? `<img src="${prop.cover_image_url}" alt="${prop.name}" class="property-card-img" loading="lazy" />`
        : "";
      const location = prop.location
        ? `<span class="property-card-location">${prop.location}</span>`
        : "";
      const price = prop.price_from
        ? `<span class="property-card-price">From ${prop.price_from}</span>`
        : "";
      html = html.replace(
        token,
        `<a href="/properties" class="property-shortcode-card" aria-label="${prop.name}">${img}<span class="property-card-body"><span class="property-card-name">${prop.name}</span>${location}${price}</span></a>`,
      );
    }
  }

  return html;
}

// ---------------------------------------------------------------------------
// Re-export shortcode helper for use in the editor toolbar
// ---------------------------------------------------------------------------
export { resolvePropertyShortcodes };
