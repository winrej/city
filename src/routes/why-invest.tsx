import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ChevronDown, BedDouble, Umbrella, KeyRound, ArrowRight } from "lucide-react";
import towerImg from "@/assets/tower-exterior.jpg";
import interiorImg from "@/assets/interior-living.jpg";
import { Reveal } from "@/components/site/Reveal";
import { BreadcrumbJsonLd } from "@/components/site/BreadcrumbJsonLd";
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
            "Why real estate, why Philippine property, why condo investments, and why DMCI — explained without the sales pitch.",
        },
        { property: "og:title", content: seo.meta_title || "Why Invest — CityQlo" },
        {
          property: "og:description",
          content:
            seo.meta_description ||
            "Why real estate, why Philippine property, and why DMCI — explained without the sales pitch.",
        },
        { property: "og:url", content: "https://cityqlo.com/why-invest" },
      ],
      links: [
        {
          rel: "canonical",
          href: seo.canonical_path
            ? seo.canonical_path.startsWith("http")
              ? seo.canonical_path
              : `https://cityqlo.com${seo.canonical_path.startsWith("/") ? "" : "/"}${seo.canonical_path}`
            : "https://cityqlo.com/why-invest",
        },
      ],
    };
  },
  component: WhyInvest,
});

// ─── Pillar data labels — hardcoded, not CMS (visual only) ──────────────────
const PILLAR_LABELS = [
  "// ASSET PROFILE: HARD COMPOUNDER",
  "// SUBMARKET RESILIENCE: HIGH",
  "// LIQUIDITY BARRIER: CONTROLLED",
  "// DEVELOPER RETENTION: OPTIMAL",
];

const BENEFIT_LABELS = [
  "// RISK MITIGATION: PESO RESILIENT",
  "// APPRECIATION: INFRASTRUCTURE DRIVEN",
  "// INFLATION COVER: HARD EQUITY",
  "// PORTFOLIO CYCLE: GENERATIONAL ASSET",
];

