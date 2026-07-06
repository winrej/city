export const MARKETING_PAGE_SETTING_KEYS = [
  "page_guides",
  "page_why_invest",
  "page_about",
  "seo_guides",
  "seo_why_invest",
  "seo_about",
] as const;

export type MarketingPageId = "guides" | "why_invest" | "about";

export type MarketingPageConfig = {
  id: MarketingPageId;
  label: string;
  path: string;
  pageKey: "page_guides" | "page_why_invest" | "page_about";
  seoKey: "seo_guides" | "seo_why_invest" | "seo_about";
};

export const MARKETING_PAGE_CONFIGS: MarketingPageConfig[] = [
  {
    id: "guides",
    label: "Guides",
    path: "/guides",
    pageKey: "page_guides",
    seoKey: "seo_guides",
  },
  {
    id: "why_invest",
    label: "Why Invest",
    path: "/why-invest",
    pageKey: "page_why_invest",
    seoKey: "seo_why_invest",
  },
  {
    id: "about",
    label: "About",
    path: "/about",
    pageKey: "page_about",
    seoKey: "seo_about",
  },
];

export const GUIDES_PAGE_FALLBACK = {
  enabled: true,
  hero_eyebrow: "In preparation",
  hero_title: "Guides,",
  hero_highlight: "written like advice.",
  hero_description:
    "Editorial, plain-spoken guides for the decisions that matter. Released one at a time, each one revised until it earns the page.",
  guides: [
    { number: "01", title: "First-time buyer", description: "What to know before you sign anything.", status: "Soon" },
    { number: "02", title: "OFW property guide", description: "Buying from abroad, calmly and correctly.", status: "Soon" },
    { number: "03", title: "Condo investment", description: "The five questions every investor should ask.", status: "Soon" },
    { number: "04", title: "Property financing", description: "Loans, downpayments, and the math behind them.", status: "Soon" },
    { number: "05", title: "DMCI buying process", description: "From reservation to turnover, step by step.", status: "Soon" },
    { number: "06", title: "Metro Manila insights", description: "Submarket reads and where value is moving.", status: "Soon" },
  ],
  subscribe_eyebrow: "Be the first",
  subscribe_title: "Get guides in your inbox.",
  subscribe_description: "No spam. Just thoughtful releases as each guide is published.",
};

export const WHY_INVEST_PAGE_FALLBACK = {
  enabled: true,
  hero_eyebrow: "Why invest",
  hero_title: "The case for property,",
  hero_highlight: "made calmly.",
  hero_description:
    "A field guide to thinking about Metro Manila real estate the way long-term owners do - patiently, deliberately, and on your own terms.",
  chapters: [
    {
      number: "01",
      title: "Why real estate",
      description:
        "Among all asset classes, real estate is one of the few that gives you shelter, cash flow, and appreciation in a single instrument. Held with patience, it outpaces inflation and compounds quietly.",
    },
    {
      number: "02",
      title: "Why Metro Manila",
      description:
        "Metro Manila concentrates population, jobs, and infrastructure spend. New CBDs, transit lines, and lifestyle districts continue to expand the value envelope for the right submarkets.",
    },
    {
      number: "03",
      title: "Why condo investments",
      description:
        "Condominiums offer a defined entry point, professional management, and rentability that suits both end-users and investors - when chosen with discipline.",
    },
    {
      number: "04",
      title: "Why DMCI",
      description:
        "Resort-inspired developments, defensive pricing, and a strong rental community profile have made DMCI a long-time favorite for both first-time buyers and seasoned investors.",
    },
  ],
  benefits_heading: "What ownership earns you over time.",
  benefits: [
    { title: "Defensive cash flow", description: "Long-leased units in mature submarkets create stable, peso- and dollar-resilient yield." },
    { title: "Capital growth", description: "Locations near new infrastructure historically lead in long-horizon appreciation." },
    { title: "Inflation hedge", description: "Hard assets keep pace with - or outrun - rising cost of living." },
    { title: "Generational asset", description: "Pass it on, refinance it, or leverage it as part of a wider portfolio." },
  ],
  rental_strategies_heading: "Three ways your unit can earn.",
  rental_strategies_description:
    "A DMCI property isn't just a home - it can also become a source of recurring income. Here's how different rental strategies compare.",
  rental_strategies_disclaimer:
    "Returns depend on location, occupancy, management, seasonality, and market conditions.",
  rental_strategies: [
    {
      title: "Short-term (Airbnb)",
      description:
        "Nightly stays in tourist- and CBD-adjacent towers can outperform traditional leases - in exchange for active management, furnishing, and occupancy risk.",
      effort: "High",
      yield: "High",
      guide_slug: "short-term-airbnb-rentals-manila",
    },
    {
      title: "Staycation",
      description:
        "Resort-style DMCI amenities make units a natural fit for weekend and holiday guests - a middle ground between nightly churn and long leases.",
      effort: "Medium",
      yield: "Med-High",
      guide_slug: "staycation-rentals-dmci",
    },
    {
      title: "Long-term rental",
      description:
        "A 6-12 month lease trades peak yield for predictable, peso-resilient cash flow and minimal turnover - the classic passive hold.",
      effort: "Low",
      yield: "Steady",
      guide_slug: "long-term-rentals-metro-manila",
    },
  ],
  faq_heading: "Honest answers.",
  faq_description: "If yours is not here, ask us directly.",
  faqs: [
    { question: "Is now a good time to invest?", answer: "It depends entirely on your timeline and liquidity. There is no universal good time - only the right time for your situation." },
    { question: "I'm an OFW. Can I buy from abroad?", answer: "Yes. We work with many OFW clients end-to-end remotely, from goal-setting to turnover." },
    { question: "Do you charge for consultation?", answer: "No. The initial conversation is complimentary, and there is never pressure to transact." },
    { question: "Do you only recommend DMCI?", answer: "No. We recommend what fits your goals. DMCI is often a strong fit, but it is never the only option." },
  ],
};

