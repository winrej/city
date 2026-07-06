import { useState } from "react";
import { Play, Maximize2 } from "lucide-react";

import { Reveal } from "@/components/site/Reveal";
// TODO: swap for a real Sonora still (amenity/pool or model-unit) when available.
import tourPoster from "@/assets/amenity-pool.jpg";

export type Tour = {
  id: string;
  label: string;
  blurb: string;
  url: string;
};

/**
 * Official DMCI Homes 360° tours (viewin360.co) for Sonora Garden Residences.
 * `fbclid` tracking params stripped; `initload` set to 1 because loading is
 * gated behind our own click-to-load poster (see below), so nothing on the
 * viewin360 side fetches until the user opts in.
 *
 * Keyed by project slug so the project page can look these up regardless of
 * whether its content came from the DB read model or the hardcoded fallback.
 */
export const SONORA_TOURS: Tour[] = [
  {
    id: "property",
    label: "Property Tour",
    blurb: "Walk the grounds, amenities, and towers.",
    url: "https://dmcihomes.viewin360.co/share/collection/7bGzp?logo=bWVkaWEvMTUwOTU1LzY3YTAtOGQxOC1lMGQ0LTEyMTEucG5n&info=0&logosize=200&fs=1&vr=1&sd=1&gyro=0&initload=1&thumbs=1",
  },
  {
    id: "1br",
    label: "1BR Bare",
    blurb: "Bare 1-bedroom unit in actual turnover condition.",
    url: "https://dmcihomes.viewin360.co/share/collection/7Z1z8?logo=bWVkaWEvMTUwOTU1LzYyOGQtYjdiNC1kZjhmLTA3NDkucG5n&info=0&logosize=200&fs=1&vr=1&sd=1&gyro=0&initload=1&thumbs=1",
  },
  {
    id: "2br",
    label: "2BR Bare",
    blurb: "Bare 2-bedroom unit in actual turnover condition.",
    url: "https://dmcihomes.viewin360.co/share/collection/7Z1zL?logo=bWVkaWEvMTUwOTU1LzYyOGQtYjdiNC1kZjhmLTA3NDkucG5n&info=0&logosize=200&fs=1&vr=1&sd=1&gyro=0&initload=1&thumbs=1",
  },
  {
    id: "3br",
    label: "3BR Bare",
    blurb: "Bare 3-bedroom unit in actual turnover condition.",
    url: "https://dmcihomes.viewin360.co/share/collection/7ZKRJ?logo=bWVkaWEvMTUwOTU1LzYyOGQtYjdiNC1kZjhmLTA3NDkucG5n&info=0&logosize=200&fs=1&vr=1&sd=1&gyro=0&initload=1&thumbs=1",
  },
  {
    id: "3br-model",
    label: "3BR Model Unit",
    blurb: "Fully furnished 3-bedroom show unit.",
    url: "https://dmcihomes.viewin360.co/share/collection/7ZK33?logo=bWVkaWEvMTUwOTU1LzYyOGQtYjdiNC1kZjhmLTA3NDkucG5n&info=0&logosize=200&fs=1&vr=1&sd=1&gyro=0&initload=1&thumbs=1",
  },
];

/** Slug → tour set. Add future projects' tours here. */
export const PROJECT_TOURS: Record<string, Tour[]> = {
  "sonora-garden-residences": SONORA_TOURS,
};

/**
 * Reusable click-to-load 360° tour viewer with a tab selector.
 * Renders nothing (returns null) if given no tours, so callers can drop it in
 * unconditionally. `poster` lets each host page pass its own still image.
 */
