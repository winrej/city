import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Save, Settings2, Globe, Phone, Home, Search, Share2 } from "lucide-react";
import { getSiteSettings, updateSiteSettings } from "../../lib/api/admin.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/settings")({
  component: SettingsPage,
});

type SettingsSection = "general" | "contact" | "seo" | "social";

const SECTIONS: { key: SettingsSection; label: string; icon: React.ElementType }[] = [
  { key: "general", label: "General", icon: Settings2 },
  { key: "contact", label: "Contact", icon: Phone },
  { key: "seo", label: "SEO", icon: Search },
  { key: "social", label: "Social", icon: Share2 },
];

const FIELDS: Record<
  SettingsSection,
  { key: string; label: string; type?: string; placeholder?: string }[]
> = {
  general: [
    { key: "site_name", label: "Site Name", placeholder: "CityQlo" },
    { key: "tagline", label: "Tagline", placeholder: "Smarter Property Decisions in Metro Manila" },
    {
      key: "support_email",
      label: "Support Email",
      type: "email",
      placeholder: "hello@cityqlo.com",
    },
  ],
  contact: [
    { key: "phone", label: "Phone Number", placeholder: "+63 917 123 4567" },
    { key: "whatsapp", label: "WhatsApp Number", placeholder: "+63 917 123 4567" },
    { key: "messenger", label: "Messenger URL", placeholder: "https://m.me/cityqlo" },
    { key: "email", label: "Contact Email", type: "email", placeholder: "contact@cityqlo.com" },
    { key: "address", label: "Office Address", placeholder: "Metro Manila, Philippines" },
  ],
  seo: [
    { key: "meta_title", label: "Meta Title", placeholder: "CityQlo — Smarter Property Decisions" },
    {
      key: "meta_description",
      label: "Meta Description",
      placeholder: "CityQlo helps Filipino professionals…",
    },
    { key: "og_image_url", label: "OG Image URL", placeholder: "https://…" },
  ],
  social: [
    { key: "facebook", label: "Facebook URL", placeholder: "https://facebook.com/cityqlo" },
    { key: "instagram", label: "Instagram URL", placeholder: "https://instagram.com/cityqlo" },
    { key: "tiktok", label: "TikTok URL", placeholder: "https://tiktok.com/@cityqlo" },
    { key: "youtube", label: "YouTube URL", placeholder: "https://youtube.com/@cityqlo" },
    { key: "linkedin", label: "LinkedIn URL", placeholder: "https://linkedin.com/company/cityqlo" },
    { key: "reddit", label: "Reddit URL", placeholder: "https://reddit.com/r/cityqlo" },
  ],
};

function SettingsPage() {
  const qc = useQueryClient();
  const [activeSection, setActiveSection] = useState<SettingsSection>("general");
  const [draft, setDraft] = useState<Record<string, Record<string, string>>>({});
  const [dirty, setDirty] = useState(false);

  const { data: settingsRows, isLoading } = useQuery({
    queryKey: ["portal-settings"],
    queryFn: () => getSiteSettings(),
    select: (rows) => {
      // Convert [{key, value}] array into a flat object merged by section
      const merged: Record<string, Record<string, string>> = {};
      for (const section of SECTIONS.map((s) => s.key)) {
        const row = rows?.find((r: any) => r.key === section);
        merged[section] = row?.value ?? {};
      }
      return merged;
    },
  });

  // Get merged value: draft > fetched
  function getValue(section: SettingsSection, field: string): string {
    return draft[section]?.[field] ?? settingsRows?.[section]?.[field] ?? "";
  }

  function handleChange(section: SettingsSection, field: string, value: string) {
    setDraft((prev) => ({
      ...prev,
      [section]: { ...(prev[section] ?? {}), [field]: value },
    }));
    setDirty(true);
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      const base = settingsRows ?? {};
      const merged = { ...base, ...(draft as any) };
      for (const section of Object.keys(merged) as SettingsSection[]) {
        await updateSiteSettings({
          data: {
            key: section,
            value: {
              [section]: merged[section],
            },
          },
        });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["portal-settings"] });
      setDraft({});
      setDirty(false);
      toast.success("Settings saved");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  const ActiveIcon = SECTIONS.find((s) => s.key === activeSection)?.icon ?? Settings2;

  return (
    <div className="portal-page">
      <div className="portal-page-header">
        <div>
          <h1 className="portal-page-title">Settings</h1>
          <p className="portal-page-desc">Manage site-wide configurations</p>
        </div>
        {dirty && (
          <button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            className="portal-btn-primary"
            id="settings-save-btn"
          >
            <Save size={15} />
            {saveMutation.isPending ? "Saving…" : "Save Changes"}
          </button>
        )}
      </div>

      <div className="portal-settings-layout">
        {/* Section nav */}
        <aside className="portal-settings-nav">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.key}
                onClick={() => setActiveSection(s.key)}
                className={`portal-settings-nav-item ${activeSection === s.key ? "active" : ""}`}
                id={`settings-nav-${s.key}`}
              >
                <Icon size={15} />
                {s.label}
              </button>
            );
          })}
        </aside>

        {/* Section form */}
        <div className="portal-card portal-settings-form">
          <div className="portal-card-header">
            <div className="portal-card-title">
              <ActiveIcon size={16} />
              {SECTIONS.find((s) => s.key === activeSection)?.label} Settings
            </div>
          </div>

          <div className="portal-settings-fields">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="portal-field">
                    <div className="skeleton portal-field-skeleton" />
                  </div>
                ))
              : FIELDS[activeSection].map((f) => (
                  <div key={f.key} className="portal-field">
                    <label
                      htmlFor={`setting-${activeSection}-${f.key}`}
                      className="portal-field-label"
                    >
                      {f.label}
                    </label>
                    <input
                      id={`setting-${activeSection}-${f.key}`}
                      type={f.type ?? "text"}
                      placeholder={f.placeholder}
                      value={getValue(activeSection, f.key)}
                      onChange={(e) => handleChange(activeSection, f.key, e.target.value)}
                      className="portal-input"
                    />
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}
