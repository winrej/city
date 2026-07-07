import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  MapPin,
  Phone,
  MessageCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  Star,
  Check,
  ArrowRight,
  Play,
  X,
  ZoomIn,
  Trees,
  Dumbbell,
  Waves,
  Car,
  Shield,
  Building2,
  Users,
  Zap,
  Coffee,
  Train,
  ShoppingBag,
  GraduationCap,
  Heart,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Eye,
  Award,
  Clock,
  Share2,
  Camera,
  Video,
  Globe,
  Sofa,
} from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { BreadcrumbJsonLd } from "@/components/site/BreadcrumbJsonLd";
import { TourViewer, PROJECT_TOURS } from "@/components/site/VirtualTourSection";
import { PriceListMagnet } from "@/components/project/PriceListMagnet";
import {
  getProjectBySlug,
  getSiteSettings,
  createLead,
  getRelatedProjects,
} from "@/lib/api/admin.functions";

import towerImg from "@/assets/tower-exterior.jpg";
import interiorImg from "@/assets/interior-living.jpg";
import poolImg from "@/assets/amenity-pool.jpg";
import propOriana from "@/assets/prop-oriana.png";
import lifestyleImg from "@/assets/lifestyle-couple.jpg";
import locMakati from "@/assets/loc-makati.png";
import locPasig from "@/assets/loc-pasig.png";

// ─── Hardcoded Fallback ───────────────────────────────────────────────────────
// Used when DB read model is unavailable or project_read_models is empty.
// This ensures the page always renders during migration and local dev.

const FALLBACK_PROJECTS: Record<string, ProjectPageData> = {
  "sonora-garden": {
    meta: {
      id: "sonora-garden",
      name: "Sonora Garden Residences",
      tagline: "Resort Living. Urban Access. One Address.",
      developer: "DMCI Homes",
      location: "Las Piñas City",
      city: "Las Piñas",
      fullAddress: "Alabang-Zapote Road, Pamplona Tres, Las Piñas City",
      status: "Pre-selling",
      architecturalTheme: "Modern Resort Tropical",
      landArea: "1.8 Hectares",
      floors: "5–7 Floors (Low-Rise Cluster)",
      totalUnits: "1,152 Units",
      turnover: "2027–2028",
      description:
        "Sonora Garden Residences is DMCI Homes' premier resort-inspired condominium along the strategic Alabang-Zapote Road in Las Piñas City. Designed with a Modern Resort Tropical architectural theme, it brings a refreshing escape from city life — without leaving the city. Each building is oriented to maximize natural ventilation through DMCI's signature Lumiventt Technology, delivering cross-breezes and natural light to corridors and common areas. With 1,152 units distributed across spacious low-rise clusters, Sonora offers intimate, resort-style community living.",
    },
    sections: {
      hero: {
        tagline: "Resort Living. Urban Access. One Address.",
        secondary_tagline: "A DMCI Homes community in the heart of Las Piñas.",
        hero_images: [towerImg, poolImg, interiorImg],
        cta_primary_text: "Request Price List",
        cta_secondary_text: "Free Computation",
      },
      emotional_hook: {
        headline: "Wake up 5 minutes from Alabang's business core —",
        sub: "where your workday begins, and your home feels like a resort escape.",
        eyebrow: "The Sonora Lifestyle",
        points: [
          "Skip the commute — Alabang CBD is 5 minutes away",
          "Come home to a lap pool, not rush-hour traffic",
          "Robinsons Las Piñas is just steps from your door",
          "World-class hospitals within a 10-minute drive",
        ],
      },
      pricing: {
        title: "Pricing",
        sub_title: "for as low as",
        description:
          "Pre-selling prices are currently at their lowest. Every quarter brings a price increase as construction progresses.",
        show_urgency: true,
      },
      overview: {
        title: "Project Overview",
        headline_span: "Sonora Garden.",
      },
      highlights: {
        eyebrow: "Why Sonora Garden",
        items: [
          {
            icon: "trees",
            title: "Resort-Inspired Living",
            description:
              "Lush landscaping, resort pools, and tropical gardens create a permanent vacation atmosphere.",
          },
          {
            icon: "mappin",
            title: "Strategic Location",
            description:
              "Prime Alabang-Zapote Road address with direct access to business, malls, and transport.",
          },
          {
            icon: "shoppingbag",
            title: "Commercial Convenience",
            description:
              "Robinsons Las Piñas is steps away — groceries, dining, and entertainment at your doorstep.",
          },
          {
            icon: "zap",
            title: "Lumiventt Technology",
            description:
              "DMCI's patented design delivers natural cross-ventilation and natural daylighting to every unit.",
          },
          {
            icon: "building2",
            title: "Spacious Unit Layouts",
            description:
              "Larger-than-average floor plans maximizing livable space and natural light in every room.",
          },
          {
            icon: "award",
            title: "DMCI Homes Quality",
            description:
              "Backed by a 70-year legacy of construction excellence and quality residential developments.",
          },
        ],
      },
      amenities: {
        eyebrow: "Community",
        intro:
          "Everything you need for a complete, resort-caliber life — all within Sonora Garden.",
        items: [
          {
            name: "Lap Pool",
            description: "Olympic-length resort pool for fitness and leisure",
            icon: "waves",
            category: "wellness",
          },
          {
            name: "Leisure Pool",
            description: "Relaxing shallow-entry pool with lounge deck",
            icon: "waves",
            category: "recreation",
          },
          {
            name: "Fitness Gym",
            description: "Fully equipped air-conditioned gym with modern equipment",
            icon: "dumbbell",
            category: "wellness",
          },
          {
            name: "Sky Promenade",
            description: "Elevated landscaped walkway with panoramic views",
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
            description: "Multi-purpose event spaces for private gatherings",
            icon: "coffee",
            category: "social",
          },
          {
            name: "Landscaped Gardens",
            description: "Lush tropical gardens and relaxation spaces",
            icon: "trees",
            category: "recreation",
          },
          {
            name: "24/7 Security",
            description: "Round-the-clock CCTV monitoring and roving guards",
            icon: "shield",
            category: "utility",
          },
          {
            name: "Grand Lobby",
            description: "Hotel-inspired reception lobby with concierge desk",
            icon: "building2",
            category: "utility",
          },
          {
            name: "High-Speed Elevators",
            description: "Multiple passenger elevators per building cluster",
            icon: "zap",
            category: "utility",
          },
          {
            name: "Covered Parking",
            description: "Ample parking for residents and guests",
            icon: "car",
            category: "utility",
          },
          {
            name: "Lumiventt Tech",
            description: "DMCI's signature natural light and ventilation design system",
            icon: "zap",
            category: "wellness",
          },
        ],
      },
      location: {
        eyebrow: "Location Advantage",
        intro:
          "Sonora Garden's Alabang-Zapote Road address puts the entire South Metro at your doorstep.",
        map_label: "Alabang-Zapote Road, Las Piñas",
        maps_url: "https://maps.google.com/?q=Sonora+Garden+Residences+Las+Pinas",
        nearby: [
          { name: "Robinsons Place Las Piñas", time: "2 min walk", category: "mall" },
          { name: "SM City Southmall", time: "8 mins", category: "mall" },
          { name: "Alabang Town Center", time: "10 mins", category: "mall" },
          { name: "Las Piñas General Hospital", time: "5 mins", category: "hospital" },
          { name: "Asian Hospital & Medical Center", time: "12 mins", category: "hospital" },
          { name: "St. Scholastica's College Manila", time: "10 mins", category: "school" },
          { name: "De La Salle University Dasmariñas", time: "18 mins", category: "school" },
          { name: "Alabang CBD (Filinvest)", time: "5 mins", category: "business" },
          { name: "Makati CBD", time: "25 mins", category: "business" },
          { name: "BGC / Fort Bonifacio", time: "30 mins", category: "business" },
          { name: "NAIA International Airport", time: "15 mins", category: "transit" },
          { name: "Las Piñas Bus Terminal", time: "3 mins", category: "transit" },
        ],
      },
      testimonials: {
        stats: [
          { value: "1,200+", label: "Inquiries handled" },
          { value: "₱2B+", label: "Property value placed" },
          { value: "98%", label: "Client satisfaction rate" },
        ],
        testimonials: [
          {
            name: "Maria Santos",
            role: "OFW Investor, Dubai",
            quote:
              "CityQlo made the entire process seamless from abroad. No pressure, just clear advice. I closed my unit in 2 weeks.",
          },
          {
            name: "James Reyes",
            role: "First-Time Buyer, Alabang",
            quote:
              "I was nervous about buying my first property. My advisor walked me through everything — payment terms, bank loan options, all of it.",
          },
          {
            name: "Carla Mendoza",
            role: "Property Investor, Makati",
            quote:
              "Already on my third unit through CityQlo. The team consistently finds properties that match my investment goals.",
          },
        ],
      },
      faq: {
        items: [
          {
            q: "Where is Sonora Garden Residences located?",
            a: "Sonora Garden Residences is strategically located along Alabang-Zapote Road, Pamplona Tres, Las Piñas City — directly adjacent to Robinsons Place Las Piñas and minutes from the Alabang business district.",
          },
          {
            q: "What unit types are available?",
            a: "We offer Studio (23 sq.m.), 1-Bedroom (37 sq.m.), 2-Bedroom (58.5 sq.m.), and 3-Bedroom (84 sq.m.) units.",
          },
          {
            q: "Is Sonora Garden Residences pre-selling or RFO?",
            a: "Sonora Garden Residences is currently in its Pre-Selling phase with projected turnover in 2027–2028. This is an ideal time to invest as prices are at their lowest.",
          },
          {
            q: "How can I schedule a property viewing or presentation?",
            a: "Fill out the inquiry form below or send us a message via WhatsApp/Viber and we'll coordinate a personal property presentation at your preferred schedule — no obligation required.",
          },
          {
            q: "How do I request a free payment computation?",
            a: "Simply submit your name and contact number in our lead form and we'll prepare a personalized computation (bank loan, in-house, PAG-IBIG) within 24 hours.",
          },
          {
            q: "Are there any additional fees beyond the unit price?",
            a: "When you purchase through CityQlo, you pay the official developer price — no mark-ups, no hidden fees. We provide full transparency on all transaction costs including transfer fees, notarial fees, and association dues.",
          },
          {
            q: "Can OFWs purchase units in Sonora Garden?",
            a: "Absolutely. We specialize in assisting OFW buyers with remote processing, SPA documentation, and PAG-IBIG fund applications. Many of our clients are OFW investors.",
          },
        ],
      },
      lead_capture: {
        eyebrow: "Get Started Today",
        headline: "Interested in",
        headline_accent: "Sonora Garden?",
        sub: "Leave your details and we'll prepare your personalized price list and payment computation within 24 hours.",
        unit_options: ["Studio", "1-Bedroom", "2-Bedroom", "3-Bedroom", "Price List Only"],
      },
      media: {
        photos: [
          { tab: "exterior", src: towerImg, thumb: towerImg, title: "Tower Exterior" },
          { tab: "exterior", src: propOriana, thumb: propOriana, title: "Building Facade" },
          { tab: "exterior", src: locMakati, thumb: locMakati, title: "Drone Aerial View" },
          { tab: "amenities", src: poolImg, thumb: poolImg, title: "Resort Lap Pool" },
          { tab: "amenities", src: locPasig, thumb: locPasig, title: "Landscaped Gardens" },
          { tab: "interiors", src: interiorImg, thumb: interiorImg, title: "2BR Living Area" },
          { tab: "interiors", src: lifestyleImg, thumb: lifestyleImg, title: "Lifestyle Shot" },
        ],
        videos: [
          { title: "Project Walkthrough", duration: "3:24", thumb: towerImg },
          { title: "Amenity Tour", duration: "2:08", thumb: poolImg },
          { title: "Virtual Unit Preview", duration: "4:15", thumb: interiorImg },
        ],
      },
      related: {
        related_slugs: ["allegra-garden", "satori-residences", "atherton"],
      },
    },
    units: [
      {
        name: "Studio",
        area_sqm: 23.0,
        starting_price: 4500000,
        description:
          "Efficient, modern studio layouts ideal for young professionals looking for a prime Las Piñas address.",
        profile_target: "Single Professionals & Investors",
        image_url: interiorImg,
      },
      {
        name: "1-Bedroom",
        area_sqm: 37.0,
        starting_price: 6800000,
        description:
          "Spacious 1BR units with dedicated living areas, perfect for couples or as a rental income property.",
        profile_target: "Couples & Passive Income Investors",
        image_url: towerImg,
      },
      {
        name: "2-Bedroom",
        area_sqm: 58.5,
        starting_price: 9200000,
        description:
          "Our most popular layout — generous living spaces with full amenity access for growing families.",
        profile_target: "Small Families & OFW Investors",
        image_url: poolImg,
      },
      {
        name: "3-Bedroom",
        area_sqm: 84.0,
        starting_price: 13500000,
        description:
          "Premium 3BR units with expansive floor plans, designed for families upsizing to resort-caliber living.",
        profile_target: "Growing Families & Upsizing Homeowners",
        image_url: propOriana,
      },
    ],
  },
  "fortis-residences": {
    meta: {
      id: "fortis-residences",
      name: "Fortis Residences",
      tagline: "One Address. Endless Possibilities.",
      developer: "DMCI Homes",
      location: "Chino Roces Ave, Makati City",
      city: "Makati",
      fullAddress: "Chino Roces Avenue, Makati City",
      status: "Pre-selling",
      architecturalTheme: "Modern Contemporary",
      landArea: "7,200 sq.m.",
      floors: "36 Levels",
      totalUnits: "Inquire for details",
      turnover: "Under Construction",
      description:
        "Fortis Residences is DMCI Homes' premier modern contemporary high-rise development situated along the active Chino Roces Avenue in Makati City. Located at the heart of Makati's emerging mixed-use district, it features DMCI's signature Lumiventt Technology for natural airflow and light, resort-inspired sky pools, and a premium Business Center designed for urban professionals.",
    },
    sections: {
      hero: {
        tagline: "One Address. Endless Possibilities.",
        secondary_tagline: "A premium DMCI Homes development along Chino Roces Avenue, Makati.",
        hero_images: [towerImg, poolImg, interiorImg],
        cta_primary_text: "Request Price List",
        cta_secondary_text: "Free Computation",
      },
      emotional_hook: {
        headline: "Live where the heartbeat of Makati CBD meets resort-style sanctuary —",
        sub: "enjoy sky-high pools, fresh cross-breezes, and unmatched city accessibility.",
        eyebrow: "The Fortis Lifestyle",
        points: [
          "Located directly along Chino Roces Avenue, Makati",
          "Lumiventt sky patios provide fresh air and natural light",
          "Stunning Sky Deck Pool and lounge overlooking the skyline",
          "Vertically integrated construction backed by DMCI Homes quality",
        ],
      },
      pricing: {
        title: "Pricing",
        sub_title: "starting from",
        description:
          "Pre-selling pricing offers maximum capital appreciation. Secure early-stage pricing before the next official increase.",
        show_urgency: true,
      },
      overview: {
        title: "Project Overview",
        headline_span: "Fortis Residences.",
      },
      highlights: {
        eyebrow: "Why Fortis Residences",
        items: [
          {
            icon: "shield",
            title: "Vertically Integrated Quality",
            description:
              "Built entirely in-house by DMCI Homes, ensuring strict quality control and structural integrity.",
          },
          {
            icon: "trees",
            title: "Lumiventt Airflow",
            description:
              "Signature three-storey garden atriums channel cool air and daylight throughout the tower.",
          },
          {
            icon: "waves",
            title: "Premium Sky Amenities",
            description:
              "Access a multi-tiered sky pool deck, modern fitness gym, play courts, and sky promenade.",
          },
        ],
      },
      testimonials: {
        stats: [
          { value: "Makati", label: "Address location" },
          { value: "36", label: "Residential levels" },
          { value: "7,200㎡", label: "Land footprint" },
        ],
        testimonials: [
          {
            name: "Maria Santos",
            role: "OFW Investor, Dubai",
            quote:
              "CityQlo made the entire process seamless from abroad. No pressure, just clear advice.",
          },
        ],
      },
      faq: {
        items: [
          {
            q: "Where is Fortis Residences located?",
            a: "Fortis Residences is located along Chino Roces Avenue in Makati City, offering excellent accessibility to the business district and major transportation hubs.",
          },
        ],
      },
      lead_capture: {
        eyebrow: "Inquire Now",
        headline: "Interested in",
        headline_accent: "Fortis Residences?",
        sub: "Leave your details and we'll prepare your personalized price list and payment computation within 24 hours.",
        unit_options: ["1-Bedroom", "2-Bedroom", "3-Bedroom", "Price List Only"],
      },
      media: {
        photos: [
          { tab: "exterior", src: towerImg, thumb: towerImg, title: "Tower Exterior" },
          { tab: "amenities", src: poolImg, thumb: poolImg, title: "Resort Pool" },
          { tab: "interiors", src: interiorImg, thumb: interiorImg, title: "Living Area View" },
        ],
        videos: [{ title: "Project Walkthrough", duration: "3:15", thumb: towerImg }],
      },
      related: {
        related_slugs: ["allegra-garden", "satori-residences", "atherton"],
      },
    },
    units: [
      {
        name: "1-Bedroom",
        area_sqm: 45.0,
        starting_price: 14251000,
        description:
          "Modern 1BR unit ideal for professionals looking for a premium Makati address.",
        profile_target: "Professionals & Investors",
        image_url: interiorImg,
      },
      {
        name: "2-Bedroom",
        area_sqm: 72.0,
        starting_price: 18540000,
        description: "Spacious 2BR configurations with balconies, designed for style and comfort.",
        profile_target: "Couples & Small Families",
        image_url: poolImg,
      },
      {
        name: "3-Bedroom",
        area_sqm: 100.0,
        starting_price: 33904000,
        description: "Premium 3BR units featuring wide layouts, perfect for urban families.",
        profile_target: "Growing Families & Premium Buyers",
        image_url: propOriana,
      },
    ],
  },
};

