import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import {
  Building2,
  Plus,
  Edit3,
  Trash2,
  Search,
  Eye,
  EyeOff,
  Star,
  StarOff,
  ChevronDown,
  X,
  Check,
  FolderOpen,
  AlertTriangle,
} from "lucide-react";
import {
  getAdminProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  togglePropertyActive,
  togglePropertyFeatured,
} from "../../lib/api/admin.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/properties")({
  component: PropertiesPage,
});

type Property = {
  id: string;
  name: string;
  slug: string;
  developer: string;
  city: string;
  location: string;
  price_display: string;
  price_min: number;
  status: "Pre-selling" | "RFO";
  beds: number;
  baths: number;
  area: string;
  description: string;
  highlights: string[];
  category: "Metro Core" | "Suburban Enclaves" | "Resort & Leisure";
  image_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  is_deleted: boolean;
  display_order: number;
  promo_badge: string | null;
  is_spotlight: boolean;
  featured_rank: number;
  created_at: string;
  updated_at: string;
};

type FormState = {
  name: string;
  developer: string;
  city: string;
  location: string;
  price_display: string;
  price_min: number;
  status: "Pre-selling" | "RFO";
  beds: number;
  baths: number;
  area: string;
  description: string;
  highlights: string[];
  category: "Metro Core" | "Suburban Enclaves" | "Resort & Leisure";
  image_url: string;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
  promo_badge: string;
  is_spotlight: boolean;
  featured_rank: number;
};

const EMPTY_FORM: FormState = {
  name: "",
  developer: "DMCI Homes",
  city: "",
  location: "",
  price_display: "",
  price_min: 0,
  status: "Pre-selling",
  beds: 1,
  baths: 1,
  area: "",
  description: "",
  highlights: [],
  category: "Metro Core",
  image_url: "",
  is_featured: false,
  is_active: true,
  display_order: 0,
  promo_badge: "",
  is_spotlight: false,
  featured_rank: 0,
};

