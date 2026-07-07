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

  const visible = hasScrolledPastHero && !isScrolling;

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed inset-x-4 z-40 md:hidden max-w-[380px] mx-auto"
      style={{
        bottom: "calc(1rem + env(safe-area-inset-bottom))",
        transform: visible ? "translateY(0) scale(1)" : "translateY(calc(100% + 40px)) scale(0.96)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease",
      }}
    >
      {/* Bar */}
      <div
        className="relative flex items-center justify-between px-2 py-1.5"
        style={{
          background: "oklch(0.21 0.012 252 / 0.96)",
          borderRadius: "22px",
          border: "1px solid oklch(1 0 0 / 0.08)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          boxShadow:
            "0 20px 60px -8px oklch(0.21 0.012 252 / 0.55), 0 4px 16px -4px oklch(0 0 0 / 0.3), inset 0 1px 0 oklch(1 0 0 / 0.06)",
        }}
      >
        {/* Gold hairline top rule */}
        <div
          aria-hidden
          className="absolute top-0 left-8 right-8 h-px rounded-full"
          style={{
            background:
              "linear-gradient(to right, transparent, oklch(0.74 0.137 79 / 0.35), transparent)",
          }}
        />

        {/* Tab: Home */}
        <NavTab
          to="/"
          label="Home"
          icon={<Compass size={18} strokeWidth={isHomeActive ? 2.2 : 1.6} />}
          active={isHomeActive}
        />

        {/* Tab: Browse */}
        <NavTab
          to="/properties"
          label="Browse"
          icon={<LayoutGrid size={18} strokeWidth={isPropertiesActive ? 2.2 : 1.6} />}
          active={isPropertiesActive}
          search={{} as any}
        />

        {/* Center FAB */}
        <div className="flex flex-1 justify-center items-center relative" style={{ height: 56 }}>
          <button
            onClick={handleSearchClick}
            aria-label="Search Properties"
            className="absolute flex items-center justify-center cursor-pointer active:scale-90 focus-visible:outline-none"
            style={{
              top: "-22px",
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "oklch(0.43 0.2 258)",
              border: "2.5px solid oklch(0.21 0.012 252)",
              boxShadow:
                "0 0 0 1px oklch(0.43 0.2 258 / 0.4), 0 8px 28px oklch(0.43 0.2 258 / 0.55), 0 2px 8px oklch(0 0 0 / 0.3)",
              color: "white",
              transition: "transform 0.2s cubic-bezier(0.22,1,0.36,1), box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1.08)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            }}
          >
            <SlidersHorizontal size={19} strokeWidth={2.2} />
          </button>
        </div>

        {/* Tab: Guides */}
        <NavTab
          to="/guides"
          label="Guides"
          icon={<Newspaper size={18} strokeWidth={isGuidesActive ? 2.2 : 1.6} />}
          active={isGuidesActive}
        />

        {/* Tab: Inquire */}
        <NavTab
          to="/contact"
          label="Inquire"
          icon={<Phone size={18} strokeWidth={isContactActive ? 2.2 : 1.6} />}
          active={isContactActive}
        />
      </div>
    </nav>
  );
}

function NavTab({
  to,
  label,
  icon,
  active,
  search,
}: {
  to: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  search?: any;
}) {
  return (
    <Link
      to={to}
      search={search}
      aria-current={active ? "page" : undefined}
      className="flex flex-1 flex-col items-center justify-center gap-1 py-1.5 rounded-2xl focus-visible:outline-none group"
      style={{
        transition: "color 0.2s ease",
        color: active ? "oklch(0.74 0.137 79)" : "oklch(1 0 0 / 0.38)",
        minHeight: 44,
      }}
    >
      {/* Icon pill — gold glow when active */}
      <span
        className="flex items-center justify-center rounded-xl transition-all duration-300"
        style={{
          padding: "4px 10px",
          background: active ? "oklch(0.74 0.137 79 / 0.12)" : "transparent",
        }}
      >
        {icon}
      </span>

      {/* Label */}
      <span
        style={{
          fontSize: "8.5px",
          fontFamily: "var(--font-sans)",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          lineHeight: 1,
          color: active ? "oklch(0.74 0.137 79)" : "oklch(1 0 0 / 0.3)",
          transition: "color 0.2s ease",
        }}
      >
        {label}
      </span>
    </Link>
  );
}
