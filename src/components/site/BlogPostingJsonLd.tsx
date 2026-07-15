/**
 * BlogPostingJsonLd — injects a Google-compliant BlogPosting/Article JSON-LD
 * <script> block for guides to boost SEO in search/discover interfaces.
 *
 * Google spec: https://developers.google.com/search/docs/appearance/structured-data/article
 */

type Props = {
  headline: string;
  excerpt?: string | null;
  coverImageUrl?: string | null;
  datePublished?: string | null;
  dateModified?: string | null;
  authorName?: string | null;
  url: string;
  wordCount?: number;
  articleSection?: string;
};

export function BlogPostingJsonLd({
  headline,
  excerpt,
  coverImageUrl,
  datePublished,
  dateModified,
  authorName = "CityQlo Editorial Team",
  url,
  wordCount,
  articleSection = "Real Estate",
}: Props) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    headline: headline,
    description: excerpt || undefined,
    image: coverImageUrl ? [coverImageUrl] : undefined,
    datePublished: datePublished || undefined,
    dateModified: dateModified || datePublished || undefined,
    author: {
      "@type": "Organization",
      name: authorName || "CityQlo Team",
      url: "https://cityqlo.com",
    },
    publisher: {
      "@type": "Organization",
      name: "CityQlo",
      logo: {
        "@type": "ImageObject",
        url: "https://cityqlo.com/Logo.png",
      },
    },
    wordCount: wordCount || undefined,
    articleSection: articleSection,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
