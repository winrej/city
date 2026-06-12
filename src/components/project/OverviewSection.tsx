import React from "react";
import { Reveal } from "@/components/site/Reveal";

interface OverviewSectionProps {
  project: {
    name: string;
    description: string;
    developer: string;
    full_address: string;
    category: string;
    architectural_theme?: string;
    land_area?: string;
    floors?: string;
    total_units?: string;
    turnover?: string;
  };
  payload: {
    title?: string;
    headline_span?: string;
  };
}

export function OverviewSection({ project, payload }: OverviewSectionProps) {
  const details = [
    { label: "Developer", value: project.developer },
    { label: "Location", value: project.full_address },
    { label: "Property Type", value: project.category },
    {
      label: "Architectural Theme",
      value: project.architectural_theme || "Modern Resort Tropical",
    },
    { label: "Land Area", value: project.land_area || "1.8 Hectares" },
    { label: "Building Height", value: project.floors || "5-7 Floors (Low-Rise Cluster)" },
    { label: "Total Units", value: project.total_units || "1,152 Units" },
    { label: "Projected Turnover", value: project.turnover || "2027–2028" },
  ];

  return (
    <section className="px-4 py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        <div className="grid lg:grid-cols-12 gap-14 items-start">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow">
                <span className="gold-rule" />
                {payload.title || "Project Overview"}
              </p>
            </Reveal>
            <Reveal delay={120}>
              <h2 className="display-2 mt-5">
                About
                <br />
                <span className="text-primary">{payload.headline_span || project.name}</span>
              </h2>
            </Reveal>
            <Reveal delay={200}>
              <p className="lede mt-8 text-[16px] leading-[1.75]">{project.description}</p>
            </Reveal>
          </div>

          <div className="lg:col-span-7 lg:pl-10">
            <Reveal delay={160}>
              <div className="grid sm:grid-cols-2 gap-4">
                {details.map(({ label, value }) => (
                  <div key={label} className="bg-surface rounded-2xl p-5 border border-border/40">
                    <p className="text-[10.5px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                      {label}
                    </p>
                    <p className="text-[14px] font-semibold text-ink leading-snug">{value}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
