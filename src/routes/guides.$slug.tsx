import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getPublicBlogBySlug } from "@/lib/api/admin.functions";
import { Share2, Link2, Check, Facebook, Linkedin, Send } from "lucide-react";
import { BreadcrumbJsonLd } from "../components/site/BreadcrumbJsonLd";

export const Route = createFileRoute("/guides/$slug")({
  loader: async ({ params }) => {
    try {
      const post = await getPublicBlogBySlug({ data: { slug: params.slug } });
      return { post };
    } catch (err) {
      console.error("Loader error fetching blog by slug:", err);
      return { post: null };
    }
  },
  head: ({ loaderData }: any) => {
    const post = loaderData?.post;
    if (!post) {
      return {
        meta: [
          { title: "Guide — Insights | CityQlo" },
          { name: "description", content: "Editorial property guide and market insights." },
        ],
      };
    }

    const title = `${post.title} — Guides | CityQlo`;
    const description = post.excerpt || "Editorial property guide and market insights.";
    const url = `https://cityqlo.com/guides/${post.slug}`;
    const imageUrl = post.cover_image_url || "https://cityqlo.com/Logo.png";

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:image", content: imageUrl },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: imageUrl },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: BlogPost,
});

function formatDate(iso?: string | null) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(iso));
}

// Lightweight Markdown → HTML renderer (no dependencies)
function markdownToHtml(md: string): string {
  if (!md) return "";
  
  // Helper to slugify heading text for ID
  const slugify = (text: string) => 
    text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

  let html = md
    // Escape HTML tags in content
    .replace(/&/g, "&amp;")
    .replace(/<(?!\/?(br|b|i|em|strong|code|a)\b)/g, "&lt;")
    // Headings with IDs
    .replace(/^###### (.+)$/gm, (_, t) => `<h6 id="${slugify(t)}">${t}</h6>`)
    .replace(/^##### (.+)$/gm, (_, t) => `<h5 id="${slugify(t)}">${t}</h5>`)
    .replace(/^#### (.+)$/gm, (_, t) => `<h4 id="${slugify(t)}">${t}</h4>`)
    .replace(/^### (.+)$/gm, (_, t) => `<h3 id="${slugify(t)}">${t}</h3>`)
    .replace(/^## (.+)$/gm, (_, t) => `<h2 id="${slugify(t)}">${t}</h2>`)
    .replace(/^# (.+)$/gm, (_, t) => `<h1 id="${slugify(t)}">${t}</h1>`)
    // Blockquote (accept literal ">" — it is not escaped above)
    .replace(/^(?:&gt;|>) (.+)$/gm, "<blockquote>$1</blockquote>")
    // Code blocks
    .replace(/```[\w]*\n?([\s\S]*?)```/gm, "<pre><code>$1</code></pre>")
    // Inline code
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    // Bold + Italic
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/__(.+?)__/g, "<strong>$1</strong>")
    .replace(/_(.+?)_/g, "<em>$1</em>")
    // Horizontal rule
    .replace(/^---$/gm, "<hr />")
    // Unordered list items
    .replace(/^[-*] (.+)$/gm, "<li>$1</li>")
    // Ordered list items
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
    // Links — internal (/ or #) open in the same tab; external open in a new tab
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m: string, text: string, href: string) =>
      /^(\/|#)/.test(href)
        ? `<a href="${href}">${text}</a>`
        : `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`,
    );

  // GFM tables → <table> (must run before paragraph/line-break processing,
  // while table rows still occupy their own newline-separated lines)
  html = html.replace(
    /^\|.+\|[ \t]*\n\|[ \t:|-]+\|[ \t]*\n(?:\|.+\|[ \t]*\n?)+/gm,
    (block) => {
      const lines = block.trim().split("\n");
      const splitRow = (row: string) =>
        row
          .replace(/^\s*\|/, "")
          .replace(/\|\s*$/, "")
          .split("|")
          .map((c) => c.trim());
      const head = splitRow(lines[0]).map((c) => `<th>${c}</th>`).join("");
      const body = lines
        .slice(2)
        .map((r) => "<tr>" + splitRow(r).map((c) => `<td>${c}</td>`).join("") + "</tr>")
        .join("");
      return `<table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
    },
  );

  html = html
    // Line breaks / paragraphs
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br />");

  // Wrap loose text in paragraphs
  html = `<p>${html}</p>`;

  // Wrap consecutive <li> items
  html = html
    .replace(/(<li>[\s\S]*?<\/li>)(?=\s*<li>)/g, "$1")
    .replace(/(<li>[\s\S]*?<\/li>)/g, (match) => `<ul>${match}</ul>`);

  // Clean up empty paragraphs
  html = html
    .replace(/<p>\s*<\/p>/g, "")
    .replace(/<p>(<h[1-6]>)/g, "$1")
    .replace(/(<\/h[1-6]>)<\/p>/g, "$1")
    .replace(/<p>(<blockquote>)/g, "$1")
    .replace(/(<\/blockquote>)<\/p>/g, "$1")
    .replace(/<p>(<pre>)/g, "$1")
    .replace(/(<\/pre>)<\/p>/g, "$1")
    .replace(/<p>(<ul>)/g, "$1")
    .replace(/(<\/ul>)<\/p>/g, "$1")
    .replace(/<p>(<hr\s*\/>)<\/p>/g, "$1")
    // Tables: strip wrapping paragraphs and any stray line-breaks around them
    .replace(/<p>(<table>)/g, "$1")
    .replace(/(<\/table>)<\/p>/g, "$1")
    .replace(/<br \/>(<table>)/g, "$1")
    .replace(/(<\/table>)<br \/>/g, "$1");

  return html;
}

function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const total = scrollHeight - clientHeight;
      setProgress(total > 0 ? (scrollTop / total) * 100 : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 z-[60] h-[3px] bg-primary transition-all duration-75"
      style={{ width: `${progress}%`, transitionTimingFunction: "linear" }}
      aria-hidden="true"
    />
  );
}

function ShareButton({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const url = typeof window !== "undefined" ? window.location.href : `https://cityqlo.com/guides/${slug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  const platforms = [
    {
      name: "Copy Link",
      icon: copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Link2 className="h-3.5 w-3.5" />,
      onClick: handleCopy,
    },
    {
      name: "Facebook",
      icon: <Facebook className="h-3.5 w-3.5" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      name: "Twitter",
      icon: (
        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="h-3.5 w-3.5" />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
      name: "WhatsApp",
      icon: <Send className="h-3.5 w-3.5" />,
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`,
    },
  ];

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white/50 px-3.5 py-1 text-[11px] font-mono tracking-[0.08em] uppercase text-muted-foreground transition-all duration-300 hover:border-ink hover:text-ink backdrop-blur-sm cursor-pointer"
        style={{ transitionTimingFunction: "var(--ease-luxe)" }}
      >
        <Share2 className="h-3 w-3" />
        Share
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-45" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 sm:left-0 mt-2 z-50 w-40 rounded-xl border border-border bg-white/95 p-1 shadow-lift backdrop-blur-md transition-all duration-300 origin-top"
            style={{ animation: "fadeIn 200ms var(--ease-luxe)" }}
          >
            {platforms.map((p) => {
              const content = (
                <>
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-muted text-ink/70 group-hover:bg-primary/8 group-hover:text-primary transition-colors">
                    {p.icon}
                  </span>
                  <span className="text-[11px] font-semibold text-ink/80 group-hover:text-ink">
                    {p.name}
                  </span>
                </>
              );

              if (p.url) {
                return (
                  <a
                    key={p.name}
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="group flex items-center gap-2 rounded-lg px-2 py-1 text-left transition-colors hover:bg-muted text-decoration-none"
                  >
                    {content}
                  </a>
                );
              }

              return (
                <button
                  key={p.name}
                  onClick={() => {
                    p.onClick?.();
                  }}
                  className="group flex w-full items-center gap-2 rounded-lg px-2 py-1 text-left transition-colors hover:bg-muted border-none bg-transparent cursor-pointer"
                >
                  {content}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function BlogPost() {
  const { post: loaderPost } = Route.useLoaderData();
  const { slug } = Route.useParams();

  const { data: post, isLoading } = useQuery({
    queryKey: ["public-blog", slug],
    queryFn: () => getPublicBlogBySlug({ data: { slug } }),
    initialData: loaderPost || undefined,
    staleTime: 60_000,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen px-4 pt-32">
        <div className="container-prose max-w-3xl">
          <div className="skeleton mb-4 h-6 w-24 rounded-full" />
          <div className="skeleton mb-6 h-14 w-full rounded-xl" />
          <div className="skeleton h-5 w-64 rounded-full" />
          <div className="mt-16 space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton h-4 rounded-full" style={{ width: `${75 + (i % 3) * 10}%` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <p className="eyebrow">404</p>
        <h1 className="display-2 mt-4">Guide not found</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          This guide may not be published yet or the link is incorrect.
        </p>
        <Link
          to="/guides"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white"
        >
          ← Back to Guides
        </Link>
      </div>
    );
  }

  const htmlContent = markdownToHtml(post.content ?? "");

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Guides", href: "/guides" },
          { name: post.title, href: `/guides/${post.slug}` },
        ]}
      />
      <ScrollProgress />

      <article className="min-h-screen">
        {/* ── Hero ───────────────────────────────────────────────── */}
        <header className="relative px-4 pb-16 pt-32 md:pt-52">
          {post.cover_image_url && (
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src={post.cover_image_url}
                alt=""
                className="h-full w-full object-cover"
                aria-hidden="true"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/60 to-white" />
            </div>
          )}
          <div className="container-prose relative z-10 max-w-3xl">
            {/* Breadcrumb */}
            <Link
              to="/guides"
              className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.06em] uppercase text-muted-foreground transition-colors duration-300 hover:text-ink"
              style={{ transitionTimingFunction: "var(--ease-luxe)" }}
            >
              <span aria-hidden>←</span> All Guides
            </Link>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold tracking-[0.1em] uppercase text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="display-1 mt-6 text-ink">{post.title}</h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="lede mt-6 max-w-2xl">{post.excerpt}</p>
            )}

            {/* Meta */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
              <div className="flex flex-wrap items-center gap-6">
                {post.published_at && (
                  <time className="font-mono text-[11px] tracking-[0.16em] uppercase text-muted-foreground">
                    {formatDate(post.published_at)}
                  </time>
                )}
                {post.read_time && (
                  <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-muted-foreground">
                    {post.read_time} min read
                  </span>
                )}
              </div>
              <ShareButton title={post.title} slug={post.slug} />
            </div>

            {/* Divider */}
            <div className="mt-12 h-px w-full bg-gradient-to-r from-gold/60 via-border to-transparent" />
          </div>
        </header>

        {/* ── Body ───────────────────────────────────────────────── */}
        <div className="px-4 pb-32">
          <div className="container-prose max-w-3xl">
            <div
              id="blog-content"
              className="prose-cityqlo"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            {/* Footer CTA */}
            <div className="mt-24 border-t border-hairline pt-16">
              <p className="eyebrow">
                <span className="gold-rule" />
                CityQlo Advisory
              </p>
              <h2 className="display-3 mt-6 max-w-xl">
                Have questions about this guide?
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                Book a complimentary consultation. No pressure, no sales pitch — just honest guidance.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-[13px] font-semibold tracking-[0.02em] text-white transition-all duration-700 hover:-translate-y-[2px] hover:shadow-lift"
                  style={{ transitionTimingFunction: "var(--ease-luxe)" }}
                >
                  Book consultation →
                </Link>
                <Link
                  to="/guides"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-[13px] font-semibold tracking-[0.02em] text-ink transition-all duration-300 hover:border-ink"
                  style={{ transitionTimingFunction: "var(--ease-luxe)" }}
                >
                  ← More guides
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
