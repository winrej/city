import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Search,
  Share2,
  X,
  Sparkles,
  ArrowRight,
  Info,
  Calendar,
  Layers,
  ChevronRight,
  ChevronLeft,
  Eye,
  FileText,
  Check,
  Trash2,
} from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { BreadcrumbJsonLd } from "@/components/site/BreadcrumbJsonLd";
import { ConsultationCTA } from "@/components/site/ConsultationCTA";
import { Skeleton } from "@/components/ui/skeleton";
import { getPublicPropertiesPageContent } from "@/lib/api/admin.functions";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { useIsMobile } from "@/hooks/use-mobile";

// Import local image assets (both JPGs and the new PNGs)
import propOriana from "@/assets/prop-oriana.png";
import towerImg from "@/assets/tower-exterior.jpg";
import interiorImg from "@/assets/interior-living.jpg";
import poolImg from "@/assets/amenity-pool.jpg";

// Hybrid image fallback — cycles through 4 assets by index if no image_url is set
const FALLBACK_IMAGES = [propOriana, towerImg, interiorImg, poolImg];
function resolvePropertyImage(prop: Property, idx: number): string {
  if (prop.image_url) return prop.image_url;
  return FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length];
}

function renderHeadlineWithBreaks(headline: string) {
  return headline
    .replaceAll("<br />", "\n")
    .replaceAll("<br>", "\n")
    .split("\n")
    .map((part, index, parts) => (
      <span key={`${part}-${index}`}>
        {part}
        {index < parts.length - 1 && <br />}
      </span>
    ));
}

export const Route = createFileRoute("/properties")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      focus: search.focus === "true" || search.focus === true || undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "DMCI Homes Condos for Sale in the Philippines | CityQlo" },
      {
        name: "description",
        content:
          "Browse a curated collection of DMCI Homes condos for sale across the Philippines. A DMCI Homes accredited property consultant helps you match the right unit to your budget and long-term goals.",
      },
      {
        name: "keywords",
        content:
          "DMCI Homes condos for sale, DMCI condos Philippines, DMCI Homes property listings, condo for sale Philippines, DMCI accredited property consultant, real estate investment Philippines",
      },
      {
        property: "og:title",
        content: "DMCI Homes Condos for Sale in the Philippines | CityQlo",
      },
      {
        property: "og:description",
        content:
          "Browse DMCI Homes condos for sale across the Philippines, curated by a DMCI Homes accredited property consultant.",
      },
      { property: "og:url", content: "https://cityqlo.com/properties" },
    ],
    links: [{ rel: "canonical", href: "https://cityqlo.com/properties" }],
  }),
  component: Properties,
});

interface Property {
  id: string;
  name: string;
  slug: string;
  developer: string;
  city: string;
  location: string;
  price_display: string;
  price_min: number;
  price_max: number | null;
  price_max_display: string | null;
  status: "Pre-selling" | "RFO";
  image_url: string | null;
  beds: number;
  baths: number;
  area: string;
  unit_types: string[] | null;
  description: string;
  highlights: string[] | any[];
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
  promo_badge: string | null;
  is_spotlight: boolean;
  featured_rank: number;
}

