import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Reveal } from "@/components/site/Reveal";
import { BreadcrumbJsonLd } from "@/components/site/BreadcrumbJsonLd";
import { getPublicBlogs } from "@/lib/api/admin.functions";


export const Route = createFileRoute("/guides/")({
  head: () => ({
    meta: [
      { title: "Guides — Property Insights | CityQlo" },
      {
        name: "description",
        content:
          "Editorial guides and insights on buying, investing, and navigating the Metro Manila property market.",
      },
      { property: "og:title", content: "Guides — Property Insights | CityQlo" },
      {
        property: "og:description",
        content:
          "Editorial guides and insights on buying, investing, and navigating the Metro Manila property market.",
      },
      { property: "og:url", content: "https://cityqlo.com/guides" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://cityqlo.com/Logo.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Guides — Property Insights | CityQlo" },
      {
        name: "twitter:description",
        content:
          "Editorial guides and insights on buying, investing, and navigating the Metro Manila property market.",
      },
      { name: "twitter:image", content: "https://cityqlo.com/Logo.png" },
    ],
    links: [{ rel: "canonical", href: "https://cityqlo.com/guides" }],
  }),
  component: Guides,
});


type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url?: string | null;
  published_at?: string | null;
  tags?: string[];
  read_time?: number;
};

