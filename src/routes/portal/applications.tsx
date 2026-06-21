import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import {
  Briefcase,
  Search,
  ChevronDown,
  AlertTriangle,
  Mail,
  Phone,
  Calendar,
  ExternalLink,
  Trash2,
  Eye,
} from "lucide-react";
import {
  getApplications,
  updateApplication,
  deleteApplication,
} from "../../lib/api/admin.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/applications")({
  component: ApplicationsAdminPage,
});

type Application = {
  id: string;
  role: string;
  name: string;
  email: string;
  phone: string | null;
  cover_letter: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  status: "new" | "reviewing" | "shortlisted" | "rejected" | "hired";
  notes: string | null;
  created_at: string;
  updated_at: string;
};

const STATUS_CONFIG: Record<
  Application["status"],
  { label: string; badge: string; color: string }
> = {
  new: { label: "New", badge: "status-new", color: "#60a5fa" },
  reviewing: { label: "Reviewing", badge: "status-contacted", color: "#f59e0b" },
  shortlisted: { label: "Shortlisted", badge: "status-qualified", color: "#34d399" },
  rejected: { label: "Rejected", badge: "status-spam", color: "#f87171" },
  hired: { label: "Hired 🎉", badge: "status-closed", color: "#a78bfa" },
};

const ROLES = [
  "Property Advisory Consultant",
  "Digital Content Producer",
  "Client Success Associate",
];

