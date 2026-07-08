import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import {
  Save,
  Settings2,
  Globe,
  Phone,
  Search,
  Share2,
  Eye,
  ExternalLink,
  ImageIcon,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Twitter,
  Facebook,
  Link2,
} from "lucide-react";
import { getSiteSettings, updateSiteSettings } from "../../lib/api/admin.functions";
import { toast } from "sonner";
import { MediaPicker } from "../../components/MediaPicker";

export const Route = createFileRoute("/portal/settings")({
  component: SettingsPage,
});

type SettingsSection = "general" | "contact" | "seo" | "social";

const SECTIONS: { key: SettingsSection; label: string; icon: React.ElementType }[] = [
  { key: "general", label: "General", icon: Settings2 },
  { key: "contact", label: "Contact", icon: Phone },
  { key: "seo", label: "SEO & OG Image", icon: Search },
  { key: "social", label: "Social", icon: Share2 },
];

type FieldDef = {
  key: string;
  label: string;
  type?: string;
  placeholder?: string;
  hint?: string;
  maxLength?: number;
  textarea?: boolean;
};

const FIELDS: Record<SettingsSection, FieldDef[]> = {
  general: [
    { key: "site_name", label: "Site Name", placeholder: "CityQlo" },
    {
      key: "tagline",
      label: "Tagline",
      placeholder: "Smarter Property Decisions in Metro Manila",
    },
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
    { key: "viber", label: "Viber Number/URL", placeholder: "+63 917 123 4567" },
    { key: "messenger", label: "Messenger URL", placeholder: "https://m.me/cityqlo" },
    { key: "email", label: "Contact Email", type: "email", placeholder: "contact@cityqlo.com" },
    { key: "address", label: "Office Address", placeholder: "Metro Manila, Philippines" },
  ],
  seo: [
    {
      key: "meta_title",
      label: "Page Title",
      placeholder: "CityQlo — Smarter Property Decisions in Metro Manila",
      hint: "Shown in browser tab and search results. Ideal: 50–60 characters.",
      maxLength: 70,
    },
    {
      key: "meta_description",
      label: "Meta Description",
      placeholder:
        "CityQlo helps Filipino professionals, investors, and OFWs make smarter property decisions…",
      hint: "Shown in search results below the title. Ideal: 140–160 characters.",
      maxLength: 220,
      textarea: true,
    },
    {
      key: "og_image_url",
      label: "OG Image URL",
      placeholder: "https://cityqlo.com/og-cover.png",
      hint: "Shown when someone shares your site on Facebook, Messenger, Twitter, Telegram, etc. Recommended size: 1200×630px. Must be a public absolute URL.",
    },
    {
      key: "og_title",
      label: "OG Title (optional override)",
      placeholder: "Leave blank to use Page Title",
      hint: "Custom title for social share cards. Defaults to Page Title if empty.",
      maxLength: 100,
    },
    {
      key: "og_description",
      label: "OG Description (optional override)",
      placeholder: "Leave blank to use Meta Description",
      hint: "Custom description for social share cards. Defaults to Meta Description if empty.",
      maxLength: 220,
      textarea: true,
    },
    {
      key: "twitter_title",
      label: "Twitter/X Title (optional override)",
      placeholder: "Leave blank to use OG Title",
      maxLength: 100,
    },
    {
      key: "twitter_description",
      label: "Twitter/X Description (optional override)",
      placeholder: "Leave blank to use OG Description",
      maxLength: 220,
      textarea: true,
    },
  ],
  social: [
    { key: "facebook", label: "Facebook URL", placeholder: "https://facebook.com/cityqlo" },
    { key: "instagram", label: "Instagram URL", placeholder: "https://instagram.com/cityqlo" },
    { key: "tiktok", label: "TikTok URL", placeholder: "https://tiktok.com/@cityqlo" },
    { key: "youtube", label: "YouTube URL", placeholder: "https://youtube.com/@cityqlo" },
    {
      key: "linkedin",
      label: "LinkedIn URL",
      placeholder: "https://linkedin.com/company/cityqlo",
    },
    { key: "reddit", label: "Reddit URL", placeholder: "https://reddit.com/r/cityqlo" },
  ],
};

// ── OG Preview Card ───────────────────────────────────────────────────────────