function formatDate(iso?: string | null) {
  if (!iso) return "Published";
  return new Intl.DateTimeFormat("en-PH", { year: "numeric", month: "long", day: "numeric" }).format(new Date(iso));
}

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  const isPublished = !!post.slug;

  return (
    <Reveal delay={index * 60}>
      <Link
        to={isPublished ? "/guides/$slug" : "/guides"}
        params={isPublished ? { slug: post.slug } : undefined}
        className="group block"
        style={{ pointerEvents: isPublished ? "auto" : "none" }}
      >
        <article className="relative overflow-hidden rounded-2xl border border-border bg-white transition-all duration-700 hover:-translate-y-1 hover:shadow-lift" style={{ transitionTimingFunction: "var(--ease-luxe)" }}>
          {/* Cover image */}
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            {post.cover_image_url ? (
              <img
                src={post.cover_image_url}
                alt={post.title}
                className="h-full w-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                style={{ transitionTimingFunction: "var(--ease-luxe)" }}
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/40">
                <span className="text-[40px] font-extrabold tracking-[-0.05em] text-muted-foreground/20 select-none">
                  {post.title.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            {/* "Soon" overlay for unpublished */}
            {!isPublished && (
              <div className="absolute inset-0 flex items-center justify-center bg-ink/60 backdrop-blur-sm">
                <span className="text-[10px] font-mono font-semibold tracking-[0.28em] uppercase text-white/80">
                  Coming soon
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-primary/8 px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.08em] uppercase text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <h2 className="text-[20px] font-extrabold leading-snug tracking-[-0.025em] text-ink transition-colors duration-300 group-hover:text-primary">
              {post.title}
            </h2>
            <p className="mt-2.5 text-[14px] leading-relaxed text-muted-foreground line-clamp-2">
              {post.excerpt}
            </p>

            {/* Footer */}
            <div className="mt-5 flex items-center justify-between">
              <time className="font-mono text-[10px] tracking-[0.12em] uppercase text-muted-foreground">
                {formatDate(post.published_at)}
              </time>
              {post.read_time && (
                <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-muted-foreground">
                  {post.read_time} min read
                </span>
              )}
            </div>

            {isPublished && (
              <div className="mt-5 flex items-center gap-2 text-[12px] font-semibold tracking-[0.03em] text-primary transition-all duration-300 group-hover:gap-3" style={{ transitionTimingFunction: "var(--ease-luxe)" }}>
                Read guide
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </div>
            )}
          </div>
        </article>
      </Link>
    </Reveal>
  );
}

function Guides() {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: livePosts = [] } = useQuery<BlogPost[]>({
    queryKey: ["public-blogs"],
    queryFn: () => getPublicBlogs(),
    staleTime: 60_000,
  });

  // Render guides from the database only
  const mergedGuides: BlogPost[] = livePosts;

  // Collect all tags
  const allTags = Array.from(
    new Set(mergedGuides.flatMap((g) => g.tags ?? []))
  ).sort();

  // Filter
  const filtered = mergedGuides.filter((g) => {
    const matchesTag = !activeTag || (g.tags ?? []).includes(activeTag);
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      g.title.toLowerCase().includes(q) ||
      g.excerpt.toLowerCase().includes(q) ||
      (g.tags ?? []).some((t) => t.toLowerCase().includes(q));
    return matchesTag && matchesSearch;
  });

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Guides", href: "/guides" },
        ]}
      />
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="px-4 pb-16 pt-32 md:pt-52">
        <div className="container-prose">
          <Reveal>
            <p className="eyebrow">
              <span className="gold-rule" />
              CityQlo · Guides
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="display-1 mt-8 max-w-4xl">
              Guides,{" "}
              <span className="text-primary">written like advice.</span>
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <p className="lede mt-8 max-w-2xl">
              Editorial, plain-spoken guides for the decisions that matter. Released one at a time, each one revised until it earns the page.
            </p>
          </Reveal>

          {/* Search + Filters */}
          <Reveal delay={360}>
            <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
              {/* Search */}
              <div className="relative flex-1 max-w-sm">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  id="guides-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search guides…"
                  className="h-12 w-full rounded-full border border-border bg-white/80 pl-11 pr-5 text-[14px] placeholder:text-muted-foreground focus:border-ink focus:outline-none backdrop-blur-sm transition-all duration-300"
                  style={{ transitionTimingFunction: "var(--ease-luxe)" }}
                />
              </div>

              {/* Tag filters (Horizontal scroll on mobile, wrap on desktop) */}
              <>
                <style>{`
                  .scrollbar-none::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
                <div
                  className="flex flex-row gap-2 pb-3 pt-1 -mx-4 px-4 overflow-x-auto sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible scrollbar-none"
                  style={{
                    msOverflowStyle: "none",
                    scrollbarWidth: "none",
                    WebkitOverflowScrolling: "touch",
                  }}
                >
                  <button
                    onClick={() => setActiveTag(null)}
                    className={`shrink-0 rounded-full border px-4 py-1.5 text-[11px] font-semibold tracking-[0.06em] uppercase transition-all duration-300 ${!activeTag ? "border-ink bg-ink text-white" : "border-border bg-white text-muted-foreground hover:border-ink hover:text-ink"}`}
                    style={{ transitionTimingFunction: "var(--ease-luxe)" }}
                  >
                    All
                  </button>
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                      className={`shrink-0 rounded-full border px-4 py-1.5 text-[11px] font-semibold tracking-[0.06em] uppercase transition-all duration-300 ${activeTag === tag ? "border-primary bg-primary text-white" : "border-border bg-white text-muted-foreground hover:border-primary hover:text-primary"}`}
                      style={{ transitionTimingFunction: "var(--ease-luxe)" }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Grid ─────────────────────────────────────────────────── */}
      <section className="px-4 pb-32">
        <div className="container-prose">
          {filtered.length === 0 ? (
            <Reveal>
              <p className="py-16 text-center text-muted-foreground">No guides match your search.</p>
            </Reveal>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((post, i) => (
                <BlogCard key={post.id} post={post} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Subscribe CTA ────────────────────────────────────────── */}
      <section className="surface px-4 section-pad">
        <div className="container-prose grid items-end gap-16 md:grid-cols-12">
          <Reveal className="md:col-span-6">
            <p className="eyebrow">
              <span className="gold-rule" />
              Be the first
            </p>
            <h2 className="display-2 mt-6">Get guides in your inbox.</h2>
            <p className="mt-6 max-w-md text-[16px] leading-relaxed text-muted-foreground">
              No spam. Just thoughtful releases as each guide is published — one at a time.
            </p>
          </Reveal>
          <Reveal delay={160} className="md:col-span-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const btn = (e.currentTarget.querySelector("button[type=submit]") as HTMLButtonElement);
                if (btn) btn.textContent = "Thank you. We'll be in touch.";
              }}
            >
              <div className="flex flex-col gap-3 sm:flex-row">
                <label htmlFor="guides-email" className="sr-only">Email address</label>
                <input
                  id="guides-email"
                  type="email"
                  required
                  name="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="h-16 flex-1 rounded-full border border-border bg-background px-7 text-[15px] placeholder:text-muted-foreground focus:border-ink focus:outline-none"
                />
                <button
                  type="submit"
                  className="h-16 rounded-full bg-ink px-9 text-[13px] font-semibold tracking-[0.02em] text-white transition-all duration-700 hover:-translate-y-[2px] hover:shadow-lift"
                  style={{ transitionTimingFunction: "var(--ease-luxe)" }}
                >
                  Notify me
                </button>
              </div>
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}