export function TourViewer({ tours, poster }: { tours: Tour[]; poster: string }) {
  const [active, setActive] = useState(0);
  const [loaded, setLoaded] = useState(false);
  // Tracks when the external 360° embed has finished loading so we can show a
  // spinner in the meantime — the viewin360 host can take a couple of seconds,
  // and a blank frame reads as "broken/slow".
  const [iframeReady, setIframeReady] = useState(false);
  if (tours.length === 0) return null;
  const tour = tours[active];

  // Warm up the DNS/TLS connection to the tour host as soon as this viewer is
  // on screen, so the embed loads noticeably faster once the user taps play.
  // React 19 hoists these <link> tags into <head>.
  let tourOrigin: string | null = null;
  try {
    tourOrigin = new URL(tours[0].url).origin;
  } catch {
    tourOrigin = null;
  }

  return (
    <div>
      {tourOrigin && (
        <>
          <link rel="preconnect" href={tourOrigin} crossOrigin="anonymous" />
          <link rel="dns-prefetch" href={tourOrigin} />
        </>
      )}
      <div className="mb-6 flex flex-wrap gap-2">
        {tours.map((t, i) => (
          <button
            key={t.id}
            onClick={() => {
              setActive(i);
              setLoaded(true);
              setIframeReady(false);
            }}
            aria-pressed={i === active}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors ${
              i === active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-hairline text-muted-foreground hover:border-ink/30 hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-hairline bg-ink/5">
        <div className="relative aspect-video w-full">
          {loaded ? (
            <>
              <iframe
                key={tour.url}
                src={tour.url}
                title={`Sonora Garden Residences — ${tour.label} 360° tour`}
                onLoad={() => setIframeReady(true)}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; gyroscope; fullscreen; xr-spatial-tracking"
                allowFullScreen
              />
              {!iframeReady && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink/5">
                  <span className="h-8 w-8 animate-spin rounded-full border-2 border-ink/15 border-t-ink" />
                  <span className="text-[12px] font-medium text-muted-foreground">
                    Loading 360° tour…
                  </span>
                </div>
              )}
            </>
          ) : (
            <button
              onClick={() => setLoaded(true)}
              aria-label={`Play the ${tour.label} 360° virtual tour`}
              className="group absolute inset-0 h-full w-full"
            >
              <img
                src={poster}
                alt="Sonora Garden Residences preview"
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <span className="absolute inset-0 bg-ink/40 transition-colors group-hover:bg-ink/30" />
              <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-ink shadow-lg transition-transform duration-500 group-hover:scale-105">
                  <Play size={26} className="ml-1" fill="currentColor" />
                </span>
                <span className="text-[13px] font-semibold tracking-wide">Explore in 360°</span>
              </span>
            </button>
          )}
        </div>
        <div className="flex items-center justify-between gap-4 px-5 py-3 text-[13px]">
          <p className="text-muted-foreground">{tour.blurb}</p>
          <a
            href={tour.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 font-semibold text-primary hover:underline"
          >
            <Maximize2 size={14} /> Open full screen
          </a>
        </div>
      </div>
    </div>
  );
}

export function VirtualTourSection() {
  return (
    <section id="tour" className="scroll-mt-28">
      <Reveal>
        <p className="eyebrow mb-3">
          <span className="gold-rule" />
          Virtual tour
        </p>
        <h2 className="display-3 mb-6 text-ink">Explore Sonora in immersive 360°</h2>
        <div className="space-y-4 text-[16px] leading-relaxed text-muted-foreground [&_strong]:text-ink">
          <p>
            Walk the actual property and step inside every unit type without leaving your seat —
            drag to look around and use the hotspots to move between rooms. A fully furnished{" "}
            <strong>3-bedroom model unit</strong> is included so you can picture the finished
            space, alongside bare units in real turnover condition.
          </p>
        </div>
      </Reveal>

      {/* Tour viewer */}
      <Reveal delay={120}>
        <div className="mt-8">
          <TourViewer tours={SONORA_TOURS} poster={tourPoster} />
        </div>
      </Reveal>

      <p className="mt-3 text-[12px] italic text-muted-foreground">
        360° tours hosted by DMCI Homes. Bare-unit tours show actual turnover condition; the model
        unit is styled for illustration.
      </p>
    </section>
  );
}
