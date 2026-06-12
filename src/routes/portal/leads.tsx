import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  Trash2,
  Edit3,
  StickyNote,
  Calendar,
  RefreshCw,
  Users,
} from "lucide-react";
import {
  getLeads,
  updateLead,
  softDeleteLead,
  addLeadNote,
  getLeadNotes,
} from "../../lib/api/admin.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/leads")({
  component: LeadsPage,
});

const STATUSES = ["new", "contacted", "qualified", "closed", "spam"] as const;
const SOURCES = [
  "website",
  "facebook",
  "instagram",
  "google",
  "tiktok",
  "referral",
  "organic",
] as const;

type Status = (typeof STATUSES)[number];
type Lead = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  message?: string;
  source?: string;
  status: Status;
  follow_up_at?: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
};

const STATUS_COLORS: Record<Status, string> = {
  new: "status-new",
  contacted: "status-contacted",
  qualified: "status-qualified",
  closed: "status-closed",
  spam: "status-spam",
};

function LeadsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<Status | "all">("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showNotes, setShowNotes] = useState(false);
  const [newNote, setNewNote] = useState("");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["portal-leads"],
    queryFn: () => getLeads(),
  });

  const { data: leadNotes, isLoading: notesLoading } = useQuery({
    queryKey: ["lead-notes", selectedLead?.id],
    queryFn: () => getLeadNotes({ data: { lead_id: selectedLead!.id } }),
    enabled: !!selectedLead && showNotes,
  });

  const updateMutation = useMutation({
    mutationFn: (vars: Parameters<typeof updateLead>[0]) => updateLead(vars),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["portal-leads"] });
      toast.success("Lead updated");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Update failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => softDeleteLead({ data: { id } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["portal-leads"] });
      setSelectedLead(null);
      toast.success("Lead archived");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Delete failed"),
  });

  const noteMutation = useMutation({
    mutationFn: () => addLeadNote({ data: { lead_id: selectedLead!.id, note: newNote } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lead-notes", selectedLead?.id] });
      setNewNote("");
      toast.success("Note added");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Note failed"),
  });

  const leads: Lead[] = data?.leads ?? [];

  const filtered = leads.filter((l) => {
    const matchSearch =
      !search ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || l.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="portal-page">
      {/* Header */}
      <div className="portal-page-header">
        <div>
          <h1 className="portal-page-title">Leads</h1>
          <p className="portal-page-desc">
            {data?.total ?? 0} total · {data?.byStatus.new ?? 0} new
          </p>
        </div>
        <button onClick={() => refetch()} className="portal-btn-ghost">
          <RefreshCw size={15} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="portal-filters">
        <div className="portal-search-wrap">
          <Search size={15} className="portal-search-icon" />
          <input
            id="leads-search"
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="portal-search-input"
          />
        </div>

        <div className="portal-filter-pills">
          {(["all", ...STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s as Status | "all")}
              className={`portal-pill ${filterStatus === s ? "active" : ""}`}
            >
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              {s !== "all" && data?.byStatus[s as Status] !== undefined && (
                <span className="portal-pill-count">{data.byStatus[s as Status]}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="portal-card no-pad">
        <div className="portal-table-wrap">
          <table className="portal-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Source</th>
                <th>Status</th>
                <th>Follow-up</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="skeleton-row">
                    <td colSpan={7}>
                      <div className="skeleton table-skeleton" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="portal-table-empty">
                    <Users size={32} />
                    <span>No leads found</span>
                  </td>
                </tr>
              ) : (
                filtered.map((lead) => (
                  <tr
                    key={lead.id}
                    className={`portal-table-row ${selectedLead?.id === lead.id ? "selected" : ""}`}
                    onClick={() => {
                      setSelectedLead(lead);
                      setShowNotes(false);
                    }}
                  >
                    <td>
                      <div className="portal-lead-cell">
                        <div className="portal-lead-avatar sm">{lead.name[0]?.toUpperCase()}</div>
                        <span className="portal-lead-name">{lead.name}</span>
                      </div>
                    </td>
                    <td>
                      <div className="portal-lead-contact">
                        <span>{lead.email}</span>
                        {lead.phone && <span className="muted">{lead.phone}</span>}
                      </div>
                    </td>
                    <td>
                      <span className="portal-source-chip">{lead.source ?? "website"}</span>
                    </td>
                    <td>
                      <span className={`portal-status-badge ${STATUS_COLORS[lead.status]}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td>
                      {lead.follow_up_at ? (
                        <span className="portal-followup">
                          <Calendar size={12} />
                          {new Date(lead.follow_up_at).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="muted">—</span>
                      )}
                    </td>
                    <td className="muted text-sm">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <button
                        className="portal-icon-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLead(lead);
                        }}
                        title="Edit lead"
                      >
                        <Edit3 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead detail panel */}
      {selectedLead && (
        <div className="portal-detail-overlay" onClick={() => setSelectedLead(null)}>
          <div className="portal-detail-panel" onClick={(e) => e.stopPropagation()}>
            <div className="portal-detail-header">
              <div className="portal-lead-avatar lg">{selectedLead.name[0]?.toUpperCase()}</div>
              <div>
                <h2 className="portal-detail-name">{selectedLead.name}</h2>
                <p className="portal-detail-email">{selectedLead.email}</p>
              </div>
              <button className="portal-detail-close" onClick={() => setSelectedLead(null)}>
                ✕
              </button>
            </div>

            <div className="portal-detail-body">
              {/* Message */}
              {selectedLead.message && (
                <div className="portal-detail-section">
                  <span className="portal-detail-label">Message</span>
                  <p className="portal-detail-message">{selectedLead.message}</p>
                </div>
              )}

              {/* Update Status */}
              <div className="portal-detail-section">
                <span className="portal-detail-label">Status</span>
                <div className="portal-select-wrap">
                  <select
                    value={selectedLead.status}
                    onChange={(e) => {
                      const status = e.target.value as Status;
                      updateMutation.mutate({
                        data: { id: selectedLead.id, status },
                      });
                      setSelectedLead({ ...selectedLead, status });
                    }}
                    className="portal-select"
                    id="lead-status-select"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="portal-select-icon" />
                </div>
              </div>

              {/* Update Source */}
              <div className="portal-detail-section">
                <span className="portal-detail-label">Source</span>
                <div className="portal-select-wrap">
                  <select
                    value={selectedLead.source ?? "website"}
                    onChange={(e) => {
                      const source = e.target.value as (typeof SOURCES)[number];
                      updateMutation.mutate({
                        data: { id: selectedLead.id, source },
                      });
                      setSelectedLead({ ...selectedLead, source });
                    }}
                    className="portal-select"
                    id="lead-source-select"
                  >
                    {SOURCES.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="portal-select-icon" />
                </div>
              </div>

              {/* Follow-up date */}
              <div className="portal-detail-section">
                <span className="portal-detail-label">Follow-up Date</span>
                <input
                  type="datetime-local"
                  className="portal-input"
                  id="lead-followup-input"
                  defaultValue={
                    selectedLead.follow_up_at
                      ? new Date(selectedLead.follow_up_at).toISOString().slice(0, 16)
                      : ""
                  }
                  onBlur={(e) => {
                    const follow_up_at = e.target.value
                      ? new Date(e.target.value).toISOString()
                      : null;
                    updateMutation.mutate({
                      data: { id: selectedLead.id, follow_up_at },
                    });
                  }}
                />
              </div>

              {/* Notes */}
              <div className="portal-detail-section">
                <button
                  className="portal-detail-label toggle-btn"
                  onClick={() => setShowNotes(!showNotes)}
                >
                  <StickyNote size={14} />
                  Notes {showNotes ? "▲" : "▼"}
                </button>

                {showNotes && (
                  <div className="portal-notes-wrap">
                    <div className="portal-notes-input-row">
                      <textarea
                        placeholder="Add a note…"
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        className="portal-textarea"
                        id="lead-note-input"
                        rows={3}
                      />
                      <button
                        onClick={() => noteMutation.mutate()}
                        disabled={!newNote.trim() || noteMutation.isPending}
                        className="portal-btn-primary sm"
                      >
                        Add
                      </button>
                    </div>

                    <div className="portal-notes-list">
                      {notesLoading ? (
                        <div className="skeleton portal-note-skeleton" />
                      ) : !leadNotes || leadNotes.length === 0 ? (
                        <p className="portal-empty-state sm">No notes yet.</p>
                      ) : (
                        leadNotes.map((n: any) => (
                          <div key={n.id} className="portal-note">
                            <div className="portal-note-header">
                              <span className="portal-note-author">
                                {n.author?.full_name ?? "Unknown"}
                              </span>
                              <span className="portal-note-date">
                                {new Date(n.created_at).toLocaleString()}
                              </span>
                            </div>
                            <p className="portal-note-text">{n.note}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Soft Delete */}
              <div className="portal-detail-footer">
                <button
                  onClick={() => {
                    if (confirm("Archive this lead? This action is reversible.")) {
                      deleteMutation.mutate(selectedLead.id);
                    }
                  }}
                  disabled={deleteMutation.isPending}
                  className="portal-btn-danger"
                  id="lead-archive-btn"
                >
                  <Trash2 size={14} />
                  Archive Lead
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
