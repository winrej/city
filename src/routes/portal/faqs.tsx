import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import {
  HelpCircle,
  Plus,
  Edit3,
  Trash2,
  Search,
  ChevronDown,
  X,
  AlertTriangle,
  Eye,
  EyeOff
} from "lucide-react";
import {
  getAdminFaqs,
  createFaq,
  updateFaq,
  deleteFaq
} from "../../lib/api/admin.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/faqs")({
  component: FaqsAdminPage,
});

type Faq = {
  id: string;
  question: string;
  answer: string;
  category: string;
  status: "published" | "draft";
  display_order: number;
  created_at: string;
  updated_at: string;
};

type FormState = {
  question: string;
  answer: string;
  category: string;
  status: "published" | "draft";
  display_order: number;
};

const EMPTY_FORM: FormState = {
  question: "",
  answer: "",
  category: "General",
  status: "published",
  display_order: 0,
};

function FaqFormModal({
  mode,
  initial,
  onClose,
  onSubmit,
  isSubmitting,
}: {
  mode: "create" | "edit";
  initial: FormState;
  onClose: () => void;
  onSubmit: (data: FormState) => void;
  isSubmitting: boolean;
}) {
  const [form, setForm] = useState<FormState>(initial);

  const set = (key: keyof FormState, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="portal-detail-overlay" onClick={onClose}>
      <div
        className="portal-detail-panel"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "560px" }}
      >
        {/* Header */}
        <div className="portal-detail-header">
          <h2 className="portal-detail-name">
            {mode === "create" ? "Add New FAQ" : "Edit FAQ"}
          </h2>
          <button className="portal-detail-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div
          className="portal-detail-body"
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {/* Question */}
          <div className="portal-field">
            <label className="portal-field-label">Question *</label>
            <input
              className="portal-input"
              placeholder="e.g. Can foreigners own condominium units in the Philippines?"
              value={form.question}
              onChange={(e) => set("question", e.target.value)}
            />
          </div>

          {/* Answer */}
          <div className="portal-field">
            <label className="portal-field-label">Answer *</label>
            <textarea
              className="portal-input"
              rows={5}
              style={{ resize: "vertical", minHeight: "120px" }}
              placeholder="Provide the clear, factual answer here..."
              value={form.answer}
              onChange={(e) => set("answer", e.target.value)}
            />
          </div>

          {/* Category + Display Order */}
          <div className="portal-grid-2col">
            <div className="portal-field">
              <label className="portal-field-label">Category *</label>
              <input
                className="portal-input"
                placeholder="e.g. Buying Process, Legalities, DMCI Homes"
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
              />
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.4rem" }}>
                {["Buying Process", "Legalities", "Payment Options", "OFW Investors", "DMCI Homes"].map(
                  (c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => set("category", c)}
                      style={{
                        fontSize: "10px",
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: "4px",
                        padding: "2px 6px",
                        color: "var(--zinc-350)",
                        cursor: "pointer",
                      }}
                    >
                      {c}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="portal-field">
              <label className="portal-field-label">Display Order</label>
              <input
                className="portal-input"
                type="number"
                value={form.display_order}
                onChange={(e) => set("display_order", parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* Status Select */}
          <div className="portal-field">
            <label className="portal-field-label">Status</label>
            <div className="portal-select-wrap" style={{ maxWidth: "200px" }}>
              <select
                className="portal-select"
                value={form.status}
                onChange={(e) => set("status", e.target.value as "published" | "draft")}
              >
                <option value="published">Published (Visible Publicly)</option>
                <option value="draft">Draft (Hidden)</option>
              </select>
              <ChevronDown size={14} className="portal-select-icon" />
            </div>
          </div>

          {/* Actions */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "0.75rem",
              paddingTop: "0.5rem",
              borderTop: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <button className="portal-btn-ghost" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button
              className="portal-btn-primary"
              onClick={() => onSubmit(form)}
              disabled={isSubmitting || !form.question.trim() || !form.answer.trim() || !form.category.trim()}
            >
              {isSubmitting ? "Saving..." : mode === "create" ? "Create FAQ" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FaqsAdminPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const [showCreate, setShowCreate] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Faq | null>(null);

  const { data: faqs = [], isLoading } = useQuery<Faq[]>({
    queryKey: ["admin-faqs"],
    queryFn: () => getAdminFaqs() as Promise<Faq[]>,
  });

  // Extract unique categories for filter
  const categories = useMemo(() => {
    const list = new Set(faqs.map((f) => f.category));
    return Array.from(list);
  }, [faqs]);

  // Filters application
  const filtered = useMemo(() => {
    return faqs.filter((f) => {
      if (filterCategory !== "all" && f.category !== filterCategory) return false;
      if (filterStatus !== "all" && f.status !== filterStatus) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !f.question.toLowerCase().includes(q) &&
          !f.answer.toLowerCase().includes(q) &&
          !f.category.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [faqs, search, filterCategory, filterStatus]);

  const createMut = useMutation({
    mutationFn: (data: FormState) => createFaq({ data }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-faqs"] });
      qc.invalidateQueries({ queryKey: ["public-faqs"] });
      setShowCreate(false);
      toast.success("FAQ created successfully");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Creation failed"),
  });

  const updateMut = useMutation({
    mutationFn: (data: { id: string } & FormState) => updateFaq({ data }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-faqs"] });
      qc.invalidateQueries({ queryKey: ["public-faqs"] });
      setEditingFaq(null);
      toast.success("FAQ updated");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Update failed"),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteFaq({ data: { id } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-faqs"] });
      qc.invalidateQueries({ queryKey: ["public-faqs"] });
      setDeleteTarget(null);
      toast.success("FAQ deleted successfully");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Delete failed"),
  });

  const toggleStatusMut = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "published" | "draft" }) =>
      updateFaq({ data: { id, status } }),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["admin-faqs"] });
      qc.invalidateQueries({ queryKey: ["public-faqs"] });
      toast.success(
        variables.status === "published"
          ? "FAQ is now visible publicly"
          : "FAQ is now hidden"
      );
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Toggle failed"),
  });

  const stats = useMemo(() => {
    return {
      total: faqs.length,
      published: faqs.filter((f) => f.status === "published").length,
      drafts: faqs.filter((f) => f.status === "draft").length,
    };
  }, [faqs]);

  return (
    <div className="portal-page">
      {/* Page Header */}
      <div className="portal-page-header">
        <div>
          <h1 className="portal-page-title">Frequently Asked Questions</h1>
          <p className="portal-page-desc">
            Manage the general real estate advisory questions displayed on the public FAQ page.
          </p>
        </div>
        <button className="portal-btn-primary" onClick={() => setShowCreate(true)}>
          <Plus size={16} />
          Add FAQ
        </button>
      </div>

      {/* Stats Cards */}
      <div
        className="portal-stats-grid"
        style={{ gridTemplateColumns: "repeat(3, 1fr)", marginBottom: "1.5rem" }}
      >
        {[
          { label: "Total FAQs", value: stats.total, color: "stat-blue" },
          { label: "Published", value: stats.published, color: "stat-green" },
          { label: "Drafts", value: stats.drafts, color: "stat-amber" },
        ].map((s) => (
          <div key={s.label} className={`portal-stat-card ${s.color}`}>
            <div className="portal-stat-body">
              <span className="portal-stat-value">{s.value}</span>
              <span className="portal-stat-label">{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filters Toolbar */}
      <div
        className="portal-card"
        style={{
          padding: "0.85rem 1.25rem",
          marginBottom: "1rem",
          display: "flex",
          gap: "0.75rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* Search */}
        <div style={{ position: "relative", flex: "1", minWidth: "200px" }}>
          <Search
            size={14}
            style={{
              position: "absolute",
              left: "0.75rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--zinc-400)",
              pointerEvents: "none",
            }}
          />
          <input
            className="portal-input"
            style={{ paddingLeft: "2.25rem" }}
            placeholder="Search questions or answers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category filter */}
        <div className="portal-select-wrap" style={{ minWidth: "160px" }}>
          <select
            className="portal-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="portal-select-icon" />
        </div>

        {/* Status filter */}
        <div className="portal-select-wrap" style={{ minWidth: "140px" }}>
          <select
            className="portal-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="published">Published Only</option>
            <option value="draft">Drafts Only</option>
          </select>
          <ChevronDown size={14} className="portal-select-icon" />
        </div>
      </div>

      {/* Table / List View */}
      {isLoading ? (
        <div className="portal-card" style={{ padding: "3rem", textAlign: "center" }}>
          <span style={{ color: "var(--zinc-400)" }}>Loading FAQs...</span>
        </div>
      ) : filtered.length > 0 ? (
        <div className="portal-card" style={{ overflowX: "auto" }}>
          <table className="portal-table">
            <thead>
              <tr>
                <th style={{ width: "80px" }}>Order</th>
                <th>Category</th>
                <th style={{ width: "40%" }}>Question</th>
                <th>Status</th>
                <th style={{ width: "120px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((faq) => (
                <tr key={faq.id}>
                  <td className="font-mono" style={{ fontSize: "12px" }}>
                    {faq.display_order}
                  </td>
                  <td>
                    <span
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "4px",
                        padding: "2px 6px",
                        fontSize: "11px",
                        fontWeight: 500,
                        color: "var(--zinc-300)",
                      }}
                    >
                      {faq.category}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: "var(--zinc-100)" }}>
                      {faq.question}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--zinc-400)",
                        marginTop: "4px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "400px",
                      }}
                      title={faq.answer}
                    >
                      {faq.answer}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`portal-badge ${
                        faq.status === "published" ? "status-qualified" : "status-contacted"
                      }`}
                      style={{ textTransform: "capitalize", cursor: "pointer" }}
                      onClick={() =>
                        toggleStatusMut.mutate({
                          id: faq.id,
                          status: faq.status === "published" ? "draft" : "published",
                        })
                      }
                      title="Click to toggle status"
                    >
                      {faq.status}
                    </span>
                  </td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "0.5rem",
                      }}
                    >
                      <button
                        className="portal-action-btn"
                        title="Toggle visibility"
                        onClick={() =>
                          toggleStatusMut.mutate({
                            id: faq.id,
                            status: faq.status === "published" ? "draft" : "published",
                          })
                        }
                      >
                        {faq.status === "published" ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                      <button
                        className="portal-action-btn"
                        title="Edit FAQ"
                        onClick={() => setEditingFaq(faq)}
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        className="portal-action-btn delete"
                        title="Delete FAQ"
                        onClick={() => setDeleteTarget(faq)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="portal-card" style={{ padding: "4rem", textAlign: "center" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.03)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
              color: "var(--zinc-500)",
            }}
          >
            <HelpCircle size={20} />
          </div>
          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--zinc-200)" }}>
            No FAQs found
          </h3>
          <p style={{ fontSize: "13px", color: "var(--zinc-500)", marginTop: "4px" }}>
            No records matched your search filters. Try adjusting them or add a new FAQ entry.
          </p>
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <FaqFormModal
          mode="create"
          initial={EMPTY_FORM}
          onClose={() => setShowCreate(false)}
          isSubmitting={createMut.isPending}
          onSubmit={(data) => createMut.mutate(data)}
        />
      )}

      {/* Edit Modal */}
      {editingFaq && (
        <FaqFormModal
          mode="edit"
          initial={{
            question: editingFaq.question,
            answer: editingFaq.answer,
            category: editingFaq.category,
            status: editingFaq.status,
            display_order: editingFaq.display_order,
          }}
          onClose={() => setEditingFaq(null)}
          isSubmitting={updateMut.isPending}
          onSubmit={(data) => updateMut.mutate({ id: editingFaq.id, ...data })}
        />
      )}

      {/* Confirm Delete Dialog */}
      {deleteTarget && (
        <div className="portal-detail-overlay" onClick={() => setDeleteTarget(null)}>
          <div
            className="portal-detail-panel"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "400px", padding: "1.5rem" }}
          >
            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "rgba(239, 68, 68, 0.1)",
                  color: "#ef4444",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--zinc-100)" }}>
                  Delete FAQ entry?
                </h3>
                <p
                  style={{
                    fontSize: "13px",
                    color: "var(--zinc-400)",
                    marginTop: "8px",
                    lineHeight: "1.4",
                  }}
                >
                  Are you sure you want to delete this FAQ? This action is permanent and cannot
                  be undone. It will immediately be removed from the public website.
                </p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.75rem",
                marginTop: "1.5rem",
                paddingTop: "1rem",
                borderTop: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <button className="portal-btn-ghost" onClick={() => setDeleteTarget(null)}>
                Cancel
              </button>
              <button
                className="portal-btn-primary"
                style={{ background: "#ef4444", color: "#white" }}
                onClick={() => deleteMut.mutate(deleteTarget.id)}
                disabled={deleteMut.isPending}
              >
                {deleteMut.isPending ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
