import React from "react";
import { Users, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";

interface UnitDecisionItem {
  name: string;
  area_sqm: number;
  starting_price: number;
  profile_target: string;
}

interface DecisionGuideSectionProps {
  project: {
    units?: UnitDecisionItem[];
  };
  payload: {
    title?: string;
    headline?: string;
    headline_span?: string;
    sub_title?: string;
    cta_text?: string;
    units?: UnitDecisionItem[]; // optional override
  };
  scrollToForm: () => void;
}

export function DecisionGuideSection({
  project,
  payload,
  scrollToForm,
}: DecisionGuideSectionProps) {
  const list = payload.units || project.units || [];

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `₱${(price / 1000000).toFixed(1)}M`;
    }
    return `₱${price.toLocaleString()}`;
  };

  return (
    <section className="px-4 py-20 md:py-24 surface">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Reveal>
            <p className="eyebrow">
              <span className="gold-rule" />
              {payload.title || "Decision Guide"}
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="display-2 mt-5">
              {payload.headline || "Which unit is"}
              <span className="text-primary"> {payload.headline_span || "right for you?"}</span>
            </h2>
          </Reveal>
        </div>

        {list.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {list.map((unit, i) => (
              <Reveal key={unit.name + i} delay={i * 80}>
                <div className="bg-white rounded-2xl p-6 border border-border/40 shadow-soft text-center hover:border-primary/30 hover:shadow-lift transition-all duration-400 cursor-default">
                  <div className="w-12 h-12 rounded-2xl bg-primary/8 flex items-center justify-center mx-auto mb-5">
                    <Users size={20} className="text-primary" />
                  </div>
                  <p className="font-extrabold text-ink text-[15px]">{unit.name}</p>
                  <p className="font-mono text-[11.5px] text-muted-foreground mt-1">
                    {unit.area_sqm} sq.m.
                  </p>
                  <div className="w-10 h-px bg-gold mx-auto my-4" />
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    {unit.profile_target || "Single Professionals & Investors"}
                  </p>
                  <p className="font-extrabold text-primary text-[14px] mt-3">
                    {formatPrice(unit.starting_price)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        <Reveal delay={200}>
          <div className="mt-10 text-center">
            <p className="text-[14px] text-muted-foreground mb-4">
              {payload.sub_title || "Not sure which unit fits your budget and goals?"}
            </p>
            <button
              onClick={scrollToForm}
              className="inline-flex items-center gap-2 bg-ink text-white px-7 py-3.5 rounded-full text-[13px] font-bold tracking-wide hover:-translate-y-0.5 hover:shadow-lift transition-all duration-500 cursor-pointer"
            >
              {payload.cta_text || "Get a Free Personalized Computation"} <ArrowRight size={15} />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