// Related project cards for the fallback sidebar
const RELATED_PROJECTS_FALLBACK: Record<string, RelatedProject> = {
  "allegra-garden": {
    id: "allegra-garden",
    name: "Allegra Garden Place",
    developer: "DMCI Homes",
    city: "Pasig Boulevard, Pasig City",
    price: "₱5.0M",
    status: "Pre-selling",
    img: towerImg,
    description: "Moroccan-inspired dual-tower sanctuary with lush sky gardens.",
  },
  "satori-residences": {
    id: "satori-residences",
    name: "Satori Residences",
    developer: "DMCI Homes",
    city: "F. Pasco Ave, Santolan, Pasig City",
    price: "₱4.4M",
    status: "RFO",
    img: poolImg,
    description: "Neo-Asian minimalist enclave offering tranquil resort escape.",
  },
  atherton: {
    id: "atherton",
    name: "The Atherton",
    developer: "DMCI Homes",
    city: "Dr. A. Santos Ave, Parañaque",
    price: "₱5.8M",
    status: "RFO",
    img: interiorImg,
    description: "Modern resort-style development on Dr. A. Santos Ave.",
  },
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProjectMeta {
  id: string;
  name: string;
  tagline: string;
  developer: string;
  location: string;
  city: string;
  fullAddress: string;
  status: string;
  architecturalTheme?: string;
  landArea?: string;
  floors?: string;
  totalUnits?: string;
  turnover?: string;
  description: string;
}

interface BuildingData {
  id?: string;
  name: string;
  description?: string;
  floors?: string;
  total_units?: string;
  status: "Under Construction" | "Coming Soon" | "RFO";
  image_url?: string;
}

interface UnitData {
  name: string;
  area_sqm: number;
  starting_price: number;
  description?: string;
  profile_target?: string;
  image_url?: string;
}

interface AmenityItem {
  name: string;
  description: string;
  icon: string;
  category: "wellness" | "recreation" | "social" | "utility";
}

interface NearbyItem {
  name: string;
  time: string;
  category: "transit" | "mall" | "school" | "hospital" | "business" | "leisure";
}

interface RelatedProject {
  id: string;
  name: string;
  developer: string;
  city: string;
  price: string;
  status: string;
  img: string;
  description: string;
}

type SectionPayloads = {
  hero: {
    tagline: string;
    secondary_tagline?: string;
    hero_images: string[];
    cta_primary_text?: string;
    cta_secondary_text?: string;
    logo_url?: string;
  };
  emotional_hook: {
    headline: string;
    sub: string;
    eyebrow?: string;
    points: string[];
    visible?: boolean;
  };
  pricing: {
    title?: string;
    sub_title?: string;
    description?: string;
    show_urgency?: boolean;
    urgency_text_1?: string;
    urgency_text_2?: string;
  };
  overview: { title?: string; headline_span?: string };
  highlights: { eyebrow?: string; items: { icon: string; title: string; description: string }[] };
  amenities: { eyebrow?: string; intro?: string; items: AmenityItem[]; visible?: boolean };
  location: {
    eyebrow?: string;
    intro?: string;
    map_label?: string;
    maps_url?: string;
    map_image_url?: string;
    nearby: NearbyItem[];
  };
  unit_types: { eyebrow?: string; headline?: string };
  decision_guide: {
    eyebrow?: string;
    headline?: string;
    headline_accent?: string;
    visible?: boolean;
  };
  testimonials: {
    stats: { value: string; label: string }[];
    testimonials: { name: string; role: string; quote: string }[];
  };
  faq: { items: { q: string; a: string }[] };
  lead_capture: {
    eyebrow?: string;
    headline?: string;
    headline_accent?: string;
    sub?: string;
    unit_options?: string[];
  };
  media: {
    photos: { tab: string; src: string; thumb: string; title: string }[];
    videos: { title: string; duration: string; thumb: string }[];
  };
  related: { related_slugs: string[] };
};

interface ProjectPageData {
  meta: ProjectMeta;
  units: UnitData[];
  buildings?: BuildingData[];
  sections: Partial<SectionPayloads>;
}

// ─── Read Model → ProjectPageData Adapter ────────────────────────────────────
// Bridges the DB ProjectReadModelDTO contract back to what the page renders.
// When the DB read model is populated this replaces the hardcoded fallback.

function adaptReadModel(rm: any): ProjectPageData | null {
  if (!rm?.project_meta) return null;

  const pm = rm.project_meta;
  const units: UnitData[] = (rm.units || []).map((u: any) => ({
    name: u.name,
    area_sqm: Number(u.area_sqm),
    starting_price: Number(u.starting_price),
    description: u.description,
    profile_target: u.profile_target,
    image_url: u.image_url,
  }));

  const buildings: BuildingData[] = (rm.buildings || []).map((b: any) => ({
    id: b.id,
    name: b.name,
    description: b.description,
    floors: b.floors,
    total_units: b.total_units,
    status: b.status,
    image_url: b.image_url,
  }));

  // Extract section payloads from layout_flow keyed by section type.
  // The DB/admin store section types with hyphenated keys (e.g. "emotional-hook"),
  // but this page reads underscored/renamed keys (e.g. "emotional_hook"). Map between
  // the two so published edits to every section actually render.
  const SECTION_KEY_MAP: Record<string, keyof SectionPayloads> = {
    hero: "hero",
    "emotional-hook": "emotional_hook",
    "pricing-snapshot": "pricing",
    "project-overview": "overview",
    highlights: "highlights",
    amenities: "amenities",
    "location-map": "location",
    "testimonials-slider": "testimonials",
    "faq-list": "faq",
    "lead-capture": "lead_capture",
    "media-experience": "media",
    related: "related",
    "unit-types": "unit_types",
    "decision-guide": "decision_guide",
  };
  const sectionMap: Partial<SectionPayloads> = {};
  for (const sec of rm.layout_flow || []) {
    if (sec.type && sec.payload) {
      const mappedKey = SECTION_KEY_MAP[sec.type] ?? (sec.type as keyof SectionPayloads);
      (sectionMap as any)[mappedKey] = sec.payload;
    }
  }

  return {
    meta: {
      id: pm.slug,
      name: pm.title,
      tagline: sectionMap.hero?.tagline || "",
      developer: pm.developer,
      location: pm.location_district,
      city: pm.city,
      fullAddress: pm.full_address,
      status: pm.listing_status || "",
      architecturalTheme: pm.architectural_theme,
      landArea: pm.land_area,
      floors: pm.floors,
      totalUnits: pm.total_units,
      turnover: pm.turnover,
      description: pm.description,
    },
    units,
    buildings,
    sections: sectionMap,
  };
}

// ─── In-depth pillar guides ──────────────────────────────────────────────────
// Maps a project slug to its dedicated long-form SEO guide route, when one
// exists. Used to surface a contextual "read the full guide" link on the
// project page so the two pages interlink both ways.
const PILLAR_GUIDES: Record<string, string> = {
  "sonora-garden-residences": "/sonora-garden-residences",
  "fortis-residences": "/fortis-residences",
};

// ─── Route ────────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/projects/$slug")({
  loader: async ({ params }) => {
    // 1. Try dynamic DB read model first
    try {
      const rm = await getProjectBySlug({ data: { slug: params.slug } });
      const adapted = adaptReadModel(rm);
      if (adapted) return { project: adapted, source: "db" as const };
    } catch (err) {
      // Log the DB error instead of silently masking it with hardcoded content —
      // a swallowed error here looks exactly like "my published edits didn't show".
      console.error(`Failed to load project "${params.slug}" from DB:`, err);
    }

    // 2. Hardcoded fallback (migration safety net / local dev)
    const fallback = FALLBACK_PROJECTS[params.slug];
    if (!fallback) throw notFound();
    return { project: fallback, source: "fallback" as const };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.project;
    if (!p) return {};
    const firstUnit = p.units[0];
    const startingPrice = firstUnit ? `₱${(firstUnit.starting_price / 1_000_000).toFixed(1)}M` : "";
    const condoDescriptor = p.meta.status ? `${p.meta.status} condominium` : "Condominium";
    const description = `${p.meta.name} by ${p.meta.developer} in ${p.meta.city}. ${condoDescriptor} starting from ${startingPrice}. Get your free price list and payment computation today.`;
    const title = `${p.meta.name} — ${p.meta.city} · CityQlo`;
    const url = `/projects/${p.meta.id}`;

    // Get the first hero image — must be an absolute, publicly accessible URL
    // Local Vite-hashed /assets/... paths are not accessible to social crawlers
    let heroImg = p.sections.hero?.hero_images?.[0] || "";
    const isAbsoluteUrl = heroImg.startsWith("http://") || heroImg.startsWith("https://");
    const isBundledAsset = heroImg.startsWith("/assets/");
    if (!heroImg || isBundledAsset || !isAbsoluteUrl) {
      heroImg = "https://cityqlo.com/Logo.png";
    }

    return {
      meta: [
        { title },
        { name: "description", content: description },
        {
          name: "keywords",
          content: `${p.meta.name}, ${p.meta.city} real estate, ${p.meta.developer} projects, ${p.meta.location} condo, property for sale ${p.meta.city}`,
        },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "CityQlo" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: `https://cityqlo.com/projects/${p.meta.id}` },
        { property: "og:image", content: heroImg },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: heroImg },
      ],
      links: [{ rel: "canonical", href: `https://cityqlo.com/projects/${p.meta.id}` }],
    };
  },
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="eyebrow">404</p>
        <h1 className="display-2 mt-4">Project not found</h1>
        <Link to="/properties" className="btn-ink btn-ink-hover mt-8 inline-flex">
          View all properties
        </Link>
      </div>
    </div>
  ),
  component: ProjectDetailPage,
});

