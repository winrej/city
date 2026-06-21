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

        {/* Text protection gradients to shield hero subtext (left gradient on desktop, bottom gradient on mobile) */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none z-[5] hidden md:block"
          style={{
            background: "linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none z-[5] block md:hidden"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 60%, transparent 100%)",
          }}
        />

        {/* Slide Dot Indicators — only shown when 2+ slides */}
        {totalSlides > 1 && (
          <div
            className="hidden md:flex"
            style={{
              position: "absolute",
              bottom: "6rem",
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
                  className="text-[12.5px] tracking-wide md:text-[13px]"
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
              {homepageSettings.featured_eyebrow !== "" && (
                <p className="eyebrow">
                  <span className="gold-rule" />
                  {homepageSettings.featured_eyebrow || "Selected"}
                </p>
              )}
              <h2 className="display-2 mt-6">
                {homepageSettings.featured_title || "Featured opportunities."}
              </h2>
            </Reveal>
            <Reveal delay={160} className="md:col-span-4 md:col-start-9">
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                {homepageSettings.featured_description ||
                  "A curated, ever-evolving shortlist — chosen for resilience, lifestyle, and long-term value."}
              </p>
            </Reveal>
          </div>

          <div className="mt-16 grid md:mt-24 gap-12 md:grid-cols-12 md:gap-16">
            {featuredOpportunities.map((opp, idx) => {
              const isEven = idx % 2 === 0;
              const colSpan = isEven ? "md:col-span-7" : "md:col-span-5 md:pt-32";
              return (
                <Reveal key={opp.slug} as="article" delay={idx * 160} className={colSpan}>
                  <Link
                    to="/projects/$slug"
                    params={{ slug: opp.slug }}
                    className="block group"
                  >
                    <div className="img-luxe img-luxe-hover overflow-hidden rounded-[1.5rem]">
                      <img
                        src={opp.img}
                        alt={opp.name}
                        className="img-luxe aspect-[4/5] w-full object-cover"
                        width={isEven ? 1600 : 1920}
                        height={isEven ? 2000 : 1280}
                        loading="lazy"
                      />
                    </div>
                    <div className="mt-8 flex items-end justify-between">
                      <div>
                        <p className="eyebrow">{opp.location}</p>
                        <h3 className="display-3 mt-3 group-hover:text-primary transition-colors">
                          {opp.name}
                        </h3>
                      </div>
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        {opp.status}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
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
                        (e.currentTarget as HTMLAnchorElement).style.borderColor = "oklch(1 0 0 / 0.7)";
                        (e.currentTarget as HTMLAnchorElement).style.background = "oklch(1 0 0 / 0.07)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.borderColor = "oklch(1 0 0 / 0.25)";
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
                <h2
                  className="display-2 mt-6"
                  style={{ color: "#fff", lineHeight: 1.05 }}
                >
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
                  <div style={{ marginTop: "2.25rem", paddingTop: "1.5rem", borderTop: "1px solid oklch(1 0 0 / 0.08)" }}>
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
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = "oklch(1 0 0 / 0.65)";
                      (e.currentTarget as HTMLAnchorElement).style.background = "oklch(1 0 0 / 0.07)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = "oklch(1 0 0 / 0.22)";
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
