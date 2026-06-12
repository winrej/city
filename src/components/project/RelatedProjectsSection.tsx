import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";

interface RelatedProjectItem {
  id: string;
  name: string;
  developer: string;
  city: string;
  price: string;
  status: string;
  img: string;
  description: string;
}

interface RelatedProjectsSectionProps {
  payload: {
    title?: string;
    headline?: string;
    headline_span?: string;
    related_projects: RelatedProjectItem[];
  };
}

export function RelatedProjectsSection({ payload }: RelatedProjectsSectionProps) {
  const relatedProjects = payload.related_projects || [];

  return (
    <section className="px-4 py-20 md:py-24 surface">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <Reveal>
              <p className="eyebrow">
                <span className="gold-rule" />
                {payload.title || "Also Consider"}
              </p>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="display-2 mt-5">
                {payload.headline || "Similar"}
                <span className="text-primary"> {payload.headline_span || "Projects"}</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <Link to="/properties" className="link-quiet hover:border-ink flex-shrink-0">
              View all properties <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Reveal>
        </div>

        {relatedProjects.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProjects.map((rp, i) => (
              <Reveal key={rp.id + i} delay={i * 80}>
                <article className="group bg-white rounded-2xl border border-border/40 shadow-soft overflow-hidden hover:shadow-lift hover:-translate-y-1 transition-all duration-500">
                  <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                    {rp.img ? (
                      <img
                        src={rp.img}
                        alt={rp.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1500ms]"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground/60 text-xs">
                        Listing photo
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                        {rp.status}
                      </span>
                      <span className="font-extrabold text-[15px] text-ink">{rp.price}</span>
                    </div>
                    <h3 className="font-bold text-[16px] text-ink group-hover:text-primary transition-colors">
                      {rp.name}
                    </h3>
                    <p className="text-[12.5px] text-muted-foreground mt-1">{rp.city}</p>
                    <p className="text-[13px] text-muted-foreground mt-3 leading-relaxed line-clamp-2">
                      {rp.description}
                    </p>
                    <Link
                      to="/contact"
                      className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-border text-ink text-[12.5px] font-bold hover:border-primary hover:text-primary transition-all duration-300"
                    >
                      View Project <ChevronRight size={13} />
                    </Link>
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