function PropertyCard({
  property,
  onShare,
  onCompare,
  isCompared,
  idx,
}: {
  property: Property;
  onShare: (property: Property) => void;
  onCompare: (property: Property) => void;
  isCompared: boolean;
  idx: number;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgSrc = resolvePropertyImage(property, idx);
  const highlights: string[] = Array.isArray(property.highlights) ? property.highlights : [];
  const unitTypes: string[] =
    Array.isArray(property.unit_types) && property.unit_types.length > 0
      ? property.unit_types
      : property.beds >= 1
        ? Array.from({ length: property.beds }, (_, i) => `${i + 1}BR`)
        : ["Studio"];

  return (
    <Reveal delay={idx * 60} className="group">
      <article className="flex flex-col h-full">
        {/* Image Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-surface shadow-soft">
          {/* Shimmer Skeleton */}
          {!imageLoaded && <Skeleton className="absolute inset-0 z-0 h-full w-full rounded-none" />}

          {/* Status Badge — building Status images */}
          {(() => {
            const s = (property.status ?? "").toLowerCase();
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
                className="absolute top-4 left-4 z-10 h-11 w-11 object-contain drop-shadow-md"
              />
            );
          })()}

          {/* Share Button */}
          <button
            onClick={() => onShare(property)}
            className="absolute top-4 right-4 z-10 p-2.5 rounded-full backdrop-blur-md shadow-sm transition-all duration-300 hover:scale-105 cursor-pointer bg-white/90 text-ink/75 hover:text-[#3B82F6]"
            aria-label="Share property"
          >
            <Share2 className="h-4.5 w-4.5" />
          </button>

          {/* Image element with zoom-hover (hybrid: DB url or local fallback) wrapped in Link */}
          <Link
            to="/projects/$slug"
            params={{ slug: property.slug || property.id }}
            className="block h-full w-full cursor-pointer"
          >
            <img
              src={imgSrc}
              alt={property.name}
              onLoad={() => setImageLoaded(true)}
              className={`h-full w-full object-cover transition-all duration-1000 ease-out group-hover:scale-105 ${
                imageLoaded ? "opacity-100 blur-0" : "opacity-0 blur-lg"
              }`}
              loading="lazy"
            />
          </Link>
        </div>

        {/* Info Metadata */}
        <div className="mt-6 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              {/dmci/i.test(property.developer ?? "") ? (
                <img
                  src="/dmci-homes-seeklogo.png"
                  alt="DMCI Homes"
                  className="h-4 object-contain opacity-70 mb-0.5"
                  draggable={false}
                />
              ) : (
                <p className="font-mono tracking-widest uppercase text-[#3B82F6] text-[10px] font-bold">
                  {property.developer}
                </p>
              )}
              <h3 className="text-[19px] font-bold tracking-tight text-ink mt-1.5 leading-snug group-hover:text-primary transition-colors">
                {property.name}
              </h3>
              <p className="text-[13.5px] text-muted-foreground font-medium mt-1">
                {property.city}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">
                Starts at
              </p>
              <p className="text-[18px] font-extrabold text-ink tracking-tight">
                {property.price_display}
              </p>
              {property.price_max_display && (
                <p className="text-[11px] font-medium text-muted-foreground mt-1">
                  Up to {property.price_max_display}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-1.5 bg-surface/50 rounded-lg p-2.5 border border-border/30">
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mr-1">
              Units
            </span>
            {unitTypes.map((unit) => (
              <span
                key={unit}
                className="px-2 py-0.5 rounded-md bg-[#3B82F6]/[0.08] border border-[#3B82F6]/15 text-[#3B82F6] text-[11px] font-bold tracking-wide"
              >
                {unit}
              </span>
            ))}
          </div>
        </div>

        {/* Actions Bar */}
        <div className="mt-6 pt-4 border-t border-hairline flex items-center justify-between text-[11px] font-bold uppercase tracking-widest">
          <Link
            to="/projects/$slug"
            params={{ slug: property.slug || property.id }}
            className="text-ink hover:text-[#3B82F6] transition-colors flex items-center gap-1 cursor-pointer"
          >
            View Full Details <ChevronRight className="h-3.5 w-3.5" />
          </Link>

          <div className="flex gap-4">
            <button
              onClick={() => onCompare(property)}
              className={`transition-colors cursor-pointer flex items-center gap-1.5 ${
                isCompared ? "text-[#3B82F6] font-bold" : "text-muted-foreground hover:text-ink"
              }`}
            >
              {isCompared ? (
                <>
                  <Check className="h-3.5 w-3.5 stroke-[3px]" /> Compared
                </>
              ) : (
                "Compare"
              )}
            </button>
            <button
              onClick={() => onShare(property)}
              className="text-muted-foreground hover:text-ink transition-colors cursor-pointer"
            >
              Share
            </button>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

// ─── CUSTOMIZABLE HERO OVERLAY ──────────────────────────────────────────────
// Modify the value below (0 to 100) to adjust the darkness of the properties hero section.
// (e.g. 45 for 45% opacity).
const HERO_OVERLAY_OPACITY_PERCENT = 45;

function Properties() {
  // ── Live page content from Supabase (consolidated query) ──
  const { data: pageContent, isLoading: propsLoading } = useQuery({
    queryKey: ["properties-page-content"],
    queryFn: () => getPublicPropertiesPageContent(),
    staleTime: 1000 * 60 * 5, // 5 min cache
  });

  const propertiesData = useMemo(() => pageContent?.properties ?? [], [pageContent]);

  // Derive featured developments dynamically
  const featuredDevelopments = useMemo(() => {
    return (propertiesData as Property[])
      .filter((p) => p.is_featured)
      .map((p, idx) => ({
        name: p.name,
        developer: p.developer,
        city: p.city,
        desc: p.description,
        img: resolvePropertyImage(p, idx),
        tag: p.promo_badge || "Featured Development",
        link: `/projects/${p.slug}`,
      }));
  }, [propertiesData]);

  // Spotlight property deterministic selection
  const spotlightProp = useMemo(() => {
    const props = propertiesData as Property[];
    // 1. is_spotlight === true
    const explicit = props.find((p) => p.is_spotlight);
    if (explicit) return explicit;

    // 2. Highest featured_rank
    const featuredList = props.filter((p) => p.is_featured);
    if (featuredList.length > 0) {
      return featuredList.reduce((prev, current) =>
        (prev.featured_rank ?? 0) > (current.featured_rank ?? 0) ? prev : current,
      );
    }

    // 3. Fallback to latest property
    if (props.length > 0) return props[0];

    return null;
  }, [propertiesData]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"All" | "RFO" | "Pre-selling">("All");
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);

  const [activeShareProperty, setActiveShareProperty] = useState<Property | null>(null);
  const [compareProperties, setCompareProperties] = useState<Property[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Scroll and mobile states
  const { scrollDirection, isScrolledPast } = useScrollDirection(80);
  const isMobile = useIsMobile();
  const [isFiltersSheetOpen, setIsFiltersSheetOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc" | "featured">(
    "default",
  );

  // Derive active filter labels
  const activeFilterLabels = useMemo(() => {
    const labels = [];
    if (selectedLocation) labels.push(selectedLocation);
    if (selectedPriceRange) {
      if (selectedPriceRange === "under-6m") labels.push("Under ₱6.0M");
      else if (selectedPriceRange === "6m-8m") labels.push("₱6.0M – ₱8.0M");
      else if (selectedPriceRange === "above-8m") labels.push("Above ₱8.0M");
    }
    if (selectedStatus !== "All") labels.push(selectedStatus);
    if (searchQuery) labels.push(`"${searchQuery}"`);
    return labels;
  }, [selectedLocation, selectedPriceRange, selectedStatus, searchQuery]);

  const filterSummaryText =
    activeFilterLabels.length > 0 ? activeFilterLabels.join(" · ") : "Filters";

  const activeFiltersCount = activeFilterLabels.length;

  const rows = useMemo(() => {
    return [
      {
        label: "Developer",
        value: (prop: Property) =>
          /dmci/i.test(prop.developer ?? "") ? (
            <img
              src="/dmci-homes-seeklogo.png"
              alt="DMCI Homes"
              className="h-4 object-contain opacity-70 mx-auto"
            />
          ) : (
            <span className="font-mono text-[10px] tracking-wider uppercase text-[#3B82F6] font-bold">
              {prop.developer}
            </span>
          ),
      },
      {
        label: "Pricing",
        value: (prop: Property) => (
          <div>
            <p className="font-bold text-ink text-[13.5px]">{prop.price_display}</p>
            {prop.price_max_display && (
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Up to {prop.price_max_display}
              </p>
            )}
          </div>
        ),
      },
      {
        label: "District / City",
        value: (prop: Property) => (
          <div>
            <p className="font-semibold text-ink text-[12.5px]">{prop.location}</p>
            <p className="text-[10.5px] text-muted-foreground mt-0.5">{prop.city}</p>
          </div>
        ),
      },
      {
        label: "Status",
        value: (prop: Property) => (
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
              /ready|rfo/i.test(prop.status ?? "")
                ? "bg-green-500/10 text-green-600 border border-green-500/20"
                : "bg-blue-500/10 text-[#3B82F6] border border-[#3B82F6]/20"
            }`}
          >
            {prop.status}
          </span>
        ),
      },
      {
        label: "Units Available",
        value: (prop: Property) => {
          const units =
            Array.isArray(prop.unit_types) && prop.unit_types.length > 0
              ? prop.unit_types
              : prop.beds >= 1
                ? Array.from({ length: prop.beds }, (_, i) => `${i + 1}BR`)
                : ["Studio"];
          return (
            <div className="flex flex-wrap gap-1 justify-center max-w-[150px] mx-auto">
              {units.map((unit) => (
                <span
                  key={unit}
                  className="px-1.5 py-0.5 rounded bg-[#3B82F6]/5 text-[#3B82F6] text-[9.5px] font-bold border border-[#3B82F6]/10"
                >
                  {unit}
                </span>
              ))}
            </div>
          );
        },
      },
      {
        label: "Configurations",
        value: (prop: Property) => (
          <p className="font-mono text-[10.5px] text-ink font-semibold">
            {prop.beds} BR · {prop.baths} BA · {prop.area}
          </p>
        ),
      },
      {
        label: "Highlights",
        value: (prop: Property) => {
          const highlights: string[] = Array.isArray(prop.highlights) ? prop.highlights : [];
          return (
            <ul className="text-left text-[11px] space-y-1 max-w-[180px] mx-auto">
              {highlights.slice(0, 3).map((h, i) => (
                <li
                  key={i}
                  className="flex items-start gap-1.5 text-muted-foreground leading-normal"
                >
                  <span className="h-1 w-1 rounded-full bg-[#3B82F6] mt-2 shrink-0" />
                  <span className="line-clamp-2">{h}</span>
                </li>
              ))}
            </ul>
          );
        },
      },
    ];
  }, []);

  const residencesRef = useRef<HTMLDivElement | null>(null);
  const { focus } = Route.useSearch();
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (focus && searchInputRef.current) {
      // Smooth scroll to the search input section
      searchInputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });

      // Focus the search input with a minor delay to allow smooth scrolling to settle
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 500);

      // Clean up the URL search parameter so it doesn't re-focus on subsequent reloads
      const newUrl = window.location.pathname;
      window.history.replaceState(null, "", newUrl);

      return () => clearTimeout(timer);
    }
  }, [focus]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredDevelopments.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [featuredDevelopments.length]);

  // Lock body scroll when filter bottom sheet is open
  useEffect(() => {
    if (isFiltersSheetOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isFiltersSheetOpen]);

  // Broadcast active filter count to Nav pill badge via custom event
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("filters-active-count", { detail: activeFiltersCount }));
  }, [activeFiltersCount]);

  // Listen for Nav pill tap to open the bottom sheet
  useEffect(() => {
    const handler = () => setIsFiltersSheetOpen(true);
    window.addEventListener("open-filters-sheet", handler);
    return () => window.removeEventListener("open-filters-sheet", handler);
  }, []);

  // Keyboard navigation for featured carousel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if no input/textarea is focused
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      )
        return;

      if (e.key === "ArrowLeft") {
        setCurrentSlide(
          (prev) => (prev - 1 + featuredDevelopments.length) % featuredDevelopments.length,
        );
      } else if (e.key === "ArrowRight") {
        setCurrentSlide((prev) => (prev + 1) % featuredDevelopments.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter properties logic (client-side, against live Supabase data)
  const filteredProperties = useMemo(() => {
    return (propertiesData as Property[]).filter((property) => {
      // Search matches
      const matchesSearch =
        property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.developer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Status matches
      const matchesStatus = selectedStatus === "All" || property.status === selectedStatus;

      // Location matches
      const matchesLocation = !selectedLocation || property.location === selectedLocation;

      // Price matches using price_min (never price_display)
      let matchesPrice = true;
      if (selectedPriceRange === "under-6m") {
        matchesPrice = property.price_min < 6.0;
      } else if (selectedPriceRange === "6m-8m") {
        matchesPrice = property.price_min >= 6.0 && property.price_min <= 8.0;
      } else if (selectedPriceRange === "above-8m") {
        matchesPrice = property.price_min > 8.0;
      }

      return matchesSearch && matchesStatus && matchesLocation && matchesPrice;
    });
  }, [propertiesData, searchQuery, selectedStatus, selectedLocation, selectedPriceRange]);

  // Dynamically build location list from live data
  const locationsData = useMemo(() => {
    const seen = new Map<string, number>();
    (propertiesData as Property[]).forEach((p) => {
      seen.set(p.location, (seen.get(p.location) ?? 0) + 1);
    });
    return Array.from(seen.entries()).map(([name, count]) => ({ name, count }));
  }, [propertiesData]);

  const handleShare = (property: Property) => {
    const shareUrl = `${window.location.origin}/projects/${property.slug || property.id}`;
    if (navigator.share) {
      navigator
        .share({
          title: `${property.name} — ${property.city} · CityQlo`,
          text: `Check out ${property.name} by ${property.developer} in ${property.city}.`,
          url: shareUrl,
        })
        .catch(() => {
          setActiveShareProperty(property);
        });
    } else {
      setActiveShareProperty(property);
    }
  };

  const handleCompare = (property: Property) => {
    setCompareProperties((prev) => {
      const exists = prev.some((p) => p.id === property.id);
      if (exists) {
        toast.success(`Removed ${property.name} from comparison`);
        return prev.filter((p) => p.id !== property.id);
      }
      if (prev.length >= 3) {
        toast.warning("Limit reached", {
          description: "You can compare up to 3 properties at a time.",
        });
        return prev;
      }
      toast.success(`Added ${property.name} to comparison`);
      return [...prev, property];
    });
  };

  const handleDownloadGuide = () => {
    toast.success("Download started: CityQlo Property Advisory Guide", {
      description: "Your guide will be ready shortly.",
    });
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedStatus("All");
    setSelectedLocation(null);
    setSelectedPriceRange(null);
  };

  const scrollToResidences = () => {
    residencesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Residences", href: "/properties" },
        ]}
      />
      {/* HERO CAROUSEL SECTION */}
      {featuredDevelopments.length > 0 && (
        <section className="relative h-[92vh] min-h-[600px] w-full overflow-hidden bg-ink">
          {featuredDevelopments.map((slide, idx) => {
            const isActive = idx === currentSlide;
            return (
              <div
                key={slide.name}
                className={`absolute inset-0 transition-all duration-[1000ms] ease-in-out ${
                  isActive
                    ? "opacity-100 z-10 pointer-events-auto"
                    : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                {/* Full-bleed Architectural Image */}
                <div
                  className={`absolute inset-0 bg-cover bg-center transition-transform duration-[6000ms] ease-out ${
                    isActive ? "scale-105" : "scale-100"
                  }`}
                  style={{ backgroundImage: `url(${slide.img})` }}
                />
                {/* Customizable Overlay Dark Filter */}
                <div
                  className="absolute inset-0 bg-black transition-opacity duration-700"
                  style={{ opacity: HERO_OVERLAY_OPACITY_PERCENT / 100 }}
                />
                {/* Subtle Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-black/35 to-black/60" />

                <div className="relative z-20 flex h-full items-end pt-24 pb-28 md:pt-28 md:pb-24 hero-properties-container">
                  <div className="container-prose w-full">
                    <div className="max-w-4xl text-white hero-content-inner">
                      <Reveal>
                        <p className="font-mono tracking-[0.3em] text-[#3B82F6] text-[11px] uppercase font-bold">
                          {slide.tag}
                        </p>
                      </Reveal>
                      <Reveal delay={120}>
                        <h1 className="display-1 mt-6 text-white tracking-tighter leading-[0.9] font-extrabold">
                          {slide.name},<br />
                          <span className="text-[0.75em] opacity-90 font-medium">
                            {slide.city.split(",")[1]?.trim() || slide.city}
                          </span>
                        </h1>
                      </Reveal>
                      <Reveal delay={240}>
                        <p className="lede mt-8 max-w-xl text-white/80 text-[16px] md:text-[18px]">
                          {slide.desc}
                        </p>
                      </Reveal>
                      <Reveal delay={360}>
                        <div className="mt-10 flex flex-wrap gap-4">
                          <Link
                            to={slide.link}
                            className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full bg-white px-8 text-[13px] font-semibold text-ink transition-all duration-300 hover:-translate-y-[2px] hover:shadow-lift"
                          >
                            Schedule Viewing
                          </Link>
                          <button
                            onClick={scrollToResidences}
                            className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full border border-white/45 px-8 text-[13px] font-semibold text-white transition-all duration-300 hover:bg-white/10 hover:border-white"
                          >
                            Explore Collection
                          </button>
                        </div>
                      </Reveal>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Carousel Navigation Arrows */}
          <div className="absolute top-1/2 -translate-y-1/2 left-6 z-20 hidden md:block">
            <button
              onClick={() =>
                setCurrentSlide(
                  (prev) => (prev - 1 + featuredDevelopments.length) % featuredDevelopments.length,
                )
              }
              className="p-3 rounded-full border border-white/20 bg-black/25 text-white/70 hover:text-white hover:bg-black/50 hover:border-white/50 backdrop-blur-sm transition-all cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 right-6 z-20 hidden md:block">
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % featuredDevelopments.length)}
              className="p-3 rounded-full border border-white/20 bg-black/25 text-white/70 hover:text-white hover:bg-black/50 hover:border-white/50 backdrop-blur-sm transition-all cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Carousel Indicators / Dots */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
            {featuredDevelopments.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentSlide ? "w-8 bg-[#3B82F6]" : "w-2.5 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </section>
      )}

      {/* STICKY FILTER RAIL — desktop always expanded; mobile hides entirely after 80px scroll (pill lives in Nav) */}
      <div
        className={`sticky top-14 md:top-[62px] z-30 w-full border-y border-border/50 bg-background/85 backdrop-blur-xl transition-all duration-300 ${
          isMobile && isScrolledPast && scrollDirection === "down"
            ? "h-0 overflow-hidden border-transparent"
            : ""
        }`}
      >
        {/* ── Full filter rail (desktop always, mobile when not yet scrolled) ── */}
        <div className="container-prose py-3">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Status tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {(["All", "RFO", "Pre-selling"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-5 py-2 text-[12.5px] font-semibold rounded-full tracking-wide transition-all ${
                    selectedStatus === status
                      ? "bg-ink text-white"
                      : "text-muted-foreground hover:bg-surface hover:text-ink"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Quick dropdown selectors and Search input */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              {/* Search bar */}
              <div className="relative flex items-center min-w-[200px] flex-1 md:flex-initial">
                <Search className="absolute left-4.5 h-4 w-4 text-muted-foreground" />
                <input
                  id="properties-search-input"
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search residences..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 w-full rounded-full border border-border/70 bg-surface/50 pl-11 pr-4 text-[13px] placeholder-muted-foreground/75 focus:border-ink focus:bg-background focus:outline-none transition-all duration-300"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 text-muted-foreground hover:text-ink"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Location Select */}
              <div className="relative flex items-center">
                <select
                  value={selectedLocation || ""}
                  onChange={(e) => setSelectedLocation(e.target.value || null)}
                  className="h-10 rounded-full border border-border/70 bg-surface/50 px-5 pr-9 text-[12.5px] font-semibold text-ink focus:border-ink focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="">All Districts</option>
                  {locationsData.map((loc) => (
                    <option key={loc.name} value={loc.name}>
                      {loc.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3.5 pointer-events-none text-muted-foreground font-semibold text-[10px]">
                  ▼
                </div>
              </div>

              {/* Price Select */}
              <div className="relative flex items-center">
                <select
                  value={selectedPriceRange || ""}
                  onChange={(e) => setSelectedPriceRange(e.target.value || null)}
                  className="h-10 rounded-full border border-border/70 bg-surface/50 px-5 pr-9 text-[12.5px] font-semibold text-ink focus:border-ink focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="">All Prices</option>
                  <option value="under-6m">Under ₱6.0M</option>
                  <option value="6m-8m">₱6.0M – ₱8.0M</option>
                  <option value="above-8m">Above ₱8.0M</option>
                </select>
                <div className="absolute right-3.5 pointer-events-none text-muted-foreground font-semibold text-[10px]">
                  ▼
                </div>
              </div>

              {/* Clear filters trigger */}
              {(searchQuery ||
                selectedLocation ||
                selectedPriceRange ||
                selectedStatus !== "All") && (
                <button
                  onClick={clearAllFilters}
                  className="h-10 px-4 rounded-full border border-dashed border-border text-[12.5px] font-medium text-muted-foreground hover:border-ink hover:text-ink transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── FILTER BOTTOM SHEET ── */}
      {isFiltersSheetOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end"
          style={{
            background: "rgba(10,12,20,0.60)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
          onClick={() => setIsFiltersSheetOpen(false)}
        >
          <div
            className="w-full relative overflow-hidden animate-sheet-up"
            style={{
              borderRadius: "24px 24px 0 0",
              background: "oklch(0.985 0.002 247)",
              border: "1px solid oklch(0 0 0 / 0.08)",
              boxShadow: "0 -8px 60px -10px rgba(0,0,0,0.25), 0 0 0 0.5px oklch(0 0 0 / 0.06)",
              paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="h-1 w-10 rounded-full bg-ink/15" />
            </div>

            {/* Sheet header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-border/40">
              <div>
                <p className="text-[10px] font-mono tracking-[0.22em] uppercase text-muted-foreground">
                  Refine results
                </p>
                <p className="text-[17px] font-bold text-ink mt-0.5">Filters</p>
              </div>
              <button
                onClick={() => setIsFiltersSheetOpen(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center bg-surface/80 border border-border/50 text-ink/60 hover:text-ink transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-6 pt-5 space-y-6">
              {/* Search */}
              <div>
                <p className="text-[10.5px] font-mono tracking-[0.18em] uppercase text-muted-foreground mb-3">
                  Search
                </p>
                <div className="relative flex items-center">
                  <Search className="absolute left-4 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search residences..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-11 w-full rounded-2xl border border-border/70 bg-white pl-11 pr-4 text-[14px] placeholder-muted-foreground/60 focus:border-ink focus:outline-none transition-all duration-300"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 text-muted-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Status */}
              <div>
                <p className="text-[10.5px] font-mono tracking-[0.18em] uppercase text-muted-foreground mb-3">
                  Availability
                </p>
                <div className="flex gap-2">
                  {(["All", "RFO", "Pre-selling"] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      className={`flex-1 py-2.5 text-[13px] font-semibold rounded-2xl border transition-all ${
                        selectedStatus === status
                          ? "bg-ink text-white border-ink"
                          : "bg-white text-ink/70 border-border/60 hover:border-ink/40"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* District */}
              <div>
                <p className="text-[10.5px] font-mono tracking-[0.18em] uppercase text-muted-foreground mb-3">
                  District
                </p>
                <div className="relative">
                  <select
                    value={selectedLocation || ""}
                    onChange={(e) => setSelectedLocation(e.target.value || null)}
                    className="h-11 w-full rounded-2xl border border-border/60 bg-white px-4 pr-10 text-[14px] font-medium text-ink focus:border-ink focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="">All Districts</option>
                    {locationsData.map((loc) => (
                      <option key={loc.name} value={loc.name}>
                        {loc.name} ({loc.count})
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground text-[10px] font-bold">
                    ▼
                  </div>
                </div>
              </div>

              {/* Price Range */}
              <div>
                <p className="text-[10.5px] font-mono tracking-[0.18em] uppercase text-muted-foreground mb-3">
                  Price Range
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "", label: "All Prices" },
                    { value: "under-6m", label: "Under ₱6.0M" },
                    { value: "6m-8m", label: "₱6.0M – ₱8.0M" },
                    { value: "above-8m", label: "Above ₱8.0M" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSelectedPriceRange(opt.value || null)}
                      className={`py-2.5 px-3 text-[12.5px] font-semibold rounded-2xl border transition-all ${
                        (selectedPriceRange ?? "") === opt.value
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-ink/70 border-border/60 hover:border-primary/40"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-1">
                {activeFiltersCount > 0 && (
                  <button
                    onClick={() => {
                      clearAllFilters();
                    }}
                    className="flex-1 h-12 rounded-2xl border border-dashed border-border text-[13.5px] font-semibold text-muted-foreground hover:border-ink hover:text-ink transition-colors"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={() => setIsFiltersSheetOpen(false)}
                  className="flex-1 h-12 rounded-2xl bg-ink text-white text-[13.5px] font-semibold tracking-wide transition-all hover:bg-ink/90 active:scale-[0.98]"
                >
                  {activeFiltersCount > 0
                    ? `Show ${filteredProperties.length} result${filteredProperties.length !== 1 ? "s" : ""}`
                    : "Done"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PROPERTY GRID (AVAILABLE RESIDENCES) */}
      <section ref={residencesRef} className="px-4 py-10 md:py-12 scroll-mt-24">
        <div className="container-prose">
          {/* Centered Intro */}
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
            <Reveal>
              <p className="eyebrow">
                <span className="gold-rule" />
                Curated shortlist
              </p>
            </Reveal>
            <Reveal delay={120}>
              <h2 className="display-2 mt-4">Available Residences.</h2>
            </Reveal>
            <Reveal delay={240}>
              <p className="lede mt-6">
                A highly considered collection of properties evaluated for space, light,
                construction quality, and location.
              </p>
            </Reveal>
          </div>

          {/* Results count & Filter status summary */}
          <div className="flex justify-between items-center pb-6 border-b border-border/50 mb-10 text-[13px] text-muted-foreground font-medium">
            <div>
              Showing {filteredProperties.length} of {propertiesData.length} opportunities
            </div>
            {selectedLocation && (
              <div className="flex items-center gap-2">
                <span>
                  Filtered by: <span className="text-ink font-semibold">{selectedLocation}</span>
                </span>
                <button
                  onClick={() => setSelectedLocation(null)}
                  className="text-[#3B82F6] hover:underline"
                >
                  Reset
                </button>
              </div>
            )}
          </div>

          {/* Grid Render */}
          {propsLoading ? (
            <div className="grid md:grid-cols-3 gap-x-8 gap-y-16">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-4">
                  <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
                  <Skeleton className="h-4 w-3/4 rounded-full" />
                  <Skeleton className="h-3 w-1/2 rounded-full" />
                  <Skeleton className="h-3 w-full rounded-full" />
                </div>
              ))}
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-20 bg-surface/20 rounded-2xl border border-dashed border-border/60">
              <p className="text-muted-foreground text-sm font-medium">
                No properties match your current filters.
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-ink px-6 text-[12.5px] font-semibold text-white hover:bg-ink/90 transition-all"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-x-8 gap-y-16">
              {filteredProperties.map((property, idx) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onShare={handleShare}
                  onCompare={handleCompare}
                  isCompared={compareProperties.some((p) => p.id === property.id)}
                  idx={idx}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SPOTLIGHT SECTION */}
      {spotlightProp && (
        <section className="px-4 section-pad">
          <div className="container-prose">
            <div className="bg-surface/60 rounded-[3rem] p-8 md:p-16 border border-border/30 relative overflow-hidden">
              <div className="grid lg:grid-cols-12 gap-12 items-center">
                {/* Image Col (7 columns) */}
                <div className="lg:col-span-7">
                  <Reveal>
                    <div className="img-luxe img-luxe-hover overflow-hidden rounded-[2rem] aspect-[16/10] bg-[#18181b] shadow-soft">
                      <img
                        src={spotlightProp.image_url || propOriana}
                        alt={spotlightProp.name}
                        className="img-luxe h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </Reveal>
                </div>

                {/* Text info Col (5 columns) */}
                <div className="lg:col-span-5">
                  <Reveal>
                    <p className="font-mono tracking-[0.25em] text-[#3B82F6] text-[10px] font-bold uppercase">
                      {spotlightProp.promo_badge || "Spotlight Residence"}
                    </p>
                    <h2 className="display-2 mt-4 tracking-tighter leading-none">
                      {spotlightProp.name}.
                    </h2>
                    <p className="text-ink/80 text-[14px] font-semibold mt-4">
                      Developed by {spotlightProp.developer} in {spotlightProp.location}.
                    </p>
                    <p className="text-muted-foreground text-[14px] leading-relaxed mt-4">
                      {spotlightProp.description}
                    </p>
                  </Reveal>

                  {/* Features checklist (using highlights) */}
                  <ul className="mt-8 space-y-3">
                    {(Array.isArray(spotlightProp.highlights) ? spotlightProp.highlights : [])
                      .slice(0, 4)
                      .map((feat, idx) => (
                        <Reveal
                          key={feat}
                          delay={100 + idx * 50}
                          as="li"
                          className="flex items-center gap-3 text-[13.5px] font-medium text-ink/90"
                        >
                          <span className="h-2 w-2 rounded-full bg-[#3B82F6]" />
                          {feat}
                        </Reveal>
                      ))}
                  </ul>

                  {/* CTA actions */}
                  <Reveal delay={300} className="mt-10 flex items-center gap-4 flex-wrap">
                    <Link
                      to="/projects/$slug"
                      params={{ slug: spotlightProp.slug }}
                      className="inline-flex h-11 items-center justify-center rounded-full bg-ink px-6 text-[12.5px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-soft"
                    >
                      View Project
                    </Link>
                    <Link
                      to="/contact"
                      className="inline-flex h-11 items-center justify-center rounded-full border border-border px-6 text-[12.5px] font-semibold text-ink transition-all hover:bg-surface"
                    >
                      Book Consultation
                    </Link>
                  </Reveal>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* LEAD GENERATION — Need help? */}
      <section className="px-4 section-pad-sm bg-surface/30">
        <div className="container-prose max-w-4xl text-center mx-auto">
          <Reveal>
            <h2 className="display-2 tracking-tighter">Need help choosing?</h2>
            <p className="lede mt-6 max-w-xl mx-auto">
              Our real estate guides and advisors are available to curate a personal shortlist
              matched directly to your timeline and capital structure.
            </p>
          </Reveal>

          <Reveal
            delay={160}
            className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              to="/contact"
              className="inline-flex min-h-[52px] w-full sm:w-auto items-center justify-center gap-2.5 rounded-full bg-[#1A56DB] text-white px-8 text-[13px] font-semibold tracking-wide hover:bg-[#1544C0] hover:-translate-y-0.5 transition-all shadow-sm"
            >
              Book Consultation
            </Link>
            <button
              onClick={handleDownloadGuide}
              className="inline-flex min-h-[52px] w-full sm:w-auto items-center justify-center gap-2.5 rounded-full border border-border bg-background text-ink px-8 text-[13px] font-semibold tracking-wide hover:bg-surface hover:-translate-y-0.5 transition-all"
            >
              <FileText className="h-4.5 w-4.5" />
              Download Advisory Guide
            </button>
          </Reveal>
        </div>
      </section>

      {/* FOOTER CALL TO ACTION */}
      <ConsultationCTA />

      {activeShareProperty && (
        <div
          id="share-modal"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4"
          style={{
            background: "rgba(10,12,20,0.75)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
          }}
          onClick={() => setActiveShareProperty(null)}
        >
          <div
            className="w-full sm:max-w-sm relative overflow-hidden"
            style={{
              borderRadius: "28px 28px 0 0",
              background: "oklch(0.14 0.018 252)",
              border: "1px solid oklch(1 0 0 / 0.09)",
              boxShadow: "0 -8px 60px -10px rgba(0,0,0,0.7), 0 0 0 0.5px oklch(1 0 0 / 0.06)",
              ...(typeof window !== "undefined" && window.innerWidth >= 640
                ? { borderRadius: "28px" }
                : {}),
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Property hero image strip */}
            {activeShareProperty.hero_images?.[0] && (
              <div
                className="relative h-36 overflow-hidden"
                style={{ borderRadius: "28px 28px 0 0" }}
              >
                <img
                  src={activeShareProperty.hero_images[0]}
                  alt={activeShareProperty.name}
                  className="w-full h-full object-cover"
                  style={{ filter: "brightness(0.55) saturate(1.1)" }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, oklch(0.14 0.018 252) 0%, transparent 60%)",
                  }}
                />
                <div className="absolute bottom-3 left-5 right-10">
                  <p className="text-[10px] font-mono tracking-[0.22em] uppercase text-white/50 mb-0.5">
                    Share this property
                  </p>
                  <p className="text-[16px] font-bold text-white leading-tight line-clamp-1">
                    {activeShareProperty.name}
                  </p>
                  {activeShareProperty.city && (
                    <p className="text-[12px] text-white/60 font-medium mt-0.5">
                      {activeShareProperty.city}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* No image fallback header */}
            {!activeShareProperty.hero_images?.[0] && (
              <div className="pt-7 px-6 pb-0">
                <div className="flex items-center gap-3 mb-1">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: "oklch(0.43 0.20 258 / 0.2)" }}
                  >
                    <Share2 size={16} style={{ color: "oklch(0.72 0.16 258)" }} />
                  </div>
                  <div>
                    <p
                      className="text-[10px] font-mono tracking-[0.22em] uppercase"
                      style={{ color: "oklch(0.72 0.16 258)" }}
                    >
                      Share property
                    </p>
                    <p className="text-[15px] font-bold text-white leading-tight">
                      {activeShareProperty.name}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Close button */}
            <button
              onClick={() => setActiveShareProperty(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer"
              style={{ background: "oklch(1 0 0 / 0.12)", color: "white" }}
            >
              <X size={14} />
            </button>

            <div className="px-5 pt-5 pb-6">
              {/* Gold divider rule */}
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px flex-1" style={{ background: "oklch(1 0 0 / 0.08)" }} />
                <span
                  className="text-[9px] font-mono tracking-[0.25em] uppercase"
                  style={{ color: "oklch(0.74 0.137 79)" }}
                >
                  Share via
                </span>
                <div className="h-px flex-1" style={{ background: "oklch(1 0 0 / 0.08)" }} />
              </div>

              {/* Social Sharing — 2×2 grid of pill buttons */}
              <div className="grid grid-cols-2 gap-2.5 mb-5">
                {[
                  {
                    name: "Facebook",
                    url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${typeof window !== "undefined" ? window.location.origin : ""}/projects/${activeShareProperty.slug || activeShareProperty.id}`)}`,
                    bg: "#1877F2",
                    svg: (
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path
                          fillRule="evenodd"
                          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ),
                  },
                  {
                    name: "X / Twitter",
                    url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(`${typeof window !== "undefined" ? window.location.origin : ""}/projects/${activeShareProperty.slug || activeShareProperty.id}`)}&text=${encodeURIComponent(`${activeShareProperty.name} — ${activeShareProperty.city} · CityQlo`)}`,
                    bg: "#000000",
                    svg: (
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    ),
                  },
                  {
                    name: "WhatsApp",
                    url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${activeShareProperty.name} — ${activeShareProperty.city} · CityQlo ${typeof window !== "undefined" ? window.location.origin : ""}/projects/${activeShareProperty.slug || activeShareProperty.id}`)}`,
                    bg: "#25D366",
                    svg: (
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
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
                    url: `viber://forward?text=${encodeURIComponent(`${activeShareProperty.name} — ${activeShareProperty.city} · CityQlo ${typeof window !== "undefined" ? window.location.origin : ""}/projects/${activeShareProperty.slug || activeShareProperty.id}`)}`,
                    bg: "#7360F2",
                    svg: (
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    ),
                  },
                ].map((s) => (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 px-4 py-3 rounded-2xl font-semibold text-white text-[13px] transition-all duration-300 hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
                    style={{ background: s.bg, boxShadow: `0 4px 20px ${s.bg}40` }}
                  >
                    {s.svg}
                    {s.name}
                  </a>
                ))}
              </div>

              {/* Copy Link */}
              <div
                className="flex gap-2 items-center rounded-2xl p-1 pl-4"
                style={{
                  background: "oklch(1 0 0 / 0.06)",
                  border: "1px solid oklch(1 0 0 / 0.1)",
                }}
              >
                <input
                  type="text"
                  readOnly
                  value={`${typeof window !== "undefined" ? window.location.origin : ""}/projects/${activeShareProperty.slug || activeShareProperty.id}`}
                  className="flex-1 bg-transparent border-none outline-none text-[11.5px] select-all"
                  style={{ color: "oklch(1 0 0 / 0.45)", fontFamily: "var(--font-mono)" }}
                />
                <button
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      navigator.clipboard.writeText(
                        `${window.location.origin}/projects/${activeShareProperty.slug || activeShareProperty.id}`,
                      );
                      toast.success("Link copied to clipboard!");
                    }
                  }}
                  className="font-semibold text-[12px] px-4 py-2.5 rounded-xl transition-all duration-200 hover:brightness-110 cursor-pointer"
                  style={{ background: "oklch(0.43 0.20 258)", color: "white" }}
                >
                  Copy link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING COMPARE BAR */}
      {compareProperties.length > 0 && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-2xl bg-white/95 border border-border/40 backdrop-blur-md rounded-2xl md:rounded-full py-3.5 px-4 md:px-6 shadow-lift z-40 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
          style={{
            boxShadow: "0 20px 50px -12px rgba(10, 12, 20, 0.12), 0 0 0 1px rgba(10, 12, 20, 0.04)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="bg-[#3B82F6]/10 text-[#3B82F6] px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase tracking-widest shrink-0">
              {compareProperties.length} / 3 Selected
            </div>

            {/* Tiny Thumbnails */}
            <div className="flex items-center -space-x-2.5 overflow-hidden">
              {compareProperties.map((prop, idx) => (
                <div
                  key={prop.id}
                  className="relative h-9 w-9 md:h-10 md:w-10 rounded-full border-2 border-white overflow-hidden bg-surface shadow-sm group cursor-pointer shrink-0"
                  onClick={() => handleCompare(prop)}
                  title={`Remove ${prop.name}`}
                >
                  <img
                    src={resolvePropertyImage(prop, idx)}
                    alt={prop.name}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <X size={10} className="text-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={() => {
                setCompareProperties([]);
                toast.success("Comparison cleared");
              }}
              className="text-muted-foreground hover:text-ink text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-colors px-2 py-1"
            >
              Clear All
            </button>

            <button
              disabled={compareProperties.length < 2}
              onClick={() => setIsCompareModalOpen(true)}
              className={`px-6 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all cursor-pointer ${
                compareProperties.length >= 2
                  ? "bg-[#3B82F6] hover:bg-[#2563EB] text-white shadow-sm hover:scale-[1.02] hover:-translate-y-0.5"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              {compareProperties.length >= 2 ? "Compare Now" : "Add 1 More"}
            </button>
          </div>
        </div>
      )}

      {/* COMPARISON MODAL */}
      {isCompareModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
          style={{
            background: "rgba(10,12,20,0.75)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
          }}
          onClick={() => setIsCompareModalOpen(false)}
        >
          <div
            className="bg-white w-full max-w-5xl h-[85vh] md:h-[80vh] rounded-[2rem] shadow-lift border border-border/30 overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-border/40 flex justify-between items-start shrink-0">
              <div>
                <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#3B82F6] font-bold">
                  CityQlo Discovery
                </p>
                <h2 className="font-display font-extrabold text-[24px] md:text-[30px] tracking-tight text-ink mt-1">
                  Compare Residences
                </h2>
              </div>
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="w-10 h-10 rounded-full bg-surface border border-border/40 flex items-center justify-center text-ink hover:bg-ink hover:text-white transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable specs matrix */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              <div className="w-full overflow-x-auto">
                <div style={{ minWidth: isMobile ? "680px" : "100%" }}>
                  {/* Grid header with images */}
                  <div
                    className="grid border-b border-border/40 pb-6 items-end"
                    style={{
                      display: "grid",
                      gridTemplateColumns: isMobile
                        ? `110px repeat(${compareProperties.length}, 200px)`
                        : `150px repeat(${compareProperties.length}, 1fr)`,
                    }}
                  >
                    <div className="text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-semibold pb-2">
                      Project Specs
                    </div>
                    {compareProperties.map((prop, idx) => (
                      <div
                        key={prop.id}
                        className="px-4 relative text-center flex flex-col items-center"
                      >
                        <button
                          onClick={() => handleCompare(prop)}
                          className="absolute -top-2 right-2 z-10 w-6 h-6 bg-ink/90 text-white rounded-full flex items-center justify-center hover:bg-destructive hover:scale-105 transition-all cursor-pointer"
                          title="Remove from comparison"
                        >
                          <X size={12} />
                        </button>

                        <div className="h-24 w-full md:h-28 rounded-xl overflow-hidden bg-surface border border-border/20 shadow-sm mb-3">
                          <img
                            src={resolvePropertyImage(prop, idx)}
                            alt={prop.name}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <h3 className="font-bold text-ink text-[14px] md:text-[16px] tracking-tight leading-snug line-clamp-1">
                          {prop.name}
                        </h3>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{prop.city}</p>
                      </div>
                    ))}
                  </div>

                  {/* Specification Rows */}
                  {rows.map((row, rIdx) => (
                    <div
                      key={row.label}
                      className={`grid border-b border-border/20 py-4 items-center transition-colors hover:bg-surface/30 ${
                        rIdx % 2 === 0 ? "bg-surface/10" : ""
                      }`}
                      style={{
                        display: "grid",
                        gridTemplateColumns: isMobile
                          ? `110px repeat(${compareProperties.length}, 200px)`
                          : `150px repeat(${compareProperties.length}, 1fr)`,
                      }}
                    >
                      <div className="text-left font-mono text-[9px] md:text-[10px] uppercase tracking-widest text-muted-foreground font-bold px-2">
                        {row.label}
                      </div>
                      {compareProperties.map((prop) => (
                        <div key={prop.id} className="text-center px-4">
                          {row.value(prop)}
                        </div>
                      ))}
                    </div>
                  ))}

                  {/* Actions Row */}
                  <div
                    className="grid py-6 items-center"
                    style={{
                      display: "grid",
                      gridTemplateColumns: isMobile
                        ? `110px repeat(${compareProperties.length}, 200px)`
                        : `150px repeat(${compareProperties.length}, 1fr)`,
                    }}
                  >
                    <div />
                    {compareProperties.map((prop) => (
                      <div key={prop.id} className="px-4">
                        <Link
                          to="/projects/$slug"
                          params={{ slug: prop.slug || prop.id }}
                          className="w-full text-center py-2.5 rounded-full bg-ink text-white font-semibold text-[11px] uppercase tracking-widest hover:bg-[#3B82F6] transition-all hover:-translate-y-0.5 shadow-sm block cursor-pointer"
                        >
                          View Details
                        </Link>
                        <Link
                          to="/contact"
                          className="w-full text-center py-2 mt-2 rounded-full border border-border text-ink hover:bg-surface font-semibold text-[11px] uppercase tracking-widest transition-all block cursor-pointer"
                        >
                          Consultation
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
