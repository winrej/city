import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
import {
  Save,
  ArrowLeft,
  Eye,
  EyeOff,
  Tag,
  X,
  Clock,
  Image as ImageIcon,
  Globe,
  FileText,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import {
  getAdminBlogById,
  createBlog,
  updateBlog,
} from "../../lib/api/admin.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/blogs/$id")({
  component: BlogEditor,
});

// Lightweight Markdown → HTML renderer (mirrors the public reader)
function mdToHtml(md: string): string {
  if (!md) return "";
  let html = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/^###### (.+)$/gm, "<h6>$1</h6>")
    .replace(/^##### (.+)$/gm, "<h5>$1</h5>")
    .replace(/^#### (.+)$/gm, "<h4>$1</h4>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/^&gt; (.+)$/gm, "<blockquote>$1</blockquote>")
    .replace(/```[\w]*\n?([\s\S]*?)```/gm, "<pre><code>$1</code></pre>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/__(.+?)__/g, "<strong>$1</strong>")
    .replace(/_(.+?)_/g, "<em>$1</em>")
    .replace(/^---$/gm, "<hr />")
    .replace(/^[-*] (.+)$/gm, "<li>$1</li>")
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br />");
  html = `<p>${html}</p>`;
  html = html
    .replace(/(<li>[\s\S]*?<\/li>)/g, (m) => `<ul>${m}</ul>`)
    .replace(/<p>\s*<\/p>/g, "")
    .replace(/<p>(<h[1-6]>)/g, "$1")
    .replace(/(<\/h[1-6]>)<\/p>/g, "$1")
    .replace(/<p>(<blockquote>)/g, "$1")
    .replace(/(<\/blockquote>)<\/p>/g, "$1")
    .replace(/<p>(<pre>)/g, "$1")
    .replace(/(<\/pre>)<\/p>/g, "$1")
    .replace(/<p>(<ul>)/g, "$1")
    .replace(/(<\/ul>)<\/p>/g, "$1")
    .replace(/<p>(<hr\s*\/>)<\/p>/g, "$1");
  return html;
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

type FormState = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  status: "draft" | "published";
  tags: string[];
  read_time: number;
};

const EMPTY_FORM: FormState = {
  title: "",
  slug: "",
  excerpt: "",
  content: "## Introduction\n\nStart writing your guide here...\n\n## Section\n\nAdd your content...",
  cover_image_url: "",
  status: "draft",
  tags: [],
  read_time: 5,
};

function BlogEditor() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isNew = id === "new";

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [tagInput, setTagInput] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [slugLocked, setSlugLocked] = useState(!isNew);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  // Load existing post
  const { data: blogData, isLoading } = useQuery({
    queryKey: ["admin-blog", id],
    queryFn: () => getAdminBlogById({ data: { id } }),
    enabled: !isNew,
    staleTime: 30_000,
  });

  useEffect(() => {
    if (blogData) {
      setForm({
        title: blogData.title ?? "",
        slug: blogData.slug ?? "",
        excerpt: blogData.excerpt ?? "",
        content: blogData.content ?? "",
        cover_image_url: blogData.cover_image_url ?? "",
        status: blogData.status ?? "draft",
        tags: blogData.tags ?? [],
        read_time: blogData.read_time ?? 5,
      });
    }
  }, [blogData]);

  // Auto-slug from title (only for new posts & when slug not manually edited)
  useEffect(() => {
    if (isNew && !slugLocked && form.title) {
      setForm((f) => ({ ...f, slug: slugify(f.title) }));
    }
  }, [form.title, isNew, slugLocked]);

  const set = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }, []);

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.slug.trim()) errs.slug = "Slug is required";
    else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug))
      errs.slug = "Slug must be lowercase letters, numbers and hyphens only";
    if (!form.excerpt.trim()) errs.excerpt = "Excerpt is required";
    if (!form.content.trim()) errs.content = "Content is required";
    if (form.cover_image_url && !/^https?:\/\/.+/.test(form.cover_image_url))
      errs.cover_image_url = "Must be a valid URL starting with http(s)://";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const saveMutation = useMutation({
    mutationFn: async (targetStatus?: "draft" | "published") => {
      const payload = { ...form, status: targetStatus ?? form.status };
      if (isNew) {
        return createBlog({ data: payload as any });
      } else {
        return updateBlog({ data: { id, ...payload } as any });
      }
    },
    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: ["admin-blogs"] });
      qc.invalidateQueries({ queryKey: ["admin-blog", id] });
      toast.success(isNew ? "Article created!" : "Article saved.");
      if (isNew && data?.id) {
        navigate({ to: "/portal/blogs/$id", params: { id: data.id } });
      }
    },
    onError: (err: any) => {
      toast.error(err?.message ?? "Failed to save article.");
    },
  });

  const handleSave = (targetStatus?: "draft" | "published") => {
    if (!validate()) {
      toast.error("Please fix the errors before saving.");
      return;
    }
    if (targetStatus) {
      setForm((f) => ({ ...f, status: targetStatus }));
    }
    saveMutation.mutate(targetStatus);
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t) && form.tags.length < 10) {
      set("tags", [...form.tags, t]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    set("tags", form.tags.filter((t) => t !== tag));
  };

  const isSaving = saveMutation.isPending;
  const previewHtml = mdToHtml(form.content);

  if (isLoading) {
    return (
      <div className="portal-page">
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: "56px", borderRadius: "8px" }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="portal-page">
      {/* ── Topbar ── */}
      <div className="portal-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link
            to="/portal/blogs"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.8rem",
              color: "var(--portal-text-muted)",
              textDecoration: "none",
              transition: "color 200ms ease",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--portal-text)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--portal-text-muted)")}
          >
            <ArrowLeft size={14} /> All Articles
          </Link>
          <div
            style={{ width: "1px", height: "16px", background: "var(--portal-border)" }}
          />
          <div>
            <h1 className="portal-page-title" style={{ fontSize: "1.125rem" }}>
              {isNew ? "New Article" : form.title || "Edit Article"}
            </h1>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {/* Status pill */}
          <span
            style={{
              padding: "4px 12px",
              borderRadius: "999px",
              fontSize: "0.7rem",
              fontWeight: 700,
              textTransform: "capitalize",
              background: form.status === "published" ? "oklch(0.65 0.18 145 / 0.15)" : "var(--portal-accent-dim)",
              color: form.status === "published" ? "oklch(0.65 0.18 145)" : "var(--portal-accent)",
            }}
          >
            {form.status}
          </span>

          {/* Toggle preview */}
          <button
            id="blog-editor-preview-toggle"
            onClick={() => setShowPreview((v) => !v)}
            className="portal-btn-secondary"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
            {showPreview ? "Editor" : "Preview"}
          </button>

          {/* Save draft */}
          <button
            id="blog-editor-save-draft-btn"
            onClick={() => handleSave("draft")}
            disabled={isSaving}
            className="portal-btn-secondary"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <Save size={14} />
            {isSaving ? "Saving…" : "Save Draft"}
          </button>

          {/* Publish */}
          <button
            id="blog-editor-publish-btn"
            onClick={() => handleSave("published")}
            disabled={isSaving}
            className="portal-btn-primary"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <Globe size={14} />
            {form.status === "published" ? "Update" : "Publish"}
          </button>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "1.5rem", alignItems: "start" }}>

        {/* ── Left: Editor / Preview ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

          {/* Title */}
          <div className="portal-card" style={{ padding: "1.25rem" }}>
            <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--portal-text-muted)", marginBottom: "0.5rem" }}>
              Title *
            </label>
            <input
              id="blog-title-input"
              type="text"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Your guide title…"
              style={{
                width: "100%",
                background: "transparent",
                border: "none",
                borderBottom: `1px solid ${errors.title ? "oklch(0.6 0.18 25)" : "var(--portal-border)"}`,
                color: "var(--portal-text)",
                fontSize: "1.5rem",
                fontWeight: 800,
                letterSpacing: "-0.025em",
                padding: "0.5rem 0",
                outline: "none",
                fontFamily: "Montserrat, sans-serif",
              }}
            />
            {errors.title && (
              <p style={{ color: "oklch(0.6 0.18 25)", fontSize: "0.75rem", marginTop: "0.35rem", display: "flex", alignItems: "center", gap: "4px" }}>
                <AlertCircle size={12} /> {errors.title}
              </p>
            )}
          </div>

          {/* Editor / Preview toggle */}
          <div className="portal-card" style={{ overflow: "hidden" }}>
            {/* Tab bar */}
            <div
              style={{
                display: "flex",
                borderBottom: "1px solid var(--portal-border)",
                padding: "0 1rem",
              }}
            >
              {["Markdown", "Preview"].map((tab) => {
                const isActive = tab === "Preview" ? showPreview : !showPreview;
                return (
                  <button
                    key={tab}
                    onClick={() => setShowPreview(tab === "Preview")}
                    style={{
                      padding: "0.75rem 1rem",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      background: "none",
                      border: "none",
                      borderBottom: isActive ? "2px solid var(--portal-accent)" : "2px solid transparent",
                      color: isActive ? "var(--portal-accent)" : "var(--portal-text-muted)",
                      cursor: "pointer",
                      transition: "all 200ms ease",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    {tab === "Markdown" ? <FileText size={13} /> : <Eye size={13} />}
                    {tab}
                  </button>
                );
              })}
            </div>

            {showPreview ? (
              /* Preview pane */
              <div
                style={{ padding: "1.5rem", minHeight: "520px", background: "oklch(1 0 0 / 0.03)" }}
              >
                {form.content ? (
                  <div
                    className="prose-cityqlo"
                    style={{ "--foreground": "var(--portal-text)", "--muted-foreground": "var(--portal-text-muted)", "--ink": "var(--portal-text)", "--surface": "var(--portal-surface-2)" } as any}
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                  />
                ) : (
                  <p style={{ color: "var(--portal-text-muted)", fontStyle: "italic" }}>Nothing to preview yet.</p>
                )}
              </div>
            ) : (
              /* Editor pane */
              <div style={{ position: "relative" }}>
                <textarea
                  id="blog-content-textarea"
                  className="blog-editor-textarea"
                  value={form.content}
                  onChange={(e) => set("content", e.target.value)}
                  placeholder="Write your guide in Markdown…"
                  style={{ minHeight: "520px", borderRadius: 0, border: "none", borderTop: errors.content ? "2px solid oklch(0.6 0.18 25)" : "none" }}
                  spellCheck
                />
                {/* Markdown hint */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "0.75rem",
                    right: "0.75rem",
                    fontSize: "0.65rem",
                    fontFamily: "JetBrains Mono, monospace",
                    color: "var(--portal-text-muted)",
                    pointerEvents: "none",
                    display: "flex",
                    gap: "1rem",
                  }}
                >
                  <span>**bold**</span>
                  <span>*italic*</span>
                  <span>## Heading</span>
                  <span>`code`</span>
                  <span>&gt; quote</span>
                </div>
              </div>
            )}
            {errors.content && (
              <p style={{ color: "oklch(0.6 0.18 25)", fontSize: "0.75rem", padding: "0.5rem 1rem", display: "flex", alignItems: "center", gap: "4px" }}>
                <AlertCircle size={12} /> {errors.content}
              </p>
            )}
          </div>
        </div>

        {/* ── Right: Metadata sidebar ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", position: "sticky", top: "calc(var(--portal-topbar-h) + 1.5rem)" }}>

          {/* Slug */}
          <div className="portal-card" style={{ padding: "1.25rem" }}>
            <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--portal-text-muted)", marginBottom: "0.5rem" }}>
              Slug *
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ color: "var(--portal-text-muted)", fontSize: "0.75rem" }}>/guides/</span>
              <input
                id="blog-slug-input"
                type="text"
                value={form.slug}
                onChange={(e) => {
                  setSlugLocked(true);
                  set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
                }}
                placeholder="my-guide-slug"
                style={{
                  flex: 1,
                  background: "var(--portal-bg)",
                  border: `1px solid ${errors.slug ? "oklch(0.6 0.18 25)" : "var(--portal-border)"}`,
                  borderRadius: "6px",
                  padding: "0.4rem 0.6rem",
                  fontSize: "0.8rem",
                  color: "var(--portal-text)",
                  fontFamily: "JetBrains Mono, monospace",
                  outline: "none",
                }}
              />
            </div>
            {!slugLocked && isNew && (
              <p style={{ color: "var(--portal-text-muted)", fontSize: "0.7rem", marginTop: "0.35rem" }}>
                Auto-generated from title
              </p>
            )}
            {errors.slug && (
              <p style={{ color: "oklch(0.6 0.18 25)", fontSize: "0.7rem", marginTop: "0.35rem", display: "flex", alignItems: "center", gap: "4px" }}>
                <AlertCircle size={11} /> {errors.slug}
              </p>
            )}
          </div>

          {/* Excerpt */}
          <div className="portal-card" style={{ padding: "1.25rem" }}>
            <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--portal-text-muted)", marginBottom: "0.5rem" }}>
              Excerpt *
            </label>
            <textarea
              id="blog-excerpt-input"
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              placeholder="A short summary shown in the listing and on social cards…"
              rows={3}
              style={{
                width: "100%",
                background: "var(--portal-bg)",
                border: `1px solid ${errors.excerpt ? "oklch(0.6 0.18 25)" : "var(--portal-border)"}`,
                borderRadius: "6px",
                padding: "0.6rem 0.75rem",
                fontSize: "0.8rem",
                color: "var(--portal-text)",
                resize: "vertical",
                outline: "none",
                lineHeight: 1.6,
              }}
            />
            <p style={{ fontSize: "0.65rem", color: "var(--portal-text-muted)", marginTop: "0.35rem", textAlign: "right" }}>
              {form.excerpt.length} / 500
            </p>
            {errors.excerpt && (
              <p style={{ color: "oklch(0.6 0.18 25)", fontSize: "0.7rem", display: "flex", alignItems: "center", gap: "4px" }}>
                <AlertCircle size={11} /> {errors.excerpt}
              </p>
            )}
          </div>

          {/* Cover image */}
          <div className="portal-card" style={{ padding: "1.25rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--portal-text-muted)", marginBottom: "0.5rem" }}>
              <ImageIcon size={12} /> Cover Image URL
            </label>
            <input
              id="blog-cover-image-input"
              type="url"
              value={form.cover_image_url}
              onChange={(e) => set("cover_image_url", e.target.value)}
              placeholder="https://…"
              style={{
                width: "100%",
                background: "var(--portal-bg)",
                border: `1px solid ${errors.cover_image_url ? "oklch(0.6 0.18 25)" : "var(--portal-border)"}`,
                borderRadius: "6px",
                padding: "0.4rem 0.6rem",
                fontSize: "0.8rem",
                color: "var(--portal-text)",
                outline: "none",
              }}
            />
            {form.cover_image_url && !errors.cover_image_url && (
              <img
                src={form.cover_image_url}
                alt="cover preview"
                style={{ marginTop: "0.75rem", width: "100%", aspectRatio: "4/3", objectFit: "cover", borderRadius: "8px" }}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
            )}
            {errors.cover_image_url && (
              <p style={{ color: "oklch(0.6 0.18 25)", fontSize: "0.7rem", marginTop: "0.35rem", display: "flex", alignItems: "center", gap: "4px" }}>
                <AlertCircle size={11} /> {errors.cover_image_url}
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="portal-card" style={{ padding: "1.25rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--portal-text-muted)", marginBottom: "0.5rem" }}>
              <Tag size={12} /> Tags
            </label>
            <div style={{ display: "flex", gap: "6px", marginBottom: "0.5rem" }}>
              <input
                id="blog-tag-input"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Add tag…"
                style={{
                  flex: 1,
                  background: "var(--portal-bg)",
                  border: "1px solid var(--portal-border)",
                  borderRadius: "6px",
                  padding: "0.4rem 0.6rem",
                  fontSize: "0.8rem",
                  color: "var(--portal-text)",
                  outline: "none",
                }}
              />
              <button
                onClick={addTag}
                style={{
                  padding: "0.4rem 0.75rem",
                  borderRadius: "6px",
                  border: "1px solid var(--portal-accent)",
                  background: "var(--portal-accent-dim)",
                  color: "var(--portal-accent)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Add
              </button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    background: "var(--portal-accent-dim)",
                    color: "var(--portal-accent)",
                    padding: "3px 10px 3px 10px",
                    borderRadius: "999px",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                  }}
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", padding: 0, display: "flex" }}
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
            <p style={{ fontSize: "0.65rem", color: "var(--portal-text-muted)", marginTop: "0.5rem" }}>
              Press Enter or comma to add · {form.tags.length}/10
            </p>
          </div>

          {/* Read time */}
          <div className="portal-card" style={{ padding: "1.25rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--portal-text-muted)", marginBottom: "0.5rem" }}>
              <Clock size={12} /> Read Time (minutes)
            </label>
            <input
              id="blog-read-time-input"
              type="number"
              min={1}
              max={120}
              value={form.read_time}
              onChange={(e) => set("read_time", parseInt(e.target.value, 10) || 5)}
              style={{
                width: "80px",
                background: "var(--portal-bg)",
                border: "1px solid var(--portal-border)",
                borderRadius: "6px",
                padding: "0.4rem 0.6rem",
                fontSize: "0.875rem",
                color: "var(--portal-text)",
                outline: "none",
                textAlign: "center",
              }}
            />
          </div>

          {/* Save summary */}
          {saveMutation.isSuccess && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                background: "oklch(0.65 0.18 145 / 0.12)",
                color: "oklch(0.65 0.18 145)",
                fontSize: "0.8rem",
                fontWeight: 600,
              }}
            >
              <CheckCircle size={15} />
              {isNew ? "Article created!" : "Changes saved."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