function OgPreviewCard({
  imageUrl,
  title,
  description,
  mode,
}: {
  imageUrl: string;
  title: string;
  description: string;
  mode: "facebook" | "twitter";
}) {
  const [imgOk, setImgOk] = useState<boolean | null>(null);

  useEffect(() => {
    setImgOk(null);
    if (!imageUrl) return;
    const img = new Image();
    img.onload = () => setImgOk(true);
    img.onerror = () => setImgOk(false);
    img.src = imageUrl;
  }, [imageUrl]);

  const fallbackImg = (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-100 to-slate-200">
      <ImageIcon size={28} className="text-slate-300" />
      <span className="text-[11px] font-mono text-slate-400">No image set</span>
    </div>
  );

  const displayTitle = title || "CityQlo — Smarter Property Decisions in Metro Manila";
  const displayDesc =
    description ||
    "CityQlo helps Filipino professionals, investors, and OFWs make smarter property decisions in Metro Manila.";

  if (mode === "twitter") {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm max-w-sm">
        {/* Image */}
        <div className="relative aspect-[2/1] bg-slate-100">
          {imageUrl && imgOk !== false ? (
            <img src={imageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            fallbackImg
          )}
          {imgOk === false && (
            <div className="absolute inset-0 flex items-center justify-center bg-red-50">
              <div className="text-center">
                <AlertCircle size={22} className="mx-auto text-red-400" />
                <p className="mt-1 text-[11px] text-red-500">Image failed to load</p>
              </div>
            </div>
          )}
        </div>
        {/* Card footer */}
        <div className="border-t border-slate-100 px-3 py-2.5">
          <p className="text-[11px] text-slate-400 font-mono tracking-wide uppercase">
            cityqlo.com
          </p>
          <p className="mt-0.5 text-[13px] font-bold text-slate-900 leading-snug line-clamp-1">
            {displayTitle}
          </p>
          <p className="mt-0.5 text-[12px] text-slate-500 line-clamp-2 leading-relaxed">
            {displayDesc}
          </p>
        </div>
      </div>
    );
  }

  // Facebook / default
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm max-w-sm">
      <div className="relative aspect-[1.91/1] bg-slate-100">
        {imageUrl && imgOk !== false ? (
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          fallbackImg
        )}
        {imgOk === false && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50">
            <div className="text-center">
              <AlertCircle size={22} className="mx-auto text-red-400" />
              <p className="mt-1 text-[11px] text-red-500">Image failed to load</p>
            </div>
          </div>
        )}
      </div>
      <div className="border-t border-slate-100 bg-[#f0f2f5] px-3 py-2.5">
        <p className="text-[10px] text-slate-400 uppercase tracking-wide font-mono">cityqlo.com</p>
        <p className="mt-0.5 text-[13px] font-bold text-slate-900 leading-snug line-clamp-2">
          {displayTitle}
        </p>
        <p className="mt-0.5 text-[12px] text-slate-500 line-clamp-2 leading-relaxed">
          {displayDesc}
        </p>
      </div>
    </div>
  );
}

// ── Image Status Badge ────────────────────────────────────────────────────────