// ─── Icon Renderer ────────────────────────────────────────────────────────────

function IconRenderer({
  name,
  size = 20,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const props = { size, className };
  switch (name) {
    case "waves":
      return <Waves {...props} />;
    case "dumbbell":
      return <Dumbbell {...props} />;
    case "trees":
      return <Trees {...props} />;
    case "users":
      return <Users {...props} />;
    case "coffee":
      return <Coffee {...props} />;
    case "shield":
      return <Shield {...props} />;
    case "building2":
      return <Building2 {...props} />;
    case "zap":
      return <Zap {...props} />;
    case "car":
      return <Car {...props} />;
    case "mappin":
      return <MapPin {...props} />;
    case "shoppingbag":
      return <ShoppingBag {...props} />;
    case "award":
      return <Award {...props} />;
    case "train":
      return <Train {...props} />;
    case "heart":
      return <Heart {...props} />;
    case "briefcase":
      return <Briefcase {...props} />;
    default:
      return <Star {...props} />;
  }
}

function NearbyIcon({ category }: { category: NearbyItem["category"] }) {
  const cls = "h-4 w-4";
  switch (category) {
    case "transit":
      return <Train className={cls} />;
    case "mall":
      return <ShoppingBag className={cls} />;
    case "school":
      return <GraduationCap className={cls} />;
    case "hospital":
      return <Heart className={cls} />;
    case "business":
      return <Briefcase className={cls} />;
    case "leisure":
      return <Trees className={cls} />;
    default:
      return <MapPin className={cls} />;
  }
}

const NEARBY_CATEGORY_COLOR: Record<NearbyItem["category"], string> = {
  transit: "bg-blue-50 text-blue-600",
  mall: "bg-purple-50 text-purple-600",
  school: "bg-green-50 text-green-600",
  hospital: "bg-red-50 text-red-500",
  business: "bg-amber-50 text-amber-600",
  leisure: "bg-teal-50 text-teal-600",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(price: number) {
  if (price >= 1_000_000) return `₱${(price / 1_000_000).toFixed(1)}M`;
  return `₱${price.toLocaleString()}`;
}

// Gallery image with a skeleton shimmer that fades into a cinematic reveal once
// the bitmap decodes. Module-scoped so it isn't re-created on every render.
function MediaCardImage({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {!loaded && <div className="absolute inset-0 skeleton" aria-hidden />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`h-full w-full object-cover transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          loaded ? "scale-100 opacity-100 blur-0" : "scale-[1.04] opacity-0 blur-sm"
        } ${className}`}
      />
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

function ProjectDetailPage() {
  const { project: p } = Route.useLoaderData();
  const { meta, units, sections } = p;

  const { data: siteSettings } = useQuery({
    queryKey: ["portal-settings"],
    queryFn: () => getSiteSettings(),
  });

  const contactSettings = siteSettings?.find((r: any) => r.key === "contact")?.value ?? {};

  const rawPhone = contactSettings.phone || "+639000000000";
  const cleanPhone = rawPhone.replace(/\s+/g, "");

  const rawWhatsapp = contactSettings.whatsapp || "+639000000000";
  const cleanWhatsapp = rawWhatsapp.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}`;

  const rawViber = contactSettings.viber || contactSettings.phone || "+639000000000";
  const isViberLink =
    rawViber.startsWith("http://") ||
    rawViber.startsWith("https://") ||
    rawViber.startsWith("viber://");
  const viberUrl = isViberLink
    ? rawViber
    : `viber://chat?number=%2B${rawViber.replace(/[^0-9]/g, "")}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: meta.name,
    description: meta.description,
    url: `https://cityqlo.com/projects/${meta.id}`,
    image: sections.hero?.hero_images?.[0] || "",
    address: {
      "@type": "PostalAddress",
      streetAddress: meta.fullAddress,
      addressLocality: meta.location,
      addressRegion: meta.city,
      addressCountry: "PH",
    },
    offers: {
      "@type": "AggregateOffer",
      lowPrice: units[0]?.starting_price,
      priceCurrency: "PHP",
      offerCount: units.length,
    },
  };

  const hero = sections.hero ?? { tagline: "", hero_images: [] };
  const hook = sections.emotional_hook ?? { headline: "", sub: "", points: [] };
  const price = sections.pricing ?? {};
  const over = sections.overview ?? {};
  const hlts = sections.highlights ?? { items: [] };
  const amens = sections.amenities ?? { items: [] };
  const loc = sections.location ?? { nearby: [] };
  const testi = sections.testimonials ?? { stats: [], testimonials: [] };
  const faqSec = sections.faq ?? { items: [] };
  // FAQPage structured data — only emitted when the project actually has FAQs,
  // so we never ship an empty schema. Drives FAQ rich results / AI Overviews.
  const faqItems = (faqSec.items || []).filter((f: any) => f?.q && f?.a);
  const faqJsonLd =
    faqItems.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((f: any) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;
  const lead = sections.lead_capture ?? {};
  const media = sections.media ?? { photos: [], videos: [] };
  // 360° tours are keyed by slug (not stored in the CMS yet) so they render
  // whether the page content came from the DB read model or the fallback.
  const tours = PROJECT_TOURS[meta.id] ?? [];
  const rel = sections.related ?? { related_slugs: [] };
  const uts = sections.unit_types ?? {};
  const dg = sections.decision_guide ?? {};

  // ── Hero state
  const heroImages = hero.hero_images || [];
  const [heroSlide, setHeroSlide] = useState(0);
  const heroTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${meta.name} — ${meta.city} · CityQlo`,
          text: `Check out ${meta.name} by ${meta.developer} in ${meta.city}.`,
          url: window.location.href,
        })
        .catch(() => {
          setShowShareModal(true);
        });
    } else {
      setShowShareModal(true);
    }
  };

  // ── Sticky widget state
  const [isScrolled, setIsScrolled] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [exitModalShown, setExitModalShown] = useState(false);
  const [idlePulse, setIdlePulse] = useState(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Media state
  const [mediaTab, setMediaTab] = useState<
    "exterior" | "amenities" | "interiors" | "tour" | "videos"
  >("exterior");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeVideo, setActiveVideo] = useState<any | null>(null);
  const touchStartX = useRef(0);

  // ── FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // ── Price-list lead magnet
  const [priceListOpen, setPriceListOpen] = useState(false);

  // ── Form state
  const defaultInterest = lead.unit_options?.[2] || "2-Bedroom";
  const [form, setForm] = useState({ name: "", mobile: "", email: "", interest: defaultInterest });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formStartedAt] = useState(() => Date.now());

  const submitLead = useCallback(
    async (data: { name: string; mobile: string; email: string; interest: string }) => {
      const cleanMobile = data.mobile.replace(/[^0-9+]/g, "");
      await createLead({
        data: {
          name: data.name.trim(),
          email: data.email.trim() || `lead-${cleanMobile}@cityqlo.placeholder`,
          phone: data.mobile.trim(),
          message: `Project: ${meta.name} (${meta.city}) · Interested in: ${data.interest}`,
          source: "website",
          form_started_at: formStartedAt,
        },
      });
    },
    [meta.name, meta.city, formStartedAt],
  );

  // ── Hero carousel
  useEffect(() => {
    if (heroImages.length <= 1) return;
    heroTimerRef.current = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => {
      if (heroTimerRef.current) clearInterval(heroTimerRef.current);
    };
  }, [heroImages.length]);

  // ── Scroll behavior for sticky widget
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Idle timer for CTA pulse
  const resetIdleTimer = useCallback(() => {
    setIdlePulse(false);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => setIdlePulse(true), 10000);
  }, []);

  useEffect(() => {
    resetIdleTimer();
    window.addEventListener("mousemove", resetIdleTimer);
    window.addEventListener("keydown", resetIdleTimer);
    window.addEventListener("scroll", resetIdleTimer, { passive: true });
    return () => {
      window.removeEventListener("mousemove", resetIdleTimer);
      window.removeEventListener("keydown", resetIdleTimer);
      window.removeEventListener("scroll", resetIdleTimer);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [resetIdleTimer]);

  // ── Exit intent
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 10 && !exitModalShown) {
        setShowExitModal(true);
        setExitModalShown(true);
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [exitModalShown]);

  // ── Form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.mobile) {
      toast.error("Please fill in your name and mobile number.");
      return;
    }
    setFormSubmitting(true);
    try {
      await submitLead(form);
      toast.success("Inquiry sent! We'll reach out within 24 hours.", {
        description: "Check your Viber/WhatsApp.",
      });
      setForm({ name: "", mobile: "", email: "", interest: defaultInterest });
    } catch (error) {
      console.error("Lead submission error:", error);
      toast.error("Something went wrong", {
        description: "Please try again, or call/Viber us directly.",
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  const scrollToForm = () => {
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // ── Media filtering
  const visibleMedia = (media.photos || []).filter((m) =>
    mediaTab !== "videos" ? m.tab === mediaTab : false,
  );

  // ── Media browser metadata (real counts, so the row stays honest as the CMS grows)
  const photoCount = (media.photos || []).length;
  const videoCount = (media.videos || []).length;
  const hasTour = tours.length > 0;

  // ── Swipeable lightbox navigation (wraps within the active category's photos)
  const showPrevPhoto = useCallback(
    () =>
      setLightboxIndex((i) =>
        i === null || visibleMedia.length === 0
          ? i
          : (i - 1 + visibleMedia.length) % visibleMedia.length,
      ),
    [visibleMedia.length],
  );
  const showNextPhoto = useCallback(
    () =>
      setLightboxIndex((i) =>
        i === null || visibleMedia.length === 0 ? i : (i + 1) % visibleMedia.length,
      ),
    [visibleMedia.length],
  );
  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      else if (e.key === "ArrowLeft") showPrevPhoto();
      else if (e.key === "ArrowRight") showNextPhoto();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, showPrevPhoto, showNextPhoto]);

  // ── Related projects resolve: prefer live DB data, fall back to the demo map
  // for any slug not found among published projects (keeps local/demo working).
  const relatedSlugs = rel.related_slugs || [];
  const { data: dbRelated } = useQuery({
    queryKey: ["related-projects", relatedSlugs],
    queryFn: () => getRelatedProjects({ data: { slugs: relatedSlugs } }),
    enabled: relatedSlugs.length > 0,
  });
  const relatedProjects = relatedSlugs
    .map((slug) => {
      const fromDb = (dbRelated as RelatedProject[] | undefined)?.find((r) => r.id === slug);
      return fromDb || RELATED_PROJECTS_FALLBACK[slug];
    })
    .filter(Boolean) as RelatedProject[];

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Properties", href: "/properties" },
          { name: meta.name, href: `/projects/${meta.id}` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <PriceListMagnet
        open={priceListOpen}
        onClose={() => setPriceListOpen(false)}
        project={{
          name: meta.name,
          developer: meta.developer,
          city: meta.city,
          location: meta.location,
          status: meta.status,
          turnover: meta.turnover,
          fullAddress: meta.fullAddress,
        }}
        units={units}
        onLeadSubmit={submitLead}
        onTalkToAdvisor={scrollToForm}
      />
      {/* ═══════════════════════════════════════════════════
          STICKY DESKTOP LEAD WIDGET
      ═══════════════════════════════════════════════════ */}
      <div
        className={`hidden xl:flex fixed right-6 top-28 z-40 flex-col gap-3 transition-all duration-500`}
        style={{
          opacity: isScrolled ? 1 : 0,
          pointerEvents: isScrolled ? "auto" : "none",
          transform: isScrolled ? "translateY(0)" : "translateY(16px)",
        }}
      >
        <div className="w-56 bg-white rounded-2xl shadow-[0_16px_64px_-12px_rgba(20,26,38,0.18)] border border-border/60 overflow-hidden">
          {/* Widget Header */}
          <div className="bg-ink px-4 py-3 text-white">
            <p className="text-[10px] uppercase tracking-widest font-semibold text-white/50 mb-0.5">
              Quick Actions
            </p>
            <p className="font-bold text-[13px] leading-tight">{meta.name}</p>
            <p className="text-[10px] text-white/60 mt-0.5">
              {meta.status ? `${meta.status} · ${meta.city}` : meta.city}
            </p>
          </div>

          {/* Primary CTA */}
          <button
            id="widget-get-price-list"
            onClick={() => setPriceListOpen(true)}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3.5 text-[12.5px] font-bold tracking-wide transition-all duration-300 cursor-pointer ${
              idlePulse
                ? "bg-primary text-white animate-pulse"
                : "bg-primary text-white hover:bg-primary/90"
            }`}
            style={{ animationDuration: "1.5s" }}
          >
            <FileText size={14} />
            Get Price List
          </button>

          {/* Secondary CTAs */}
          <div className="p-3 flex flex-col gap-2">
            <button
              id="widget-free-computation"
              onClick={() => setPriceListOpen(true)}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-surface text-ink text-[12px] font-semibold hover:bg-border/40 transition-colors cursor-pointer"
            >
              <Zap size={13} className="text-primary" />
              Free Computation
            </button>
            <button
              id="widget-schedule-viewing"
              onClick={scrollToForm}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-surface text-ink text-[12px] font-semibold hover:bg-border/40 transition-colors cursor-pointer"
            >
              <Eye size={13} className="text-primary" />
              Schedule Viewing
            </button>

            <div className="border-t border-border/50 my-1" />

            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <a
                  href={`tel:${cleanPhone}`}
                  id="widget-call"
                  className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg bg-surface text-[11px] font-semibold text-ink hover:bg-border/40 transition-colors"
                >
                  <Phone size={12} /> Call
                </a>
                <a
                  href={viberUrl}
                  id="widget-viber"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg bg-surface text-[11px] font-semibold text-ink hover:bg-border/40 transition-colors"
                >
                  <MessageCircle size={12} /> Viber
                </a>
              </div>
              <button
                id="widget-share"
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-surface text-[11px] font-semibold text-ink hover:bg-border/40 transition-colors cursor-pointer"
              >
                <Share2 size={12} /> Share Property
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          STICKY MOBILE BOTTOM BAR
      ═══════════════════════════════════════════════════ */}
      <div
        className={`xl:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-border shadow-[0_-4px_24px_-4px_rgba(20,26,38,0.12)] transition-all duration-500`}
        style={{
          transform: isScrolled ? "translateY(0)" : "translateY(100%)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <div className="flex items-stretch h-14">
          <a
            href={`tel:${cleanPhone}`}
            id="mobile-bar-call"
            className="flex-1 flex flex-col items-center justify-center gap-0.5 text-ink/70 hover:text-primary transition-colors active:bg-surface"
          >
            <Phone size={17} />
            <span className="text-[9px] font-bold uppercase tracking-wider">Call</span>
          </a>
          <a
            href={viberUrl}
            id="mobile-bar-viber"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex flex-col items-center justify-center gap-0.5 text-ink/70 hover:text-primary transition-colors active:bg-surface"
          >
            <MessageCircle size={17} />
            <span className="text-[9px] font-bold uppercase tracking-wider">Viber</span>
          </a>
          <button
            id="mobile-bar-share"
            onClick={handleShare}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 text-ink/70 hover:text-primary transition-colors active:bg-surface cursor-pointer"
          >
            <Share2 size={17} />
            <span className="text-[9px] font-bold uppercase tracking-wider">Share</span>
          </button>
          <button
            id="mobile-bar-price-list"
            onClick={() => setPriceListOpen(true)}
            className="flex-[2] flex items-center justify-center gap-2 bg-primary text-white text-[12.5px] font-bold tracking-wide cursor-pointer hover:bg-primary/90 transition-colors"
          >
            <FileText size={15} />
            Get Price List
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          EXIT INTENT MODAL
      ═══════════════════════════════════════════════════ */}
      {/* ═══════════════════════════════════════════════════
          SHARE MODAL
      ═══════════════════════════════════════════════════ */}
      {showShareModal && (
        <div
          id="share-modal"
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-md"
          onClick={() => setShowShareModal(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-[0_32px_80px_-20px_rgba(20,26,38,0.35)] p-8 max-w-sm w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-ink transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#3B82F6]/10 flex items-center justify-center mx-auto mb-4">
                <Share2 size={22} className="text-[#3B82F6]" />
              </div>
              <h3 className="text-[20px] font-bold text-ink leading-tight">Share Property</h3>
              <p className="text-[14px] text-muted-foreground mt-2">
                Share <strong>{meta.name}</strong> with your family, friends, or network.
              </p>
            </div>

            {/* Social Sharing Icons Grid */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                {
                  name: "Facebook",
                  url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`,
                  color: "bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white",
                  svg: (
                    <svg
                      className="h-5.5 w-5.5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ),
                },
                {
                  name: "X",
                  url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}&text=${encodeURIComponent(`${meta.name} — ${meta.city} · CityQlo`)}`,
                  color: "bg-black/5 text-black hover:bg-black hover:text-white",
                  svg: (
                    <svg
                      className="h-5.5 w-5.5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  ),
                },
                {
                  name: "WhatsApp",
                  url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${meta.name} — ${meta.city} · CityQlo ${typeof window !== "undefined" ? window.location.href : ""}`)}`,
                  color: "bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white",
                  svg: (
                    <svg
                      className="h-5.5 w-5.5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.16L2 22l5.002-1.332A9.954 9.954 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm4.56 13.06c-.22.617-.98 1.134-1.62 1.257-.59.112-1.35.203-3.95-.87-3.32-1.374-5.46-4.757-5.625-4.978-.165-.221-1.32-1.756-1.32-3.35 0-1.593.83-2.378 1.127-2.699.3-.321.66-.401.88-.401.22 0 .44.004.63.012.2.008.47-.076.73.562.26.638.9 2.197.98 2.358.08.16.13.348.02.562-.11.214-.16.348-.32.535-.16.188-.34.42-.49.562-.165.152-.338.318-.147.647.19.329.84 1.377 1.8 2.234 1.23 1.1 2.27 1.44 2.59 1.6.32.16.51.13.7-.09.19-.22.82-.95 1.04-1.28.22-.33.44-.27.74-.16.3.11 1.91.9 2.24 1.06.33.16.55.24.63.38.08.14.08.816-.14 1.433z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ),
                },
                {
                  name: "Viber",
                  url: `viber://forward?text=${encodeURIComponent(`${meta.name} — ${meta.city} · CityQlo ${typeof window !== "undefined" ? window.location.href : ""}`)}`,
                  color: "bg-[#7309F3]/10 text-[#7309F3] hover:bg-[#7309F3] hover:text-white",
                  svg: (
                    <svg
                      className="h-5.5 w-5.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  ),
                },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex flex-col items-center justify-center p-3.5 rounded-2xl transition-all duration-300 ${social.color}`}
                >
                  {social.svg}
                  <span className="text-[10px] font-semibold mt-2">{social.name}</span>
                </a>
              ))}
            </div>

            {/* Copy Link Section */}
            <div className="flex gap-2 items-center bg-surface border border-border/80 rounded-xl p-2 pl-3">
              <input
                type="text"
                readOnly
                value={typeof window !== "undefined" ? window.location.href : ""}
                className="flex-1 bg-transparent border-none outline-none text-[12.5px] text-muted-foreground select-all"
              />
              <button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Link copied to clipboard!");
                  }
                }}
                className="bg-primary text-white font-semibold text-[11px] px-3.5 py-2 rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}

      {showExitModal && (
        <div
          id="exit-intent-modal"
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
        >
          <div className="bg-white rounded-3xl shadow-[0_32px_80px_-20px_rgba(20,26,38,0.35)] p-8 max-w-sm w-full relative">
            <button
              onClick={() => setShowExitModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-ink transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <FileText size={22} className="text-primary" />
              </div>
              <h3 className="text-[20px] font-bold text-ink leading-tight">Before you go —</h3>
              <p className="text-[14px] text-muted-foreground mt-2">
                Get the full price list for <strong>{meta.name}</strong> sent to your phone.
              </p>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const name = String(fd.get("name") || "").trim();
                const mobile = String(fd.get("mobile") || "").trim();
                if (!name || !mobile) {
                  toast.error("Please fill in your name and mobile number.");
                  return;
                }
                try {
                  await submitLead({ name, mobile, email: "", interest: "Price List Only" });
                  setShowExitModal(false);
                  toast.success("Price list request received! We'll reach out shortly.");
                } catch (error) {
                  console.error("Lead submission error:", error);
                  toast.error("Something went wrong", {
                    description: "Please try again, or call/Viber us directly.",
                  });
                }
              }}
              className="flex flex-col gap-3"
            >
              <input
                type="text"
                name="name"
                placeholder="Your name"
                required
                className="w-full border border-border rounded-xl px-4 py-3 text-[14px] outline-none focus:border-primary transition-colors"
              />
              <input
                type="tel"
                name="mobile"
                placeholder="Mobile / Viber number"
                required
                className="w-full border border-border rounded-xl px-4 py-3 text-[14px] outline-none focus:border-primary transition-colors"
              />
              <button
                type="submit"
                className="w-full bg-primary text-white font-bold py-3.5 rounded-xl text-[14px] hover:bg-primary/90 transition-colors cursor-pointer"
              >
                Send Me the Price List →
              </button>
              <button
                type="button"
                onClick={() => setShowExitModal(false)}
                className="text-[12px] text-muted-foreground hover:text-ink transition-colors cursor-pointer"
              >
                No thanks, I'll continue browsing
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
          LIGHTBOX
      ═══════════════════════════════════════════════════ */}
      {lightboxIndex !== null && visibleMedia[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 p-4"
          onClick={() => setLightboxIndex(null)}
          onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            const dx = e.changedTouches[0].clientX - touchStartX.current;
            if (dx > 50) showPrevPhoto();
            else if (dx < -50) showNextPhoto();
          }}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            aria-label="Close gallery"
            className="absolute right-6 top-6 cursor-pointer text-white/70 hover:text-white"
          >
            <X size={28} />
          </button>

          {visibleMedia.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  showPrevPhoto();
                }}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 md:left-6"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  showNextPhoto();
                }}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 md:right-6"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}

          <figure className="flex flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
            <img
              key={visibleMedia[lightboxIndex].src}
              src={visibleMedia[lightboxIndex].src}
              alt={visibleMedia[lightboxIndex].title}
              className="max-h-[82vh] max-w-[92vw] rounded-2xl object-contain"
            />
            <figcaption className="flex items-center gap-3 text-[13px] text-white/80">
              <span className="font-semibold">{visibleMedia[lightboxIndex].title}</span>
              <span className="text-white/40">·</span>
              <span className="tabular-nums text-white/60">
                {lightboxIndex + 1} / {visibleMedia.length}
              </span>
            </figcaption>
          </figure>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
          1. HERO SECTION
      ═══════════════════════════════════════════════════ */}
      <section className="relative h-[90vh] min-h-[580px] w-full overflow-hidden bg-ink">
        {heroImages.map((img, i) => (
          <div
            key={img + i}
            className="absolute inset-0 transition-opacity duration-[1200ms] ease-in-out"
            style={{ opacity: i === heroSlide ? 1 : 0 }}
          >
            <img
              src={img}
              alt={`${meta.name} - view ${i + 1}`}
              className="h-full w-full object-cover"
              loading={i === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}

        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative z-10 flex h-full items-end pb-20 md:pb-28">
          <div className="container-prose w-full">
            <div className="max-w-3xl">
              {hero.logo_url && (
                <div className="rise mb-4 max-w-[160px] sm:max-w-[220px]">
                  <img
                    src={hero.logo_url}
                    alt={`${meta.name} logo`}
                    className="max-h-14 object-contain brightness-0 invert"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                </div>
              )}
              <h1 className="display-1 rise rise-delay-1 mt-4 text-white leading-[1.02] text-shadow-hero-lg">
                {meta.name}
              </h1>
              <p className="rise rise-delay-2 mt-3 text-white/80 text-[17px] font-medium leading-snug">
                {hero.tagline}
              </p>
              {hero.secondary_tagline && (
                <p className="rise rise-delay-3 mt-2 text-white/60 text-[14px] font-medium leading-snug">
                  {hero.secondary_tagline}
                </p>
              )}
            </div>

            {/* Slide dots */}
            {heroImages.length > 1 && (
              <div className="absolute bottom-8 right-6 flex gap-2">
                {heroImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setHeroSlide(i)}
                    className="cursor-pointer transition-all duration-400"
                    style={{
                      width: i === heroSlide ? "28px" : "8px",
                      height: "8px",
                      borderRadius: "999px",
                      background: i === heroSlide ? "white" : "rgba(255,255,255,0.4)",
                    }}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          10. MEDIA EXPERIENCE
      ═══════════════════════════════════════════════════ */}
      <section className="py-12 md:px-4 md:py-28">
        <div className="container-prose">
          {/* Header — shared; tighter rhythm on mobile so it reads as a continuation */}
          <div className="text-center max-w-2xl mx-auto mb-4 md:mb-12">
            <Reveal>
              <p className="eyebrow">
                <span className="gold-rule" />
                Media
              </p>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="display-2 mt-4 md:mt-5">
                Experience the <span className="text-primary">Property</span>
              </h2>
            </Reveal>
            <Reveal delay={180}>
              <p className="text-[15px] text-muted-foreground mt-2 md:mt-3">
                Watch before you visit.
              </p>
            </Reveal>
          </div>

          {/* ══════════════════════════════════════════════════════════
              MOBILE (below md) — premium swipe-first media browser
          ══════════════════════════════════════════════════════════ */}
          <div className="md:hidden">
            {/* Metadata row — muted, real counts */}
            <div className="mb-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[12px] font-medium text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">📸 {photoCount} Photos</span>
              <span className="text-border">•</span>
              <span className="inline-flex items-center gap-1.5">🎥 {videoCount} Videos</span>
              {hasTour && (
                <>
                  <span className="text-border">•</span>
                  <span className="inline-flex items-center gap-1.5">🌐 360° Tour</span>
                </>
              )}
            </div>

            {/* Scrollable, snapping category tabs */}
            <div className="-mx-5 mb-5 flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth px-5 pb-1 [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {[
                { key: "exterior", label: "Exterior", Icon: Building2 },
                { key: "amenities", label: "Amenities", Icon: Waves },
                { key: "interiors", label: "Interiors", Icon: Sofa },
                { key: "videos", label: "Videos", Icon: Video },
                ...(hasTour ? [{ key: "tour", label: "360° Tour", Icon: Globe }] : []),
              ].map(({ key, label, Icon }) => {
                const active = mediaTab === key;
                return (
                  <button
                    key={key}
                    onClick={(e) => {
                      setMediaTab(key as typeof mediaTab);
                      e.currentTarget.scrollIntoView({
                        behavior: "smooth",
                        inline: "center",
                        block: "nearest",
                      });
                    }}
                    aria-pressed={active}
                    className={`inline-flex min-h-[48px] shrink-0 snap-start items-center gap-2 rounded-full px-5 text-[13px] font-bold tracking-wide transition-all duration-300 ${
                      active
                        ? "bg-primary text-white shadow-[0_10px_28px_-10px_var(--primary)]"
                        : "border border-border/70 bg-surface text-muted-foreground"
                    }`}
                  >
                    <Icon size={16} className={active ? "text-white" : "text-muted-foreground"} />
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Tab content — quick opacity fade on switch (keyed remount) */}
            <div key={mediaTab} className="animate-in fade-in-0 duration-300 ease-out">
              {/* Photo categories → horizontal swipe gallery */}
              {mediaTab !== "videos" && mediaTab !== "tour" && (
                <>
                  <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-2 [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {visibleMedia.map((item, i) => (
                      <button
                        key={item.src + i}
                        onClick={() => setLightboxIndex(i)}
                        aria-label={`Open ${item.title}`}
                        className="group relative aspect-[4/5] w-[78%] shrink-0 snap-center overflow-hidden rounded-[20px] shadow-soft transition-shadow duration-300 active:shadow-lift"
                      >
                        <MediaCardImage
                          src={item.thumb}
                          alt={item.title}
                          className="group-active:scale-[1.05]"
                        />
                        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent" />
                        <span className="pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                          <Camera size={12} /> {item.title}
                        </span>
                        <span className="pointer-events-none absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/85 opacity-0 shadow-lift transition-opacity duration-300 group-active:opacity-100">
                          <ZoomIn size={15} className="text-ink" />
                        </span>
                      </button>
                    ))}
                  </div>

                  {visibleMedia.length > 0 && (
                    <button
                      onClick={() => setLightboxIndex(0)}
                      className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-primary"
                    >
                      View Full Gallery <ArrowRight size={15} />
                    </button>
                  )}
                </>
              )}

              {/* Videos → horizontal swipe */}
              {mediaTab === "videos" && (
                <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-2 [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {(media.videos || []).map((vid) => (
                    <button
                      key={vid.title}
                      onClick={() => setActiveVideo(vid)}
                      className="group relative aspect-[4/5] w-[78%] shrink-0 snap-center overflow-hidden rounded-[20px] shadow-soft transition-shadow duration-300 active:shadow-lift"
                    >
                      <MediaCardImage src={vid.thumb} alt={vid.title} />
                      <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/35">
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lift">
                          <Play size={22} className="ml-1 text-ink" />
                        </span>
                        <span className="text-[13px] font-bold text-white">{vid.title}</span>
                        <span className="font-mono text-[11px] text-white/70">{vid.duration}</span>
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* 360° tour */}
              {mediaTab === "tour" && (
                <div>
                  <TourViewer tours={tours} poster={poolImg} />
                  <p className="mt-3 text-center text-[12.5px] text-muted-foreground">
                    Drag to look around · tap the hotspots to move between rooms.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════
              DESKTOP (md and up) — original layout, unchanged
          ══════════════════════════════════════════════════════════ */}
          <div className="hidden md:block">
            {/* Tabs */}
            <Reveal delay={200}>
              <div className="flex flex-wrap gap-2 mb-8">
                {(
                  [
                    "exterior",
                    "amenities",
                    "interiors",
                    ...(tours.length ? (["tour"] as const) : []),
                    "videos",
                  ] as ("exterior" | "amenities" | "interiors" | "tour" | "videos")[]
                ).map((tab) => {
                  const labels: Record<
                    "exterior" | "amenities" | "interiors" | "tour" | "videos",
                    string
                  > = {
                    exterior: "🏙️ Exterior",
                    amenities: "🌊 Amenities",
                    interiors: "🛋️ Interiors",
                    tour: "🌐 360° Tour",
                    videos: "▶️ Videos",
                  };
                  return (
                    <button
                      key={tab}
                      id={`media-tab-${tab}`}
                      onClick={() => setMediaTab(tab)}
                      className={`px-5 py-2.5 rounded-full text-[12.5px] font-bold tracking-wide transition-all duration-300 cursor-pointer ${
                        mediaTab === tab
                          ? "bg-ink text-white shadow-sm"
                          : "bg-surface border border-border/60 text-muted-foreground hover:text-ink"
                      }`}
                    >
                      {labels[tab]}
                    </button>
                  );
                })}
              </div>
            </Reveal>

            {/* Photo grid */}
            {mediaTab !== "videos" && mediaTab !== "tour" && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {visibleMedia.map((item, i) => (
                  <Reveal key={item.src + i} delay={i * 60}>
                    <div
                      className={`group relative overflow-hidden rounded-2xl cursor-pointer shadow-soft hover:shadow-lift transition-all duration-500 ${i === 0 ? "md:col-span-2 aspect-[16/9]" : "aspect-[4/3]"}`}
                      onClick={() => setLightboxIndex(i)}
                    >
                      <img
                        src={item.thumb}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1500ms]"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-400 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lift">
                          <ZoomIn size={16} className="text-ink" />
                        </div>
                      </div>
                      <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="bg-black/60 text-white text-[11px] font-semibold px-3 py-1 rounded-full">
                          {item.title}
                        </span>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            )}

            {/* 360° Tour tab */}
            {mediaTab === "tour" && (
              <Reveal>
                <TourViewer tours={tours} poster={poolImg} />
                <p className="mt-3 text-[12.5px] text-muted-foreground text-center">
                  Drag to look around · tap the hotspots to move between rooms. Bare-unit tours show
                  actual turnover condition; the model unit is styled for illustration.
                </p>
              </Reveal>
            )}

            {/* Videos tab */}
            {mediaTab === "videos" && (
              <Reveal>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {(media.videos || []).map((vid) => (
                    <div
                      key={vid.title}
                      className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-soft hover:shadow-lift transition-all duration-400"
                      onClick={() => setActiveVideo(vid)}
                    >
                      <img
                        src={vid.thumb}
                        alt={vid.title}
                        className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-[1200ms]"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex flex-col items-center justify-center gap-3">
                        <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lift">
                          <Play size={22} className="text-ink ml-1" />
                        </div>
                        <p className="text-white font-bold text-[13px]">{vid.title}</p>
                        <p className="text-white/70 text-[11px] font-mono">{vid.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            )}
          </div>

          {/* Video modal — shared across breakpoints */}
          {activeVideo && (
            <div
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
              onClick={() => setActiveVideo(null)}
            >
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-6 right-6 text-white/70 hover:text-white cursor-pointer"
              >
                <X size={28} />
              </button>
              <div
                className="bg-black rounded-2xl overflow-hidden max-w-3xl w-full shadow-[0_32px_80px_rgba(0,0,0,0.8)]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="aspect-video flex items-center justify-center bg-ink/80">
                  {(() => {
                    const url = activeVideo.url;
                    const title = activeVideo.title;
                    if (!url) {
                      return (
                        <div className="text-center text-white/60">
                          <Play size={48} className="mx-auto mb-4 opacity-40" />
                          <p className="text-[14px]">No video link configured.</p>
                          <p className="text-[12px] mt-1 opacity-60">
                            Please add a link in the project editor.
                          </p>
                        </div>
                      );
                    }

                    // YouTube Match
                    const ytRegex =
                      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
                    const ytMatch = url.match(ytRegex);
                    if (ytMatch && ytMatch[1]) {
                      return (
                        <iframe
                          src={`https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`}
                          title={title}
                          className="w-full h-full border-0 aspect-video animate-in fade-in duration-300"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      );
                    }

                    // Facebook Match
                    if (url.includes("facebook.com") || url.includes("fb.watch")) {
                      return (
                        <iframe
                          src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&t=0&autoplay=true`}
                          title={title}
                          className="w-full h-full border-0 aspect-video animate-in fade-in duration-300"
                          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      );
                    }

                    // Direct/other video URL
                    return (
                      <video
                        src={url}
                        title={title}
                        controls
                        autoPlay
                        className="w-full h-full aspect-video object-contain animate-in fade-in duration-300"
                      />
                    );
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          2. EMOTIONAL HOOK
      ═══════════════════════════════════════════════════ */}
      {sections.emotional_hook && !sections.emotional_hook.hide && (
        <section className="bg-ink text-white px-4 py-20 md:py-28 overflow-hidden relative">
          <div
            aria-hidden
            className="absolute -right-48 top-0 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
            style={{
              background: "radial-gradient(closest-side, oklch(0.43 0.20 258), transparent)",
            }}
          />
          <div
            aria-hidden
            className="absolute -left-24 bottom-0 w-[400px] h-[400px] rounded-full opacity-10 pointer-events-none"
            style={{
              background: "radial-gradient(closest-side, oklch(0.74 0.137 79), transparent)",
            }}
          />

          <div className="container-prose relative z-10">
            <div className="max-w-4xl">
              <Reveal>
                <p className="eyebrow text-white/40">
                  <span className="gold-rule" />
                  {hook.eyebrow || "The Lifestyle"}
                </p>
              </Reveal>
              <Reveal delay={120}>
                <h2 className="display-2 mt-6 text-white leading-[1.05]">
                  {hook.headline}
                  <span className="block text-primary mt-1">{hook.sub}</span>
                </h2>
              </Reveal>
            </div>

            <div className="mt-14 grid md:grid-cols-2 gap-4 max-w-3xl">
              {(hook.points || []).map((point, i) => (
                <Reveal key={point} delay={180 + i * 80}>
                  <div className="flex items-start gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-5 py-4">
                    <div className="w-5 h-5 rounded-full bg-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={11} className="text-white" />
                    </div>
                    <p className="text-white/80 text-[14.5px] font-medium leading-snug">{point}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════
          3. PRICING SNAPSHOT + SCARCITY
      ═══════════════════════════════════════════════════ */}
      <section className="px-4 py-20 md:py-28 surface">
        <div className="container-prose">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Pricing */}
            <div>
              <Reveal>
                <p className="eyebrow">
                  <span className="gold-rule" />
                  {price.title || "Pricing"}
                </p>
              </Reveal>
              <Reveal delay={100}>
                <h2 className="display-2 mt-5">
                  Own a unit
                  <span className="block text-primary">{price.sub_title || "for as low as"}</span>
                </h2>
              </Reveal>
              <Reveal delay={180}>
                <p className="text-[15px] text-muted-foreground mt-4 max-w-md leading-relaxed">
                  {price.description ||
                    "Pre-selling prices are currently at their lowest. Every quarter brings a price increase as construction progresses."}
                </p>
              </Reveal>

              {/* Pricing table */}
              {units.length > 0 && (
                <Reveal delay={260}>
                  <div className="mt-8 bg-white rounded-2xl shadow-soft border border-border/50 overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-ink text-white">
                          <th className="text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-widest">
                            Unit Type
                          </th>
                          <th className="text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-widest">
                            Floor Area
                          </th>
                          <th className="text-right px-5 py-3.5 text-[11px] font-bold uppercase tracking-widest">
                            Starting Price
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {units.map((unit, i) => (
                          <tr
                            key={unit.name + i}
                            className={`border-t border-border/50 ${i % 2 === 0 ? "bg-white" : "bg-surface/60"} hover:bg-primary/5 transition-colors`}
                          >
                            <td className="px-5 py-3.5 font-bold text-[14px] text-ink">
                              {unit.name}
                            </td>
                            <td className="px-5 py-3.5 text-[13px] text-muted-foreground font-mono">
                              {unit.area_sqm} sq.m.
                            </td>
                            <td className="px-5 py-3.5 text-right font-extrabold text-[15px] text-ink">
                              {formatPrice(unit.starting_price)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="px-5 py-3 bg-primary/5 border-t border-border/50">
                      <button
                        onClick={() => setPriceListOpen(true)}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white font-bold rounded-xl text-[13.5px] hover:bg-primary/90 transition-colors cursor-pointer"
                      >
                        <FileText size={15} />
                        Get Full Price List & Payment Terms
                      </button>
                    </div>
                  </div>
                </Reveal>
              )}
            </div>

            {/* Right: Scarcity + Urgency */}
            <Reveal delay={200}>
              <div className="flex flex-col gap-5">
                <div className="bg-white rounded-2xl border border-border shadow-soft p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                    <p className="font-bold text-ink text-[14px]">Currently Available</p>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: "Project Phase", value: "Pre-Selling", color: "text-primary" },
                      { label: "Turnover", value: meta.turnover || "2027–2028", color: "text-ink" },
                      {
                        label: "Payment Schemes",
                        value: "Bank · In-house · PAG-IBIG",
                        color: "text-ink",
                      },
                    ].map(({ label, value, color }) => (
                      <div
                        key={label}
                        className="flex items-center justify-between py-2 border-b border-border/40 last:border-0"
                      >
                        <span className="text-[12.5px] text-muted-foreground font-medium">
                          {label}
                        </span>
                        <span className={`text-[13px] font-bold ${color}`}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {price.show_urgency !== false && (
                  <>
                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <Clock size={16} className="text-amber-600" />
                        </div>
                        <div>
                          <p className="font-bold text-ink text-[14px]">Pre-selling advantage</p>
                          <p className="text-[13px] text-muted-foreground mt-1 leading-relaxed">
                            {price.urgency_text_1 ||
                              "Prices are expected to increase every quarter as construction milestones are reached."}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-primary/5 border border-primary/15 rounded-2xl p-5">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <Star size={16} className="text-primary" />
                        </div>
                        <div>
                          <p className="font-bold text-ink text-[14px]">Limited units remaining</p>
                          <p className="text-[13px] text-muted-foreground mt-1 leading-relaxed">
                            {price.urgency_text_2 ||
                              "Selected floors and unit types are selling fast. Secure your preferred floor while available."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          4. PROJECT OVERVIEW
      ═══════════════════════════════════════════════════ */}
      <section className="px-4 py-20 md:py-28">
        <div className="container-prose">
          <div className="grid lg:grid-cols-12 gap-14 items-start">
            <div className="lg:col-span-5">
              <Reveal>
                <p className="eyebrow">
                  <span className="gold-rule" />
                  {over.title || "Project Overview"}
                </p>
              </Reveal>
              <Reveal delay={120}>
                <h2 className="display-2 mt-5">
                  About
                  <br />
                  <span className="text-primary">{over.headline_span || meta.name}</span>
                </h2>
              </Reveal>
              <Reveal delay={200}>
                <p className="lede mt-8 text-[16px] leading-[1.75]">{meta.description}</p>
              </Reveal>
            </div>

            <div className="lg:col-span-7 lg:pl-10">
              <Reveal delay={160}>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { label: "Developer", value: meta.developer },
                    { label: "Location", value: meta.fullAddress },
                    { label: "Architectural Theme", value: meta.architecturalTheme || "" },
                    { label: "Land Area", value: meta.landArea || "" },
                    { label: "Building Height", value: meta.floors || "" },
                    { label: "Total Units", value: meta.totalUnits || "" },
                    { label: "Projected Turnover", value: meta.turnover || "" },
                  ]
                    .filter((d) => d.value)
                    .map(({ label, value }) => (
                      <div
                        key={label}
                        className="bg-surface rounded-2xl p-5 border border-border/40"
                      >
                        <p className="text-[10.5px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                          {label}
                        </p>
                        <p className="text-[14px] font-semibold text-ink leading-snug">{value}</p>
                      </div>
                    ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          BUILDINGS & TOWERS SECTION
      ═══════════════════════════════════════════════════ */}
      {p.buildings && p.buildings.length > 0 && (
        <section className="px-4 py-20 md:py-28 bg-surface">
          <div className="container-prose">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Reveal>
                <p className="eyebrow">
                  <span className="gold-rule" />
                  Development
                </p>
              </Reveal>
              <Reveal delay={100}>
                <h2 className="display-2 mt-5">
                  Buildings &amp; <span className="text-primary">Towers</span>
                </h2>
              </Reveal>
              <Reveal delay={180}>
                <p className="text-[15px] text-muted-foreground mt-3">
                  Explore the specific towers and building phases of this project.
                </p>
              </Reveal>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {p.buildings.map((bld, i) => {
                return (
                  <Reveal key={bld.id || bld.name + i} delay={i * 80}>
                    <div className="bg-white rounded-3xl border border-border/40 overflow-hidden shadow-soft hover:shadow-lift transition-all duration-500 group flex flex-col h-full">
                      {/* Image container */}
                      <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-100 relative">
                        {bld.image_url ? (
                          <img
                            src={bld.image_url}
                            alt={bld.name}
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-[1200ms]"
                            loading="lazy"
                          />
                        ) : (
                          // Fallback to building placeholder
                          <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-zinc-950 text-white/40">
                            <Building2
                              size={40}
                              className="stroke-[1.5] mb-2 opacity-50 text-primary"
                            />
                            <span className="text-[11px] uppercase tracking-wider font-mono font-bold">
                              Image coming soon
                            </span>
                          </div>
                        )}
                        <div className="absolute top-4 left-4">
                          {(() => {
                            const statusLower = (bld.status || "").toLowerCase();
                            let imgPath = "";
                            if (statusLower === "rfo") {
                              imgPath = "/building Status/rfo.png";
                            } else if (
                              statusLower === "coming soon" ||
                              statusLower === "comingsoon"
                            ) {
                              imgPath = "/building Status/comingsoon.png";
                            } else {
                              imgPath = "/building Status/underconstruction.png";
                            }
                            return (
                              <img
                                src={imgPath}
                                alt={bld.status}
                                className="h-7 w-auto object-contain"
                              />
                            );
                          })()}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col flex-1">
                        <h3 className="text-[18px] font-bold text-ink leading-tight mb-2 group-hover:text-primary transition-colors">
                          {bld.name}
                        </h3>
                        {bld.description && (
                          <p className="text-[13.5px] text-muted-foreground leading-relaxed mb-4">
                            {bld.description}
                          </p>
                        )}

                        <div className="mt-auto pt-4 border-t border-border/50 grid grid-cols-2 gap-4">
                          {bld.floors && (
                            <div>
                              <p className="text-[9.5px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">
                                Floors
                              </p>
                              <p className="text-[13px] font-semibold text-ink leading-none">
                                {bld.floors}
                              </p>
                            </div>
                          )}
                          {bld.total_units && (
                            <div>
                              <p className="text-[9.5px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">
                                Total Units
                              </p>
                              <p className="text-[13px] font-semibold text-ink leading-none">
                                {bld.total_units}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════
          5. KEY HIGHLIGHTS
      ═══════════════════════════════════════════════════ */}
      {sections.highlights && !sections.highlights.hide && (
        <section className="px-4 py-20 md:py-28 surface">
          <div className="container-prose">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Reveal>
                <p className="eyebrow">
                  <span className="gold-rule" />
                  {hlts.eyebrow || "Key Highlights"}
                </p>
              </Reveal>
              <Reveal delay={100}>
                <h2 className="display-2 mt-5">Key Highlights</h2>
              </Reveal>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {(hlts.items || []).map((h, i) => (
                <Reveal key={h.title} delay={i * 70}>
                  <div className="bg-white rounded-2xl p-6 border border-border/40 shadow-soft hover:shadow-lift hover:-translate-y-1 transition-all duration-500 group">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors">
                      <IconRenderer name={h.icon} size={20} className="text-primary" />
                    </div>
                    <h3 className="text-[16px] font-bold text-ink mb-2">{h.title}</h3>
                    <p className="text-[13.5px] text-muted-foreground leading-relaxed">
                      {h.description}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════
          6. AMENITIES
      ═══════════════════════════════════════════════════ */}
      {sections.amenities && !sections.amenities.hide && (
        <section className="px-4 py-20 md:py-28">
          <div className="container-prose">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Reveal>
                <p className="eyebrow">
                  <span className="gold-rule" />
                  {amens.eyebrow || "Community"}
                </p>
              </Reveal>
              <Reveal delay={100}>
                <h2 className="display-2 mt-5">
                  Lifestyle & Community<span className="block text-primary">Features</span>
                </h2>
              </Reveal>
              {amens.intro && (
                <Reveal delay={180}>
                  <p className="lede mt-4 text-[15px]">{amens.intro}</p>
                </Reveal>
              )}
            </div>

            {(["wellness", "recreation", "social", "utility"] as const).map((cat) => {
              const catItems = (amens.items || []).filter((a) => a.category === cat);
              if (!catItems.length) return null;
              const labels: Record<typeof cat, string> = {
                wellness: "🌿 Wellness",
                recreation: "🌊 Recreation",
                social: "🤝 Social",
                utility: "🏢 Building",
              };
              return (
                <div key={cat} className="mb-12">
                  <Reveal>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-5">
                      {labels[cat]}
                    </p>
                  </Reveal>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {catItems.map((a, i) => (
                      <Reveal key={a.name} delay={i * 60}>
                        <div className="bg-surface rounded-2xl p-5 border border-border/40 hover:border-primary/20 hover:shadow-soft transition-all duration-400">
                          <div className="w-9 h-9 rounded-xl bg-ink/5 flex items-center justify-center mb-3">
                            <IconRenderer name={a.icon} size={17} className="text-ink/60" />
                          </div>
                          <p className="font-bold text-[14px] text-ink">{a.name}</p>
                          <p className="text-[12.5px] text-muted-foreground mt-1 leading-relaxed">
                            {a.description}
                          </p>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════
          7. LOCATION & NEARBY
      ═══════════════════════════════════════════════════ */}
      <section className="px-4 py-20 md:py-28 surface">
        <div className="container-prose">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <Reveal>
                <p className="eyebrow">
                  <span className="gold-rule" />
                  {loc.eyebrow || "Location Advantage"}
                </p>
              </Reveal>
              <Reveal delay={100}>
                <h2 className="display-2 mt-5">
                  Near Everything<span className="block text-primary">That Matters</span>
                </h2>
              </Reveal>
              {loc.intro && (
                <Reveal delay={180}>
                  <p className="lede mt-5 text-[15px]">{loc.intro}</p>
                </Reveal>
              )}

              {/* Map placeholder */}
              <Reveal delay={260}>
                <div className="mt-8 rounded-2xl overflow-hidden border border-border shadow-soft aspect-[4/3] bg-surface flex items-center justify-center relative">
                  <img
                    src={loc.map_image_url || locMakati}
                    alt="Location map"
                    className="w-full h-full object-cover opacity-70"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-ink/30 backdrop-blur-sm gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lift">
                      <MapPin size={22} className="text-primary" />
                    </div>
                    <p className="text-white font-bold text-[14px]">
                      {loc.map_label || meta.fullAddress}
                    </p>
                    {loc.maps_url && (
                      <a
                        href={loc.maps_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/80 text-[12px] underline underline-offset-4 hover:text-white transition-colors"
                      >
                        Open in Google Maps →
                      </a>
                    )}
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Nearby list */}
            <div>
              {(["transit", "mall", "school", "hospital", "business"] as const).map((cat) => {
                const places = (loc.nearby || []).filter((n) => n.category === cat);
                if (!places.length) return null;
                const label: Record<typeof cat, string> = {
                  transit: "Transit",
                  mall: "Shopping & Dining",
                  school: "Schools",
                  hospital: "Hospitals",
                  business: "Business Hubs",
                };
                return (
                  <Reveal key={cat}>
                    <div className="mb-6">
                      <p className="text-[10.5px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
                        {label[cat]}
                      </p>
                      <div className="flex flex-col gap-2">
                        {places.map((place) => (
                          <div
                            key={place.name}
                            className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-border/40 shadow-soft"
                          >
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${NEARBY_CATEGORY_COLOR[place.category]}`}
                            >
                              <NearbyIcon category={place.category} />
                            </div>
                            <p className="font-semibold text-[13.5px] text-ink flex-1">
                              {place.name}
                            </p>
                            <span className="text-[11.5px] font-bold text-muted-foreground whitespace-nowrap">
                              {place.time}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          8. UNIT TYPES
      ═══════════════════════════════════════════════════ */}
      <section className="px-4 py-20 md:py-28">
        <div className="container-prose">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Reveal>
              <p className="eyebrow">
                <span className="gold-rule" />
                {uts.eyebrow || "Unit Configurations"}
              </p>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="display-2 mt-5">{uts.headline || "Choose Your Space"}</h2>
            </Reveal>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {units.map((unit, i) => (
              <Reveal key={unit.name} delay={i * 80}>
                <article className="group bg-white rounded-2xl border border-border/40 shadow-soft overflow-hidden hover:shadow-lift hover:-translate-y-1 transition-all duration-500">
                  {unit.image_url && (
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <img
                        src={unit.image_url}
                        alt={`${unit.name} unit`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1500ms]"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <span className="absolute bottom-3 left-3 text-white font-extrabold text-[17px]">
                        {unit.name}
                      </span>
                    </div>
                  )}
                  <div className="p-5">
                    {!unit.image_url && (
                      <p className="font-extrabold text-ink text-[16px] mb-3">{unit.name}</p>
                    )}
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-[12px] text-muted-foreground font-medium">
                        {unit.area_sqm} sq.m.
                      </span>
                      <span className="font-extrabold text-[15px] text-ink">
                        {formatPrice(unit.starting_price)}
                      </span>
                    </div>
                    <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">
                      {unit.description}
                    </p>
                    <button
                      onClick={scrollToForm}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-primary/20 text-primary text-[12.5px] font-bold hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 cursor-pointer"
                    >
                      Get Details <ArrowRight size={13} />
                    </button>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          9. DECISION GUIDE
      ═══════════════════════════════════════════════════ */}
      {sections.decision_guide && !sections.decision_guide.hide && (
        <section className="px-4 py-20 md:py-24 surface">
          <div className="container-prose">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <Reveal>
                <p className="eyebrow">
                  <span className="gold-rule" />
                  {dg.eyebrow || "Decision Guide"}
                </p>
              </Reveal>
              <Reveal delay={100}>
                <h2 className="display-2 mt-5">
                  {dg.headline || "Which unit is"}{" "}
                  <span className="text-primary">{dg.headline_accent || "right for you?"}</span>
                </h2>
              </Reveal>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {units.map((unit, i) => (
                <Reveal key={unit.name} delay={i * 80}>
                  <div className="bg-white rounded-2xl p-6 border border-border/40 shadow-soft text-center hover:border-primary/30 hover:shadow-lift transition-all duration-400 cursor-default">
                    <div className="w-12 h-12 rounded-2xl bg-primary/8 flex items-center justify-center mx-auto mb-5">
                      <Users size={20} className="text-primary" />
                    </div>
                    <p className="font-extrabold text-ink text-[15px]">{unit.name}</p>
                    <p className="font-mono text-[11.5px] text-muted-foreground mt-1">
                      {unit.area_sqm} sq.m.
                    </p>
                    <div className="w-10 h-px bg-gold mx-auto my-4" />
                    <p className="text-[13px] text-muted-foreground leading-relaxed">
                      {unit.profile_target}
                    </p>
                    <p className="font-extrabold text-primary text-[14px] mt-3">
                      {formatPrice(unit.starting_price)}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={200}>
              <div className="mt-10 text-center">
                <p className="text-[14px] text-muted-foreground mb-4">
                  Not sure which unit fits your budget and goals?
                </p>
                <button
                  onClick={scrollToForm}
                  className="inline-flex items-center gap-2 bg-ink text-white px-7 py-3.5 rounded-full text-[13px] font-bold tracking-wide hover:-translate-y-0.5 hover:shadow-lift transition-all duration-500 cursor-pointer"
                >
                  Get a Free Personalized Computation <ArrowRight size={15} />
                </button>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════
          11. TRUST + SOCIAL PROOF
      ═══════════════════════════════════════════════════ */}
      <section className="px-4 py-20 md:py-28 bg-ink text-white overflow-hidden relative">
        <div
          aria-hidden
          className="absolute -right-48 top-0 w-[600px] h-[600px] rounded-full opacity-15 pointer-events-none"
          style={{ background: "radial-gradient(closest-side, oklch(0.43 0.20 258), transparent)" }}
        />
        <div className="container-prose relative z-10">
          {/* Stats */}
          {testi.stats.length > 0 && (
            <div className="grid grid-cols-3 gap-6 mb-20 pb-20 border-b border-white/10">
              {testi.stats.map((stat, i) => (
                <Reveal key={stat.label} delay={i * 100}>
                  <div className="text-center">
                    <p className="text-[3.5rem] md:text-[5rem] font-extrabold text-white leading-none tracking-tighter">
                      {stat.value}
                    </p>
                    <p className="text-white/50 text-[13px] mt-2 font-medium">{stat.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Why CityQlo */}
            <div>
              <Reveal>
                <p className="eyebrow text-white/40">
                  <span className="gold-rule" />
                  Our Promise
                </p>
              </Reveal>
              <Reveal delay={100}>
                <h2 className="display-2 mt-5 text-white">
                  Why work
                  <br />
                  <span className="text-primary">with us?</span>
                </h2>
              </Reveal>
              <Reveal delay={180}>
                <p className="text-white/60 mt-5 text-[15px] leading-relaxed max-w-md">
                  We're independent property consultants — not salespeople. Our job is to help you
                  make the right decision, not just close a deal.
                </p>
              </Reveal>
              <div className="mt-8 flex flex-col gap-3">
                {[
                  "Accredited Property Consultant (DMCI Homes)",
                  "Free Property Consultation — no obligation",
                  "Official Developer Pricing — zero mark-ups",
                  "No Additional or Hidden Fees",
                  "End-to-End Buying Assistance",
                  "Bank Loan & PAG-IBIG Guidance",
                  "OFW Remote Purchase Support",
                ].map((item, i) => (
                  <Reveal key={item} delay={200 + i * 60}>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/30 flex items-center justify-center flex-shrink-0">
                        <Check size={11} className="text-white" />
                      </div>
                      <p className="text-white/80 text-[14px] font-medium">{item}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div>
              <Reveal>
                <p className="eyebrow text-white/40 mb-6">
                  <span className="gold-rule" />
                  Client Stories
                </p>
              </Reveal>
              <div className="flex flex-col gap-5">
                {testi.testimonials.map((t, i) => (
                  <Reveal key={t.name} delay={120 + i * 100}>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                      <div className="flex mb-3">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} size={13} className="text-gold fill-gold" />
                        ))}
                      </div>
                      <p className="text-white/85 text-[14px] leading-relaxed italic">
                        "{t.quote}"
                      </p>
                      <div className="mt-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center">
                          <span className="text-white text-[11px] font-bold">{t.name[0]}</span>
                        </div>
                        <div>
                          <p className="text-white text-[13px] font-bold">{t.name}</p>
                          <p className="text-white/50 text-[11px]">{t.role}</p>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          12. FAQ
      ═══════════════════════════════════════════════════ */}
      <section className="px-4 py-20 md:py-28 surface">
        <div className="container-prose">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-14">
              <Reveal>
                <p className="eyebrow">
                  <span className="gold-rule" />
                  Common Questions
                </p>
              </Reveal>
              <Reveal delay={100}>
                <h2 className="display-2 mt-5">
                  Frequently Asked <span className="text-primary">Questions</span>
                </h2>
              </Reveal>
            </div>

            <div className="flex flex-col gap-3">
              {(faqSec.items || []).map((faq, i) => (
                <Reveal key={i} delay={i * 50}>
                  <div className="bg-white rounded-2xl border border-border/50 overflow-hidden shadow-soft">
                    <button
                      id={`faq-item-${i}`}
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer hover:bg-surface/50 transition-colors"
                      aria-expanded={openFaq === i}
                    >
                      <p className="font-bold text-[15px] text-ink leading-snug">{faq.q}</p>
                      <span className="flex-shrink-0 text-muted-foreground">
                        {openFaq === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </span>
                    </button>
                    {openFaq === i && (
                      <div className="px-6 pb-5 border-t border-border/30">
                        <p className="text-[14.5px] text-muted-foreground leading-relaxed mt-4">
                          {faq.a}
                        </p>
                      </div>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          12b. IN-DEPTH GUIDE LINK (pillar page interlink)
      ═══════════════════════════════════════════════════ */}
      {PILLAR_GUIDES[meta.id] && (
        <section className="px-4 pb-4">
          <div className="container-prose">
            <Reveal>
              <a
                href={PILLAR_GUIDES[meta.id]}
                className="group flex flex-col items-start justify-between gap-4 rounded-2xl border border-border/60 bg-surface/50 p-6 transition-colors hover:border-ink/30 sm:flex-row sm:items-center"
              >
                <div>
                  <p className="eyebrow">
                    <span className="gold-rule" />
                    Complete buyer's guide
                  </p>
                  <p className="mt-3 text-[16px] font-bold text-ink">
                    Read the full {meta.name} guide
                  </p>
                  <p className="mt-1 text-[14px] text-muted-foreground">
                    Price breakdown, floor plans, location, amenities, financing, and FAQs —
                    everything in one place.
                  </p>
                </div>
                <span className="inline-flex flex-shrink-0 items-center gap-2 rounded-full bg-ink px-5 py-3 text-[13px] font-semibold text-white transition-transform duration-300 group-hover:translate-x-0.5">
                  Read the guide <ArrowRight size={16} />
                </span>
              </a>
            </Reveal>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════
          13. LEAD CAPTURE FORM
      ═══════════════════════════════════════════════════ */}
      <section id="lead-form" className="px-4 py-20 md:py-28">
        <div className="container-prose">
          <div className="max-w-2xl mx-auto">
            <Reveal>
              <div className="text-center mb-10">
                <p className="eyebrow">
                  <span className="gold-rule" />
                  {lead.eyebrow || "Get Started Today"}
                </p>
                <h2 className="display-2 mt-5">
                  {lead.headline || "Interested in"}
                  <span className="text-primary"> {lead.headline_accent || meta.name}?</span>
                </h2>
                <p className="lede mt-4 text-[15px]">
                  {lead.sub ||
                    `Leave your details and we'll prepare your personalized price list and payment computation within `}
                  <strong>24 hours</strong>.
                </p>
              </div>
            </Reveal>

            <Reveal delay={140}>
              <div className="bg-white rounded-3xl border border-border shadow-lift p-8 md:p-10">
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11.5px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                        Full Name *
                      </label>
                      <input
                        id="form-name"
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Juan dela Cruz"
                        className="w-full border border-border rounded-xl px-4 py-3.5 text-[14px] outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/60"
                      />
                    </div>
                    <div>
                      <label className="block text-[11.5px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                        Mobile / Viber *
                      </label>
                      <input
                        id="form-mobile"
                        type="tel"
                        required
                        value={form.mobile}
                        onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                        placeholder="09XX-XXX-XXXX"
                        className="w-full border border-border rounded-xl px-4 py-3.5 text-[14px] outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/60"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11.5px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      Email (Optional)
                    </label>
                    <input
                      id="form-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="juan@email.com"
                      className="w-full border border-border rounded-xl px-4 py-3.5 text-[14px] outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/60"
                    />
                  </div>

                  <div>
                    <label className="block text-[11.5px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      Interested In
                    </label>
                    <select
                      id="form-interest"
                      value={form.interest}
                      onChange={(e) => setForm({ ...form, interest: e.target.value })}
                      className="w-full border border-border rounded-xl px-4 py-3.5 text-[14px] outline-none focus:border-primary transition-colors text-ink bg-white appearance-none"
                    >
                      {(
                        lead.unit_options || [
                          "Studio",
                          "1-Bedroom",
                          "2-Bedroom",
                          "3-Bedroom",
                          "Price List Only",
                        ]
                      ).map((opt) => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    id="form-submit"
                    type="submit"
                    disabled={formSubmitting}
                    className="w-full flex items-center justify-center gap-2.5 bg-primary text-white font-bold py-4 rounded-2xl text-[15px] tracking-wide hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-lift transition-all duration-400 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
                    style={{ transitionTimingFunction: "var(--ease-luxe)" }}
                  >
                    {formSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Zap size={17} />
                        Get Free Computation
                      </>
                    )}
                  </button>
                </form>

                {/* Trust indicators */}
                <div className="mt-6 pt-5 border-t border-border/40">
                  <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                    {[
                      "✓ Official Developer Price",
                      "✓ No Hidden Fees",
                      "✓ Reply within 24 hours",
                    ].map((trust) => (
                      <p key={trust} className="text-[11.5px] text-muted-foreground font-semibold">
                        {trust}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          14. RELATED PROJECTS
      ═══════════════════════════════════════════════════ */}
      <section className="px-4 py-20 md:py-24 surface">
        <div className="container-prose">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <Reveal>
                <p className="eyebrow">
                  <span className="gold-rule" />
                  Also Consider
                </p>
              </Reveal>
              <Reveal delay={100}>
                <h2 className="display-2 mt-5">
                  Similar <span className="text-primary">Projects</span>
                </h2>
              </Reveal>
            </div>
            <Reveal delay={160}>
              <Link to="/properties" className="link-quiet hover:border-ink flex-shrink-0">
                View all properties <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Reveal>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProjects.map((rp, i) => (
              <Reveal key={rp.id} delay={i * 80}>
                <article className="group bg-white rounded-2xl border border-border/40 shadow-soft overflow-hidden hover:shadow-lift hover:-translate-y-1 transition-all duration-500">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={rp.img}
                      alt={rp.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1500ms]"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                        {rp.status}
                      </span>
                      <span className="font-extrabold text-[15px] text-ink">{rp.price}</span>
                    </div>
                    <h3 className="font-bold text-[16px] text-ink group-hover:text-primary transition-colors">
                      {rp.name}
                    </h3>
                    <p className="text-[12.5px] text-muted-foreground mt-1">{rp.city}</p>
                    <p className="text-[13px] text-muted-foreground mt-3 leading-relaxed line-clamp-2">
                      {rp.description}
                    </p>
                    <Link
                      to="/projects/$slug"
                      params={{ slug: rp.id }}
                      className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-border text-ink text-[12.5px] font-bold hover:border-primary hover:text-primary transition-all duration-300"
                    >
                      View Project <ChevronRight size={13} />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom spacer for mobile sticky bar */}
      <div className="xl:hidden h-14" />
    </>
  );
}
