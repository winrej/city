import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ChevronDown,
  MapPin,
  Building2,
  Wallet,
  CalendarCheck,
  Waves,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { Reveal } from "@/components/site/Reveal";
import { ConsultationCTA } from "@/components/site/ConsultationCTA";
import { BreadcrumbJsonLd } from "@/components/site/BreadcrumbJsonLd";
import { VirtualTourSection } from "@/components/site/VirtualTourSection";
import { DocSidebar, MobileTocBar, type TocGroup } from "@/components/site/SectionNav";
// TODO: replace with a real Sonora Garden Residences hero image when available.
import heroImg from "@/assets/tower-exterior.jpg";

const CANONICAL = "https://cityqlo.com/sonora-garden-residences";
const OG_IMAGE = "https://cityqlo.com/rfo.png";

const META_TITLE = "Sonora Garden Residences Las Piñas | DMCI Homes Condo Price & Floor Plans";
const META_DESCRIPTION =
  "Get the official Sonora Garden Residences price list, floor plans, and promo updates (2026). Explore units (1BR–3BR), resort amenities, and payment options for this DMCI Homes condo in Las Piñas.";

export const Route = createFileRoute("/sonora-garden-residences")({
  head: () => ({
    meta: [
      { title: META_TITLE },
      { name: "description", content: META_DESCRIPTION },
      {
        name: "keywords",
        content:
          "Sonora Garden Residences, DMCI Homes Las Piñas, Sonora Garden Residences price, Sonora Garden Residences Las Piñas, RFO condo Las Piñas, condo near Robinsons Place Las Piñas, Cadence tower, Stellan tower, Liran tower",
      },
      { property: "og:title", content: META_TITLE },
      { property: "og:description", content: META_DESCRIPTION },
      { property: "og:url", content: CANONICAL },
      { property: "og:type", content: "article" },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:site_name", content: "CityQlo" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: META_TITLE },
      { name: "twitter:description", content: META_DESCRIPTION },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
  }),
  component: SonoraPillarPage,
});

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const FAST_FACTS = [
  { icon: Building2, label: "Developer", value: "DMCI Homes × Robinsons Land" },
  { icon: MapPin, label: "Location", value: "Alabang–Zapote Rd, Las Piñas" },
  { icon: CalendarCheck, label: "Status", value: "Ready for Occupancy (RFO)" },
  { icon: Wallet, label: "Price range", value: "₱4.55M – ₱11.2M" },
  { icon: Building2, label: "Towers", value: "3 (Cadence · Stellan · Liran)" },
  { icon: Waves, label: "Theme", value: "Resort-inspired living" },
];

const TOWERS = [
  {
    name: "Cadence",
    storeys: "40 storeys (high-rise)",
    status: "Ready for Occupancy — first tower turned over",
    note: "The flagship tower and the first to be completed, with amenities and model units already inaugurated.",
  },
  {
    name: "Stellan",
    storeys: "41 storeys (high-rise)",
    status: "In development",
    note: "The tallest of the three towers, continuing the resort-garden masterplan.",
  },
  {
    name: "Liran",
    storeys: "15 storeys (mid-rise)",
    status: "In development",
    note: "A lower-density mid-rise option within the same gated community.",
  },
];

const UNITS = [
  {
    type: "1-Bedroom",
    area: "≈ 28 – 45 sqm",
    from: "from ₱4.55M",
    ideal: "Young professionals, OFW starter investment, rental units",
  },
  {
    type: "2-Bedroom",
    area: "≈ 56 – 65.5 sqm",
    from: "mid-range",
    ideal: "Small families, upgraders, work-from-home couples",
  },
  {
    type: "3-Bedroom",
    area: "≈ 81.5 sqm",
    from: "up to ₱11.2M",
    ideal: "Growing families needing space near the South business corridor",
  },
];

const AMENITY_GROUPS = [
  {
    group: "Water & leisure",
    items: ["Lap pool", "Leisure / lounge pool", "Kiddie pool", "Elevated roof garden"],
  },
  {
    group: "Active & indoor",
    items: [
      "Fitness gym",
      "Indoor multi-purpose wooden court",
      "Game area",
      "Entertainment room",
      "Sky lounge & bar area",
    ],
  },
  {
    group: "Family & outdoor",
    items: ["Children's play area", "Picnic / open lounge spots", "Landscaped garden atriums"],
  },
  {
    group: "Everyday services",
    items: [
      "Convenience store & water station",
      "Card-operated laundry station",
      "12 dual-core high-speed elevators",
      "Integrated WiFi & fiber-optic ready",
    ],
  },
  {
    group: "Security & utilities",
    items: [
      "Guarded gate & 24/7 security",
      "CCTV in common areas",
      "Standby power in units & common areas",
      "DMCI Homes Property Management",
    ],
  },
];

const PROS = [
  "Direct, covered access to Robinsons Place Las Piñas — mall, supermarket, dining at your doorstep.",
  "Ready for Occupancy: no construction wait for the Cadence tower — move in or rent out now.",
  "Resort-grade amenities (lap pool, sky lounge, roof garden) at a South-Metro price point.",
  "Backed by DMCI Homes' build quality and in-house property management.",
  "Positioned to benefit from the LRT-1 Cavite Extension and the South corridor's infrastructure surge.",
  "Larger-than-average unit cuts with balconies on every unit.",
];

const CONS = [
  "Alabang–Zapote Road traffic can be heavy at peak hours — factor in your commute.",
  "High-rise resort communities carry monthly association dues on top of amortization.",
  "Two of the three towers (Stellan, Liran) are still being developed.",
  "Las Piñas is south of the Makati/BGC CBDs — long-haul commuters should test the drive first.",
];

const BUY_STEPS = [
  {
    step: "Shortlist your unit",
    detail:
      "Decide on tower (Cadence is RFO), unit type (1BR–3BR), floor level, and view. We can send the live price list and available inventory.",
  },
  {
    step: "Reserve the unit",
    detail:
      "Pay the reservation fee to lock the unit and price. This freezes your slot while documents are prepared.",
  },
  {
    step: "Submit requirements",
    detail:
      "Provide valid IDs, proof of income, and the buyer information sheet. OFWs can transact remotely via SPA.",
  },
  {
    step: "Settle the down payment",
    detail:
      "DMCI's spread-out down payment is paid over the term — no need for a lump sum. Sample plans start around ₱22,000+/month.",
  },
  {
    step: "Choose your balance option",
    detail:
      "Settle the balance via bank financing, in-house financing, Pag-IBIG, or spot cash. We help you compare amortizations.",
  },
  {
    step: "Move in or turn over to a tenant",
    detail:
      "For RFO units, acceptance and turnover follow once payments clear — ready to occupy or lease out.",
  },
];

const COMPARISON = [
  {
    factor: "Status",
    sonora: "RFO (Cadence) — move-in ready",
    typical: "Often pre-selling, 3–5 yr wait",
  },
  {
    factor: "Mall access",
    sonora: "Direct link to Robinsons Place Las Piñas",
    typical: "Drive or commute to the nearest mall",
  },
  {
    factor: "Amenities",
    sonora: "Resort cluster: lap pool, sky lounge, roof garden",
    typical: "Standard pool + gym",
  },
  {
    factor: "Developer",
    sonora: "DMCI Homes × Robinsons Land JV",
    typical: "Single developer, varied track record",
  },
  {
    factor: "Unit sizes",
    sonora: "Larger cuts, balcony on every unit",
    typical: "Compact cuts, balcony optional",
  },
  {
    factor: "Entry price",
    sonora: "From ₱4.55M (South-Metro value)",
    typical: "Higher per sqm in Makati / BGC / Ortigas",
  },
];

const FAQS = [
  {
    q: "Who is the developer of Sonora Garden Residences?",
    a: "Sonora Garden Residences is a joint-venture development by DMCI Homes and Robinsons Land Corporation. DMCI Homes leads construction and property management, bringing its resort-inspired design philosophy and in-house maintenance through DMCI Homes Property Management Corporation.",
  },
  {
    q: "Where is Sonora Garden Residences located?",
    a: "It sits along Alabang–Zapote Road in Talon Uno, Las Piñas City, Metro Manila — directly beside and connected to Robinsons Place Las Piñas. The location places residents minutes from Parañaque, Alabang, and the Cavite gateway.",
  },
  {
    q: "How much is a unit at Sonora Garden Residences?",
    a: "As of June 2026, prices range from about ₱4.55M to ₱11.2M depending on unit type, floor level, and tower. One-bedroom units start at roughly ₱4.55M, with monthly plans starting around ₱22,000+. Because developer pricing changes per release, request the current official price list for exact figures.",
  },
  {
    q: "Is Sonora Garden Residences Ready for Occupancy (RFO)?",
    a: "Yes — the Cadence tower, the first of the three buildings, has been completed and is offered as Ready for Occupancy. The Stellan and Liran towers are part of the same masterplan and are in later phases of development.",
  },
  {
    q: "What unit types are available?",
    a: "Sonora offers one-bedroom, two-bedroom, and three-bedroom units. Floor areas are generous for the segment — roughly 28–45 sqm for 1BR, 56–65.5 sqm for 2BR, and around 81.5 sqm for 3BR — and every unit includes a balcony.",
  },
  {
    q: "What amenities does Sonora Garden Residences have?",
    a: "Residents enjoy resort-inspired amenities including a lap pool, leisure pool, kiddie pool, elevated roof garden, sky lounge, fitness gym, indoor multi-purpose court, entertainment room, children's play area, convenience store, card-operated laundry, and 24/7 security with CCTV and standby power.",
  },
  {
    q: "How many towers does Sonora Garden Residences have?",
    a: "There are three towers — Cadence (40 storeys), Stellan (41 storeys), and Liran (15-storey mid-rise) — set on a roughly 14,492 sqm property designed around landscaped, resort-style common areas.",
  },
  {
    q: "Is Sonora Garden Residences a good investment?",
    a: "It is well-positioned for both end-use and rental. Its direct mall connection, RFO status, and the South corridor's infrastructure growth — including the LRT-1 Cavite Extension — support steady rental demand from professionals and families working in Las Piñas, Parañaque, and Alabang. As with any property, verify current pricing and projected yields before committing.",
  },
  {
    q: "Can OFWs buy Sonora Garden Residences remotely?",
    a: "Yes. Overseas Filipino workers can reserve and purchase remotely by appointing a representative through a Special Power of Attorney (SPA) and submitting documents digitally. CityQlo can guide OFW buyers through the entire process online.",
  },
  {
    q: "What are the payment terms?",
    a: "DMCI Homes typically spreads the down payment across the payment term instead of requiring a large lump sum, with the balance settled via bank financing, in-house financing, Pag-IBIG, or spot cash. We can prepare a personalized computation based on your preferred unit and term.",
  },
  {
    q: "How far is Sonora Garden Residences from the airport and CBDs?",
    a: "The development is roughly a 15–20 minute drive from NAIA (traffic permitting) and is connected via Alabang–Zapote Road and the Manila–Cavite Expressway toward Mak, Alabang, and Cavite. The upcoming LRT-1 Cavite Extension is set to further improve access.",
  },
  {
    q: "How do I get the official price list and reserve a unit?",
    a: "Request the latest price list and availability through the form on this page or via Messenger. A CityQlo advisor will send the current computation, walk you through unit options, and assist with reservation and documentation.",
  },
];

/* ------------------------------------------------------------------ */
/* JSON-LD structured data                                             */
/* ------------------------------------------------------------------ */

function StructuredData() {
  const realEstate = {
    "@context": "https://schema.org",
    "@type": "ApartmentComplex",
    name: "Sonora Garden Residences",
    description: META_DESCRIPTION,
    url: CANONICAL,
    image: OG_IMAGE,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Alabang–Zapote Road, Talon Uno",
      addressLocality: "Las Piñas",
      addressRegion: "Metro Manila",
      addressCountry: "PH",
    },
    numberOfRooms: "1-3",
    amenityFeature: AMENITY_GROUPS.flatMap((g) =>
      g.items.map((name) => ({ "@type": "LocationFeatureSpecification", name, value: true })),
    ),
    makesOffer: {
      "@type": "Offer",
      priceCurrency: "PHP",
      lowPrice: 4556000,
      highPrice: 11208000,
      priceRange: "₱4,556,000 – ₱11,208,000",
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "DMCI Homes" },
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: "Sonora Garden Residences — 360° Virtual Property Tour",
    description:
      "Immersive 360° virtual tour of Sonora Garden Residences by DMCI Homes in Las Piñas — walk the property, amenities, and 1BR–3BR units including a furnished 3-bedroom model unit.",
    thumbnailUrl: [OG_IMAGE],
    uploadDate: "2026-06-01",
    contentUrl: CANONICAL,
    embedUrl: "https://dmcihomes.viewin360.co/share/collection/7bGzp",
    publisher: {
      "@type": "Organization",
      name: "CityQlo",
      logo: { "@type": "ImageObject", url: "https://cityqlo.com/Logo.png" },
    },
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Sonora Garden Residences by DMCI Homes — The Complete 2026 Guide",
    description: META_DESCRIPTION,
    image: OG_IMAGE,
    author: { "@type": "Organization", name: "CityQlo" },
    publisher: {
      "@type": "Organization",
      name: "CityQlo",
      logo: { "@type": "ImageObject", url: "https://cityqlo.com/Logo.png" },
    },
    mainEntityOfPage: CANONICAL,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(realEstate) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const TOC_GROUPS: TocGroup[] = [
  {
    label: "Overview",
    items: [
      { id: "overview", label: "What is Sonora Garden Residences?" },
      { id: "developer", label: "Why DMCI Homes" },
    ],
  },
  {
    label: "Pricing & Layouts",
    items: [
      { id: "units", label: "Unit types & floor areas" },
      { id: "price", label: "Price list & computation" },
      { id: "financing", label: "Financing options" },
    ],
  },
  {
    label: "Amenities & Location",
    items: [
      { id: "location", label: "Location & accessibility" },
      { id: "towers", label: "The three towers" },
      { id: "amenities", label: "Amenities" },
      { id: "tour", label: "Virtual tour (360°)" },
    ],
  },
  {
    label: "Buyer Guide",
    items: [
      { id: "who", label: "Who it's for" },
      { id: "investment", label: "Investment potential" },
      { id: "pros-cons", label: "Pros & cons" },
      { id: "how-to-buy", label: "How to buy" },
      { id: "checklist", label: "Before you buy: checklist" },
      { id: "comparison", label: "How it compares" },
      { id: "faq", label: "FAQ" },
    ],
  },
];

function SonoraPillarPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      <BreadcrumbJsonLd
        items={[{ name: "Home", href: "/" }, { name: "Sonora Garden Residences" }]}
      />
      <StructuredData />

      {/* ===================== HERO ===================== */}
      <section
        className="relative overflow-hidden px-4 pb-28 pt-32 md:pb-36 md:pt-44"
        style={{ background: "oklch(0.21 0.012 252)" }}
      >
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to bottom, oklch(0.21 0.012 252 / 0.86), oklch(0.21 0.012 252 / 0.96)), url(${heroImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="container-prose relative z-10">
          <Reveal>
            <p className="eyebrow text-white/50">
              <span className="gold-rule" />
              DMCI Homes · Las Piñas · Ready for Occupancy
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="display-1 mt-8 max-w-4xl text-white text-shadow-hero">
              Sonora Garden Residences
              <span className="block text-primary">Modern resort living in Las Piñas.</span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="lede mt-8 max-w-2xl text-white/70">
              The complete, independent guide to DMCI Homes &amp; Robinsons Land's resort-inspired
              condominium — pricing, floor plans, amenities, location, and everything you need to
              decide with confidence.
            </p>
          </Reveal>

          {/* Fast facts band */}
          <Reveal delay={280}>
            <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] sm:grid-cols-3">
              {FAST_FACTS.map((f) => (
                <div key={f.label} className="bg-white/[0.03] p-5">
                  <f.icon className="h-5 w-5 text-primary" strokeWidth={1.75} />
                  <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/40">
                    {f.label}
                  </p>
                  <p className="mt-1 text-[14px] font-semibold text-white">{f.value}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={360}>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href="#lead"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[13px] font-bold tracking-wide text-ink transition-all duration-500 hover:-translate-y-0.5"
                style={{ transitionTimingFunction: "var(--ease-luxe)" }}
              >
                Get the official price list <ArrowRight size={16} />
              </a>
              <Link
                to="/projects/$slug"
                params={{ slug: "sonora-garden-residences" }}
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/40 px-7 py-3.5 text-[13px] font-bold tracking-wide text-white transition-all duration-500 hover:border-white hover:bg-white/10"
              >
                View units & schedule a viewing
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== QUICK ANSWER ===================== */}
      <section className="px-4 pt-16 md:pt-24">
        <div className="container-prose">
          <Reveal>
            <div className="rounded-2xl border border-hairline bg-secondary/40 p-6 md:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                In short
              </p>
              <p className="mt-3 text-[17px] leading-relaxed text-ink md:text-[19px]">
                <strong>Sonora Garden Residences</strong> is a resort-inspired,{" "}
                <strong>Ready-for-Occupancy</strong> condominium by{" "}
                <strong>DMCI Homes and Robinsons Land</strong> on Alabang–Zapote Road in{" "}
                <strong>Las Piñas</strong>, directly connected to Robinsons Place Las Piñas. It
                offers <strong>1BR–3BR units</strong> across three towers (Cadence, Stellan, Liran),
                priced from about <strong>₱4.55M to ₱11.2M</strong>, with lap pools, a sky lounge,
                and a roof garden — built for South-Metro end-users and investors.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== TOC (mobile) ===================== */}
      <MobileTocBar groups={TOC_GROUPS} />

      {/* ===================== BODY ===================== */}
      <div className="px-4 py-16 md:py-24">
        <div className="container-prose grid grid-cols-1 gap-x-10 md:grid-cols-[200px_minmax(0,1fr)] xl:grid-cols-[264px_minmax(0,1fr)] xl:gap-x-12">
          <aside className="hidden md:block">
            <DocSidebar groups={TOC_GROUPS} contentId="doc-content" />
          </aside>
          <article id="doc-content" className="min-w-0 space-y-20 md:max-w-[46rem]">
            {/* Overview */}
            <Section
              id="overview"
              eyebrow="Sonora Garden Residences Overview"
              title="Sonora Garden Residences by DMCI Homes & Robinsons Land"
            >
              <p>
                Sonora Garden Residences is a resort-inspired, high-rise condominium community
                developed as a joint venture between <strong>DMCI Homes</strong> — one of the
                Philippines' most trusted developers and builders — and{" "}
                <strong>Robinsons Land Corporation</strong>, the property arm of the Gokongwei
                group. The collaboration pairs DMCI's signature lush, low-density "Lumiventt" design
                philosophy with Robinsons Land's retail ecosystem, anchored by the adjacent
                Robinsons Place Las Piñas mall.
              </p>
              <p>
                Set on roughly <strong>14,492 square meters</strong> along the busy Alabang–Zapote
                corridor, the masterplan is organized around landscaped garden atriums and
                resort-style common areas rather than a single dense slab. The result is a community
                that feels like a vacation property you can live in year-round — pools, a roof
                garden, and breathable shared spaces woven between the towers.
              </p>
              <p>
                The development comprises three towers — <strong>Cadence</strong>,{" "}
                <strong>Stellan</strong>, and <strong>Liran</strong> — offering one-, two-, and
                three-bedroom units. The flagship Cadence tower is already complete and offered as{" "}
                <strong>Ready for Occupancy (RFO)</strong>, meaning buyers can move in or begin
                earning rental income without the multi-year wait typical of pre-selling projects.
              </p>
              <p>
                For Filipino professionals, growing families, and overseas Filipino workers (OFWs)
                who want a quality home in the South of Metro Manila — close to malls, schools, and
                the Cavite gateway — Sonora positions itself as a rare blend of resort lifestyle,
                ready inventory, and accessible pricing.
              </p>
            </Section>

            {/* Location */}
            <Section
              id="location"
              eyebrow="Las Piñas Location"
              title="Location & Accessibility of Sonora Garden Residences along Alabang–Zapote Road"
            >
              <p>
                Yes — for South-Metro living, the location is one of Sonora's strongest selling
                points. The community sits directly on <strong>Alabang–Zapote Road</strong> in{" "}
                <strong>Talon Uno, Las Piñas City</strong>, and connects straight into{" "}
                <strong>Robinsons Place Las Piñas</strong>. That means a full mall — supermarket,
                cinemas, restaurants, banks, and clinics — is effectively part of your address,
                reachable on foot and under cover.
              </p>
              <p>The address places residents within a short drive of several key destinations:</p>
              <ul className="my-4 space-y-2">
                <li>
                  <strong>NAIA (airport):</strong> roughly 15–20 minutes by car, traffic permitting
                  — a major plus for OFWs and frequent travelers.
                </li>
                <li>
                  <strong>Alabang &amp; Filinvest City:</strong> a quick hop along Alabang–Zapote
                  for offices, hospitals (Asian Hospital), and Festival Mall.
                </li>
                <li>
                  <strong>Parañaque &amp; the Bay Area:</strong> accessible via the Manila–Cavite
                  Expressway (CAVITEX) and Coastal Road.
                </li>
                <li>
                  <strong>Cavite:</strong> Sonora is a natural gateway home for buyers working in
                  Metro Manila but rooted in the south.
                </li>
                <li>
                  <strong>Schools:</strong> proximity to established Las Piñas and Parañaque
                  campuses makes it practical for families.
                </li>
              </ul>
              <p>
                Crucially, the area is on the upswing. The <strong>LRT-1 Cavite Extension</strong> —
                which extends the light rail line from Pasay through Parañaque and Las Piñas toward
                Cavite — is set to dramatically improve public-transport access along this corridor,
                a structural tailwind for both convenience and long-term property values. The one
                honest caveat: like much of Metro Manila, Alabang–Zapote Road carries real rush-hour
                traffic, so commuters to Makati or BGC should test the drive before committing.
              </p>
            </Section>

            {/* Towers */}
            <Section
              id="towers"
              eyebrow="Towers & Layout"
              title="Towers of Sonora Garden Residences: Cadence, Stellan & Liran"
            >
              <p>
                Sonora Garden Residences is composed of three distinct towers, each with its own
                character but sharing the same gated, amenity-rich grounds. Together they form a mix
                of high-rise and mid-rise living on a single resort masterplan.
              </p>
              <div className="my-6 space-y-4">
                {TOWERS.map((t) => (
                  <div key={t.name} className="rounded-xl border border-hairline p-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="text-[18px] font-bold text-ink">{t.name}</h3>
                      <span className="text-[12px] font-semibold text-primary">{t.storeys}</span>
                    </div>
                    <p className="mt-1 text-[13px] font-medium text-emerald-600">{t.status}</p>
                    <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
                      {t.note}
                    </p>
                  </div>
                ))}
              </div>
              <p>
                Because <strong>Cadence is already RFO</strong>, it is the focus for buyers who want
                to move in or lease out immediately. Stellan and Liran extend the community in later
                phases — useful to know if you are choosing between a ready unit today and a
                future-phase unit.
              </p>
            </Section>

            {/* Units */}
            <Section
              id="units"
              eyebrow="Sonora Floor Plans"
              title="Sonora Garden Residences Unit Layouts & Floor Plans"
            >
              <p>
                Sonora offers one-, two-, and three-bedroom configurations, and the cuts are notably
                generous for the price segment — every unit comes with a <strong>balcony</strong>,
                and the development is marketed around larger doors, windows, and living areas than
                the typical mass-market condo.
              </p>
              <div className="my-6 overflow-x-auto">
                <table className="w-full border-collapse text-left text-[14px]">
                  <thead>
                    <tr className="border-b border-ink/15">
                      <th className="py-3 pr-4 font-semibold text-ink">Unit type</th>
                      <th className="py-3 pr-4 font-semibold text-ink">Approx. floor area</th>
                      <th className="py-3 pr-4 font-semibold text-ink">Price guide</th>
                      <th className="py-3 font-semibold text-ink">Ideal for</th>
                    </tr>
                  </thead>
                  <tbody>
                    {UNITS.map((u) => (
                      <tr key={u.type} className="border-b border-hairline align-top">
                        <td className="py-3 pr-4 font-semibold text-ink">{u.type}</td>
                        <td className="py-3 pr-4 text-muted-foreground">{u.area}</td>
                        <td className="py-3 pr-4 text-muted-foreground">{u.from}</td>
                        <td className="py-3 text-muted-foreground">{u.ideal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[13px] italic text-muted-foreground">
                Floor areas and prices are indicative as of June 2026 and vary by tower, floor
                level, and view. Exact unit dimensions and the official price list are confirmed per
                release — request the current sheet for the unit you have in mind.
              </p>
            </Section>

            {/* Price */}
            <Section
              id="price"
              eyebrow="DMCI Price Guide"
              title="Sonora Garden Residences Price List & Computations (2026)"
            >
              <p>
                As of <strong>June 2026</strong>, units at Sonora Garden Residences range from
                roughly <strong>₱4.55 million to ₱11.2 million</strong>, depending on unit type,
                floor level, and tower. Entry-level one-bedroom units begin around{" "}
                <strong>₱4.55M</strong>, with sample monthly plans starting near{" "}
                <strong>₱22,000+ per month</strong> under DMCI's spread-out payment scheme.
              </p>
              <div className="my-6 overflow-x-auto">
                <table className="w-full border-collapse text-left text-[14px]">
                  <thead>
                    <tr className="border-b border-ink/15">
                      <th className="py-3 pr-4 font-semibold text-ink">Item</th>
                      <th className="py-3 font-semibold text-ink">Indicative figure</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Price range", "₱4.55M – ₱11.2M"],
                      ["Starting price (1BR)", "≈ ₱4,556,000"],
                      ["Sample monthly start", "≈ ₱22,000+ / month"],
                      ["Reservation fee", "Confirmed per current promo"],
                      ["Down payment", "Spread across the payment term"],
                      ["Balance options", "Bank / in-house / Pag-IBIG / cash"],
                    ].map(([k, v]) => (
                      <tr key={k} className="border-b border-hairline">
                        <td className="py-3 pr-4 font-semibold text-ink">{k}</td>
                        <td className="py-3 text-muted-foreground">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>
                The headline advantage of DMCI's terms is the{" "}
                <strong>spread-out down payment</strong>: instead of producing a large lump sum
                upfront, the down payment is amortized across the term, making a resort-grade unit
                attainable on a professional's or OFW's monthly budget. The remaining balance can
                then be settled through bank financing, in-house financing, Pag-IBIG, or spot cash.
              </p>
              <div className="my-6 rounded-xl border border-primary/30 bg-primary/5 p-5">
                <p className="text-[14px] text-ink">
                  <strong>Want an exact computation?</strong> Developer pricing updates with each
                  release and promo. Tell us your preferred unit and term, and we'll send a
                  personalized Sonora computation —{" "}
                  <a href="#lead" className="font-semibold text-primary underline">
                    request it here
                  </a>
                  .
                </p>
              </div>
            </Section>

            {/* Financing */}
            <Section
              id="financing"
              eyebrow="Financing Guide"
              title="Financing Options for Sonora Garden Residences: Bank, Pag-IBIG & In-House"
            >
              <p>
                Most buyers settle the <strong>down payment</strong> in monthly installments spread
                across the payment term, then choose how to cover the remaining{" "}
                <strong>balance</strong>. There are four common routes, each with different
                trade-offs:
              </p>
              <ul className="my-4 space-y-3">
                <li>
                  <strong>Bank financing:</strong> the most common option for the balance. Banks
                  typically finance up to 80% of the unit value over 5–20 years. Rates are fixed for
                  an initial period, then repriced. Best for buyers with documented, stable income
                  who want the longest amortization and lowest monthly outlay.
                </li>
                <li>
                  <strong>In-house financing:</strong> arranged directly with the developer. Easier
                  to qualify for and faster to approve, but usually carries higher interest and a
                  shorter term than a bank. A practical bridge for self-employed buyers or those
                  still building bank-ready documents.
                </li>
                <li>
                  <strong>Pag-IBIG (HDMF):</strong> for eligible members, the Pag-IBIG housing loan
                  can offer competitive, socialized rates over terms up to 30 years. Loan ceilings
                  and qualification depend on your contributions and income.
                </li>
                <li>
                  <strong>Spot / deferred cash:</strong> paying in full (or over a short deferred
                  period) typically unlocks the largest discounts. Ideal for cash-rich buyers and
                  OFWs consolidating savings.
                </li>
              </ul>
              <p>
                The right structure depends on your income documentation, how long you plan to hold
                the unit, and your appetite for interest cost versus monthly cash flow. We can model
                each option side by side against your target Sonora unit so you can see the true
                monthly cost before you commit.
              </p>
            </Section>

            {/* Amenities */}
            <Section
              id="amenities"
              eyebrow="Resort Living Amenities"
              title="Resort-Style Amenities at Sonora Garden Residences Las Piñas"
            >
              <p>
                Amenities are where Sonora earns its "resort living" name. Rather than a single
                token pool, the community offers a full cluster of leisure, fitness, family, and
                convenience facilities spread across landscaped grounds and an elevated roof garden.
              </p>
              <div className="my-6 grid gap-5 sm:grid-cols-2">
                {AMENITY_GROUPS.map((g) => (
                  <div key={g.group} className="rounded-xl border border-hairline p-5">
                    <h3 className="text-[13px] font-bold uppercase tracking-[0.1em] text-primary">
                      {g.group}
                    </h3>
                    <ul className="mt-3 space-y-1.5">
                      {g.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-[14px] text-muted-foreground"
                        >
                          <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p>
                Behind the leisure facilities sit the practical systems DMCI is known for:{" "}
                <strong>12 dual-core high-speed elevators</strong>, integrated WiFi and fiber-optic
                readiness, standby power for both units and common areas, a card-operated laundry
                station, an on-site convenience store and water station, and round-the-clock
                security with CCTV — all maintained by DMCI Homes Property Management Corporation.
              </p>
            </Section>

            {/* Virtual tour */}
            <VirtualTourSection />

            {/* Who */}
            <Section
              id="who"
              eyebrow="Target Demographics"
              title="Is Sonora Garden Residences the Right Las Piñas Condo for You?"
            >
              <p>Sonora suits several distinct buyer profiles particularly well:</p>
              <ul className="my-4 space-y-3">
                <li>
                  <strong>South-Metro professionals &amp; upgraders</strong> who work in Las Piñas,
                  Parañaque, Alabang, or the Bay Area and want a resort-grade home without paying
                  Makati or BGC prices.
                </li>
                <li>
                  <strong>Growing families</strong> needing two- or three-bedroom space near malls,
                  schools, and hospitals, with pools and play areas on-site.
                </li>
                <li>
                  <strong>OFWs and overseas investors</strong> who want a tangible, peso-resilient
                  asset back home — purchasable remotely and rentable to a deep pool of South-Metro
                  tenants.
                </li>
                <li>
                  <strong>First-time investors</strong> drawn to RFO inventory: a unit that can be
                  leased out immediately rather than waiting years for turnover.
                </li>
              </ul>
              <p>
                It is a weaker fit for buyers who need to be inside the Makati/BGC/Ortigas CBDs
                daily and are unwilling to commute along Alabang–Zapote — for them, a CBD-adjacent
                development may justify its premium.
              </p>
            </Section>

            {/* Investment */}
            <Section
              id="investment"
              eyebrow="Investment Potential"
              title="Sonora Garden Residences Investment Potential & Expected Rental Yields"
            >
              <p>
                On balance, Sonora has a credible investment case grounded in three forces: location
                demand, ready inventory, and infrastructure momentum.
              </p>
              <p>
                <strong>Demand:</strong> Las Piñas sits at the heart of a dense, growing South-Metro
                population and serves as a gateway for Cavite-based workers. A unit directly linked
                to a major mall, in an RFO building, addresses the most rentable segment of the
                market — tenants who want convenience now, not in three years.
              </p>
              <p>
                <strong>Developer scale:</strong> DMCI Homes has publicly framed Sonora as a
                flagship project for the south, with reported revenue targets in the ₱13-billion
                range — a signal of the developer's confidence in sustained absorption along this
                corridor.
              </p>
              <p>
                <strong>Infrastructure:</strong> the LRT-1 Cavite Extension and broader road and
                transit upgrades across the southern corridor are the kind of public investment that
                historically lifts nearby residential values and rental demand over time.
              </p>
              <p>
                As always, treat projections with discipline: confirm the current price, association
                dues, and realistic rental comparables for your specific unit before assuming a
                yield. We're happy to share live rental data for the area.
              </p>
            </Section>

            {/* Developer */}
            <Section
              id="developer"
              eyebrow="Trusted Builders"
              title="Why Invest in DMCI Homes & Robinsons Land Joint Ventures"
            >
              <p>
                DMCI Homes is the residential arm of <strong>DMCI Holdings</strong>, a publicly
                listed engineering and construction conglomerate with decades of building
                experience. Unlike many developers that outsource construction, DMCI builds its own
                projects — a vertical integration that underpins its reputation for solid,
                well-finished structures.
              </p>
              <p>
                The brand is best known for its{" "}
                <strong>resort-inspired, low-density communities</strong> and its{" "}
                <strong>Lumiventt design technology</strong>, which channels natural light and
                cross-ventilation through garden atriums and breezeways — the same DNA visible in
                Sonora's roof garden and landscaped commons. After turnover, units are maintained by{" "}
                <strong>DMCI Homes Property Management Corporation</strong>, giving owners a single
                accountable party for security, upkeep, and common-area service.
              </p>
              <p>
                For a buyer, that track record translates into lower execution risk: a higher
                likelihood that the building is delivered as promised, holds up over time, and is
                managed well enough to protect resale and rental value.
              </p>
            </Section>

            {/* Pros & cons */}
            <Section
              id="pros-cons"
              eyebrow="Honest Buying Review"
              title="Pros & Cons of Buying a Unit in Sonora Garden Residences"
            >
              <div className="my-6 grid gap-6 md:grid-cols-2">
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5">
                  <h3 className="flex items-center gap-2 text-[15px] font-bold text-emerald-700">
                    <CheckCircle2 size={18} /> Strengths
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {PROS.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-[14px] text-ink/80">
                        <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-500" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
                  <h3 className="flex items-center gap-2 text-[15px] font-bold text-amber-700">
                    <AlertCircle size={18} /> Things to weigh
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {CONS.map((c) => (
                      <li key={c} className="flex items-start gap-2 text-[14px] text-ink/80">
                        <AlertCircle size={15} className="mt-0.5 shrink-0 text-amber-500" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Section>

            {/* How to buy */}
            <Section
              id="how-to-buy"
              eyebrow="Buying Process"
              title="Step-by-Step Buying Process for Sonora Garden Residences"
            >
              <p>
                Buying at Sonora Garden Residences follows DMCI's standard, OFW-friendly process.
                Here's the path from shortlist to keys:
              </p>
              <ol className="my-6 space-y-4">
                {BUY_STEPS.map((s, i) => (
                  <li key={s.step} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-[13px] font-bold text-primary-foreground">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="text-[15px] font-bold text-ink">{s.step}</h3>
                      <p className="mt-1 text-[14px] leading-relaxed text-muted-foreground">
                        {s.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
              <p>
                A CityQlo advisor can handle the legwork on your behalf — sending the live price
                list, reserving your unit, and preparing the document checklist — including fully
                remote transactions for OFWs.
              </p>
            </Section>

            {/* Checklist */}
            <Section
              id="checklist"
              eyebrow="Due Diligence Checklist"
              title="Buyer's Due Diligence Checklist for Sonora Garden Residences"
            >
              <p>
                A resort-grade unit is still a major financial commitment. Before you reserve, work
                through this short due-diligence checklist — it protects your money and sets honest
                expectations:
              </p>
              <ul className="my-4 space-y-3">
                <li>
                  <strong>Confirm the live price &amp; promo.</strong> Developer pricing and
                  discounts change per release. Get the current official price list for your exact
                  unit, floor, and tower in writing.
                </li>
                <li>
                  <strong>Ask about association dues.</strong> Monthly condo dues fund security,
                  amenities, and upkeep — budget for them on top of your amortization.
                </li>
                <li>
                  <strong>Check the turnover status.</strong> Cadence is RFO; verify availability,
                  acceptance condition, and timeline for the specific unit you want.
                </li>
                <li>
                  <strong>Test your commute.</strong> Drive Alabang–Zapote Road at the time you'd
                  actually travel, not at midday — it's the single biggest lifestyle variable.
                </li>
                <li>
                  <strong>Validate rental comparables.</strong> If you're buying to lease, confirm
                  realistic rents and vacancy for similar Las Piñas units before assuming a yield.
                </li>
                <li>
                  <strong>Review the contract carefully.</strong> Read the Contract to Sell, payment
                  schedule, and penalties; for OFWs, prepare your SPA early.
                </li>
                <li>
                  <strong>Prepare your financing path.</strong> Pre-qualify with a bank or Pag-IBIG
                  so the balance option is settled before the down-payment term ends.
                </li>
              </ul>
              <p>
                If any of these are unclear, ask before you pay the reservation fee — a good advisor
                will welcome the questions and give you straight answers.
              </p>
            </Section>

            {/* Comparison */}
            <Section
              id="comparison"
              eyebrow="Property Comparison"
              title="How Sonora Garden Residences Compares to Other South Metro Condos"
            >
              <p>
                Generic listing sites show you a unit; they rarely tell you how it stacks up. Here's
                an honest comparison of Sonora against a typical Metro Manila condo offering:
              </p>
              <div className="my-6 overflow-x-auto">
                <table className="w-full border-collapse text-left text-[14px]">
                  <thead>
                    <tr className="border-b border-ink/15">
                      <th className="py-3 pr-4 font-semibold text-ink">Factor</th>
                      <th className="py-3 pr-4 font-semibold text-primary">
                        Sonora Garden Residences
                      </th>
                      <th className="py-3 font-semibold text-ink">Typical condo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON.map((c) => (
                      <tr key={c.factor} className="border-b border-hairline align-top">
                        <td className="py-3 pr-4 font-semibold text-ink">{c.factor}</td>
                        <td className="py-3 pr-4 text-ink/80">{c.sonora}</td>
                        <td className="py-3 text-muted-foreground">{c.typical}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>
                For a deeper look at why Philippine condos can make sense as a long-term asset, read
                our{" "}
                <Link to="/why-invest" className="font-semibold text-primary underline">
                  guide to investing in Philippine property
                </Link>
                , or browse{" "}
                <Link
                  to="/properties"
                  search={{} as never}
                  className="font-semibold text-primary underline"
                >
                  other DMCI developments
                </Link>{" "}
                we cover.
              </p>
            </Section>

            {/* FAQ */}
            <Section
              id="faq"
              eyebrow="Frequently Asked Questions"
              title="Sonora Garden Residences Frequently Asked Questions (FAQ)"
            >
              <div className="mt-6 divide-y divide-hairline border-y border-hairline">
                {FAQS.map((f, i) => {
                  const isOpen = openFaq === i;
                  return (
                    <div key={f.q}>
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : i)}
                        className="flex w-full items-center justify-between gap-4 py-5 text-left"
                        aria-expanded={isOpen}
                      >
                        <span className="text-[16px] font-semibold text-ink">{f.q}</span>
                        <ChevronDown
                          size={18}
                          className={`shrink-0 text-primary transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <p className="pb-5 text-[15px] leading-relaxed text-muted-foreground">
                          {f.a}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </Section>

            {/* Closing internal-link block */}
            <Reveal>
              <div className="rounded-2xl border border-hairline bg-secondary/40 p-6 md:p-8">
                <p className="eyebrow mb-3">Keep exploring</p>
                <p className="text-[15px] leading-relaxed text-muted-foreground">
                  See the live unit inventory and book a viewing on the{" "}
                  <Link
                    to="/projects/$slug"
                    params={{ slug: "sonora-garden-residences" }}
                    className="font-semibold text-primary underline"
                  >
                    Sonora Garden Residences project page
                  </Link>
                  , compare{" "}
                  <Link
                    to="/properties"
                    search={{} as never}
                    className="font-semibold text-primary underline"
                  >
                    other DMCI developments in the Philippines
                  </Link>
                  , or read more{" "}
                  <Link to="/guides" className="font-semibold text-primary underline">
                    buyer guides
                  </Link>
                  .
                </p>
              </div>
            </Reveal>
          </article>
        </div>
      </div>

      {/* ===================== LEAD CAPTURE ===================== */}
      <div id="lead">
        <ConsultationCTA />
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Section wrapper                                                     */
/* ------------------------------------------------------------------ */

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <Reveal>
        <p className="eyebrow mb-3">
          <span className="gold-rule" />
          {eyebrow}
        </p>
        <h2 className="display-3 mb-6 text-ink">{title}</h2>
        <div className="space-y-4 text-[16px] leading-relaxed text-muted-foreground [&_strong]:text-ink [&_a]:text-primary">
          {children}
        </div>
      </Reveal>
    </section>
  );
}
