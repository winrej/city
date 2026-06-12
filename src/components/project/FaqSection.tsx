import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";

interface FaqItem {
  q: string;
  a: string;
}

interface FaqSectionProps {
  project: {
    name: string;
  };
  payload: {
    title?: string;
    headline?: string;
    headline_span?: string;
    faqs: FaqItem[];
  };
}

export function FaqSection({ project, payload }: FaqSectionProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const faqs = payload.faqs || [];

  return (
    <section className="px-4 py-20 md:py-28 surface">
      <div className="container mx-auto px-4 md:px-8 max-w-3xl">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <Reveal>
              <p className="eyebrow">
                <span className="gold-rule" />
                {payload.title || "Common Questions"}
              </p>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="display-2 mt-5">
                {payload.headline || "Frequently Asked"}
                <span className="text-primary"> {payload.headline_span || "Questions"}</span>
              </h2>
            </Reveal>
          </div>

          {faqs.length > 0 && (
            <div className="flex flex-col gap-3">
              {faqs.map((faq, i) => (
                <Reveal key={i} delay={i * 50}>
                  <div className="bg-white rounded-2xl border border-border/50 overflow-hidden shadow-soft">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer hover:bg-surface/50 transition-colors"
                      aria-expanded={openFaq === i}
                    >
                      <p className="font-bold text-[15px] text-ink leading-snug">{faq.q}</p>
                      <span className="flex-shrink-0 text-muted-foreground">
                        {openFaq === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </span>
                    </button>
                    {openFaq === i && (
                      <div className="px-6 pb-5 border-t border-border/30">
                        <p className="text-[14.5px] text-muted-foreground leading-relaxed mt-4">
                          {faq.a}
                        </p>
                      </div>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
