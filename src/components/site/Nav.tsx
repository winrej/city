import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSiteSettings } from "../../lib/api/admin.functions";
import { useIsMobile } from "../../hooks/use-mobile";
import { Sliders } from "lucide-react";

const links = [
  { to: "/properties", label: "Properties" },
  { to: "/why-invest", label: "Why Invest" },
  { to: "/guides", label: "Guides" },
  { to: "/about", label: "About" },
] as const;

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // true while the user is actively scrolling — collapses the nav
  const [isScrolling, setIsScrolling] = useState(false);
  // Filter pill state (properties page only)
  const [filterCount, setFilterCount] = useState(0);

  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isMobile = useIsMobile();
  const isPropertiesPage = pathname === "/properties";

  const { data: siteSettings } = useQuery({
    queryKey: ["portal-settings"],
    queryFn: () => getSiteSettings(),
  });

  const homepageSettings = siteSettings?.find((r: any) => r.key === "homepage")?.value ?? {};

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);

      // Mark as actively scrolling
      setIsScrolling(true);

      // Clear any existing pause timer
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);

      // After 400ms of no scroll events, consider the user paused
      scrollTimerRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 400);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  // Sync filter count badge from properties page via custom event
  useEffect(() => {
    const handler = (e: Event) => {
      setFilterCount((e as CustomEvent<number>).detail ?? 0);
    };
    window.addEventListener("filters-active-count", handler);
    // Reset when leaving the properties page
    if (!isPropertiesPage) setFilterCount(0);
    return () => window.removeEventListener("filters-active-count", handler);
  }, [isPropertiesPage]);

  // Collapse the nav (hide links + CTA) only while actively scrolling down
  // Always keep it visible at the very top of the page
  const collapsed = isScrolling && scrolled;

  // Read config settings
  const layoutMode = homepageSettings.nav_layout_mode ?? "pill";
  const blurSetting = parseInt(homepageSettings.nav_blur_strength ?? "16");

  // Unified pill: lighter when at top, more opaque once scrolled
  const activeBgOpacity = scrolled ? 0.92 : 0.68;
  const activeBlur = scrolled ? blurSetting : Math.round(blurSetting * 0.6);

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 transition-all duration-300"
        style={{
          paddingTop: `calc(${layoutMode === "pill" ? (scrolled ? "0.5rem" : "0.85rem") : "0px"} + env(safe-area-inset-top, 0px))`,
          paddingLeft: layoutMode === "pill" ? (scrolled ? "1rem" : "1.25rem") : "0px",
          paddingRight: layoutMode === "pill" ? (scrolled ? "1rem" : "1.25rem") : "0px",
          paddingBottom: "0px",
        }}
      >
        <nav
          className={`mx-auto flex max-w-7xl items-center justify-between transition-all duration-[400ms] ${
            layoutMode === "pill"
              ? "rounded-full px-4 md:px-7"
              : "w-full rounded-none px-6 md:px-12"
          } ${scrolled ? "h-14 md:h-[62px] shadow-soft" : "h-16 md:h-[76px]"}`}
          style={{
            transitionTimingFunction: "var(--ease-luxe)",
            background: `rgba(255, 255, 255, ${activeBgOpacity})`,
            backdropFilter: `saturate(160%) blur(${activeBlur}px)`,
            WebkitBackdropFilter: `saturate(160%) blur(${activeBlur}px)`,
            border: `1px solid rgba(0, 0, 0, ${scrolled ? 0.07 : 0.04})`,
            boxShadow: scrolled
              ? "0 2px 24px rgba(0, 0, 0, 0.07)"
              : "0 1px 12px rgba(0, 0, 0, 0.04)",
          }}
          aria-label="Primary"
        >
          {/* Left: Logo + DMCI badge */}
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2.5 transition-opacity duration-300 hover:opacity-80"
              onClick={() => setOpen(false)}
            >
              <img
                src="/Logo.png"
                alt="CityQlo"
                className={`object-contain transition-all duration-[400ms] ${scrolled ? "h-8 md:h-9" : "h-9 md:h-11"}`}
                style={{ transitionTimingFunction: "var(--ease-luxe)" }}
              />
            </Link>
            {/* DMCI badge — all screen sizes, hide while scrolling */}
            <div
              className={`flex items-center gap-1.5 border-l border-black/10 pl-3 lg:pl-4 h-7 transition-all duration-[400ms] ${
                collapsed ? "opacity-0 pointer-events-none -translate-x-2" : "opacity-100 translate-x-0"
              }`}
              style={{ transitionTimingFunction: "var(--ease-luxe)" }}
            >
              <img
                src="/dmci-homes-seeklogo.png"
                alt="DMCI Homes"
                className="h-4 lg:h-6 object-contain opacity-75"
              />
              <span className="text-[7.5px] lg:text-[8.5px] font-mono tracking-widest uppercase text-muted-foreground leading-tight">
                Accredited<br />Partner
              </span>
            </div>
          </div>

          {/* Center: Nav links — slide up + fade while scrolling */}
          <ul
            className={`hidden items-center gap-9 md:flex transition-all duration-[400ms] ${
              collapsed ? "opacity-0 pointer-events-none -translate-y-1" : "opacity-100 translate-y-0"
            }`}
            style={{ transitionTimingFunction: "var(--ease-luxe)" }}
          >
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="relative text-[14.5px] font-[600] tracking-[0.01em] transition-all duration-[300ms] pb-1
                    after:absolute after:bottom-0 after:left-0 after:h-[2px] after:rounded-full after:transition-all after:duration-[400ms] after:content-['']
                    after:bg-[#1A56DB] after:w-0 hover:after:w-full hover:-translate-y-[1px]"
                  style={{
                    color: "#34393D",
                    transitionTimingFunction: "var(--ease-luxe)",
                  }}
                  activeProps={{
                    style: { color: "#1A56DB" },
                    className: "after:w-full",
                  }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right: CTA + hamburger */}
          <div className="flex items-center gap-2">
            {/* Book Consultation — fade out while scrolling */}
            <Link
              to="/contact"
              className={`hidden items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold tracking-[0.02em] transition-all duration-[400ms] hover:-translate-y-[1px] md:inline-flex bg-[#1A56DB] text-white hover:bg-[#1544C0] shadow-sm ${
                collapsed ? "opacity-0 pointer-events-none scale-95" : "opacity-100 scale-100"
              }`}
              style={{ transitionTimingFunction: "var(--ease-luxe)" }}
            >
              Book Consultation
            </Link>
            {/* Filter pill — properties page, mobile, scrolled */}
            {isPropertiesPage && isMobile && scrolled && (
              <button
                id="nav-filter-pill"
                type="button"
                aria-label="Open filters"
                onClick={() => window.dispatchEvent(new CustomEvent("open-filters-sheet"))}
                className={`inline-flex items-center gap-1.5 rounded-full border border-black/12 bg-white/80 backdrop-blur px-3.5 py-2 text-[12px] font-semibold text-ink transition-all duration-300 active:scale-95 md:hidden ${
                  collapsed ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
                style={{ transitionTimingFunction: "var(--ease-luxe)" }}
              >
                <Sliders className="h-3 w-3 text-ink/60" />
                Filters
                {filterCount > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white leading-none">
                    {filterCount}
                  </span>
                )}
              </button>
            )}
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white/60 backdrop-blur md:hidden transition-colors duration-[300ms]"
              style={{ transitionTimingFunction: "var(--ease-luxe)" }}
            >
              <span className="relative block h-3 w-4">
                <span
                  className={`absolute left-0 top-0 h-px w-4 transition-all duration-300 bg-[#34393D] ${open ? "translate-y-1.5 rotate-45" : ""}`}
                  style={{ transitionTimingFunction: "var(--ease-luxe)" }}
                />
                <span
                  className={`absolute left-0 top-3 h-px w-4 transition-all duration-300 bg-[#34393D] ${open ? "-translate-y-1.5 -rotate-45" : ""}`}
                  style={{ transitionTimingFunction: "var(--ease-luxe)" }}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Full-screen luxury mobile drawer */}
      <div
        className={`fixed inset-0 z-40 md:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <div
          className={`absolute inset-0 bg-background transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
          style={{ transitionTimingFunction: "var(--ease-luxe)" }}
        />
        <div
          className={`relative flex h-full flex-col px-6 pb-10 transition-all duration-[350ms] ${open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
          style={{
            transitionTimingFunction: "var(--ease-luxe)",
            paddingTop: "calc(6rem + env(safe-area-inset-top, 0px))",
            paddingBottom: "calc(2.5rem + env(safe-area-inset-bottom))",
          }}
        >
          <p className="eyebrow">
            <span className="gold-rule" />
            Menu
          </p>
          <ul className="mt-10 flex flex-col">
            {links
              .filter((l) => l.label !== "Properties" && l.label !== "Guides")
              .map((l, i) => (
                <li
                  key={l.to}
                className="border-b border-hairline transition-all duration-[350ms]"
                style={{
                  transitionDelay: open ? `${60 + i * 30}ms` : "0ms",
                  transitionTimingFunction: "var(--ease-luxe)",
                  opacity: open ? 1 : 0,
                  transform: open ? "translateY(0)" : "translateY(8px)",
                }}
              >
                <Link
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between py-6 text-[32px] font-bold tracking-[-0.028em] text-ink"
                  activeProps={{ className: "text-primary" }}
                >
                  {l.label}
                  <span aria-hidden className="text-muted-foreground">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-12">
            {/* DMCI Accredited Partner badge in mobile drawer */}
            <div
              className="flex items-center justify-center gap-3 mb-8 py-4 px-6 rounded-2xl border border-black/8"
              style={{ background: "rgba(0,0,0,0.025)" }}
            >
              <img
                src="/dmci-homes-seeklogo.png"
                alt="DMCI Homes"
                className="h-8 object-contain opacity-80"
              />
              <div className="flex flex-col">
                <span className="text-[10px] font-mono tracking-[0.18em] uppercase text-muted-foreground">
                  Accredited Partner
                </span>
                <span className="text-[12px] font-semibold text-ink/70 mt-0.5">
                  DMCI Homes
                </span>
              </div>
            </div>

            {/* Social Media Links in Mobile Menu */}
            {(() => {
              const socialSettings =
                siteSettings?.find((r: any) => r.key === "social")?.value ?? {};
              const socialPlatforms = [
                {
                  key: "facebook",
                  name: "Facebook",
                  icon: (
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ),
                },
                {
                  key: "instagram",
                  name: "Instagram",
                  icon: (
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.315 2c2.43 0 2.784.01 3.71.054 9.39.429 9.02 9.35 9.38 9.38.044.926.054 1.281.054 3.71 0 2.43-.01 2.784-.054 3.71-.428 9.39-9.356 9.02-9.38 9.38-.926.044-1.28 0-3.71 0-2.43 0-2.784-.01-3.71-.054-9.39-.429-9.02-9.35-9.38-9.38C2.078 15.282 2.067 14.92 2.067 12.5c0-2.43.01-2.784.054-3.71.428-9.39 9.356-9.02 9.38-9.38.926-.044 1.28 0 3.71 0zm0 1.913c-2.392 0-2.677.01-3.621.053-6.83.312-6.522 6.516-6.83 6.83-.043.944-.053 1.229-.053 3.62 0 2.392.01 2.677.053 3.621.312 6.83 6.516 6.522 6.83 6.83.944.043 1.229.053 3.62.053 2.392 0 2.677-.01 3.621-.053 6.83-.312 6.522-6.516 6.83-6.83.043-.944.053-1.229.053-3.62 0-2.392-.01-2.677-.053-3.621-.312-6.83-6.516-6.522-6.83-6.83-.944-.043-1.229-.053-3.62-.053zm0 3.201a5.385 5.385 0 110 10.77 5.385 5.385 0 010-10.77zm0 1.913a3.472 3.472 0 100 6.944 3.472 3.472 0 000-6.944zm5.502-1.125a1.26 1.26 0 11-2.52 0 1.26 1.26 0 012.52 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ),
                },
                {
                  key: "tiktok",
                  name: "TikTok",
                  icon: (
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.52-4.06-1.37-.28-.2-.53-.43-.77-.68v6.46c.07 2.12-.76 4.31-2.45 5.62-1.74 1.41-4.22 1.83-6.27 1.14-2.18-.7-3.95-2.6-4.43-4.83-.54-2.39.06-5.07 1.69-6.84 1.52-1.72 3.92-2.58 6.17-2.26v4.04c-1.23-.27-2.6.09-3.48.99-.87.87-1.17 2.21-.76 3.39.4 1.14 1.57 1.95 2.78 1.95 1.72.03 3.19-1.26 3.33-2.96.04-1.28.02-2.56.02-3.84V.02z" />
                    </svg>
                  ),
                },
                {
                  key: "linkedin",
                  name: "LinkedIn",
                  icon: (
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ),
                },
                {
                  key: "youtube",
                  name: "YouTube",
                  icon: (
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M23.498 6.163c-.272-.98-1.04-1.748-2.02-2.02C19.7 3.65 12 3.65 12 3.65s-7.7 0-9.478.493c-.98.272-1.748 1.04-2.02 2.02C0 7.963 0 12 0 12s0 4.038.502 5.837c.272.98 1.04 1.748 2.02 2.02C4.3 20.35 12 20.35 12 20.35s7.7 0 9.478-.493c.98-.272 1.748-1.04 2.02-2.02C24 16.038 24 12 24 12s0-4.038-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ),
                },
                {
                  key: "reddit",
                  name: "Reddit",
                  icon: (
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M24 11.5c0-1.65-1.35-3-3-3-.96 0-1.86.48-2.42 1.24-1.64-1-3.85-1.64-6.23-1.72l1.28-4 3.66.78c.07.94.88 1.7 1.87 1.7 1.02 0 1.85-.83 1.85-1.85s-.83-1.85-1.85-1.85c-.88 0-1.62.62-1.8 1.44l-4-0.86c-.22-.05-.44.07-.51.29l-1.54 4.8c-2.43.04-4.68.68-6.35 1.7C4.18 9.78 3.28 9.3 2.3 9.3c-1.65 0-3 1.35-3 3 0 1.1.6 2.05 1.48 2.58-.06.3-.08.62-.08.92 0 3.75 4.36 6.8 9.75 6.8s9.75-3.05 9.75-6.8c0-.3-.02-.62-.08-.92.88-.53 1.48-1.48 1.48-2.58zM7.5 13c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5zm9.46 4c-1.22 1.22-3.53 1.3-4.46 1.3-.94 0-3.24-.08-4.46-1.3-.2-.2-.2-.5 0-.7.2-.2.5-.2.7 0 .9.9 2.8.98 3.76.98.96 0 2.87-.08 3.76-.98.2-.2.5-.2.7 0 .2.2.2.5 0 .7zm-1.96-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                    </svg>
                  ),
                },
              ];

              return (
                <div className="flex gap-4 mb-6 justify-center">
                  {socialPlatforms.map((platform) => {
                    const rawUrl = socialSettings[platform.key];
                    const fallbackUrls: Record<string, string> = {
                      facebook: "https://facebook.com/cityqlo",
                      instagram: "https://instagram.com/cityqlo",
                      tiktok: "https://tiktok.com/@cityqlo",
                      linkedin: "https://linkedin.com/company/cityqlo",
                      youtube: "https://youtube.com/@cityqlo",
                      reddit: "https://reddit.com/r/cityqlo",
                    };
                    const url = rawUrl || fallbackUrls[platform.key] || "#";
                    return (
                      <a
                        key={platform.key}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={platform.name}
                        className="p-3 rounded-full bg-ink/5 text-ink/60 hover:text-ink hover:bg-ink/10 transition-all duration-300"
                      >
                        {platform.icon}
                      </a>
                    );
                  })}
                </div>
              );
            })()}

            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="flex min-h-[60px] w-full items-center justify-center gap-3 rounded-full bg-ink px-6 text-[13px] font-semibold tracking-[0.02em] text-white transition-all duration-[350ms] hover:-translate-y-[2px] hover:shadow-lift"
              style={{ transitionTimingFunction: "var(--ease-luxe)" }}
            >
              Book Consultation
              <span aria-hidden>→</span>
            </Link>
            <p className="mt-6 text-center text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              Metro Manila · hello@cityqlo.com
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
