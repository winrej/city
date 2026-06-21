import React, { useState } from "react";
import { Zap } from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "@/components/site/Reveal";

interface LeadCaptureSectionProps {
  project: {
    name: string;
  };
  payload: {
    title?: string;
    headline?: string;
    headline_span?: string;
    description?: string;
    interest_options?: string[];
  };
  onSubmit: (data: {
    name: string;
    mobile: string;
    email: string;
    interest: string;
  }) => Promise<void>;
}

export function LeadCaptureSection({ project, payload, onSubmit }: LeadCaptureSectionProps) {
  const [form, setForm] = useState({ name: "", mobile: "", email: "", interest: "2-Bedroom" });
  const [formSubmitting, setFormSubmitting] = useState(false);

  const interestOptions = payload.interest_options || [
    "Studio",
    "1-Bedroom",
    "2-Bedroom",
    "3-Bedroom",
    "Price List Only",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.mobile) {
      toast.error("Please fill in your name and mobile number.");
      return;
    }

    setFormSubmitting(true);
    try {
      await onSubmit({
        name: form.name,
        mobile: form.mobile,
        email: form.email,
        interest: form.interest,
      });
      setForm({ name: "", mobile: "", email: "", interest: interestOptions[0] || "2-Bedroom" });
    } catch (err: any) {
      toast.error(err.message || "Failed to submit inquiry.");
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <section id="lead-form" className="px-4 py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-8 max-w-2xl">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <Reveal>
            <div className="text-center mb-10">
              <p className="eyebrow">
                <span className="gold-rule" />
                {payload.title || "Get Started Today"}
              </p>
              <h2 className="display-2 mt-5">
                {payload.headline || "Interested in"}
                <span className="text-primary"> {payload.headline_span || project.name}?</span>
              </h2>
              <p className="lede mt-4 text-[15px]">
                {payload.description ||
                  "Leave your details and we'll prepare your personalized price list and payment computation within 24 hours."}
              </p>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={140}>
            <div className="bg-white rounded-3xl border border-border shadow-lift p-8 md:p-10">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11.5px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Juan dela Cruz"
                      className="w-full border border-border rounded-xl px-4 py-3.5 text-[14px] outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/60"
                    />
                  </div>
                  <div>
                    <label className="block text-[11.5px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      Mobile / Viber *
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.mobile}
                      onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                      placeholder="09XX-XXX-XXXX"
                      className="w-full border border-border rounded-xl px-4 py-3.5 text-[14px] outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/60"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11.5px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="juan@email.com"
                    className="w-full border border-border rounded-xl px-4 py-3.5 text-[14px] outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/60"
                  />
                </div>

                <div>
                  <label className="block text-[11.5px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Interested In
                  </label>
                  <select
                    value={form.interest}
                    onChange={(e) => setForm({ ...form, interest: e.target.value })}
                    className="w-full border border-border rounded-xl px-4 py-3.5 text-[14px] outline-none focus:border-primary transition-colors text-ink bg-white appearance-none"
                  >
                    {interestOptions.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="w-full flex items-center justify-center gap-2.5 bg-primary text-white font-bold py-4 rounded-2xl text-[15px] tracking-wide hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-lift transition-all duration-400 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
                  style={{ transitionTimingFunction: "var(--ease-luxe)" }}
                >
                  {formSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Zap size={17} />
                      Get Free Computation
                    </>
                  )}
                </button>
              </form>

              {/* Trust indicators */}
              <div className="mt-6 pt-5 border-t border-border/40">
                <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                  {[
                    "✓ Official Developer Price",
                    "✓ No Hidden Fees",
                    "✓ Reply within 24 hours",
                  ].map((trust) => (
                    <p key={trust} className="text-[11.5px] text-muted-foreground font-semibold">
                      {trust}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
