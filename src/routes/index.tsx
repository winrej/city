import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import interiorImg from "@/assets/interior-living.jpg";
import towerImg from "@/assets/tower-exterior.jpg";
import { ConsultationCTA } from "@/components/site/ConsultationCTA";
import { Reveal } from "@/components/site/Reveal";
import { GoogleReviews } from "@/components/site/GoogleReviews";
import { getSiteSettings, getPublicPropertiesPageContent } from "../lib/api/admin.functions";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    // Fetch settings and page content on server — return data so component gets it synchronously
    const [settingsResult, pageContentResult] = await Promise.allSettled([
      context.queryClient.ensureQueryData({
        queryKey: ["portal-settings"],
        queryFn: () => getSiteSettings(),
      }),
      context.queryClient.ensureQueryData({
        queryKey: ["properties-page-content"],
        queryFn: () => getPublicPropertiesPageContent(),
      }),
    ]);
    return {
      initialSettings: settingsResult.status === "fulfilled" ? settingsResult.value : null,
      initialPageContent: pageContentResult.status === "fulfilled" ? pageContentResult.value : null,
      settingsError: settingsResult.status === "rejected" ? String(settingsResult.reason) : null,
    };
  },
  head: () => ({
    meta: [
      {
        title: "DMCI Homes Accredited Property Consultant in the Philippines | CityQlo",
      },
      {
        name: "description",
        content:
          "Work with a DMCI Homes accredited property consultant. CityQlo helps Filipino professionals, investors, and OFWs buy DMCI Homes properties across the Philippines with expert, unbiased advisory. Book a free consultation.",
      },
      {
        name: "keywords",
        content:
          "DMCI accredited property consultant, DMCI Homes accredited agent, DMCI condos Philippines, DMCI Homes property consultant Philippines, buy DMCI condo, OFW real estate, property advisory Philippines",
      },
      {
        property: "og:title",
        content: "DMCI Homes Accredited Property Consultant | CityQlo",
      },
      {
        property: "og:description",
        content:
          "DMCI Homes accredited property consultant helping Filipino professionals, investors, and OFWs buy the right DMCI property across the Philippines.",
      },
      { property: "og:url", content: "https://cityqlo.com/" },
    ],
    links: [{ rel: "canonical", href: "https://cityqlo.com/" }],
  }),
  component: Home,
});

interface HomepageSettings {
  carousel_slide_1_url?: string;
  carousel_slide_2_url?: string;
  carousel_slide_3_url?: string;
  carousel_slide_4_url?: string;
  hero_image_url?: string;
  carousel_speed_s?: number;
  hero_media_type?: "image" | "video";
  hero_video_url?: string;
  hero_overlay_opacity?: number;
  hero_eyebrow?: string;
  hero_headline_1?: string;
  hero_headline_2?: string;
  hero_headline_sub?: string;
  hero_lede?: string;
  hero_title_color?: string;
  hero_subtitle_color?: string;
  hero_lede_color?: string;
  hero_cta_text?: string;
  hero_cta_link?: string;
  hero_secondary_cta_text?: string;
  hero_secondary_cta_link?: string;
  hero_badge_1_bold?: string;
  hero_badge_1_regular?: string;
  hero_badge_2_bold?: string;
  hero_badge_2_regular?: string;
  hero_badge_3_bold?: string;
  hero_badge_3_regular?: string;
  hero_badge_4_bold?: string;
  hero_badge_4_regular?: string;
  enable_team_member?: boolean;
  founder_image_url?: string;
  founder_eyebrow?: string;
  founder_headline?: string;
  founder_lede?: string;
  founder_cta_text?: string;
  founder_cta_link?: string;
  founder_quote?: string;
  founder_signature_text?: string;
  team_member_image_url?: string;
  team_member_role?: string;
  team_member_name?: string;
  team_member_bio?: string;
  team_member_quote?: string;
  stat_1_val?: string;
  stat_1_desc?: string;
  stat_2_val?: string;
  stat_2_desc?: string;
  stat_3_val?: string;
  stat_3_desc?: string;
  featured_eyebrow?: string;
  featured_title?: string;
  featured_description?: string;
}

// ─── CUSTOMIZABLE HERO OVERLAY ──────────────────────────────────────────────
// Modify the value below (0 to 100) to adjust the default darkness of the home hero section.
// (e.g. 40 for 40% opacity). If a value is saved in the CMS settings, that will take precedence.
const HERO_OVERLAY_OPACITY_PERCENT = 40;

const cleanBadgeText = (text: string) => {
  return text.replace(/acccredited/gi, "Accredited");
};

