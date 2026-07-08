import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ChevronDown,
  MapPin,
  Building2,
  Wallet,
  CalendarCheck,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { Reveal } from "@/components/site/Reveal";
import { ConsultationCTA } from "@/components/site/ConsultationCTA";
import { BreadcrumbJsonLd } from "@/components/site/BreadcrumbJsonLd";
import { DocSidebar, MobileTocBar, type TocGroup } from "@/components/site/SectionNav";

const CANONICAL = "https://cityqlo.com/fortis-residences";
const OG_IMAGE =
  "https://www.dmcihomes.com/uploads/optimized/Fortis%2520Residences-header-1657173029705.webp";

const META_TITLE = "Fortis Residences by DMCI Homes — Price, Floor Plans & Review (2026) | CityQlo";
const META_DESCRIPTION =
  "The complete guide to Fortis Residences, DMCI Homes' modern contemporary high-rise along Chino Roces Avenue, Makati City. Price list (₱14.25M–₱39.76M), unit types (1BR–3BR), amenities, location analysis, and how to buy.";

export const Route = createFileRoute("/fortis-residences")({
  head: () => ({
    meta: [
      { title: META_TITLE },
      { name: "description", content: META_DESCRIPTION },
      {
        name: "keywords",
        content:
          "Fortis Residences, DMCI Homes Makati, Fortis Residences price, Fortis Residences Chino Roces, condo Makati DMCI, Lumiventt condo Makati, Fortis Residences floor plans, Makati condo for sale",
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
  component: FortisPage,
});

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const FAST_FACTS = [
  { icon: Building2, label: "Developer", value: "DMCI Homes" },
  {
    icon: MapPin,
    label: "Location",
    value: "Chino Roces Ave, Makati City",
  },
  {
    icon: CalendarCheck,
    label: "Status",
    value: "Under Construction",
  },
  { icon: Wallet, label: "Price range", value: "₱14.25M – ₱39.76M" },
  { icon: Layers, label: "Storeys", value: "36 Residential Levels" },
  { icon: Building2, label: "Theme", value: "Modern Contemporary" },
];

const UNITS = [
  {
    type: "1-Bedroom",
    area: "Inquire for exact floor area",
    from: "₱14,251,000 – ₱15,617,000",
    ideal: "Young professionals and investors seeking a Makati address",
  },
  {
    type: "2-Bedroom",
    area: "Inquire for exact floor area",
    from: "₱18,540,000 – ₱28,175,000",
    ideal: "Couples, small families, WFH professionals wanting CBD proximity",
  },
  {
    type: "3-Bedroom",
    area: "Inquire for exact floor area",
    from: "₱33,904,000 – ₱39,762,000",
    ideal: "Growing families and investors targeting premium Makati rentals",
  },
];

const AMENITY_GROUPS = [
  {
    group: "Water & leisure",
    items: ["Lap Pool", "Leisure Pool", "Kiddie Pool", "Sky Deck Pool", "Pool Deck"],
  },
  {
    group: "Active & sky",
    items: [
      "Fitness Gym",
      "Basketball Court / Playcourt",
      "Game Room",
      "Entertainment Room",
      "Business Center",
      "Sky Patio (Lumiventt Technology)",
      "Sky Promenade",
      "Open Lounge",
    ],
  },
  {
    group: "Family & outdoor",
    items: ["Children's Playground", "Drop-Off Promenade", "Landscaped Atriums"],
  },
  {
    group: "Everyday services",
    items: ["Convenience Store", "WiFi Access", "Passenger Elevators", "Reception Lobby"],
  },
  {
    group: "Security & safety",
    items: [
      "24-hour Security",
      "Provision for CCTV",
      "Fire Alarm & Automatic Sprinkler System",
      "Fire Exit",
      "Parking Space",
    ],
  },
];

const PROS = [
  "Prime Makati address on Chino Roces Avenue — heart of the CBD corridor and emerging mixed-use district.",
  "Lumiventt design technology ensures natural light and cross-ventilation through sky patios and atriums.",
  "Modern Contemporary architecture with sky deck pool and sky promenade — premium lifestyle amenities.",
  "Built and managed entirely by DMCI Homes — vertically integrated construction with in-house property management.",
  "Proximity to Makati's top business hubs, hospitals, schools, and transit lines.",
  "High rental demand corridor: Makati professionals, BPO workers, and expats consistently seek well-located condos.",
];

const CONS = [
  "Under Construction — buyers need to wait for completion before moving in or renting out.",
  "Price entry at ₱14.25M is higher than south-corridor options — this is a premium Makati address.",
  "Chino Roces traffic at rush hour can be significant — commuters should test the route.",
  "Condo dues and parking fees add to the monthly cost beyond amortization.",
];

const BUY_STEPS = [
  {
    step: "Shortlist your unit",
    detail:
      "Decide on unit type (1BR–3BR), floor level, and view preference. We can send the current official price list and available inventory.",
  },
  {
    step: "Reserve the unit",
    detail:
      "Pay the reservation fee to lock in the unit and price. This freezes your slot while documents are being prepared.",
  },
  {
    step: "Submit requirements",
    detail:
      "Provide valid IDs, proof of income or source of funds, and the buyer information sheet. OFWs can transact remotely via SPA.",
  },
  {
    step: "Settle the down payment",
    detail:
      "DMCI Homes spreads the down payment across the payment term — no large upfront lump sum required. We can model the monthly plan for your target unit.",
  },
  {
    step: "Choose your balance option",
    detail:
      "Cover the balance via bank financing, in-house financing, Pag-IBIG, or spot cash. We help you compare amortizations.",
  },
  {
    step: "Turnover & move in",
    detail:
      "Upon completion, the unit is accepted, inspected, and turned over — ready to occupy or lease out.",
  },
];

const COMPARISON = [
  {
    factor: "Location",
    fortis: "Chino Roces Ave, Makati — CBD core",
    typical: "Fringe or mid-city location",
  },
  {
    factor: "Status",
    fortis: "Under Construction (pre-selling advantage)",
    typical: "Varies — some RFO, many pre-selling",
  },
  {
    factor: "Design",
    fortis: "Modern Contemporary + Lumiventt sky patios",
    typical: "Standard tower slab, no atrium system",
  },
  {
    factor: "Amenities",
    fortis: "Sky Deck Pool, Sky Promenade, Business Center",
    typical: "Standard pool + gym",
  },
  {
    factor: "Developer",
    fortis: "DMCI Homes — self-building, in-house management",
    typical: "Single developer, outsourced construction",
  },
  {
    factor: "Entry price",
    fortis: "From ₱14.25M — competitive for Makati",
    typical: "₱10M–₱50M+ depending on location",
  },
];

const FAQS = [
  {
    q: "What is Fortis Residences?",
    a: "Fortis Residences is a high-rise condominium development by DMCI Homes located along Chino Roces Avenue in Makati City. The 36-storey modern contemporary tower features Lumiventt design technology — DMCI's signature system of sky patios and landscaped atriums that channel natural light and ventilation — with amenities including a Sky Deck Pool, Sky Promenade, Fitness Gym, and more.",
  },
  {
    q: "Where exactly is Fortis Residences located?",
    a: "Fortis Residences stands along Chino Roces Avenue (formerly Pasong Tamo) in Makati City — a key corridor connecting the central business district to Rockwell, Guadalupe, and the South. The address places residents within minutes of Makati's top offices, hospitals, schools, and entertainment districts.",
  },
  {
    q: "How much does a unit at Fortis Residences cost?",
    a: "As of 2026, prices range from approximately ₱14,251,000 for a 1-bedroom unit up to ₱39,762,000 for a 3-bedroom. One-bedroom units are priced between ₱14.25M–₱15.62M; two-bedrooms between ₱18.54M–₱28.18M; three-bedrooms between ₱33.90M–₱39.76M. Developer pricing updates with each release and promo — request the current price list for the most accurate figures.",
  },
  {
    q: "What is the status of Fortis Residences?",
    a: "Fortis Residences is currently Under Construction. As a pre-selling project, buyers benefit from earlier pricing and can spread the down payment across the payment term. Completion and turnover timelines should be confirmed with the developer at the time of reservation.",
  },
  {
    q: "What unit types are available at Fortis Residences?",
    a: "The development offers one-bedroom, two-bedroom, and three-bedroom units. Exact floor areas should be confirmed via the official floor plans — contact us and we will send the current unit cut details.",
  },
  {
    q: "What amenities does Fortis Residences offer?",
    a: "Fortis Residences features resort-class amenities including a Lap Pool, Leisure Pool, Kiddie Pool, Sky Deck Pool, Pool Deck, Fitness Gym, Basketball Court, Game Room, Entertainment Room, Business Center, Sky Patio (Lumiventt Technology), Sky Promenade, Open Lounge, Children's Playground, Drop-Off Promenade, Landscaped Atriums, Convenience Store, WiFi Access, 24-hour Security with CCTV, Fire Safety Systems, and Parking.",
  },
  {
    q: "What is Lumiventt Technology?",
    a: "Lumiventt is DMCI Homes' proprietary design system that integrates open sky patios and multi-storey atriums into the building's core. These features channel natural light and fresh air deep into the building, reducing heat gain and improving indoor air quality — resulting in a more comfortable, energy-conscious living environment than a conventional sealed tower.",
  },
  {
    q: "Is Fortis Residences a good investment?",
    a: "A Makati CBD-adjacent address is one of the most consistently liquid residential investments in the Philippines. Chino Roces Avenue benefits from proximity to Makati's top employers, Rockwell Center, and ongoing infrastructure improvements. Rental demand from BPO workers, expats, and local professionals has historically been strong along this corridor. That said, confirm current pricing, dues, and realistic rental comparables for your specific unit before committing.",
  },
  {
    q: "Can OFWs buy Fortis Residences remotely?",
    a: "Yes. Overseas Filipino workers can reserve and complete the purchase remotely by appointing an attorney-in-fact through a Special Power of Attorney (SPA) and submitting documents digitally. CityQlo can guide you through the entire OFW purchase process online.",
  },
  {
    q: "What are the payment terms for Fortis Residences?",
    a: "DMCI Homes typically spreads the down payment across the payment term — no large upfront lump sum — with the balance settled via bank financing, in-house financing, Pag-IBIG, or spot cash. We can prepare a personalized computation based on your preferred unit and preferred term.",
  },
  {
    q: "How do I get the official price list and reserve a unit?",
    a: "Request the latest price list and unit availability through the form on this page or via Messenger. A CityQlo advisor will send the current computation, walk you through unit options, and assist with reservation and documentation — at no cost to the buyer.",
  },
];

/* ------------------------------------------------------------------ */
/* JSON-LD structured data                                             */
/* ------------------------------------------------------------------ */

function StructuredData() {
  const realEstate = {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: "Fortis Residences",
    description: META_DESCRIPTION,
    url: CANONICAL,
    image: OG_IMAGE,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Chino Roces Avenue",
      addressLocality: "Makati City",
      addressRegion: "Metro Manila",
      addressCountry: "PH",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 14.542532,
      longitude: 121.016815,
    },
    numberOfRooms: "1-3",
    amenityFeature: AMENITY_GROUPS.flatMap((g) =>
      g.items.map((name) => ({
        "@type": "LocationFeatureSpecification",
        name,
        value: true,
      })),
    ),
    makesOffer: {
      "@type": "Offer",
      priceCurrency: "PHP",
      lowPrice: 14251000,
      highPrice: 39762000,
      priceRange: "₱14,251,000 – ₱39,762,000",
      availability: "https://schema.org/PreOrder",
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

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Fortis Residences by DMCI Homes — The Complete 2026 Guide",
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
      { id: "overview", label: "What is Fortis Residences?" },
      { id: "developer", label: "Why DMCI Homes" },
    ],
  },
  {
    label: "Pricing & Layouts",
    items: [
      { id: "units", label: "Unit types & pricing" },
      { id: "price", label: "Price list & computation" },
      { id: "financing", label: "Financing options" },
    ],
  },
  {
    label: "Amenities & Location",
    items: [
      { id: "location", label: "Location & accessibility" },
      { id: "amenities", label: "Amenities" },
    ],
  },
  {
    label: "Buyer Guide",
    items: [
      { id: "who", label: "Who it's for" },
      { id: "investment", label: "Investment potential" },
      { id: "pros-cons", label: "Pros & cons" },
      { id: "how-to-buy", label: "How to buy" },
      { id: "comparison", label: "How it compares" },
      { id: "faq", label: "FAQ" },
    ],
  },
];

function FortisPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Home", href: "/" }, { name: "Fortis Residences" }]} />
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
            backgroundImage: `linear-gradient(to bottom, oklch(0.21 0.012 252 / 0.82), oklch(0.21 0.012 252 / 0.97)), url(${OG_IMAGE})`,
            backgroundSize: "cover",
            backgroundPosition: "center top",
          }}
        />
        <div className="container-prose relative z-10">
          <Reveal>
            <p className="eyebrow text-white/50">
              <span className="gold-rule" />
              DMCI Homes · Makati City · Under Construction
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="display-1 mt-8 max-w-4xl text-white text-shadow-hero">
              Fortis Residences
              <span className="block text-primary">One address. Endless possibilities.</span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="lede mt-8 max-w-2xl text-white/70">
              The complete, independent guide to DMCI Homes' modern contemporary high-rise on Chino
              Roces Avenue — pricing, floor plans, amenities, Makati location analysis, and
              everything you need to decide with confidence.
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
                params={{ slug: "fortis-residences" }}
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
                <strong>Fortis Residences</strong> is a{" "}
                <strong>36-storey modern contemporary high-rise</strong> by{" "}
                <strong>DMCI Homes</strong> located along{" "}
                <strong>Chino Roces Avenue in Makati City</strong>. It offers{" "}
                <strong>1BR–3BR units</strong> priced from <strong>₱14.25M to ₱39.76M</strong>, with
                Lumiventt sky patios, a Sky Deck Pool, Sky Promenade, and a full suite of
                resort-class amenities — positioned as a gateway to Makati's emerging mixed-use
                district.
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
            <Section id="overview" eyebrow="Overview" title="What is Fortis Residences?">
              <p>
                Fortis Residences is a high-rise condominium by <strong>DMCI Homes</strong> — one of
                the Philippines' most established residential developers — rising 36 storeys along{" "}
                <strong>Chino Roces Avenue in Makati City</strong>. The project sits at the center
                of an emerging special mixed-use district, and DMCI describes it as a gateway to a
                new chapter of urban living in the country's premier business city.
              </p>
              <p>
                The building's design follows DMCI Homes' signature{" "}
                <strong>Modern Contemporary</strong> theme — smooth monochromatic surfaces,
                open-plan interiors, dramatic lighting, and natural material accents — combined with
                their proprietary <strong>Lumiventt Technology</strong>: a system of integrated sky
                patios and multi-storey atriums that bring natural light and cross-ventilation deep
                into the building's core.
              </p>
              <p>
                Set on a <strong>7,200-square-meter</strong> lot, the tower offers one-, two-, and
                three-bedroom units with access to a curated set of resort-class amenities including
                a Sky Deck Pool, Sky Promenade, Fitness Gym, Business Center, and more — all managed
                by DMCI Homes Property Management Corporation after turnover.
              </p>
              <p>
                For buyers seeking a Makati address — whether for personal use, rental income, or
                long-term asset growth — Fortis Residences offers a rare combination of a prime
                Chino Roces location, DMCI's build quality, and a design philosophy that elevates it
                above the typical mass-market high-rise.
              </p>
            </Section>

            {/* Location */}
            <Section
              id="location"
              eyebrow="Location"
              title="Is the location of Fortis Residences good?"
            >
              <p>
                For a Makati-based buyer, yes — Chino Roces Avenue is one of the district's most
                strategically positioned corridors. The address sits between the Makati CBD proper
                and Rockwell Center, with direct access to the Magallanes interchange and the South
                Luzon Expressway.
              </p>
              <p>Key destinations from the property include:</p>
              <ul className="my-4 space-y-2">
                <li>
                  <strong>Makati CBD (Ayala Avenue / BGC gateway):</strong> a short drive or ride to
                  the country's densest cluster of corporate offices, banks, and professional
                  services.
                </li>
                <li>
                  <strong>Rockwell Center:</strong> within a few minutes via Chino Roces — Power
                  Plant Mall, Edades Tower, and Rockwell's residential and office developments.
                </li>
                <li>
                  <strong>Ospital ng Makati & Makati Medical Center:</strong> both accessible within
                  the district for residents with medical needs.
                </li>
                <li>
                  <strong>International schools:</strong> Brent International School Manila and
                  several top-ranked schools within Makati are practical for families.
                </li>
                <li>
                  <strong>MRT-3 (Magallanes / Ayala stations):</strong> a key transit connector
                  linking residents north toward Ortigas, QC, and Pasay.
                </li>
                <li>
                  <strong>NAIA Terminals:</strong> roughly 10–15 minutes by car — critical for OFWs
                  and frequent travelers.
                </li>
              </ul>
              <p>
                One honest caveat: Chino Roces Avenue carries real rush-hour traffic, particularly
                at the Magallanes interchange and near Ayala Avenue. Buyers who commute should drive
                the route at their actual travel time before committing.
              </p>
            </Section>

            {/* Units */}
            <Section id="units" eyebrow="Floor plans" title="Unit types & floor areas">
              <p>
                Fortis Residences offers one-, two-, and three-bedroom configurations across 36
                residential levels. Unit prices vary by floor level, orientation, and availability
                at the time of inquiry. Exact floor areas are confirmed per the official floor plans
                — contact us and we will send the current unit cut details.
              </p>
              <div className="my-6 overflow-x-auto">
                <table className="w-full border-collapse text-left text-[14px]">
                  <thead>
                    <tr className="border-b border-ink/15">
                      <th className="py-3 pr-4 font-semibold text-ink">Unit type</th>
                      <th className="py-3 pr-4 font-semibold text-ink">Price range</th>
                      <th className="py-3 font-semibold text-ink">Ideal for</th>
                    </tr>
                  </thead>
                  <tbody>
                    {UNITS.map((u) => (
                      <tr key={u.type} className="border-b border-hairline align-top">
                        <td className="py-3 pr-4 font-semibold text-ink">{u.type}</td>
                        <td className="py-3 pr-4 text-muted-foreground">{u.from}</td>
                        <td className="py-3 text-muted-foreground">{u.ideal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[13px] italic text-muted-foreground">
                Prices as of July 2026 and subject to change with each developer release. Exact
                floor areas and the official price list are confirmed per unit availability —
                request the current sheet for your target unit.
              </p>
            </Section>

            {/* Price */}
            <Section id="price" eyebrow="Pricing" title="How much is Fortis Residences?">
              <p>
                As of <strong>July 2026</strong>, units at Fortis Residences range from{" "}
                <strong>₱14,251,000 to ₱39,762,000</strong> depending on unit type, floor level, and
                orientation. The entry point for a one-bedroom begins at approximately{" "}
                <strong>₱14.25M</strong>, while premium three-bedroom units reach up to{" "}
                <strong>₱39.76M</strong>.
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
                      ["Full price range", "₱14,251,000 – ₱39,762,000"],
                      ["1-Bedroom range", "₱14,251,000 – ₱15,617,000"],
                      ["2-Bedroom range", "₱18,540,000 – ₱28,175,000"],
                      ["3-Bedroom range", "₱33,904,000 – ₱39,762,000"],
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
              <div className="my-6 rounded-xl border border-primary/30 bg-primary/5 p-5">
                <p className="text-[14px] text-ink">
                  <strong>Want an exact computation?</strong> Developer pricing updates with each
                  release and promo. Tell us your preferred unit and term, and we'll send a
                  personalized Fortis Residences computation —{" "}
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
              eyebrow="Payment"
              title="How to finance a Fortis Residences unit"
            >
              <p>
                DMCI Homes' standard structure spreads the <strong>down payment</strong> in monthly
                installments across the payment term — no large upfront lump sum — with the
                remaining <strong>balance</strong> settled through one of four routes:
              </p>
              <ul className="my-4 space-y-3">
                <li>
                  <strong>Bank financing:</strong> the most common option for the balance. Banks
                  typically finance up to 80% of the appraised value over 5–20 years at
                  fixed-then-floating rates. Best for buyers with documented, stable income.
                </li>
                <li>
                  <strong>In-house financing:</strong> arranged directly with DMCI Homes. Easier to
                  qualify for, faster approval, but typically carries higher interest and a shorter
                  term than a bank loan. A practical bridge for self-employed buyers.
                </li>
                <li>
                  <strong>Pag-IBIG (HDMF):</strong> eligible members can access competitive
                  socialized rates over terms up to 30 years, subject to contribution history and
                  income.
                </li>
                <li>
                  <strong>Spot / deferred cash:</strong> paying in full or over a short deferred
                  period typically unlocks the largest discounts. Ideal for cash-rich buyers and
                  OFWs consolidating savings.
                </li>
              </ul>
              <p>
                The right structure depends on your income documentation, intended holding period,
                and cash flow targets. We can model each option side by side for your target Fortis
                unit so you can see the true monthly cost before committing.
              </p>
            </Section>

            {/* Amenities */}
            <Section id="amenities" eyebrow="Lifestyle" title="Fortis Residences amenities">
              <p>
                Fortis Residences goes well beyond the standard pool-and-gym offering. The tower's
                amenity stack is built around vertical resort living — rooftop and sky-level spaces
                that give residents a genuine sense of elevation and escape within the Makati
                skyline.
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
                The standout elements are the <strong>Sky Deck Pool</strong> and{" "}
                <strong>Sky Promenade</strong> — elevated amenity spaces with open-air Makati
                skyline views — and the <strong>Sky Patio (Lumiventt Technology)</strong>, which
                functions as a green lung for the building, drawing fresh air and light into the
                building's middle floors rather than sealing residents in a fully air-conditioned
                tower.
              </p>
            </Section>

            {/* Who */}
            <Section id="who" eyebrow="Fit" title="Who is Fortis Residences for?">
              <p>Fortis suits several buyer profiles particularly well:</p>
              <ul className="my-4 space-y-3">
                <li>
                  <strong>Makati professionals & CBD workers</strong> who want to live within the
                  business district they work in — eliminating the daily commute and gaining
                  resort-class amenities at home.
                </li>
                <li>
                  <strong>Investors targeting Makati rentals</strong> — the Chino Roces corridor
                  draws strong demand from BPO workers, foreign nationals, and executives who prefer
                  Makati's safety, transit access, and lifestyle infrastructure.
                </li>
                <li>
                  <strong>OFWs and overseas investors</strong> who want a high-value, peso-resilient
                  asset in one of the country's most liquid real estate markets — purchasable
                  remotely and rentable to a deep pool of Makati tenants.
                </li>
                <li>
                  <strong>Upgraders from fringe or provincial addresses</strong> who want to
                  consolidate into a premium address with long-term capital appreciation potential.
                </li>
              </ul>
              <p>
                It is a weaker fit for buyers on a tighter budget — with a 1BR floor price above
                ₱14M, Fortis is priced as a premium Makati product. South-corridor options like
                Sonora Garden Residences (Las Piñas) offer comparable DMCI quality at a lower entry
                point.
              </p>
            </Section>

            {/* Investment */}
            <Section
              id="investment"
              eyebrow="Returns"
              title="Is Fortis Residences a good investment?"
            >
              <p>
                On balance, Fortis Residences has a credible investment case anchored in location,
                developer quality, and Makati's persistent rental demand.
              </p>
              <p>
                <strong>Location premium:</strong> Chino Roces Avenue sits at the intersection of
                Makati's established office district and Rockwell's premium residential corridor.
                Properties along this axis have historically commanded strong resale values and
                rental yields — the address carries inherent scarcity value.
              </p>
              <p>
                <strong>Rental demand:</strong> Makati's BPO sector, expat community, and executive
                population sustain consistent demand for well-located, well-managed condos. A Fortis
                unit — in an DMCI building with professional property management — is
                well-positioned to attract quality tenants.
              </p>
              <p>
                <strong>Infrastructure momentum:</strong> ongoing road and transit upgrades in Metro
                Manila, including the MRT-3 rehabilitation and Makati's own city-level
                infrastructure investments, support property values along the Chino Roces corridor.
              </p>
              <p>
                As always: confirm the current price, projected dues, and realistic rental
                comparables for your specific unit before assuming a yield. We can share live Makati
                rental data for the corridor.
              </p>
            </Section>

            {/* Developer */}
            <Section id="developer" eyebrow="Trust" title="Why DMCI Homes?">
              <p>
                DMCI Homes is the residential arm of <strong>DMCI Holdings</strong>, a publicly
                listed engineering and construction conglomerate. Unlike most developers that
                outsource construction, DMCI builds its own projects — vertical integration that
                underpins its reputation for solid, well-finished structures delivered on schedule.
              </p>
              <p>
                The brand is best known for its resort-inspired communities and{" "}
                <strong>Lumiventt design technology</strong>, which channels natural light and
                cross-ventilation through garden atriums and sky patios — a design system visible
                throughout Fortis Residences. After turnover, buildings are maintained by{" "}
                <strong>DMCI Homes Property Management Corporation</strong>, giving owners a single
                accountable party for security, upkeep, and common-area service.
              </p>
              <p>
                For a buyer, that track record translates into lower execution risk — a higher
                likelihood that the building is delivered as designed, holds up structurally over
                time, and is managed well enough to protect resale and rental value.
              </p>
            </Section>

            {/* Pros & cons */}
            <Section
              id="pros-cons"
              eyebrow="Balanced view"
              title="Pros and cons of Fortis Residences"
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
              eyebrow="Process"
              title="How to buy a unit at Fortis Residences"
            >
              <p>
                Buying at Fortis Residences follows DMCI's standard, OFW-friendly process. Here's
                the path from shortlist to keys:
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

            {/* Comparison */}
            <Section id="comparison" eyebrow="Context" title="How Fortis Residences compares">
              <p>
                Here's an honest comparison of Fortis against a typical Metro Manila high-rise
                offering:
              </p>
              <div className="my-6 overflow-x-auto">
                <table className="w-full border-collapse text-left text-[14px]">
                  <thead>
                    <tr className="border-b border-ink/15">
                      <th className="py-3 pr-4 font-semibold text-ink">Factor</th>
                      <th className="py-3 pr-4 font-semibold text-primary">Fortis Residences</th>
                      <th className="py-3 font-semibold text-ink">Typical condo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON.map((c) => (
                      <tr key={c.factor} className="border-b border-hairline align-top">
                        <td className="py-3 pr-4 font-semibold text-ink">{c.factor}</td>
                        <td className="py-3 pr-4 text-ink/80">{c.fortis}</td>
                        <td className="py-3 text-muted-foreground">{c.typical}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>
                For a deeper look at why Metro Manila condos can make sense as a long-term asset,
                read our{" "}
                <Link to="/why-invest" className="font-semibold text-primary underline">
                  guide to investing in Metro Manila property
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
            <Section id="faq" eyebrow="Questions" title="Fortis Residences — FAQ">
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
                    params={{ slug: "fortis-residences" }}
                    className="font-semibold text-primary underline"
                  >
                    Fortis Residences project page
                  </Link>
                  , compare{" "}
                  <Link
                    to="/properties"
                    search={{} as never}
                    className="font-semibold text-primary underline"
                  >
                    other Metro Manila condos
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
