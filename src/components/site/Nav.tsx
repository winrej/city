import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ChevronDown } from "lucide-react";
import { getSiteSettings } from "../../lib/api/admin.functions";
import { useIsMobile } from "../../hooks/use-mobile";

const links = [
  { to: "/properties", label: "Properties" },
  { to: "/why-invest", label: "Why Invest" },
  { to: "/guides", label: "Guides" },
] as const;

const moreLinks = [
  { to: "/about", label: "About", desc: "Our team, accreditation & developer partnerships" },
  { to: "/faq", label: "FAQ", desc: "Common questions about process, legalities & DMCI" },
  { to: "/careers", label: "Careers", desc: "Join our team of property advisors" },
] as const;

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Filter pill state (properties page only)
  const [filterCount, setFilterCount] = useState(0);
  // Desktop "More" dropdown
  const [moreOpen, setMoreOpen] = useState(false);
  const moreHoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const moreRef = useRef<HTMLLIElement>(null);
  // Mobile "More" accordion
  const [moreExpanded, setMoreExpanded] = useState(false);

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
      setScrolled(window.scrollY > 24);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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

  // Nav stays fully expanded at all times — no hide-on-scroll collapse
  const collapsed = false;

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
          } ${scrolled ? "h-14 md:h-[62px]" : "h-16 md:h-[76px]"} ${scrolled && !open ? "shadow-soft" : ""}`}
          style={{
            transitionTimingFunction: "var(--ease-luxe)",
            background: open ? "transparent" : `rgba(255, 255, 255, ${activeBgOpacity})`,
            backdropFilter: open ? "none" : `saturate(160%) blur(${activeBlur}px)`,
            WebkitBackdropFilter: open ? "none" : `saturate(160%) blur(${activeBlur}px)`,
            border: open
              ? "1px solid transparent"
              : `1px solid rgba(0, 0, 0, ${scrolled ? 0.07 : 0.04})`,
            boxShadow: open
              ? "none"
              : scrolled
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
                collapsed
                  ? "opacity-0 pointer-events-none -translate-x-2"
                  : "opacity-100 translate-x-0"
              }`}
              style={{ transitionTimingFunction: "var(--ease-luxe)" }}
            >
              <img
                src="/dmci-homes-seeklogo.png"
                alt="DMCI Homes"
                className="h-4 lg:h-6 object-contain opacity-75"
              />
              <span className="hidden md:block text-[7.5px] lg:text-[8.5px] font-mono tracking-widest uppercase text-muted-foreground leading-tight">
                Accredited
                <br />
                Partner
              </span>
            </div>
          </div>

          {/* Center: Nav links — slide up + fade while scrolling */}
          <ul
            className={`hidden items-center gap-9 md:flex transition-all duration-[400ms] ${
              collapsed
                ? "opacity-0 pointer-events-none -translate-y-1"
                : "opacity-100 translate-y-0"
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

            {/* More dropdown */}
            <li
              ref={moreRef}
              className="relative"
              onMouseEnter={() => {
                if (moreHoverTimeout.current) clearTimeout(moreHoverTimeout.current);
                setMoreOpen(true);
              }}
              onMouseLeave={() => {
                moreHoverTimeout.current = setTimeout(() => setMoreOpen(false), 120);
              }}
            >
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded={moreOpen}
                className="relative flex items-center gap-1 text-[14.5px] font-[600] tracking-[0.01em] transition-all duration-[300ms] pb-1 cursor-pointer select-none
                  after:absolute after:bottom-0 after:left-0 after:h-[2px] after:rounded-full after:transition-all after:duration-[400ms] after:content-['']
                  after:bg-[#1A56DB] after:w-0 hover:after:w-full hover:-translate-y-[1px]"
                style={{ color: "#34393D", transitionTimingFunction: "var(--ease-luxe)" }}
              >
                More
                <svg
                  className={`h-3 w-3 transition-transform duration-300 ${moreOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown panel */}
              <div
                role="menu"
                aria-label="More pages"
                className={`absolute left-1/2 top-[calc(100%+14px)] z-50 w-64 -translate-x-1/2 transition-all duration-[280ms] ${
                  moreOpen
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 -translate-y-2 pointer-events-none"
                }`}
                style={{ transitionTimingFunction: "var(--ease-luxe)" }}
              >
                {/* Invisible bridge to prevent gap closing the dropdown */}
                <div className="absolute -top-4 left-0 right-0 h-4" />
                <div className="rounded-2xl border border-black/[0.07] bg-white/95 shadow-[0_8px_40px_rgba(0,0,0,0.12)] backdrop-blur-xl overflow-hidden">
                  {/* Top accent */}
                  <div className="h-[2px] w-full bg-gradient-to-r from-[#1A56DB]/60 via-[#1A56DB] to-[#1A56DB]/60" />
                  <div className="p-2">
                    {moreLinks.map((ml) => (
                      <Link
                        key={ml.to}
                        to={ml.to}
                        role="menuitem"
                        onClick={() => setMoreOpen(false)}
                        className="group flex flex-col gap-0.5 rounded-xl px-3.5 py-3 transition-all duration-200 hover:bg-[#1A56DB]/[0.06]"
                        activeProps={{ className: "bg-[#1A56DB]/[0.08]" }}
                      >
                        <span className="text-[13.5px] font-semibold text-[#34393D] group-hover:text-[#1A56DB] transition-colors duration-200">
                          {ml.label}
                        </span>
                        <span className="text-[11.5px] text-[#34393D]/50 leading-snug">
                          {ml.desc}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </li>
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
        className={`fixed inset-0 z-[45] md:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
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
            paddingTop: "calc(6.5rem + env(safe-area-inset-top, 0px))",
            paddingBottom: "calc(2rem + env(safe-area-inset-bottom))",
          }}
        >
          <ul className="flex flex-col">
            {(
              [
                {
                  to: "/properties",
                  label: "Properties",
                  num: "01",
                  desc: "Browse curated DMCI condos and pre-selling units",
                },
                {
                  to: "/why-invest",
                  label: "Why Invest",
                  num: "02",
                  desc: "Investment thesis, yield calculations, and market data",
                },
              ] as const
            ).map((l, i) => (
              <li
                key={l.to}
                className="border-b border-black/5 transition-all duration-[350ms]"
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
                  className="group flex flex-col py-4 text-ink"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] text-gold/80 tracking-[0.2em] font-bold">
                        {l.num}
                      </span>
                      <span className="font-display font-extrabold text-[22px] tracking-tight text-ink group-hover:text-primary transition-colors duration-300">
                        {l.label}
                      </span>
                    </div>
                    <ArrowRight className="h-4.5 w-4.5 text-muted-foreground/50 transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                  <p className="mt-1.5 pl-7 text-[12.5px] text-muted-foreground font-medium leading-normal">
                    {l.desc}
                  </p>
                </Link>
              </li>
            ))}

            {/* More accordion */}
            <li
              className="border-b border-black/5 transition-all duration-[350ms]"
              style={{
                transitionDelay: open ? "120ms" : "0ms",
                transitionTimingFunction: "var(--ease-luxe)",
                opacity: open ? 1 : 0,
                transform: open ? "translateY(0)" : "translateY(8px)",
              }}
            >
              <button
                type="button"
                onClick={() => setMoreExpanded((v) => !v)}
                className="group flex w-full flex-col py-4 text-left focus:outline-none"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] text-gold/80 tracking-[0.2em] font-bold">
                      03
                    </span>
                    <span className="font-display font-extrabold text-[22px] tracking-tight text-ink group-hover:text-primary transition-colors duration-300">
                      More
                    </span>
                  </div>
                  <ChevronDown
                    className={`h-4.5 w-4.5 text-muted-foreground/50 transition-transform duration-300 group-hover:text-primary ${
                      moreExpanded ? "rotate-180" : ""
                    }`}
                  />
                </div>
                <p className="mt-1.5 pl-7 text-[12.5px] text-muted-foreground font-medium leading-normal">
                  About, FAQ & Careers
                </p>
              </button>

              {/* Nested links */}
              <div
                className="overflow-hidden transition-all duration-[350ms]"
                style={{
                  maxHeight: moreExpanded ? `${moreLinks.length * 56}px` : "0px",
                  transitionTimingFunction: "var(--ease-luxe)",
                }}
              >
                <ul className="mb-3 flex flex-col gap-1.5 pl-7">
                  {moreLinks.map((ml) => (
                    <li key={ml.to}>
                      <Link
                        to={ml.to}
                        onClick={() => {
                          setOpen(false);
                          setMoreExpanded(false);
                        }}
                        className="group flex items-center justify-between rounded-xl px-3 py-2.5 transition-all duration-300 hover:bg-black/[0.04]"
                        activeProps={{ className: "text-primary" }}
                      >
                        <span className="text-[14.5px] font-[600] text-ink/80 group-hover:text-primary transition-colors duration-300">
                          {ml.label}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/45 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-primary" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ul>

          <div className="mt-auto pt-8">
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
                      className="h-4.5 w-4.5"
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
                      className="h-4.5 w-4.5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  ),
                },
                {
                  key: "tiktok",
                  name: "TikTok",
                  icon: (
                    <svg
                      className="h-4.5 w-4.5"
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
                      className="h-4.5 w-4.5"
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
                      className="h-4.5 w-4.5"
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
              ];

              return (
                <div className="flex flex-col items-center mb-6">
                  <span className="text-[9.5px] font-mono tracking-[0.2em] uppercase text-muted-foreground/80 mb-3">
                    Connect with us
                  </span>
                  <div className="flex gap-2.5 justify-center">
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
                          className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/20 bg-background text-gold/80 hover:text-white hover:bg-gold hover:border-gold transition-all duration-300 shadow-sm hover:shadow-soft hover:-translate-y-[1.5px]"
                        >
                          {platform.icon}
                        </a>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* DMCI Accredited Partner minimalist text row */}
            <div className="flex items-center justify-center gap-1.5 text-ink/40 font-mono text-[9px] uppercase tracking-[0.2em] mb-6">
              <span>Accredited Partner</span>
              <span className="h-1 w-1 rounded-full bg-gold" />
              <span className="font-semibold text-ink/65">DMCI Homes</span>
            </div>

            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="flex min-h-[56px] w-full items-center justify-center gap-3 rounded-full bg-[#1A56DB] hover:bg-[#1544C0] px-6 text-[13px] font-semibold tracking-[0.02em] text-white transition-all duration-[350ms] hover:-translate-y-[2px] hover:shadow-lift"
              style={{ transitionTimingFunction: "var(--ease-luxe)" }}
            >
              Book Consultation
              <span aria-hidden>→</span>
            </Link>
            <p className="mt-5 text-center text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
              Metro Manila · hello@cityqlo.com
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
