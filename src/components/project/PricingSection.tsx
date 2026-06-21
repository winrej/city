import React from "react";
import { FileText, Clock, Star } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";

interface PricingSectionProps {
  project: {
    turnover?: string;
    units?: Array<{
      name: string;
      area_sqm: number;
      starting_price: number;
      description?: string;
    }>;
  };
  payload: {
    title?: string;
    sub_title?: string;
    description?: string;
    show_urgency?: boolean;
    urgency_text_1?: string;
    urgency_text_2?: string;
  };
  scrollToForm: () => void;
}

export function PricingSection({ project, payload, scrollToForm }: PricingSectionProps) {
  const formatPrice = (price: number) => {
    // Starting price is numeric, e.g. 4500000 -> ₱4.5M
    if (price >= 1000000) {
      return `₱${(price / 1000000).toFixed(1)}M`;
    }
    return `₱${price.toLocaleString()}`;
  };

  const units = project.units || [];

  return (
    <section className="px-4 py-20 md:py-28 surface">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Pricing */}
          <div>
            <Reveal>
              <p className="eyebrow">
                <span className="gold-rule" />
                {payload.title || "Pricing"}
              </p>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="display-2 mt-5">
                Own a unit
                <span className="block text-primary">{payload.sub_title || "for as low as"}</span>
              </h2>
            </Reveal>
            <Reveal delay={180}>
              <p className="text-[15px] text-muted-foreground mt-4 max-w-md leading-relaxed">
                {payload.description ||
                  "Pre-selling prices are currently at their lowest. Every quarter brings a price increase as construction progresses."}
              </p>
            </Reveal>

            {/* Pricing table */}
            {units.length > 0 && (
              <Reveal delay={260}>
                <div className="mt-8 bg-white rounded-2xl shadow-soft border border-border/50 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-ink text-white">
                        <th className="text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-widest">
                          Unit Type
                        </th>
                        <th className="text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-widest">
                          Floor Area
                        </th>
                        <th className="text-right px-5 py-3.5 text-[11px] font-bold uppercase tracking-widest">
                          Starting Price
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {units.map((unit, i) => (
                        <tr
                          key={unit.name + i}
                          className={`border-t border-border/50 ${i % 2 === 0 ? "bg-white" : "bg-surface/60"} hover:bg-primary/5 transition-colors`}
                        >
                          <td className="px-5 py-3.5 font-bold text-[14px] text-ink">
                            {unit.name}
                          </td>
                          <td className="px-5 py-3.5 text-[13px] text-muted-foreground font-mono">
                            {unit.area_sqm} sq.m.
                          </td>
                          <td className="px-5 py-3.5 text-right font-extrabold text-[15px] text-ink">
                            {formatPrice(unit.starting_price)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="px-5 py-3 bg-primary/5 border-t border-border/50">
                    <button
                      onClick={scrollToForm}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white font-bold rounded-xl text-[13.5px] hover:bg-primary/90 transition-colors cursor-pointer"
                    >
                      <FileText size={15} />
                      Get Full Price List & Payment Terms
                    </button>
                  </div>
                </div>
              </Reveal>
            )}
          </div>

          {/* Right: Scarcity + Urgency */}
          <Reveal delay={200}>
            <div className="flex flex-col gap-5">
              {/* Status card */}
              <div className="bg-white rounded-2xl border border-border shadow-soft p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  <p className="font-bold text-ink text-[14px]">Currently Available</p>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Project Phase", value: "Pre-Selling", color: "text-primary" },
                    {
                      label: "Turnover",
                      value: project.turnover || "2027–2028",
                      color: "text-ink",
                    },
                    {
                      label: "Payment Schemes",
                      value: "Bank · In-house · PAG-IBIG",
                      color: "text-ink",
                    },
                  ].map(({ label, value, color }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between py-2 border-b border-border/40 last:border-0"
                    >
                      <span className="text-[12.5px] text-muted-foreground font-medium">
                        {label}
                      </span>
                      <span className={`text-[13px] font-bold ${color}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Urgency signals */}
              {payload.show_urgency !== false && (
                <>
                  <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <Clock size={16} className="text-amber-600" />
                      </div>
                      <div>
                        <p className="font-bold text-ink text-[14px]">Pre-selling advantage</p>
                        <p className="text-[13px] text-muted-foreground mt-1 leading-relaxed">
                          {payload.urgency_text_1 ||
                            "Prices are expected to increase every quarter as construction milestones are reached."}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary/5 border border-primary/15 rounded-2xl p-5">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <Star size={16} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-ink text-[14px]">Limited units remaining</p>
                        <p className="text-[13px] text-muted-foreground mt-1 leading-relaxed">
                          {payload.urgency_text_2 ||
                            "Selected floors and unit types are selling fast. Secure your preferred floor while available."}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
