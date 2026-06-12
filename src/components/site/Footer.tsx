import { Link, useLocation } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getSiteSettings } from "../../lib/api/admin.functions";

// Premium brand-accurate SVG icons — pixel-perfect, correct paths
const FacebookIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const TikTokIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.52V6.77a4.85 4.85 0 01-1.02-.08z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const YouTubeIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const RedditIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
  </svg>
);

const socialPlatforms = [
  { key: "facebook", name: "Facebook", Icon: FacebookIcon, brandColor: "#1877F2" },
  { key: "instagram", name: "Instagram", Icon: InstagramIcon, brandColor: "#E1306C" },
  { key: "tiktok", name: "TikTok", Icon: TikTokIcon, brandColor: "#ffffff" },
  { key: "linkedin", name: "LinkedIn", Icon: LinkedInIcon, brandColor: "#0A66C2" },
  { key: "youtube", name: "YouTube", Icon: YouTubeIcon, brandColor: "#FF0000" },
  { key: "reddit", name: "Reddit", Icon: RedditIcon, brandColor: "#FF4500" },
];

const fallbackUrls: Record<string, string> = {
  facebook: "https://facebook.com/cityqlo",
  instagram: "https://instagram.com/cityqlo",
  tiktok: "https://tiktok.com/@cityqlo",
  linkedin: "https://linkedin.com/company/cityqlo",
  youtube: "https://youtube.com/@cityqlo",
  reddit: "https://reddit.com/r/cityqlo",
};

export function Footer() {
  const location = useLocation();
  const pathname = location.pathname;
  const isContactPage = pathname === "/contact";

  const { data: siteSettings } = useQuery({
    queryKey: ["portal-settings"],
    queryFn: () => getSiteSettings(),
  });

  const socialSettings = siteSettings?.find((r: any) => r.key === "social")?.value ?? {};

  if (isContactPage) {
    return (
      <footer
        style={{ background: "#34393D" }}
        className="mt-16 md:mt-24 rounded-t-[32px] md:rounded-t-[40px] overflow-hidden"
      >
        <div className="px-6 py-10 md:px-16 mx-auto max-w-7xl">
          <div
            className="flex flex-col gap-3 text-[11px] tracking-[0.06em] md:flex-row md:justify-between items-center"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            <p>© {new Date().getFullYear()} CityQlo. All rights reserved.</p>
            <p>Property advisory · Philippines</p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer
      style={{ background: "#34393D" }}
      className="mt-16 md:mt-28 rounded-t-[40px] md:rounded-t-[56px] overflow-hidden"
    >
      {/* Top section: tagline + socials */}
      <div className="border-b border-white/8 px-6 py-14 md:px-16 md:py-20">
        <div className="mx-auto max-w-7xl flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          {/* Wordmark + tagline */}
          <div>
            <Link to="/" className="block mb-5">
              <img
                src="/Logo.png"
                alt="CityQlo"
                className="h-9 object-contain brightness-0 invert"
              />
            </Link>
            <p
              className="max-w-xs text-[15px] leading-relaxed"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              Premium property advisory for Filipino professionals, investors, and OFWs.
            </p>
            <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5 max-w-xs">
              <img
                src="/dmci-homes-seeklogo.png"
                alt="DMCI Homes Accredited Partner"
                className="h-7.5 object-contain brightness-0 invert opacity-80"
              />
              <span className="text-[10px] font-mono tracking-widest uppercase text-white/50 leading-tight">
                Accredited<br />Partner
              </span>
            </div>
          </div>

          {/* Social icons — premium pill-style row */}
          <div className="flex flex-wrap gap-3">
            {socialPlatforms.map(({ key, name, Icon }) => {
              const url = socialSettings[key] || fallbackUrls[key];
              return (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={name}
                  className="group flex items-center gap-2 rounded-full border px-4 py-2 text-[12px] font-medium tracking-wide transition-all duration-300"
                  style={{
                    borderColor: "rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.65)",
                    background: "rgba(255,255,255,0.04)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.10)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.28)";
                    (e.currentTarget as HTMLElement).style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)";
                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.65)";
                  }}
                >
                  <Icon />
                  <span className="hidden sm:inline">{name}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom section: nav links + copyright */}
      <div className="px-6 py-12 md:px-16 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 md:grid-cols-4 md:gap-8 pb-14 border-b border-white/8">
            {/* Explore */}
            <div>
              <p
                className="mb-5 text-[10px] uppercase tracking-[0.18em]"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                Explore
              </p>
              <ul className="space-y-3.5">
                {[
                  { to: "/properties", label: "Properties" },
                  { to: "/why-invest", label: "Why Invest" },
                  { to: "/guides", label: "Guides" },
                ].map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="text-[14px] transition-colors duration-200"
                      style={{ color: "rgba(255,255,255,0.6)" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#fff")}
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)")
                      }
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <p
                className="mb-5 text-[10px] uppercase tracking-[0.18em]"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                Company
              </p>
              <ul className="space-y-3.5">
                {[
                  { to: "/about", label: "About" },
                  { to: "/contact", label: "Contact" },
                ].map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="text-[14px] transition-colors duration-200"
                      style={{ color: "rgba(255,255,255,0.6)" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#fff")}
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)")
                      }
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <p
                className="mb-5 text-[10px] uppercase tracking-[0.18em]"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                Contact
              </p>
              <ul className="space-y-3.5 text-[14px]" style={{ color: "rgba(255,255,255,0.6)" }}>
                <li>Metro Manila, Philippines</li>
                <li>
                  <a
                    href="mailto:hello@cityqlo.com"
                    className="transition-colors duration-200"
                    style={{ color: "rgba(255,255,255,0.6)" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#fff")}
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)")
                    }
                  >
                    hello@cityqlo.com
                  </a>
                </li>
              </ul>
            </div>

            {/* CTA */}
            <div>
              <p
                className="mb-5 text-[10px] uppercase tracking-[0.18em]"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                Get Started
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-[12px] font-semibold tracking-wide text-[#34393D] transition-all duration-300 hover:-translate-y-[1px] hover:shadow-lg"
                style={{ background: "#ffffff" }}
              >
                Book a Consultation
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>

          {/* Copyright bar */}
          <div
            className="flex flex-col gap-2 pt-8 text-[11px] tracking-[0.06em] md:flex-row md:justify-between"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            <p>© {new Date().getFullYear()} CityQlo. All rights reserved.</p>
            <p>Property advisory · Philippines</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
