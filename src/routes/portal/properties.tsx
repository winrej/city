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
  LayoutList,
  LayoutGrid,
  MapPin,
  DollarSign,
  BedDouble,
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
  price_max: number;
  price_max_display: string;
  status: "Pre-selling" | "RFO";
  beds: number;
  baths: number;
  area: string;
  unit_types: string[];
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
  price_max: number;
  price_max_display: string;
  status: "Pre-selling" | "RFO";
  beds: number;
  baths: number;
  area: string;
  unit_types: string[];
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
  autoCreateProject: boolean;
};

const EMPTY_FORM: FormState = {
  name: "",
  developer: "DMCI Homes",
  city: "",
  location: "",
  price_display: "",
  price_min: 0,
  price_max: 0,
  price_max_display: "",
  status: "Pre-selling",
  beds: 1,
  baths: 1,
  area: "",
  unit_types: [],
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
  autoCreateProject: true,
};

function PropertyFormModal({
  mode,
  initial,
  onClose,
  onSubmit,
  isSubmitting,
  existingProperties = [],
  editingId,
}: {
  mode: "create" | "edit";
  initial: FormState;
  onClose: () => void;
  onSubmit: (data: FormState) => void;
  isSubmitting: boolean;
  existingProperties?: Property[];
  editingId?: string;
}) {
  const [form, setForm] = useState<FormState>(initial);
  const [highlightInput, setHighlightInput] = useState("");
  const [unitTypeInput, setUnitTypeInput] = useState("");

  const set = (key: keyof FormState, value: any) => setForm((prev) => ({ ...prev, [key]: value }));

  const duplicateWarning = useMemo(() => {
    if (!form.name || !existingProperties) return null;
    const nameLower = form.name.trim().toLowerCase();
    const generatedSlug = form.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    const matches = existingProperties.filter((p) => {
      if (p.is_deleted) return false;
      if (mode === "edit" && p.id === editingId) return false;

      const isNameMatch = p.name.trim().toLowerCase() === nameLower;
      const isSlugMatch = p.slug.trim().toLowerCase() === generatedSlug;
      const isSpecMatch =
        p.developer.trim().toLowerCase() === form.developer.trim().toLowerCase() &&
        p.city.trim().toLowerCase() === form.city.trim().toLowerCase() &&
        p.location.trim().toLowerCase() === form.location.trim().toLowerCase() &&
        p.beds === form.beds &&
        p.baths === form.baths &&
        p.price_min === form.price_min;

      return isNameMatch || isSlugMatch || isSpecMatch;
    });

    if (matches.length > 0) {
      const reasons = [];
      if (matches.some((m) => m.name.trim().toLowerCase() === nameLower)) reasons.push("name");
      if (matches.some((m) => m.slug.trim().toLowerCase() === generatedSlug)) reasons.push("slug");
      if (reasons.length === 0) reasons.push("specifications");
      return {
        count: matches.length,
        reasons: reasons.join(" & "),
        names: matches.map((m) => m.name).join(", "),
      };
    }
    return null;
  }, [
    form.name,
    form.developer,
    form.city,
    form.location,
    form.beds,
    form.baths,
    form.price_min,
    existingProperties,
    mode,
    editingId,
  ]);

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

  const addUnitType = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && !form.unit_types.includes(trimmed)) {
      set("unit_types", [...form.unit_types, trimmed]);
    }
    setUnitTypeInput("");
  };

  const removeUnitType = (i: number) => {
    set(
      "unit_types",
      form.unit_types.filter((_, idx) => idx !== i),
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
            {duplicateWarning && (
              <div
                style={{
                  marginTop: "0.5rem",
                  padding: "0.6rem 0.8rem",
                  background: "rgba(212, 163, 89, 0.08)",
                  border: "1px solid rgba(212, 163, 89, 0.25)",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "12px",
                  color: "oklch(0.74 0.137 79)",
                }}
              >
                <AlertTriangle size={14} style={{ flexShrink: 0 }} />
                <span>
                  <strong>Warning:</strong> Similar active property detected ({duplicateWarning.count} match(es) on {duplicateWarning.reasons}: <em>{duplicateWarning.names}</em>).
                </span>
              </div>
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

          {/* Max Price (optional — shows "Up to …" on the card) */}
          <div className="portal-grid-2col">
            <div className="portal-field">
              <label className="portal-field-label">Max Price Display</label>
              <input
                className="portal-input"
                placeholder="e.g. ₱11.2M"
                value={form.price_max_display}
                onChange={(e) => set("price_max_display", e.target.value)}
              />
            </div>
            <div className="portal-field">
              <label className="portal-field-label">Price Max (millions)</label>
              <input
                className="portal-input"
                type="number"
                step="0.1"
                min="0"
                placeholder="e.g. 11.2"
                value={form.price_max || ""}
                onChange={(e) => set("price_max", parseFloat(e.target.value) || 0)}
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

          {/* Unit Types */}
          <div className="portal-field">
            <label className="portal-field-label">Unit Types</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                className="portal-input"
                placeholder="e.g. 1BR, 2BR, 3BR — type and press Enter"
                value={unitTypeInput}
                onChange={(e) => setUnitTypeInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addUnitType(unitTypeInput);
                  }
                }}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="portal-btn-primary"
                style={{ padding: "0 0.75rem", flexShrink: 0 }}
                onClick={() => addUnitType(unitTypeInput)}
              >
                <Plus size={14} />
              </button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.5rem" }}>
              {["Studio", "1BR", "2BR", "3BR", "Penthouse"]
                .filter((t) => !form.unit_types.includes(t))
                .map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => addUnitType(t)}
                    style={{
                      background: "none",
                      border: "1px dashed oklch(0.4 0.02 258)",
                      borderRadius: "999px",
                      padding: "0.2rem 0.65rem",
                      fontSize: "12px",
                      color: "var(--zinc-400)",
                      cursor: "pointer",
                    }}
                  >
                    + {t}
                  </button>
                ))}
            </div>
            {form.unit_types.length > 0 && (
              <div
                style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.5rem" }}
              >
                {form.unit_types.map((u, i) => (
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
                    {u}
                    <button
                      type="button"
                      onClick={() => removeUnitType(i)}
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
              {mode === "create" && (
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    cursor: "pointer",
                    fontSize: "13px",
                    color: "oklch(0.74 0.137 79)",
                    fontWeight: "bold",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={form.autoCreateProject}
                    onChange={(e) => set("autoCreateProject", e.target.checked)}
                  />
                  Auto-create matching Project page
                </label>
              )}
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
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");

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

  const duplicateIds = useMemo(() => {
    if (!properties) return new Set<string>();
    const dupes = new Set<string>();
    const all = (properties as Property[]).filter((p) => !p.is_deleted);
    for (let i = 0; i < all.length; i++) {
      const p1 = all[i];
      for (let j = i + 1; j < all.length; j++) {
        const p2 = all[j];
        const isNameMatch = p1.name.trim().toLowerCase() === p2.name.trim().toLowerCase();
        const isSlugMatch = p1.slug.trim().toLowerCase() === p2.slug.trim().toLowerCase();
        const isSpecMatch =
          p1.developer.trim().toLowerCase() === p2.developer.trim().toLowerCase() &&
          p1.city.trim().toLowerCase() === p2.city.trim().toLowerCase() &&
          p1.location.trim().toLowerCase() === p2.location.trim().toLowerCase() &&
          p1.beds === p2.beds &&
          p1.baths === p2.baths &&
          p1.price_min === p2.price_min;

        if (isNameMatch || isSlugMatch || isSpecMatch) {
          dupes.add(p1.id);
          dupes.add(p2.id);
        }
      }
    }
    return dupes;
  }, [properties]);

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
        <div className="portal-page-header-actions">
          <button className="portal-btn-primary" onClick={() => setShowCreate(true)}>
            <Plus size={16} />
            Add Property
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="portal-stats-row">
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

      {/* Toolbar */}
      <div className="portal-toolbar">
        {/* Search */}
        <div className="portal-toolbar-search">
          <Search size={14} className="portal-toolbar-search-icon" />
          <input
            className="portal-input"
            placeholder="Search name, city, slug…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="portal-toolbar-filters">
          <div className="portal-select-wrap" style={{ minWidth: "150px" }}>
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

          <div className="portal-select-wrap" style={{ minWidth: "130px" }}>
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

          <div className="portal-select-wrap" style={{ minWidth: "130px" }}>
            <select
              className="portal-select"
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value)}
            >
              <option value="all">All Visibility</option>
              <option value="active">Active only</option>
              <option value="inactive">Inactive only</option>
            </select>
            <ChevronDown size={13} className="portal-select-icon" />
          </div>

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

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              fontSize: "12px",
              color: "var(--portal-text-muted)",
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
            Deleted
          </label>
        </div>

        {/* View Toggle */}
        <div className="portal-view-toggle">
          <button
            className={`portal-view-btn ${viewMode === "cards" ? "active" : ""}`}
            onClick={() => setViewMode("cards")}
            title="Card view"
          >
            <LayoutGrid size={15} />
          </button>
          <button
            className={`portal-view-btn ${viewMode === "table" ? "active" : ""}`}
            onClick={() => setViewMode("table")}
            title="Table view"
          >
            <LayoutList size={15} />
          </button>
        </div>
      </div>

      {/* Content: Cards or Table */}
      <div className="portal-card no-pad">
        {isLoading ? (
          <div className="portal-item-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="portal-item-card" style={{ minHeight: "160px" }}>
                <div className="skeleton" style={{ height: "14px", width: "60%", borderRadius: "6px" }} />
                <div className="skeleton" style={{ height: "12px", width: "40%", borderRadius: "6px" }} />
                <div className="skeleton" style={{ height: "48px", borderRadius: "6px" }} />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="portal-table-empty">
            <FolderOpen size={36} />
            <span>No properties found. Adjust filters or add a new one.</span>
          </div>
        ) : viewMode === "cards" ? (
          /* ── Card Grid View ── */
          <div className="portal-item-grid">
            {filtered.map((prop) => (
              <div
                key={prop.id}
                className={`portal-item-card ${!prop.is_active && !prop.is_deleted ? "is-inactive" : ""} ${prop.is_deleted ? "is-deleted" : ""}`}
              >
                {/* Card Header */}
                <div className="portal-item-card-header">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="portal-item-card-title">{prop.name}</div>
                    <div className="portal-item-card-slug">/{prop.slug}</div>
                    {/* Badges */}
                    <div className="portal-item-card-badges" style={{ marginTop: "0.4rem" }}>
                      <span className="portal-source-chip" style={{ fontSize: "11px" }}>
                        {prop.category}
                      </span>
                      <span
                        className={`portal-status-badge status-${prop.status === "RFO" ? "closed" : "new"}`}
                      >
                        {prop.status}
                      </span>
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
                          ★ Spotlight
                        </span>
                      )}
                      {duplicateIds.has(prop.id) && !prop.is_deleted && (
                        <span
                          title="Duplicate detected"
                          style={{
                            fontSize: "10px",
                            color: "oklch(0.74 0.137 79)",
                            background: "rgba(212,163,89,0.12)",
                            border: "1px solid rgba(212,163,89,0.25)",
                            borderRadius: "4px",
                            padding: "1px 6px",
                            fontWeight: "bold",
                          }}
                        >
                          ⚠️ Duplicate
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
                          Deleted
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Meta Grid */}
                <div className="portal-item-card-meta">
                  <div className="portal-item-card-meta-item">
                    <span className="portal-item-card-meta-label">Location</span>
                    <span className="portal-item-card-meta-value" style={{ fontSize: "0.75rem" }}>
                      {prop.location}
                    </span>
                  </div>
                  <div className="portal-item-card-meta-item">
                    <span className="portal-item-card-meta-label">Price</span>
                    <span
                      className="portal-item-card-meta-value"
                      style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "oklch(0.8 0.16 145)" }}
                    >
                      {prop.price_display}
                    </span>
                  </div>
                  <div className="portal-item-card-meta-item">
                    <span className="portal-item-card-meta-label">Developer</span>
                    <span className="portal-item-card-meta-value" style={{ fontSize: "0.75rem" }}>
                      {prop.developer}
                    </span>
                  </div>
                  <div className="portal-item-card-meta-item">
                    <span className="portal-item-card-meta-label">Specs</span>
                    <span className="portal-item-card-meta-value" style={{ fontSize: "0.75rem" }}>
                      {prop.beds}BR · {prop.baths}BA · {prop.area}
                    </span>
                  </div>
                </div>

                {/* Footer: toggles + actions */}
                <div className="portal-item-card-footer">
                  <div className="portal-item-card-toggles">
                    <button
                      disabled={prop.is_deleted || toggleActiveMut.isPending}
                      onClick={() =>
                        toggleActiveMut.mutate({ id: prop.id, is_active: !prop.is_active })
                      }
                      className={`portal-toggle-pill ${prop.is_active ? "active" : ""}`}
                      title={prop.is_active ? "Visible – click to hide" : "Hidden – click to show"}
                    >
                      {prop.is_active ? <Eye size={11} /> : <EyeOff size={11} />}
                      {prop.is_active ? "Live" : "Hidden"}
                    </button>
                    <button
                      disabled={prop.is_deleted || toggleFeaturedMut.isPending}
                      onClick={() =>
                        toggleFeaturedMut.mutate({ id: prop.id, is_featured: !prop.is_featured })
                      }
                      className={`portal-toggle-pill ${prop.is_featured ? "featured" : ""}`}
                      title={prop.is_featured ? "Featured – click to unfeature" : "Not featured"}
                    >
                      {prop.is_featured ? <Star size={11} /> : <StarOff size={11} />}
                      {prop.is_featured ? "Featured" : "Feature"}
                    </button>
                  </div>
                  <div className="portal-item-card-actions">
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
                          className="portal-icon-btn"
                          title="Delete property"
                          style={{ color: "oklch(0.7 0.2 25)" }}
                          onClick={() => setDeleteTarget(prop)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ── Table View ── */
          <div className="portal-table-wrap">
            <table className="portal-table">
              <thead>
                <tr>
                  <th>Property</th>
                  <th className="hide-mobile">Location</th>
                  <th className="hide-mobile">Category</th>
                  <th>Price</th>
                  <th className="hide-mobile">Beds</th>
                  <th style={{ textAlign: "center" }}>Active</th>
                  <th style={{ textAlign: "center" }}>Featured</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((prop) => (
                  <tr
                    key={prop.id}
                    className="portal-table-row"
                    style={{ opacity: prop.is_deleted ? 0.45 : prop.is_active ? 1 : 0.65 }}
                  >
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                        <span
                          className="font-bold text-zinc-100"
                          style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap" }}
                        >
                          {prop.name}
                          {prop.is_spotlight && (
                            <span style={{ fontSize: "10px", color: "oklch(0.78 0.18 75)", background: "rgba(234,179,8,0.12)", border: "1px solid rgba(234,179,8,0.25)", borderRadius: "4px", padding: "1px 6px", fontWeight: "bold" }}>
                              ★
                            </span>
                          )}
                          {duplicateIds.has(prop.id) && !prop.is_deleted && (
                            <span title="Duplicate detected" style={{ fontSize: "10px", color: "oklch(0.74 0.137 79)", background: "rgba(212,163,89,0.12)", border: "1px solid rgba(212,163,89,0.25)", borderRadius: "4px", padding: "1px 6px", fontWeight: "bold" }}>
                              ⚠️ Dup
                            </span>
                          )}
                          {prop.is_deleted && (
                            <span style={{ fontSize: "10px", color: "#f87171", background: "rgba(248,113,113,0.12)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: "4px", padding: "1px 6px" }}>
                              DEL
                            </span>
                          )}
                        </span>
                        <span style={{ fontSize: "11px", color: "var(--zinc-400)", fontFamily: "var(--font-mono)" }}>
                          /{prop.slug}
                        </span>
                      </div>
                    </td>
                    <td className="hide-mobile">
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
                        <span style={{ fontSize: "13px", color: "var(--zinc-200)" }}>{prop.location}</span>
                        <span style={{ fontSize: "11px", color: "var(--zinc-500)" }}>{prop.city}</span>
                      </div>
                    </td>
                    <td className="hide-mobile">
                      <span className="portal-source-chip" style={{ fontSize: "11px" }}>{prop.category}</span>
                    </td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--zinc-100)", fontFamily: "var(--font-mono)" }}>
                          {prop.price_display}
                        </span>
                        <span className={`portal-status-badge status-${prop.status === "RFO" ? "closed" : "new"}`} style={{ alignSelf: "flex-start" }}>
                          {prop.status}
                        </span>
                      </div>
                    </td>
                    <td className="hide-mobile" style={{ color: "var(--zinc-400)", fontSize: "13px" }}>
                      {prop.beds}b · {prop.baths}ba
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        disabled={prop.is_deleted || toggleActiveMut.isPending}
                        onClick={() => toggleActiveMut.mutate({ id: prop.id, is_active: !prop.is_active })}
                        title={prop.is_active ? "Click to hide" : "Click to show"}
                        style={{ background: "none", border: "none", cursor: prop.is_deleted ? "default" : "pointer", color: prop.is_active ? "oklch(0.72 0.20 145)" : "var(--zinc-600)", transition: "color 0.2s" }}
                      >
                        {prop.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        disabled={prop.is_deleted || toggleFeaturedMut.isPending}
                        onClick={() => toggleFeaturedMut.mutate({ id: prop.id, is_featured: !prop.is_featured })}
                        title={prop.is_featured ? "Remove from featured" : "Mark as featured"}
                        style={{ background: "none", border: "none", cursor: prop.is_deleted ? "default" : "pointer", color: prop.is_featured ? "oklch(0.78 0.18 75)" : "var(--zinc-600)", transition: "color 0.2s" }}
                      >
                        {prop.is_featured ? <Star size={16} /> : <StarOff size={16} />}
                      </button>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.4rem", justifyContent: "flex-end" }}>
                        {!prop.is_deleted && (
                          <>
                            <button className="portal-icon-btn" title="Edit property" onClick={() => setEditingProp(prop)}>
                              <Edit3 size={14} />
                            </button>
                            <button className="portal-icon-btn" title="Delete property" style={{ color: "oklch(0.7 0.2 25)" }} onClick={() => setDeleteTarget(prop)}>
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer count */}
        {!isLoading && filtered.length > 0 && (
          <div
            style={{
              padding: "0.6rem 1.25rem",
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
          existingProperties={properties as Property[]}
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
            price_max: editingProp.price_max ?? 0,
            price_max_display: editingProp.price_max_display ?? "",
            status: editingProp.status,
            beds: editingProp.beds,
            baths: editingProp.baths,
            area: editingProp.area,
            unit_types: Array.isArray(editingProp.unit_types) ? editingProp.unit_types : [],
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
            autoCreateProject: false,
          }}
          onClose={() => setEditingProp(null)}
          onSubmit={(data) => updateMut.mutate({ id: editingProp.id, ...data })}
          isSubmitting={updateMut.isPending}
          existingProperties={properties as Property[]}
          editingId={editingProp.id}
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
                  className="portal-btn-danger"
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

