import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Compass, LayoutGrid, SlidersHorizontal, Newspaper, Phone } from "lucide-react";

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const [isScrolling, setIsScrolling] = useState(false);
  const [hasScrolledPastHero, setHasScrolledPastHero] = useState(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isPortal = pathname.startsWith("/portal");
  const isProjectDetail = pathname.startsWith("/projects/");

  useEffect(() => {
    if (typeof window === "undefined" || isPortal || isProjectDetail) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const heroThreshold = window.innerHeight * 0.75;
      setHasScrolledPastHero(currentScrollY > heroThreshold);
      setIsScrolling(true);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => setIsScrolling(false), 400);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, [isPortal, isProjectDetail]);

  if (isPortal || isProjectDetail) return null;

  const isHomeActive = pathname === "/";
  const isPropertiesActive = pathname.startsWith("/properties");
  const isGuidesActive = pathname.startsWith("/guides");
  const isContactActive = pathname.startsWith("/contact");

  const handleSearchClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === "/properties") {
      const input = document.getElementById("properties-search-input") as HTMLInputElement | null;
      if (input) {
        input.focus();
        input.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } else {
      navigate({ to: "/properties", search: { focus: true } as any });
    }
  };

  // Shared classes
  const tabBase =
    "flex flex-1 flex-col items-center justify-center gap-0.5 py-1 rounded-2xl transition-all duration-300 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

  const labelBase = "text-[9px] font-sans font-semibold tracking-[0.08em] uppercase leading-none";

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed inset-x-3 z-40 md:hidden transition-transform duration-500 max-w-sm mx-auto"
      style={{
        bottom: "calc(0.85rem + env(safe-area-inset-bottom))",
        transform:
          isScrolling || !hasScrolledPastHero ? "translateY(calc(100% + 32px))" : "translateY(0)",
        transitionTimingFunction: "var(--ease-luxe)",
      }}
    >
      <div
        className="flex items-center justify-between rounded-[22px] border border-black/[0.07] bg-white/90 px-1 py-1 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.16),0_2px_8px_-2px_rgba(0,0,0,0.06)]"
        style={{
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
        }}
      >
        {/* Tab 1: Home */}
        <Link
          to="/"
          aria-current={isHomeActive ? "page" : undefined}
          className={`${tabBase} ${isHomeActive ? "text-[#1A56DB]" : "text-ink/45 hover:text-ink/70"}`}
        >
          <span
            className={`flex items-center justify-center rounded-xl transition-all duration-300 ${
              isHomeActive ? "bg-[#1A56DB]/10 px-3 py-1.5" : "px-3 py-1.5"
            }`}
          >
            <Compass size={19} strokeWidth={isHomeActive ? 2.25 : 1.75} />
          </span>
          <span className={`${labelBase} ${isHomeActive ? "text-[#1A56DB]" : "text-ink/40"}`}>
            Home
          </span>
        </Link>

        {/* Tab 2: Properties */}
        <Link
          to="/properties"
          search={{} as any}
          aria-current={isPropertiesActive ? "page" : undefined}
          className={`${tabBase} ${isPropertiesActive ? "text-[#1A56DB]" : "text-ink/45 hover:text-ink/70"}`}
        >
          <span
            className={`flex items-center justify-center rounded-xl transition-all duration-300 ${
              isPropertiesActive ? "bg-[#1A56DB]/10 px-3 py-1.5" : "px-3 py-1.5"
            }`}
          >
            <LayoutGrid size={19} strokeWidth={isPropertiesActive ? 2.25 : 1.75} />
          </span>
          <span className={`${labelBase} ${isPropertiesActive ? "text-[#1A56DB]" : "text-ink/40"}`}>
            Browse
          </span>
        </Link>

        {/* Tab 3: Center Search FAB */}
        <div className="flex flex-1 justify-center items-center relative h-12">
          <button
            onClick={handleSearchClick}
            aria-label="Search Properties"
            className="absolute -top-5 w-14 h-14 rounded-full bg-[#1A56DB] text-white active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A56DB] focus-visible:ring-offset-2"
            style={{
              boxShadow: "0 6px 24px rgba(26, 86, 219, 0.45), 0 2px 8px rgba(0,0,0,0.12)",
              border: "3px solid white",
            }}
          >
            <SlidersHorizontal size={20} strokeWidth={2.25} />
          </button>
        </div>

        {/* Tab 4: Guides */}
        <Link
          to="/guides"
          aria-current={isGuidesActive ? "page" : undefined}
          className={`${tabBase} ${isGuidesActive ? "text-[#1A56DB]" : "text-ink/45 hover:text-ink/70"}`}
        >
          <span
            className={`flex items-center justify-center rounded-xl transition-all duration-300 ${
              isGuidesActive ? "bg-[#1A56DB]/10 px-3 py-1.5" : "px-3 py-1.5"
            }`}
          >
            <Newspaper size={19} strokeWidth={isGuidesActive ? 2.25 : 1.75} />
          </span>
          <span className={`${labelBase} ${isGuidesActive ? "text-[#1A56DB]" : "text-ink/40"}`}>
            Guides
          </span>
        </Link>

        {/* Tab 5: Contact */}
        <Link
          to="/contact"
          aria-current={isContactActive ? "page" : undefined}
          className={`${tabBase} ${isContactActive ? "text-[#1A56DB]" : "text-ink/45 hover:text-ink/70"}`}
        >
          <span
            className={`flex items-center justify-center rounded-xl transition-all duration-300 ${
              isContactActive ? "bg-[#1A56DB]/10 px-3 py-1.5" : "px-3 py-1.5"
            }`}
          >
            <Phone size={19} strokeWidth={isContactActive ? 2.25 : 1.75} />
          </span>
          <span className={`${labelBase} ${isContactActive ? "text-[#1A56DB]" : "text-ink/40"}`}>
            Inquire
          </span>
        </Link>
      </div>
    </nav>
  );
}
