import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import towerImg from "@/assets/tower-exterior.jpg";
import interiorImg from "@/assets/interior-living.jpg";
import { ConsultationCTA } from "@/components/site/ConsultationCTA";
import { Reveal } from "@/components/site/Reveal";
import { getSiteSettings } from "../lib/api/admin.functions";
import {
  WHY_INVEST_PAGE_FALLBACK,
  SEO_FALLBACKS,
  getArrayField,
  getTextField,
} from "../lib/marketing-pages";

export const Route = createFileRoute("/why-invest")({
  loader: async ({ context }) => {
    const settings = await context.queryClient
      .ensureQueryData({
        queryKey: ["portal-settings"],
        queryFn: () => getSiteSettings(),
      })
      .catch(() => null);
    return { initialSettings: settings };
  },
  head: ({ loaderData }) => {
    const settings = loaderData?.initialSettings;
    const seoRow = settings?.find((r: any) => r.key === "seo_why_invest")?.value as any;
    const seo = { ...SEO_FALLBACKS.seo_why_invest, ...seoRow };
    return {
      meta: [
        { title: seo.meta_title || "Why Invest — CityQlo" },
        {
          name: "description",
          content:
            seo.meta_description ||
            "Why real estate, why Metro Manila, why condo investments, and why DMCI — explained without the sales pitch.",
        },
        { property: "og:title", content: seo.meta_title || "Why Invest — CityQlo" },
        {
          property: "og:description",
          content:
            seo.meta_description ||
            "Why real estate, why Metro Manila, and why DMCI — explained without the sales pitch.",
        },
        { property: "og:url", content: "/why-invest" },
      ],
      links: [
        {
          rel: "canonical",
          href: seo.canonical_path
            ? seo.canonical_path.startsWith("/")
              ? seo.canonical_path
              : `/${seo.canonical_path}`
            : "/why-invest",
        },
      ],
    };
  },
  component: WhyInvest,
});