const ConsultantCard = ({ isMobile }: { isMobile: boolean }) => (
  <div
    className={`flex ${
      isMobile ? "flex-col items-center text-center p-6 gap-4" : "items-start gap-4 p-5"
    } rounded-[28px] border border-white/10 bg-zinc-950/20 shadow-[0_8px_32px_rgba(0,0,0,0.37)] backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-zinc-950/30`}
  >
    <div className="relative shrink-0">
      <img
        src="https://res.cloudinary.com/dcnohpztl/image/upload/q_auto/f_auto/v1780922893/photo_2026-06-06_09-41-17_drf5cu.jpg"
        alt="Jerwin Daliva"
        className={`${
          isMobile ? "h-20 w-20" : "h-[96px] w-[96px]"
        } rounded-full border border-white/20 object-cover shadow-md`}
      />
      {/* Verified badge */}
      <span
        className="absolute bottom-0.5 right-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#18181b] bg-[#1A56DB] shadow-md"
        title="Verified DMCI Accredited Consultant"
        aria-label="Verified"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3 text-white" aria-hidden="true">
          <path
            d="M5 12.5l4 4 10-10"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
    <div className={isMobile ? "w-full" : "min-w-0"}>
      <div className={`flex items-center gap-1.5 ${isMobile ? "justify-center" : ""}`}>
        <p className="text-[15px] font-semibold leading-tight text-white">Jerwin Daliva</p>
        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-[#93B4FF]" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 1l2.9 2.1 3.5-.4 1.1 3.4 2.9 2.1-1.1 3.4 1.1 3.4-2.9 2.1-1.1 3.4-3.5-.4L12 23l-2.9-2.1-3.5.4-1.1-3.4L1.6 15l1.1-3.4L1.6 8.2l2.9-2.1 1.1-3.4 3.5.4L12 1z"
          />
          <path
            d="M8 12l2.5 2.5L16 9"
            stroke="#0B1220"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#93B4FF]">
        Official DMCI Accredited Property Consultant
      </p>
      <p className="mt-2.5 text-[13px] leading-relaxed text-white/70">
        Helping buyers make informed, goal-first property decisions.
      </p>
    </div>
  </div>
);

function Home() {
  // loaderData is available synchronously — no loading flash
  const { initialSettings, initialPageContent } = Route.useLoaderData();

  const heroContentRef = useRef<HTMLDivElement | null>(null);
  const heroImgRef = useRef<HTMLDivElement | null>(null);
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState<number | null>(null);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [showEstimator, setShowEstimator] = useState(false);
  const [priceValue, setPriceValue] = useState(8000000);
  const [dpPercent, setDpPercent] = useState(12);
  const [dpTerm, setDpTerm] = useState(36);
  const [loanTerm, setLoanTerm] = useState(20);

  // Promo discounts tied to each DP tier (matches DMCI promo sheets)
  const dpDiscountMap: Record<number, number> = { 5: 0.02, 12: 0.01 };
  const promoDiscount = dpDiscountMap[dpPercent] ?? 0;
  const netPrice = priceValue * (1 - promoDiscount);
  const dpAmount = netPrice * (dpPercent / 100);
  const monthlyDP = dpAmount / dpTerm;
  const loanAmount = netPrice - dpAmount;
  const interestRate = 0.065; // 6.5% — matches DMCI promo sheets
  const monthlyRate = interestRate / 12;
  const totalMonths = loanTerm * 12;
  const monthlyBank = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalMonths));

  const { data: siteSettings } = useQuery({
    queryKey: ["portal-settings"],
    queryFn: () => getSiteSettings(),
    // Use loader data as initial value — avoids flash while query re-validates
    initialData: initialSettings ?? undefined,
  });

  const homepageSettings = useMemo(() => {
    const row = siteSettings?.find((r: any) => r.key === "homepage");
    return (row?.value ?? {}) as HomepageSettings;
  }, [siteSettings]);

  const { data: pageContent } = useQuery({
    queryKey: ["properties-page-content"],
    queryFn: () => getPublicPropertiesPageContent(),
    initialData: initialPageContent ?? undefined,
    staleTime: 1000 * 60 * 5, // 5 min cache
  });

  const propertiesData = useMemo(() => pageContent?.properties ?? [], [pageContent]);

  const featuredOpportunities = useMemo(() => {
    return propertiesData
      .filter((p: any) => p.is_featured)
      .slice(0, 2)
      .map((p: any, idx: number) => ({
        slug: p.slug,
        name: p.name,
        city: p.city,
        location: p.location || `${p.city} · ${p.developer}`,
        developer: p.developer,
        status: p.status,
        priceDisplay: p.price_display || null,
        beds: p.beds || null,
        area: p.area || null,
        unitTypes: p.unit_types || null,
        highlights: Array.isArray(p.highlights) ? p.highlights : [],
        img: p.image_url || (idx === 0 ? towerImg : interiorImg),
        isDb: true,
      }));
  }, [propertiesData]);

  // Build the slides array from settings (up to 4)
  const slides = (() => {
    const raw = [
      homepageSettings.carousel_slide_1_url,
      homepageSettings.carousel_slide_2_url,
      homepageSettings.carousel_slide_3_url,
      homepageSettings.carousel_slide_4_url,
    ].filter(Boolean) as string[];
    // If no carousel slides configured, fall back to the legacy single image or empty
    if (raw.length === 0) {
      return [homepageSettings.hero_image_url].filter(Boolean) as string[];
    }
    return raw;
  })();

  const totalSlides = slides.length;
  const intervalMs = Math.max(2000, (homepageSettings.carousel_speed_s ?? 5) * 1000);

  const goToSlide = useCallback(
    (index: number) => {
      setPrevSlide((prev) => (prev !== index ? activeSlide : prev));
      setActiveSlide(index);
    },
    [activeSlide],
  );

  const goNext = useCallback(() => {
    setActiveSlide((cur) => {
      setPrevSlide(cur);
      return (cur + 1) % totalSlides;
    });
  }, [totalSlides]);

  const goPrev = useCallback(() => {
    setActiveSlide((cur) => {
      setPrevSlide(cur);
      return (cur - 1 + totalSlides) % totalSlides;
    });
  }, [totalSlides]);

  // Start autoplay
  useEffect(() => {
    if (totalSlides < 2) return;
    autoplayRef.current = setInterval(goNext, intervalMs);
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [goNext, intervalMs, totalSlides]);

  // Keyboard navigation for carousel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (totalSlides < 2) return;
      if (e.key === "ArrowLeft") {
        if (autoplayRef.current) clearInterval(autoplayRef.current);
        goPrev();
      } else if (e.key === "ArrowRight") {
        if (autoplayRef.current) clearInterval(autoplayRef.current);
        goNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev, totalSlides]);

  // Parallax scroll
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = Math.min(window.scrollY, 600);
        const fade = Math.max(0, 1 - y / 520);
        if (heroContentRef.current) {
          heroContentRef.current.style.transform = `translate3d(0, ${y * -0.18}px, 0)`;
          heroContentRef.current.style.opacity = String(fade);
        }
        if (heroImgRef.current) {
          heroImgRef.current.style.transform = `translate3d(0, ${y * 0.08}px, 0) scale(${1.04 + y * 0.00008})`;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* HERO */}
      <section
        ref={heroSectionRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Hero Property Carousel"
        className="relative h-[100svh] md:h-[100svh] md:min-h-[600px] w-full overflow-hidden"
        style={{
          backgroundColor: "#18181b",
          // Instant fallback image from the JS bundle — eliminates the black flash
          // while the carousel slides are fetched from Supabase
          backgroundImage: slides.length === 0 ? `url(${towerImg})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* ── Carousel Slides (cross-fade) ── */}
        {homepageSettings.hero_media_type === "video" && homepageSettings.hero_video_url ? (
          /* Video mode — single fullscreen video (no carousel) */
          <video
            autoPlay
            loop
            muted
            playsInline
            src={homepageSettings.hero_video_url}
            className="image-in absolute inset-0 h-full w-full scale-[1.04] object-cover will-change-transform"
          />
        ) : (
          /* Image carousel mode */
          <div
            ref={heroImgRef}
            className="absolute inset-0 will-change-transform"
            style={{ transform: "scale(1.04)" }}
          >
            {slides.map((url, i) => (
              <div
                key={url + i}
                aria-hidden={i !== activeSlide}
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url(${url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  opacity: i === activeSlide ? 1 : 0,
                  transition: "opacity 1.2s cubic-bezier(0.4,0,0.2,1)",
                  willChange: "opacity",
                }}
              />
            ))}
          </div>
        )}

        {/* Overlay Dark Filter & Layered Gradients */}
        <div
          className="absolute inset-0 bg-[#0c0c0e]/30 transition-opacity duration-700"
          style={{
            opacity: homepageSettings.hero_overlay_opacity ?? HERO_OVERLAY_OPACITY_PERCENT / 100,
          }}
        />
        {/* Left-to-right dark mask for desktop readability */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none z-[2] hidden md:block"
          style={{
            background:
              "linear-gradient(to right, rgba(12,12,14,0.9) 0%, rgba(12,12,14,0.65) 30%, rgba(12,12,14,0.2) 65%, transparent 100%)",
          }}
        />
        {/* Bottom-to-top dark mask for mobile readability */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none z-[2] block md:hidden"
          style={{
            background:
              "linear-gradient(to top, rgba(10,10,12,0.98) 0%, rgba(10,10,12,0.92) 30%, rgba(10,10,12,0.75) 55%, rgba(10,10,12,0.35) 78%, transparent 100%)",
          }}
        />
        {/* Top-down scrim for mobile — ensures eyebrow text is always readable */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none z-[2] block md:hidden"
          style={{
            background:
              "linear-gradient(to bottom, rgba(10,10,12,0.65) 0%, rgba(10,10,12,0.35) 20%, transparent 45%)",
          }}
        />
        {/* Subtle vignette layer around the edges */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none z-[2]"
          style={{
            background:
              "radial-gradient(circle at center, transparent 35%, rgba(12,12,14,0.55) 100%)",
          }}
        />

        {/* Slide Dot Indicators — only shown when 2+ slides */}
        {totalSlides > 1 && (
          <div
            className="hidden md:flex"
            style={{
              position: "absolute",
              bottom: "12.5rem",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 20,
              gap: "8px",
              alignItems: "center",
            }}
          >
            {slides.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => {
                  if (autoplayRef.current) clearInterval(autoplayRef.current);
                  goToSlide(i);
                  if (totalSlides > 1) {
                    autoplayRef.current = setInterval(goNext, intervalMs);
                  }
                }}
                style={{
                  width: i === activeSlide ? "32px" : "10px",
                  height: "10px",
                  borderRadius: "999px",
                  background: i === activeSlide ? "#1A56DB" : "rgba(255,255,255,0.65)",
                  border: i === activeSlide ? "none" : "1.5px solid rgba(255,255,255,0.9)",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
                  cursor: "pointer",
                  padding: 0,
                  transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
                }}
              />
            ))}
          </div>
        )}

        <div
          ref={heroContentRef}
          className="relative z-10 flex h-full items-start md:items-center pt-[88px] md:pt-32 pb-[160px] md:pb-28 hero-home-container"
        >
          <div className="container-prose w-full">
            <div className="max-w-[660px] text-white hero-content-inner relative">
              {/* Eyebrow — desktop only (hidden on mobile to reduce redundancy) */}
              {homepageSettings.hero_eyebrow !== "" && (
                <div className="rise hidden lg:flex items-center gap-2.5 mb-2 md:mb-3">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: "oklch(0.74 0.137 79)" }}
                  />
                  <span className="text-[10px] font-mono tracking-[0.22em] uppercase text-white/70">
                    {homepageSettings.hero_eyebrow ||
                      "Official DMCI Accredited Property Consultant"}
                  </span>
                </div>
              )}

              {/* Broker trust line — mobile only, always visible near top */}
              <div className="rise mb-4 md:mb-6 flex items-center gap-1.5 lg:hidden">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="h-3 w-3 shrink-0 text-[#93B4FF]"
                  aria-hidden="true"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span
                  className="text-[11px] font-mono text-white/50 leading-snug"
                  style={{ fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)" }}
                >
                  Supervised by Joy Lachica · PRC Lic. 10101 · DHSUD NCR-B-6055
                </span>
              </div>

              {/* Headline */}
              <h1
                className={`display-1 rise rise-delay-1 tracking-tight font-extrabold leading-[1.08] ${
                  homepageSettings.hero_title_color?.startsWith("text-")
                    ? homepageSettings.hero_title_color
                    : ""
                }`}
                style={{
                  color:
                    homepageSettings.hero_title_color &&
                    !homepageSettings.hero_title_color.startsWith("text-")
                      ? homepageSettings.hero_title_color
                      : "#ffffff",
                  fontSize: "clamp(2rem, 5.5vw, 4.5rem)",
                  textShadow: "0 2px 16px rgba(0,0,0,0.3)",
                }}
              >
                {homepageSettings.hero_headline_1 || "Find the"}
                <br />
                {homepageSettings.hero_headline_2 || "Right Property"}
              </h1>

              {/* Subtitle line */}
              <p
                className={`rise rise-delay-1 mt-2.5 text-[19px] sm:text-[22px] md:text-[28px] font-semibold tracking-tight leading-snug ${
                  homepageSettings.hero_subtitle_color?.startsWith("text-")
                    ? homepageSettings.hero_subtitle_color
                    : ""
                }`}
                style={{
                  color:
                    homepageSettings.hero_subtitle_color &&
                    !homepageSettings.hero_subtitle_color.startsWith("text-")
                      ? homepageSettings.hero_subtitle_color
                      : "#ffffff",
                  textShadow: "0 2px 10px rgba(0,0,0,0.25)",
                }}
              >
                {(homepageSettings.hero_headline_sub || "Without the Sales Pressure").replace(
                  /\.$/,
                  "",
                )}
                <span style={{ color: "oklch(0.74 0.137 79)" }}>.</span>
              </p>

              {/* Body text */}
              <p
                className={`rise rise-delay-2 mt-4 max-w-[520px] text-shadow-sm ${
                  homepageSettings.hero_lede_color?.startsWith("text-")
                    ? homepageSettings.hero_lede_color
                    : ""
                }`}
                style={{
                  color:
                    homepageSettings.hero_lede_color &&
                    !homepageSettings.hero_lede_color.startsWith("text-")
                      ? homepageSettings.hero_lede_color
                      : "rgba(255,255,255,0.85)",
                  fontSize: "clamp(0.88rem, 1.1vw, 1.05rem)",
                  lineHeight: "1.6",
                }}
              >
                {homepageSettings.hero_lede ||
                  "Compare DMCI condos, view sample monthly payments, and get expert guidance before you reserve."}
              </p>

              {/* CTA buttons:
                   - Below ~420px (max-[420px]): stacked full-width for readability
                   - 420px and above: side-by-side */}
              <div className="rise rise-delay-3 mt-4 flex flex-col max-[420px]:gap-2.5 min-[421px]:flex-row min-[421px]:gap-2.5">
                <Link
                  to={homepageSettings.hero_cta_link || "/contact"}
                  className="inline-flex h-[46px] w-full min-[421px]:w-auto items-center justify-center gap-1.5 rounded-full bg-white px-5 sm:px-7 text-[13.5px] sm:text-[14px] font-bold tracking-[0.01em] text-[#0f172a] transition-all duration-300 hover:bg-zinc-100 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                  style={{ transitionTimingFunction: "var(--ease-luxe)" }}
                >
                  {homepageSettings.hero_cta_text || "Explore Properties"}
                  <span aria-hidden className="ml-0.5">
                    →
                  </span>
                </Link>
                <button
                  onClick={() => setShowEstimator(!showEstimator)}
                  className={`hidden sm:inline-flex h-[46px] w-full min-[421px]:w-auto items-center justify-center gap-2 rounded-full border px-4 sm:px-6 text-[13px] sm:text-[13.5px] font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                    showEstimator
                      ? "border-[#1A56DB] bg-[#1A56DB]/20 text-white font-bold"
                      : "border-white/20 bg-zinc-900/60 backdrop-blur-sm text-white hover:bg-zinc-800/70 hover:border-white/35"
                  }`}
                  style={{ transitionTimingFunction: "var(--ease-luxe)" }}
                >
                  {/* Calculator icon */}
                  <svg
                    className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 opacity-80"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <rect x="4" y="2" width="16" height="20" rx="2" />
                    <path d="M8 7h8M8 11h2m4 0h2M8 15h2m4 0h2M8 19h2m4 0h2" strokeLinecap="round" />
                  </svg>
                  <span>
                    {showEstimator
                      ? "Hide Estimator"
                      : homepageSettings.hero_secondary_cta_text || "Calculate Payment"}
                  </span>
                </button>
              </div>

              {showEstimator && (
                <div className="rise mt-5 rounded-[24px] border border-white/10 bg-zinc-950/65 backdrop-blur-xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#1A56DB]/20 border border-[#1A56DB]/30 text-primary">
                        <svg
                          className="h-3 w-3 text-[#93B4FF]"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <rect x="4" y="2" width="16" height="20" rx="2" />
                          <path d="M8 7h8M8 11h2m4 0h2" strokeLinecap="round" />
                        </svg>
                      </span>
                      <h4 className="text-[12px] font-bold uppercase tracking-wider text-white font-mono">
                        Monthly Payment Estimator
                      </h4>
                    </div>
                    <span className="font-mono text-[8.5px] text-zinc-400 bg-white/5 px-2 py-0.5 rounded border border-white/5 uppercase">
                      6.5% Est. Bank Rate
                    </span>
                  </div>

                  {/* Price Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-zinc-400">List Price</span>
                      <span className="font-mono font-bold text-white">
                        ₱{(priceValue / 1000000).toFixed(1)}M &nbsp;({priceValue.toLocaleString()})
                      </span>
                    </div>
                    <input
                      type="range"
                      min={4000000}
                      max={20000000}
                      step={500000}
                      value={priceValue}
                      onChange={(e) => setPriceValue(Number(e.target.value))}
                      className="h-1 w-full bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#1A56DB] focus:outline-none"
                    />
                    <div className="flex justify-between text-[9px] text-zinc-500 font-mono">
                      <span>₱4.0M</span>
                      <span>₱12.0M</span>
                      <span>₱20.0M</span>
                    </div>
                    {promoDiscount > 0 && (
                      <div className="flex justify-between items-center pt-1 border-t border-white/[0.04]">
                        <span className="text-[9px] text-emerald-400 font-mono font-semibold uppercase tracking-wider">
                          {promoDiscount * 100}% Promo Discount
                        </span>
                        <span className="text-[9px] font-mono text-emerald-400">
                          −₱{Math.round(priceValue * promoDiscount).toLocaleString()} → Net ₱
                          {Math.round(netPrice).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Inputs Grid */}
                  <div className="grid grid-cols-3 gap-2">
                    {/* DP % Selection */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-semibold uppercase tracking-wider text-zinc-400 block font-mono">
                        Downpayment %
                      </label>
                      <div className="flex rounded-lg overflow-hidden border border-white/5 bg-zinc-900/60 p-0.5">
                        {[5, 12].map((pct) => (
                          <button
                            key={pct}
                            type="button"
                            onClick={() => setDpPercent(pct)}
                            className={`flex-1 text-[10.5px] py-1 font-bold rounded-md transition-colors cursor-pointer text-center ${
                              dpPercent === pct
                                ? "bg-[#1A56DB] text-white"
                                : "text-zinc-400 hover:text-white"
                            }`}
                          >
                            {pct}%
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* DP Spread Term */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-semibold uppercase tracking-wider text-zinc-400 block font-mono">
                        DP Spread (Mos)
                      </label>
                      <div className="flex rounded-lg overflow-hidden border border-white/5 bg-zinc-900/60 p-0.5">
                        {[24, 36, 48].map((term) => (
                          <button
                            key={term}
                            type="button"
                            onClick={() => setDpTerm(term)}
                            className={`flex-1 text-[10px] py-1 font-bold rounded-md transition-colors cursor-pointer text-center ${
                              dpTerm === term
                                ? "bg-[#1A56DB] text-white"
                                : "text-zinc-400 hover:text-white"
                            }`}
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Loan Term */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-semibold uppercase tracking-wider text-zinc-400 block font-mono">
                        Bank Loan Term
                      </label>
                      <div className="flex rounded-lg overflow-hidden border border-white/5 bg-zinc-900/60 p-0.5">
                        {[15, 20].map((term) => (
                          <button
                            key={term}
                            type="button"
                            onClick={() => setLoanTerm(term)}
                            className={`flex-1 text-[10.5px] py-1 font-bold rounded-md transition-colors cursor-pointer text-center ${
                              loanTerm === term
                                ? "bg-[#1A56DB] text-white"
                                : "text-zinc-400 hover:text-white"
                            }`}
                          >
                            {term}y
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Calculations Breakdown */}
                  <div className="grid grid-cols-2 gap-3 pt-2.5 border-t border-white/5">
                    <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-3">
                      <p className="text-[9px] font-mono uppercase tracking-wider text-zinc-400 mb-1 leading-none">
                        Downpayment Period
                      </p>
                      <p className="text-[17px] font-bold text-white font-mono leading-tight">
                        ₱{Math.round(monthlyDP).toLocaleString()}
                        <span className="text-[11px] font-normal text-zinc-400 font-mono">/mo</span>
                      </p>
                      <p className="text-[8.5px] text-[#93B4FF] mt-1 font-mono leading-none">
                        0% Interest · {dpTerm} mos
                      </p>
                    </div>

                    <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-3">
                      <p className="text-[9px] font-mono uppercase tracking-wider text-zinc-400 mb-1 leading-none">
                        Bank Loan Phase
                      </p>
                      <p className="text-[17px] font-bold text-gold font-mono leading-tight">
                        ₱{Math.round(monthlyBank).toLocaleString()}
                        <span className="text-[11px] font-normal text-zinc-400 font-mono">/mo</span>
                      </p>
                      <p className="text-[8.5px] text-zinc-400 mt-1 font-mono leading-none">
                        Est. bank amort. · {loanTerm} yrs
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Social proof row */}
              <a
                href="#reviews"
                className="rise rise-delay-4 mt-4 flex items-center gap-3 hover:opacity-85 transition-opacity cursor-pointer group w-fit"
              >
                {/* Avatar stack */}
                <div className="flex -space-x-2">
                  {[
                    "https://i.pravatar.cc/40?img=11",
                    "https://i.pravatar.cc/40?img=25",
                    "https://i.pravatar.cc/40?img=47",
                    "https://i.pravatar.cc/40?img=32",
                    "https://i.pravatar.cc/40?img=60",
                  ].map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt=""
                      aria-hidden="true"
                      className="h-7 w-7 rounded-full border-2 border-[#0c0c0e] object-cover"
                    />
                  ))}
                </div>
                <div className="flex flex-col gap-0.5">
                  {/* Stars */}
                  <div className="flex items-center gap-0.5" aria-label="5 stars">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <svg
                        key={s}
                        className="h-3 w-3 transition-transform group-hover:scale-110"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fill="oklch(0.74 0.137 79)"
                          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                        />
                      </svg>
                    ))}
                  </div>
                  <span className="text-[11px] font-medium text-white/65 group-hover:text-white transition-colors">
                    Trusted by OFW Buyers
                  </span>
                </div>
              </a>

              {/* Mobile-only: compact consultant identity strip (no card, no vertical space waste) */}
              <div className="rise rise-delay-4 mt-3 flex items-center gap-3 lg:hidden">
                <div className="relative shrink-0">
                  <img
                    src="https://res.cloudinary.com/dcnohpztl/image/upload/q_auto/f_auto/v1780922893/photo_2026-06-06_09-41-17_drf5cu.jpg"
                    alt="Jerwin Daliva"
                    className="h-10 w-10 rounded-full border border-white/25 object-cover"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full border border-[#0c0c0e] bg-[#1A56DB]">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-2 w-2 text-white"
                      aria-hidden="true"
                    >
                      <path
                        d="M5 12.5l4 4 10-10"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-white leading-none">Jerwin Daliva</p>
                  <p className="mt-0.5 text-[10.5px] font-mono uppercase tracking-[0.08em] text-[#93B4FF]/80">
                    DMCI Accredited Consultant
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Consultant Card — mid-right, absolutely positioned */}
        <div
          className="rise rise-delay-4 absolute z-20 hidden lg:block"
          style={{ right: "3.5rem", top: "50%", transform: "translateY(-40%)", width: "340px" }}
        >
          <ConsultantCard isMobile={false} />
        </div>

        {/* Bottom Trust Bar — absolute bottom on all screen sizes */}
        <div
          className="rise rise-delay-4 absolute inset-x-0 bottom-0 z-10 border-t border-white/[0.07] bg-zinc-950/60 backdrop-blur-xl"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          {/* Mobile: 2×2 grid / Desktop: 4-column grid */}
          <div className="container-prose grid grid-cols-2 md:grid-cols-4">
            {[
              {
                icon: (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" strokeLinecap="round" />
                  </svg>
                ),
                label: homepageSettings.hero_badge_1_bold || "Personalized",
                value: homepageSettings.hero_badge_1_regular || "Property Matching",
              },
              {
                icon: (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path d="M12 2l2.4 4.87L20 8l-4 3.9.94 5.47L12 15l-4.94 2.37L9 11.9 5 8l5.6-1.13L12 2z" />
                  </svg>
                ),
                label: homepageSettings.hero_badge_2_bold || "Official DMCI",
                value: homepageSettings.hero_badge_2_regular || "Accredited Partner",
              },
              {
                icon: (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                ),
                label: homepageSettings.hero_badge_3_bold || "Trusted By",
                value: homepageSettings.hero_badge_3_regular || "OFW Buyers",
              },
              {
                icon: (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                ),
                label: homepageSettings.hero_badge_4_bold || "No Pressure.",
                value: homepageSettings.hero_badge_4_regular || "No Hidden Fees.",
              },
            ].map(({ icon, label, value }, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-3 py-3 md:px-6 md:py-5 border-r border-b md:border-b-0 border-white/[0.07] last:border-r-0 [&:nth-child(2)]:border-r-0 md:[&:nth-child(2)]:border-r [&:nth-child(3)]:border-b-0 [&:nth-child(4)]:border-b-0"
              >
                {/* Icon circle */}
                <div
                  className="shrink-0 flex items-center justify-center h-7 w-7 md:h-8 md:w-8 rounded-full text-[#93B4FF]"
                  style={{
                    background: "rgba(147,180,255,0.08)",
                    border: "1px solid rgba(147,180,255,0.12)",
                  }}
                >
                  {icon}
                </div>
                <div className="min-w-0">
                  <p className="text-[8.5px] md:text-[9px] font-mono uppercase tracking-[0.12em] md:tracking-[0.14em] text-[#93B4FF] font-bold leading-none mb-0.5">
                    {cleanBadgeText(label)}
                  </p>
                  <p className="text-[11px] md:text-[12.5px] font-semibold text-white/85 leading-snug">
                    {cleanBadgeText(value)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Credential trust strip — visible on all screens, hidden on mobile (shown in hero eyebrow area instead) */}
          <div
            className="hidden md:block border-t border-white/[0.06] py-2.5 text-center text-[9px] tracking-[0.18em] text-white/35 uppercase px-4 leading-normal"
            style={{ fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)" }}
          >
            Supervised by Licensed Real Estate Broker Joy Lachica &nbsp;·&nbsp; PRC Lic. No. 10101
            &nbsp;·&nbsp; DHSUD NCR-B-6055
          </div>
        </div>
      </section>

      {/* SECTION 2 — Selected Opportunities (post-hero secondary CTA) */}
      <section className="px-4 pb-20 pt-16 md:pb-28 md:pt-20">
        <div className="container-prose">
          {/* Section header — CMS-controlled */}
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-12 md:mb-16">
            <Reveal>
              <p className="eyebrow">
                <span className="gold-rule" />
                {homepageSettings.featured_eyebrow || "Start Here"}
              </p>
              <h2 className="display-2 mt-4 max-w-xl leading-tight">
                {homepageSettings.featured_title || "Find the property that fits your goals."}
              </h2>
            </Reveal>
            <Reveal delay={120} className="hidden md:block shrink-0">
              <Link
                to="/properties"
                className="inline-flex items-center gap-2.5 rounded-full bg-ink px-7 py-3.5 text-[13px] font-semibold text-white tracking-[0.02em] transition-all duration-500 hover:-translate-y-[3px] hover:shadow-[0_8px_32px_oklch(0.21_0.012_252/0.25)] group"
                style={{ transitionTimingFunction: "var(--ease-luxe)" }}
              >
                View All Properties
                <span
                  aria-hidden
                  className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </Reveal>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-10 md:pb-12">
            {featuredOpportunities.map((opp, idx) => {
              const hasFeaturedTags = opp.highlights && opp.highlights.length > 0;
              const tags = hasFeaturedTags
                ? opp.highlights.slice(0, 3)
                : [
                    /ready/i.test(opp.status ?? "") ? "Ready to Move In" : "Flexible Terms",
                    "Prime Investment",
                    "Resort Amenities",
                  ];

              return (
                <Reveal
                  key={opp.slug}
                  as="article"
                  delay={idx * 140}
                  className={idx === 1 ? "md:translate-y-10" : ""}
                >
                  <Link
                    to="/projects/$slug"
                    params={{ slug: opp.slug }}
                    className="group relative block rounded-[2rem] border border-black/[0.04] bg-white/60 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-[oklch(0.43_0.20_258/0.25)] hover:shadow-[0_30px_80px_rgba(0,0,0,0.06)] overflow-hidden"
                    style={{ transitionTimingFunction: "var(--ease-luxe)" }}
                  >
                    {/* Image Container */}
                    <div className="overflow-hidden relative aspect-[16/9] w-full bg-[#18181b]">
                      <img
                        src={opp.img}
                        alt={opp.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        style={{ transitionTimingFunction: "var(--ease-luxe)" }}
                        width={1280}
                        height={720}
                        loading="lazy"
                      />
                      {/* Image Top Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                      {/* Single status badge — building Status images */}
                      {(() => {
                        const s = (opp.status ?? "").toLowerCase();
                        const src = /ready|rfo/.test(s)
                          ? "/building Status/rfo.png"
                          : /pre-?sell|construction|under/.test(s)
                            ? "/building Status/underconstruction.png"
                            : "/building Status/comingsoon.png";
                        const alt = /ready|rfo/.test(s)
                          ? "Ready for Occupancy"
                          : /pre-?sell|construction|under/.test(s)
                            ? "Under Construction"
                            : "Coming Soon";
                        return (
                          <img
                            src={src}
                            alt={alt}
                            className="absolute top-4 left-4 z-10 w-14 h-14 object-contain select-none transition-transform duration-500 group-hover:scale-[1.05] drop-shadow-lg"
                            draggable={false}
                          />
                        );
                      })()}
                    </div>

                    {/* Card body */}
                    <div className="p-8 relative">
                      {/* Location + Developer */}
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-primary font-bold">
                          {opp.location}
                        </p>
                        {/dmci/i.test(opp.developer ?? "") ? (
                          <img
                            src="/dmci-homes-seeklogo.png"
                            alt="DMCI Homes"
                            className="h-5 object-contain opacity-60"
                            draggable={false}
                          />
                        ) : (
                          <p className="font-mono text-[9px] tracking-wider text-muted-foreground">
                            {opp.developer}
                          </p>
                        )}
                      </div>

                      <h3 className="display-3 group-hover:text-primary transition-colors duration-300 tracking-tight leading-tight">
                        {opp.name}
                      </h3>

                      {/* Price */}
                      <div className="mt-8 pt-6 border-t border-black/[0.04]">
                        <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground mb-1">
                          Starting Price
                        </p>
                        <p className="font-mono text-[22px] font-extrabold text-ink leading-none tracking-tight">
                          {opp.priceDisplay || "Inquire"}
                        </p>
                      </div>

                      {/* Slide-Up Hover Content Area */}
                      <div className="mt-6 pt-5 border-t border-black/[0.04] flex flex-wrap gap-2 transition-all duration-300">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[9.5px] font-mono uppercase tracking-wider text-muted-foreground bg-black/[0.03] px-2.5 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Interactive Button */}
                      <div className="mt-8 flex items-center justify-between">
                        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-2.5 text-[12px] font-bold tracking-[0.04em] text-ink transition-all duration-300 group-hover:border-primary/30 group-hover:bg-primary group-hover:text-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                          Explore Property
                          <span
                            aria-hidden
                            className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                          >
                            →
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-muted-foreground font-semibold group-hover:text-primary transition-colors">
                          View details
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>

          {/* Trust strip */}
          <Reveal delay={200}>
            <div className="mt-16 md:mt-24 flex flex-col items-center gap-3.5 md:flex-row md:justify-center md:gap-8 text-[12px] text-muted-foreground font-medium">
              <span className="flex items-center gap-2">
                <span className="text-[oklch(0.74_0.137_79)] font-bold text-[14px]">✓</span>
                Licensed Real Estate Broker Supervision
              </span>
              <span className="hidden md:block text-border">·</span>
              <span className="flex items-center gap-2">
                <span className="text-[oklch(0.74_0.137_79)] font-bold text-[14px]">✓</span>
                Official DMCI Homes Accredited Partner
              </span>
              <span className="hidden md:block text-border">·</span>
              <span className="flex items-center gap-2">
                <span className="text-[oklch(0.74_0.137_79)] font-bold text-[14px]">✓</span>
                Free Consultation · No Buyer Fees
              </span>
            </div>
          </Reveal>

          {/* Mobile-only View All CTA */}
          <Reveal delay={240} className="mt-12 flex justify-center md:hidden">
            <Link
              to="/properties"
              className="inline-flex items-center gap-2.5 rounded-full bg-ink px-7 py-3.5 text-[13px] font-semibold text-white tracking-[0.02em] transition-all duration-500 hover:-translate-y-[3px] group"
              style={{ transitionTimingFunction: "var(--ease-luxe)" }}
            >
              View All Properties
              <span
                aria-hidden
                className="inline-block transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* SECTION 3 — A different perspective */}
      <section className="px-4 section-pad">
        <div className="container-prose">
          <Reveal>
            <p className="eyebrow">
              <span className="gold-rule" />A different perspective
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="display-2 mt-10 max-w-5xl">
              Most people buy property <span className="text-primary">backwards.</span>
            </h2>
          </Reveal>
          <div className="mt-16 grid md:mt-24 gap-12 md:grid-cols-12">
            <Reveal delay={240} className="md:col-span-7 md:col-start-2">
              <p className="lede">
                They start with the unit. The model home. The amenity reel. Then they try to make
                their life fit the purchase.
              </p>
              <p className="lede mt-8">
                We do the opposite. We start with your goals — your timeline, your liquidity, your
                family, your next ten years — and only then do we look at what's worth owning.
              </p>
              <p className="lede mt-8 text-ink">
                That's the difference between buying a condo and making a property decision.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SECTION 4 — Why Invest pillars */}
      <section className="surface px-4 section-pad">
        <div className="container-prose">
          <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <Reveal>
                <p className="eyebrow">
                  <span className="gold-rule" />
                  Why invest
                </p>
              </Reveal>
              <Reveal delay={120}>
                <h2 className="display-2 mt-6">
                  Real estate, designed
                  <br />
                  for the long term.
                </h2>
              </Reveal>
            </div>
            <Reveal delay={200}>
              <Link to="/why-invest" className="link-quiet hover:border-ink">
                Read the philosophy <span aria-hidden>→</span>
              </Link>
            </Reveal>
          </div>

          <div className="mt-16 grid md:mt-24 gap-y-20 gap-x-16 md:grid-cols-2">
            {[
              {
                n: "01",
                t: "Capital appreciation",
                d: "Well-chosen DMCI locations across the Philippines have historically grown in value over decades — not quarters.",
              },
              {
                n: "02",
                t: "Rental income",
                d: "Stable, dollar-resilient cash flow when you select the right unit in the right submarket.",
              },
              {
                n: "03",
                t: "Inflation protection",
                d: "Hard assets that move with — or ahead of — the cost of living over time.",
              },
              {
                n: "04",
                t: "Long-term wealth",
                d: "A tangible foundation you can pass on, refinance, or hold for generational impact.",
              },
            ].map((b, i) => (
              <Reveal key={b.n} delay={i * 80}>
                <div className="border-t border-hairline pt-8">
                  <p className="text-[11px] font-semibold tracking-[0.28em] text-muted-foreground">
                    {b.n}
                  </p>
                  <h3 className="mt-6 text-[28px] font-bold tracking-[-0.025em] md:text-[34px]">
                    {b.t}
                  </h3>
                  <p className="mt-5 max-w-md text-[16px] leading-relaxed text-muted-foreground">
                    {b.d}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — Founder Section (Cinematic Dark) */}
      <section
        aria-label="About the Founder"
        style={{
          background: "oklch(0.21 0.012 252)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Radial glow accent — brand blue, left side */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 55% 65% at 20% 55%, oklch(0.43 0.20 258 / 0.13) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        {/* Subtle noise grain texture overlay */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat",
            backgroundSize: "180px 180px",
            pointerEvents: "none",
            opacity: 0.5,
          }}
        />

        <div className="container-prose px-4 section-pad">
          {homepageSettings.enable_team_member ? (
            /* ── DUAL MODE: Founder + Team Member ── */
            <div className="grid gap-20 md:grid-cols-2 md:gap-16">
              {/* ── Founder Card ── */}
              <div style={{ display: "grid", gap: "2.5rem" }}>
                <Reveal>
                  <div style={{ position: "relative" }}>
                    {/* Gold vertical accent bar */}
                    <div
                      aria-hidden
                      style={{
                        position: "absolute",
                        top: "2.5rem",
                        left: "-1.25rem",
                        width: "3px",
                        height: "55%",
                        background:
                          "linear-gradient(to bottom, oklch(0.74 0.137 79), oklch(0.74 0.137 79 / 0))",
                        borderRadius: "2px",
                      }}
                    />
                    <div
                      className="img-luxe img-luxe-hover overflow-hidden"
                      style={{ borderRadius: "1.5rem", position: "relative" }}
                    >
                      <img
                        src={homepageSettings.founder_image_url || founderImg}
                        alt="CityQlo founder portrait"
                        className="img-luxe aspect-[4/5] w-full object-cover"
                        width={1400}
                        height={1750}
                        loading="lazy"
                      />
                      {/* Bottom gradient vignette matching dark bg */}
                      <div
                        aria-hidden
                        style={{
                          position: "absolute",
                          inset: "55% 0 0",
                          background:
                            "linear-gradient(to top, oklch(0.21 0.012 252 / 0.6), transparent)",
                          pointerEvents: "none",
                        }}
                      />
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={120}>
                  <p className="eyebrow" style={{ color: "oklch(0.74 0.137 79 / 0.9)" }}>
                    <span className="gold-rule" />
                    {homepageSettings.founder_eyebrow || "Founder"}
                  </p>
                  <h2 className="display-3 mt-4" style={{ color: "#fff" }}>
                    {homepageSettings.founder_headline || "A quieter way to invest."}
                  </h2>

                  {/* Editorial blockquote — only shown when quote is set */}
                  {homepageSettings.founder_quote && (
                    <blockquote
                      style={{
                        position: "relative",
                        margin: "2rem 0",
                        padding: "1.25rem 1.25rem 1.25rem 2.25rem",
                        borderLeft: "3px solid oklch(0.74 0.137 79)",
                        background: "oklch(0.74 0.137 79 / 0.08)",
                        borderRadius: "0 1rem 1rem 0",
                      }}
                    >
                      <span
                        aria-hidden
                        style={{
                          position: "absolute",
                          top: "-0.75rem",
                          left: "0.6rem",
                          fontSize: "3.5rem",
                          lineHeight: 1,
                          fontFamily: "Georgia, serif",
                          color: "oklch(0.74 0.137 79 / 0.45)",
                          userSelect: "none",
                        }}
                      >
                        &ldquo;
                      </span>
                      <p
                        style={{
                          fontStyle: "italic",
                          fontSize: "clamp(0.95rem, 1.3vw, 1.05rem)",
                          lineHeight: 1.65,
                          color: "oklch(0.9 0.008 252)",
                          margin: 0,
                        }}
                      >
                        {homepageSettings.founder_quote}
                      </p>
                    </blockquote>
                  )}

                  <p
                    className="lede"
                    style={{
                      color: "oklch(0.72 0.008 252)",
                      marginTop: homepageSettings.founder_quote ? "0" : "1.5rem",
                    }}
                  >
                    {homepageSettings.founder_lede ||
                      "CityQlo began with a simple frustration: Filipino buyers deserved an advisor — not another salesperson. We exist to give that conversation back to families and OFWs planning for the long run."}
                  </p>

                  {/* Cursive handwritten signature */}
                  {homepageSettings.founder_signature_text && (
                    <p
                      style={{
                        fontFamily: "'Dancing Script', 'Brush Script MT', cursive",
                        fontSize: "clamp(1.75rem, 2.5vw, 2.5rem)",
                        color: "oklch(0.74 0.137 79)",
                        lineHeight: 1.2,
                        marginTop: "1.75rem",
                        letterSpacing: "0.01em",
                      }}
                    >
                      {homepageSettings.founder_signature_text}
                    </p>
                  )}

                  <div style={{ marginTop: "2rem" }}>
                    <Link
                      to={homepageSettings.founder_cta_link || "/about"}
                      className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-[13px] font-semibold transition-all duration-700 hover:-translate-y-[2px]"
                      style={{
                        borderColor: "oklch(1 0 0 / 0.25)",
                        color: "#fff",
                        transitionTimingFunction: "var(--ease-luxe)",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.borderColor =
                          "oklch(1 0 0 / 0.7)";
                        (e.currentTarget as HTMLAnchorElement).style.background =
                          "oklch(1 0 0 / 0.07)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.borderColor =
                          "oklch(1 0 0 / 0.25)";
                        (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                      }}
                    >
                      {homepageSettings.founder_cta_text || "Read our story"}
                      <span aria-hidden>→</span>
                    </Link>
                  </div>
                </Reveal>
              </div>

              {/* ── Team Member Card ── */}
              <div style={{ display: "grid", gap: "2.5rem", paddingTop: "4rem" }}>
                <Reveal>
                  <div style={{ position: "relative" }}>
                    <div
                      aria-hidden
                      style={{
                        position: "absolute",
                        top: "2.5rem",
                        left: "-1.25rem",
                        width: "3px",
                        height: "55%",
                        background:
                          "linear-gradient(to bottom, oklch(0.74 0.137 79), oklch(0.74 0.137 79 / 0))",
                        borderRadius: "2px",
                      }}
                    />
                    <div
                      className="img-luxe img-luxe-hover overflow-hidden"
                      style={{ borderRadius: "1.5rem", position: "relative" }}
                    >
                      <img
                        src={homepageSettings.team_member_image_url || founderImg}
                        alt={homepageSettings.team_member_name || "Team member portrait"}
                        className="img-luxe aspect-[4/5] w-full object-cover"
                        width={1400}
                        height={1750}
                        loading="lazy"
                      />
                      <div
                        aria-hidden
                        style={{
                          position: "absolute",
                          inset: "55% 0 0",
                          background:
                            "linear-gradient(to top, oklch(0.21 0.012 252 / 0.6), transparent)",
                          pointerEvents: "none",
                        }}
                      />
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={120}>
                  <p className="eyebrow" style={{ color: "oklch(0.74 0.137 79 / 0.9)" }}>
                    <span className="gold-rule" />
                    {homepageSettings.team_member_role || "Advisor"}
                  </p>
                  <h2 className="display-3 mt-4" style={{ color: "#fff" }}>
                    {homepageSettings.team_member_name || "Team Member"}
                  </h2>

                  {homepageSettings.team_member_quote && (
                    <blockquote
                      style={{
                        position: "relative",
                        margin: "2rem 0",
                        padding: "1.25rem 1.25rem 1.25rem 2.25rem",
                        borderLeft: "3px solid oklch(0.74 0.137 79)",
                        background: "oklch(0.74 0.137 79 / 0.08)",
                        borderRadius: "0 1rem 1rem 0",
                      }}
                    >
                      <span
                        aria-hidden
                        style={{
                          position: "absolute",
                          top: "-0.75rem",
                          left: "0.6rem",
                          fontSize: "3.5rem",
                          lineHeight: 1,
                          fontFamily: "Georgia, serif",
                          color: "oklch(0.74 0.137 79 / 0.45)",
                          userSelect: "none",
                        }}
                      >
                        &ldquo;
                      </span>
                      <p
                        style={{
                          fontStyle: "italic",
                          fontSize: "clamp(0.95rem, 1.3vw, 1.05rem)",
                          lineHeight: 1.65,
                          color: "oklch(0.9 0.008 252)",
                          margin: 0,
                        }}
                      >
                        {homepageSettings.team_member_quote}
                      </p>
                    </blockquote>
                  )}

                  <p
                    className="lede"
                    style={{
                      color: "oklch(0.72 0.008 252)",
                      marginTop: homepageSettings.team_member_quote ? "0" : "1.5rem",
                    }}
                  >
                    {homepageSettings.team_member_bio ||
                      "Dedicated to helping Filipino professionals and investors make smart long-term property decisions."}
                  </p>
                </Reveal>
              </div>
            </div>
          ) : (
            /* ── SINGLE FOUNDER MODE — large editorial layout ── */
            <div className="grid items-center gap-16 md:grid-cols-12 md:gap-20">
              {/* Portrait column */}
              <Reveal className="md:col-span-5">
                <div style={{ position: "relative" }}>
                  {/* Gold vertical accent line on the left edge */}
                  <div
                    aria-hidden
                    style={{
                      position: "absolute",
                      top: "3rem",
                      left: "-1.5rem",
                      width: "3px",
                      height: "60%",
                      background:
                        "linear-gradient(to bottom, oklch(0.74 0.137 79), oklch(0.74 0.137 79 / 0))",
                      borderRadius: "2px",
                    }}
                  />
                  {/* Subtle corner glow behind portrait */}
                  <div
                    aria-hidden
                    style={{
                      position: "absolute",
                      inset: "-2rem -2rem -2rem -2rem",
                      background:
                        "radial-gradient(ellipse 80% 80% at 50% 50%, oklch(0.43 0.20 258 / 0.18) 0%, transparent 70%)",
                      pointerEvents: "none",
                      borderRadius: "2rem",
                    }}
                  />
                  <div
                    className="img-luxe img-luxe-hover overflow-hidden"
                    style={{
                      borderRadius: "1.5rem",
                      position: "relative",
                      boxShadow: "0 32px 80px -20px oklch(0 0 0 / 0.6)",
                    }}
                  >
                    <img
                      src={homepageSettings.founder_image_url || founderImg}
                      alt="CityQlo founder portrait"
                      className="img-luxe aspect-[4/5] w-full object-cover"
                      width={1400}
                      height={1750}
                      loading="lazy"
                    />
                    {/* Bottom gradient vignette that bleeds into the dark bg */}
                    <div
                      aria-hidden
                      style={{
                        position: "absolute",
                        inset: "50% 0 0",
                        background:
                          "linear-gradient(to top, oklch(0.21 0.012 252 / 0.55), transparent)",
                        pointerEvents: "none",
                      }}
                    />
                  </div>
                </div>
              </Reveal>

              {/* Content column */}
              <Reveal delay={160} className="md:col-span-6 md:col-start-7">
                {/* Eyebrow in gold */}
                <p className="eyebrow" style={{ color: "oklch(0.74 0.137 79 / 0.9)" }}>
                  <span className="gold-rule" />
                  {homepageSettings.founder_eyebrow || "Founder"}
                </p>

                {/* Main headline */}
                <h2 className="display-2 mt-6" style={{ color: "#fff", lineHeight: 1.05 }}>
                  {homepageSettings.founder_headline || "A quieter way to invest."}
                </h2>

                {/* Editorial pull-quote — appears when founder_quote is set */}
                {homepageSettings.founder_quote && (
                  <blockquote
                    style={{
                      position: "relative",
                      margin: "2.5rem 0",
                      padding: "1.5rem 1.5rem 1.5rem 2.75rem",
                      borderLeft: "3px solid oklch(0.74 0.137 79)",
                      background: "oklch(0.74 0.137 79 / 0.07)",
                      borderRadius: "0 1.25rem 1.25rem 0",
                    }}
                  >
                    {/* Decorative oversized opening quotation mark */}
                    <span
                      aria-hidden
                      style={{
                        position: "absolute",
                        top: "-1rem",
                        left: "0.75rem",
                        fontSize: "5rem",
                        lineHeight: 1,
                        fontFamily: "Georgia, 'Times New Roman', serif",
                        color: "oklch(0.74 0.137 79 / 0.4)",
                        userSelect: "none",
                        pointerEvents: "none",
                      }}
                    >
                      &ldquo;
                    </span>
                    <p
                      style={{
                        fontStyle: "italic",
                        fontSize: "clamp(1rem, 1.5vw, 1.15rem)",
                        lineHeight: 1.7,
                        color: "oklch(0.92 0.008 252)",
                        margin: 0,
                        fontWeight: 400,
                      }}
                    >
                      {homepageSettings.founder_quote}
                    </p>
                  </blockquote>
                )}

                {/* Body lede */}
                <p
                  className="lede"
                  style={{
                    color: "oklch(0.70 0.01 252)",
                    marginTop: homepageSettings.founder_quote ? "0" : "2.5rem",
                  }}
                >
                  {homepageSettings.founder_lede ||
                    "CityQlo began with a simple frustration: Filipino buyers deserved an advisor — not another salesperson. We exist to give that conversation back to families and OFWs planning for the long run."}
                </p>

                {/* Handwritten signature in Dancing Script */}
                {homepageSettings.founder_signature_text && (
                  <div
                    style={{
                      marginTop: "2.25rem",
                      paddingTop: "1.5rem",
                      borderTop: "1px solid oklch(1 0 0 / 0.08)",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "'Dancing Script', 'Brush Script MT', cursive",
                        fontSize: "clamp(2rem, 3vw, 3rem)",
                        color: "oklch(0.74 0.137 79)",
                        lineHeight: 1.2,
                        letterSpacing: "0.01em",
                        margin: 0,
                      }}
                    >
                      {homepageSettings.founder_signature_text}
                    </p>
                    <p
                      style={{
                        fontSize: "0.6875rem",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "oklch(0.55 0.01 252)",
                        marginTop: "0.4rem",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {homepageSettings.founder_eyebrow || "Founder"}, CityQlo
                    </p>
                  </div>
                )}

                {/* CTA */}
                <div style={{ marginTop: "2.5rem" }}>
                  <Link
                    to={homepageSettings.founder_cta_link || "/about"}
                    className="inline-flex items-center gap-2 rounded-full border px-7 py-3.5 text-[13px] font-semibold tracking-[0.02em] transition-all duration-700 hover:-translate-y-[2px]"
                    style={{
                      borderColor: "oklch(1 0 0 / 0.22)",
                      color: "#fff",
                      transitionTimingFunction: "var(--ease-luxe)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor =
                        "oklch(1 0 0 / 0.65)";
                      (e.currentTarget as HTMLAnchorElement).style.background =
                        "oklch(1 0 0 / 0.07)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor =
                        "oklch(1 0 0 / 0.22)";
                      (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                    }}
                  >
                    {homepageSettings.founder_cta_text || "Read our story"}
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </Reveal>
            </div>
          )}
        </div>
      </section>

      {/* Social proof — real Google reviews, shown before the ask */}
      <GoogleReviews />

      {/* Final CTA */}
      <ConsultationCTA />
    </>
  );
}