function PropertyFormModal({
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
  const [highlightInput, setHighlightInput] = useState("");

  const set = (key: keyof FormState, value: any) => setForm((prev) => ({ ...prev, [key]: value }));

  const addHighlight = () => {
    const trimmed = highlightInput.trim();
    if (trimmed && !form.highlights.includes(trimmed)) {
      set("highlights", [...form.highlights, trimmed]);
      setHighlightInput("");
    }
  };

  const removeHighlight = (i: number) => {
    set(
      "highlights",
      form.highlights.filter((_, idx) => idx !== i),
    );
  };

  return (
    <div className="portal-detail-overlay" onClick={onClose}>
      <div
        className="portal-detail-panel"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "640px" }}
      >
        {/* Header */}
        <div className="portal-detail-header">
          <h2 className="portal-detail-name">
            {mode === "create" ? "Add New Property" : "Edit Property"}
          </h2>
          <button className="portal-detail-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div
          className="portal-detail-body"
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {/* Name */}
          <div className="portal-field">
            <label className="portal-field-label">Property Name *</label>
            <input
              className="portal-input"
              placeholder="e.g. Sonora Garden Residences"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
            {mode === "create" && (
              <span
                style={{
                  fontSize: "11px",
                  color: "var(--zinc-500)",
                  marginTop: "0.25rem",
                  display: "block",
                }}
              >
                Slug will be auto-generated:{" "}
                <code>
                  {form.name
                    ? form.name
                        .toLowerCase()
                        .replace(/[^a-z0-9\s-]/g, "")
                        .trim()
                        .replace(/\s+/g, "-")
                    : "…"}
                </code>
              </span>
            )}
          </div>

          {/* Developer + City */}
          <div className="portal-grid-2col">
            <div className="portal-field">
              <label className="portal-field-label">Developer</label>
              <input
                className="portal-input"
                value={form.developer}
                onChange={(e) => set("developer", e.target.value)}
              />
            </div>
            <div className="portal-field">
              <label className="portal-field-label">City / Address *</label>
              <input
                className="portal-input"
                placeholder="e.g. Alabang-Zapote Road, Las Piñas"
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
              />
            </div>
          </div>

          {/* Location + Category */}
          <div className="portal-grid-2col">
            <div className="portal-field">
              <label className="portal-field-label">Location / District *</label>
              <input
                className="portal-input"
                placeholder="e.g. Las Piñas"
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
              />
            </div>
            <div className="portal-field">
              <label className="portal-field-label">Category</label>
              <div className="portal-select-wrap">
                <select
                  className="portal-select"
                  value={form.category}
                  onChange={(e) => set("category", e.target.value as any)}
                >
                  <option value="Metro Core">Metro Core</option>
                  <option value="Suburban Enclaves">Suburban Enclaves</option>
                  <option value="Resort & Leisure">Resort & Leisure</option>
                </select>
                <ChevronDown size={14} className="portal-select-icon" />
              </div>
            </div>
          </div>

          {/* Price + Status */}
          <div className="portal-grid-2col">
            <div className="portal-field">
              <label className="portal-field-label">Price Display *</label>
              <input
                className="portal-input"
                placeholder="e.g. ₱5.6M"
                value={form.price_display}
                onChange={(e) => set("price_display", e.target.value)}
              />
            </div>
            <div className="portal-field">
              <label className="portal-field-label">Price Min (millions) *</label>
              <input
                className="portal-input"
                type="number"
                step="0.1"
                min="0"
                placeholder="e.g. 5.6"
                value={form.price_min || ""}
                onChange={(e) => set("price_min", parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* Beds + Baths + Area + Status */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr 1fr", gap: "0.75rem" }}>
            <div className="portal-field">
              <label className="portal-field-label">Beds</label>
              <input
                className="portal-input"
                type="number"
                min="0"
                value={form.beds}
                onChange={(e) => set("beds", parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="portal-field">
              <label className="portal-field-label">Baths</label>
              <input
                className="portal-input"
                type="number"
                min="0"
                step="0.5"
                value={form.baths}
                onChange={(e) => set("baths", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="portal-field">
              <label className="portal-field-label">Area</label>
              <input
                className="portal-input"
                placeholder="e.g. 58.5 sq.m."
                value={form.area}
                onChange={(e) => set("area", e.target.value)}
              />
            </div>
            <div className="portal-field">
              <label className="portal-field-label">Status</label>
              <div className="portal-select-wrap">
                <select
                  className="portal-select"
                  value={form.status}
                  onChange={(e) => set("status", e.target.value as any)}
                >
                  <option value="Pre-selling">Pre-selling</option>
                  <option value="RFO">RFO</option>
                </select>
                <ChevronDown size={14} className="portal-select-icon" />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="portal-field">
            <label className="portal-field-label">Description</label>
            <textarea
              className="portal-input"
              rows={3}
              style={{ resize: "vertical", minHeight: "80px" }}
              placeholder="Short paragraph about this property…"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>

          {/* Highlights */}
          <div className="portal-field">
            <label className="portal-field-label">Highlights</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                className="portal-input"
                placeholder="Add a highlight, then press Enter"
                value={highlightInput}
                onChange={(e) => setHighlightInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addHighlight();
                  }
                }}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="portal-btn-primary"
                style={{ padding: "0 0.75rem", flexShrink: 0 }}
                onClick={addHighlight}
              >
                <Plus size={14} />
              </button>
            </div>
            {form.highlights.length > 0 && (
              <div
                style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.5rem" }}
              >
                {form.highlights.map((h, i) => (
                  <span
                    key={i}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      background: "oklch(0.25 0.015 258)",
                      border: "1px solid oklch(0.32 0.02 258)",
                      borderRadius: "999px",
                      padding: "0.2rem 0.65rem",
                      fontSize: "12px",
                      color: "var(--zinc-200)",
                    }}
                  >
                    {h}
                    <button
                      type="button"
                      onClick={() => removeHighlight(i)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--zinc-400)",
                        lineHeight: 1,
                        padding: 0,
                      }}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Promo Badge */}
          <div className="portal-field">
            <label className="portal-field-label">Promo Badge / Tag</label>
            <input
              className="portal-input"
              placeholder="e.g. Featured Development, Premium Luxury..."
              value={form.promo_badge || ""}
              onChange={(e) => set("promo_badge", e.target.value)}
            />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.4rem" }}>
              {[
                "Featured Development",
                "Spotlight Residence",
                "Premium Luxury",
                "Limited Offer",
              ].map((badge) => (
                <button
                  type="button"
                  key={badge}
                  onClick={() => set("promo_badge", badge)}
                  style={{
                    fontSize: "11px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "4px",
                    padding: "2.5px 8px",
                    color: "var(--zinc-350)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
                  onMouseOut={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
                >
                  {badge}
                </button>
              ))}
              {form.promo_badge && (
                <button
                  type="button"
                  onClick={() => set("promo_badge", "")}
                  style={{
                    fontSize: "11px",
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.25)",
                    borderRadius: "4px",
                    padding: "2.5px 8px",
                    color: "#f87171",
                    cursor: "pointer",
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Image URL */}
          <div className="portal-field">
            <label className="portal-field-label">
              Image URL{" "}
              <span style={{ color: "var(--zinc-500)", fontWeight: 400 }}>(optional override)</span>
            </label>
            <input
              className="portal-input"
              type="url"
              placeholder="https://…"
              value={form.image_url}
              onChange={(e) => set("image_url", e.target.value)}
            />
          </div>

          {/* Display order + Featured Rank */}
          <div className="portal-grid-2col">
            <div className="portal-field">
              <label className="portal-field-label">Display Order</label>
              <input
                className="portal-input"
                type="number"
                value={form.display_order}
                onChange={(e) => set("display_order", parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="portal-field">
              <label className="portal-field-label">Featured Rank (Homepage Order)</label>
              <input
                className="portal-input"
                type="number"
                placeholder="Higher ranks first"
                value={form.featured_rank}
                onChange={(e) => set("featured_rank", parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* Flags */}
          <div className="portal-field">
            <label className="portal-field-label">Flags</label>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "1.5rem",
                flexWrap: "wrap",
                paddingTop: "0.25rem",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  cursor: "pointer",
                  fontSize: "13px",
                  color: "var(--zinc-200)",
                }}
              >
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => set("is_active", e.target.checked)}
                />
                Active (visible publicly)
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  cursor: "pointer",
                  fontSize: "13px",
                  color: "var(--zinc-200)",
                }}
              >
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) => set("is_featured", e.target.checked)}
                />
                Featured property
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  cursor: "pointer",
                  fontSize: "13px",
                  color: "var(--zinc-200)",
                }}
              >
                <input
                  type="checkbox"
                  checked={form.is_spotlight}
                  onChange={(e) => set("is_spotlight", e.target.checked)}
                />
                <span style={{ color: "oklch(0.78 0.18 75)", fontWeight: "bold" }}>
                  ★ Spotlight Property
                </span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "0.75rem",
              paddingTop: "0.5rem",
            }}
          >
            <button className="portal-btn-ghost" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button
              className="portal-btn-primary"
              onClick={() => onSubmit(form)}
              disabled={
                isSubmitting ||
                !form.name ||
                !form.city ||
                !form.location ||
                !form.price_display ||
                !form.price_min
              }
            >
              {isSubmitting ? "Saving…" : mode === "create" ? "Create Property" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PropertiesPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterActive, setFilterActive] = useState<string>("all");
  const [filterFeatured, setFilterFeatured] = useState<string>("all");
  const [showDeleted, setShowDeleted] = useState(false);

  const [showCreate, setShowCreate] = useState(false);
  const [editingProp, setEditingProp] = useState<Property | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Property | null>(null);

  const { data: properties, isLoading } = useQuery({
    queryKey: ["admin-properties"],
    queryFn: () => getAdminProperties(),
  });

  const filtered = useMemo(() => {
    if (!properties) return [];
    return (properties as Property[]).filter((p) => {
      if (!showDeleted && p.is_deleted) return false;
      if (filterCategory !== "all" && p.category !== filterCategory) return false;
      if (filterStatus !== "all" && p.status !== filterStatus) return false;
      if (filterActive === "active" && !p.is_active) return false;
      if (filterActive === "inactive" && p.is_active) return false;
      if (filterFeatured === "featured" && !p.is_featured) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !p.name.toLowerCase().includes(q) &&
          !p.city.toLowerCase().includes(q) &&
          !p.location.toLowerCase().includes(q) &&
          !p.slug.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [properties, search, filterCategory, filterStatus, filterActive, filterFeatured, showDeleted]);

  const createMut = useMutation({
    mutationFn: (data: FormState) =>
      createProperty({
        data: {
          ...data,
          image_url: data.image_url || null,
        },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-properties"] });
      qc.invalidateQueries({ queryKey: ["public-properties"] });
      setShowCreate(false);
      toast.success("Property created successfully");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Creation failed"),
  });

  const updateMut = useMutation({
    mutationFn: (data: { id: string } & FormState) =>
      updateProperty({
        data: {
          ...data,
          image_url: data.image_url || null,
        },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-properties"] });
      qc.invalidateQueries({ queryKey: ["public-properties"] });
      setEditingProp(null);
      toast.success("Property updated");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Update failed"),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteProperty({ data: { id } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-properties"] });
      qc.invalidateQueries({ queryKey: ["public-properties"] });
      setDeleteTarget(null);
      toast.success("Property removed (soft deleted)");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Delete failed"),
  });

  const toggleActiveMut = useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      togglePropertyActive({ data: { id, is_active } }),
    onSuccess: (_, { is_active }) => {
      qc.invalidateQueries({ queryKey: ["admin-properties"] });
      qc.invalidateQueries({ queryKey: ["public-properties"] });
      toast.success(is_active ? "Property is now visible" : "Property hidden from public");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Toggle failed"),
  });

  const toggleFeaturedMut = useMutation({
    mutationFn: ({ id, is_featured }: { id: string; is_featured: boolean }) =>
      togglePropertyFeatured({ data: { id, is_featured } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-properties"] });
      qc.invalidateQueries({ queryKey: ["public-properties"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Toggle failed"),
  });

  const counts = useMemo(() => {
    if (!properties) return { total: 0, active: 0, featured: 0, deleted: 0 };
    const all = properties as Property[];
    return {
      total: all.filter((p) => !p.is_deleted).length,
      active: all.filter((p) => p.is_active && !p.is_deleted).length,
      featured: all.filter((p) => p.is_featured && !p.is_deleted).length,
      deleted: all.filter((p) => p.is_deleted).length,
    };
  }, [properties]);

  return (
    <div className="portal-page">
      {/* Page Header */}
      <div className="portal-page-header">
        <div>
          <h1 className="portal-page-title">Properties</h1>
          <p className="portal-page-desc">
            Manage the property listings shown on the public Residences gallery.
          </p>
        </div>
        <button className="portal-btn-primary" onClick={() => setShowCreate(true)}>
          <Plus size={16} />
          Add Property
        </button>
      </div>

      {/* Stats row */}
      <div
        className="portal-stats-grid"
        style={{ gridTemplateColumns: "repeat(4, 1fr)", marginBottom: "1.5rem" }}
      >
        {[
          { label: "Total", value: counts.total, color: "stat-blue" },
          { label: "Active", value: counts.active, color: "stat-green" },
          { label: "Featured", value: counts.featured, color: "stat-amber" },
          { label: "Deleted", value: counts.deleted, color: "stat-rose" },
        ].map((s) => (
          <div key={s.label} className={`portal-stat-card ${s.color}`}>
            <div className="portal-stat-body">
              <span className="portal-stat-value">{s.value}</span>
              <span className="portal-stat-label">{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filters toolbar */}
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
            placeholder="Search name, city, slug…"
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
            <option value="Metro Core">Metro Core</option>
            <option value="Suburban Enclaves">Suburban Enclaves</option>
            <option value="Resort & Leisure">Resort & Leisure</option>
          </select>
          <ChevronDown size={13} className="portal-select-icon" />
        </div>

        {/* Status filter */}
        <div className="portal-select-wrap" style={{ minWidth: "140px" }}>
          <select
            className="portal-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Pre-selling">Pre-selling</option>
            <option value="RFO">RFO</option>
          </select>
          <ChevronDown size={13} className="portal-select-icon" />
        </div>

        {/* Active filter */}
        <div className="portal-select-wrap" style={{ minWidth: "130px" }}>
          <select
            className="portal-select"
            value={filterActive}
            onChange={(e) => setFilterActive(e.target.value)}
          >
            <option value="all">All Visibility</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <ChevronDown size={13} className="portal-select-icon" />
        </div>

        {/* Featured filter */}
        <div className="portal-select-wrap" style={{ minWidth: "130px" }}>
          <select
            className="portal-select"
            value={filterFeatured}
            onChange={(e) => setFilterFeatured(e.target.value)}
          >
            <option value="all">All</option>
            <option value="featured">Featured only</option>
          </select>
          <ChevronDown size={13} className="portal-select-icon" />
        </div>

        {/* Show deleted toggle */}
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            fontSize: "13px",
            color: "var(--zinc-400)",
            cursor: "pointer",
            userSelect: "none",
            whiteSpace: "nowrap",
          }}
        >
          <input
            type="checkbox"
            checked={showDeleted}
            onChange={(e) => setShowDeleted(e.target.checked)}
          />
          Show deleted
        </label>
      </div>

      {/* Table */}
      <div className="portal-card no-pad">
        <div className="portal-table-wrap">
          <table className="portal-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Location</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Beds</th>
                <th style={{ textAlign: "center" }}>Active</th>
                <th style={{ textAlign: "center" }}>Featured</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="skeleton-row">
                    <td colSpan={9}>
                      <div className="skeleton table-skeleton" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="portal-table-empty">
                    <FolderOpen size={32} />
                    <span>No properties found. Adjust filters or add a new one.</span>
                  </td>
                </tr>
              ) : (
                filtered.map((prop) => (
                  <tr
                    key={prop.id}
                    className="portal-table-row"
                    style={{ opacity: prop.is_deleted ? 0.45 : prop.is_active ? 1 : 0.65 }}
                  >
                    {/* Property name + slug */}
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                        <span
                          className="font-bold text-zinc-100"
                          style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
                        >
                          {prop.name}
                          {prop.is_spotlight && (
                            <span
                              style={{
                                fontSize: "10px",
                                color: "oklch(0.78 0.18 75)",
                                background: "rgba(234,179,8,0.12)",
                                border: "1px solid rgba(234,179,8,0.25)",
                                borderRadius: "4px",
                                padding: "1px 6px",
                                fontWeight: "bold",
                              }}
                            >
                              ★ SPOTLIGHT
                            </span>
                          )}
                          {prop.promo_badge && (
                            <span
                              style={{
                                fontSize: "10px",
                                color: "#60a5fa",
                                background: "rgba(96,165,250,0.12)",
                                border: "1px solid rgba(96,165,250,0.25)",
                                borderRadius: "4px",
                                padding: "1px 6px",
                              }}
                            >
                              {prop.promo_badge}
                            </span>
                          )}
                          {prop.is_deleted && (
                            <span
                              style={{
                                fontSize: "10px",
                                color: "#f87171",
                                background: "rgba(248,113,113,0.12)",
                                border: "1px solid rgba(248,113,113,0.25)",
                                borderRadius: "4px",
                                padding: "1px 6px",
                              }}
                            >
                              DELETED
                            </span>
                          )}
                        </span>
                        <span className="text-[11px] text-zinc-400 font-mono">
                          /{prop.slug}{" "}
                          {prop.is_featured && (
                            <span style={{ color: "var(--zinc-500)" }}>
                              (Rank: {prop.featured_rank ?? 0})
                            </span>
                          )}
                        </span>
                      </div>
                    </td>

                    {/* Location */}
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                        <span style={{ fontSize: "13px", color: "var(--zinc-200)" }}>
                          {prop.location}
                        </span>
                        <span style={{ fontSize: "11px", color: "var(--zinc-500)" }}>
                          {prop.city}
                        </span>
                      </div>
                    </td>

                    {/* Category chip */}
                    <td>
                      <span className="portal-source-chip" style={{ fontSize: "11px" }}>
                        {prop.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "var(--zinc-100)",
                            fontFamily: "var(--font-mono)",
                          }}
                        >
                          {prop.price_display}
                        </span>
                        <span style={{ fontSize: "10px", color: "var(--zinc-500)" }}>
                          {prop.status}
                        </span>
                      </div>
                    </td>

                    {/* Status badge */}
                    <td>
                      <span
                        className={`portal-status-badge status-${prop.status === "RFO" ? "closed" : "new"}`}
                      >
                        {prop.status}
                      </span>
                    </td>

                    {/* Beds */}
                    <td style={{ color: "var(--zinc-400)", fontSize: "13px" }}>
                      {prop.beds}b · {prop.baths}ba
                    </td>

                    {/* Active toggle */}
                    <td style={{ textAlign: "center" }}>
                      <button
                        disabled={prop.is_deleted || toggleActiveMut.isPending}
                        onClick={() =>
                          toggleActiveMut.mutate({ id: prop.id, is_active: !prop.is_active })
                        }
                        title={prop.is_active ? "Click to hide" : "Click to show"}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: prop.is_deleted ? "default" : "pointer",
                          color: prop.is_active ? "oklch(0.72 0.20 145)" : "var(--zinc-600)",
                          transition: "color 0.2s",
                        }}
                      >
                        {prop.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                    </td>

                    {/* Featured toggle */}
                    <td style={{ textAlign: "center" }}>
                      <button
                        disabled={prop.is_deleted || toggleFeaturedMut.isPending}
                        onClick={() =>
                          toggleFeaturedMut.mutate({ id: prop.id, is_featured: !prop.is_featured })
                        }
                        title={prop.is_featured ? "Remove from featured" : "Mark as featured"}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: prop.is_deleted ? "default" : "pointer",
                          color: prop.is_featured ? "oklch(0.78 0.18 75)" : "var(--zinc-600)",
                          transition: "color 0.2s",
                        }}
                      >
                        {prop.is_featured ? <Star size={16} /> : <StarOff size={16} />}
                      </button>
                    </td>

                    {/* Actions */}
                    <td>
                      <div style={{ display: "flex", gap: "0.4rem", justifyContent: "flex-end" }}>
                        {!prop.is_deleted && (
                          <>
                            <button
                              className="portal-icon-btn"
                              title="Edit property"
                              onClick={() => setEditingProp(prop)}
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              className="portal-icon-btn hover:text-red-500"
                              title="Delete property"
                              onClick={() => setDeleteTarget(prop)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!isLoading && filtered.length > 0 && (
          <div
            style={{
              padding: "0.75rem 1.25rem",
              borderTop: "1px solid oklch(0.25 0.015 258)",
              fontSize: "12px",
              color: "var(--zinc-500)",
            }}
          >
            Showing {filtered.length} of{" "}
            {(properties as Property[] | undefined)?.filter((p) => !p.is_deleted).length ?? 0}{" "}
            properties
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <PropertyFormModal
          mode="create"
          initial={EMPTY_FORM}
          onClose={() => setShowCreate(false)}
          onSubmit={(data) => createMut.mutate(data)}
          isSubmitting={createMut.isPending}
        />
      )}

      {/* Edit Modal */}
      {editingProp && (
        <PropertyFormModal
          mode="edit"
          initial={{
            name: editingProp.name,
            developer: editingProp.developer,
            city: editingProp.city,
            location: editingProp.location,
            price_display: editingProp.price_display,
            price_min: editingProp.price_min,
            status: editingProp.status,
            beds: editingProp.beds,
            baths: editingProp.baths,
            area: editingProp.area,
            description: editingProp.description,
            highlights: Array.isArray(editingProp.highlights) ? editingProp.highlights : [],
            category: editingProp.category,
            image_url: editingProp.image_url ?? "",
            is_featured: editingProp.is_featured,
            is_active: editingProp.is_active,
            display_order: editingProp.display_order,
            promo_badge: editingProp.promo_badge ?? "",
            is_spotlight: editingProp.is_spotlight ?? false,
            featured_rank: editingProp.featured_rank ?? 0,
          }}
          onClose={() => setEditingProp(null)}
          onSubmit={(data) => updateMut.mutate({ id: editingProp.id, ...data })}
          isSubmitting={updateMut.isPending}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="portal-detail-overlay" onClick={() => setDeleteTarget(null)}>
          <div
            className="portal-detail-panel"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "440px" }}
          >
            <div className="portal-detail-header">
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <AlertTriangle size={18} style={{ color: "#f87171" }} />
                <h2 className="portal-detail-name">Delete Property?</h2>
              </div>
              <button className="portal-detail-close" onClick={() => setDeleteTarget(null)}>
                ✕
              </button>
            </div>
            <div className="portal-detail-body">
              <p style={{ fontSize: "14px", color: "var(--zinc-300)", lineHeight: 1.6 }}>
                You are about to soft-delete{" "}
                <strong style={{ color: "var(--zinc-100)" }}>{deleteTarget.name}</strong>. It will
                be hidden from the public site and can be recovered later.
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "0.75rem",
                  marginTop: "1.5rem",
                }}
              >
                <button className="portal-btn-ghost" onClick={() => setDeleteTarget(null)}>
                  Cancel
                </button>
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    background: "rgba(248,113,113,0.15)",
                    border: "1px solid rgba(248,113,113,0.35)",
                    color: "#f87171",
                    borderRadius: "8px",
                    padding: "0.5rem 1rem",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                  onClick={() => deleteMut.mutate(deleteTarget.id)}
                  disabled={deleteMut.isPending}
                >
                  <Trash2 size={14} />
                  {deleteMut.isPending ? "Deleting…" : "Soft Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
