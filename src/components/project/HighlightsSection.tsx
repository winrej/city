import React from "react";
import { Reveal } from "@/components/site/Reveal";
import { IconRenderer } from "./IconRenderer";

interface HighlightItem {
  icon: string;
  title: string;
  description: string;
}

interface HighlightsSectionProps {
  project: {
    name: string;
  };
  payload: {
    title?: string;
    headline?: string;
    highlights: HighlightItem[];
  };
}

export function HighlightsSection({ project, payload }: HighlightsSectionProps) {
  const highlights = payload.highlights || [];

  return (
    <section className="px-4 py-20 md:py-28 surface">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Reveal>
            <p className="eyebrow">
              <span className="gold-rule" />
              {payload.title || `Why ${project.name}`}
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="display-2 mt-5">{payload.headline || "Key Highlights"}</h2>
          </Reveal>
        </div>

        {highlights.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {highlights.map((h, i) => (
              <Reveal key={h.title + i} delay={i * 70}>
                <div className="bg-white rounded-2xl p-6 border border-border/40 shadow-soft hover:shadow-lift hover:-translate-y-1 transition-all duration-500 group">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors">
                    <IconRenderer name={h.icon} size={20} className="text-primary" />
                  </div>
                  <h3 className="text-[16px] font-bold text-ink mb-2">{h.title}</h3>
                  <p className="text-[13.5px] text-muted-foreground leading-relaxed">
                    {h.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