function WhyInvest() {
  const { initialSettings } = Route.useLoaderData();
  const { data: siteSettings } = useQuery({
    queryKey: ["portal-settings"],
    queryFn: () => getSiteSettings(),
    initialData: initialSettings ?? undefined,
  });

  const pageSettings = useMemo(() => {
    const row = siteSettings?.find((r: any) => r.key === "page_why_invest");
    return (row?.value ?? WHY_INVEST_PAGE_FALLBACK) as typeof WHY_INVEST_PAGE_FALLBACK;
  }, [siteSettings]);

  const heroEyebrow = getTextField(pageSettings.hero_eyebrow, "Why invest");
  const heroTitle = getTextField(pageSettings.hero_title, "The case for property,");
  const heroHighlight = getTextField(pageSettings.hero_highlight, "made calmly.");
  const heroDescription = getTextField(
    pageSettings.hero_description,
    "A field guide to thinking about Metro Manila real estate the way long-term owners do — patiently, deliberately, and on your own terms.",
  );
  const chapters = getArrayField(pageSettings.chapters, WHY_INVEST_PAGE_FALLBACK.chapters);
  const benefitsHeading = getTextField(
    pageSettings.benefits_heading,
    "What ownership earns you over time.",
  );
  const benefits = getArrayField(pageSettings.benefits, WHY_INVEST_PAGE_FALLBACK.benefits);
  const faqHeading = getTextField(pageSettings.faq_heading, "Honest answers.");
  const faqDescription = getTextField(
    pageSettings.faq_description,
    "If yours is not here, ask us directly.",
  );
  const faqs = getArrayField(pageSettings.faqs, WHY_INVEST_PAGE_FALLBACK.faqs);

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Hardcoded premium structural labels matching the pillars index
  const pillarTechLabels = [
    "// ASSET PROFILE: HARD COMPOUNDER",
    "// SUBMARKET RESILIENCE: HIGH",
    "// LIQUIDITY BARRIER: CONTROLLED",
    "// DEVELOPER RETENTION: OPTIMAL",
  ];

  // Hardcoded premium labels for the benefits section
  const benefitTechLabels = [
    "// RISK MITIGATION: PESO RESILIENT",
    "// APPRECIATION: INFRASTRUCTURE DRIVEN",
    "// INFLATION COVER: HARD EQUITY",
    "// PORTFOLIO CYCLE: GENERATIONAL ASSET",
  ];

  return (
    <>
      {/* Cinematic Dark Hero */}
      <section
        className="px-4 pb-36 pt-32 md:pt-48 md:pb-48"
        style={{
          background: "oklch(0.21 0.012 252)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Radial glow accent */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 70% 70% at 50% 60%, oklch(0.43 0.20 258 / 0.13) 0%, transparent 80%)",
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

        <div className="container-prose relative z-10">
          <Reveal>
            <p className="eyebrow text-white/50">
              <span className="gold-rule" />
              {heroEyebrow}
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="display-1 mt-10 max-w-5xl text-white text-shadow-hero relative">
              {heroTitle}
              <span className="block text-primary text-shadow-sub">{heroHighlight}</span>

              {/* Gold cursive note floating on hero header */}
              <span
                className="absolute hidden lg:inline-block pointer-events-none opacity-80 text-[26px] tracking-wide rotate-[-3deg] select-none text-gold font-normal"
                style={{
                  fontFamily: '"Dancing Script", cursive',
                  bottom: "-10px",
                  right: "12%",
                }}
              >
                ~ A field guide to compounding
              </span>
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <p className="lede mt-12 max-w-3xl text-zinc-300 text-shadow-sm">
              {heroDescription}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Hero Image Block */}
      <section className="px-4 -mt-16 relative z-20">
        <Reveal className="container-wide img-luxe img-luxe-hover overflow-hidden rounded-[1.5rem] shadow-lift">
          <img
            src={towerImg}
            alt="Premium Metro Manila condominium"
            className="img-luxe h-[68vh] w-full object-cover"
            width={1600}
            height={1920}
            loading="lazy"
          />
        </Reveal>
      </section>

      {/* Chapters / Pillars Section */}
      <section className="px-4 section-pad surface relative overflow-hidden">
        {/* Background handwritten gold note */}
        <span
          className="absolute hidden xl:inline-block pointer-events-none opacity-[0.25] text-[34px] rotate-[-5deg] select-none text-gold"
          style={{
            fontFamily: '"Dancing Script", cursive',
            top: "8%",
            left: "3%",
          }}
        >
          Patience yields resilience
        </span>

        <div className="container-wide grid gap-16 lg:grid-cols-12 relative z-10">
          {/* Sticky Left Title */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 lg:h-fit">
            <Reveal>
              <p className="eyebrow">
                <span className="gold-rule" />
                The Pillars
              </p>
              <h2 className="display-2 mt-6">A disciplined path to real estate.</h2>
              <p className="mt-6 text-muted-foreground text-[16px] leading-relaxed">
                Four distinct strategic layers designed to guide your investment decisions without the
                sales noise.
              </p>
            </Reveal>
          </div>

          {/* Chapters Cards */}
          <div className="lg:col-span-7 lg:col-start-6 flex flex-col gap-8">
            {chapters.map((c: any, i: number) => (
              <Reveal key={c.number || i} delay={i * 100}>
                <div
                  className="group relative rounded-[1.5rem] border border-border bg-background p-8 md:p-12 transition-all duration-700 hover:shadow-lift hover:border-primary/30 overflow-hidden"
                  style={{ transitionTimingFunction: "var(--ease-luxe)" }}
                >
                  {/* Subtle hover gradient */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[1.5rem]"
                    style={{
                      background:
                        "radial-gradient(circle at 10% 20%, oklch(0.43 0.20 258 / 0.03) 0%, transparent 50%)",
                      transitionTimingFunction: "var(--ease-luxe)",
                    }}
                  />

                  {/* Hover-expanding gold line animation */}
                  <div
                    className="absolute bottom-0 left-0 h-[2px] bg-gold w-0 group-hover:w-full transition-all duration-700"
                    style={{ transitionTimingFunction: "var(--ease-luxe)" }}
                  />

                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="font-mono text-xs font-semibold tracking-[0.2em] text-primary bg-primary/5 px-3 py-1 rounded-full">
                          PILLAR {c.number || String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="font-mono text-[10px] tracking-widest text-muted-foreground/60 uppercase">
                          {pillarTechLabels[i] || ""}
                        </span>
                      </div>
                      <h3 className="text-[24px] md:text-[28px] font-bold tracking-[-0.025em] text-ink mt-6">
                        {c.title}
                      </h3>
                      <p className="mt-4 text-[16px] leading-relaxed text-muted-foreground max-w-2xl">
                        {c.description}
                      </p>
                    </div>

                    <div className="hidden md:flex h-12 w-12 items-center justify-center rounded-full border border-border text-muted-foreground group-hover:text-primary group-hover:border-primary/30 transition-all duration-500">
                      <span className="text-sm font-semibold">
                        {c.number || String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Benefits */}
      <section className="px-4 section-pad bg-background relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, var(--ink) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Float handwritten note on the benefits side */}
        <span
          className="absolute hidden xl:inline-block pointer-events-none opacity-[0.25] text-[34px] rotate-[4deg] select-none text-gold"
          style={{
            fontFamily: '"Dancing Script", cursive',
            bottom: "8%",
            right: "4%",
          }}
        >
          Built for generations
        </span>

        <div className="container-prose relative z-10">
          <div className="max-w-3xl">
            <Reveal>
              <p className="eyebrow">
                <span className="gold-rule" />
                Wealth Creation
              </p>
              <h2 className="display-2 mt-6">{benefitsHeading}</h2>
            </Reveal>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {benefits.map((b: any, i: number) => (
              <Reveal key={b.title || i} delay={i * 80}>
                <div
                  className="group relative border border-hairline rounded-[1.5rem] bg-surface p-8 md:p-10 transition-all duration-700 hover:-translate-y-1 hover:shadow-soft overflow-hidden"
                  style={{ transitionTimingFunction: "var(--ease-luxe)" }}
                >
                  {/* Hover-expanding gold line animation */}
                  <div
                    className="absolute bottom-0 left-0 h-[2px] bg-gold w-0 group-hover:w-full transition-all duration-700"
                    style={{ transitionTimingFunction: "var(--ease-luxe)" }}
                  />

                  <div className="flex items-center gap-4 justify-between">
                    <span className="font-mono text-[11px] font-semibold tracking-[0.28em] text-muted-foreground/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-[9px] tracking-widest text-muted-foreground/50 uppercase">
                      {benefitTechLabels[i] || ""}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-gold opacity-60 group-hover:scale-150 transition-transform duration-500" />
                  </div>
                  <h3 className="mt-6 text-[24px] font-bold tracking-[-0.025em] text-ink">
                    {b.title}
                  </h3>
                  <p className="mt-4 text-[16px] leading-relaxed text-muted-foreground">
                    {b.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Interior Image Block */}
      <section className="px-4 relative z-20">
        <Reveal className="container-wide img-luxe img-luxe-hover overflow-hidden rounded-[1.5rem] shadow-lift">
          <img
            src={interiorImg}
            alt="Refined Manila condo interior"
            className="img-luxe h-[60vh] w-full object-cover"
            width={1920}
            height={1280}
            loading="lazy"
          />
        </Reveal>
      </section>

      {/* FAQs Section */}
      <section className="px-4 section-pad surface">
        <div className="container-wide grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal>
              <p className="eyebrow">
                <span className="gold-rule" />
                Common Questions
              </p>
              <h2 className="display-2 mt-6">{faqHeading}</h2>
              <p className="mt-6 text-[16px] leading-relaxed text-muted-foreground">
                {faqDescription}
              </p>
              <div className="mt-10">
                <Link to="/contact" className="link-quiet hover:border-ink">
                  Ask a custom question <span aria-hidden>→</span>
                </Link>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <div className="flex flex-col gap-4">
              {faqs.map((f: any, i: number) => {
                const isOpen = openFaq === i;
                return (
                  <Reveal key={f.question || i} delay={i * 60}>
                    <div
                      className={`border rounded-[1.25rem] transition-all duration-500 ${
                        isOpen
                          ? "border-primary/30 bg-background shadow-soft"
                          : "border-border bg-background/50 hover:bg-background hover:border-border-hover"
                      }`}
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : i)}
                        className="flex w-full items-center justify-between px-6 py-6 md:px-8 text-left focus:outline-none"
                        aria-expanded={isOpen}
                      >
                        <span className="text-[18px] font-semibold tracking-[-0.01em] text-ink pr-4">
                          {f.question}
                        </span>
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-all duration-500 ${
                            isOpen ? "bg-primary text-white border-primary rotate-180" : ""
                          }`}
                        >
                          <ChevronDown size={16} />
                        </div>
                      </button>

                      <div
                        className="overflow-hidden transition-all duration-500 ease-in-out"
                        style={{
                          maxHeight: isOpen ? "200px" : "0px",
                          opacity: isOpen ? 1 : 0,
                        }}
                      >
                        <p className="px-6 pb-6 md:px-8 md:pb-8 text-[16px] leading-relaxed text-muted-foreground">
                          {f.answer}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <ConsultationCTA />
    </>
  );
}
