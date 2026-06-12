import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Home, Building2, Search, BookOpen, MessageSquare } from "lucide-react";

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  // Track scroll state to hide the nav bar during active scrolling
  const [isScrolling, setIsScrolling] = useState(false);
  const [hasScrolledPastHero, setHasScrolledPastHero] = useState(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Guards to completely hide on specific views
  const isPortal = pathname.startsWith("/portal");
  const isProjectDetail = pathname.startsWith("/projects/");

  useEffect(() => {
    if (typeof window === "undefined" || isPortal || isProjectDetail) return;

    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Only show bottom navigation once scrolled past the main hero section (75% of viewport height)
      const heroThreshold = window.innerHeight * 0.75;
      setHasScrolledPastHero(currentScrollY > heroThreshold);

      // Hide bar during active scroll
      setIsScrolling(true);

      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }

      // Show bar 400ms after scrolling stops
      scrollTimerRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 400);

      lastScrollY = currentScrollY;
    };

    // Calculate once on mount
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
    };
  }, [isPortal, isProjectDetail]);

  if (isPortal || isProjectDetail) {
    return null;
  }

  // Symmetrical active tab calculation
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
      navigate({ 
        to: "/properties", 
        search: { focus: true } as any 
      });
    }
  };

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed inset-x-4 z-40 md:hidden transition-transform duration-500 max-w-md mx-auto"
      style={{
        bottom: "calc(1rem + env(safe-area-inset-bottom))",
        transform: (isScrolling || !hasScrolledPastHero) ? "translateY(calc(100% + 32px))" : "translateY(0)",
        transitionTimingFunction: "var(--ease-luxe)",
      }}
    >
      <div 
        className="flex items-center justify-between rounded-full border border-black/8 bg-white/80 px-2.5 py-1.5 shadow-[0_8px_32px_-6px_rgba(0,0,0,0.12)] backdrop-blur-md"
        style={{
          WebkitBackdropFilter: "blur(16px) saturate(160%)",
        }}
      >
        {/* Tab 1: Home */}
        <Link
          to="/"
          aria-current={isHomeActive ? "page" : undefined}
          className={`flex h-11 flex-1 flex-col items-center justify-center rounded-xl transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
            isHomeActive ? "text-primary font-bold" : "text-ink/60 hover:text-ink"
          }`}
        >
          <Home size={18} />
          <span className="text-[9.5px] font-mono mt-0.5 tracking-wide">Home</span>
        </Link>

        {/* Tab 2: Properties */}
        <Link
          to="/properties"
          aria-current={isPropertiesActive ? "page" : undefined}
          className={`flex h-11 flex-1 flex-col items-center justify-center rounded-xl transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
            isPropertiesActive ? "text-primary font-bold" : "text-ink/60 hover:text-ink"
          }`}
        >
          <Building2 size={18} />
          <span className="text-[9.5px] font-mono mt-0.5 tracking-wide">Residences</span>
        </Link>

        {/* Tab 3: Centered Search Magnifying Glass (Circular & Raised) */}
        <div className="flex-1 flex justify-center items-center relative h-11">
          <button
            onClick={handleSearchClick}
            aria-label="Search Properties"
            className="absolute -top-5 w-13 h-13 rounded-full bg-ink text-white hover:bg-primary active:scale-95 transition-all flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.2)] border-[3.5px] border-white/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer"
          >
            <Search size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Tab 4: Guides */}
        <Link
          to="/guides"
          aria-current={isGuidesActive ? "page" : undefined}
          className={`flex h-11 flex-1 flex-col items-center justify-center rounded-xl transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
            isGuidesActive ? "text-primary font-bold" : "text-ink/60 hover:text-ink"
          }`}
        >
          <BookOpen size={18} />
          <span className="text-[9.5px] font-mono mt-0.5 tracking-wide">Guides</span>
        </Link>

        {/* Tab 5: Contact */}
        <Link
          to="/contact"
          aria-current={isContactActive ? "page" : undefined}
          className={`flex h-11 flex-1 flex-col items-center justify-center rounded-xl transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
            isContactActive ? "text-primary font-bold" : "text-ink/60 hover:text-ink"
          }`}
        >
          <MessageSquare size={18} />
          <span className="text-[9.5px] font-mono mt-0.5 tracking-wide">Inquire</span>
        </Link>
      </div>
    </nav>
  );
}