export const ABOUT_PAGE_FALLBACK = {
  enabled: true,
  hero_eyebrow: "About",
  hero_title: "A property advisory,",
  hero_highlight: "built around you.",
  story_eyebrow: "Story",
  story_paragraphs: [
    "CityQlo started where many of our clients also began - frustrated by the noise of the Philippine property market. Glossy brochures. Rushed pitches. Numbers that did not add up to a life.",
    "We built CityQlo to give Filipino families and OFWs an advisor in their corner. Someone who would look at the spreadsheet honestly, walk away from the wrong deal, and stay close for the next ten years.",
  ],
  mission_eyebrow: "Mission",
  mission_title: "Calmer property decisions.",
  mission_description:
    "We exist to make sound property decisions accessible - without the hard sell - so more Filipinos can build long-term wealth on a foundation they actually understand.",
  values_heading: "How we work - and what we will not do.",
  values: [
    { title: "Clarity over hype", description: "We would rather be useful than impressive." },
    { title: "Long-term first", description: "Decisions designed to age well - not to close this quarter." },
    { title: "Quiet expertise", description: "We do the homework, then explain it plainly." },
    { title: "Respect for capital", description: "It is your money, your family, your call." },
  ],
  founder_eyebrow: "Founder",
  founder_title: "Built by a buyer, for buyers.",
  founder_lede:
    "Our founder spent a decade buying, holding, and advising on Metro Manila property - first for family, then for friends, and now for the CityQlo community.",
  founder_description: "The conversation always starts the same way: tell me about your goals.",
  founder_cta_text: "Start the conversation",
  trust_eyebrow: "Trust",
  trust_metrics: [
    { value: "12+", label: "Years in property" },
    { value: "350+", label: "Families advised" },
    { value: "100%", label: "Transparent recommendations" },
  ],
};

export const SEO_FALLBACKS = {
  seo_guides: {
    meta_title: "Guides - In Preparation | CityQlo",
    meta_description:
      "Editorial guides on buying, financing, and investing in Metro Manila property - released one at a time on CityQlo.",
    canonical_path: "/guides",
    og_image_url: "",
  },
  seo_why_invest: {
    meta_title: "Why Invest in DMCI Homes Condos in Metro Manila | CityQlo",
    meta_description:
      "Why real estate, why Metro Manila, why condo investments, and why DMCI Homes - explained by a DMCI Homes accredited property consultant, without the sales pitch.",
    canonical_path: "/why-invest",
    og_image_url: "",
  },
  seo_about: {
    meta_title: "About CityQlo | DMCI Homes Accredited Property Consultant",
    meta_description:
      "CityQlo is a DMCI Homes accredited property consultant in Metro Manila - a property advisory built around guidance, transparency, and the long term.",
    canonical_path: "/about",
    og_image_url: "",
  },
};

export function getSettingObject<T extends Record<string, unknown>>(
  rows: Array<{ key: string; value: unknown }> | undefined,
  key: string,
  fallback: T,
): T {
  const value = rows?.find((row) => row.key === key)?.value;
  if (!value || typeof value !== "object" || Array.isArray(value)) return fallback;
  return { ...fallback, ...(value as Record<string, unknown>) } as T;
}

export function getArrayField<T>(value: unknown, fallback: T[]): T[] {
  return Array.isArray(value) ? (value as T[]) : fallback;
}

export function getTextField(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}
