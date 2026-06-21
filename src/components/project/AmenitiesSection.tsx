import React from "react";
import { Reveal } from "@/components/site/Reveal";
import { IconRenderer } from "./IconRenderer";

interface AmenityItem {
  name: string;
  description: string;
  icon: string;
  category: "wellness" | "recreation" | "social" | "utility";
}

interface AmenitiesSectionProps {
  project: {
    name: string;
    amenities?: AmenityItem[];
  };
  payload: {
    title?: string;
    headline?: string;
    headline_span?: string;
    description?: string;
    amenities?: AmenityItem[]; // optional override
  };
}

export function AmenitiesSection({ project, payload }: AmenitiesSectionProps) {
  const list = payload.amenities || project.amenities || [];

  const categories = ["wellness", "recreation", "social", "utility"] as const;
  const labels: Record<(typeof categories)[number], string> = {
    wellness: "🌿 Wellness",
    recreation: "🌊 Recreation",
    social: "🤝 Social",
    utility: "🏢 Building",
  };

  return (
    <section className="px-4 py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Reveal>
            <p className="eyebrow">
              <span className="gold-rule" />
              {payload.title || "Community"}
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="display-2 mt-5">
              {payload.headline || "Lifestyle & Community"}
              <span className="block text-primary">{payload.headline_span || "Features"}</span>
            </h2>
          </Reveal>
          {payload.description && (
            <Reveal delay={180}>
              <p className="lede mt-4 text-[15px]">{payload.description}</p>
            </Reveal>
          )}
        </div>

        {/* Category loops */}
        {categories.map((cat) => {
          const catAmenities = list.filter((a) => a.category === cat);
          if (!catAmenities.length) return null;

          return (
            <div key={cat} className="mb-12">
              <Reveal>
                <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-5">
                  {labels[cat]}
                </p>
              </Reveal>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {catAmenities.map((a, i) => (
                  <Reveal key={a.name + i} delay={i * 60}>
                    <div className="bg-surface rounded-2xl p-5 border border-border/40 hover:border-primary/20 hover:shadow-soft transition-all duration-400">
                      <div className="w-9 h-9 rounded-xl bg-ink/5 flex items-center justify-center mb-3">
                        <IconRenderer name={a.icon} size={17} className="text-ink/60" />
                      </div>
                      <p className="font-bold text-[14px] text-ink">{a.name}</p>
                      <p className="text-[12.5px] text-muted-foreground mt-1 leading-relaxed">
                        {a.description}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
