import React, { useState, useEffect, useRef } from "react";
import { FileText, Zap } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";

interface HeroSectionProps {
  project: {
    name: string;
    developer: string;
    city: string;
    category?: string;
    floors?: string;
    turnover?: string;
  };
  payload: {
    tagline: string;
    hero_images: string[];
    cta_primary_text?: string;
    cta_secondary_text?: string;
  };
  scrollToForm: () => void;
}

export function HeroSection({ project, payload, scrollToForm }: HeroSectionProps) {
  const [heroSlide, setHeroSlide] = useState(0);
  const heroTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const images = payload.hero_images || [];

  useEffect(() => {
    if (images.length <= 1) return;
    heroTimerRef.current = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => {
      if (heroTimerRef.current) clearInterval(heroTimerRef.current);
    };
  }, [images.length]);

  return (
    <section className="relative h-[90vh] min-h-[580px] w-full overflow-hidden bg-ink">
      {/* Slide images */}
      {images.map((img, i) => (
        <div
          key={img + i}
          className="absolute inset-0 transition-opacity duration-[1200ms] ease-in-out"
          style={{ opacity: i === heroSlide ? 1 : 0 }}
        >
          <img
            src={img}
            alt={`${project.name} - view ${i + 1}`}
            className="h-full w-full object-cover"
            loading={i === 0 ? "eager" : "lazy"}
          />
        </div>
      ))}

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Status badge */}
      <div className="absolute top-28 left-0 right-0 z-10">
        <div className="container mx-auto px-4 md:px-8">
          <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 text-white text-[10.5px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Active
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full items-end pb-20 md:pb-28">
        <div className="container mx-auto px-4 md:px-8 w-full">
          <div className="max-w-3xl">
            <p className="eyebrow rise text-white/50">
              <span className="gold-rule" />
              {project.developer} · {project.city}
            </p>
            <h1 className="display-1 rise rise-delay-1 mt-4 text-white leading-[1.02] text-shadow-hero-lg">
              {project.name}
            </h1>
            <p className="rise rise-delay-2 mt-3 text-white/80 text-[17px] font-medium leading-snug">
              {payload.tagline}
            </p>

            {/* Quick facts */}
            <div className="rise rise-delay-3 mt-6 flex flex-wrap gap-3">
              {[
                project.category,
                project.floors,
                project.turnover ? `Turnover ${project.turnover}` : "",
              ]
                .filter(Boolean)
                .map((fact) => (
                  <span
                    key={fact}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 text-white/85 text-[11px] font-semibold px-3.5 py-1.5 rounded-full"
                  >
                    {fact}
                  </span>
                ))}
            </div>

            {/* CTAs */}
            <div className="rise rise-delay-4 mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={scrollToForm}
                className="inline-flex items-center justify-center gap-2 bg-white text-ink px-7 py-3.5 rounded-full text-[13px] font-bold tracking-wide hover:-translate-y-0.5 hover:shadow-lift transition-all duration-500 cursor-pointer"
                style={{ transitionTimingFunction: "var(--ease-luxe)" }}
              >
                <FileText size={15} /> {payload.cta_primary_text || "Request Price List"}
              </button>
              <button
                onClick={scrollToForm}
                className="inline-flex items-center justify-center gap-2 border-2 border-white/50 text-white px-7 py-3.5 rounded-full text-[13px] font-bold tracking-wide hover:border-white hover:bg-white/10 transition-all duration-500 cursor-pointer"
              >
                <Zap size={15} /> {payload.cta_secondary_text || "Free Computation"}
              </button>
            </div>
          </div>

          {/* Slide dots */}
          {images.length > 1 && (
            <div className="absolute bottom-8 right-6 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setHeroSlide(i)}
                  className="cursor-pointer transition-all duration-400"
                  style={{
                    width: i === heroSlide ? "28px" : "8px",
                    height: "8px",
                    borderRadius: "999px",
                    background: i === heroSlide ? "white" : "rgba(255,255,255,0.4)",
                  }}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
