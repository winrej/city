import React from "react";
import { Star, Check } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";

interface TestimonialItem {
  name: string;
  role: string;
  quote: string;
}

interface TestimonialsSectionProps {
  project: {
    name: string;
  };
  payload: {
    title?: string;
    headline?: string;
    headline_span?: string;
    description?: string;
    promises?: string[];
    testimonials: TestimonialItem[];
  };
}

export function TestimonialsSection({ project, payload }: TestimonialsSectionProps) {
  const testimonials = payload.testimonials || [];

  const promises = payload.promises || [
    "Accredited Property Consultant (DMCI Homes)",
    "Free Property Consultation — no obligation",
    "Official Developer Pricing — zero mark-ups",
    "No Additional or Hidden Fees",
    "End-to-End Buying Assistance",
    "Bank Loan & PAG-IBIG Guidance",
    "OFW Remote Purchase Support",
  ];

  return (
    <section className="px-4 py-20 md:py-28 bg-ink text-white overflow-hidden relative">
      <div
        aria-hidden
        className="absolute -right-48 top-0 w-[600px] h-[600px] rounded-full opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(closest-side, oklch(0.43 0.20 258), transparent)" }}
      />
      <div className="container mx-auto px-4 md:px-8 max-w-5xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Why CityQlo */}
          <div>
            <Reveal>
              <p className="eyebrow text-white/40">
                <span className="gold-rule" />
                {payload.title || "Our Promise"}
              </p>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="display-2 mt-5 text-white">
                {payload.headline || "Why work"}
                <br />
                <span className="text-primary">{payload.headline_span || "with us?"}</span>
              </h2>
            </Reveal>
            <Reveal delay={180}>
              <p className="text-white/60 mt-5 text-[15px] leading-relaxed max-w-md">
                {payload.description ||
                  "We're independent property consultants — not salespeople. Our job is to help you make the right decision, not just close a deal."}
              </p>
            </Reveal>

            <div className="mt-8 flex flex-col gap-3">
              {promises.map((item, i) => (
                <Reveal key={item + i} delay={200 + i * 60}>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/30 flex items-center justify-center flex-shrink-0">
                      <Check size={11} className="text-white" />
                    </div>
                    <p className="text-white/80 text-[14px] font-medium">{item}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div>
            <Reveal>
              <p className="eyebrow text-white/40 mb-6">
                <span className="gold-rule" />
                Client Stories
              </p>
            </Reveal>
            {testimonials.length > 0 && (
              <div className="flex flex-col gap-5">
                {testimonials.map((t, i) => (
                  <Reveal key={t.name + i} delay={120 + i * 100}>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                      <div className="flex mb-3">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} size={13} className="text-gold fill-gold" />
                        ))}
                      </div>
                      <p className="text-white/85 text-[14px] leading-relaxed italic">
                        "{t.quote}"
                      </p>
                      <div className="mt-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center">
                          <span className="text-white text-[11px] font-bold">{t.name[0]}</span>
                        </div>
                        <div>
                          <p className="text-white text-[13px] font-bold">{t.name}</p>
                          <p className="text-white/50 text-[11px]">{t.role}</p>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