function DetailPanel({
  app,
  onClose,
  onStatusChange,
  onNoteSave,
  onDelete,
  isUpdating,
  isDeleting,
}: {
  app: Application;
  onClose: () => void;
  onStatusChange: (status: Application["status"]) => void;
  onNoteSave: (notes: string) => void;
  onDelete: () => void;
  isUpdating: boolean;
  isDeleting: boolean;
}) {
  const [notes, setNotes] = useState(app.notes ?? "");

  return (
    <div className="portal-detail-overlay" onClick={onClose}>
      <div
        className="portal-detail-panel"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "600px" }}
      >
        {/* Header */}
        <div className="portal-detail-header">
          <div>
            <h2 className="portal-detail-name">{app.name}</h2>
            <p style={{ fontSize: "12px", color: "var(--zinc-400)", marginTop: "2px" }}>
              Applied for: <strong style={{ color: "var(--zinc-300)" }}>{app.role}</strong>
            </p>
          </div>
          <button className="portal-detail-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="portal-detail-body" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Contact info */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.75rem",
            }}
          >
            <a
              href={`mailto:${app.email}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "13px",
                color: "#60a5fa",
                textDecoration: "none",
              }}
            >
              <Mail size={14} />
              {app.email}
            </a>
            {app.phone && (
              <a
                href={`tel:${app.phone}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "13px",
                  color: "var(--zinc-300)",
                  textDecoration: "none",
                }}
              >
                <Phone size={14} />
                {app.phone}
              </a>
            )}
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "12px",
                color: "var(--zinc-500)",
              }}
            >
              <Calendar size={12} />
              {new Date(app.created_at).toLocaleDateString("en-PH", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          {/* Links */}
          {(app.linkedin_url || app.portfolio_url) && (
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              {app.linkedin_url && (
                <a
                  href={app.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    fontSize: "12px",
                    color: "#60a5fa",
                    border: "1px solid rgba(96,165,250,0.25)",
                    borderRadius: "6px",
                    padding: "4px 10px",
                    textDecoration: "none",
                    background: "rgba(96,165,250,0.05)",
                  }}
                >
                  <ExternalLink size={11} />
                  LinkedIn Profile
                </a>
              )}
              {app.portfolio_url && (
                <a
                  href={app.portfolio_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    fontSize: "12px",
                    color: "var(--zinc-300)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "6px",
                    padding: "4px 10px",
                    textDecoration: "none",
                    background: "rgba(255,255,255,0.04)",
                  }}
                >
                  <ExternalLink size={11} />
                  Portfolio / Website
                </a>
              )}
            </div>
          )}

          {/* Cover letter */}
          {app.cover_letter && (
            <div className="portal-field">
              <label className="portal-field-label">Cover Letter / Message</label>
              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "8px",
                  padding: "0.875rem 1rem",
                  fontSize: "13px",
                  color: "var(--zinc-300)",
                  lineHeight: "1.6",
                  whiteSpace: "pre-wrap",
                  maxHeight: "200px",
                  overflowY: "auto",
                }}
              >
                {app.cover_letter}
              </div>
            </div>
          )}

          {/* Status update */}
          <div className="portal-field">
            <label className="portal-field-label">Application Status</label>
            <div className="portal-select-wrap" style={{ maxWidth: "240px" }}>
              <select
                className="portal-select"
                value={app.status}
                onChange={(e) => onStatusChange(e.target.value as Application["status"])}
                disabled={isUpdating}
              >
                {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="portal-select-icon" />
            </div>
          </div>

          {/* Internal notes */}
          <div className="portal-field">
            <label className="portal-field-label">Internal Notes</label>
            <textarea
              className="portal-input"
              rows={4}
              style={{ resize: "vertical", minHeight: "90px" }}
              placeholder="Add notes about this candidate (only visible to admins)..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: "0.5rem",
              borderTop: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <button
              className="portal-action-btn delete"
              style={{ padding: "0.5rem 0.875rem", fontSize: "12px", display: "flex", alignItems: "center", gap: "0.4rem" }}
              onClick={onDelete}
              disabled={isDeleting}
            >
              <Trash2 size={13} />
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button className="portal-btn-ghost" onClick={onClose}>
                Close
              </button>
              <button
                className="portal-btn-primary"
                onClick={() => onNoteSave(notes)}
                disabled={isUpdating}
              >
                {isUpdating ? "Saving..." : "Save Notes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ApplicationsAdminPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected] = useState<Application | null>(null);

  const { data: apps = [], isLoading } = useQuery<Application[]>({
    queryKey: ["admin-applications"],
    queryFn: () => getApplications() as Promise<Application[]>,
  });

  const filtered = useMemo(() => {
    return apps.filter((a) => {
      if (filterRole !== "all" && a.role !== filterRole) return false;
      if (filterStatus !== "all" && a.status !== filterStatus) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !a.name.toLowerCase().includes(q) &&
          !a.email.toLowerCase().includes(q) &&
          !a.role.toLowerCase().includes(q) &&
          !(a.cover_letter ?? "").toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [apps, search, filterRole, filterStatus]);

  const stats = useMemo(() => ({
    total: apps.length,
    new: apps.filter((a) => a.status === "new").length,
    shortlisted: apps.filter((a) => a.status === "shortlisted").length,
    hired: apps.filter((a) => a.status === "hired").length,
  }), [apps]);

  const updateMut = useMutation({
    mutationFn: (data: { id: string; status?: Application["status"]; notes?: string }) =>
      updateApplication({ data }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-applications"] });
      // Update selected in-place so panel reflects change immediately
      if (selected) {
        setSelected((prev) => prev ? { ...prev, ...updateMut.variables } : prev);
      }
      toast.success("Application updated");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Update failed"),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteApplication({ data: { id } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-applications"] });
      setSelected(null);
      toast.success("Application deleted");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Delete failed"),
  });

  return (
    <div className="portal-page">
      {/* Header */}
      <div className="portal-page-header">
        <div>
          <h1 className="portal-page-title">Job Applications</h1>
          <p className="portal-page-desc">
            Review and manage applicants from the careers page.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div
        className="portal-stats-grid"
        style={{ gridTemplateColumns: "repeat(4, 1fr)", marginBottom: "1.5rem" }}
      >
        {[
          { label: "Total", value: stats.total, color: "stat-blue" },
          { label: "New", value: stats.new, color: "stat-amber" },
          { label: "Shortlisted", value: stats.shortlisted, color: "stat-green" },
          { label: "Hired", value: stats.hired, color: "stat-purple" },
        ].map((s) => (
          <div key={s.label} className={`portal-stat-card ${s.color}`}>
            <div className="portal-stat-body">
              <span className="portal-stat-value">{s.value}</span>
              <span className="portal-stat-label">{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
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
            placeholder="Search name, email, role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="portal-select-wrap" style={{ minWidth: "200px" }}>
          <select
            className="portal-select"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="all">All Roles</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <ChevronDown size={14} className="portal-select-icon" />
        </div>

        <div className="portal-select-wrap" style={{ minWidth: "150px" }}>
          <select
            className="portal-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
          <ChevronDown size={14} className="portal-select-icon" />
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="portal-card" style={{ padding: "3rem", textAlign: "center" }}>
          <span style={{ color: "var(--zinc-400)" }}>Loading applications...</span>
        </div>
      ) : filtered.length > 0 ? (
        <div className="portal-card" style={{ overflowX: "auto" }}>
          <table className="portal-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Role</th>
                <th>Contact</th>
                <th>Date</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((app) => {
                const cfg = STATUS_CONFIG[app.status];
                return (
                  <tr key={app.id} style={{ cursor: "pointer" }} onClick={() => setSelected(app)}>
                    <td>
                      <div style={{ fontWeight: 600, color: "var(--zinc-100)" }}>{app.name}</div>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: "11px",
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: "4px",
                          padding: "2px 7px",
                          color: "var(--zinc-300)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {app.role}
                      </span>
                    </td>
                    <td style={{ fontSize: "12px", color: "var(--zinc-400)" }}>
                      <div>{app.email}</div>
                      {app.phone && <div>{app.phone}</div>}
                    </td>
                    <td style={{ fontSize: "12px", color: "var(--zinc-500)", whiteSpace: "nowrap" }}>
                      {new Date(app.created_at).toLocaleDateString("en-PH")}
                    </td>
                    <td>
                      <span className={`portal-badge ${cfg.badge}`}>{cfg.label}</span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                        <button
                          className="portal-action-btn"
                          title="View application"
                          onClick={() => setSelected(app)}
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          className="portal-action-btn delete"
                          title="Delete"
                          onClick={() => deleteMut.mutate(app.id)}
                          disabled={deleteMut.isPending}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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
            <Briefcase size={20} />
          </div>
          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--zinc-200)" }}>
            No applications yet
          </h3>
          <p style={{ fontSize: "13px", color: "var(--zinc-500)", marginTop: "4px" }}>
            Applications submitted from the careers page will appear here.
          </p>
        </div>
      )}

      {/* Detail panel */}
      {selected && (
        <DetailPanel
          app={selected}
          onClose={() => setSelected(null)}
          isUpdating={updateMut.isPending}
          isDeleting={deleteMut.isPending}
          onStatusChange={(status) => {
            updateMut.mutate({ id: selected.id, status });
            setSelected((prev) => (prev ? { ...prev, status } : prev));
          }}
          onNoteSave={(notes) => updateMut.mutate({ id: selected.id, notes })}
          onDelete={() => deleteMut.mutate(selected.id)}
        />
      )}
    </div>
  );
}
