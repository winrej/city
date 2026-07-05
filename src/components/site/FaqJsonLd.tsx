/**
 * FaqJsonLd — injects a Google-compliant FAQPage JSON-LD <script> block so a
 * guide's FAQ section becomes eligible for FAQ rich results in search.
 *
 * Usage:
 *   <FaqJsonLd items={[
 *     { question: "Can foreigners buy a condo?", answer: "Yes, within the 40% limit." },
 *   ]} />
 *
 * Pairs are usually produced by extractFaqs() (see below), which pulls them
 * straight out of the post's Markdown so authors don't maintain a second copy.
 *
 * Google spec: https://developers.google.com/search/docs/appearance/structured-data/faqpage
 */

export type FaqItem = {
  question: string;
  answer: string;
};

type Props = {
  items: FaqItem[];
};

export function FaqJsonLd({ items }: Props) {
  if (!items || items.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * extractFaqs — parse Q&A pairs out of a guide's Markdown.
 *
 * Convention (matches the SEO buyer's guide): an H2 whose text contains
 * "frequently asked questions" (case-insensitive), followed by one or more
 * H3 questions, each trailed by the answer text up to the next heading.
 *
 * Returns [] when the post has no recognizable FAQ section, so callers can
 * conditionally render <FaqJsonLd> without extra guards.
 */
export function extractFaqs(markdown: string): FaqItem[] {
  if (!markdown) return [];

  const lines = markdown.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");

  // Locate the FAQ H2 section and its bounds (until the next H2 or end).
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    const m = /^##\s+(.+)$/.exec(lines[i]);
    if (m && /frequently asked questions|faqs?\b/i.test(m[1])) {
      start = i + 1;
      break;
    }
  }
  if (start === -1) return [];

  let end = lines.length;
  for (let i = start; i < lines.length; i++) {
    if (/^##\s+/.test(lines[i]) && !/^###/.test(lines[i])) {
      end = i;
      break;
    }
  }

  const faqs: FaqItem[] = [];
  let question: string | null = null;
  let answer: string[] = [];

  const flush = () => {
    if (question) {
      const text = answer.join(" ").trim();
      if (text) faqs.push({ question: question.trim(), answer: stripInline(text) });
    }
    question = null;
    answer = [];
  };

  for (let i = start; i < end; i++) {
    const line = lines[i];
    const h3 = /^###\s+(.+)$/.exec(line);
    if (h3) {
      flush();
      question = stripInline(h3[1]);
    } else if (question) {
      if (line.trim() === "" || /^---+$/.test(line.trim())) continue;
      answer.push(line.trim());
    }
  }
  flush();

  return faqs;
}

// Strip the small subset of Markdown/HTML that could appear inline in a
// question or answer, leaving clean plain text for the structured data.
function stripInline(s: string): string {
  return s
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links → text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
