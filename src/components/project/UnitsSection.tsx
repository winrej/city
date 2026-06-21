import React from "react";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";

interface UnitItem {
  name: string;
  area_sqm: number;
  starting_price: number;
  description?: string;
  image_url?: string;
}

interface UnitsSectionProps {
  project: {
    units?: UnitItem[];
  };
  payload: {
    title?: string;
    headline?: string;
    units?: UnitItem[]; // optional override
  };
  scrollToForm: () => void;
}

export function UnitsSection({ project, payload, scrollToForm }: UnitsSectionProps) {
  const list = payload.units || project.units || [];

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `₱${(price / 1000000).toFixed(1)}M`;
    }
    return `₱${price.toLocaleString()}`;
  };

  return (
    <section className="px-4 py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Reveal>
            <p className="eyebrow">
              <span className="gold-rule" />
              {payload.title || "Unit Configurations"}
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="display-2 mt-5">{payload.headline || "Choose Your Space"}</h2>
          </Reveal>
        </div>

        {list.length > 0 && (
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {list.map((unit, i) => (
              <Reveal key={unit.name + i} delay={i * 80}>
                <article className="group bg-white rounded-2xl border border-border/40 shadow-soft overflow-hidden hover:shadow-lift hover:-translate-y-1 transition-all duration-500">
                  <div className="aspect-[4/3] overflow-hidden relative bg-slate-100">
                    {unit.image_url ? (
                      <img
                        src={unit.image_url}
                        alt={`${unit.name} unit`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1500ms]"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground/60 text-xs">
                        Floor plan drawing
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <span className="absolute bottom-3 left-3 text-white font-extrabold text-[17px]">
                      {unit.name}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-[12px] text-muted-foreground font-medium">
                        {unit.area_sqm} sq.m.
                      </span>
                      <span className="font-extrabold text-[15px] text-ink">
                        {formatPrice(unit.starting_price)}
                      </span>
                    </div>
                    {unit.description && (
                      <p className="text-[13px] text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                        {unit.description}
                      </p>
                    )}
                    <button
                      onClick={scrollToForm}
                      className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl border-2 border-primary/20 text-primary text-[12.5px] font-bold hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 cursor-pointer"
                    >
                      Get Details <ArrowRight size={13} />
                    </button>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
