import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  TrendingUp,
  CheckCircle,
  Sparkles,
  Clock,
  BarChart2,
  ArrowRight,
  Activity,
} from "lucide-react";
import { getLeads, getActivities } from "../../lib/api/admin.functions";

export const Route = createFileRoute("/portal/")({
  component: DashboardPage,
});

function DashboardPage() {
  const { data: leadsData, isLoading: leadsLoading } = useQuery({
    queryKey: ["portal-leads"],
    queryFn: () => getLeads(),
  });

  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ["portal-activities"],
    queryFn: () => getActivities(),
  });

  const stats = leadsData
    ? [
        {
          id: "total",
          label: "Total Leads",
          value: leadsData.total,
          icon: Users,
          color: "stat-blue",
          description: "All active leads",
        },
        {
          id: "new",
          label: "New Leads",
          value: leadsData.byStatus.new,
          icon: Sparkles,
          color: "stat-violet",
          description: "Awaiting first contact",
        },
        {
          id: "qualified",
          label: "Qualified",
          value: leadsData.byStatus.qualified,
          icon: TrendingUp,
          color: "stat-amber",
          description: "Ready to close",
        },
        {
          id: "closed",
          label: "Closed",
          value: leadsData.byStatus.closed,
          icon: CheckCircle,
          color: "stat-green",
          description: "Successfully converted",
        },
        {
          id: "conversion",
          label: "Conversion Rate",
          value: `${leadsData.conversionRate}%`,
          icon: BarChart2,
          color: "stat-rose",
          description: "Closed / Total",
        },
      ]
    : [];

  const recentLeads = leadsData?.leads?.slice(0, 6) ?? [];

  const sourceColors: Record<string, string> = {
    facebook: "source-blue",
    instagram: "source-pink",
    google: "source-red",
    tiktok: "source-dark",
    referral: "source-green",
    organic: "source-amber",
    website: "source-violet",
  };

  return (
    <div className="portal-page">
      {/* Page header */}
      <div className="portal-page-header">
        <div>
          <h1 className="portal-page-title">Dashboard</h1>
          <p className="portal-page-desc">Welcome back. Here's what's happening.</p>
        </div>
        <Link to="/portal/leads" className="portal-btn-primary">
          View All Leads
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Stats grid */}
      <div className="portal-stats-grid">
        {leadsLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="portal-stat-card skeleton" />
            ))
          : stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.id} className={`portal-stat-card ${stat.color}`}>
                  <div className="portal-stat-icon-wrap">
                    <Icon size={20} />
                  </div>
                  <div className="portal-stat-body">
                    <span className="portal-stat-value">{stat.value}</span>
                    <span className="portal-stat-label">{stat.label}</span>
                    <span className="portal-stat-desc">{stat.description}</span>
                  </div>
                </div>
              );
            })}
      </div>

      {/* Middle row: Recent Leads + Lead Sources */}
      <div className="portal-grid-2col">
        {/* Recent Leads */}
        <div className="portal-card">
          <div className="portal-card-header">
            <div className="portal-card-title">
              <Clock size={16} />
              Recent Leads
            </div>
            <Link to="/portal/leads" className="portal-card-link">
              See all <ArrowRight size={13} />
            </Link>
          </div>
          <div className="portal-lead-list">
            {leadsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="portal-lead-row skeleton" />
              ))
            ) : recentLeads.length === 0 ? (
              <p className="portal-empty-state">No leads yet.</p>
            ) : (
              recentLeads.map((lead) => (
                <div key={lead.id} className="portal-lead-row">
                  <div className="portal-lead-avatar">{lead.name?.[0]?.toUpperCase() ?? "?"}</div>
                  <div className="portal-lead-info">
                    <span className="portal-lead-name">{lead.name}</span>
                    <span className="portal-lead-email">{lead.email}</span>
                  </div>
                  <span className={`portal-status-badge status-${lead.status}`}>{lead.status}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Lead Sources */}
        <div className="portal-card">
          <div className="portal-card-header">
            <div className="portal-card-title">
              <BarChart2 size={16} />
              Lead Sources
            </div>
          </div>
          <div className="portal-sources-list">
            {leadsLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="portal-source-row skeleton" />
              ))
            ) : leadsData && Object.keys(leadsData.bySource).length === 0 ? (
              <p className="portal-empty-state">No source data yet.</p>
            ) : (
              Object.entries(leadsData?.bySource ?? {})
                .sort((a, b) => b[1] - a[1])
                .map(([source, count]) => {
                  const pct =
                    leadsData && leadsData.total > 0
                      ? Math.round((count / leadsData.total) * 100)
                      : 0;
                  return (
                    <div key={source} className="portal-source-row">
                      <div className="portal-source-meta">
                        <span
                          className={`portal-source-dot ${sourceColors[source] ?? "source-violet"}`}
                        />
                        <span className="portal-source-name capitalize">{source}</span>
                      </div>
                      <div className="portal-source-bar-wrap">
                        <div
                          className={`portal-source-bar ${sourceColors[source] ?? "source-violet"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="portal-source-count">{count}</span>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="portal-card">
        <div className="portal-card-header">
          <div className="portal-card-title">
            <Activity size={16} />
            Recent Activity
          </div>
        </div>
        <div className="portal-activity-list">
          {activitiesLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="portal-activity-row skeleton" />
            ))
          ) : !activities || activities.length === 0 ? (
            <p className="portal-empty-state">No activity logged yet.</p>
          ) : (
            activities.slice(0, 10).map((log) => (
              <div key={log.id} className="portal-activity-row">
                <div className="portal-activity-dot" />
                <div className="portal-activity-body">
                  <span className="portal-activity-action">{log.action.replace(/_/g, " ")}</span>
                  {log.entity && <span className="portal-activity-entity"> · {log.entity}</span>}
                </div>
                <span className="portal-activity-time">
                  {new Date(log.created_at).toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
