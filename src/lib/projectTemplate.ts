/**
 * DMCI project scaffolding.
 *
 * Turns a picked catalog entry (or a manually entered project) into a complete,
 * immediately-previewable draft: a full standard DMCI `layout_flow` with
 * placeholder copy, plus `units` parsed from the catalog `beds` string.
 *
 * Payload shapes mirror `getEmptyPayloadFor` in routes/portal/projects.tsx and
 * the section shapes consumed by routes/projects/$slug.tsx (adaptReadModel). The
 * hyphenated section `type` keys match section_types.key so publish compiles cleanly.
 */

export type ScaffoldMeta = {
  title: string;
  location: string; // city / district label, e.g. "Las Piñas"
  minPrice: number;
  maxPrice: number;
  status?: string; // "Pre-selling" | "Ready for Occupancy" | ...
};

export type ScaffoldUnit = {
  name: string;
  area_sqm: number;
  starting_price: number;
  description: string;
  profile_target: string;
  image_url: string;
};

export type ScaffoldSection = {
  id: string;
  type: string;
  version: string;
  payload: Record<string, unknown>;
};

/* ------------------------------------------------------------------ */
/* Units                                                              */
/* ------------------------------------------------------------------ */

type UnitMeta = { name: string; area_sqm: number; profile_target: string; description: string };

/** Map a catalog `beds` token (e.g. "2BR", "STUDIO", "H&L") to unit metadata. */
function unitMetaFor(token: string): UnitMeta {
  const t = token.trim().toUpperCase();
  if (t === "STUDIO")
    return {
      name: "Studio",
      area_sqm: 23,
      profile_target: "Single Professionals & Investors",
      description: "Efficient, modern studio layouts ideal for young professionals and investors.",
    };
  if (t === "LOFT")
    return {
      name: "Loft",
      area_sqm: 40,
      profile_target: "Creatives & Young Couples",
      description: "Double-height loft units with a distinctive, versatile living space.",
    };
  if (t === "H&L" || t === "H&AMP;L")
    return {
      name: "House & Lot",
      area_sqm: 80,
      profile_target: "Growing Families",
      description: "Complete house-and-lot packages designed for family living.",
    };
  if (t === "LOT")
    return {
      name: "Lot Only",
      area_sqm: 100,
      profile_target: "Long-Term Investors",
      description: "Prime residential lots ready for your custom-built home.",
    };
  const brMatch = t.match(/^(\d+)\s*BR$/);
  if (brMatch) {
    const n = Number(brMatch[1]);
    const areas: Record<number, number> = { 1: 28, 2: 50, 3: 75, 4: 100 };
    return {
      name: `${n}-Bedroom`,
      area_sqm: areas[n] ?? 28 + (n - 1) * 22,
      profile_target:
        n <= 1 ? "Couples & Passive Income Investors" : "Families & Upsizing Homeowners",
      description: `Spacious ${n}-Bedroom units with well-planned layouts and full amenity access.`,
    };
  }
  // Fallback for any unrecognized token — keep it rather than drop it.
  return {
    name: token.trim(),
    area_sqm: 30,
    profile_target: "Homebuyers & Investors",
    description: "Well-designed units in a premier DMCI Homes community.",
  };
}

/** Parse the catalog `beds` string into unit-type names (e.g. "1-Bedroom"). */
export function parseUnitNames(beds: string | undefined): string[] {
  if (!beds) return [];
  return beds
    .split(",")
    .map((b) => b.trim())
    .filter(Boolean)
    .map((token) => unitMetaFor(token).name);
}

