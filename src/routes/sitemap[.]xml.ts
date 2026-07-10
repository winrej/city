import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { getPublishedProjectSlugs, getPublicBlogs } from "@/lib/api/admin.functions";

const BASE_URL = "https://cityqlo.com";

interface SitemapEntry {
  path: string;
  changefreq?: "daily" | "weekly" | "monthly" | "yearly";
  priority?: string;
  lastmod?: string;
}

// Escape characters that are illegal in XML text / URLs inside <loc>.
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Normalize any timestamp to a W3C date (YYYY-MM-DD) as Google expects for <lastmod>.
function toLastmod(value?: string | null): string | undefined {
  if (!value) return undefined;
  const iso = new Date(value).toISOString();
  return iso.slice(0, 10);
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticEntries: SitemapEntry[] = [
          { path: "/", changefreq: "daily", priority: "1.0" },
          { path: "/sonora-garden-residences", changefreq: "weekly", priority: "0.9" },
          { path: "/fortis-residences", changefreq: "weekly", priority: "0.9" },
          { path: "/why-invest", changefreq: "monthly", priority: "0.8" },
          { path: "/properties", changefreq: "weekly", priority: "0.9" },
          { path: "/guides", changefreq: "weekly", priority: "0.8" },
          { path: "/about", changefreq: "monthly", priority: "0.6" },
          { path: "/contact", changefreq: "monthly", priority: "0.6" },
          { path: "/faq", changefreq: "monthly", priority: "0.6" },
          { path: "/careers", changefreq: "monthly", priority: "0.5" },
          { path: "/privacy", changefreq: "yearly", priority: "0.3" },
          { path: "/terms", changefreq: "yearly", priority: "0.3" },
        ];

        let projects: Array<{ slug: string; updated_at?: string | null }> = [];
        let guides: Array<{ slug: string; published_at?: string | null }> = [];

        try {
          projects = await getPublishedProjectSlugs();

          const blogs = await getPublicBlogs();
          guides = (blogs || [])
            .filter((b: any) => b.status === "published" || b.published_at)
            .map((b: any) => ({ slug: b.slug, published_at: b.published_at }));
        } catch (error) {
          console.error("Failed to fetch slugs for sitemap:", error);
        }

        const projectEntries: SitemapEntry[] = projects.map((p) => ({
          path: `/projects/${p.slug}`,
          changefreq: "weekly",
          priority: "0.8",
          lastmod: toLastmod(p.updated_at),
        }));

        const guideEntries: SitemapEntry[] = guides.map((g) => ({
          path: `/guides/${g.slug}`,
          changefreq: "weekly",
          priority: "0.7",
          lastmod: toLastmod(g.published_at),
        }));

        const entries = [...staticEntries, ...projectEntries, ...guideEntries];

        const urls = entries.map((e) => {
          const parts = [`    <loc>${escapeXml(`${BASE_URL}${e.path}`)}</loc>`];
          if (e.lastmod) parts.push(`    <lastmod>${e.lastmod}</lastmod>`);
          if (e.changefreq) parts.push(`    <changefreq>${e.changefreq}</changefreq>`);
          if (e.priority) parts.push(`    <priority>${e.priority}</priority>`);
          return `  <url>\n${parts.join("\n")}\n  </url>`;
        });
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
            "X-Content-Type-Options": "nosniff",
          },
        });
      },
    },
  },
});
