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
} from "lucide-react";
import {
  getAdminProjects,
  createProject,
  deleteProject,
  saveProjectDraft,
  publishProject,
  getProjectBySlug,
  getAdminProperties,
} from "../../lib/api/admin.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/projects")({
  component: ProjectsPage,
});

type TabType = "general" | "sections" | "units" | "raw";

function ProjectsPage() {
  const qc = useQueryClient();
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeProjectSlug, setActiveProjectSlug] = useState<string | null>(null);
  const [activeProjectTitle, setActiveProjectTitle] = useState<string | null>(null);

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
    data: projects,
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
    return new Set(projects.map((p) => p.slug));
  }, [projects]);

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
        const matching = projects?.find((p) => p.id === res.id);
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
            Manage your Dynamic Property CMS profiles, configurations, and landing page layouts.
          </p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="portal-btn-primary">
          <Plus size={16} />
          New Project
        </button>
      </div>

      {/* Projects Grid/List */}
      <div className="portal-card no-pad">
        <div className="portal-table-wrap">
          <table className="portal-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Developer</th>
                <th>City</th>
                <th>Status</th>
                <th>Price Range</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {listLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="skeleton-row">
                    <td colSpan={7}>
                      <div className="skeleton table-skeleton" />
                    </td>
                  </tr>
                ))
              ) : !projects || projects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="portal-table-empty">
                    <FolderOpen size={32} />
                    <span>No projects found. Create one to get started.</span>
                  </td>
                </tr>
              ) : (
                projects.map((proj) => (
                  <tr key={proj.id} className="portal-table-row">
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                        <span className="font-bold text-zinc-100">{proj.title}</span>
                        <span className="text-[11px] text-zinc-400 font-mono">/{proj.slug}</span>
                      </div>
                    </td>
                    <td>
                      <span className="portal-source-chip">{proj.category}</span>
                    </td>
                    <td className="text-zinc-300 font-medium">{proj.developer}</td>
                    <td className="text-zinc-300">{proj.city}</td>
                    <td>
                      <span className={`portal-status-badge status-${proj.status}`}>
                        {proj.status}
                      </span>
                    </td>
                    <td className="font-mono text-xs text-zinc-200">
                      ₱{(proj.min_price / 1000000).toFixed(1)}M - ₱
                      {(proj.max_price / 1000000).toFixed(1)}M
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                        <a
                          href={`/projects/${proj.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="portal-icon-btn"
                          title="View public page"
                        >
                          <Eye size={14} />
                        </a>
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
                            if (
                              confirm(
                                `Are you sure you want to delete "${proj.title}"? This will delete all layouts, draft workspaces, and revisions permanently.`,
                              )
                            ) {
                              deleteMutation.mutate(proj.id);
                            }
                          }}
                          className="portal-icon-btn hover:text-red-500"
                          title="Delete project"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
              <button className="portal-detail-close" onClick={() => setShowCreateModal(false)}>
                ✕
              </button>
            </div>
             <div
              className="portal-detail-body"
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {unlinkedProperties.length > 0 && (
                <div className="portal-field" style={{ background: "rgba(255, 255, 255, 0.03)", padding: "0.75rem", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
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
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.location})
                        </option>
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
                <input
                  type="text"
                  placeholder="e.g., Sonora Garden Residences"
                  value={newProj.title}
                  onChange={(e) => setNewProj((prev) => ({ ...prev, title: e.target.value }))}
                  className="portal-input"
                />
              </div>

              <div className="portal-field">
                <label className="portal-field-label">Slug (URL path)</label>
                <input
                  type="text"
                  placeholder="e.g., sonora-garden"
                  value={newProj.slug}
                  onChange={(e) =>
                    setNewProj((prev) => ({
                      ...prev,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                    }))
                  }
                  className="portal-input"
                />
              </div>

              <div className="portal-grid-2col">
                <div className="portal-field">
                  <label className="portal-field-label">Category</label>
                  <div className="portal-select-wrap">
                    <select
                      value={newProj.category}
                      onChange={(e) =>
                        setNewProj((prev) => ({ ...prev, category: e.target.value as any }))
                      }
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
                  <label className="portal-field-label">Developer</label>
                  <input
                    type="text"
                    value={newProj.developer}
                    onChange={(e) => setNewProj((prev) => ({ ...prev, developer: e.target.value }))}
                    className="portal-input"
                  />
                </div>
              </div>

              <div className="portal-grid-2col">
                <div className="portal-field">
                  <label className="portal-field-label">City</label>
                  <input
                    type="text"
                    placeholder="e.g., Las Piñas"
                    value={newProj.city}
                    onChange={(e) => setNewProj((prev) => ({ ...prev, city: e.target.value }))}
                    className="portal-input"
                  />
                </div>
                <div className="portal-field">
                  <label className="portal-field-label">Full Address</label>
                  <input
                    type="text"
                    placeholder="e.g., Alabang-Zapote Road"
                    value={newProj.full_address}
                    onChange={(e) =>
                      setNewProj((prev) => ({ ...prev, full_address: e.target.value }))
                    }
                    className="portal-input"
                  />
                </div>
              </div>

              <div className="portal-grid-2col">
                <div className="portal-field">
                  <label className="portal-field-label">Minimum Price (₱)</label>
                  <input
                    type="number"
                    value={newProj.min_price}
                    onChange={(e) =>
                      setNewProj((prev) => ({ ...prev, min_price: parseInt(e.target.value) || 0 }))
                    }
                    className="portal-input"
                  />
                </div>
                <div className="portal-field">
                  <label className="portal-field-label">Maximum Price (₱)</label>
                  <input
                    type="number"
                    value={newProj.max_price}
                    onChange={(e) =>
                      setNewProj((prev) => ({ ...prev, max_price: parseInt(e.target.value) || 0 }))
                    }
                    className="portal-input"
                  />
                </div>
              </div>

              <div className="portal-detail-footer" style={{ marginTop: "1rem" }}>
                <button
                  onClick={() => createMutation.mutate({ data: newProj })}
                  disabled={
                    createMutation.isPending || !newProj.title || !newProj.slug || !newProj.city
                  }
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

// ─── EDITOR COMPONENT ─────────────────────────────────────────────────────────

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

  const handlePublish = () => {
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
            disabled={publishMutation.isPending}
            className="portal-btn-primary"
          >
            <Sparkles size={15} />
            {publishMutation.isPending ? "Publishing..." : "Publish Live"}
          </button>
        </div>
      </div>

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
            <label className="portal-field-label">
              Hero Carousel Images (comma separated URLs)
            </label>
            <input
              type="text"
              placeholder="e.g. /src/assets/tower-exterior.jpg, /src/assets/amenity-pool.jpg"
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

function genId() {
  return Math.random().toString(36).substring(2, 9);
}

function getEmptyPayloadFor(type: string) {
  switch (type) {
    case "hero":
      return {
        tagline: "Resort Living. Urban Access. One Address.",
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
