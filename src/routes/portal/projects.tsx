import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import {
  FolderOpen,
  Plus,
  Trash2,
  Edit3,
  ArrowLeft,
  Save,
  Sparkles,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  Activity,
  Layers,
  Settings,
  HelpCircle,
  AlertCircle,
  CheckCircle,
  Eye,
  FileText,
  Search,
  LayoutGrid,
  LayoutList,
  MapPin,
  DollarSign,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import {
  getAdminProjects,
  createProject,
  deleteProject,
  deleteProjects,
  saveProjectDraft,
  publishProject,
  getProjectBySlug,
  getAdminProperties,
} from "../../lib/api/admin.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/projects")({
  component: ProjectsPage,
});

type TabType = "general" | "sections" | "units" | "preview" | "raw";

function ProjectsPage() {
  const qc = useQueryClient();
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeProjectSlug, setActiveProjectSlug] = useState<string | null>(null);
  const [activeProjectTitle, setActiveProjectTitle] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProj, setNewProj] = useState({
    title: "",
    slug: "",
    category: "Metro Core" as const,
    developer: "DMCI Homes",
    city: "",
    full_address: "",
    min_price: 4500000,
    max_price: 13500000,
    location_district: "",
  });

  // Fetch admin projects list
  const {
    data: projects = [],
    isLoading: listLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: () => getAdminProjects(),
  });

  // Fetch properties list to link with projects
  const { data: properties } = useQuery({
    queryKey: ["admin-properties"],
    queryFn: () => getAdminProperties(),
  });

  const existingProjectSlugs = useMemo(() => {
    if (!projects) return new Set<string>();
    return new Set(projects.map((p: any) => p.slug));
  }, [projects]);

  const duplicateIds = useMemo(() => {
    if (!projects) return new Set<string>();
    const dupes = new Set<string>();
    const all = projects as any[];
    for (let i = 0; i < all.length; i++) {
      const p1 = all[i];
      for (let j = i + 1; j < all.length; j++) {
        const p2 = all[j];
        const isTitleMatch = p1.title.trim().toLowerCase() === p2.title.trim().toLowerCase();
        const isSlugMatch = p1.slug.trim().toLowerCase() === p2.slug.trim().toLowerCase();
        const isSpecMatch =
          p1.developer.trim().toLowerCase() === p2.developer.trim().toLowerCase() &&
          p1.city.trim().toLowerCase() === p2.city.trim().toLowerCase() &&
          p1.min_price === p2.min_price &&
          p1.max_price === p2.max_price;

        if (isTitleMatch || isSlugMatch || isSpecMatch) {
          dupes.add(p1.id);
          dupes.add(p2.id);
        }
      }
    }
    return dupes;
  }, [projects]);

  const newProjDuplicateWarning = useMemo(() => {
    if (!newProj.title || !projects) return null;
    const titleLower = newProj.title.trim().toLowerCase();
    const slugLower = newProj.slug.trim().toLowerCase();

    const matches = projects.filter((p: any) => {
      const isTitleMatch = p.title.trim().toLowerCase() === titleLower;
      const isSlugMatch = p.slug.trim().toLowerCase() === slugLower;
      const isSpecMatch =
        p.developer.trim().toLowerCase() === newProj.developer.trim().toLowerCase() &&
        p.city.trim().toLowerCase() === newProj.city.trim().toLowerCase() &&
        p.min_price === newProj.min_price &&
        p.max_price === newProj.max_price;

      return isTitleMatch || isSlugMatch || isSpecMatch;
    });

    if (matches.length > 0) {
      const reasons = [];
      if (matches.some((m: any) => m.title.trim().toLowerCase() === titleLower)) reasons.push("title");
      if (matches.some((m: any) => m.slug.trim().toLowerCase() === slugLower)) reasons.push("slug");
      if (reasons.length === 0) reasons.push("specifications");
      return {
        count: matches.length,
        reasons: reasons.join(" & "),
        names: matches.map((m: any) => m.title).join(", "),
      };
    }
    return null;
  }, [newProj, projects]);

  const unlinkedProperties = useMemo(() => {
    if (!properties) return [];
    return (properties as any[]).filter(
      (p) => !p.is_deleted && !existingProjectSlugs.has(p.slug)
    );
  }, [properties, existingProjectSlugs]);

  const createMutation = useMutation({
    mutationFn: (vars: Parameters<typeof createProject>[0]) => createProject(vars),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["admin-projects"] });
      setShowCreateModal(false);
      setNewProj({
        title: "",
        slug: "",
        category: "Metro Core",
        developer: "DMCI Homes",
        city: "",
        full_address: "",
        min_price: 4500000,
        max_price: 13500000,
        location_district: "",
      });
      toast.success("Project created successfully");
      // Open editor for new project
      if (res && "id" in res) {
        const matching = projects?.find((p: any) => p.id === res.id);
        setActiveProjectId(res.id);
        if (matching) {
          setActiveProjectSlug(matching.slug);
          setActiveProjectTitle(matching.title);
        } else {
          // Fallback
          setActiveProjectSlug(newProj.slug);
          setActiveProjectTitle(newProj.title);
        }
      }
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Creation failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProject({ data: { id } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-projects"] });
      toast.success("Project deleted successfully");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Deletion failed"),
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => deleteProjects({ data: { ids } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-projects"] });
      toast.success(`${selectedIds.length} projects deleted.`);
      setSelectedIds([]);
      setBulkDeleteConfirm(false);
    },
    onError: (err: any) => {
      toast.error(err?.message ?? "Failed to delete projects.");
    },
  });

  const filteredProjects = useMemo(() => {
    return projects.filter((p: any) => {
      if (filterCategory !== "all" && p.category !== filterCategory) return false;
      if (filterStatus !== "all" && p.status !== filterStatus) return false;
      
      if (search) {
        const q = search.toLowerCase();
        if (
          !p.title.toLowerCase().includes(q) &&
          !p.slug.toLowerCase().includes(q) &&
          !p.city.toLowerCase().includes(q) &&
          !p.developer.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [projects, search, filterCategory, filterStatus]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProjects.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProjects.map((p: any) => p.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  if (activeProjectId && activeProjectSlug) {
    return (
      <ProjectEditor
        projectId={activeProjectId}
        slug={activeProjectSlug}
        projectTitle={activeProjectTitle || "Edit Project"}
        onBack={() => {
          setActiveProjectId(null);
          setActiveProjectSlug(null);
          setActiveProjectTitle(null);
          refetch();
        }}
      />
    );
  }

  return (
    <div className="portal-page">
      {/* Page Header */}
      <div className="portal-page-header">
        <div>
          <h1 className="portal-page-title">Projects</h1>
          <p className="portal-page-desc">
            Manage your dynamic property CMS profiles, configurations, and landing page layouts.
          </p>
        </div>
        <div className="portal-page-header-actions">
          {selectedIds.length > 0 && (
            bulkDeleteConfirm ? (
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <span style={{ fontSize: "0.8125rem", color: "oklch(0.6 0.18 25)" }}>
                  Delete {selectedIds.length} items?
                </span>
                <button
                  onClick={() => bulkDeleteMutation.mutate(selectedIds)}
                  disabled={bulkDeleteMutation.isPending}
                  className="portal-btn-danger"
                  style={{ padding: "0.4rem 0.8rem", fontSize: "0.75rem" }}
                >
                  {bulkDeleteMutation.isPending ? "Deleting..." : "Confirm"}
                </button>
                <button
                  onClick={() => setBulkDeleteConfirm(false)}
                  className="portal-btn-ghost"
                  style={{ padding: "0.4rem 0.8rem", fontSize: "0.75rem" }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setBulkDeleteConfirm(true)}
                className="portal-btn-ghost"
                style={{ color: "oklch(0.6 0.18 25)", borderColor: "oklch(0.6 0.18 25 / 0.3)", background: "oklch(0.6 0.18 25 / 0.06)" }}
              >
                <Trash2 size={15} />
                Delete ({selectedIds.length})
              </button>
            )
          )}
          <button onClick={() => setShowCreateModal(true)} className="portal-btn-primary">
            <Plus size={16} />
            New Project
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="portal-stats-row">
        {[
          { label: "Total", value: filteredProjects.length, color: "stat-blue" },
          { label: "Published", value: (projects as any[]).filter((p) => p.status === "published").length, color: "stat-green" },
          { label: "Drafts", value: (projects as any[]).filter((p) => p.status === "draft").length, color: "stat-amber" },
          { label: "Selected", value: selectedIds.length, color: "stat-violet" },
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
        <div className="portal-toolbar-search">
          <Search size={14} className="portal-toolbar-search-icon" />
          <input
            className="portal-input"
            placeholder="Search title, city, developer…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setSelectedIds([]); }}
          />
        </div>

        <div className="portal-toolbar-filters">
          <div className="portal-select-wrap" style={{ minWidth: "150px" }}>
            <select
              className="portal-select"
              value={filterCategory}
              onChange={(e) => { setFilterCategory(e.target.value); setSelectedIds([]); }}
            >
              <option value="all">All Categories</option>
              <option value="Metro Core">Metro Core</option>
              <option value="Suburban Enclaves">Suburban Enclaves</option>
              <option value="Resort & Leisure">Resort & Leisure</option>
            </select>
            <ChevronDown size={13} className="portal-select-icon" />
          </div>

          <div className="portal-select-wrap" style={{ minWidth: "120px" }}>
            <select
              className="portal-select"
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setSelectedIds([]); }}
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <ChevronDown size={13} className="portal-select-icon" />
          </div>
        </div>

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

      {/* Content */}
      <div className="portal-card no-pad">
        {listLoading ? (
          <div className="portal-item-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="portal-item-card" style={{ minHeight: "160px" }}>
                <div className="skeleton" style={{ height: "14px", width: "65%", borderRadius: "6px" }} />
                <div className="skeleton" style={{ height: "12px", width: "40%", borderRadius: "6px" }} />
                <div className="skeleton" style={{ height: "56px", borderRadius: "6px" }} />
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="portal-table-empty">
            <FolderOpen size={36} />
            <span>
              {projects.length === 0
                ? "No projects yet. Create one to get started."
                : "No projects match your filters."}
            </span>
          </div>
        ) : viewMode === "cards" ? (
          /* ── Card Grid View ── */
          <div className="portal-item-grid">
            {filteredProjects.map((proj: any) => (
              <div
                key={proj.id}
                className={`portal-item-card ${selectedIds.includes(proj.id) ? "is-selected" : ""}`}
                style={{
                  outline: selectedIds.includes(proj.id) ? "2px solid var(--portal-accent)" : undefined,
                  outlineOffset: "-2px",
                }}
              >
                {/* Checkbox + Title */}
                <div className="portal-item-card-header">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(proj.id)}
                    onChange={() => toggleSelect(proj.id)}
                    style={{ cursor: "pointer", flexShrink: 0, marginTop: "2px" }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="portal-item-card-title">{proj.title}</div>
                    <div className="portal-item-card-slug">/{proj.slug}</div>
                    <div className="portal-item-card-badges" style={{ marginTop: "0.4rem" }}>
                      <span className="portal-source-chip">{proj.category}</span>
                      <span className={`portal-status-badge status-${proj.status}`}>{proj.status}</span>
                      {duplicateIds.has(proj.id) && (
                        <span
                          title="Duplicate detected"
                          style={{ fontSize: "10px", color: "oklch(0.74 0.137 79)", background: "rgba(212,163,89,0.12)", border: "1px solid rgba(212,163,89,0.25)", borderRadius: "4px", padding: "1px 6px", fontWeight: "bold" }}
                        >
                          ⚠️ Duplicate
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Meta */}
                <div className="portal-item-card-meta">
                  <div className="portal-item-card-meta-item">
                    <span className="portal-item-card-meta-label">Developer</span>
                    <span className="portal-item-card-meta-value" style={{ fontSize: "0.75rem" }}>{proj.developer}</span>
                  </div>
                  <div className="portal-item-card-meta-item">
                    <span className="portal-item-card-meta-label">City</span>
                    <span className="portal-item-card-meta-value" style={{ fontSize: "0.75rem" }}>{proj.city}</span>
                  </div>
                  <div className="portal-item-card-meta-item">
                    <span className="portal-item-card-meta-label">Min Price</span>
                    <span className="portal-item-card-meta-value" style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "oklch(0.8 0.16 145)" }}>
                      ₱{(proj.min_price / 1_000_000).toFixed(1)}M
                    </span>
                  </div>
                  <div className="portal-item-card-meta-item">
                    <span className="portal-item-card-meta-label">Max Price</span>
                    <span className="portal-item-card-meta-value" style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem" }}>
                      ₱{(proj.max_price / 1_000_000).toFixed(1)}M
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="portal-item-card-footer">
                  <a
                    href={`/projects/${proj.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="portal-toggle-pill"
                    title="View public page"
                    style={{ textDecoration: "none" }}
                  >
                    <Eye size={11} />
                    Preview
                  </a>
                  <div className="portal-item-card-actions">
                    <button
                      onClick={() => {
                        setActiveProjectId(proj.id);
                        setActiveProjectSlug(proj.slug);
                        setActiveProjectTitle(proj.title);
                      }}
                      className="portal-icon-btn"
                      title="Edit page layout"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${proj.title}"? This will permanently remove all layouts and revisions.`)) {
                          deleteMutation.mutate(proj.id);
                        }
                      }}
                      className="portal-icon-btn"
                      title="Delete project"
                      style={{ color: "oklch(0.7 0.2 25)" }}
                    >
                      <Trash2 size={14} />
                    </button>
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
                  <th style={{ width: "40px", textAlign: "center" }}>
                    <input
                      type="checkbox"
                      checked={filteredProjects.length > 0 && selectedIds.length === filteredProjects.length}
                      onChange={toggleSelectAll}
                      style={{ cursor: "pointer" }}
                    />
                  </th>
                  <th>Project</th>
                  <th className="hide-mobile">Category</th>
                  <th className="hide-mobile">Developer</th>
                  <th className="hide-mobile">City</th>
                  <th>Status</th>
                  <th className="hide-mobile">Price Range</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((proj: any) => (
                  <tr
                    key={proj.id}
                    className="portal-table-row"
                    style={{ background: selectedIds.includes(proj.id) ? "var(--portal-accent-dim)" : "transparent" }}
                  >
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(proj.id)}
                        onChange={() => toggleSelect(proj.id)}
                        style={{ cursor: "pointer" }}
                      />
                    </td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                        <span style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap" }}>
                          {proj.title}
                          {duplicateIds.has(proj.id) && (
                            <span title="Duplicate detected" style={{ fontSize: "10px", color: "oklch(0.74 0.137 79)", background: "rgba(212,163,89,0.12)", border: "1px solid rgba(212,163,89,0.25)", borderRadius: "4px", padding: "1px 6px", fontWeight: "bold" }}>
                              ⚠️ Dup
                            </span>
                          )}
                        </span>
                        <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--portal-text-muted)" }}>/{proj.slug}</span>
                      </div>
                    </td>
                    <td className="hide-mobile">
                      <span className="portal-source-chip">{proj.category}</span>
                    </td>
                    <td className="hide-mobile" style={{ fontSize: "13px", color: "var(--portal-text)" }}>{proj.developer}</td>
                    <td className="hide-mobile" style={{ fontSize: "13px", color: "var(--portal-text-muted)" }}>{proj.city}</td>
                    <td>
                      <span className={`portal-status-badge status-${proj.status}`}>{proj.status}</span>
                    </td>
                    <td className="hide-mobile" style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--portal-text)" }}>
                      ₱{(proj.min_price / 1_000_000).toFixed(1)}M–₱{(proj.max_price / 1_000_000).toFixed(1)}M
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.4rem", justifyContent: "flex-end" }}>
                        <a href={`/projects/${proj.slug}`} target="_blank" rel="noreferrer" className="portal-icon-btn" title="View public page">
                          <Eye size={14} />
                        </a>
                        <button
                          onClick={() => { setActiveProjectId(proj.id); setActiveProjectSlug(proj.slug); setActiveProjectTitle(proj.title); }}
                          className="portal-icon-btn"
                          title="Edit page layout"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete "${proj.title}"? This will permanently remove all layouts and revisions.`)) {
                              deleteMutation.mutate(proj.id);
                            }
                          }}
                          className="portal-icon-btn"
                          title="Delete project"
                          style={{ color: "oklch(0.7 0.2 25)" }}
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
        )}

        {/* Footer count */}
        {!listLoading && filteredProjects.length > 0 && (
          <div style={{ padding: "0.6rem 1.25rem", borderTop: "1px solid oklch(0.25 0.015 258)", fontSize: "12px", color: "var(--portal-text-muted)" }}>
            Showing {filteredProjects.length} of {projects.length} projects
            {selectedIds.length > 0 && <span style={{ marginLeft: "0.75rem", color: "var(--portal-accent)" }}>· {selectedIds.length} selected</span>}
          </div>
        )}
      </div>

      {/* Creation Modal */}
      {showCreateModal && (
        <div className="portal-detail-overlay" onClick={() => setShowCreateModal(false)}>
          <div
            className="portal-detail-panel"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "550px" }}
          >
            <div className="portal-detail-header">
              <h2 className="portal-detail-name">Create New Project</h2>
              <button className="portal-detail-close" onClick={() => setShowCreateModal(false)}>✕</button>
            </div>
            <div className="portal-detail-body" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {unlinkedProperties.length > 0 && (
                <div className="portal-field" style={{ background: "rgba(255,255,255,0.03)", padding: "0.75rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <label className="portal-field-label" style={{ color: "oklch(0.74 0.137 79)", fontWeight: "bold" }}>
                    Link & Import from Existing Property (Optional)
                  </label>
                  <div className="portal-select-wrap">
                    <select
                      onChange={(e) => {
                        const selectedId = e.target.value;
                        if (!selectedId) return;
                        const p = (properties as any[])?.find((x) => x.id === selectedId);
                        if (p) {
                          setNewProj({
                            title: p.name,
                            slug: p.slug,
                            category: p.category,
                            developer: p.developer,
                            city: p.location,
                            full_address: p.city,
                            min_price: Math.round(p.price_min * 1000000),
                            max_price: Math.round(p.price_min * 1000000 * 1.5),
                            location_district: p.location,
                          });
                        }
                      }}
                      className="portal-select"
                      defaultValue=""
                    >
                      <option value="">-- Or select property to auto-fill --</option>
                      {unlinkedProperties.map((p: any) => (
                        <option key={p.id} value={p.id}>{p.name} ({p.location})</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="portal-select-icon" />
                  </div>
                  <span style={{ fontSize: "11px", color: "var(--zinc-500)", marginTop: "0.25rem", display: "block" }}>
                    Selecting a property auto-populates the form and ensures the slugs match perfectly.
                  </span>
                </div>
              )}

              <div className="portal-field">
                <label className="portal-field-label">Project Title</label>
                <input type="text" placeholder="e.g., Sonora Garden Residences" value={newProj.title} onChange={(e) => setNewProj((prev) => ({ ...prev, title: e.target.value }))} className="portal-input" />
              </div>

              <div className="portal-field">
                <label className="portal-field-label">Slug (URL path)</label>
                <input type="text" placeholder="e.g., sonora-garden" value={newProj.slug} onChange={(e) => setNewProj((prev) => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") }))} className="portal-input" />
                {newProjDuplicateWarning && (
                  <div style={{ marginTop: "0.5rem", padding: "0.6rem 0.8rem", background: "rgba(212,163,89,0.08)", border: "1px solid rgba(212,163,89,0.25)", borderRadius: "6px", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "12px", color: "oklch(0.74 0.137 79)" }}>
                    <AlertCircle size={14} style={{ flexShrink: 0 }} />
                    <span><strong>Warning:</strong> Similar active project detected ({newProjDuplicateWarning.count} match(es) on {newProjDuplicateWarning.reasons}: <em>{newProjDuplicateWarning.names}</em>).</span>
                  </div>
                )}
              </div>

              <div className="portal-grid-2col">
                <div className="portal-field">
                  <label className="portal-field-label">Category</label>
                  <div className="portal-select-wrap">
                    <select value={newProj.category} onChange={(e) => setNewProj((prev) => ({ ...prev, category: e.target.value as any }))} className="portal-select">
                      <option value="Metro Core">Metro Core</option>
                      <option value="Suburban Enclaves">Suburban Enclaves</option>
                      <option value="Resort & Leisure">Resort & Leisure</option>
                    </select>
                    <ChevronDown size={14} className="portal-select-icon" />
                  </div>
                </div>
                <div className="portal-field">
                  <label className="portal-field-label">Developer</label>
                  <input type="text" value={newProj.developer} onChange={(e) => setNewProj((prev) => ({ ...prev, developer: e.target.value }))} className="portal-input" />
                </div>
              </div>

              <div className="portal-grid-2col">
                <div className="portal-field">
                  <label className="portal-field-label">City</label>
                  <input type="text" placeholder="e.g., Las Piñas" value={newProj.city} onChange={(e) => setNewProj((prev) => ({ ...prev, city: e.target.value }))} className="portal-input" />
                </div>
                <div className="portal-field">
                  <label className="portal-field-label">Full Address</label>
                  <input type="text" placeholder="e.g., Alabang-Zapote Road" value={newProj.full_address} onChange={(e) => setNewProj((prev) => ({ ...prev, full_address: e.target.value }))} className="portal-input" />
                </div>
              </div>

              <div className="portal-grid-2col">
                <div className="portal-field">
                  <label className="portal-field-label">Minimum Price (₱)</label>
                  <input type="number" value={newProj.min_price} onChange={(e) => setNewProj((prev) => ({ ...prev, min_price: parseInt(e.target.value) || 0 }))} className="portal-input" />
                </div>
                <div className="portal-field">
                  <label className="portal-field-label">Maximum Price (₱)</label>
                  <input type="number" value={newProj.max_price} onChange={(e) => setNewProj((prev) => ({ ...prev, max_price: parseInt(e.target.value) || 0 }))} className="portal-input" />
                </div>
              </div>

              <div className="portal-detail-footer" style={{ marginTop: "1rem" }}>
                <button
                  onClick={() => createMutation.mutate({ data: newProj })}
                  disabled={createMutation.isPending || !newProj.title || !newProj.slug || !newProj.city}
                  className="portal-btn-primary"
                  style={{ width: "100%" }}
                >
                  {createMutation.isPending ? "Creating..." : "Create Project Profile"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface EditorProps {
  projectId: string;
  slug: string;
  projectTitle: string;
  onBack: () => void;
}

const SECTION_TYPES = [
  { key: "hero", name: "Hero Banner" },
  { key: "emotional-hook", name: "Emotional Hook / Intro" },
  { key: "pricing-snapshot", name: "Pricing Snapshot Table" },
  { key: "project-overview", name: "Project Specifications Grid" },
  { key: "highlights", name: "Icon Highlights Deck" },
  { key: "amenities", name: "Resort Amenities List" },
  { key: "location-map", name: "Travel Time landmarks Map" },
  { key: "unit-types", name: "Unit Configurations Slider" },
  { key: "decision-guide", name: "Unit Decision Guide" },
  { key: "media-experience", name: "Downloads & Video Tabs" },
  { key: "testimonials-slider", name: "Client Reviews Slider" },
  { key: "faq-list", name: "Accordion FAQ List" },
  { key: "lead-capture", name: "Form Capture Form" },
  { key: "related", name: "Related Projects Feed" },
];

function ProjectEditor({ projectId, slug, projectTitle, onBack }: EditorProps) {
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [draft, setDraft] = useState<any>(null);
  const [dirty, setDirty] = useState(false);
  const [selectedSectionIdx, setSelectedSectionIdx] = useState<number | null>(null);
  const [showAddSectionDropdown, setShowAddSectionDropdown] = useState(false);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  // Fetch current active draft payload
  const {
    data: rawPayload,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["project-draft", slug],
    queryFn: () => getProjectBySlug({ data: { slug, preview: true } }),
  });

  useEffect(() => {
    if (rawPayload) {
      setDraft(JSON.parse(JSON.stringify(rawPayload)));
      setDirty(false);
      setSelectedSectionIdx(null);
    }
  }, [rawPayload]);

  const saveMutation = useMutation({
    mutationFn: (vars: Parameters<typeof saveProjectDraft>[0]) => saveProjectDraft(vars),
    onSuccess: () => {
      setDirty(false);
      setSaveSuccess(true);
      toast.success("Draft snapshot saved successfully");
      setTimeout(() => setSaveSuccess(false), 3000);
      refetch();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  const publishMutation = useMutation({
    mutationFn: (vars: Parameters<typeof publishProject>[0]) => publishProject(vars),
    onSuccess: () => {
      setDirty(false);
      setPublishSuccess(true);
      toast.success("Project page published live!");
      setTimeout(() => setPublishSuccess(false), 4000);
      refetch();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Publish failed"),
  });

  const updateMeta = (key: string, value: any) => {
    if (!draft) return;
    const nextMeta = { ...draft.project_meta, [key]: value };
    setDraft({ ...draft, project_meta: nextMeta });
    setDirty(true);
  };

  const handleSave = () => {
    if (!draft) return;
    saveMutation.mutate({
      data: {
        projectId,
        draftSnapshot: draft,
      },
    });
  };

  const validationIssues = useMemo(() => validateDraft(draft), [draft]);

  // The preview iframe loads /projects/<slug>?preview=true, which reads the saved
  // draft snapshot. So persist the in-memory draft first, then refresh the frame.
  const refreshPreview = () => {
    if (dirty) {
      saveMutation.mutate(
        { data: { projectId, draftSnapshot: draft } },
        { onSuccess: () => setPreviewKey((k) => k + 1) },
      );
    } else {
      setPreviewKey((k) => k + 1);
    }
  };

  const handlePublish = () => {
    if (validationIssues.length > 0) {
      toast.error("Cannot publish — please fix the highlighted issues first.", {
        description: validationIssues[0],
      });
      return;
    }
    if (dirty) {
      // Auto save before publish
      saveMutation.mutate(
        {
          data: { projectId, draftSnapshot: draft },
        },
        {
          onSuccess: () => {
            publishMutation.mutate({ data: { projectId } });
          },
        },
      );
    } else {
      publishMutation.mutate({ data: { projectId } });
    }
  };

  const addSection = (key: string) => {
    if (!draft) return;
    const matching = SECTION_TYPES.find((s) => s.key === key);
    const newSection = {
      id: crypto.randomUUID ? crypto.randomUUID() : genId(),
      type: key,
      version: "1.0",
      payload: getEmptyPayloadFor(key),
    };
    const nextFlow = [...(draft.layout_flow || []), newSection];
    setDraft({ ...draft, layout_flow: nextFlow });
    setDirty(true);
    setSelectedSectionIdx(nextFlow.length - 1);
    setShowAddSectionDropdown(false);
    toast.success(`Added ${matching?.name || key} section`);
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    if (!draft || !draft.layout_flow) return;
    const nextFlow = [...draft.layout_flow];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= nextFlow.length) return;

    const temp = nextFlow[index];
    nextFlow[index] = nextFlow[targetIdx];
    nextFlow[targetIdx] = temp;

    setDraft({ ...draft, layout_flow: nextFlow });
    setDirty(true);
    if (selectedSectionIdx === index) {
      setSelectedSectionIdx(targetIdx);
    } else if (selectedSectionIdx === targetIdx) {
      setSelectedSectionIdx(index);
    }
  };

  const removeSection = (index: number) => {
    if (!draft || !draft.layout_flow) return;
    if (!confirm("Remove this section layout?")) return;
    const nextFlow = [...draft.layout_flow];
    nextFlow.splice(index, 1);
    setDraft({ ...draft, layout_flow: nextFlow });
    setDirty(true);
    setSelectedSectionIdx(null);
    toast.success("Section removed");
  };

  const updateSectionPayload = (index: number, payload: any) => {
    if (!draft || !draft.layout_flow) return;
    const nextFlow = [...draft.layout_flow];
    nextFlow[index] = { ...nextFlow[index], payload };
    setDraft({ ...draft, layout_flow: nextFlow });
    setDirty(true);
  };

  if (isLoading || (rawPayload && !draft)) {
    return (
      <div className="portal-page">
        <div className="portal-page-header">
          <button onClick={onBack} className="portal-btn-secondary">
            <ArrowLeft size={14} /> Back
          </button>
        </div>
        <div className="portal-card">
          <div className="portal-empty-state">
            <div className="portal-spinner" />
            <p>Loading layout workspace editor...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !rawPayload) {
    return (
      <div className="portal-page">
        <div className="portal-page-header">
          <button onClick={onBack} className="portal-btn-secondary">
            <ArrowLeft size={14} /> Back
          </button>
        </div>
        <div className="portal-card">
          <div
            className="portal-empty-state"
            style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}
          >
            <AlertCircle size={40} className="text-red-500" />
            <h3 className="text-zinc-100 font-bold text-lg">Failed to Load Project Editor</h3>
            <p className="text-zinc-400 text-sm max-w-md text-center">
              {error instanceof Error
                ? error.message
                : "The project draft configuration could not be found or failed to compile."}
            </p>
            <button onClick={onBack} className="portal-btn-primary mt-2">
              Back to Projects List
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="portal-page">
      {/* Editor Header */}
      <div className="portal-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button onClick={onBack} className="portal-btn-secondary" style={{ padding: "0.5rem" }}>
            <ArrowLeft size={16} />
          </button>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <h1 className="portal-page-title text-[20px]">
                {draft.project_meta.title || projectTitle}
              </h1>
              <span
                className={`portal-status-badge status-${draft.project_meta.status || "draft"}`}
              >
                {draft.project_meta.status || "draft"}
              </span>
            </div>
            <p className="portal-page-desc font-mono text-[11px] mt-0.5">
              /{draft.project_meta.slug}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <a
            href={`/projects/${draft.project_meta.slug}?preview=true`}
            target="_blank"
            rel="noreferrer"
            className="portal-btn-secondary"
            title="Preview current sandbox draft"
          >
            <Eye size={15} />
            Preview Draft
          </a>
          <button
            onClick={handleSave}
            disabled={!dirty || saveMutation.isPending}
            className="portal-btn-secondary"
            style={{
              border: dirty ? "1px solid var(--portal-accent)" : "1px solid var(--portal-border)",
            }}
          >
            <Save size={15} />
            {saveMutation.isPending ? "Saving..." : "Save Draft"}
          </button>
          <button
            onClick={handlePublish}
            disabled={publishMutation.isPending || validationIssues.length > 0}
            className="portal-btn-primary"
            title={
              validationIssues.length > 0
                ? "Fix validation issues before publishing"
                : "Publish live"
            }
          >
            <Sparkles size={15} />
            {publishMutation.isPending ? "Publishing..." : "Publish Live"}
          </button>
        </div>
      </div>

      {/* Validation Issues Banner */}
      {validationIssues.length > 0 && (
        <div
          style={{
            background: "oklch(0.65 0.2 25 / 0.1)",
            border: "1px solid oklch(0.65 0.2 25 / 0.4)",
            borderRadius: "10px",
            padding: "0.75rem 1rem",
            marginBottom: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <AlertCircle size={16} style={{ color: "oklch(0.7 0.18 25)", flexShrink: 0 }} />
            <p style={{ fontSize: "0.8125rem", fontWeight: 700, color: "oklch(0.7 0.18 25)", margin: 0 }}>
              Resolve {validationIssues.length} issue{validationIssues.length > 1 ? "s" : ""} before publishing
            </p>
          </div>
          <ul style={{ margin: 0, paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
            {validationIssues.map((issue, i) => (
              <li key={i} style={{ fontSize: "0.78rem", color: "var(--portal-text-muted, #a1a1aa)" }}>
                {issue}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Save Success Banner */}
      {saveSuccess && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            background: "oklch(0.65 0.18 145 / 0.12)",
            border: "1px solid oklch(0.65 0.18 145 / 0.4)",
            borderRadius: "10px",
            padding: "0.75rem 1rem",
            marginBottom: "1rem",
          }}
        >
          <CheckCircle size={18} style={{ color: "oklch(0.72 0.16 145)", flexShrink: 0 }} />
          <p
            style={{
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: "oklch(0.72 0.16 145)",
              margin: 0,
            }}
          >
            Draft workspace updated successfully.
          </p>
        </div>
      )}

      {/* Publish Success Banner */}
      {publishSuccess && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            background: "oklch(0.65 0.18 145 / 0.12)",
            border: "1px solid oklch(0.65 0.18 145 / 0.4)",
            borderRadius: "10px",
            padding: "0.75rem 1rem",
            marginBottom: "1rem",
          }}
        >
          <CheckCircle size={18} style={{ color: "oklch(0.72 0.16 145)", flexShrink: 0 }} />
          <p
            style={{
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: "oklch(0.72 0.16 145)",
              margin: 0,
            }}
          >
            Configuration published! Precompiled read model cache updated and page is now live.
          </p>
        </div>
      )}

      <div className="portal-settings-layout">
        {/* Sub tabs */}
        <aside className="portal-settings-nav">
          <button
            onClick={() => setActiveTab("general")}
            className={`portal-settings-nav-item ${activeTab === "general" ? "active" : ""}`}
          >
            <Settings size={15} />
            General Settings
          </button>
          <button
            onClick={() => setActiveTab("sections")}
            className={`portal-settings-nav-item ${activeTab === "sections" ? "active" : ""}`}
          >
            <Layers size={15} />
            Layout Sections ({(draft.layout_flow || []).length})
          </button>
          <button
            onClick={() => setActiveTab("units")}
            className={`portal-settings-nav-item ${activeTab === "units" ? "active" : ""}`}
          >
            <Activity size={15} />
            Unit Configurations ({(draft.units || []).length})
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`portal-settings-nav-item ${activeTab === "preview" ? "active" : ""}`}
          >
            <Eye size={15} />
            Live Preview
          </button>
          <button
            onClick={() => setActiveTab("raw")}
            className={`portal-settings-nav-item ${activeTab === "raw" ? "active" : ""}`}
          >
            <FileText size={15} />
            Raw JSON Snapshot
          </button>
        </aside>

        {/* Tab body */}
        <div className="portal-settings-form" style={{ width: "100%" }}>
          {/* GENERAL SETTINGS TAB */}
          {activeTab === "general" && (
            <div className="portal-card portal-settings-fields">
              <div className="portal-card-header">
                <div className="portal-card-title">Project Profile Metadata</div>
              </div>

              <div className="portal-field">
                <label className="portal-field-label">Project Headline Title</label>
                <input
                  type="text"
                  value={draft.project_meta.title || ""}
                  onChange={(e) => updateMeta("title", e.target.value)}
                  className="portal-input"
                />
              </div>

              <div className="portal-grid-2col">
                <div className="portal-field">
                  <label className="portal-field-label">Category</label>
                  <div className="portal-select-wrap">
                    <select
                      value={draft.project_meta.category || "Suburban Enclaves"}
                      onChange={(e) => updateMeta("category", e.target.value)}
                      className="portal-select"
                    >
                      <option value="Metro Core">Metro Core</option>
                      <option value="Suburban Enclaves">Suburban Enclaves</option>
                      <option value="Resort & Leisure">Resort & Leisure</option>
                    </select>
                    <ChevronDown size={14} className="portal-select-icon" />
                  </div>
                </div>

                <div className="portal-field">
                  <label className="portal-field-label">Developer Group</label>
                  <input
                    type="text"
                    value={draft.project_meta.developer || "DMCI Homes"}
                    onChange={(e) => updateMeta("developer", e.target.value)}
                    className="portal-input"
                  />
                </div>
              </div>

              <div className="portal-field">
                <label className="portal-field-label">Selling Status (shown on hero badge)</label>
                <div className="portal-select-wrap">
                  <select
                    value={draft.project_meta.listing_status || ""}
                    onChange={(e) => updateMeta("listing_status", e.target.value)}
                    className="portal-select"
                  >
                    <option value="">— None (hide badge) —</option>
                    <option value="Pre-selling">Pre-selling</option>
                    <option value="RFO">RFO (Ready for Occupancy)</option>
                  </select>
                  <ChevronDown size={14} className="portal-select-icon" />
                </div>
              </div>

              <div className="portal-field">
                <label className="portal-field-label">Project Description (overview intro)</label>
                <textarea
                  rows={4}
                  placeholder="The long-form description shown in the Project Overview section..."
                  value={draft.project_meta.description || ""}
                  onChange={(e) => updateMeta("description", e.target.value)}
                  className="portal-textarea"
                />
              </div>

              <div className="portal-grid-2col">
                <div className="portal-field">
                  <label className="portal-field-label">Location District</label>
                  <input
                    type="text"
                    placeholder="e.g., Las Piñas City"
                    value={draft.project_meta.location_district || ""}
                    onChange={(e) => updateMeta("location_district", e.target.value)}
                    className="portal-input"
                  />
                </div>
                <div className="portal-field">
                  <label className="portal-field-label">City</label>
                  <input
                    type="text"
                    placeholder="e.g., Las Piñas"
                    value={draft.project_meta.city || ""}
                    onChange={(e) => updateMeta("city", e.target.value)}
                    className="portal-input"
                  />
                </div>
              </div>

              <div className="portal-field">
                <label className="portal-field-label">Full Address Street Link</label>
                <input
                  type="text"
                  value={draft.project_meta.full_address || ""}
                  onChange={(e) => updateMeta("full_address", e.target.value)}
                  className="portal-input"
                />
              </div>

              <div className="portal-grid-2col">
                <div className="portal-field">
                  <label className="portal-field-label">Min Price Starting (₱)</label>
                  <input
                    type="number"
                    value={draft.project_meta.min_price || 0}
                    onChange={(e) => updateMeta("min_price", parseInt(e.target.value) || 0)}
                    className="portal-input"
                  />
                </div>
                <div className="portal-field">
                  <label className="portal-field-label">Max Price Limit (₱)</label>
                  <input
                    type="number"
                    value={draft.project_meta.max_price || 0}
                    onChange={(e) => updateMeta("max_price", parseInt(e.target.value) || 0)}
                    className="portal-input"
                  />
                </div>
              </div>

              <div className="portal-grid-2col border-t border-[var(--portal-border)] pt-4 mt-4">
                <div className="portal-field">
                  <label className="portal-field-label">Architectural Style Theme</label>
                  <input
                    type="text"
                    placeholder="e.g., Modern Resort Tropical"
                    value={draft.project_meta.architectural_theme || ""}
                    onChange={(e) => updateMeta("architectural_theme", e.target.value)}
                    className="portal-input"
                  />
                </div>
                <div className="portal-field">
                  <label className="portal-field-label">Land Area Footprint</label>
                  <input
                    type="text"
                    placeholder="e.g., 1.8 Hectares"
                    value={draft.project_meta.land_area || ""}
                    onChange={(e) => updateMeta("land_area", e.target.value)}
                    className="portal-input"
                  />
                </div>
              </div>

              <div className="portal-grid-2col">
                <div className="portal-field">
                  <label className="portal-field-label">Total Floors Description</label>
                  <input
                    type="text"
                    placeholder="e.g., 5-7 Stories"
                    value={draft.project_meta.floors || ""}
                    onChange={(e) => updateMeta("floors", e.target.value)}
                    className="portal-input"
                  />
                </div>
                <div className="portal-field">
                  <label className="portal-field-label">Total Units Density</label>
                  <input
                    type="text"
                    placeholder="e.g., 1,152 Units"
                    value={draft.project_meta.total_units || ""}
                    onChange={(e) => updateMeta("total_units", e.target.value)}
                    className="portal-input"
                  />
                </div>
              </div>

              <div className="portal-field">
                <label className="portal-field-label">Turnover Target Date</label>
                <input
                  type="text"
                  placeholder="e.g., 2027-2028"
                  value={draft.project_meta.turnover || ""}
                  onChange={(e) => updateMeta("turnover", e.target.value)}
                  className="portal-input"
                />
              </div>

              <div className="portal-card-header mt-6">
                <div className="portal-card-title">SEO & Sharing Configuration</div>
              </div>

              <div className="portal-field">
                <label className="portal-field-label">SEO Page Title Tag</label>
                <input
                  type="text"
                  placeholder="Sonora Garden Residences by DMCI Homes"
                  value={draft.project_meta.meta_title || ""}
                  onChange={(e) => updateMeta("meta_title", e.target.value)}
                  className="portal-input"
                />
              </div>

              <div className="portal-field">
                <label className="portal-field-label">SEO Meta Description Description</label>
                <textarea
                  rows={2}
                  placeholder="Insert search indexing summary snippet..."
                  value={draft.project_meta.meta_description || ""}
                  onChange={(e) => updateMeta("meta_description", e.target.value)}
                  className="portal-textarea"
                />
              </div>
            </div>
          )}

          {/* LAYOUT SECTIONS BUILDER TAB */}
          {activeTab === "sections" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "280px 1fr",
                gap: "1.5rem",
                alignItems: "start",
              }}
            >
              {/* Sections Sidebar */}
              <div
                className="portal-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  padding: "1rem",
                }}
              >
                <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                  Flow Sections
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {(draft.layout_flow || []).map((sec: any, idx: number) => (
                    <div
                      key={sec.id}
                      onClick={() => setSelectedSectionIdx(idx)}
                      className={`portal-settings-nav-item flex items-center justify-between`}
                      style={{
                        padding: "8px 10px",
                        cursor: "pointer",
                        background: selectedSectionIdx === idx ? "rgba(255,255,255,0.06)" : "none",
                        border:
                          selectedSectionIdx === idx
                            ? "1px solid rgba(255,255,255,0.12)"
                            : "1px solid transparent",
                        borderRadius: "6px",
                      }}
                    >
                      <div className="flex flex-col gap-0.5" style={{ overflow: "hidden" }}>
                        <span
                          className="text-xs font-bold text-zinc-100 truncate"
                          style={{ maxWidth: "160px" }}
                        >
                          {SECTION_TYPES.find((s) => s.key === sec.type)?.name || sec.type}
                        </span>
                        <span className="text-[9.5px] font-mono text-zinc-400">
                          order: {idx * 10}
                        </span>
                      </div>
                      <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => moveSection(idx, "up")}
                          disabled={idx === 0}
                          className="portal-icon-btn text-zinc-400 disabled:opacity-30"
                          style={{ padding: 2 }}
                        >
                          <ArrowUp size={11} />
                        </button>
                        <button
                          onClick={() => moveSection(idx, "down")}
                          disabled={idx === (draft.layout_flow || []).length - 1}
                          className="portal-icon-btn text-zinc-400 disabled:opacity-30"
                          style={{ padding: 2 }}
                        >
                          <ArrowDown size={11} />
                        </button>
                        <button
                          onClick={() => removeSection(idx)}
                          className="portal-icon-btn text-zinc-400 hover:text-red-500"
                          style={{ padding: 2 }}
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ position: "relative", marginTop: "1rem" }}>
                  <button
                    onClick={() => setShowAddSectionDropdown(!showAddSectionDropdown)}
                    className="portal-btn-secondary"
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    <Plus size={14} /> Add Section
                  </button>

                  {showAddSectionDropdown && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "42px",
                        left: 0,
                        right: 0,
                        background: "#18181b",
                        border: "1px solid var(--portal-border)",
                        borderRadius: "8px",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.4)",
                        zIndex: 30,
                        maxHeight: "240px",
                        overflowY: "auto",
                        padding: "4px",
                      }}
                    >
                      {SECTION_TYPES.map((st) => (
                        <button
                          key={st.key}
                          onClick={() => addSection(st.key)}
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            textAlign: "left",
                            background: "none",
                            border: "none",
                            color: "#d4d4d8",
                            fontSize: "11.5px",
                            cursor: "pointer",
                            borderRadius: "4px",
                          }}
                          className="hover:bg-white/5 hover:text-white"
                        >
                          {st.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Section Configuration Panel */}
              <div className="portal-card">
                {selectedSectionIdx !== null && draft.layout_flow?.[selectedSectionIdx] ? (
                  <SectionEditorBlock
                    section={draft.layout_flow[selectedSectionIdx]}
                    onChange={(nextPayload) =>
                      updateSectionPayload(selectedSectionIdx, nextPayload)
                    }
                  />
                ) : (
                  <div className="portal-empty-state">
                    <Layers size={36} style={{ color: "var(--portal-text-muted)" }} />
                    <p className="text-zinc-400 text-xs mt-2">
                      Select a layout section from the sidebar flow list to configure its attributes
                      and parameters.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* UNIT CONFIGURATION TAB */}
          {activeTab === "units" && (
            <div className="portal-card">
              <div className="portal-card-header flex justify-between items-center">
                <div className="portal-card-title">Interactive Unit Specifications</div>
                <button
                  onClick={() => {
                    const nextUnits = [
                      ...(draft.units || []),
                      {
                        name: "Studio",
                        area_sqm: 24.5,
                        starting_price: 4500000,
                        description: "",
                        profile_target: "",
                      },
                    ];
                    setDraft({ ...draft, units: nextUnits });
                    setDirty(true);
                  }}
                  className="portal-btn-secondary sm"
                >
                  <Plus size={14} /> Add Unit type
                </button>
              </div>

              <div
                style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
                className="mt-4"
              >
                {(draft.units || []).length === 0 ? (
                  <p className="portal-empty-state sm">
                    No units configured. Add a layout configuration above.
                  </p>
                ) : (
                  draft.units.map((unit: any, idx: number) => (
                    <div
                      key={idx}
                      style={{
                        padding: "1rem",
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: "8px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.75rem",
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-zinc-100">
                          Unit Type #{idx + 1}
                        </span>
                        <button
                          onClick={() => {
                            if (confirm("Remove this unit specifications?")) {
                              const nextUnits = [...draft.units];
                              nextUnits.splice(idx, 1);
                              setDraft({ ...draft, units: nextUnits });
                              setDirty(true);
                            }
                          }}
                          className="portal-icon-btn hover:text-red-500"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <div className="portal-grid-3col">
                        <div className="portal-field">
                          <label className="portal-field-label">Unit Type Layout Name</label>
                          <input
                            type="text"
                            placeholder="Studio / 2-Bedroom"
                            value={unit.name || ""}
                            onChange={(e) => {
                              const next = [...draft.units];
                              next[idx] = { ...next[idx], name: e.target.value };
                              setDraft({ ...draft, units: next });
                              setDirty(true);
                            }}
                            className="portal-input"
                          />
                        </div>
                        <div className="portal-field">
                          <label className="portal-field-label">Livable Area (sq.m.)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={unit.area_sqm || 0}
                            onChange={(e) => {
                              const next = [...draft.units];
                              next[idx] = {
                                ...next[idx],
                                area_sqm: parseFloat(e.target.value) || 0,
                              };
                              setDraft({ ...draft, units: next });
                              setDirty(true);
                            }}
                            className="portal-input"
                          />
                        </div>
                        <div className="portal-field">
                          <label className="portal-field-label">Starting Unit Price (₱)</label>
                          <input
                            type="number"
                            value={unit.starting_price || 0}
                            onChange={(e) => {
                              const next = [...draft.units];
                              next[idx] = {
                                ...next[idx],
                                starting_price: parseInt(e.target.value) || 0,
                              };
                              setDraft({ ...draft, units: next });
                              setDirty(true);
                            }}
                            className="portal-input"
                          />
                        </div>
                      </div>

                      <div className="portal-grid-3col">
                        <div className="portal-field">
                          <label className="portal-field-label">Description Tagline</label>
                          <input
                            type="text"
                            placeholder="Generous layouts with balcony..."
                            value={unit.description || ""}
                            onChange={(e) => {
                              const next = [...draft.units];
                              next[idx] = { ...next[idx], description: e.target.value };
                              setDraft({ ...draft, units: next });
                              setDirty(true);
                            }}
                            className="portal-input"
                          />
                        </div>
                        <div className="portal-field">
                          <label className="portal-field-label">Buyer Target Profile</label>
                          <input
                            type="text"
                            placeholder="Young Professionals / OFW Investors"
                            value={unit.profile_target || ""}
                            onChange={(e) => {
                              const next = [...draft.units];
                              next[idx] = { ...next[idx], profile_target: e.target.value };
                              setDraft({ ...draft, units: next });
                              setDirty(true);
                            }}
                            className="portal-input"
                          />
                        </div>
                        <div className="portal-field">
                          <label className="portal-field-label">Unit Image URL</label>
                          <input
                            type="text"
                            placeholder="e.g. /src/assets/interior-living.jpg"
                            value={unit.image_url || ""}
                            onChange={(e) => {
                              const next = [...draft.units];
                              next[idx] = { ...next[idx], image_url: e.target.value };
                              setDraft({ ...draft, units: next });
                              setDirty(true);
                            }}
                            className="portal-input"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* LIVE PREVIEW TAB */}
          {activeTab === "preview" && (
            <div className="portal-card">
              <div className="portal-card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div className="portal-card-title flex items-center gap-2">
                  <Eye size={16} /> Live Draft Preview
                </div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  {dirty && (
                    <span style={{ fontSize: "0.72rem", color: "oklch(0.7 0.18 25)", fontWeight: 600 }}>
                      Unsaved changes
                    </span>
                  )}
                  <button
                    onClick={refreshPreview}
                    disabled={saveMutation.isPending}
                    className="portal-btn-secondary sm"
                    style={{ padding: "4px 10px", fontSize: "11px" }}
                  >
                    <RefreshCw size={13} />
                    {saveMutation.isPending ? "Saving..." : dirty ? "Save & Refresh" : "Refresh"}
                  </button>
                  <a
                    href={`/projects/${draft.project_meta.slug}?preview=true`}
                    target="_blank"
                    rel="noreferrer"
                    className="portal-btn-secondary sm"
                    style={{ padding: "4px 10px", fontSize: "11px" }}
                  >
                    <Eye size={13} /> Open in tab
                  </a>
                </div>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1 mb-3 leading-relaxed">
                Shows your saved draft. Click <strong>Save &amp; Refresh</strong> after edits to see
                the latest changes. This is the draft sandbox — it goes live only when you publish.
              </p>
              <div
                style={{
                  width: "100%",
                  height: "70vh",
                  border: "1px solid var(--portal-border)",
                  borderRadius: "10px",
                  overflow: "hidden",
                  background: "#fff",
                }}
              >
                <iframe
                  key={previewKey}
                  src={`/projects/${draft.project_meta.slug}?preview=true`}
                  title="Project live preview"
                  style={{ width: "100%", height: "100%", border: "none" }}
                />
              </div>
            </div>
          )}

          {/* RAW SNAPSHOT TAB */}
          {activeTab === "raw" && (
            <div className="portal-card">
              <div className="portal-card-header">
                <div className="portal-card-title flex items-center gap-2">
                  <FileText size={16} /> Raw Config Snapshot Payload (JSON)
                </div>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1 mb-4 leading-relaxed">
                Advanced editor view. You can copy the layout configuration to back it up, or paste
                a new snapshot structure directly to restore or clone layouts.
              </p>

              <textarea
                rows={16}
                value={JSON.stringify(draft, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setDraft(parsed);
                    setDirty(true);
                  } catch (err) {
                    // silent parsing blocks until fully valid
                  }
                }}
                className="portal-textarea font-mono text-xs text-zinc-300"
                style={{ background: "#09090b", border: "1px solid var(--portal-border)" }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ACCORDION SECTION PAYLOAD FORM BLOCK ─────────────────────────────────────

interface SectionBlockProps {
  section: {
    id: string;
    type: string;
    version: string;
    payload: any;
  };
  onChange: (nextPayload: any) => void;
}

function SectionEditorBlock({ section, onChange }: SectionBlockProps) {
  const matchingType = SECTION_TYPES.find((s) => s.key === section.type);
  const payload = section.payload || {};

  const handleFieldChange = (key: string, value: any) => {
    onChange({ ...payload, [key]: value });
  };

  const getVal = (key: string, fallback: any = "") => {
    return payload[key] ?? fallback;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div className="border-b border-[var(--portal-border)] pb-3 flex justify-between items-center">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-[#3B82F6] font-bold uppercase">
            {section.type}
          </span>
          <h2 className="text-md font-bold mt-1 text-zinc-100">
            {matchingType?.name || "Configure Block"}
          </h2>
        </div>
        <span className="text-[10.5px] font-mono text-zinc-400">Schema {section.version}</span>
      </div>

      {/* RENDER DYNAMIC FORMS ACCORDING TO TYPE */}

      {section.type === "hero" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="portal-field">
            <label className="portal-field-label">Tagline text</label>
            <input
              type="text"
              value={getVal("tagline")}
              onChange={(e) => handleFieldChange("tagline", e.target.value)}
              className="portal-input"
            />
          </div>
          <div className="portal-field">
            <label className="portal-field-label">Secondary tagline</label>
            <input
              type="text"
              value={getVal("secondary_tagline")}
              onChange={(e) => handleFieldChange("secondary_tagline", e.target.value)}
              className="portal-input"
            />
          </div>
          <div className="portal-grid-2col">
            <div className="portal-field">
              <label className="portal-field-label">Primary CTA Action Label</label>
              <input
                type="text"
                value={getVal("cta_primary_text")}
                onChange={(e) => handleFieldChange("cta_primary_text", e.target.value)}
                className="portal-input"
              />
            </div>
            <div className="portal-field">
              <label className="portal-field-label">Secondary CTA Action Label</label>
              <input
                type="text"
                value={getVal("cta_secondary_text")}
                onChange={(e) => handleFieldChange("cta_secondary_text", e.target.value)}
                className="portal-input"
              />
            </div>
          </div>
          <div className="portal-field">
            <label className="portal-field-label">Property Logo Image URL</label>
            <input
              type="text"
              placeholder="e.g. https://supabase.co/.../logo.png"
              value={getVal("logo_url")}
              onChange={(e) => handleFieldChange("logo_url", e.target.value)}
              className="portal-input"
            />
            {getVal("logo_url") && (
              <div style={{ marginTop: "0.5rem", padding: "0.5rem", background: "rgba(255,255,255,0.03)", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.06)", display: "inline-block" }}>
                <span className="text-[10px] text-zinc-400 block mb-1 font-mono">Logo Preview:</span>
                <img
                  src={getVal("logo_url")}
                  alt="Property Logo Preview"
                  style={{ maxHeight: "60px", maxWidth: "200px", objectFit: "contain" }}
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>
          <div className="portal-field">
            <label className="portal-field-label">
              Hero Carousel Images (comma separated URLs)
            </label>
            <input
              type="text"
              placeholder="e.g. https://supabase.co/.../banner1.jpg, https://supabase.co/.../banner2.jpg"
              value={getVal("hero_images", []).join(", ")}
              onChange={(e) => {
                const urls = e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean);
                handleFieldChange("hero_images", urls);
              }}
              className="portal-input"
            />
            {getVal("hero_images", []).length > 0 && (
              <div style={{ marginTop: "0.5rem" }}>
                <span className="text-[10px] text-zinc-400 block mb-2 font-mono">Hero Images Preview:</span>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {getVal("hero_images", []).map((url: string, index: number) => (
                    <div
                      key={index}
                      style={{
                        position: "relative",
                        width: "80px",
                        height: "50px",
                        borderRadius: "6px",
                        overflow: "hidden",
                        border: "1px solid rgba(255,255,255,0.1)",
                        background: "rgba(0,0,0,0.2)"
                      }}
                    >
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=100&q=50";
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {section.type === "emotional-hook" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="portal-field">
            <label className="portal-field-label">Eyebrow tagline</label>
            <input
              type="text"
              value={getVal("eyebrow")}
              onChange={(e) => handleFieldChange("eyebrow", e.target.value)}
              className="portal-input"
            />
          </div>
          <div className="portal-field">
            <label className="portal-field-label">Hook Headline text</label>
            <input
              type="text"
              value={getVal("headline")}
              onChange={(e) => handleFieldChange("headline", e.target.value)}
              className="portal-input"
            />
          </div>
          <div className="portal-field">
            <label className="portal-field-label">Hook Sub-headline tagline</label>
            <input
              type="text"
              value={getVal("sub")}
              onChange={(e) => handleFieldChange("sub", e.target.value)}
              className="portal-input"
            />
          </div>

          <div className="portal-field border-t border-[var(--portal-border)] pt-4 mt-2">
            <label className="portal-field-label flex justify-between items-center">
              <span>Lifestyle Value Points (List)</span>
              <button
                type="button"
                onClick={() => {
                  const pts = [...getVal("points", [])];
                  pts.push("");
                  handleFieldChange("points", pts);
                }}
                className="portal-btn-secondary sm"
                style={{ padding: "2px 8px", fontSize: "10.5px" }}
              >
                + Add Point
              </button>
            </label>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
              className="mt-2"
            >
              {getVal("points", []).map((pt: string, i: number) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={pt}
                    onChange={(e) => {
                      const next = [...payload.points];
                      next[i] = e.target.value;
                      handleFieldChange("points", next);
                    }}
                    className="portal-input"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const next = [...payload.points];
                      next.splice(i, 1);
                      handleFieldChange("points", next);
                    }}
                    className="portal-icon-btn hover:text-red-500"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {section.type === "pricing-snapshot" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="portal-grid-2col">
            <div className="portal-field">
              <label className="portal-field-label">Title</label>
              <input
                type="text"
                value={getVal("title")}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                className="portal-input"
              />
            </div>
            <div className="portal-field">
              <label className="portal-field-label">Sub-Title starting tagline</label>
              <input
                type="text"
                value={getVal("sub_title")}
                onChange={(e) => handleFieldChange("sub_title", e.target.value)}
                className="portal-input"
              />
            </div>
          </div>
          <div className="portal-field">
            <label className="portal-field-label">Description text</label>
            <textarea
              rows={2}
              value={getVal("description")}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              className="portal-textarea"
            />
          </div>

          <div className="portal-field border-t border-[var(--portal-border)] pt-4 mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={getVal("show_urgency", false)}
                onChange={(e) => handleFieldChange("show_urgency", e.target.checked)}
                style={{ accentColor: "var(--portal-accent)" }}
              />
              <span className="text-xs font-bold text-zinc-100">Show Urgency Information</span>
            </label>
          </div>

          {getVal("show_urgency", false) && (
            <div className="portal-grid-2col bg-white/2 p-3 rounded-lg border border-white/5">
              <div className="portal-field">
                <label className="portal-field-label">Urgency Clause 1</label>
                <input
                  type="text"
                  value={getVal("urgency_text_1")}
                  onChange={(e) => handleFieldChange("urgency_text_1", e.target.value)}
                  className="portal-input"
                />
              </div>
              <div className="portal-field">
                <label className="portal-field-label">Urgency Clause 2</label>
                <input
                  type="text"
                  value={getVal("urgency_text_2")}
                  onChange={(e) => handleFieldChange("urgency_text_2", e.target.value)}
                  className="portal-input"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {section.type === "project-overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="portal-grid-2col">
            <div className="portal-field">
              <label className="portal-field-label">Overview Heading title</label>
              <input
                type="text"
                value={getVal("title")}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                className="portal-input"
              />
            </div>
            <div className="portal-field">
              <label className="portal-field-label">Overview Headline span accent</label>
              <input
                type="text"
                value={getVal("headline_span")}
                onChange={(e) => handleFieldChange("headline_span", e.target.value)}
                className="portal-input"
              />
            </div>
          </div>
        </div>
      )}

      {section.type === "highlights" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="portal-field">
            <label className="portal-field-label">Eyebrow title</label>
            <input
              type="text"
              value={getVal("eyebrow")}
              onChange={(e) => handleFieldChange("eyebrow", e.target.value)}
              className="portal-input"
            />
          </div>

          <div className="portal-field border-t border-[var(--portal-border)] pt-4 mt-2">
            <label className="portal-field-label flex justify-between items-center">
              <span>Icon Highlight Items</span>
              <button
                type="button"
                onClick={() => {
                  const items = [...getVal("items", [])];
                  items.push({ icon: "award", title: "New Highlight", description: "" });
                  handleFieldChange("items", items);
                }}
                className="portal-btn-secondary sm"
                style={{ padding: "2px 8px", fontSize: "10.5px" }}
              >
                + Add Highlight
              </button>
            </label>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
              className="mt-2"
            >
              {getVal("items", []).map((item: any, i: number) => (
                <div
                  key={i}
                  className="flex flex-col gap-2 p-3 bg-white/2 rounded-lg border border-white/5"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-zinc-400">Highlight #{i + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const next = [...payload.items];
                        next.splice(i, 1);
                        handleFieldChange("items", next);
                      }}
                      className="portal-icon-btn hover:text-red-500"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  <div className="portal-grid-3col">
                    <div className="portal-field">
                      <label className="portal-field-label text-[10px]">
                        Icon Key (e.g. trees/zap)
                      </label>
                      <input
                        type="text"
                        value={item.icon || ""}
                        onChange={(e) => {
                          const next = [...payload.items];
                          next[i] = { ...next[i], icon: e.target.value };
                          handleFieldChange("items", next);
                        }}
                        className="portal-input"
                      />
                    </div>
                    <div className="portal-field" style={{ gridColumn: "span 2" }}>
                      <label className="portal-field-label text-[10px]">Highlight Title</label>
                      <input
                        type="text"
                        value={item.title || ""}
                        onChange={(e) => {
                          const next = [...payload.items];
                          next[i] = { ...next[i], title: e.target.value };
                          handleFieldChange("items", next);
                        }}
                        className="portal-input"
                      />
                    </div>
                  </div>
                  <div className="portal-field">
                    <label className="portal-field-label text-[10px]">Highlight Description</label>
                    <input
                      type="text"
                      value={item.description || ""}
                      onChange={(e) => {
                        const next = [...payload.items];
                        next[i] = { ...next[i], description: e.target.value };
                        handleFieldChange("items", next);
                      }}
                      className="portal-input"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {section.type === "amenities" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="portal-grid-2col">
            <div className="portal-field">
              <label className="portal-field-label">Eyebrow tag</label>
              <input
                type="text"
                value={getVal("eyebrow")}
                onChange={(e) => handleFieldChange("eyebrow", e.target.value)}
                className="portal-input"
              />
            </div>
            <div className="portal-field">
              <label className="portal-field-label">Intro Paragraph</label>
              <input
                type="text"
                value={getVal("intro")}
                onChange={(e) => handleFieldChange("intro", e.target.value)}
                className="portal-input"
              />
            </div>
          </div>

          <div className="portal-field border-t border-[var(--portal-border)] pt-4 mt-2">
            <label className="portal-field-label flex justify-between items-center">
              <span>Amenities List</span>
              <button
                type="button"
                onClick={() => {
                  const items = [...getVal("items", [])];
                  items.push({
                    name: "Lap Pool",
                    description: "",
                    icon: "waves",
                    category: "wellness",
                  });
                  handleFieldChange("items", items);
                }}
                className="portal-btn-secondary sm"
                style={{ padding: "2px 8px", fontSize: "10.5px" }}
              >
                + Add Amenity
              </button>
            </label>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
              className="mt-2"
            >
              {getVal("items", []).map((item: any, i: number) => (
                <div
                  key={i}
                  className="flex flex-col gap-2 p-3 bg-white/2 rounded-lg border border-white/5"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-zinc-400">Amenity #{i + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const next = [...payload.items];
                        next.splice(i, 1);
                        handleFieldChange("items", next);
                      }}
                      className="portal-icon-btn hover:text-red-500"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  <div className="portal-grid-3col">
                    <div className="portal-field">
                      <label className="portal-field-label text-[10px]">Amenity Name</label>
                      <input
                        type="text"
                        value={item.name || ""}
                        onChange={(e) => {
                          const next = [...payload.items];
                          next[i] = { ...next[i], name: e.target.value };
                          handleFieldChange("items", next);
                        }}
                        className="portal-input"
                      />
                    </div>
                    <div className="portal-field">
                      <label className="portal-field-label text-[10px]">
                        Icon (e.g. waves/trees)
                      </label>
                      <input
                        type="text"
                        value={item.icon || ""}
                        onChange={(e) => {
                          const next = [...payload.items];
                          next[i] = { ...next[i], icon: e.target.value };
                          handleFieldChange("items", next);
                        }}
                        className="portal-input"
                      />
                    </div>
                    <div className="portal-field">
                      <label className="portal-field-label text-[10px]">
                        Category (wellness/recreation/social/utility)
                      </label>
                      <input
                        type="text"
                        value={item.category || ""}
                        onChange={(e) => {
                          const next = [...payload.items];
                          next[i] = { ...next[i], category: e.target.value };
                          handleFieldChange("items", next);
                        }}
                        className="portal-input"
                      />
                    </div>
                  </div>
                  <div className="portal-field">
                    <label className="portal-field-label text-[10px]">Amenity Description</label>
                    <input
                      type="text"
                      value={item.description || ""}
                      onChange={(e) => {
                        const next = [...payload.items];
                        next[i] = { ...next[i], description: e.target.value };
                        handleFieldChange("items", next);
                      }}
                      className="portal-input"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {section.type === "location-map" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="portal-grid-2col">
            <div className="portal-field">
              <label className="portal-field-label">Eyebrow</label>
              <input
                type="text"
                value={getVal("eyebrow")}
                onChange={(e) => handleFieldChange("eyebrow", e.target.value)}
                className="portal-input"
              />
            </div>
            <div className="portal-field">
              <label className="portal-field-label">Intro tagline</label>
              <input
                type="text"
                value={getVal("intro")}
                onChange={(e) => handleFieldChange("intro", e.target.value)}
                className="portal-input"
              />
            </div>
          </div>

          <div className="portal-grid-2col">
            <div className="portal-field">
              <label className="portal-field-label">Map Address Label</label>
              <input
                type="text"
                value={getVal("map_label")}
                onChange={(e) => handleFieldChange("map_label", e.target.value)}
                className="portal-input"
              />
            </div>
            <div className="portal-field">
              <label className="portal-field-label">Google Maps Link URL</label>
              <input
                type="text"
                value={getVal("maps_url")}
                onChange={(e) => handleFieldChange("maps_url", e.target.value)}
                className="portal-input"
              />
            </div>
          </div>

          <div className="portal-field">
            <label className="portal-field-label">Map Graphic Image URL</label>
            <input
              type="text"
              placeholder="e.g. /src/assets/loc-pasig.png or any public url"
              value={getVal("map_image_url")}
              onChange={(e) => handleFieldChange("map_image_url", e.target.value)}
              className="portal-input"
            />
          </div>

          <div className="portal-field border-t border-[var(--portal-border)] pt-4 mt-2">
            <label className="portal-field-label flex justify-between items-center">
              <span>Nearby Landmarks (Travel Times)</span>
              <button
                type="button"
                onClick={() => {
                  const nb = [...getVal("nearby", [])];
                  nb.push({ name: "Mall Name", time: "5 mins", category: "mall" });
                  handleFieldChange("nearby", nb);
                }}
                className="portal-btn-secondary sm"
                style={{ padding: "2px 8px", fontSize: "10.5px" }}
              >
                + Add Landmark
              </button>
            </label>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
              className="mt-2"
            >
              {getVal("nearby", []).map((near: any, i: number) => (
                <div
                  key={i}
                  className="flex gap-2 items-end p-2 bg-white/2 rounded border border-white/5"
                >
                  <div className="portal-field" style={{ flex: 2 }}>
                    <label className="portal-field-label text-[10px]">Landmark Name</label>
                    <input
                      type="text"
                      value={near.name || ""}
                      onChange={(e) => {
                        const next = [...payload.nearby];
                        next[i] = { ...next[i], name: e.target.value };
                        handleFieldChange("nearby", next);
                      }}
                      className="portal-input"
                    />
                  </div>
                  <div className="portal-field" style={{ flex: 1 }}>
                    <label className="portal-field-label text-[10px]">Travel Time</label>
                    <input
                      type="text"
                      placeholder="e.g. 5 mins"
                      value={near.time || ""}
                      onChange={(e) => {
                        const next = [...payload.nearby];
                        next[i] = { ...next[i], time: e.target.value };
                        handleFieldChange("nearby", next);
                      }}
                      className="portal-input"
                    />
                  </div>
                  <div className="portal-field" style={{ flex: 1 }}>
                    <label className="portal-field-label text-[10px]">
                      Category (transit/mall/school/hospital/business/leisure)
                    </label>
                    <input
                      type="text"
                      value={near.category || ""}
                      onChange={(e) => {
                        const next = [...payload.nearby];
                        next[i] = { ...next[i], category: e.target.value };
                        handleFieldChange("nearby", next);
                      }}
                      className="portal-input"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const next = [...payload.nearby];
                      next.splice(i, 1);
                      handleFieldChange("nearby", next);
                    }}
                    className="portal-icon-btn hover:text-red-500 mb-2"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {section.type === "unit-types" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="portal-grid-2col">
            <div className="portal-field">
              <label className="portal-field-label">Eyebrow</label>
              <input
                type="text"
                value={getVal("eyebrow")}
                onChange={(e) => handleFieldChange("eyebrow", e.target.value)}
                className="portal-input"
              />
            </div>
            <div className="portal-field">
              <label className="portal-field-label">Headline</label>
              <input
                type="text"
                value={getVal("headline")}
                onChange={(e) => handleFieldChange("headline", e.target.value)}
                className="portal-input"
              />
            </div>
          </div>
          <div className="p-4 rounded-lg border border-[var(--portal-border)] bg-[var(--portal-bg)]">
            <p className="text-[11px] text-zinc-400 margin-0 leading-relaxed">
              Note: This section acts as a layout container. The actual unit types are loaded
              dynamically from the **Unit Configurations** editor tab.
            </p>
          </div>
        </div>
      )}

      {section.type === "decision-guide" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="portal-field">
            <label className="portal-field-label">Eyebrow</label>
            <input
              type="text"
              value={getVal("eyebrow")}
              onChange={(e) => handleFieldChange("eyebrow", e.target.value)}
              className="portal-input"
            />
          </div>
          <div className="portal-grid-2col">
            <div className="portal-field">
              <label className="portal-field-label">Headline Text Prefix</label>
              <input
                type="text"
                value={getVal("headline")}
                onChange={(e) => handleFieldChange("headline", e.target.value)}
                className="portal-input"
              />
            </div>
            <div className="portal-field">
              <label className="portal-field-label">Headline Text Accent (Colored)</label>
              <input
                type="text"
                value={getVal("headline_accent")}
                onChange={(e) => handleFieldChange("headline_accent", e.target.value)}
                className="portal-input"
              />
            </div>
          </div>
        </div>
      )}

      {section.type === "media-experience" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="portal-field">
            <label className="portal-field-label">Eyebrow</label>
            <input
              type="text"
              value={getVal("eyebrow")}
              onChange={(e) => handleFieldChange("eyebrow", e.target.value)}
              className="portal-input"
            />
          </div>

          <div className="portal-field border-t border-[var(--portal-border)] pt-4 mt-2">
            <label className="portal-field-label flex justify-between items-center">
              <span>Photo Gallery</span>
              <button
                type="button"
                onClick={() => {
                  const ph = [...getVal("photos", [])];
                  ph.push({ tab: "exterior", src: "", thumb: "", title: "New Photo" });
                  handleFieldChange("photos", ph);
                }}
                className="portal-btn-secondary sm"
                style={{ padding: "2px 8px", fontSize: "10.5px" }}
              >
                + Add Photo
              </button>
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }} className="mt-2">
              {getVal("photos", []).map((ph: any, i: number) => (
                <div key={i} className="flex gap-2 items-center">
                  <div className="portal-select-wrap" style={{ flex: 1 }}>
                    <select
                      value={ph.tab || "exterior"}
                      onChange={(e) => {
                        const next = [...payload.photos];
                        next[i] = { ...next[i], tab: e.target.value };
                        handleFieldChange("photos", next);
                      }}
                      className="portal-select"
                    >
                      <option value="exterior">Exterior</option>
                      <option value="amenities">Amenities</option>
                      <option value="interiors">Interiors</option>
                    </select>
                    <ChevronDown size={14} className="portal-select-icon" />
                  </div>
                  <input
                    type="text"
                    placeholder="Title"
                    value={ph.title || ""}
                    onChange={(e) => {
                      const next = [...payload.photos];
                      next[i] = { ...next[i], title: e.target.value };
                      handleFieldChange("photos", next);
                    }}
                    className="portal-input"
                    style={{ flex: 2 }}
                  />
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={ph.src || ""}
                    onChange={(e) => {
                      const next = [...payload.photos];
                      next[i] = { ...next[i], src: e.target.value, thumb: e.target.value };
                      handleFieldChange("photos", next);
                    }}
                    className="portal-input"
                    style={{ flex: 3 }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const next = [...payload.photos];
                      next.splice(i, 1);
                      handleFieldChange("photos", next);
                    }}
                    className="portal-icon-btn hover:text-red-500"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="portal-field border-t border-[var(--portal-border)] pt-4 mt-2">
            <label className="portal-field-label flex justify-between items-center">
              <span>Video Tour Links</span>
              <button
                type="button"
                onClick={() => {
                  const vd = [...getVal("videos", [])];
                  vd.push({ title: "New Video", duration: "0:00", thumb: "" });
                  handleFieldChange("videos", vd);
                }}
                className="portal-btn-secondary sm"
                style={{ padding: "2px 8px", fontSize: "10.5px" }}
              >
                + Add Video
              </button>
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }} className="mt-2">
              {getVal("videos", []).map((vd: any, i: number) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Video Title"
                    value={vd.title || ""}
                    onChange={(e) => {
                      const next = [...payload.videos];
                      next[i] = { ...next[i], title: e.target.value };
                      handleFieldChange("videos", next);
                    }}
                    className="portal-input"
                    style={{ flex: 3 }}
                  />
                  <input
                    type="text"
                    placeholder="Duration e.g. 3:24"
                    value={vd.duration || ""}
                    onChange={(e) => {
                      const next = [...payload.videos];
                      next[i] = { ...next[i], duration: e.target.value };
                      handleFieldChange("videos", next);
                    }}
                    className="portal-input"
                    style={{ flex: 1 }}
                  />
                  <input
                    type="text"
                    placeholder="Thumbnail URL"
                    value={vd.thumb || ""}
                    onChange={(e) => {
                      const next = [...payload.videos];
                      next[i] = { ...next[i], thumb: e.target.value };
                      handleFieldChange("videos", next);
                    }}
                    className="portal-input"
                    style={{ flex: 3 }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const next = [...payload.videos];
                      next.splice(i, 1);
                      handleFieldChange("videos", next);
                    }}
                    className="portal-icon-btn hover:text-red-500"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="portal-field border-t border-[var(--portal-border)] pt-4 mt-2">
            <label className="portal-field-label flex justify-between items-center">
              <span>Downloadable Resource Files</span>
              <button
                type="button"
                onClick={() => {
                  const dw = [...getVal("downloads", [])];
                  dw.push({ name: "New Brochure", size: "PDF · 2.5 MB", icon: "📋" });
                  handleFieldChange("downloads", dw);
                }}
                className="portal-btn-secondary sm"
                style={{ padding: "2px 8px", fontSize: "10.5px" }}
              >
                + Add Download
              </button>
            </label>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
              className="mt-2"
            >
              {getVal("downloads", []).map((dw: any, i: number) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Document Name"
                    value={dw.name || ""}
                    onChange={(e) => {
                      const next = [...payload.downloads];
                      next[i] = { ...next[i], name: e.target.value };
                      handleFieldChange("downloads", next);
                    }}
                    className="portal-input"
                    style={{ flex: 3 }}
                  />
                  <input
                    type="text"
                    placeholder="e.g. PDF · 4.2 MB"
                    value={dw.size || ""}
                    onChange={(e) => {
                      const next = [...payload.downloads];
                      next[i] = { ...next[i], size: e.target.value };
                      handleFieldChange("downloads", next);
                    }}
                    className="portal-input"
                    style={{ flex: 2 }}
                  />
                  <input
                    type="text"
                    placeholder="Icon Emoji"
                    value={dw.icon || "📋"}
                    onChange={(e) => {
                      const next = [...payload.downloads];
                      next[i] = { ...next[i], icon: e.target.value };
                      handleFieldChange("downloads", next);
                    }}
                    className="portal-input"
                    style={{ flex: 1, textAlign: "center" }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const next = [...payload.downloads];
                      next.splice(i, 1);
                      handleFieldChange("downloads", next);
                    }}
                    className="portal-icon-btn hover:text-red-500"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {section.type === "testimonials-slider" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* stats */}
          <div className="portal-field">
            <label className="portal-field-label">Header Key Metrics (Stats)</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {[0, 1, 2].map((i) => {
                const statsList = getVal("stats", []);
                const stat = statsList[i] || { value: "", label: "" };
                return (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. 1,200+"
                      value={stat.value || ""}
                      onChange={(e) => {
                        const next = [
                          ...getVal("stats", [
                            { value: "", label: "" },
                            { value: "", label: "" },
                            { value: "", label: "" },
                          ]),
                        ];
                        next[i] = { ...next[i], value: e.target.value };
                        handleFieldChange("stats", next);
                      }}
                      className="portal-input w-1/3"
                    />
                    <input
                      type="text"
                      placeholder="e.g. Inquiries handled"
                      value={stat.label || ""}
                      onChange={(e) => {
                        const next = [
                          ...getVal("stats", [
                            { value: "", label: "" },
                            { value: "", label: "" },
                            { value: "", label: "" },
                          ]),
                        ];
                        next[i] = { ...next[i], label: e.target.value };
                        handleFieldChange("stats", next);
                      }}
                      className="portal-input w-2/3"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Testimonials */}
          <div className="portal-field border-t border-[var(--portal-border)] pt-4 mt-2">
            <label className="portal-field-label flex justify-between items-center">
              <span>Client Review Cards</span>
              <button
                type="button"
                onClick={() => {
                  const tms = [...getVal("testimonials", [])];
                  tms.push({ name: "Buyer Name", role: "OFW / Professional", quote: "" });
                  handleFieldChange("testimonials", tms);
                }}
                className="portal-btn-secondary sm"
                style={{ padding: "2px 8px", fontSize: "10.5px" }}
              >
                + Add Review
              </button>
            </label>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
              className="mt-2"
            >
              {getVal("testimonials", []).map((tm: any, i: number) => (
                <div
                  key={i}
                  className="flex flex-col gap-2 p-3 bg-white/2 rounded-lg border border-white/5"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-zinc-400">
                      Review Card #{i + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const next = [...payload.testimonials];
                        next.splice(i, 1);
                        handleFieldChange("testimonials", next);
                      }}
                      className="portal-icon-btn hover:text-red-500"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  <div className="portal-grid-2col">
                    <div className="portal-field">
                      <label className="portal-field-label text-[10px]">Client Name</label>
                      <input
                        type="text"
                        value={tm.name || ""}
                        onChange={(e) => {
                          const next = [...payload.testimonials];
                          next[i] = { ...next[i], name: e.target.value };
                          handleFieldChange("testimonials", next);
                        }}
                        className="portal-input"
                      />
                    </div>
                    <div className="portal-field">
                      <label className="portal-field-label text-[10px]">
                        Role / Location Profile
                      </label>
                      <input
                        type="text"
                        value={tm.role || ""}
                        onChange={(e) => {
                          const next = [...payload.testimonials];
                          next[i] = { ...next[i], role: e.target.value };
                          handleFieldChange("testimonials", next);
                        }}
                        className="portal-input"
                      />
                    </div>
                  </div>
                  <div className="portal-field">
                    <label className="portal-field-label text-[10px]">Quote Narrative</label>
                    <textarea
                      rows={2}
                      value={tm.quote || ""}
                      onChange={(e) => {
                        const next = [...payload.testimonials];
                        next[i] = { ...next[i], quote: e.target.value };
                        handleFieldChange("testimonials", next);
                      }}
                      className="portal-textarea"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {section.type === "faq-list" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <label className="portal-field-label flex justify-between items-center">
            <span>Frequently Asked Questions List</span>
            <button
              type="button"
              onClick={() => {
                const items = [...getVal("items", [])];
                items.push({ q: "Question?", a: "Answer text." });
                handleFieldChange("items", items);
              }}
              className="portal-btn-secondary sm"
              style={{ padding: "2px 8px", fontSize: "10.5px" }}
            >
              + Add FAQ
            </button>
          </label>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
            className="mt-2"
          >
            {getVal("items", []).map((item: any, i: number) => (
              <div
                key={i}
                className="flex flex-col gap-2 p-3 bg-white/2 rounded-lg border border-white/5"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-zinc-400">FAQ Item #{i + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = [...payload.items];
                      next.splice(i, 1);
                      handleFieldChange("items", next);
                    }}
                    className="portal-icon-btn hover:text-red-500"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <div className="portal-field">
                  <label className="portal-field-label text-[10px]">Question</label>
                  <input
                    type="text"
                    value={item.q || ""}
                    onChange={(e) => {
                      const next = [...payload.items];
                      next[i] = { ...next[i], q: e.target.value };
                      handleFieldChange("items", next);
                    }}
                    className="portal-input"
                  />
                </div>
                <div className="portal-field">
                  <label className="portal-field-label text-[10px]">Answer Narrative</label>
                  <textarea
                    rows={2}
                    value={item.a || ""}
                    onChange={(e) => {
                      const next = [...payload.items];
                      next[i] = { ...next[i], a: e.target.value };
                      handleFieldChange("items", next);
                    }}
                    className="portal-textarea"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {section.type === "lead-capture" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="portal-grid-2col">
            <div className="portal-field">
              <label className="portal-field-label">Eyebrow</label>
              <input
                type="text"
                value={getVal("eyebrow")}
                onChange={(e) => handleFieldChange("eyebrow", e.target.value)}
                className="portal-input"
              />
            </div>
            <div className="portal-field">
              <label className="portal-field-label">Sub Tagline</label>
              <input
                type="text"
                value={getVal("sub")}
                onChange={(e) => handleFieldChange("sub", e.target.value)}
                className="portal-input"
              />
            </div>
          </div>

          <div className="portal-grid-2col">
            <div className="portal-field">
              <label className="portal-field-label">Headline Text Prefix</label>
              <input
                type="text"
                value={getVal("headline")}
                onChange={(e) => handleFieldChange("headline", e.target.value)}
                className="portal-input"
              />
            </div>
            <div className="portal-field">
              <label className="portal-field-label">Headline Text Accent (Colored)</label>
              <input
                type="text"
                value={getVal("headline_accent")}
                onChange={(e) => handleFieldChange("headline_accent", e.target.value)}
                className="portal-input"
              />
            </div>
          </div>

          <div className="portal-field border-t border-[var(--portal-border)] pt-4 mt-2">
            <label className="portal-field-label">
              Inquiry Unit Choice Dropdowns (comma separated)
            </label>
            <input
              type="text"
              placeholder="Studio, 1-Bedroom, 2-Bedroom, Price List Only"
              value={getVal("unit_options", []).join(", ")}
              onChange={(e) => {
                const opts = e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean);
                handleFieldChange("unit_options", opts);
              }}
              className="portal-input"
            />
          </div>
        </div>
      )}

      {section.type === "related" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="portal-field">
            <label className="portal-field-label">
              Related Project URL Slugs (comma separated)
            </label>
            <input
              type="text"
              placeholder="allegra-garden, satori-residences, atherton"
              value={getVal("related_slugs", []).join(", ")}
              onChange={(e) => {
                const slugs = e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean);
                handleFieldChange("related_slugs", slugs);
              }}
              className="portal-input"
            />
          </div>
        </div>
      )}

      {![
        "hero",
        "emotional-hook",
        "pricing-snapshot",
        "project-overview",
        "highlights",
        "amenities",
        "location-map",
        "unit-types",
        "decision-guide",
        "media-experience",
        "testimonials-slider",
        "faq-list",
        "lead-capture",
        "related",
      ].includes(section.type) && (
        <div className="portal-field">
          <label className="portal-field-label">Generic Section Payload (JSON)</label>
          <textarea
            rows={8}
            value={JSON.stringify(payload, null, 2)}
            onChange={(e) => {
              try {
                onChange(JSON.parse(e.target.value));
              } catch {
                // Keep the last valid payload while the admin is editing invalid JSON.
              }
            }}
            className="portal-textarea font-mono text-xs text-zinc-300"
            style={{ background: "#09090b" }}
          />
        </div>
      )}
    </div>
  );
}

// ─── UTILITIES ────────────────────────────────────────────────────────────────

// Returns a list of human-readable problems that must be fixed before publishing.
// Empty array means the draft is publishable.
function validateDraft(draft: any): string[] {
  if (!draft) return [];
  const issues: string[] = [];
  const meta = draft.project_meta || {};

  if (!meta.title || !meta.title.trim()) issues.push("Project title is required (General tab).");
  if (!meta.slug || !meta.slug.trim()) issues.push("URL slug is required (General tab).");
  else if (!/^[a-z0-9-]+$/.test(meta.slug))
    issues.push("URL slug may only contain lowercase letters, numbers, and dashes.");
  if (!meta.city || !meta.city.trim()) issues.push("City is required (General tab).");

  const flow = draft.layout_flow || [];
  const hero = flow.find((s: any) => s.type === "hero");
  if (!hero) {
    issues.push("A Hero section is required.");
  } else {
    if (!hero.payload?.tagline?.trim()) issues.push("Hero tagline is required.");
    if (!(hero.payload?.hero_images?.length > 0))
      issues.push("Hero needs at least one carousel image.");
  }

  if ((draft.units || []).length === 0)
    issues.push("Add at least one unit type (Units tab) so pricing renders.");

  return issues;
}

function genId() {
  return Math.random().toString(36).substring(2, 9);
}

function getEmptyPayloadFor(type: string) {
  switch (type) {
    case "hero":
      return {
        tagline: "Resort Living. Urban Access. One Address.",
        secondary_tagline: "",
        cta_primary_text: "Request Price List",
        cta_secondary_text: "Free Computation",
      };
    case "emotional-hook":
      return {
        eyebrow: "The Lifestyle",
        headline: "Wake up 5 minutes from Alabang",
        sub: "your workday escapes",
        points: ["5 minutes to CBD", "Lap Pool access"],
      };
    case "pricing-snapshot":
      return {
        title: "Pricing",
        sub_title: "for as low as",
        description: "Pre-selling prices are at their lowest.",
        show_urgency: true,
        urgency_text_1: "Prices increase quarterly",
        urgency_text_2: "Selected units selling fast",
      };
    case "project-overview":
      return { title: "Overview", headline_span: "Sanctuary." };
    case "highlights":
      return {
        eyebrow: "Why invest",
        items: [{ icon: "trees", title: "Resort Living", description: "Lush gardens" }],
      };
    case "amenities":
      return {
        eyebrow: "Amenities",
        intro: "Everything you need.",
        items: [
          { name: "Lap Pool", description: "Olympic size", icon: "waves", category: "wellness" },
        ],
      };
    case "location-map":
      return {
        eyebrow: "Location",
        intro: "Prime address",
        map_label: "Alabang-Zapote Road",
        maps_url: "",
        nearby: [{ name: "Robinsons", time: "2 min walk", category: "mall" }],
      };
    case "unit-types":
      return { eyebrow: "Configurations", headline: "Choose Your Space" };
    case "decision-guide":
      return { eyebrow: "Decision Guide", headline: "Which unit is", headline_accent: "right?" };
    case "media-experience":
      return {
        eyebrow: "Downloads",
        photos: [],
        videos: [],
        downloads: [{ name: "Brochure", size: "PDF · 4.2 MB", icon: "📋" }],
      };
    case "testimonials-slider":
      return {
        stats: [{ value: "1,200+", label: "Inquiries" }],
        testimonials: [{ name: "Client", role: "OFW", quote: "Excellent service" }],
      };
    case "faq-list":
      return { items: [{ q: "Where is it located?", a: "Along Alabang-Zapote Road" }] };
    case "lead-capture":
      return {
        eyebrow: "Get Started",
        headline: "Interested?",
        headline_accent: "Inquire Now",
        sub: "Leave details below",
        unit_options: ["Studio", "1-Bedroom"],
      };
    case "related":
      return { related_slugs: [] };
    default:
      return {};
  }
}
