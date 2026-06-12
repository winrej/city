import React from "react";
import { Check } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";

interface EmotionalHookSectionProps {
  project: {
    name: string;
  };
  payload: {
    eyebrow?: string;
    headline: string;
    sub: string;
    points: string[];
  };
}

export function EmotionalHookSection({ project, payload }: EmotionalHookSectionProps) {
  return (
    <section className="bg-ink text-white px-4 py-20 md:py-28 overflow-hidden relative">
      {/* Decorative radial gradients */}
      <div
        aria-hidden
        className="absolute -right-48 top-0 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(closest-side, oklch(0.43 0.20 258), transparent)" }}
      />
      <div
        aria-hidden
        className="absolute -left-24 bottom-0 w-[400px] h-[400px] rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(closest-side, oklch(0.74 0.137 79), transparent)" }}
      />

      <div className="container mx-auto px-4 md:px-8 max-w-4xl relative z-10">
        <div className="max-w-4xl">
          <Reveal>
            <p className="eyebrow text-white/40">
              <span className="gold-rule" />
              {payload.eyebrow || `The ${project.name} Lifestyle`}
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="display-2 mt-6 text-white leading-[1.05]">
              {payload.headline}
              <span className="block text-primary mt-1">{payload.sub}</span>
            </h2>
          </Reveal>
        </div>

        <div className="mt-14 grid md:grid-cols-2 gap-4 max-w-3xl">
          {(payload.points || []).map((point, i) => (
            <Reveal key={point} delay={180 + i * 80}>
              <div className="flex items-start gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-5 py-4">
                <div className="w-5 h-5 rounded-full bg-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check size={11} className="text-white" />
                </div>
                <p className="text-white/80 text-[14.5px] font-medium leading-snug">{point}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
