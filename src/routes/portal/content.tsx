import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useRef, useMemo } from "react";
import {
  Save,
  Sparkles,
  User,
  Hash,
  AlertCircle,
  CheckCircle,
  Image as ImageIcon,
  Video,
  TriangleAlert,
  X,
  Compass,
  Play,
  Quote,
  Star,
  Trash2,
  Plus,
  Edit3,
  ArrowUp,
  ArrowDown,
  FileText,
} from "lucide-react";
import {
  getSiteSettings,
  updateSiteSettings,
  getAdminProperties,
  getAdminTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../../lib/api/admin.functions";
import { toast } from "sonner";
import {
  ABOUT_PAGE_FALLBACK,
  GUIDES_PAGE_FALLBACK,
  MARKETING_PAGE_CONFIGS,
  SEO_FALLBACKS,
  WHY_INVEST_PAGE_FALLBACK,
} from "@/lib/marketing-pages";

export const Route = createFileRoute("/portal/content")({
  component: HomepageEditorPage,
});

type TabType =
  | "hero"
  | "founder"
  | "stats"
  | "nav"
  | "background"
  | "testimonials"
  | "featured_district"
  | "marketing_pages"
  | "carousel"
  | "featured_opps";

const MARKETING_PAGE_FALLBACKS: Record<string, Record<string, any>> = {
  page_guides: GUIDES_PAGE_FALLBACK,
  page_why_invest: WHY_INVEST_PAGE_FALLBACK,
  page_about: ABOUT_PAGE_FALLBACK,
};

// ── Animated live preview for the background tab ─────────────────────────
function BackgroundPreview({
  slides,
  videoUrl,
  mediaType,
  overlayOpacity,
  intervalMs,
  getVal,
}: {
  slides: string[];
  videoUrl: string;
  mediaType: string;
  overlayOpacity: number;
  intervalMs: number;
  getVal: (key: string, fallback?: string) => any;
}) {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (mediaType !== "image" || slides.length < 2) {
      setActive(0);
      return;
    }
    timerRef.current = setInterval(() => {
      setActive((c) => (c + 1) % slides.length);
    }, intervalMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slides.length, intervalMs, slides.join("|"), mediaType]);

  return (
    <div
      className="portal-card"
      style={{
        position: "sticky",
        top: "2rem",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <div className="portal-card-header">
        <div className="portal-card-title">Live Background Preview</div>
      </div>

      <div
        style={{
          position: "relative",
          height: "390px",
          borderRadius: "8px",
          overflow: "hidden",
          background: "#000",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        {/* Nav pill preview */}
        <div
          style={{
            position: "absolute",
            top: "12px",
            left: "50%",
            transform: "translateX(-50%)",
            width: getVal("nav_layout_mode", "pill") === "pill" ? "90%" : "100%",
            height: "38px",
            borderRadius: getVal("nav_layout_mode", "pill") === "pill" ? "20px" : "0px",
            border:
              getVal("nav_layout_mode", "pill") === "pill"
                ? `1px solid rgba(255,255,255,${parseFloat(getVal("nav_border_opacity", "0.15"))})`
                : "none",
            background: `rgba(255,255,255,${parseFloat(getVal("nav_bg_opacity", "0.1"))})`,
            backdropFilter: `blur(${parseFloat(getVal("nav_blur_strength", "16"))}px)`,
            zIndex: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 12px",
          }}
        >
          <div style={{ fontWeight: 800, fontSize: "10px", color: "#fff" }}>CityQlo</div>
          <div
            style={{
              display: "flex",
              gap: "10px",
              fontSize: "7.5px",
              color: "rgba(255,255,255,0.75)",
            }}
          >
            <span>Properties</span>
            <span>Why Invest</span>
            <span>About</span>
          </div>
          <div
            style={{
              background: "#fff",
              color: "#000",
              fontSize: "7px",
              fontWeight: 700,
              padding: "3px 8px",
              borderRadius: "10px",
            }}
          >
            Book
          </div>
        </div>

        {/* Background Media */}
        {mediaType === "video" && videoUrl ? (
          <video
            src={videoUrl}
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          slides.map((url, i) => (
            <div
              key={url + i}
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: i === active ? 1 : 0,
                transition: "opacity 1.2s cubic-bezier(0.4,0,0.2,1)",
              }}
            />
          ))
        )}

        {/* Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#000",
            opacity: overlayOpacity,
            transition: "opacity 0.2s",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 5,
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {getVal("hero_eyebrow", "CityQlo · Metro Manila") !== "" && (
            <div
              style={{
                fontSize: "10px",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.6)",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span style={{ width: "15px", height: "1px", background: "var(--portal-accent)" }} />
              {getVal("hero_eyebrow", "CityQlo · Metro Manila")}
            </div>
          )}
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 700,
              lineHeight: 1.2,
              margin: "0.25rem 0",
              color: getVal("hero_title_color", "") || "#ffffff",
            }}
          >
            {getVal("hero_headline_1", "Find the right")}
            <br />
            {getVal("hero_headline_2", "property.")}
            <span
              style={{
                display: "block",
                fontSize: "18px",
                fontWeight: 400,
                marginTop: "4px",
                color: getVal("hero_subtitle_color", "") || "#a3a3a3",
              }}
            >
              {getVal("hero_headline_sub", "Not just another condo.")}
            </span>
          </h1>
          <p
            style={{
              fontSize: "12px",
              maxWidth: "80%",
              margin: "0.25rem 0",
              color: getVal("hero_lede_color", "") || "#d4d4d8",
            }}
          >
            {getVal("hero_lede", "Helping professionals make smarter property decisions...")}
          </p>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
            <div
              style={{
                background: "#fff",
                color: "#000",
                fontSize: "10px",
                fontWeight: 600,
                padding: "6px 12px",
                borderRadius: "20px",
              }}
            >
              {getVal("hero_cta_text", "Book consultation")}
            </div>
            <div
              style={{
                border: "1px solid rgba(255,255,255,0.3)",
                color: "#fff",
                fontSize: "10px",
                fontWeight: 600,
                padding: "6px 12px",
                borderRadius: "20px",
              }}
            >
              {getVal("hero_secondary_cta_text", "Why invest")}
            </div>
          </div>
        </div>

        {/* Dot indicators */}
        {mediaType === "image" && slides.length > 1 && (
          <div
            style={{
              position: "absolute",
              bottom: "52px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 20,
              display: "flex",
              gap: "6px",
            }}
          >
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  if (timerRef.current) clearInterval(timerRef.current);
                  setActive(i);
                  timerRef.current = setInterval(
                    () => setActive((c) => (c + 1) % slides.length),
                    intervalMs,
                  );
                }}
                style={{
                  width: i === active ? "22px" : "6px",
                  height: "6px",
                  borderRadius: "999px",
                  background: i === active ? "#fff" : "rgba(255,255,255,0.4)",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "all 0.4s",
                }}
              />
            ))}
          </div>
        )}

        {/* Trust bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background: "rgba(0,0,0,0.4)",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            padding: "6px 1rem",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            fontSize: "7px",
            color: "rgba(255,255,255,0.85)",
            textTransform: "uppercase",
          }}
        >
          <div>
            <strong>{getVal("hero_badge_1_bold", "Goal-first")}</strong>{" "}
            {getVal("hero_badge_1_regular", "advisory")}
          </div>
          <div>
            <strong>{getVal("hero_badge_2_bold", "DMCI")}</strong>{" "}
            {getVal("hero_badge_2_regular", "specialists")}
          </div>
          <div>
            <strong>{getVal("hero_badge_3_bold", "OFW")}</strong>{" "}
            {getVal("hero_badge_3_regular", "friendly")}
          </div>
          <div>
            <strong>{getVal("hero_badge_4_bold", "No-pressure")}</strong>{" "}
            {getVal("hero_badge_4_regular", "consultations")}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 0.25rem",
        }}
      >
        {mediaType === "video" ? (
          <span className="text-[11px] text-zinc-400">Video background active</span>
        ) : (
          <span className="text-[11px] text-zinc-400">
            Slide {active + 1} of {slides.length} — cycling every {Math.round(intervalMs / 1000)}s
          </span>
        )}
        {mediaType === "image" && slides.length > 1 && (
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              onClick={() => setActive((c) => (c - 1 + slides.length) % slides.length)}
              className="portal-btn-secondary"
              style={{ padding: "4px 8px" }}
            >
              <Play size={12} style={{ transform: "scaleX(-1)" }} />
            </button>
            <button
              onClick={() => setActive((c) => (c + 1) % slides.length)}
              className="portal-btn-secondary"
              style={{ padding: "4px 8px" }}
            >
              <Play size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
// ───────────────────────────────────────────────────────────────────────

// ── Live animated preview for the carousel tab ───────────────────────────
function CarouselPreview({
  slides,
  overlayOpacity,
  intervalMs,
  draft,
  getVal,
}: {
  slides: string[];
  overlayOpacity: number;
  intervalMs: number;
  draft: Record<string, any>;
  getVal: (key: string, fallback?: string) => any;
}) {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (slides.length < 2) {
      setActive(0);
      return;
    }
    timerRef.current = setInterval(() => {
      setActive((c) => (c + 1) % slides.length);
    }, intervalMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slides.length, intervalMs, slides.join("|")]);

  return (
    <div
      className="portal-card"
      style={{
        position: "sticky",
        top: "2rem",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <div className="portal-card-header">
        <div className="portal-card-title">Live Carousel Preview</div>
      </div>

      <div
        style={{
          position: "relative",
          height: "390px",
          borderRadius: "8px",
          overflow: "hidden",
          background: "#000",
        }}
      >
        {/* Slide images */}
        {slides.map((url, i) => (
          <div
            key={url + i}
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: i === active ? 1 : 0,
              transition: "opacity 1.2s cubic-bezier(0.4,0,0.2,1)",
            }}
          />
        ))}

        {/* Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#000",
            opacity: overlayOpacity,
            transition: "opacity 0.2s",
          }}
        />

        {/* Content overlay */}
        <div
          style={{
            position: "relative",
            zIndex: 5,
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "100%",
            padding: "2rem",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.6)",
              marginBottom: "0.5rem",
            }}
          >
            {getVal("hero_eyebrow", "CityQlo · Metro Manila")}
          </div>
          <div style={{ fontSize: "22px", fontWeight: 700, lineHeight: 1.2, color: "#fff" }}>
            {getVal("hero_headline_1", "Find the right")}
            <br />
            {getVal("hero_headline_2", "property.")}
          </div>
        </div>

        {/* Dot indicators */}
        {slides.length > 1 && (
          <div
            style={{
              position: "absolute",
              bottom: "16px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 20,
              display: "flex",
              gap: "6px",
            }}
          >
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  if (timerRef.current) clearInterval(timerRef.current);
                  setActive(i);
                  timerRef.current = setInterval(
                    () => setActive((c) => (c + 1) % slides.length),
                    intervalMs,
                  );
                }}
                style={{
                  width: i === active ? "22px" : "6px",
                  height: "6px",
                  borderRadius: "999px",
                  background: i === active ? "#fff" : "rgba(255,255,255,0.4)",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "all 0.4s",
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 0.25rem",
        }}
      >
        <span className="text-[11px] text-zinc-400">
          Slide {active + 1} of {slides.length} — cycling every {Math.round(intervalMs / 1000)}s
        </span>
        {slides.length > 1 && (
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              onClick={() => setActive((c) => (c - 1 + slides.length) % slides.length)}
              className="portal-btn-secondary"
              style={{ padding: "4px 8px" }}
            >
              <Play size={12} style={{ transform: "scaleX(-1)" }} />
            </button>
            <button
              onClick={() => setActive((c) => (c + 1) % slides.length)}
              className="portal-btn-secondary"
              style={{ padding: "4px 8px" }}
            >
              <Play size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
// ───────────────────────────────────────────────────────────────────────

function HomepageEditorPage() {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabType>("hero");
  const [draft, setDraft] = useState<Record<string, any>>({});
  const [dirty, setDirty] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { data: rawSettings, isLoading } = useQuery({
    queryKey: ["portal-settings"],
    queryFn: () => getSiteSettings(),
  });

  const { data: adminProperties } = useQuery({
    queryKey: ["portal-properties-for-district-options"],
    queryFn: () => getAdminProperties(),
  });

  const settingsRows = useMemo(() => {
    const row = rawSettings?.find((r: any) => r.key === "homepage");
    return row?.value ?? {};
  }, [rawSettings]);

  const districtRow = useMemo(() => {
    const row = rawSettings?.find((r: any) => r.key === "featured_district");
    return row?.value ?? {};
  }, [rawSettings]);

  const marketingRows = useMemo(() => {
    const byKey: Record<string, any> = {};
    for (const config of MARKETING_PAGE_CONFIGS) {
      const pageRow = rawSettings?.find((r: any) => r.key === config.pageKey);
      const seoRow = rawSettings?.find((r: any) => r.key === config.seoKey);
      byKey[config.id] = {
        page: pageRow?.value ?? MARKETING_PAGE_FALLBACKS[config.pageKey],
        seo: seoRow?.value ?? SEO_FALLBACKS[config.seoKey],
      };
    }
    return byKey;
  }, [rawSettings]);

  const districtOptions = useMemo(() => {
    const districts = new Set<string>();

    for (const property of adminProperties ?? []) {
      if (property.city) districts.add(property.city);
      if (property.location) districts.add(property.location);
    }

    return Array.from(districts).sort((a, b) => a.localeCompare(b));
  }, [adminProperties]);

  const getDistrictSummary = (districtName: string) => {
    const normalizedDistrict = districtName.toLowerCase();
    const matching = (adminProperties ?? []).filter((property: any) => {
      const city = String(property.city ?? "").toLowerCase();
      const location = String(property.location ?? "").toLowerCase();
      return !property.is_deleted && (city === normalizedDistrict || location === normalizedDistrict);
    });

    const prices = matching
      .map((property: any) => Number(property.price_min))
      .filter((price) => Number.isFinite(price) && price > 0);

    const entryPrice =
      prices.length > 0
        ? `₱${(Math.min(...prices) / 1_000_000).toLocaleString("en", {
            maximumFractionDigits: 1,
          })}M+`
        : "";

    return {
      projects_count: matching.length,
      entry_price: entryPrice,
    };
  };

  // Populate draft from settingsRows on load
  useEffect(() => {
    if (settingsRows) {
      setDraft(settingsRows);
    }
  }, [settingsRows]);

  const [districtDraft, setDistrictDraft] = useState<Record<string, any>>({});
  const [districtDirty, setDistrictDirty] = useState(false);

  const [marketingDraft, setMarketingDraft] = useState<
    Record<string, { pageJson: string; seo: Record<string, any> }>
  >({});
  const [marketingDirty, setMarketingDirty] = useState(false);

  useEffect(() => {
    if (districtRow && Object.keys(districtRow).length > 0) {
      setDistrictDraft(districtRow);
    }
  }, [districtRow]);

  useEffect(() => {
    const nextDraft: Record<string, { pageJson: string; seo: Record<string, any> }> = {};
    for (const config of MARKETING_PAGE_CONFIGS) {
      const row = marketingRows[config.id] ?? {};
      nextDraft[config.id] = {
        pageJson: JSON.stringify(row.page ?? MARKETING_PAGE_FALLBACKS[config.pageKey], null, 2),
        seo: row.seo ?? SEO_FALLBACKS[config.seoKey],
      };
    }
    setMarketingDraft(nextDraft);
  }, [marketingRows]);

  const handleDistrictChange = (field: string, value: any) => {
    setDistrictDraft((prev) => ({
      ...prev,
      [field]: value,
    }));
    setDistrictDirty(true);
  };

  const handleDistrictSelect = (districtName: string) => {
    const summary = getDistrictSummary(districtName);
    setDistrictDraft((prev) => ({
      ...prev,
      district_name: districtName,
      projects_count: summary.projects_count || prev.projects_count || 0,
      entry_price: summary.entry_price || prev.entry_price || "",
    }));
    setDistrictDirty(true);
  };

  const handleMarketingJsonChange = (pageId: string, value: string) => {
    setMarketingDraft((prev) => ({
      ...prev,
      [pageId]: {
        ...(prev[pageId] ?? { seo: {}, pageJson: "{}" }),
        pageJson: value,
      },
    }));
    setMarketingDirty(true);
  };

  const handleMarketingSeoChange = (pageId: string, field: string, value: string) => {
    setMarketingDraft((prev) => ({
      ...prev,
      [pageId]: {
        ...(prev[pageId] ?? { seo: {}, pageJson: "{}" }),
        seo: {
          ...(prev[pageId]?.seo ?? {}),
          [field]: value,
        },
      },
    }));
    setMarketingDirty(true);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      await updateSiteSettings({
        data: {
          key: "homepage",
          value: draft,
        },
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["portal-settings"] });
      setDirty(false);
      setSaveError(null);
      setSaveSuccess(true);
      toast.success("Homepage settings saved successfully");
      setTimeout(() => setSaveSuccess(false), 4000);
    },
    onError: (e) => {
      const msg = e instanceof Error ? e.message : "Failed to save settings";
      setSaveError(msg);
      toast.error(msg);
    },
  });

  const saveDistrictMutation = useMutation({
    mutationFn: async () => {
      await updateSiteSettings({
        data: {
          key: "featured_district",
          value: districtDraft,
        },
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["portal-settings"] });
      setDistrictDirty(false);
      toast.success("Featured district settings saved successfully");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to save district"),
  });

  const saveMarketingMutation = useMutation({
    mutationFn: async () => {
      for (const config of MARKETING_PAGE_CONFIGS) {
        const draftRow = marketingDraft[config.id];
        if (!draftRow) continue;

        let pageValue: Record<string, any>;
        try {
          const parsed = JSON.parse(draftRow.pageJson);
          if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
            throw new Error("Page content must be a JSON object.");
          }
          pageValue = parsed;
        } catch (error) {
          const message = error instanceof Error ? error.message : "Invalid JSON";
          throw new Error(`${config.label} content JSON is invalid: ${message}`);
        }

        await updateSiteSettings({
          data: {
            key: config.pageKey,
            value: pageValue,
          },
        });
        await updateSiteSettings({
          data: {
            key: config.seoKey,
            value: draftRow.seo,
          },
        });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["portal-settings"] });
      setMarketingDirty(false);
      toast.success("Marketing pages saved successfully");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to save marketing pages"),
  });

  const handleFieldChange = (key: string, value: any) => {
    setDraft((prev) => ({
      ...prev,
      [key]: value,
    }));
    setDirty(true);
  };

  const getVal = (key: string, fallback: string = "") => {
    return draft[key] ?? fallback;
  };

  if (isLoading) {
    return (
      <div className="portal-page">
        <div className="portal-page-header">
          <div>
            <h1 className="portal-page-title">Homepage Editor</h1>
            <p className="portal-page-desc">Loading configuration...</p>
          </div>
        </div>
        <div className="portal-card">
          <div className="portal-empty-state">
            <div className="portal-spinner" />
            <p>Loading homepage settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="portal-page">
      <div className="portal-page-header">
        <div>
          <h1 className="portal-page-title">Homepage & Content Editor</h1>
          <p className="portal-page-desc">
            Manage landing page sections, district showcases, and supporting content.
          </p>
        </div>
        {activeTab !== "featured_district" &&
          activeTab !== "marketing_pages" &&
          dirty && (
          <button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            className="portal-btn-primary"
            id="homepage-save-btn"
          >
            <Save size={15} />
            {saveMutation.isPending ? "Saving…" : "Save Changes"}
          </button>
        )}
        {activeTab === "featured_district" && districtDirty && (
          <button
            onClick={() => saveDistrictMutation.mutate()}
            disabled={saveDistrictMutation.isPending}
            className="portal-btn-primary"
            id="district-save-btn"
          >
            <Save size={15} />
            {saveDistrictMutation.isPending ? "Saving…" : "Save Changes"}
          </button>
        )}
      </div>

      {/* ─── Save Error Banner ─── */}
      {activeTab === "marketing_pages" && marketingDirty && (
        <button
          onClick={() => saveMarketingMutation.mutate()}
          disabled={saveMarketingMutation.isPending}
          className="portal-btn-primary"
          id="marketing-pages-save-btn"
        >
          <Save size={15} />
          {saveMarketingMutation.isPending ? "Saving..." : "Save Changes"}
        </button>
      )}

      {saveError && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "0.75rem",
            background: "oklch(0.6 0.18 25 / 0.15)",
            border: "1px solid oklch(0.6 0.18 25 / 0.4)",
            borderRadius: "10px",
            padding: "0.9rem 1rem",
          }}
        >
          <AlertCircle
            size={18}
            style={{ color: "oklch(0.78 0.16 25)", flexShrink: 0, marginTop: 2 }}
          />
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontSize: "0.8125rem",
                fontWeight: 700,
                color: "oklch(0.78 0.16 25)",
                margin: 0,
              }}
            >
              Save failed — settings were not stored
            </p>
            <p style={{ fontSize: "0.75rem", color: "oklch(0.7 0.14 25)", margin: "0.25rem 0 0" }}>
              {saveError}
            </p>
          </div>
          <button
            onClick={() => setSaveError(null)}
            style={{
              background: "none",
              border: "none",
              color: "oklch(0.7 0.14 25)",
              cursor: "pointer",
              padding: 2,
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* ─── Save Success Banner ─── */}
      {saveSuccess && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            background: "oklch(0.65 0.18 145 / 0.15)",
            border: "1px solid oklch(0.65 0.18 145 / 0.4)",
            borderRadius: "10px",
            padding: "0.75rem 1rem",
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
            Changes saved — your homepage is now live.
          </p>
        </div>
      )}

      {/* ─── Supabase Setup Warning ─── */}
      {!isLoading && Object.keys(draft).length === 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "0.75rem",
            background: "oklch(0.72 0.18 80 / 0.12)",
            border: "1px solid oklch(0.72 0.18 80 / 0.4)",
            borderRadius: "10px",
            padding: "0.9rem 1rem",
          }}
        >
          <TriangleAlert
            size={18}
            style={{ color: "oklch(0.78 0.16 80)", flexShrink: 0, marginTop: 2 }}
          />
          <div>
            <p
              style={{
                fontSize: "0.8125rem",
                fontWeight: 700,
                color: "oklch(0.78 0.16 80)",
                margin: 0,
              }}
            >
              No homepage settings row found
            </p>
            <p style={{ fontSize: "0.75rem", color: "oklch(0.72 0.14 80)", margin: "0.25rem 0 0" }}>
              Fill in any field and click <strong>Save Changes</strong> to create the settings row
              in Supabase. All homepage fields will use their built-in defaults until then.
            </p>
          </div>
        </div>
      )}

      <div className="portal-settings-layout">
        {/* Navigation Tabs */}
        <aside className="portal-settings-nav">
          <button
            onClick={() => setActiveTab("hero")}
            className={`portal-settings-nav-item ${activeTab === "hero" ? "active" : ""}`}
          >
            <Sparkles size={15} />
            Hero Content
          </button>
          <button
            onClick={() => setActiveTab("background")}
            className={`portal-settings-nav-item ${activeTab === "background" ? "active" : ""}`}
          >
            <ImageIcon size={15} />
            Hero Background
          </button>
          <button
            onClick={() => setActiveTab("founder")}
            className={`portal-settings-nav-item ${activeTab === "founder" ? "active" : ""}`}
          >
            <User size={15} />
            Founder Section
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`portal-settings-nav-item ${activeTab === "stats" ? "active" : ""}`}
          >
            <Hash size={15} />
            By the Numbers
          </button>
          <button
            onClick={() => setActiveTab("nav")}
            className={`portal-settings-nav-item ${activeTab === "nav" ? "active" : ""}`}
          >
            <Compass size={15} />
            Navigation Bar
          </button>
          <button
            onClick={() => setActiveTab("testimonials")}
            className={`portal-settings-nav-item ${activeTab === "testimonials" ? "active" : ""}`}
          >
            <Quote size={15} />
            Testimonials
          </button>
          <button
            onClick={() => setActiveTab("featured_district")}
            className={`portal-settings-nav-item ${activeTab === "featured_district" ? "active" : ""}`}
          >
            <Compass size={15} />
            Featured District
          </button>
          <button
            onClick={() => setActiveTab("marketing_pages")}
            className={`portal-settings-nav-item ${activeTab === "marketing_pages" ? "active" : ""}`}
          >
            <FileText size={15} />
            Guides / About
          </button>
          <button
            onClick={() => setActiveTab("featured_opps")}
            className={`portal-settings-nav-item ${activeTab === "featured_opps" ? "active" : ""}`}
          >
            <Star size={15} />
            Featured Opportunities
          </button>
        </aside>

        {/* Tab Contents */}
        <div
          className="portal-settings-form"
          style={{
            display: "grid",
            gridTemplateColumns:
              activeTab === "hero" || activeTab === "nav" || activeTab === "background" || activeTab === "featured_opps"
                ? "1fr 1fr"
                : "1fr",
            gap: "1.5rem",
            alignItems: "start",
            width: "100%",
          }}
        >
          {/* ─── FEATURED OPPORTUNITIES TAB ─── */}
          {activeTab === "featured_opps" && (
            <>
              <div className="portal-card portal-settings-fields">
                <div className="portal-card-header">
                  <div className="portal-card-title">
                    <Star size={16} />
                    Featured Opportunities Section Details
                  </div>
                </div>

                <div className="portal-field">
                  <label className="portal-field-label">Eyebrow Tagline</label>
                  <input
                    type="text"
                    placeholder="Selected"
                    value={getVal("featured_eyebrow", "Selected")}
                    onChange={(e) => handleFieldChange("featured_eyebrow", e.target.value)}
                    className="portal-input"
                  />
                </div>

                <div className="portal-field">
                  <label className="portal-field-label">Headline / Title</label>
                  <input
                    type="text"
                    placeholder="Featured opportunities."
                    value={getVal("featured_title", "Featured opportunities.")}
                    onChange={(e) => handleFieldChange("featured_title", e.target.value)}
                    className="portal-input"
                  />
                </div>

                <div className="portal-field">
                  <label className="portal-field-label">Description Paragraph</label>
                  <textarea
                    rows={4}
                    placeholder="A curated, ever-evolving shortlist — chosen for resilience, lifestyle, and long-term value."
                    value={getVal(
                      "featured_description",
                      "A curated, ever-evolving shortlist — chosen for resilience, lifestyle, and long-term value.",
                    )}
                    onChange={(e) => handleFieldChange("featured_description", e.target.value)}
                    className="portal-textarea"
                  />
                </div>
              </div>

              <div className="portal-card">
                <div className="portal-card-header">
                  <div className="portal-card-title">Currently Featured Properties</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
                  {(() => {
                    const featured = (adminProperties ?? []).filter((p: any) => p.is_featured && !p.is_deleted);
                    if (featured.length === 0) {
                      return (
                        <div className="portal-empty-state" style={{ padding: "1.5rem" }}>
                          <p style={{ margin: 0, fontSize: "0.85rem" }}>No properties are currently marked as featured.</p>
                          <p style={{ fontSize: "0.75rem", color: "var(--zinc-500)", margin: "0.25rem 0 0" }}>
                            Go to the <strong>Properties</strong> page to select properties to show here.
                          </p>
                        </div>
                      );
                    }
                    return (
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        <p style={{ fontSize: "0.75rem", color: "var(--zinc-400)", margin: 0 }}>
                          The following {featured.length} properties are currently featured and will appear under this section on the homepage:
                        </p>
                        {featured.map((p: any) => (
                          <div
                            key={p.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.75rem",
                              background: "rgba(255,255,255,0.02)",
                              border: "1px solid rgba(255,255,255,0.06)",
                              borderRadius: "8px",
                              padding: "0.75rem",
                            }}
                          >
                            {p.image_url ? (
                              <img
                                src={p.image_url}
                                alt={p.name}
                                style={{ width: "50px", height: "38px", objectFit: "cover", borderRadius: "4px" }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: "50px",
                                  height: "38px",
                                  background: "rgba(255,255,255,0.05)",
                                  borderRadius: "4px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "10px",
                                  color: "var(--zinc-500)"
                                }}
                              >
                                No Image
                              </div>
                            )}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {p.name}
                              </div>
                              <div style={{ fontSize: "0.75rem", color: "var(--zinc-400)" }}>
                                {p.city} · {p.developer}
                              </div>
                            </div>
                            <span style={{ fontSize: "0.7rem", color: "var(--zinc-500)", fontFamily: "monospace" }}>
                              Rank: {p.featured_rank ?? 0}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </>
          )}

          {/* ─── MARKETING PAGES TAB ─── */}
          {activeTab === "marketing_pages" && (
            <div className="portal-card portal-settings-fields">
              <div className="portal-card-header">
                <div className="portal-card-title">
                  <FileText size={16} />
                  Guides, Why Invest, and About Pages
                </div>
              </div>
              <p style={{ fontSize: "0.75rem", color: "var(--zinc-400)", marginBottom: "1.5rem" }}>
                Edit page copy as JSON and SEO metadata as fields. Keep the JSON as an object; lists
                like guides, chapters, FAQs, values, and trust metrics are arrays inside the object.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {MARKETING_PAGE_CONFIGS.map((config) => {
                  const row = marketingDraft[config.id] ?? {
                    pageJson: JSON.stringify(MARKETING_PAGE_FALLBACKS[config.pageKey], null, 2),
                    seo: SEO_FALLBACKS[config.seoKey],
                  };

                  return (
                    <div
                      key={config.id}
                      style={{
                        background: "rgba(255,255,255,0.02)",
                        padding: "1.25rem",
                        borderRadius: "12px",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "1rem",
                          alignItems: "center",
                          marginBottom: "1rem",
                        }}
                      >
                        <h3
                          style={{
                            fontSize: "15px",
                            fontWeight: 700,
                            color: "var(--zinc-100)",
                            margin: 0,
                          }}
                        >
                          {config.label}
                        </h3>
                        <span style={{ fontSize: "0.75rem", color: "var(--zinc-500)" }}>
                          {config.path}
                        </span>
                      </div>

                      <div className="portal-grid-2col" style={{ marginBottom: "1rem" }}>
                        <div className="portal-field">
                          <label className="portal-field-label">SEO Title</label>
                          <input
                            type="text"
                            value={row.seo.meta_title ?? ""}
                            onChange={(e) =>
                              handleMarketingSeoChange(config.id, "meta_title", e.target.value)
                            }
                            className="portal-input"
                            maxLength={120}
                          />
                        </div>
                        <div className="portal-field">
                          <label className="portal-field-label">Canonical Path</label>
                          <input
                            type="text"
                            value={row.seo.canonical_path ?? config.path}
                            onChange={(e) =>
                              handleMarketingSeoChange(config.id, "canonical_path", e.target.value)
                            }
                            className="portal-input"
                            placeholder={config.path}
                            maxLength={120}
                          />
                        </div>
                      </div>

                      <div className="portal-field" style={{ marginBottom: "1rem" }}>
                        <label className="portal-field-label">SEO Description</label>
                        <textarea
                          rows={2}
                          value={row.seo.meta_description ?? ""}
                          onChange={(e) =>
                            handleMarketingSeoChange(config.id, "meta_description", e.target.value)
                          }
                          className="portal-textarea"
                          maxLength={220}
                        />
                      </div>

                      <div className="portal-field" style={{ marginBottom: "1rem" }}>
                        <label className="portal-field-label">Open Graph Image URL</label>
                        <input
                          type="text"
                          value={row.seo.og_image_url ?? ""}
                          onChange={(e) =>
                            handleMarketingSeoChange(config.id, "og_image_url", e.target.value)
                          }
                          className="portal-input"
                          placeholder="https://..."
                          maxLength={500}
                        />
                      </div>

                      <div className="portal-field">
                        <label className="portal-field-label">Page Content JSON</label>
                        <textarea
                          rows={18}
                          value={row.pageJson}
                          onChange={(e) => handleMarketingJsonChange(config.id, e.target.value)}
                          className="portal-textarea"
                          spellCheck={false}
                          style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─── FEATURED DISTRICT TAB ─── */}
          {activeTab === "featured_district" && (
            <div className="portal-card portal-settings-fields">
              <div className="portal-card-header">
                <div className="portal-card-title">
                  <Compass size={16} />
                  Featured District Configuration
                </div>
              </div>
              <p style={{ fontSize: "0.75rem", color: "var(--zinc-400)", marginBottom: "1.5rem" }}>
                Customize the large dark highlighted "Featured District" banner displayed in the
                middle of the Residences Gallery.
              </p>

              <div
                className="portal-card"
                style={{
                  marginBottom: "1rem",
                  padding: "1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                }}
              >
                <div>
                  <div className="portal-card-title" style={{ marginBottom: "0.25rem" }}>
                    Show Featured District
                  </div>
                  <p style={{ fontSize: "0.75rem", color: "var(--zinc-400)" }}>
                    Turn this public section on or off without deleting the saved content.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleDistrictChange("enabled", districtDraft.enabled === false ? true : false)
                  }
                  className={
                    districtDraft.enabled === false ? "portal-btn-secondary" : "portal-btn-primary"
                  }
                >
                  {districtDraft.enabled === false ? "Off" : "On"}
                </button>
              </div>

              <div className="portal-grid-2col">
                <div className="portal-field">
                  <label className="portal-field-label">Choose Existing District</label>
                  <select
                    value={districtDraft.district_name ?? ""}
                    onChange={(e) => handleDistrictSelect(e.target.value)}
                    className="portal-input"
                  >
                    <option value="">Select a district...</option>
                    {districtOptions.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="portal-field">
                  <label className="portal-field-label">District Name / Custom Override</label>
                  <input
                    type="text"
                    value={districtDraft.district_name ?? ""}
                    onChange={(e) => handleDistrictChange("district_name", e.target.value)}
                    className="portal-input"
                    placeholder="e.g. Pasig"
                  />
                </div>
                <div className="portal-field">
                  <label className="portal-field-label">Tagline Label</label>
                  <input
                    type="text"
                    value={districtDraft.tagline ?? ""}
                    onChange={(e) => handleDistrictChange("tagline", e.target.value)}
                    className="portal-input"
                    placeholder="e.g. Featured District"
                  />
                </div>
              </div>

              <div className="portal-field">
                <label className="portal-field-label">Banner Headline</label>
                <input
                  type="text"
                  value={districtDraft.headline ?? ""}
                  onChange={(e) => handleDistrictChange("headline", e.target.value)}
                  className="portal-input"
                  placeholder="e.g. The Pasig Collection."
                />
              </div>

              <div className="portal-field">
                <label className="portal-field-label">Description Description Paragraph</label>
                <textarea
                  rows={4}
                  value={districtDraft.description ?? ""}
                  onChange={(e) => handleDistrictChange("description", e.target.value)}
                  className="portal-textarea"
                  placeholder="Describe why this district is featured..."
                />
              </div>

              <div className="portal-grid-2col">
                <div className="portal-field">
                  <label className="portal-field-label">Projects Count</label>
                  <input
                    type="number"
                    value={districtDraft.projects_count ?? 0}
                    onChange={(e) =>
                      handleDistrictChange("projects_count", parseInt(e.target.value) || 0)
                    }
                    className="portal-input"
                  />
                </div>
                <div className="portal-field">
                  <label className="portal-field-label">Entry Price Display</label>
                  <input
                    type="text"
                    value={districtDraft.entry_price ?? ""}
                    onChange={(e) => handleDistrictChange("entry_price", e.target.value)}
                    className="portal-input"
                    placeholder="e.g. ₱4.8M+"
                  />
                </div>
              </div>

              <div className="portal-field">
                <label className="portal-field-label">
                  Banner Cover Image URL (optional override)
                </label>
                <input
                  type="text"
                  value={districtDraft.image_url ?? ""}
                  onChange={(e) => handleDistrictChange("image_url", e.target.value)}
                  className="portal-input"
                  placeholder="https://..."
                />
              </div>
            </div>
          )}
          {activeTab === "hero" && (
            <div className="portal-card portal-settings-fields">
              <div className="portal-card-header">
                <div className="portal-card-title">
                  <Sparkles size={16} />
                  Hero Content Configuration
                </div>
              </div>

              <div className="portal-field">
                <label className="portal-field-label">Eyebrow Tagline</label>
                <input
                  type="text"
                  placeholder="CityQlo · Metro Manila"
                  value={getVal("hero_eyebrow", "CityQlo · Metro Manila")}
                  onChange={(e) => handleFieldChange("hero_eyebrow", e.target.value)}
                  className="portal-input"
                />
              </div>

              <div className="portal-grid-2col">
                <div className="portal-field">
                  <label className="portal-field-label">Headline Line 1</label>
                  <input
                    type="text"
                    placeholder="Find the right"
                    value={getVal("hero_headline_1", "Find the right")}
                    onChange={(e) => handleFieldChange("hero_headline_1", e.target.value)}
                    className="portal-input"
                  />
                </div>
                <div className="portal-field">
                  <label className="portal-field-label">Headline Line 2 (Colored/Emphasized)</label>
                  <input
                    type="text"
                    placeholder="property."
                    value={getVal("hero_headline_2", "property.")}
                    onChange={(e) => handleFieldChange("hero_headline_2", e.target.value)}
                    className="portal-input"
                  />
                </div>
              </div>
              <div className="portal-grid-2col">
                {/* Headline Color */}
                <div
                  className="portal-field"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    padding: "1rem",
                    borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <label
                    className="portal-field-label"
                    style={{ marginBottom: "0.5rem", fontWeight: 600 }}
                  >
                    Headline Text Color
                  </label>
                  <div className="flex items-center gap-2">
                    <div
                      style={{
                        position: "relative",
                        width: "42px",
                        height: "42px",
                        borderRadius: "6px",
                        overflow: "hidden",
                        border: "1px solid rgba(255,255,255,0.15)",
                        flexShrink: 0,
                      }}
                    >
                      <input
                        type="color"
                        value={getVal("hero_title_color", "") || "#ffffff"}
                        onChange={(e) => handleFieldChange("hero_title_color", e.target.value)}
                        style={{
                          position: "absolute",
                          top: "-5px",
                          left: "-5px",
                          width: "52px",
                          height: "52px",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                          background: "none",
                        }}
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Default: White (#ffffff)"
                      value={getVal("hero_title_color", "")}
                      onChange={(e) => handleFieldChange("hero_title_color", e.target.value)}
                      className="portal-input"
                      style={{ flex: 1, height: "42px" }}
                    />
                    {getVal("hero_title_color", "") && (
                      <button
                        type="button"
                        onClick={() => handleFieldChange("hero_title_color", "")}
                        className="portal-btn-secondary"
                        style={{ height: "42px", padding: "0 0.75rem", fontSize: "12px" }}
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                {/* Subheadline Color */}
                <div
                  className="portal-field"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    padding: "1rem",
                    borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <label
                    className="portal-field-label"
                    style={{ marginBottom: "0.5rem", fontWeight: 600 }}
                  >
                    Subheadline Text Color
                  </label>
                  <div className="flex items-center gap-2">
                    <div
                      style={{
                        position: "relative",
                        width: "42px",
                        height: "42px",
                        borderRadius: "6px",
                        overflow: "hidden",
                        border: "1px solid rgba(255,255,255,0.15)",
                        flexShrink: 0,
                      }}
                    >
                      <input
                        type="color"
                        value={getVal("hero_subtitle_color", "") || "#a3a3a3"}
                        onChange={(e) => handleFieldChange("hero_subtitle_color", e.target.value)}
                        style={{
                          position: "absolute",
                          top: "-5px",
                          left: "-5px",
                          width: "52px",
                          height: "52px",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                          background: "none",
                        }}
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Default: Muted (#a3a3a3)"
                      value={getVal("hero_subtitle_color", "")}
                      onChange={(e) => handleFieldChange("hero_subtitle_color", e.target.value)}
                      className="portal-input"
                      style={{ flex: 1, height: "42px" }}
                    />
                    {getVal("hero_subtitle_color", "") && (
                      <button
                        type="button"
                        onClick={() => handleFieldChange("hero_subtitle_color", "")}
                        className="portal-btn-secondary"
                        style={{ height: "42px", padding: "0 0.75rem", fontSize: "12px" }}
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="portal-field">
                <label className="portal-field-label">Subheadline (Muted / Secondary line)</label>
                <input
                  type="text"
                  placeholder="Not just another condo."
                  value={getVal("hero_headline_sub", "Not just another condo.")}
                  onChange={(e) => handleFieldChange("hero_headline_sub", e.target.value)}
                  className="portal-input"
                />
              </div>

              <div className="portal-field">
                <label className="portal-field-label">Lede Description Paragraph</label>
                <textarea
                  rows={3}
                  placeholder="Helping Filipino professionals, investors, and OFWs make smarter property decisions..."
                  value={getVal(
                    "hero_lede",
                    "Helping Filipino professionals, investors, and OFWs make smarter property decisions — with guidance, not pressure.",
                  )}
                  onChange={(e) => handleFieldChange("hero_lede", e.target.value)}
                  className="portal-textarea"
                />
              </div>

              <div className="portal-grid-2col">
                <div className="portal-field">
                  <label className="portal-field-label">Primary CTA Button Label</label>
                  <input
                    type="text"
                    placeholder="Book consultation"
                    value={getVal("hero_cta_text", "Book consultation")}
                    onChange={(e) => handleFieldChange("hero_cta_text", e.target.value)}
                    className="portal-input"
                  />
                </div>
                <div className="portal-field">
                  <label className="portal-field-label">Primary CTA Link</label>
                  <input
                    type="text"
                    placeholder="/contact"
                    value={getVal("hero_cta_link", "/contact")}
                    onChange={(e) => handleFieldChange("hero_cta_link", e.target.value)}
                    className="portal-input"
                  />
                </div>
              </div>

              <div className="portal-grid-2col">
                <div className="portal-field">
                  <label className="portal-field-label">Secondary CTA Button Label</label>
                  <input
                    type="text"
                    placeholder="Why invest"
                    value={getVal("hero_secondary_cta_text", "Why invest")}
                    onChange={(e) => handleFieldChange("hero_secondary_cta_text", e.target.value)}
                    className="portal-input"
                  />
                </div>
                <div className="portal-field">
                  <label className="portal-field-label">Secondary CTA Link</label>
                  <input
                    type="text"
                    placeholder="/why-invest"
                    value={getVal("hero_secondary_cta_link", "/why-invest")}
                    onChange={(e) => handleFieldChange("hero_secondary_cta_link", e.target.value)}
                    className="portal-input"
                  />
                </div>
              </div>

              <div className="portal-card-header mt-4">
                <div className="portal-card-title">Bottom Header Trust Tags (4 badges)</div>
              </div>

              <div className="portal-grid-2col">
                <div className="portal-field">
                  <label className="portal-field-label">Badge 1 (Bold + Regular)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Goal-first"
                      value={getVal("hero_badge_1_bold", "Goal-first")}
                      onChange={(e) => handleFieldChange("hero_badge_1_bold", e.target.value)}
                      className="portal-input w-1/2"
                    />
                    <input
                      type="text"
                      placeholder="advisory"
                      value={getVal("hero_badge_1_regular", "advisory")}
                      onChange={(e) => handleFieldChange("hero_badge_1_regular", e.target.value)}
                      className="portal-input w-1/2"
                    />
                  </div>
                </div>
                <div className="portal-field">
                  <label className="portal-field-label">Badge 2 (Bold + Regular)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="DMCI"
                      value={getVal("hero_badge_2_bold", "DMCI")}
                      onChange={(e) => handleFieldChange("hero_badge_2_bold", e.target.value)}
                      className="portal-input w-1/2"
                    />
                    <input
                      type="text"
                      placeholder="specialists"
                      value={getVal("hero_badge_2_regular", "specialists")}
                      onChange={(e) => handleFieldChange("hero_badge_2_regular", e.target.value)}
                      className="portal-input w-1/2"
                    />
                  </div>
                </div>
              </div>

              <div className="portal-grid-2col mt-2">
                <div className="portal-field">
                  <label className="portal-field-label">Badge 3 (Bold + Regular)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="OFW"
                      value={getVal("hero_badge_3_bold", "OFW")}
                      onChange={(e) => handleFieldChange("hero_badge_3_bold", e.target.value)}
                      className="portal-input w-1/2"
                    />
                    <input
                      type="text"
                      placeholder="friendly"
                      value={getVal("hero_badge_3_regular", "friendly")}
                      onChange={(e) => handleFieldChange("hero_badge_3_regular", e.target.value)}
                      className="portal-input w-1/2"
                    />
                  </div>
                </div>
                <div className="portal-field">
                  <label className="portal-field-label">Badge 4 (Bold + Regular)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="No-pressure"
                      value={getVal("hero_badge_4_bold", "No-pressure")}
                      onChange={(e) => handleFieldChange("hero_badge_4_bold", e.target.value)}
                      className="portal-input w-1/2"
                    />
                    <input
                      type="text"
                      placeholder="consultations"
                      value={getVal("hero_badge_4_regular", "consultations")}
                      onChange={(e) => handleFieldChange("hero_badge_4_regular", e.target.value)}
                      className="portal-input w-1/2"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── HERO BACKGROUND TAB CONFIGURATION ─── */}
          {activeTab === "background" &&
            (() => {
              const slides = [1, 2, 3, 4]
                .map((n) => getVal(`carousel_slide_${n}_url`, ""))
                .filter(Boolean);
              const previewSlides =
                slides.length > 0
                  ? slides
                  : [getVal("hero_image_url", "/src/assets/hero-manila.jpg")];

              return (
                <>
                  <div className="portal-card portal-settings-fields">
                    <div className="portal-card-header">
                      <div className="portal-card-title">
                        <ImageIcon size={16} />
                        Hero Background Media
                      </div>
                    </div>

                    <div className="portal-field">
                      <label className="portal-field-label">Background Media Mode</label>
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleFieldChange("hero_media_type", "image")}
                          className={`flex-1 py-3 px-4 rounded-lg border flex flex-col items-center gap-2 transition-all ${getVal("hero_media_type", "image") === "image" ? "bg-[var(--portal-accent)]/10 border-[var(--portal-accent)] text-[var(--portal-accent)]" : "border-[var(--portal-border)] text-zinc-400 hover:bg-white/5"}`}
                        >
                          <ImageIcon size={20} />
                          <span className="text-[12px] font-bold">Image / Carousel</span>
                        </button>
                        <button
                          onClick={() => handleFieldChange("hero_media_type", "video")}
                          className={`flex-1 py-3 px-4 rounded-lg border flex flex-col items-center gap-2 transition-all ${getVal("hero_media_type", "video") === "video" ? "bg-[var(--portal-accent)]/10 border-[var(--portal-accent)] text-[var(--portal-accent)]" : "border-[var(--portal-border)] text-zinc-400 hover:bg-white/5"}`}
                        >
                          <Video size={20} />
                          <span className="text-[12px] font-bold">Background Video</span>
                        </button>
                      </div>
                    </div>

                    {getVal("hero_media_type", "image") === "video" ? (
                      <div className="portal-field p-4 rounded-lg border border-[var(--portal-border)] bg-[var(--portal-bg)]">
                        <label className="portal-field-label flex items-center gap-2">
                          <Video size={14} /> Background Video URL (MP4)
                        </label>
                        <input
                          type="text"
                          placeholder="https://example.com/hero-video.mp4"
                          value={getVal("hero_video_url", "")}
                          onChange={(e) => handleFieldChange("hero_video_url", e.target.value)}
                          className="portal-input"
                        />
                        <span className="text-[11px] text-zinc-400 mt-2 block">
                          Note: Carousel slides are ignored when video mode is active.
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="portal-field p-4 rounded-lg border border-[var(--portal-border)] bg-[var(--portal-bg)]">
                          <p
                            style={{
                              fontSize: "0.75rem",
                              color: "var(--portal-text-muted)",
                              lineHeight: 1.6,
                              margin: 0,
                            }}
                          >
                            Add up to <strong>4 background images</strong>. They will cross-fade
                            automatically. If only one is added, it remains static.
                          </p>
                        </div>

                        {[1, 2, 3, 4].map((n) => (
                          <div
                            key={n}
                            className="portal-field border-b border-[var(--portal-border)] pb-4"
                          >
                            <label className="portal-field-label">
                              Slide {n} Image URL {n === 1 ? "(Primary)" : ""}
                            </label>
                            <div className="portal-input-wrap">
                              <ImageIcon size={16} className="portal-input-icon" />
                              <input
                                type="text"
                                placeholder={`https://example.com/hero-${n}.jpg`}
                                value={getVal(`carousel_slide_${n}_url`, "")}
                                onChange={(e) =>
                                  handleFieldChange(`carousel_slide_${n}_url`, e.target.value)
                                }
                                className="portal-input"
                              />
                            </div>
                          </div>
                        ))}

                        <div className="portal-field">
                          <label className="portal-field-label flex items-center justify-between">
                            <span>Carousel Transition Speed</span>
                            <span className="text-[12px] font-mono text-white/60">
                              {getVal("carousel_speed_s", "5")}s
                            </span>
                          </label>
                          <input
                            type="range"
                            min="2"
                            max="12"
                            step="1"
                            value={parseInt(getVal("carousel_speed_s", "5"))}
                            onChange={(e) =>
                              handleFieldChange("carousel_speed_s", parseInt(e.target.value))
                            }
                            style={{ width: "100%", accentColor: "var(--portal-accent)" }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="portal-field border-t border-[var(--portal-border)] pt-6 mt-6">
                      <label className="portal-field-label flex items-center justify-between">
                        <span>Background Overlay Darkness</span>
                        <span className="text-[12px] font-mono text-white/60">
                          {Math.round((draft.hero_overlay_opacity ?? 0.8) * 100)}%
                        </span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={draft.hero_overlay_opacity ?? 0.8}
                        onChange={(e) =>
                          handleFieldChange("hero_overlay_opacity", parseFloat(e.target.value))
                        }
                        style={{ width: "100%", accentColor: "var(--portal-accent)" }}
                      />
                      <span className="text-[11px] text-zinc-400 mt-2 block">
                        Increase opacity to make white text more readable on bright backgrounds.
                      </span>
                    </div>
                  </div>

                  <BackgroundPreview
                    slides={previewSlides}
                    videoUrl={getVal("hero_video_url", "")}
                    mediaType={getVal("hero_media_type", "image")}
                    overlayOpacity={draft.hero_overlay_opacity ?? 0.8}
                    intervalMs={Math.max(
                      2000,
                      (parseInt(getVal("carousel_speed_s", "5")) || 5) * 1000,
                    )}
                    getVal={getVal}
                  />
                </>
              );
            })()}

          {/* ─── LIVE PREVIEW COLUMN (SHARED FOR HERO & NAV TABS) ─── */}
          {(activeTab === "hero" || activeTab === "nav") && (
            <div
              className="portal-card"
              style={{
                position: "sticky",
                top: "2rem",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <div className="portal-card-header">
                <div className="portal-card-title">Live Landing Page Preview</div>
              </div>

              <div
                style={{
                  position: "relative",
                  height: "390px",
                  borderRadius: "8px",
                  overflow: "hidden",
                  background: "#000",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: "2rem pt-4",
                }}
              >
                {/* iPhone Dynamic Pill Navigation Preview */}
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: getVal("nav_layout_mode", "pill") === "pill" ? "90%" : "100%",
                    height: "38px",
                    borderRadius: getVal("nav_layout_mode", "pill") === "pill" ? "20px" : "0px",
                    border:
                      getVal("nav_layout_mode", "pill") === "pill"
                        ? `1px solid rgba(255,255,255, ${parseFloat(getVal("nav_border_opacity", "0.15"))})`
                        : "none",
                    background: `rgba(255, 255, 255, ${parseFloat(getVal("nav_bg_opacity", "0.1"))})`,
                    backdropFilter: `blur(${parseFloat(getVal("nav_blur_strength", "16"))}px)`,
                    zIndex: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 12px",
                    transition: "all 0.3s ease",
                    boxShadow:
                      getVal("nav_layout_mode", "pill") === "pill"
                        ? "0 4px 18px rgba(0,0,0,0.25)"
                        : "none",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: "10px",
                      letterSpacing: "-0.02em",
                      color: "#fff",
                    }}
                  >
                    CityQlo
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      fontSize: "7.5px",
                      color: "rgba(255,255,255,0.75)",
                    }}
                  >
                    <span>Properties</span>
                    <span>Why Invest</span>
                    <span>Guides</span>
                    <span>About</span>
                  </div>
                  <div
                    style={{
                      background: "#fff",
                      color: "#000",
                      fontSize: "7px",
                      fontWeight: 700,
                      padding: "3px 8px",
                      borderRadius: "10px",
                    }}
                  >
                    Book
                  </div>
                </div>

                {/* Media background preview */}
                {getVal("hero_media_type", "image") === "video" && getVal("hero_video_url", "") ? (
                  <video
                    src={getVal("hero_video_url", "")}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      backgroundImage: getVal("hero_image_url", "")
                        ? `url(${getVal("hero_image_url", "")})`
                        : "url('/src/assets/hero-manila.jpg')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                )}

                {/* Dark Overlay filter */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "#000000",
                    opacity: draft.hero_overlay_opacity ?? 0.8,
                    transition: "opacity 0.2s",
                  }}
                />

                {/* Content preview */}
                <div
                  style={{
                    position: "relative",
                    zIndex: 5,
                    color: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  {getVal("hero_eyebrow", "CityQlo · Metro Manila") !== "" && (
                    <div
                      style={{
                        fontSize: "10px",
                        textTransform: "uppercase",
                        letterSpacing: "0.2em",
                        color: "rgba(255,255,255,0.6)",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <span
                        style={{ width: "15px", height: "1px", background: "var(--portal-accent)" }}
                      />
                      {getVal("hero_eyebrow", "CityQlo · Metro Manila")}
                    </div>
                  )}
                  <h1
                    style={{
                      fontSize: "24px",
                      fontWeight: 700,
                      lineHeight: 1.2,
                      margin: "0.25rem 0",
                      color: getVal("hero_title_color", "") || "#ffffff",
                    }}
                  >
                    {getVal("hero_headline_1", "Find the right")}
                    <br />
                    {getVal("hero_headline_2", "property.")}
                    <span
                      style={{
                        display: "block",
                        fontSize: "18px",
                        fontWeight: 400,
                        marginTop: "4px",
                        color: getVal("hero_subtitle_color", "") || "#a3a3a3",
                      }}
                    >
                      {getVal("hero_headline_sub", "Not just another condo.")}
                    </span>
                  </h1>
                  <p
                    style={{
                      fontSize: "12px",
                      maxWidth: "80%",
                      margin: "0.25rem 0",
                      color: getVal("hero_lede_color", "") || "#d4d4d8",
                    }}
                  >
                    {getVal(
                      "hero_lede",
                      "Helping professionals make smarter property decisions...",
                    )}
                  </p>

                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
                    <div
                      style={{
                        background: "#fff",
                        color: "#000",
                        fontSize: "10px",
                        fontWeight: 600,
                        padding: "6px 12px",
                        borderRadius: "20px",
                      }}
                    >
                      {getVal("hero_cta_text", "Book consultation")}
                    </div>
                    <div
                      style={{
                        border: "1px solid rgba(255,255,255,0.3)",
                        color: "#fff",
                        fontSize: "10px",
                        fontWeight: 600,
                        padding: "6px 12px",
                        borderRadius: "20px",
                      }}
                    >
                      {getVal("hero_secondary_cta_text", "Why invest")}
                    </div>
                  </div>
                </div>

                {/* Trust Badges Bar preview */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: "rgba(0,0,0,0.4)",
                    borderTop: "1px solid rgba(255,255,255,0.1)",
                    padding: "6px 1rem",
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    fontSize: "7px",
                    color: "rgba(255,255,255,0.85)",
                    textTransform: "uppercase",
                  }}
                >
                  <div style={{ whiteSpace: "nowrap", overflow: "hidden" }}>
                    <strong>{getVal("hero_badge_1_bold", "Goal-first")}</strong>{" "}
                    {getVal("hero_badge_1_regular", "advisory")}
                  </div>
                  <div style={{ whiteSpace: "nowrap", overflow: "hidden" }}>
                    <strong>{getVal("hero_badge_2_bold", "DMCI")}</strong>{" "}
                    {getVal("hero_badge_2_regular", "specialists")}
                  </div>
                  <div style={{ whiteSpace: "nowrap", overflow: "hidden" }}>
                    <strong>{getVal("hero_badge_3_bold", "OFW")}</strong>{" "}
                    {getVal("hero_badge_3_regular", "friendly")}
                  </div>
                  <div style={{ whiteSpace: "nowrap", overflow: "hidden" }}>
                    <strong>{getVal("hero_badge_4_bold", "No-pressure")}</strong>{" "}
                    {getVal("hero_badge_4_regular", "consultations")}
                  </div>
                </div>
              </div>
              <span className="text-[11px] text-zinc-400 block text-center">
                Interactive preview updates instantly as you type or change colors.
              </span>
            </div>
          )}

          {activeTab === "founder" && (
            <div className="portal-card portal-settings-fields">
              <div className="portal-card-header">
                <div className="portal-card-title">
                  <User size={16} />
                  Founder Section Configuration
                </div>
              </div>

              <div className="portal-field">
                <label className="portal-field-label">Eyebrow Tagline</label>
                <input
                  type="text"
                  placeholder="Founder"
                  value={getVal("founder_eyebrow", "Founder")}
                  onChange={(e) => handleFieldChange("founder_eyebrow", e.target.value)}
                  className="portal-input"
                />
              </div>

              <div className="portal-field">
                <label className="portal-field-label">Headline</label>
                <input
                  type="text"
                  placeholder="A quieter way to invest."
                  value={getVal("founder_headline", "A quieter way to invest.")}
                  onChange={(e) => handleFieldChange("founder_headline", e.target.value)}
                  className="portal-input"
                />
              </div>

              <div className="portal-field">
                <label className="portal-field-label">Lede / Description Paragraph</label>
                <textarea
                  rows={4}
                  placeholder="CityQlo began with a simple frustration..."
                  value={getVal(
                    "founder_lede",
                    "CityQlo began with a simple frustration: Filipino buyers deserved an advisor — not another salesperson. We exist to give that conversation back to families and OFWs planning for the long run.",
                  )}
                  onChange={(e) => handleFieldChange("founder_lede", e.target.value)}
                  className="portal-textarea"
                />
              </div>

              <div className="portal-grid-2col">
                <div className="portal-field">
                  <label className="portal-field-label">CTA Link Label</label>
                  <input
                    type="text"
                    placeholder="Read our story"
                    value={getVal("founder_cta_text", "Read our story")}
                    onChange={(e) => handleFieldChange("founder_cta_text", e.target.value)}
                    className="portal-input"
                  />
                </div>
                <div className="portal-field">
                  <label className="portal-field-label">CTA Link URL</label>
                  <input
                    type="text"
                    placeholder="/about"
                    value={getVal("founder_cta_link", "/about")}
                    onChange={(e) => handleFieldChange("founder_cta_link", e.target.value)}
                    className="portal-input"
                  />
                </div>
              </div>

              <div className="portal-field">
                <label className="portal-field-label">
                  Founder Photo Image URL (Leave blank to use default portrait)
                </label>
                <div className="portal-input-wrap">
                  <ImageIcon size={16} className="portal-input-icon" />
                  <input
                    type="text"
                    placeholder="https://example.com/founder.jpg"
                    value={getVal("founder_image_url", "")}
                    onChange={(e) => handleFieldChange("founder_image_url", e.target.value)}
                    className="portal-input"
                  />
                </div>
              </div>

              {/* ─── New: Cinematic Enhancements ─── */}
              <div
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "12px",
                  padding: "1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "oklch(0.74 0.137 79)",
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "oklch(0.74 0.137 79)", textTransform: "uppercase", letterSpacing: "0.15em" }}>
                    Cinematic Enhancements
                  </span>
                </div>

                <div className="portal-field">
                  <label className="portal-field-label">Editorial Pull Quote</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. &ldquo;I believe every Filipino family deserves a trusted advisor, not just another salesperson.&rdquo;"
                    value={getVal("founder_quote", "")}
                    onChange={(e) => handleFieldChange("founder_quote", e.target.value)}
                    className="portal-textarea"
                  />
                  <span style={{ fontSize: "0.7rem", color: "var(--zinc-500)", marginTop: "0.35rem", display: "block" }}>
                    Appears as a highlighted italic blockquote on the homepage. Leave blank to hide.
                  </span>
                </div>

                <div className="portal-field">
                  <label className="portal-field-label">Handwritten Signature Text</label>
                  <input
                    type="text"
                    placeholder="e.g. Kristofer Yumul"
                    value={getVal("founder_signature_text", "")}
                    onChange={(e) => handleFieldChange("founder_signature_text", e.target.value)}
                    className="portal-input"
                  />
                  <span style={{ fontSize: "0.7rem", color: "var(--zinc-500)", marginTop: "0.35rem", display: "block" }}>
                    Displayed in a cursive script font in gold below the bio. Leave blank to hide.
                  </span>
                  {getVal("founder_signature_text", "") && (
                    <div
                      style={{
                        marginTop: "0.75rem",
                        padding: "0.75rem 1rem",
                        background: "rgba(255,255,255,0.03)",
                        borderRadius: "8px",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <span style={{ fontSize: "0.65rem", color: "var(--zinc-500)", display: "block", marginBottom: "0.35rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Preview</span>
                      <p
                        style={{
                          fontFamily: "'Dancing Script', 'Brush Script MT', cursive",
                          fontSize: "2rem",
                          color: "oklch(0.74 0.137 79)",
                          lineHeight: 1.2,
                          margin: 0,
                        }}
                      >
                        {getVal("founder_signature_text", "")}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="portal-card-header mt-6 pt-4 border-t border-[var(--portal-border)]">
                <div className="portal-card-title">
                  <User size={16} />
                  Additional Team Member Configuration
                </div>
              </div>

              <div className="portal-field">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draft.enable_team_member === true}
                    onChange={(e) => handleFieldChange("enable_team_member", e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="portal-field-label m-0 select-none">
                    Enable Additional Team Member Display
                  </span>
                </label>
              </div>

              {draft.enable_team_member && (
                <div className="flex flex-col gap-4 mt-2 p-4 rounded-lg border border-[var(--portal-border)] bg-[var(--portal-bg)]">
                  <div className="portal-grid-2col">
                    <div className="portal-field">
                      <label className="portal-field-label">Team Member Name</label>
                      <input
                        type="text"
                        placeholder="Jane Doe"
                        value={getVal("team_member_name", "")}
                        onChange={(e) => handleFieldChange("team_member_name", e.target.value)}
                        className="portal-input"
                      />
                    </div>
                    <div className="portal-field">
                      <label className="portal-field-label">Role / Title</label>
                      <input
                        type="text"
                        placeholder="Senior Advisor"
                        value={getVal("team_member_role", "")}
                        onChange={(e) => handleFieldChange("team_member_role", e.target.value)}
                        className="portal-input"
                      />
                    </div>
                  </div>

                  <div className="portal-field">
                    <label className="portal-field-label">Bio / Description</label>
                    <textarea
                      rows={3}
                      placeholder="Spent a decade advising clients on long-term property decisions..."
                      value={getVal("team_member_bio", "")}
                      onChange={(e) => handleFieldChange("team_member_bio", e.target.value)}
                      className="portal-textarea"
                    />
                  </div>

                  <div className="portal-field">
                    <label className="portal-field-label">Editorial Pull Quote (optional)</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. &ldquo;Every question matters. Every family is different.&rdquo;"
                      value={getVal("team_member_quote", "")}
                      onChange={(e) => handleFieldChange("team_member_quote", e.target.value)}
                      className="portal-textarea"
                    />
                    <span style={{ fontSize: "0.7rem", color: "var(--zinc-500)", marginTop: "0.35rem", display: "block" }}>
                      Appears as a highlighted italic blockquote under the team member. Leave blank to hide.
                    </span>
                  </div>

                  <div className="portal-field">
                    <label className="portal-field-label">Photo Image URL</label>
                    <div className="portal-input-wrap">
                      <ImageIcon size={16} className="portal-input-icon" />
                      <input
                        type="text"
                        placeholder="https://example.com/team-member.jpg"
                        value={getVal("team_member_image_url", "")}
                        onChange={(e) => handleFieldChange("team_member_image_url", e.target.value)}
                        className="portal-input"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "stats" && (
            <div className="portal-card portal-settings-fields">
              <div className="portal-card-header">
                <div className="portal-card-title">
                  <Hash size={16} />
                  Trust Metrics & Statistics ("By the Numbers")
                </div>
              </div>

              {/* Stat Card 1 */}
              <div className="p-4 rounded-lg border border-[var(--portal-border)] bg-[var(--portal-bg)]">
                <span className="text-xs font-semibold text-[var(--portal-text-muted)] uppercase tracking-wider">
                  Statistic Metric #1
                </span>
                <div className="portal-grid-2col mt-2">
                  <div className="portal-field">
                    <label className="portal-field-label">Big Value/Number</label>
                    <input
                      type="text"
                      placeholder="12+"
                      value={getVal("stat_1_val", "12+")}
                      onChange={(e) => handleFieldChange("stat_1_val", e.target.value)}
                      className="portal-input"
                    />
                  </div>
                  <div className="portal-field">
                    <label className="portal-field-label">Description / Label</label>
                    <input
                      type="text"
                      placeholder="Years advising Filipino buyers"
                      value={getVal("stat_1_desc", "Years advising Filipino buyers")}
                      onChange={(e) => handleFieldChange("stat_1_desc", e.target.value)}
                      className="portal-input"
                    />
                  </div>
                </div>
              </div>

              {/* Stat Card 2 */}
              <div className="p-4 rounded-lg border border-[var(--portal-border)] bg-[var(--portal-bg)] mt-2">
                <span className="text-xs font-semibold text-[var(--portal-text-muted)] uppercase tracking-wider">
                  Statistic Metric #2
                </span>
                <div className="portal-grid-2col mt-2">
                  <div className="portal-field">
                    <label className="portal-field-label">Big Value/Number</label>
                    <input
                      type="text"
                      placeholder="₱2B+"
                      value={getVal("stat_2_val", "₱2B+")}
                      onChange={(e) => handleFieldChange("stat_2_val", e.target.value)}
                      className="portal-input"
                    />
                  </div>
                  <div className="portal-field">
                    <label className="portal-field-label">Description / Label</label>
                    <input
                      type="text"
                      placeholder="In property value placed"
                      value={getVal("stat_2_desc", "In property value placed")}
                      onChange={(e) => handleFieldChange("stat_2_desc", e.target.value)}
                      className="portal-input"
                    />
                  </div>
                </div>
              </div>

              {/* Stat Card 3 */}
              <div className="p-4 rounded-lg border border-[var(--portal-border)] bg-[var(--portal-bg)] mt-2">
                <span className="text-xs font-semibold text-[var(--portal-text-muted)] uppercase tracking-wider">
                  Statistic Metric #3
                </span>
                <div className="portal-grid-2col mt-2">
                  <div className="portal-field">
                    <label className="portal-field-label">Big Value/Number</label>
                    <input
                      type="text"
                      placeholder="98%"
                      value={getVal("stat_3_val", "98%")}
                      onChange={(e) => handleFieldChange("stat_3_val", e.target.value)}
                      className="portal-input"
                    />
                  </div>
                  <div className="portal-field">
                    <label className="portal-field-label">Description / Label</label>
                    <input
                      type="text"
                      placeholder="Of clients say they'd return"
                      value={getVal("stat_3_desc", "Of clients say they'd return")}
                      onChange={(e) => handleFieldChange("stat_3_desc", e.target.value)}
                      className="portal-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── NAVIGATION TAB CONFIGURATION ─── */}
          {activeTab === "nav" && (
            <div className="portal-card portal-settings-fields">
              <div className="portal-card-header">
                <div className="portal-card-title">
                  <Compass size={16} />
                  Navigation Bar Style Settings
                </div>
              </div>

              {/* Layout Mode Selector */}
              <div className="portal-field">
                <label className="portal-field-label">Navigation Layout Shape</label>
                <div className="portal-select-wrap">
                  <select
                    value={getVal("nav_layout_mode", "pill")}
                    onChange={(e) => handleFieldChange("nav_layout_mode", e.target.value)}
                    className="portal-select"
                  >
                    <option value="pill">Luxury iPhone Floating Pill (Recommended)</option>
                    <option value="classic">Full Width Classic Bar</option>
                  </select>
                </div>
                <span className="text-[11px] text-zinc-400 mt-1 block">
                  Floating Pill mode curves the edges and adds a luxury aesthetic offset from the
                  page borders.
                </span>
              </div>

              {/* Background Opacity */}
              <div
                className="portal-field"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  padding: "1rem",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <label className="portal-field-label flex items-center justify-between">
                  <span>Background Translucency (White overlay)</span>
                  <span className="text-[12px] font-mono text-white/60">
                    {Math.round(parseFloat(getVal("nav_bg_opacity", "0.1")) * 100)}% Opacity
                  </span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="0.8"
                  step="0.05"
                  value={parseFloat(getVal("nav_bg_opacity", "0.1"))}
                  onChange={(e) => handleFieldChange("nav_bg_opacity", parseFloat(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--portal-accent)" }}
                />
                <span className="text-[11px] text-zinc-400 mt-1 block">
                  Adjusts how much white overlay background color the navbar has. Lower opacity
                  makes it more transparent. Default is 10%.
                </span>
              </div>

              {/* Border Opacity */}
              <div
                className="portal-field"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  padding: "1rem",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <label className="portal-field-label flex items-center justify-between">
                  <span>Border Transparency</span>
                  <span className="text-[12px] font-mono text-white/60">
                    {Math.round(parseFloat(getVal("nav_border_opacity", "0.15")) * 100)}% Opacity
                  </span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="0.6"
                  step="0.05"
                  value={parseFloat(getVal("nav_border_opacity", "0.15"))}
                  onChange={(e) =>
                    handleFieldChange("nav_border_opacity", parseFloat(e.target.value))
                  }
                  style={{ width: "100%", accentColor: "var(--portal-accent)" }}
                />
                <span className="text-[11px] text-zinc-400 mt-1 block">
                  Adjusts navbar border line strength. Use 0% to hide the border line completely.
                  Default is 15%.
                </span>
              </div>

              {/* Backdrop Blur Strength */}
              <div
                className="portal-field"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  padding: "1rem",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <label className="portal-field-label flex items-center justify-between">
                  <span>Backdrop Glass Blur Strength</span>
                  <span className="text-[12px] font-mono text-white/60">
                    {getVal("nav_blur_strength", "16")}px Blur
                  </span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="2"
                  value={parseInt(getVal("nav_blur_strength", "16"))}
                  onChange={(e) => handleFieldChange("nav_blur_strength", parseInt(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--portal-accent)" }}
                />
                <span className="text-[11px] text-zinc-400 mt-1 block">
                  Adjusts glassmorphic background blur intensity. Higher values create a frosted
                  glass visual effect. Default is 16px.
                </span>
              </div>
            </div>
          )}

          {/* ─── HERO CAROUSEL CONFIGURATION ─── */}
          {activeTab === "carousel" &&
            (() => {
              // Mini internal carousel state for the admin preview
              const slides = [1, 2, 3, 4]
                .map((n) => getVal(`carousel_slide_${n}_url`, ""))
                .filter(Boolean);
              const previewSlides = slides.length > 0 ? slides : ["/src/assets/hero-manila.jpg"];

              return (
                <>
                  {/* LEFT — Config */}
                  <div className="portal-card portal-settings-fields">
                    <div className="portal-card-header">
                      <div className="portal-card-title">
                        <Play size={16} />
                        Hero Carousel — Up to 4 Slides
                      </div>
                    </div>

                    <div
                      className="portal-field"
                      style={{
                        background: "rgba(255,255,255,0.02)",
                        padding: "1rem",
                        borderRadius: "8px",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--portal-text-muted)",
                          lineHeight: 1.6,
                          margin: 0,
                        }}
                      >
                        Add up to{" "}
                        <strong style={{ color: "var(--portal-text)" }}>
                          4 background image URLs
                        </strong>{" "}
                        for the hero section. They will cross-fade automatically on a timer. Leave
                        slides blank to disable them. If all slides are blank, the hero falls back
                        to the single image set in <em>Hero Section</em>.
                      </p>
                    </div>

                    {/* Slide URL inputs */}
                    {[1, 2, 3, 4].map((n) => (
                      <div
                        key={n}
                        className="portal-field"
                        style={{
                          background: "rgba(255,255,255,0.02)",
                          padding: "1rem",
                          borderRadius: "8px",
                          border: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            marginBottom: "0.5rem",
                          }}
                        >
                          <span
                            style={{
                              width: "22px",
                              height: "22px",
                              borderRadius: "50%",
                              background: "var(--portal-accent)",
                              color: "#000",
                              fontSize: "11px",
                              fontWeight: 700,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            {n}
                          </span>
                          <label className="portal-field-label" style={{ margin: 0 }}>
                            Slide {n} Background Image URL
                            {n === 1 ? " (Required for carousel)" : " (Optional)"}
                          </label>
                        </div>
                        <div className="portal-input-wrap">
                          <ImageIcon size={16} className="portal-input-icon" />
                          <input
                            type="text"
                            placeholder={
                              n === 1
                                ? "https://example.com/hero-1.jpg"
                                : `https://example.com/hero-${n}.jpg (leave blank to skip)`
                            }
                            value={getVal(`carousel_slide_${n}_url`, "")}
                            onChange={(e) =>
                              handleFieldChange(`carousel_slide_${n}_url`, e.target.value)
                            }
                            className="portal-input"
                          />
                        </div>
                        {/* Thumbnail preview */}
                        {getVal(`carousel_slide_${n}_url`, "") && (
                          <div
                            style={{
                              marginTop: "0.5rem",
                              height: "60px",
                              borderRadius: "6px",
                              overflow: "hidden",
                              border: "1px solid rgba(255,255,255,0.1)",
                            }}
                          >
                            <img
                              src={getVal(`carousel_slide_${n}_url`, "")}
                              alt={`Slide ${n} preview`}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Autoplay Speed */}
                    <div
                      className="portal-field"
                      style={{
                        background: "rgba(255,255,255,0.02)",
                        padding: "1rem",
                        borderRadius: "8px",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <label className="portal-field-label flex items-center justify-between">
                        <span>Autoplay Speed</span>
                        <span className="text-[12px] font-mono text-white/60">
                          {getVal("carousel_speed_s", "5")}s per slide
                        </span>
                      </label>
                      <input
                        type="range"
                        min="2"
                        max="12"
                        step="1"
                        value={parseInt(getVal("carousel_speed_s", "5"))}
                        onChange={(e) =>
                          handleFieldChange("carousel_speed_s", parseInt(e.target.value))
                        }
                        style={{ width: "100%", accentColor: "var(--portal-accent)" }}
                      />
                      <span className="text-[11px] text-zinc-400 mt-1 block">
                        Each slide is shown for this many seconds before cross-fading to the next.
                        Min 2s, max 12s. Default is 5s.
                      </span>
                    </div>
                  </div>

                  {/* RIGHT — Live animated preview */}
                  <CarouselPreview
                    slides={previewSlides}
                    overlayOpacity={draft.hero_overlay_opacity ?? 0.8}
                    intervalMs={Math.max(
                      2000,
                      (parseInt(getVal("carousel_speed_s", "5")) || 5) * 1000,
                    )}
                    draft={draft}
                    getVal={getVal}
                  />
                </>
              );
            })()}

          {activeTab === "testimonials" && <TestimonialsManager />}
        </div>
      </div>
    </div>
  );
}

// ── Testimonials Manager Component ──────────────────────────────────────────

function TestimonialsManager() {
  const qc = useQueryClient();
  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ["portal-testimonials"],
    queryFn: () => getAdminTestimonials(),
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState<"published" | "draft">("draft");
  const [displayOrder, setDisplayOrder] = useState(0);

  const resetForm = () => {
    setName("");
    setRole("");
    setMessage("");
    setRating(5);
    setImageUrl("");
    setStatus("draft");
    setDisplayOrder(0);
    setEditingItem(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setName(item.name);
    setRole(item.role ?? "");
    setMessage(item.message);
    setRating(item.rating ?? 5);
    setImageUrl(item.image_url ?? "");
    setStatus(item.status);
    setDisplayOrder(item.display_order ?? 0);
    setIsModalOpen(true);
  };

  const createMutation = useMutation({
    mutationFn: (data: any) => createTestimonial({ data }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["portal-testimonials"] });
      qc.invalidateQueries({ queryKey: ["public_testimonials"] });
      toast.success("Testimonial created successfully");
      setIsModalOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to create testimonial");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => updateTestimonial({ data }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["portal-testimonials"] });
      qc.invalidateQueries({ queryKey: ["public_testimonials"] });
      toast.success("Testimonial updated successfully");
      setIsModalOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update testimonial");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTestimonial({ data: { id } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["portal-testimonials"] });
      qc.invalidateQueries({ queryKey: ["public_testimonials"] });
      toast.success("Testimonial deleted successfully");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete testimonial");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) {
      toast.error("Name and Message are required");
      return;
    }

    const payload = {
      name,
      role: role || null,
      message,
      rating,
      image_url: imageUrl || null,
      status,
      display_order: displayOrder,
    };

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleStatusToggle = (item: any) => {
    updateMutation.mutate({
      id: item.id,
      status: item.status === "published" ? "draft" : "published",
    });
  };

  const handleReorder = (item: any, direction: "up" | "down") => {
    const currentIndex = testimonials.findIndex((t: any) => t.id === item.id);
    if (currentIndex === -1) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= testimonials.length) return;

    const targetItem = testimonials[targetIndex];

    const itemOrder = item.display_order ?? 0;
    const targetOrder = targetItem.display_order ?? 0;

    updateMutation.mutate({ id: item.id, display_order: targetOrder });
    updateMutation.mutate({ id: targetItem.id, display_order: itemOrder });
  };

  if (isLoading) {
    return (
      <div className="portal-empty-state" style={{ width: "100%", gridColumn: "1 / -1" }}>
        <div className="portal-spinner" />
        <p>Loading testimonials...</p>
      </div>
    );
  }

  return (
    <div className="portal-card" style={{ width: "100%", gridColumn: "1 / -1" }}>
      <div
        className="portal-card-header"
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <div className="portal-card-title">
          <Quote size={16} />
          Client Testimonials Management
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="portal-btn-primary"
          style={{ padding: "6px 12px", fontSize: "12px" }}
        >
          <Plus size={14} />
          Add Testimonial
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
        {testimonials.length === 0 ? (
          <div className="portal-empty-state">
            <p>No testimonials added yet. Click "Add Testimonial" to create your first review.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {testimonials.map((t: any, index: number) => (
              <div
                key={t.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "8px",
                  padding: "1rem",
                  gap: "1rem",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "0.25rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <strong style={{ color: "#fff", fontSize: "0.9rem" }}>{t.name}</strong>
                    {t.role && <span className="text-[11px] text-zinc-400">({t.role})</span>}
                    <span
                      style={{
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontSize: "10px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        background:
                          t.status === "published"
                            ? "rgba(16, 185, 129, 0.15)"
                            : "rgba(239, 68, 68, 0.15)",
                        color: t.status === "published" ? "#10b981" : "#ef4444",
                      }}
                    >
                      {t.status}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "rgba(255,255,255,0.7)",
                      margin: 0,
                      lineClamp: 2,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    "{t.message}"
                  </p>
                  <div style={{ display: "flex", gap: "2px", marginTop: "0.5rem" }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        fill={i < (t.rating ?? 5) ? "var(--portal-accent)" : "transparent"}
                        stroke={
                          i < (t.rating ?? 5) ? "var(--portal-accent)" : "rgba(255,255,255,0.2)"
                        }
                      />
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleReorder(t, "up")}
                      className="portal-btn-secondary"
                      style={{ padding: "2px", opacity: index === 0 ? 0.3 : 1 }}
                      title="Move Up"
                    >
                      <ArrowUp size={12} />
                    </button>
                    <button
                      type="button"
                      disabled={index === testimonials.length - 1}
                      onClick={() => handleReorder(t, "down")}
                      className="portal-btn-secondary"
                      style={{
                        padding: "2px",
                        opacity: index === testimonials.length - 1 ? 0.3 : 1,
                      }}
                      title="Move Down"
                    >
                      <ArrowDown size={12} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleStatusToggle(t)}
                    className="portal-btn-secondary"
                    style={{ fontSize: "11px", padding: "4px 8px" }}
                  >
                    {t.status === "published" ? "Unpublish" : "Publish"}
                  </button>

                  <button
                    type="button"
                    onClick={() => openEditModal(t)}
                    className="portal-btn-secondary"
                    style={{ padding: "6px" }}
                    title="Edit"
                  >
                    <Edit3 size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this testimonial?")) {
                        deleteMutation.mutate(t.id);
                      }
                    }}
                    className="portal-btn-secondary"
                    style={{
                      padding: "6px",
                      color: "#ef4444",
                      borderColor: "rgba(239, 68, 68, 0.2)",
                    }}
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            backdropFilter: "blur(4px)",
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{
              background: "#18181b",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              padding: "1.5rem",
              width: "100%",
              maxWidth: "500px",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#fff", fontWeight: 600 }}>
                {editingItem ? "Edit Testimonial" : "Add Testimonial"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ background: "none", border: "none", color: "#a1a1aa", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="portal-field">
              <label className="portal-field-label">Client Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Celestine Cruz"
                className="portal-input"
              />
            </div>

            <div className="portal-field">
              <label className="portal-field-label">Role / Location</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Business Owner, Quezon City"
                className="portal-input"
              />
            </div>

            <div className="portal-field">
              <label className="portal-field-label">Client Avatar URL (Optional)</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="portal-input"
              />
            </div>

            <div className="portal-grid-2col">
              <div className="portal-field">
                <label className="portal-field-label">Rating (1 to 5 Stars)</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(parseInt(e.target.value))}
                  className="portal-select"
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>
                      {r} Stars
                    </option>
                  ))}
                </select>
              </div>

              <div className="portal-field">
                <label className="portal-field-label">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="portal-select"
                >
                  <option value="draft">Draft (Hidden)</option>
                  <option value="published">Published (Visible)</option>
                </select>
              </div>
            </div>

            <div className="portal-field">
              <label className="portal-field-label">Display Order Priority</label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                placeholder="0"
                className="portal-input"
              />
            </div>

            <div className="portal-field">
              <label className="portal-field-label">Message *</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write the client testimonial message here..."
                style={{
                  background: "#09090b",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#fff",
                  borderRadius: "6px",
                  padding: "0.5rem",
                  fontSize: "0.875rem",
                  width: "100%",
                  resize: "vertical",
                  fontFamily: "sans-serif",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.75rem",
                marginTop: "0.5rem",
              }}
            >
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="portal-btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="portal-btn-primary"
              >
                {editingItem ? "Save Changes" : "Create Testimonial"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
