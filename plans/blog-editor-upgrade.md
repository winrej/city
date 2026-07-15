# CityQlo Blog Editor Upgrade — Implementation Plan

Path chosen: **Keep Markdown** (add toolbar + shortcodes, no WYSIWYG rewrite).
Sequencing: **phased, quick wins first**. Scheduled publishing: **out of scope**.

## Foundation (prereq for everything)

Extract the two duplicated Markdown renderers — `mdToHtml` (`src/routes/portal/blogs.$id.tsx:27`)
and `markdownToHtml` (`src/routes/guides.$slug.tsx:122`) — into a single shared module
`src/lib/markdown.ts`. Reader keeps heading IDs + link-target rules; that becomes the canonical
version. Both editor preview and public reader import it. This guarantees the editor preview
matches the live page and gives one place to add shortcodes.

---

## Batch 1 — Quick wins (client-side, no DB)

1. **Editor toolbar** above the textarea: bold, italic, H2/H3, link, list, quote, code, table,
   image. Buttons wrap/insert Markdown at the cursor in `#blog-content-textarea`.
2. **Live SEO score panel** (new sidebar card, `src/components/blog/SeoScore.tsx`): checks title
   length (50–60), meta/excerpt length (120–160), single H1, heading order, slug length,
   keyword presence, image alt coverage, internal-link count. Weighted 0–100 with pass/warn/fail rows.
3. **Readability panel** (`src/components/blog/Readability.tsx`): Flesch Reading Ease, avg
   sentence/word length, long-sentence and passive flags. Pure client-side.
4. **BlogPosting JSON-LD** (`src/components/site/BlogPostingJsonLd.tsx`, mirrors existing
   `FaqJsonLd`): emitted from `guides.$slug.tsx` head/body — headline, image, datePublished,
   author, wordCount, articleSection.
5. **Device preview**: wrap the existing preview pane in a Desktop/Tablet/Mobile width toggle
   (constrain max-width; reuse `.prose-cityqlo`).

Review checkpoint.

---

## Batch 2 — Shortcodes, uploads, links (mostly client-side)

6. **Property card shortcode** `::property[slug]::`: shared renderer replaces it with a styled
   card. Editor preview + reader fetch properties via `getPublicProperties`; renderer takes an
   optional `properties` map. Toolbar "Insert property" button lists DB properties to pick from.
   Unknown slug → subtle inline placeholder.
7. **Drag-and-drop image upload**: drop onto the textarea → unsigned upload to Cloudinary
   (`cloud_name: dcnohpztl`) → insert `![alt](url)` at cursor. WebP handled by `f_auto` on
   delivery. **Prereq:** create an unsigned upload preset in Cloudinary (I'll tell you the exact
   settings; you add it in the dashboard).
8. **Responsive comparison tables**: already render via GFM. Add a toolbar "Insert table"
   snippet + confirm the shared renderer wraps tables for horizontal scroll on mobile.
9. **Internal link suggestions** (`src/components/blog/LinkSuggestions.tsx`): build a target list
   from projects/guides/known static routes, keyword-match against content, offer one-click
   insert of `[text](/path)`. Feeds the SEO panel's internal-link count.

Review checkpoint.

---

## Batch 3 — Version history (needs DB migration)

10. **Version history**: new `db/schema/add_blog_revisions.sql` — `blog_revisions` table
    (blog_id, title, content, excerpt, snapshot metadata, created_at, author) with RLS mirroring
    `blogs`. Snapshot on each explicit save/publish (not on every autosave). Sidebar "History"
    panel lists revisions with timestamp + diff summary and a Restore action. Server fns added to
    `admin.functions.ts`.

---

## Already present (no work needed)

Auto-save · reading-time estimate · slug generator · draft/publish workflow ·
FAQ schema generation (`extractFaqs` + `FaqJsonLd`) · Cloudinary media library.

## Out of scope this round

Scheduled publishing (dropped per decision).

## Risks / notes

- Shared-renderer extraction changes the public reader — verify existing guide renders
  identically (headings, tables, links) before moving on.
- Drag-drop upload blocked until the Cloudinary unsigned preset exists.
- Everything except Batch 3 needs no migration and is independently shippable.