function ImageStatusBadge({ url }: { url: string }) {
  const [status, setStatus] = useState<"idle" | "checking" | "ok" | "error">("idle");

  useEffect(() => {
    if (!url) {
      setStatus("idle");
      return;
    }
    setStatus("checking");
    const img = new Image();
    img.onload = () => setStatus("ok");
    img.onerror = () => setStatus("error");
    img.src = url;
  }, [url]);

  if (!url) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold font-mono ${
        status === "ok"
          ? "bg-emerald-50 text-emerald-600"
          : status === "error"
            ? "bg-red-50 text-red-500"
            : "bg-slate-50 text-slate-400"
      }`}
    >
      {status === "ok" && <CheckCircle2 size={10} />}
      {status === "error" && <AlertCircle size={10} />}
      {status === "checking" && <RefreshCw size={10} className="animate-spin" />}
      {status === "ok" ? "Image reachable" : status === "error" ? "Cannot load image" : "Checking…"}
    </span>
  );
}

// ── Character Count ───────────────────────────────────────────────────────────

function CharCount({
  value,
  max,
  ideal,
}: {
  value: string;
  max: number;
  ideal?: [number, number];
}) {
  const len = value.length;
  const isOver = len > max;
  const isIdeal = ideal ? len >= ideal[0] && len <= ideal[1] : false;

  return (
    <span
      className={`text-[10px] font-mono tabular-nums ${
        isOver ? "text-red-500" : isIdeal ? "text-emerald-500" : "text-slate-400"
      }`}
    >
      {len}/{max}
    </span>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

function SettingsPage() {
  const qc = useQueryClient();
  const [activeSection, setActiveSection] = useState<SettingsSection>("general");
  const [draft, setDraft] = useState<Record<string, Record<string, string>>>({});
  const [dirty, setDirty] = useState(false);
  const [previewMode, setPreviewMode] = useState<"facebook" | "twitter">("facebook");

  const { data: settingsRows, isLoading } = useQuery({
    queryKey: ["portal-settings"],
    queryFn: () => getSiteSettings(),
    select: (rows) => {
      const merged: Record<string, Record<string, string>> = {};
      for (const section of SECTIONS.map((s) => s.key)) {
        const row = rows?.find((r: any) => r.key === section);
        merged[section] = row?.value ?? {};
      }
      return merged;
    },
  });

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
      const merged = { ...base };
      for (const section of Object.keys(draft) as SettingsSection[]) {
        merged[section] = { ...(base[section] ?? {}), ...(draft[section] ?? {}) };
      }
      for (const section of Object.keys(merged) as SettingsSection[]) {
        await updateSiteSettings({
          data: {
            key: section,
            value: merged[section],
          },
        });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["portal-settings"] });
      setDraft({});
      setDirty(false);
      toast.success("Settings saved — OG tags will update on next page load");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );

  useEffect(() => {
    if (!dirty) return;

    setAutoSaveStatus("saving");
    const timer = setTimeout(async () => {
      try {
        const base = settingsRows ?? {};
        const merged = { ...base };
        for (const section of Object.keys(draft) as SettingsSection[]) {
          merged[section] = { ...(base[section] ?? {}), ...(draft[section] ?? {}) };
        }
        for (const section of Object.keys(merged) as SettingsSection[]) {
          await updateSiteSettings({
            data: {
              key: section,
              value: merged[section],
            },
          });
        }
        qc.invalidateQueries({ queryKey: ["portal-settings"] });
        setDraft({});
        setDirty(false);
        setAutoSaveStatus("saved");
        setTimeout(() => setAutoSaveStatus("idle"), 2000);
      } catch (err) {
        setAutoSaveStatus("error");
        console.error("Settings auto-save failed:", err);
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [draft, dirty, settingsRows]);

  const ActiveIcon = SECTIONS.find((s) => s.key === activeSection)?.icon ?? Settings2;

  // Resolved OG preview values
  const ogImageUrl = getValue("seo", "og_image_url");
  const ogPreviewTitle =
    getValue("seo", "og_title") ||
    getValue("seo", "meta_title") ||
    "CityQlo — Smarter Property Decisions in Metro Manila";
  const ogPreviewDesc =
    getValue("seo", "og_description") ||
    getValue("seo", "meta_description") ||
    "CityQlo helps Filipino professionals, investors, and OFWs make smarter property decisions in Metro Manila.";

  return (
    <div className="portal-page">
      <div className="portal-page-header">
        <div>
          <h1 className="portal-page-title">Settings</h1>
          <p className="portal-page-desc">Manage site-wide configurations</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {autoSaveStatus !== "idle" && (
            <span
              style={{
                fontSize: "11px",
                fontFamily: "var(--font-mono, monospace)",
                color:
                  autoSaveStatus === "saving"
                    ? "var(--portal-accent)"
                    : autoSaveStatus === "saved"
                      ? "oklch(0.65 0.18 145)"
                      : "oklch(0.65 0.2 25)",
              }}
            >
              {autoSaveStatus === "saving" && "Auto-saving..."}
              {autoSaveStatus === "saved" && "Auto-saved"}
              {autoSaveStatus === "error" && "Auto-save failed"}
            </span>
          )}
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

        {/* Section content */}
        <div className="flex flex-col gap-6 min-w-0">
          {/* Form card */}
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
                : FIELDS[activeSection].map((f) => {
                    if (f.key === "og_image_url") {
                      return (
                        <MediaPicker
                          key={f.key}
                          label={f.label}
                          aspectRatioLabel="Ratio 16:9"
                          value={getValue(activeSection, f.key)}
                          onChange={(val) => handleChange(activeSection, f.key, val)}
                          description={f.hint}
                          optional
                        />
                      );
                    }
                    return (
                      <div key={f.key} className="portal-field">
                        <div className="flex items-center justify-between gap-3">
                          <label
                            htmlFor={`setting-${activeSection}-${f.key}`}
                            className="portal-field-label"
                          >
                            {f.label}
                          </label>
                          {f.maxLength && (
                            <CharCount
                              value={getValue(activeSection, f.key)}
                              max={f.maxLength}
                              ideal={
                                f.key === "meta_title"
                                  ? [50, 60]
                                  : f.key === "meta_description"
                                    ? [140, 160]
                                    : undefined
                              }
                            />
                          )}
                        </div>

                        {f.textarea ? (
                          <textarea
                            id={`setting-${activeSection}-${f.key}`}
                            placeholder={f.placeholder}
                            value={getValue(activeSection, f.key)}
                            onChange={(e) => handleChange(activeSection, f.key, e.target.value)}
                            rows={3}
                            className="portal-input resize-none"
                            style={{ height: "auto", minHeight: "80px" }}
                          />
                        ) : (
                          <input
                            id={`setting-${activeSection}-${f.key}`}
                            type={f.type ?? "text"}
                            placeholder={f.placeholder}
                            value={getValue(activeSection, f.key)}
                            onChange={(e) => handleChange(activeSection, f.key, e.target.value)}
                            className="portal-input"
                          />
                        )}

                        {f.hint && (
                          <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                            {f.hint}
                          </p>
                        )}
                      </div>
                    );
                  })}
            </div>
          </div>

          {/* OG Preview Panel — only shown on SEO tab */}
          {activeSection === "seo" && (
            <div className="portal-card">
              <div className="portal-card-header">
                <div className="portal-card-title">
                  <Eye size={16} />
                  Live Social Preview
                </div>
                {/* Mode switcher */}
                <div className="flex gap-1 rounded-lg border border-border p-0.5 bg-surface">
                  <button
                    onClick={() => setPreviewMode("facebook")}
                    id="og-preview-facebook"
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-semibold transition-all duration-200 ${
                      previewMode === "facebook"
                        ? "bg-white shadow-sm text-ink"
                        : "text-muted-foreground hover:text-ink"
                    }`}
                  >
                    <Facebook size={12} />
                    Facebook
                  </button>
                  <button
                    onClick={() => setPreviewMode("twitter")}
                    id="og-preview-twitter"
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-semibold transition-all duration-200 ${
                      previewMode === "twitter"
                        ? "bg-white shadow-sm text-ink"
                        : "text-muted-foreground hover:text-ink"
                    }`}
                  >
                    <Twitter size={12} />
                    Twitter / X
                  </button>
                </div>
              </div>

              <div className="p-5">
                <p className="mb-4 text-[11px] text-slate-400 leading-relaxed">
                  This is how your site appears when shared on{" "}
                  {previewMode === "facebook"
                    ? "Facebook, Messenger, or iMessage"
                    : "Twitter / X and Telegram"}
                  . The preview updates in real time as you type.
                </p>

                <OgPreviewCard
                  imageUrl={ogImageUrl}
                  title={ogPreviewTitle}
                  description={ogPreviewDesc}
                  mode={previewMode}
                />

                {/* Quick tips */}
                <div className="mt-5 rounded-xl border border-border bg-surface p-4 space-y-2">
                  <p className="text-[11px] font-semibold text-ink">💡 Tips for a great preview</p>
                  <ul className="space-y-1 text-[11px] text-slate-500 leading-relaxed">
                    <li>
                      • Image should be <strong>1200 × 630 px</strong> and under 5 MB
                    </li>
                    <li>
                      • Use a public absolute URL (e.g. hosted on Supabase Storage or Cloudflare R2)
                    </li>
                    <li>
                      • Facebook may cache previews — use the{" "}
                      <a
                        href="https://developers.facebook.com/tools/debug/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline inline-flex items-center gap-0.5"
                      >
                        Sharing Debugger <ExternalLink size={10} />
                      </a>{" "}
                      to refresh
                    </li>
                    <li>• Twitter may take a few minutes to pick up changes</li>
                    <li>
                      • Supabase Storage bucket must have <strong>public read access</strong>{" "}
                      enabled
                    </li>
                  </ul>
                </div>

                {/* Test links */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={`https://developers.facebook.com/tools/debug/?q=${encodeURIComponent("https://cityqlo.com")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    id="og-debug-facebook"
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[11px] font-semibold text-ink/70 hover:text-ink hover:border-ink transition-colors"
                  >
                    <Facebook size={11} />
                    Test on Facebook Debugger
                    <ExternalLink size={10} />
                  </a>
                  <a
                    href={`https://www.opengraph.xyz/url/${encodeURIComponent("https://cityqlo.com")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    id="og-debug-opengraph"
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[11px] font-semibold text-ink/70 hover:text-ink hover:border-ink transition-colors"
                  >
                    <Link2 size={11} />
                    Test on OpenGraph.xyz
                    <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
