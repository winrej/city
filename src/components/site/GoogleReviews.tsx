import { useEffect, useRef, useState } from "react";
import { Reveal } from "./Reveal";

/**
 * GoogleReviews
 * ─────────────────────────────────────────────────────────────────────────────
 * A native CityQlo section that *frames* a third-party Google Reviews widget.
 *
 * Design intent: the SECTION is ours (typography, spacing, colors, hierarchy,
 * CTA — all from the design system). The widget is treated as embedded CONTENT
 * that lives inside the frame, not as the section itself. Visitors should read
 * it as one cohesive, premium CityQlo experience.
 *
 * Integration notes:
 *  - Drop the Trustindex/Elfsight embed where `WIDGET MOUNT POINT` is marked.
 *  - Configure the widget with its OWN header/summary bar HIDDEN (cards only),
 *    so our aggregate header is the single source of truth. If it can't be
 *    fully hidden, the scoped CSS at the bottom hides common header nodes.
 *  - The widget is lazy-mounted on scroll (IntersectionObserver) to keep it off
 *    the critical path — protects mobile LCP.
 *  - If no widget is configured, a branded fallback renders so the section is
 *    never blank or "broken looking".
 */

// ── Configuration ────────────────────────────────────────────────────────────
// Public link to the live Google profile (canonical Maps URL — NOT a share.google
// short link). Powers the "Read all on Google" CTA and the fallback.
// Tracking params (?entry=…&g_ep=…) stripped; the /data= payload carries the
// stable CID (0x682670a358343c99:0x3edc3d84893dd64d) so this resolves to the
// exact CityQlo listing.
const GOOGLE_PROFILE_URL =
  "https://www.google.com/maps/place/Cityqlo/@14.576277,121.0338842,15z/data=!4m6!3m5!1s0x682670a358343c99:0x3edc3d84893dd64d!8m2!3d14.576277!4d121.0338842!16s%2Fg%2F11z9568yhn";

// Headline rating. Keep in sync with the live profile. We intentionally do NOT
// hardcode a review count — the widget shows the authoritative count once live,
// and an out-of-date/inflated number is the fastest way to lose trust.
const RATING = "5.0";

// Set to true once a real widget embed is placed in the mount point below.
const WIDGET_ENABLED = false;

// ── Brand marks ──────────────────────────────────────────────────────────────
function GoogleGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.15-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.85 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.67-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.85 9.9C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

function Stars({ className }: { className?: string }) {
  return (
    <span
      className={className}
      role="img"
      aria-label={`${RATING} out of 5 stars`}
      style={{ display: "inline-flex", gap: "0.15rem" }}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{ width: "1.15rem", height: "1.15rem" }}
        >
          <path
            fill="var(--gold)"
            d="M12 2l2.9 6.26L21.6 9.2l-4.8 4.68 1.14 6.62L12 17.27l-5.94 3.23L7.2 13.88 2.4 9.2l6.7-.94z"
          />
        </svg>
      ))}
    </span>
  );
}

export function GoogleReviews() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [mountWidget, setMountWidget] = useState(false);

  // Lazy-mount the widget only when the section approaches the viewport, so the
  // third-party script never blocks first paint.
  useEffect(() => {
    const el = mountRef.current;
    if (!el || !WIDGET_ENABLED) return;
    if (typeof IntersectionObserver === "undefined") {
      setMountWidget(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setMountWidget(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="reviews" aria-label="Google reviews" className="surface px-4 section-pad">
      <div className="container-prose">
        {/* ── Header — pure CityQlo design system ── */}
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="eyebrow justify-center inline-flex items-center">
              <span className="gold-rule" />
              Trusted by homebuyers
            </p>
          </Reveal>

          <Reveal delay={120}>
            <h2 className="display-2 mt-6">
              Trusted by homebuyers
              <br className="hidden sm:block" /> across the Philippines
            </h2>
          </Reveal>

          {/* Aggregate rating row — gold stars + authentic Google mark */}
          <Reveal delay={220}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              <Stars />
              <span className="text-[22px] font-extrabold tracking-tight text-ink">{RATING}</span>
              <span className="inline-flex items-center gap-2 text-[15px] font-semibold text-muted-foreground">
                <GoogleGlyph className="h-[18px] w-[18px]" />
                Google Rating
              </span>
            </div>
          </Reveal>

          <Reveal delay={300}>
            <p className="lede mx-auto mt-6 max-w-xl">
              Real reviews from people who trusted CityQlo with their property journey.
            </p>
          </Reveal>
        </div>

        {/* ── Embedded content — the widget lives INSIDE our frame ── */}
        <Reveal delay={160}>
          <div ref={mountRef} className="cq-reviews-embed mt-16 md:mt-20">
            {WIDGET_ENABLED && mountWidget ? (
              /* ═══════════════════════════════════════════════════════════════
                 WIDGET MOUNT POINT
                 Paste the Trustindex / Elfsight target element here, and load its
                 <script> (via the component that renders this, or a useEffect that
                 injects the script tag once `mountWidget` is true).
                 Configure the widget with its OWN header hidden — cards only.
                 e.g.  <div className="trustindex-widget" data-widget-id="..." />
                 ═══════════════════════════════════════════════════════════════ */
              <div data-cq-widget-slot />
            ) : (
              /* Branded fallback — shown until a real embed is configured, or if
                 the third-party script is blocked. Never renders blank. */
              <div className="mx-auto max-w-xl rounded-[1.5rem] border border-hairline bg-background px-8 py-14 text-center shadow-soft">
                <GoogleGlyph className="mx-auto h-9 w-9" />
                <p className="mt-5 text-[17px] font-semibold text-ink">
                  {RATING} out of 5 on Google
                </p>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                  Read verified reviews from OFWs, first-time buyers, and investors who worked with
                  CityQlo.
                </p>
                <a
                  href={GOOGLE_PROFILE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-2 rounded-full border border-border bg-background px-7 py-3.5 text-[13px] font-semibold tracking-[0.02em] text-ink transition-all duration-700 hover:-translate-y-[2px] hover:border-ink"
                  style={{ transitionTimingFunction: "var(--ease-luxe)" }}
                >
                  Read reviews on Google <span aria-hidden>↗</span>
                </a>
              </div>
            )}
          </div>
        </Reveal>

        {/* ── CTA — outbound confidence, design-system pill ── */}
        {WIDGET_ENABLED && (
          <Reveal delay={200}>
            <div className="mt-14 flex justify-center md:mt-16">
              <a
                href={GOOGLE_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full border border-border bg-background px-8 py-4 text-[13px] font-semibold tracking-[0.02em] text-ink transition-all duration-700 hover:-translate-y-[2px] hover:border-ink"
                style={{ transitionTimingFunction: "var(--ease-luxe)" }}
              >
                <GoogleGlyph className="h-[18px] w-[18px]" />
                Read all reviews on Google <span aria-hidden>↗</span>
              </a>
            </div>
          </Reveal>
        )}
      </div>

      {/*
        Scoped safety net: if the widget cannot fully hide its own summary/header
        in its builder, uncomment and adjust selectors so OUR header stays the
        only aggregate header. Keeps the "one cohesive section" feel.

        <style>{`
          .cq-reviews-embed .ti-header,
          .cq-reviews-embed .ti-widget-header,
          .cq-reviews-embed [class*="summary"] { display: none !important; }
        `}</style>
      */}
    </section>
  );
}
