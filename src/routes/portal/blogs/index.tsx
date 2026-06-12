import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  FileText,
  Search,
  Tag,
} from "lucide-react";
import { getAdminBlogs, deleteBlog } from "../../../lib/api/admin.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/blogs/")({
  component: BlogsDashboard,
});

type BlogRow = {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  published_at?: string | null;
  tags?: string[];
  read_time?: number;
  created_at: string;
  updated_at: string;
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(iso));
}

function BlogsDashboard() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { data: posts = [], isLoading } = useQuery<BlogRow[]>({
    queryKey: ["admin-blogs"],
    queryFn: () => getAdminBlogs(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBlog({ data: { id } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-blogs"] });
      toast.success("Article deleted.");
      setDeleteConfirm(null);
    },
    onError: (err: any) => {
      toast.error(err?.message ?? "Failed to delete article.");
      setDeleteConfirm(null);
    },
  });

  const filtered = posts.filter((p) => {
    const matchesStatus = filter === "all" || p.status === filter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q) ||
      (p.tags ?? []).some((t) => t.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  const publishedCount = posts.filter((p) => p.status === "published").length;
  const draftCount = posts.filter((p) => p.status === "draft").length;

  return (
    <div className="portal-page">
      {/* Header */}
      <div className="portal-page-header">
        <div>
          <h1 className="portal-page-title">Guides &amp; Blog</h1>
          <p className="portal-page-desc">
            {publishedCount} published · {draftCount} draft
          </p>
        </div>
        <Link
          to="/portal/blogs/$id"
          params={{ id: "new" }}
          className="portal-btn-primary"
          id="blog-new-article-btn"
        >
          <Plus size={16} />
          New Article
        </Link>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
        {[
          { label: "Total Articles", value: posts.length, color: "stat-blue" },
          { label: "Published", value: publishedCount, color: "stat-green" },
          { label: "Drafts", value: draftCount, color: "stat-amber" },
        ].map((s) => (
          <div key={s.label} className={`portal-stat-card ${s.color}`}>
            <div className="portal-stat-icon-wrap">
              <FileText size={18} />
            </div>
            <div className="portal-stat-body">
              <span className="portal-stat-value">{s.value}</span>
              <span className="portal-stat-label">{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="portal-card" style={{ padding: "1rem 1.25rem" }}>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
          {/* Search */}
          <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
            <Search
              size={14}
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--portal-text-muted)",
              }}
            />
            <input
              id="blog-search-input"
              type="search"
              placeholder="Search articles…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                background: "var(--portal-bg)",
                border: "1px solid var(--portal-border)",
                borderRadius: "8px",
                padding: "0.5rem 0.75rem 0.5rem 2rem",
                fontSize: "0.8125rem",
                color: "var(--portal-text)",
                outline: "none",
              }}
            />
          </div>

          {/* Status filter */}
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {(["all", "published", "draft"] as const).map((f) => (
              <button
                key={f}
                id={`blog-filter-${f}`}
                onClick={() => setFilter(f)}
                style={{
                  padding: "0.4rem 0.9rem",
                  borderRadius: "6px",
                  border: "1px solid",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 200ms ease",
                  textTransform: "capitalize",
                  borderColor: filter === f ? "var(--portal-accent)" : "var(--portal-border)",
                  background: filter === f ? "var(--portal-accent-dim)" : "transparent",
                  color: filter === f ? "var(--portal-accent)" : "var(--portal-text-muted)",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="portal-card" style={{ overflow: "hidden" }}>
        <div className="portal-card-header">
          <div className="portal-card-title">
            <FileText size={16} />
            Articles ({filtered.length})
          </div>
        </div>

        {isLoading ? (
          <div style={{ padding: "2rem" }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="skeleton"
                style={{ height: "48px", marginBottom: "0.75rem", borderRadius: "8px" }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center" }}>
            <FileText size={32} style={{ color: "var(--portal-text-muted)", margin: "0 auto 1rem" }} />
            <p style={{ color: "var(--portal-text-muted)", fontSize: "0.875rem" }}>
              {posts.length === 0
                ? "No articles yet. Create your first one."
                : "No articles match your filters."}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid var(--portal-border)",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--portal-text-muted)",
                  }}
                >
                  {["Title", "Status", "Tags", "Read time", "Published", "Updated", "Actions"].map((h) => (
                    <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", whiteSpace: "nowrap" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((post) => (
                  <tr
                    key={post.id}
                    style={{
                      borderBottom: "1px solid var(--portal-border)",
                      transition: "background 150ms ease",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "oklch(1 0 0 / 0.02)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                  >
                    {/* Title */}
                    <td style={{ padding: "0.9rem 1rem", maxWidth: "280px" }}>
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: "0.8375rem",
                          color: "var(--portal-text)",
                          display: "block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {post.title}
                      </span>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          color: "var(--portal-text-muted)",
                          fontFamily: "JetBrains Mono, monospace",
                        }}
                      >
                        /{post.slug}
                      </span>
                    </td>

                    {/* Status */}
                    <td style={{ padding: "0.9rem 1rem" }}>
                      <span
                        className={`portal-status-badge status-${post.status === "published" ? "closed" : "new"}`}
                        style={{ textTransform: "capitalize" }}
                      >
                        {post.status}
                      </span>
                    </td>

                    {/* Tags */}
                    <td style={{ padding: "0.9rem 1rem" }}>
                      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                        {(post.tags ?? []).slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "3px",
                              background: "var(--portal-accent-dim)",
                              color: "var(--portal-accent)",
                              padding: "2px 8px",
                              borderRadius: "999px",
                              fontSize: "0.65rem",
                              fontWeight: 600,
                            }}
                          >
                            <Tag size={9} />
                            {tag}
                          </span>
                        ))}
                        {(post.tags ?? []).length > 3 && (
                          <span style={{ fontSize: "0.65rem", color: "var(--portal-text-muted)" }}>
                            +{(post.tags ?? []).length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Read time */}
                    <td style={{ padding: "0.9rem 1rem", color: "var(--portal-text-muted)", fontSize: "0.8rem" }}>
                      {post.read_time ? `${post.read_time} min` : "—"}
                    </td>

                    {/* Published */}
                    <td style={{ padding: "0.9rem 1rem", color: "var(--portal-text-muted)", fontSize: "0.75rem", whiteSpace: "nowrap" }}>
                      {post.published_at ? formatDate(post.published_at) : "—"}
                    </td>

                    {/* Updated */}
                    <td style={{ padding: "0.9rem 1rem", color: "var(--portal-text-muted)", fontSize: "0.75rem", whiteSpace: "nowrap" }}>
                      {formatDate(post.updated_at)}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "0.9rem 1rem" }}>
                      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                        {/* Edit */}
                        <Link
                          to="/portal/blogs/$id"
                          params={{ id: post.id }}
                          title="Edit article"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "30px",
                            height: "30px",
                            borderRadius: "6px",
                            background: "var(--portal-accent-dim)",
                            color: "var(--portal-accent)",
                            border: "none",
                            cursor: "pointer",
                            transition: "all 150ms ease",
                          }}
                          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "oklch(0.6 0.18 258 / 0.25)")}
                          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--portal-accent-dim)")}
                        >
                          <Edit3 size={13} />
                        </Link>

                        {/* Preview — only for published */}
                        {post.status === "published" && (
                          <a
                            href={`/guides/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Preview on site"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "30px",
                              height: "30px",
                              borderRadius: "6px",
                              background: "oklch(0.65 0.18 145 / 0.12)",
                              color: "oklch(0.65 0.18 145)",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            <Eye size={13} />
                          </a>
                        )}

                        {/* Delete */}
                        {deleteConfirm === post.id ? (
                          <div style={{ display: "flex", gap: "4px" }}>
                            <button
                              onClick={() => deleteMutation.mutate(post.id)}
                              disabled={deleteMutation.isPending}
                              style={{
                                padding: "3px 8px",
                                borderRadius: "5px",
                                border: "1px solid oklch(0.6 0.18 25 / 0.4)",
                                background: "oklch(0.6 0.18 25 / 0.12)",
                                color: "oklch(0.6 0.18 25)",
                                fontSize: "0.7rem",
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              {deleteMutation.isPending ? "…" : "Confirm"}
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              style={{
                                padding: "3px 8px",
                                borderRadius: "5px",
                                border: "1px solid var(--portal-border)",
                                background: "transparent",
                                color: "var(--portal-text-muted)",
                                fontSize: "0.7rem",
                                cursor: "pointer",
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(post.id)}
                            title="Delete article"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "30px",
                              height: "30px",
                              borderRadius: "6px",
                              background: "oklch(0.6 0.18 25 / 0.1)",
                              color: "oklch(0.6 0.18 25)",
                              border: "none",
                              cursor: "pointer",
                              transition: "all 150ms ease",
                            }}
                            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "oklch(0.6 0.18 25 / 0.2)")}
                            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "oklch(0.6 0.18 25 / 0.1)")}
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
