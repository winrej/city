import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { getPublishedProjectSlugs } from "@/lib/api/admin.functions";

const BASE_URL = "https://cityqlo.com";

interface SitemapEntry {
  path: string;
  changefreq?: "weekly" | "monthly" | "daily";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticEntries: SitemapEntry[] = [
          { path: "/", changefreq: "daily", priority: "1.0" },
          { path: "/why-invest", changefreq: "monthly", priority: "0.8" },
          { path: "/properties", changefreq: "weekly", priority: "0.9" },
          { path: "/guides", changefreq: "monthly", priority: "0.7" },
          { path: "/about", changefreq: "monthly", priority: "0.6" },
          { path: "/contact", changefreq: "monthly", priority: "0.6" },
        ];

        let projectSlugs: string[] = [];
        try {
          projectSlugs = await getPublishedProjectSlugs();
        } catch (error) {
          console.error("Failed to fetch project slugs for sitemap:", error);
        }

        const projectEntries: SitemapEntry[] = projectSlugs.map((slug) => ({
          path: `/projects/${slug}`,
          changefreq: "weekly",
          priority: "0.8",
        }));

        const entries = [...staticEntries, ...projectEntries];

        const urls = entries.map(
          (e) =>
            `  <url>\n    <loc>${BASE_URL}${e.path}</loc>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
        );
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
