import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import lifestyleImg from "@/assets/lifestyle-couple.jpg";
import interiorImg from "@/assets/interior-living.jpg";
import towerImg from "@/assets/tower-exterior.jpg";
import poolImg from "@/assets/amenity-pool.jpg";
import founderImg from "@/assets/founder-portrait.jpg";
import { ConsultationCTA } from "@/components/site/ConsultationCTA";
import { Reveal } from "@/components/site/Reveal";
import { Testimonials } from "@/components/site/Testimonials";
import {
  getSiteSettings,
  getPublicTestimonials,
  getPublicPropertiesPageContent,
} from "../lib/api/admin.functions";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    // Fetch settings, testimonials, and page content on server — return data so component gets it synchronously
    const [settingsResult, testimonialsResult, pageContentResult] = await Promise.allSettled([
      context.queryClient.ensureQueryData({
        queryKey: ["portal-settings"],
        queryFn: () => getSiteSettings(),
      }),
      context.queryClient.ensureQueryData({
        queryKey: ["public_testimonials"],
        queryFn: () => getPublicTestimonials(),
      }),
      context.queryClient.ensureQueryData({
        queryKey: ["properties-page-content"],
        queryFn: () => getPublicPropertiesPageContent(),
      }),
    ]);
    return {
      initialSettings: settingsResult.status === "fulfilled" ? settingsResult.value : null,
      initialTestimonials:
        testimonialsResult.status === "fulfilled" ? testimonialsResult.value : [],
      initialPageContent: pageContentResult.status === "fulfilled" ? pageContentResult.value : null,
      settingsError: settingsResult.status === "rejected" ? String(settingsResult.reason) : null,
      testimonialsError:
        testimonialsResult.status === "rejected" ? String(testimonialsResult.reason) : null,
    };
  },
  head: () => ({
    meta: [
      { title: "CityQlo — Find the Right Property, Not Just Another Condo" },
      {
        name: "description",
        content:
          "Premium property advisory for Filipino professionals, investors, and OFWs. Make smarter property decisions with CityQlo.",
      },
      {
        name: "keywords",
        content:
          "Metro Manila real estate, property advisory, DMCI Homes, property investment Philippines, OFW real estate, Manila condos",
      },
      { property: "og:title", content: "CityQlo — Find the Right Property" },
      {
        property: "og:description",
        content: "Premium property advisory for Filipino professionals, investors, and OFWs.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
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
  team_member_image_url?: string;
  team_member_role?: string;
  team_member_name?: string;
  team_member_bio?: string;
  stat_1_val?: string;
  stat_1_desc?: string;
  stat_2_val?: string;
  stat_2_desc?: string;
  stat_3_val?: string;
  stat_3_desc?: string;
}

// ─── CUSTOMIZABLE HERO OVERLAY ──────────────────────────────────────────────
// Modify the value below (0 to 100) to adjust the default darkness of the home hero section.
// (e.g. 40 for 40% opacity). If a value is saved in the CMS settings, that will take precedence.
const HERO_OVERLAY_OPACITY_PERCENT = 40; 

const cleanBadgeText = (text: string) => {
  return text.replace(/acccredited/gi, "Accredited");
};

function Home() {
  // loaderData is available synchronously — no loading flash
  const { initialSettings, initialPageContent } = Route.useLoaderData();

  const heroContentRef = useRef<HTMLDivElement | null>(null);
  const heroImgRef = useRef<HTMLDivElement | null>(null);
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState<number | null>(null);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  // Derive top 2 featured opportunities dynamically
  const featuredOpportunities = useMemo(() => {
    const list = propertiesData
      .filter((p: any) => p.is_featured)
      .slice(0, 2)
      .map((p: any, idx: number) => ({
        slug: p.slug,
        name: p.name,
        city: p.city,
        location: p.location || `${p.city} · ${p.developer}`,
        developer: p.developer,
        status: p.status,
        img: p.image_url || (idx === 0 ? towerImg : interiorImg),
        isDb: true,
      }));

    if (list.length < 2) {
      return [
        {
          slug: "sonora-garden",
          name: "Sonora Garden Residences",
          city: "Las Piñas",
          location: "Las Piñas · DMCI",
          developer: "DMCI Homes",
          status: "Pre-selling",
          img: towerImg,
          isDb: false,
        },
        {
          slug: "crestmont",
          name: "The Crestmont",
          city: "Quezon City",
          location: "Quezon City",
          developer: "DMCI Homes",
          status: "Move-in ready",
          img: interiorImg,
          isDb: false,
        },
      ];
    }
    return list;
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
        className="relative h-[100svh] min-h-[600px] w-full overflow-hidden"
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

        {/* Overlay Dark Filter */}
        <div
          className="absolute inset-0 bg-black transition-opacity duration-700"
          style={{ opacity: homepageSettings.hero_overlay_opacity ?? (HERO_OVERLAY_OPACITY_PERCENT / 100) }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 70% at 20% 30%, transparent 40%, rgba(0,0,0,0.35) 100%)",
          }}
        />

        {/* Slide Dot Indicators — only shown when 2+ slides */}
        {totalSlides > 1 && (
          <div
            style={{
              position: "absolute",
              bottom: "6rem",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 20,
              display: "flex",
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
                  background: i === activeSlide ? "#fff" : "rgba(255,255,255,0.45)",
                  border: i === activeSlide ? "none" : "1.5px solid rgba(255,255,255,0.7)",
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
          className="relative z-10 flex h-full items-center pt-28 pb-32 will-change-transform md:pt-32 md:pb-28 hero-home-container"
        >
          <div className="container-prose">
            <div className="max-w-4xl text-white hero-content-inner">
              {homepageSettings.hero_eyebrow !== "" && (
                <p className="eyebrow rise text-white/55">
                  <span className="gold-rule" />
                  {homepageSettings.hero_eyebrow || "CityQlo · Metro Manila"}
                </p>
              )}
              <h1
                className={`display-1 rise rise-delay-1 mt-5 md:mt-8 text-shadow-hero ${
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
                  lineHeight: 1.0,
                }}
              >
                {homepageSettings.hero_headline_1 || "Find the right"}
                <br />
                {homepageSettings.hero_headline_2 || "property."}
                <span
                  className={`block text-shadow-sub ${
                    homepageSettings.hero_subtitle_color?.startsWith("text-")
                      ? homepageSettings.hero_subtitle_color
                      : ""
                  }`}
                  style={{
                    color:
                      homepageSettings.hero_subtitle_color &&
                      !homepageSettings.hero_subtitle_color.startsWith("text-")
                        ? homepageSettings.hero_subtitle_color
                        : "#1A56DB",
                  }}
                >
                  {homepageSettings.hero_headline_sub || "Not just another condo."}
                </span>
              </h1>
              <p
                className={`lede rise rise-delay-2 mt-6 max-w-xl md:mt-10 text-shadow-sm ${
                  homepageSettings.hero_lede_color?.startsWith("text-")
                    ? homepageSettings.hero_lede_color
                    : ""
                }`}
                style={{
                  color:
                    homepageSettings.hero_lede_color &&
                    !homepageSettings.hero_lede_color.startsWith("text-")
                      ? homepageSettings.hero_lede_color
                      : "#e4e4e7",
                  fontSize: "clamp(1.0625rem, 1.5vw, 1.125rem)",
                }}
              >
                {homepageSettings.hero_lede ||
                  "Helping Filipino professionals, investors, and OFWs make smarter property decisions — with guidance, not pressure."}
              </p>
              <div className="rise rise-delay-3 mt-8 flex flex-row flex-wrap gap-3 md:mt-12">
                <Link
                  to={homepageSettings.hero_cta_link || "/contact"}
                  className="inline-flex flex-1 min-h-[50px] items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-[13px] font-semibold tracking-[0.02em] text-ink transition-all duration-700 hover:-translate-y-[2px] hover:shadow-lift"
                  style={{ transitionTimingFunction: "var(--ease-luxe)" }}
                >
                  {homepageSettings.hero_cta_text || "Book consultation"}
                  <span aria-hidden>→</span>
                </Link>
                <Link
                  to={homepageSettings.hero_secondary_cta_link || "/why-invest"}
                  className="inline-flex flex-1 min-h-[50px] items-center justify-center gap-2 rounded-full border-2 border-white/60 px-5 py-3 text-[13px] font-semibold tracking-[0.02em] text-white transition-all duration-700 hover:border-white hover:bg-white/10"
                  style={{ transitionTimingFunction: "var(--ease-luxe)" }}
                >
                  {homepageSettings.hero_secondary_cta_text || "Why invest"}
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div
          className="rise rise-delay-4 absolute inset-x-0 bottom-0 z-10 border-t border-[#1A56DB]/30 bg-black/30 backdrop-blur-md"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="container-prose grid grid-cols-2 gap-x-4 gap-y-3 py-4 text-white/90 md:grid-cols-4 md:py-7">
            {[
              [
                homepageSettings.hero_badge_1_bold || "Goal-first",
                homepageSettings.hero_badge_1_regular || "advisory",
              ],
              [
                homepageSettings.hero_badge_2_bold || "DMCI",
                homepageSettings.hero_badge_2_regular || "Accredited",
              ],
              [
                homepageSettings.hero_badge_3_bold || "OFW",
                homepageSettings.hero_badge_3_regular || "friendly",
              ],
              [
                homepageSettings.hero_badge_4_bold || "No-pressure",
                homepageSettings.hero_badge_4_regular || "consultations",
              ],
            ].map(([a, b]) => {
              const cleanedA = cleanBadgeText(a);
              const cleanedB = cleanBadgeText(b);
              return (
                <div
                  key={a}
                  className="text-[10px] uppercase tracking-[0.22em] md:text-[10.5px] md:tracking-[0.24em]"
                >
                  <span className="font-semibold">{cleanedA}</span>{" "}
                  <span className="text-white/65">{cleanedB}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 2 — A different perspective */}
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

      {/* SECTION 3 — Why Invest pillars */}
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
                d: "Well-chosen Metro Manila locations have historically grown in value over decades — not quarters.",
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

      {/* SECTION 4 — Featured Opportunities */}
      <section className="px-4 section-pad">
        <div className="container-prose">
          <div className="grid items-end gap-6 md:grid-cols-12">
            <Reveal className="md:col-span-7">
              <p className="eyebrow">
                <span className="gold-rule" />
                Selected
              </p>
              <h2 className="display-2 mt-6">Featured opportunities.</h2>
            </Reveal>
            <Reveal delay={160} className="md:col-span-4 md:col-start-9">
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                A curated, ever-evolving shortlist — chosen for resilience, lifestyle, and long-term
                value.
              </p>
            </Reveal>
          </div>

          <div className="mt-16 grid md:mt-24 gap-12 md:grid-cols-12 md:gap-16">
            {/* Opportunity 1 */}
            <Reveal as="article" className="md:col-span-7">
              <Link
                to="/projects/$slug"
                params={{ slug: featuredOpportunities[0].slug }}
                className="block group"
              >
                <div className="img-luxe img-luxe-hover overflow-hidden rounded-[1.5rem]">
                  <img
                    src={featuredOpportunities[0].img}
                    alt={featuredOpportunities[0].name}
                    className="img-luxe aspect-[4/5] w-full object-cover"
                    width={1600}
                    height={2000}
                    loading="lazy"
                  />
                </div>
                <div className="mt-8 flex items-end justify-between">
                  <div>
                    <p className="eyebrow">{featuredOpportunities[0].location}</p>
                    <h3 className="display-3 mt-3 group-hover:text-primary transition-colors">
                      {featuredOpportunities[0].name}
                    </h3>
                  </div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {featuredOpportunities[0].status}
                  </p>
                </div>
              </Link>
            </Reveal>

            {/* Opportunity 2 */}
            <Reveal as="article" delay={160} className="md:col-span-5 md:pt-32">
              <Link
                to="/projects/$slug"
                params={{ slug: featuredOpportunities[1].slug }}
                className="block group"
              >
                <div className="img-luxe img-luxe-hover overflow-hidden rounded-[1.5rem]">
                  <img
                    src={featuredOpportunities[1].img}
                    alt={featuredOpportunities[1].name}
                    className="img-luxe aspect-[4/5] w-full object-cover"
                    width={1920}
                    height={1280}
                    loading="lazy"
                  />
                </div>
                <div className="mt-8 flex items-end justify-between">
                  <div>
                    <p className="eyebrow">{featuredOpportunities[1].location}</p>
                    <h3 className="display-3 mt-3 group-hover:text-primary transition-colors">
                      {featuredOpportunities[1].name}
                    </h3>
                  </div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {featuredOpportunities[1].status}
                  </p>
                </div>
              </Link>
            </Reveal>
          </div>

          <Reveal delay={200}>
            <div className="mt-16 md:mt-24">
              <Link
                to="/properties"
                className="inline-flex items-center gap-3 rounded-full border border-border bg-background px-8 py-4 text-[13px] font-semibold tracking-[0.02em] text-ink transition-all duration-700 hover:-translate-y-[2px] hover:border-ink"
                style={{ transitionTimingFunction: "var(--ease-luxe)" }}
              >
                View opportunities <span aria-hidden>→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SECTION 5 — Why CityQlo */}
      <section className="surface px-4 section-pad">
        <div className="container-prose">
          <Reveal>
            <p className="eyebrow">
              <span className="gold-rule" />
              Why CityQlo
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="display-2 mt-6 max-w-3xl">Guidance you can build a decade on.</h2>
          </Reveal>

          <div className="mt-16 grid md:mt-24 gap-20 md:grid-cols-3 md:gap-12">
            {[
              {
                t: "Goal-first approach",
                d: "We start by understanding your timeline, liquidity, and family — not pushing a unit.",
              },
              {
                t: "Transparent advice",
                d: "We tell you when not to buy. We tell you when to wait. We tell you why.",
              },
              {
                t: "Long-term perspective",
                d: "Decisions designed to age well — across cycles, currencies, and life stages.",
              },
            ].map((p, i) => (
              <Reveal key={p.t} delay={i * 100}>
                <p className="text-[11px] font-semibold tracking-[0.28em] text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-6 text-[26px] font-bold tracking-[-0.025em]">{p.t}</h3>
                <p className="mt-5 text-[16px] leading-relaxed text-muted-foreground">{p.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — About Preview (editorial) */}
      <section className="px-4 section-pad">
        <div className="container-prose">
          {homepageSettings.enable_team_member ? (
            <div className="grid gap-20 md:grid-cols-2 md:gap-32">
              {/* Founder Profile */}
              <div className="grid items-center gap-10">
                <Reveal>
                  <div className="img-luxe img-luxe-hover overflow-hidden rounded-[1.5rem]">
                    <img
                      src={homepageSettings.founder_image_url || founderImg}
                      alt="CityQlo founder portrait"
                      className="img-luxe aspect-[4/5] w-full object-cover"
                      width={1400}
                      height={1750}
                      loading="lazy"
                    />
                  </div>
                </Reveal>
                <Reveal delay={120}>
                  <p className="eyebrow">
                    <span className="gold-rule" />
                    {homepageSettings.founder_eyebrow || "Founder"}
                  </p>
                  <h2 className="display-3 mt-4">
                    {homepageSettings.founder_headline || "A quieter way to invest."}
                  </h2>
                  <p className="lede mt-6 text-[15px] leading-relaxed">
                    {homepageSettings.founder_lede ||
                      "CityQlo began with a simple frustration: Filipino buyers deserved an advisor — not another salesperson. We exist to give that conversation back to families and OFWs planning for the long run."}
                  </p>
                  <div className="mt-8">
                    <Link
                      to={homepageSettings.founder_cta_link || "/about"}
                      className="link-quiet hover:border-ink"
                    >
                      {homepageSettings.founder_cta_text || "Read our story"}{" "}
                      <span aria-hidden>→</span>
                    </Link>
                  </div>
                </Reveal>
              </div>

              {/* Team Member Profile */}
              <div className="grid items-center gap-10 md:pt-16">
                <Reveal>
                  <div className="img-luxe img-luxe-hover overflow-hidden rounded-[1.5rem]">
                    <img
                      src={homepageSettings.team_member_image_url || founderImg}
                      alt={homepageSettings.team_member_name || "Team member portrait"}
                      className="img-luxe aspect-[4/5] w-full object-cover"
                      width={1400}
                      height={1750}
                      loading="lazy"
                    />
                  </div>
                </Reveal>
                <Reveal delay={120}>
                  <p className="eyebrow">
                    <span className="gold-rule" />
                    {homepageSettings.team_member_role || "Advisor"}
                  </p>
                  <h2 className="display-3 mt-4">
                    {homepageSettings.team_member_name || "Team Member"}
                  </h2>
                  <p className="lede mt-6 text-[15px] leading-relaxed">
                    {homepageSettings.team_member_bio ||
                      "Dedicated to helping Filipino professionals and investors make smart long-term property decisions."}
                  </p>
                </Reveal>
              </div>
            </div>
          ) : (
            <div className="grid items-center gap-16 md:grid-cols-12 md:gap-24">
              <Reveal className="md:col-span-6">
                <div className="img-luxe img-luxe-hover overflow-hidden rounded-[1.5rem]">
                  <img
                    src={homepageSettings.founder_image_url || founderImg}
                    alt="CityQlo founder portrait"
                    className="img-luxe aspect-[4/5] w-full object-cover"
                    width={1400}
                    height={1750}
                    loading="lazy"
                  />
                </div>
              </Reveal>
              <Reveal delay={160} className="md:col-span-5 md:col-start-8">
                <p className="eyebrow">
                  <span className="gold-rule" />
                  {homepageSettings.founder_eyebrow || "Founder"}
                </p>
                <h2 className="display-2 mt-6">
                  {homepageSettings.founder_headline || "A quieter way to invest."}
                </h2>
                <p className="lede mt-10">
                  {homepageSettings.founder_lede ||
                    "CityQlo began with a simple frustration: Filipino buyers deserved an advisor — not another salesperson. We exist to give that conversation back to families and OFWs planning for the long run."}
                </p>
                <div className="mt-12">
                  <Link
                    to={homepageSettings.founder_cta_link || "/about"}
                    className="link-quiet hover:border-ink"
                  >
                    {homepageSettings.founder_cta_text || "Read our story"}{" "}
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </Reveal>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 7 — Trust Metrics (massive type) */}
      <section className="px-4 section-pad-sm">
        <div className="container-prose">
          <Reveal>
            <p className="eyebrow mb-20">
              <span className="gold-rule" />
              By the numbers
            </p>
          </Reveal>
          <div className="grid gap-20 md:grid-cols-3 md:gap-16">
            {[
              [
                homepageSettings.stat_1_val || "12+",
                homepageSettings.stat_1_desc || "Years advising Filipino buyers",
              ],
              [
                homepageSettings.stat_2_val || "₱2B+",
                homepageSettings.stat_2_desc || "In property value placed",
              ],
              [
                homepageSettings.stat_3_val || "98%",
                homepageSettings.stat_3_desc || "Of clients say they'd return",
              ],
            ].map(([n, l], i) => (
              <Reveal key={l} delay={i * 120}>
                <div className="border-t border-hairline pt-10">
                  <p className="text-[4rem] font-extrabold leading-[0.95] tracking-[-0.04em] md:text-[7.5rem]">
                    {n}
                  </p>
                  <p className="mt-8 max-w-[16rem] text-[14px] leading-relaxed text-muted-foreground">
                    {l}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <ConsultationCTA />

      {/* Lifestyle band */}
      <section className="px-4">
        <div className="container-prose">
          <div className="grid gap-6 md:grid-cols-2 md:gap-8">
            <Reveal className="img-luxe img-luxe-hover overflow-hidden rounded-[1.5rem]">
              <img
                src={lifestyleImg}
                alt="Couple at home overlooking Manila"
                className="img-luxe aspect-[4/5] w-full object-cover md:aspect-[3/4]"
                width={1600}
                height={1920}
                loading="lazy"
              />
            </Reveal>
            <Reveal
              delay={140}
              className="img-luxe img-luxe-hover overflow-hidden rounded-[1.5rem]"
            >
              <img
                src={poolImg}
                alt="Rooftop amenity overlooking Manila"
                className="img-luxe aspect-[4/5] w-full object-cover md:aspect-[3/4]"
                width={1920}
                height={1080}
                loading="lazy"
              />
            </Reveal>
          </div>
        </div>
      </section>

      <Testimonials />
    </>
  );
}