/** Build `project_units` entries with placeholder area/price spread across the range. */
export function buildDmciUnits(
  beds: string | undefined,
  minPrice: number,
  maxPrice: number,
): ScaffoldUnit[] {
  const tokens = (beds || "")
    .split(",")
    .map((b) => b.trim())
    .filter(Boolean);
  if (tokens.length === 0) return [];

  const lo = Number.isFinite(minPrice) ? minPrice : 0;
  const hi = Number.isFinite(maxPrice) && maxPrice > lo ? maxPrice : lo;
  const span = tokens.length > 1 ? (hi - lo) / (tokens.length - 1) : 0;

  return tokens.map((token, i) => {
    const meta = unitMetaFor(token);
    return {
      name: meta.name,
      area_sqm: meta.area_sqm,
      starting_price: Math.round(lo + span * i),
      description: meta.description,
      profile_target: meta.profile_target,
      image_url: "",
    };
  });
}

/* ------------------------------------------------------------------ */
/* Layout flow (sections)                                             */
/* ------------------------------------------------------------------ */

/**
 * Build the standard DMCI page layout with placeholder copy that weaves in the
 * project's real title and location. Images are intentionally left empty for the
 * admin to fill via the Gallery/Media tabs.
 */
export function buildDmciLayoutFlow(meta: ScaffoldMeta): ScaffoldSection[] {
  const { title, location } = meta;
  const isRfo = /ready|rfo/i.test(meta.status || "");
  const statusLine = isRfo
    ? "This project is Ready for Occupancy — move in or lease out right away."
    : "Pre-selling prices are currently at their lowest. Every quarter brings a price increase as construction progresses.";

  const sec = (type: string, payload: Record<string, unknown>): ScaffoldSection => ({
    id: `sec-${type}`,
    type,
    version: "1.0",
    payload,
  });

  return [
    sec("hero", {
      tagline: "Resort Living. Urban Access. One Address.",
      secondary_tagline: `A DMCI Homes community in ${location}.`,
      hero_images: [],
      cta_primary_text: "Request Price List",
      cta_secondary_text: "Free Computation",
    }),
    sec("emotional-hook", {
      eyebrow: `The ${title} Lifestyle`,
      headline: `Come home to ${title} —`,
      sub: "where resort-caliber living meets everyday convenience.",
      points: [
        "Signature DMCI Lumiventt design for natural light and airflow",
        "Resort-style amenities steps from your door",
        `A strategic ${location} address`,
        "Backed by DMCI Homes' 70-year legacy of quality",
      ],
    }),
    sec("pricing-snapshot", {
      title: "Pricing",
      sub_title: "for as low as",
      description: statusLine,
      show_urgency: !isRfo,
      urgency_text_1: "Prices increase quarterly",
      urgency_text_2: "Selected units selling fast",
    }),
    sec("project-overview", {
      title: "Project Overview",
      headline_span: `${title}.`,
    }),
    sec("highlights", {
      eyebrow: `Why ${title}`,
      items: [
        {
          icon: "trees",
          title: "Resort-Inspired Living",
          description: "Lush landscaping and resort pools create a permanent vacation atmosphere.",
        },
        {
          icon: "mappin",
          title: "Strategic Location",
          description: `A prime ${location} address with access to business, malls, and transport.`,
        },
        {
          icon: "zap",
          title: "Lumiventt Technology",
          description: "DMCI's signature design delivers natural cross-ventilation and daylight.",
        },
        {
          icon: "award",
          title: "DMCI Homes Quality",
          description: "Backed by a 70-year legacy of construction excellence.",
        },
      ],
    }),
    sec("amenities", {
      eyebrow: "Community",
      intro: `Everything you need for a complete, resort-caliber life — all within ${title}.`,
      items: [
        {
          name: "Lap Pool",
          description: "Resort pool for fitness and leisure",
          icon: "waves",
          category: "wellness",
        },
        {
          name: "Fitness Gym",
          description: "Fully equipped air-conditioned gym",
          icon: "dumbbell",
          category: "wellness",
        },
        {
          name: "Landscaped Gardens",
          description: "Lush tropical gardens and relaxation spaces",
          icon: "trees",
          category: "recreation",
        },
        {
          name: "Children's Playground",
          description: "Safe, shaded play area for young residents",
          icon: "users",
          category: "social",
        },
        {
          name: "Function Rooms",
          description: "Multi-purpose event spaces for gatherings",
          icon: "coffee",
          category: "social",
        },
        {
          name: "24/7 Security",
          description: "Round-the-clock CCTV and roving guards",
          icon: "shield",
          category: "utility",
        },
      ],
    }),
    sec("location-map", {
      eyebrow: "Location Advantage",
      intro: `${title}'s ${location} address puts everything that matters within reach.`,
      map_label: location,
      maps_url: `https://maps.google.com/?q=${encodeURIComponent(`${title} ${location}`)}`,
      nearby: [
        { name: "Nearest Mall", time: "5 mins", category: "mall" },
        { name: "Hospital", time: "10 mins", category: "hospital" },
        { name: "School / University", time: "10 mins", category: "school" },
        { name: "Business District", time: "15 mins", category: "business" },
        { name: "Transport Hub", time: "5 mins", category: "transit" },
      ],
    }),
    sec("unit-types", {
      eyebrow: "Configurations",
      headline: "Choose Your Space",
    }),
    sec("decision-guide", {
      eyebrow: "Decision Guide",
      headline: "Which unit is",
      headline_accent: "right for you?",
    }),
    sec("media-experience", {
      eyebrow: "Media",
      photos: [],
      videos: [],
    }),
    sec("testimonials-slider", {
      stats: [
        { value: "1,200+", label: "Inquiries handled" },
        { value: "₱2B+", label: "Property value placed" },
        { value: "98%", label: "Client satisfaction rate" },
      ],
      testimonials: [
        {
          name: "Maria Santos",
          role: "OFW Investor",
          quote: "The whole process was seamless from abroad — clear advice, no pressure.",
        },
        {
          name: "James Reyes",
          role: "First-Time Buyer",
          quote: "My advisor walked me through payment terms and loan options patiently.",
        },
      ],
    }),
    sec("faq-list", {
      items: [
        { q: `Where is ${title} located?`, a: `${title} is located in ${location}.` },
        {
          q: "What unit types are available?",
          a: "Add the available unit types and floor areas here.",
        },
        {
          q: `Is ${title} pre-selling or RFO?`,
          a: isRfo
            ? `${title} is Ready for Occupancy.`
            : `${title} is currently in its pre-selling phase — an ideal time to invest while prices are lowest.`,
        },
        {
          q: "How do I request a free computation?",
          a: "Submit your details in the inquiry form and we'll prepare a personalized computation within 24 hours.",
        },
        {
          q: "Can OFWs purchase units?",
          a: "Yes — we assist OFW buyers with remote processing, SPA documentation, and PAG-IBIG applications.",
        },
      ],
    }),
    sec("lead-capture", {
      eyebrow: "Get Started Today",
      headline: "Interested in",
      headline_accent: `${title}?`,
      sub: "Leave your details and we'll prepare your personalized price list and payment computation within 24 hours.",
      unit_options: [...parseUnitNames(undefined), "Price List Only"],
    }),
    sec("related", {
      related_slugs: [],
    }),
  ];
}

/** Combine units + layout into a scaffold ready to pass to createProject. */
export function buildDmciDraftScaffold(meta: ScaffoldMeta & { beds?: string }): {
  layout_flow: ScaffoldSection[];
  units: ScaffoldUnit[];
} {
  const units = buildDmciUnits(meta.beds, meta.minPrice, meta.maxPrice);
  const layout_flow = buildDmciLayoutFlow(meta);

  // Fill the lead-capture unit options from the actual parsed units.
  const lead = layout_flow.find((s) => s.type === "lead-capture");
  if (lead) {
    lead.payload.unit_options = [...units.map((u) => u.name), "Price List Only"];
  }

  return { layout_flow, units };
}