// ─── Context Strip ───────────────────────────────────────────────────────────
function ContextStrip() {
  const items = ["DMCI Homes Accredited", "No-commission advisory", "Remote OFW support"];
  return (
    <div
      className="w-full px-4 py-2.5 flex items-center justify-center gap-0"
      style={{ background: "oklch(0.21 0.012 252)" }}
    >
      <div className="flex items-center gap-4 flex-wrap justify-center">
        {items.map((item, i) => (
          <span key={item} className="flex items-center gap-4">
            <span
              className="font-mono text-[10px] tracking-[0.18em] uppercase"
              style={{ color: "oklch(1 0 0 / 0.55)" }}
            >
              {item}
            </span>
            {i < items.length - 1 && (
              <span
                aria-hidden
                className="w-1 h-1 rounded-full"
                style={{ background: "oklch(0.74 0.137 79 / 0.5)" }}
              />
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Pillar Card ─────────────────────────────────────────────────────────────
function PillarCard({
  chapter,
  index,
  techLabel,
}: {
  chapter: any;
  index: number;
  techLabel: string;
}) {
  const num = chapter.number || String(index + 1).padStart(2, "0");
  // Extract first sentence as pull-quote
  const sentences = (chapter.description as string).split(/\.\s+/);
  const pullQuote = sentences[0] + ".";
  const rest = sentences.slice(1).join(". ").trim();

  return (
    <Reveal delay={index * 100}>
      <div
        className="group relative rounded-[1.75rem] border border-border bg-background overflow-hidden transition-all duration-700 hover:shadow-lift hover:border-primary/25"
        style={{ transitionTimingFunction: "var(--ease-luxe)" }}
      >
        {/* Decorative large numeral — background */}
        <div
          aria-hidden
          className="absolute top-0 right-0 font-mono font-black leading-none select-none pointer-events-none"
          style={{
            fontSize: "clamp(80px, 12vw, 140px)",
            color: "oklch(0.21 0.012 252 / 0.04)",
            lineHeight: 1,
            transform: "translate(8%, -12%)",
            letterSpacing: "-0.05em",
          }}
        >
          {num}
        </div>

        {/* Gold bottom sweep on hover */}
        <div
          className="absolute bottom-0 left-0 h-[2px] bg-gold w-0 group-hover:w-full transition-all duration-700"
          style={{ transitionTimingFunction: "var(--ease-luxe)" }}
        />

        {/* Hover glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 10% 20%, oklch(0.43 0.20 258 / 0.04) 0%, transparent 60%)",
          }}
        />

        <div className="relative z-10 p-8 md:p-12">
          {/* Header row */}
          <div className="flex items-center gap-3 flex-wrap mb-8">
            <span className="font-mono text-[11px] font-bold tracking-[0.2em] uppercase text-primary bg-primary/5 px-3 py-1 rounded-full">
              PILLAR {num}
            </span>
            <span className="font-mono text-[9px] tracking-widest text-muted-foreground/50 uppercase hidden md:block">
              {techLabel}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-[26px] md:text-[32px] font-extrabold tracking-[-0.03em] text-ink mb-6 leading-tight">
            {chapter.title}
          </h3>

          {/* Pull-quote — first sentence, large */}
          <p
            className="text-[18px] md:text-[20px] font-medium leading-snug text-ink/80 mb-5"
            style={{ letterSpacing: "-0.01em" }}
          >
            {pullQuote}
          </p>

          {/* Rest of description */}
          {rest && <p className="text-[15px] leading-relaxed text-muted-foreground">{rest}</p>}
        </div>
      </div>
    </Reveal>
  );
}

// ─── Empty-state Yield Tool ───────────────────────────────────────────────────
function YieldTool() {
  const strategies = [
    { label: "Short-term (Airbnb)", icon: <BedDouble className="h-5 w-5" strokeWidth={1.75} /> },
    { label: "Staycation", icon: <Umbrella className="h-5 w-5" strokeWidth={1.75} /> },
    { label: "Long-term rental", icon: <KeyRound className="h-5 w-5" strokeWidth={1.75} /> },
  ];

  return (
    <div
      className="rounded-[1.75rem] border border-border overflow-hidden"
      style={{ background: "oklch(0.985 0.002 247)" }}
    >
      {/* Header */}
      <div className="px-8 md:px-12 pt-10 pb-8 border-b border-border">
        <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-3">
          Income Estimator
        </p>
        <h3 className="text-[22px] md:text-[26px] font-bold tracking-tight text-ink">
          How much could your unit earn?
        </h3>
        <p className="mt-3 text-[14px] text-muted-foreground leading-relaxed max-w-md">
          Yield estimates are in preparation. Every situation is different — ask us and we'll work
          through the numbers for your specific unit and location.
        </p>
      </div>

      {/* Strategy rows — empty state */}
      <div className="divide-y divide-border">
        {strategies.map((s) => (
          <div key={s.label} className="flex items-center justify-between px-8 md:px-12 py-6 gap-4">
            <div className="flex items-center gap-4">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-muted-foreground"
                style={{ background: "oklch(1 0 0)" }}
              >
                {s.icon}
              </div>
              <span className="font-semibold text-[15px] text-ink">{s.label}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[13px] text-muted-foreground/60 italic">
                — ask us
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="px-8 md:px-12 py-8 border-t border-border">
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 font-semibold text-[14px] text-primary hover:gap-3 transition-all duration-300"
        >
          Get a personalised income estimate
          <ArrowRight size={15} strokeWidth={2.25} />
        </Link>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
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
    "A field guide to thinking about Philippine property the way long-term owners do — patiently, deliberately, and on your own terms.",
  );
  const chapters = getArrayField(pageSettings.chapters, WHY_INVEST_PAGE_FALLBACK.chapters);
  const benefitsHeading = getTextField(
    pageSettings.benefits_heading,
    "What ownership earns you over time.",
  );
  const benefits = getArrayField(pageSettings.benefits, WHY_INVEST_PAGE_FALLBACK.benefits);
  const rentalHeading = getTextField(
    pageSettings.rental_strategies_heading,
    WHY_INVEST_PAGE_FALLBACK.rental_strategies_heading,
  );
  const rentalDescription = getTextField(
    pageSettings.rental_strategies_description,
    WHY_INVEST_PAGE_FALLBACK.rental_strategies_description,
  );
  const rentalStrategies = getArrayField(
    pageSettings.rental_strategies,
    WHY_INVEST_PAGE_FALLBACK.rental_strategies,
  );
  const rentalDisclaimer = getTextField(
    pageSettings.rental_strategies_disclaimer,
    WHY_INVEST_PAGE_FALLBACK.rental_strategies_disclaimer,
  );
  const faqHeading = getTextField(
    pageSettings.faq_heading,
    "Questions we get asked before people decide.",
  );
  const faqDescription = getTextField(
    pageSettings.faq_description,
    "If yours isn't here, ask us directly.",
  );
  const faqs = getArrayField(pageSettings.faqs, WHY_INVEST_PAGE_FALLBACK.faqs);

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const rentalStrategyIcons = [
    <BedDouble
      key="short-term"
      className="h-6 w-6 text-primary"
      strokeWidth={1.75}
      aria-hidden="true"
    />,
    <Umbrella
      key="staycation"
      className="h-6 w-6 text-primary"
      strokeWidth={1.75}
      aria-hidden="true"
    />,
    <KeyRound
      key="long-term"
      className="h-6 w-6 text-primary"
      strokeWidth={1.75}
      aria-hidden="true"
    />,
  ];

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Why Invest", href: "/why-invest" },
        ]}
      />

      {/* ── Context Strip ── */}
      <ContextStrip />

      {/* ── Cinematic Dark Hero ── */}
      <section
        className="px-4 pb-36 pt-28 md:pt-44 md:pb-48"
        style={{
          background: "oklch(0.21 0.012 252)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Radial glow */}
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
        {/* Grain */}
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
              {/* Gold cursive note */}
              <span
                className="absolute hidden lg:inline-block pointer-events-none opacity-75 text-[26px] tracking-wide rotate-[-3deg] select-none text-gold font-normal"
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
            <p className="lede mt-12 max-w-3xl text-zinc-300 text-shadow-sm">{heroDescription}</p>
          </Reveal>

          {/* Trust signals row — factual, no invented numbers */}
          <Reveal delay={360}>
            <div className="mt-14 flex flex-wrap gap-4">
              {[
                "DMCI Homes Accredited Consultant",
                "No commission pressure on recommendations",
                "End-to-end remote advisory for OFWs",
              ].map((signal) => (
                <span
                  key={signal}
                  className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.14em] uppercase px-4 py-2 rounded-full border"
                  style={{
                    color: "oklch(1 0 0 / 0.6)",
                    borderColor: "oklch(1 0 0 / 0.1)",
                    background: "oklch(1 0 0 / 0.04)",
                  }}
                >
                  <span
                    aria-hidden
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "oklch(0.74 0.137 79 / 0.8)" }}
                  />
                  {signal}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Hero Image Block ── */}
      <section className="px-4 -mt-16 relative z-20">
        <Reveal className="container-wide img-luxe img-luxe-hover overflow-hidden rounded-[1.5rem] shadow-lift">
          <img
            src={towerImg}
            alt="Premium DMCI Homes condominium"
            className="img-luxe h-[68vh] w-full object-cover"
            width={1600}
            height={1920}
            loading="lazy"
          />
        </Reveal>
      </section>

      {/* ── Pillars Section ── */}
      <section className="px-4 section-pad surface relative overflow-hidden">
        {/* Background handwritten note */}
        <span
          className="absolute hidden xl:inline-block pointer-events-none opacity-[0.2] text-[34px] rotate-[-5deg] select-none text-gold"
          style={{ fontFamily: '"Dancing Script", cursive', top: "8%", left: "3%" }}
        >
          Patience yields resilience
        </span>

        <div className="container-wide relative z-10">
          {/* Section header — stacked, not sticky-left (accessible, no scroll-jacking) */}
          <div className="max-w-2xl mb-16 md:mb-20">
            <Reveal>
              <p className="eyebrow">
                <span className="gold-rule" />
                The Pillars
              </p>
              <h2 className="display-2 mt-6">A disciplined path to real estate.</h2>
              <p className="mt-6 text-muted-foreground text-[16px] leading-relaxed">
                Four distinct strategic layers designed to guide your investment decisions without
                the sales noise.
              </p>
            </Reveal>
          </div>

          {/* Pillar cards — stacked on all viewports */}
          <div className="flex flex-col gap-6">
            {chapters.map((c: any, i: number) => (
              <PillarCard
                key={c.number || i}
                chapter={c}
                index={i}
                techLabel={PILLAR_LABELS[i] || ""}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Investment Benefits ── */}
      <section className="px-4 section-pad bg-background relative overflow-hidden">
        {/* Dot grid texture */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, var(--ink) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* Handwritten note */}
        <span
          className="absolute hidden xl:inline-block pointer-events-none opacity-[0.2] text-[34px] rotate-[4deg] select-none text-gold"
          style={{ fontFamily: '"Dancing Script", cursive', bottom: "8%", right: "4%" }}
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

          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {benefits.map((b: any, i: number) => (
              <Reveal key={b.title || i} delay={i * 80}>
                <div
                  className="group relative border border-hairline rounded-[1.5rem] bg-surface p-8 md:p-10 transition-all duration-700 hover:-translate-y-1 hover:shadow-soft overflow-hidden h-full"
                  style={{ transitionTimingFunction: "var(--ease-luxe)" }}
                >
                  <div
                    className="absolute bottom-0 left-0 h-[2px] bg-gold w-0 group-hover:w-full transition-all duration-700"
                    style={{ transitionTimingFunction: "var(--ease-luxe)" }}
                  />

                  <div className="flex items-center gap-4 justify-between mb-6">
                    <span className="font-mono text-[11px] font-semibold tracking-[0.28em] text-muted-foreground/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-[9px] tracking-widest text-muted-foreground/45 uppercase hidden md:block">
                      {BENEFIT_LABELS[i] || ""}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-gold opacity-60 group-hover:scale-150 transition-transform duration-500" />
                  </div>

                  <h3 className="text-[22px] font-bold tracking-[-0.025em] text-ink">{b.title}</h3>
                  <p className="mt-4 text-[15.5px] leading-relaxed text-muted-foreground">
                    {b.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Rental Income Strategies ── */}
      <section className="px-4 section-pad surface relative overflow-hidden">
        <span
          className="absolute hidden xl:inline-block pointer-events-none opacity-[0.2] text-[34px] rotate-[-4deg] select-none text-gold"
          style={{ fontFamily: '"Dancing Script", cursive', top: "10%", right: "4%" }}
        >
          Make it work for you
        </span>

        <div className="container-wide relative z-10">
          <div className="max-w-3xl mb-16">
            <Reveal>
              <p className="eyebrow">
                <span className="gold-rule" />
                Income Strategies
              </p>
              <h2 className="display-2 mt-6">{rentalHeading}</h2>
              <p className="mt-6 text-[16px] leading-relaxed text-muted-foreground">
                {rentalDescription}
              </p>
            </Reveal>
          </div>

          {/* Strategy cards */}
          <div className="grid gap-6 md:grid-cols-3 mb-12">
            {rentalStrategies.map((s: any, i: number) => (
              <Reveal key={s.title || i} delay={i * 100}>
                <div
                  className="group relative flex h-full flex-col rounded-[1.5rem] border border-border bg-background p-8 md:p-10 transition-all duration-700 hover:-translate-y-1 hover:shadow-lift hover:border-primary/30 overflow-hidden"
                  style={{ transitionTimingFunction: "var(--ease-luxe)" }}
                >
                  <div
                    className="absolute bottom-0 left-0 h-[2px] bg-gold w-0 group-hover:w-full transition-all duration-700"
                    style={{ transitionTimingFunction: "var(--ease-luxe)" }}
                  />

                  <div className="flex items-center justify-between mb-7">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-hairline bg-surface transition-colors duration-500 group-hover:border-primary/30">
                      {rentalStrategyIcons[i]}
                    </div>
                    <span className="font-mono text-[11px] font-semibold tracking-[0.28em] text-muted-foreground/50">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="text-[22px] font-bold tracking-[-0.025em] text-ink">{s.title}</h3>
                  <p className="mt-4 flex-1 text-[15.5px] leading-relaxed text-muted-foreground">
                    {s.description}
                  </p>

                  <div className="mt-8 flex items-center gap-2 border-t border-hairline pt-5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70">
                    <span>
                      Effort: <span className="text-ink/70">{s.effort}</span>
                    </span>
                    <span className="text-gold/60">·</span>
                    <span>
                      Yield: <span className="text-ink/70">{s.yield}</span>
                    </span>
                  </div>

                  {s.guide_slug && (
                    <Link
                      to="/guides/$slug"
                      params={{ slug: s.guide_slug }}
                      className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary transition-all duration-300 hover:gap-2.5"
                    >
                      Read the guide
                      <span aria-hidden>→</span>
                    </Link>
                  )}
                </div>
              </Reveal>
            ))}
          </div>

          {/* Disclaimer */}
          <Reveal delay={120}>
            <p className="mb-16 flex items-start gap-2 text-[13px] italic leading-relaxed text-muted-foreground/70">
              <span aria-hidden className="mt-[3px] h-1 w-1 shrink-0 rounded-full bg-gold/70" />
              {rentalDisclaimer}
            </p>
          </Reveal>

          {/* Empty-state yield tool */}
          <Reveal>
            <YieldTool />
          </Reveal>
        </div>
      </section>

      {/* ── Interior Image ── */}
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

      {/* ── FAQs — promoted above CTA ── */}
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
                          : "border-border bg-background/50 hover:bg-background"
                      }`}
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : i)}
                        className="flex w-full items-center justify-between px-6 py-6 md:px-8 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-[1.25rem]"
                        aria-expanded={isOpen}
                      >
                        <span className="text-[17px] font-semibold tracking-[-0.01em] text-ink pr-4">
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
                          maxHeight: isOpen ? "300px" : "0px",
                          opacity: isOpen ? 1 : 0,
                        }}
                      >
                        <p className="px-6 pb-6 md:px-8 md:pb-8 text-[15.5px] leading-relaxed text-muted-foreground">
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

      {/* ── Bespoke CTA — full-bleed, advisory tone ── */}
      <section className="relative overflow-hidden">
        {/* Tower image with dark overlay */}
        <div className="absolute inset-0">
          <img src={towerImg} alt="" aria-hidden className="w-full h-full object-cover" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, oklch(0.21 0.012 252 / 0.88) 0%, oklch(0.21 0.012 252 / 0.94) 100%)",
            }}
          />
        </div>

        {/* Grain */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat",
            backgroundSize: "180px 180px",
          }}
        />

        <div className="relative z-10 container-prose px-4 section-pad text-center">
          <Reveal>
            <p className="eyebrow text-white/50">
              <span className="gold-rule" />
              Next Step
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h2
              className="display-2 mt-8 text-white max-w-3xl mx-auto"
              style={{ textShadow: "0 2px 40px oklch(0 0 0 / 0.4)" }}
            >
              If any of this resonated, the next step is a conversation.
            </h2>
          </Reveal>
          <Reveal delay={240}>
            <p
              className="mt-6 text-[17px] leading-relaxed max-w-xl mx-auto"
              style={{ color: "oklch(1 0 0 / 0.6)" }}
            >
              No commitment. No property pitch. Just your situation, mapped out.
            </p>
          </Reveal>
          <Reveal delay={360}>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-semibold text-[15px] transition-all duration-300 hover:gap-4"
                style={{
                  background: "oklch(0.43 0.2 258)",
                  color: "white",
                  boxShadow: "0 8px 32px oklch(0.43 0.2 258 / 0.45)",
                }}
              >
                Book a free call
                <ArrowRight size={16} strokeWidth={2.25} />
              </Link>
              <Link
                to="/properties"
                search={{} as any}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-[15px] border transition-all duration-300 hover:gap-3"
                style={{
                  color: "oklch(1 0 0 / 0.75)",
                  borderColor: "oklch(1 0 0 / 0.2)",
                  background: "oklch(1 0 0 / 0.05)",
                }}
              >
                Browse properties
                <ArrowRight size={16} strokeWidth={2} />
              </Link>
            </div>
          </Reveal>

          {/* Gold divider */}
          <Reveal delay={480}>
            <div className="mt-14 flex items-center justify-center gap-4">
              <div
                className="h-px w-16 rounded-full"
                style={{
                  background: "linear-gradient(to right, transparent, oklch(0.74 0.137 79 / 0.5))",
                }}
              />
              <span
                className="font-mono text-[10px] tracking-[0.2em] uppercase"
                style={{ color: "oklch(0.74 0.137 79 / 0.7)" }}
              >
                CityQlo Advisory
              </span>
              <div
                className="h-px w-16 rounded-full"
                style={{
                  background: "linear-gradient(to left, transparent, oklch(0.74 0.137 79 / 0.5))",
                }}
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
