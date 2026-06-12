import React from "react";
import { MapPin } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { NearbyIcon, NEARBY_CATEGORY_COLOR } from "./IconRenderer";

interface NearbyPlace {
  name: string;
  time: string;
  category: "transit" | "mall" | "school" | "hospital" | "business" | "leisure";
}

interface LocationSectionProps {
  project: {
    full_address: string;
    nearby?: NearbyPlace[];
  };
  payload: {
    title?: string;
    headline?: string;
    headline_span?: string;
    description?: string;
    map_image_url?: string;
    google_maps_query?: string;
    nearby?: NearbyPlace[]; // optional override
  };
}

export function LocationSection({ project, payload }: LocationSectionProps) {
  const nearby = payload.nearby || project.nearby || [];

  const categories = ["transit", "mall", "school", "hospital", "business"] as const;
  const labels: Record<(typeof categories)[number], string> = {
    transit: "Transit",
    mall: "Shopping & Dining",
    school: "Schools",
    hospital: "Hospitals",
    business: "Business Hubs",
  };

  return (
    <section className="px-4 py-20 md:py-28 surface">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <Reveal>
              <p className="eyebrow">
                <span className="gold-rule" />
                {payload.title || "Location Advantage"}
              </p>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="display-2 mt-5">
                {payload.headline || "Near Everything"}
                <span className="block text-primary">
                  {payload.headline_span || "That Matters"}
                </span>
              </h2>
            </Reveal>
            {payload.description && (
              <Reveal delay={180}>
                <p className="lede mt-5 text-[15px]">{payload.description}</p>
              </Reveal>
            )}

            {/* Map representation */}
            <Reveal delay={260}>
              <div className="mt-8 rounded-2xl overflow-hidden border border-border shadow-soft aspect-[4/3] bg-surface flex items-center justify-center relative">
                {payload.map_image_url ? (
                  <img
                    src={payload.map_image_url}
                    alt="Location map"
                    className="w-full h-full object-cover opacity-70"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center opacity-75" />
                )}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-ink/30 backdrop-blur-sm gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lift">
                    <MapPin size={22} className="text-primary" />
                  </div>
                  <p className="text-white font-bold text-[14px]">{project.full_address}</p>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(payload.google_maps_query || project.full_address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 text-[12px] underline underline-offset-4 hover:text-white transition-colors"
                  >
                    Open in Google Maps →
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Nearby list */}
          <div>
            {categories.map((cat) => {
              const places = nearby.filter((n) => n.category === cat);
              if (!places.length) return null;

              return (
                <Reveal key={cat}>
                  <div className="mb-6">
                    <p className="text-[10.5px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
                      {labels[cat]}
                    </p>
                    <div className="flex flex-col gap-2">
                      {places.map((place, idx) => (
                        <div
                          key={place.name + idx}
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
  );
}
