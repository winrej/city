/**
 * BreadcrumbJsonLd — injects a Google-compliant BreadcrumbList JSON-LD
 * structured data block as a <script> tag.
 *
 * Usage:
 *   <BreadcrumbJsonLd items={[
 *     { name: "Home", href: "/" },
 *     { name: "Guides", href: "/guides" },
 *     { name: "How to Buy a Condo in Manila" },  // no href = current page
 *   ]} />
 *
 * Google spec: https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
 */

const BASE_URL = "https://cityqlo.com";

export type BreadcrumbItem = {
  /** Display label for this crumb */
  name: string;
  /**
   * Relative path (e.g. "/guides") or full URL.
   * Omit for the current/last page — Google still recommends including it.
   */
  href?: string;
};

type Props = {
  items: BreadcrumbItem[];
};

export function BreadcrumbJsonLd({ items }: Props) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      // Always include an absolute URL — even for the current page
      "item": item.href
        ? item.href.startsWith("http")
          ? item.href
          : `${BASE_URL}${item.href}`
        : undefined,
    })).filter((el) =>
      // Remove undefined item keys cleanly
      el.item !== undefined || true
    ).map((el) =>
      el.item === undefined ? { "@type": el["@type"], position: el.position, name: el.name } : el
    ),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
