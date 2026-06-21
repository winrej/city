import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Check, Loader2, Sparkles, ArrowRight, ShieldCheck, ChevronDown } from "lucide-react";
import { ContactFormSchema, createLead } from "../../lib/api/admin.functions";
import { Reveal } from "./Reveal";
import type { z } from "zod";

type ContactFormData = z.infer<typeof ContactFormSchema>;

export function ConsultationCTA() {
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStartedAt] = useState(() => Date.now());

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      source: "website",
      company: "",
      form_started_at: formStartedAt,
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await createLead({ data });
      setSent(true);
      reset({
        name: "",
        email: "",
        phone: "",
        message: "",
        source: "website",
        company: "",
        form_started_at: Date.now(),
      });
      toast.success("Consultation booked!", {
        description: "We'll be in touch with you shortly.",
      });
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Something went wrong", {
        description: "Please try again later or email us directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="px-4 section-pad bg-background overflow-hidden">
      <div className="container-wide">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink px-8 py-16 text-white md:px-16 md:py-24 lg:px-20 lg:py-28 shadow-lift">
          {/* Radial glow accents */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-40 -top-40 h-[36rem] w-[36rem] rounded-full opacity-60"
            style={{
              background:
                "radial-gradient(closest-side, color-mix(in oklab, var(--primary) 50%, transparent), transparent 70%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-32 -left-24 h-[24rem] w-[24rem] rounded-full opacity-30"
            style={{
              background:
                "radial-gradient(closest-side, color-mix(in oklab, var(--gold) 30%, transparent), transparent 70%)",
            }}
          />

          <div className="relative z-10 grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Column: Trust Copy & Badges */}
            <div className="lg:col-span-6 flex flex-col">
              <Reveal>
                <p className="eyebrow text-white/50">
                  <span className="gold-rule" />
                  Goal-First Advisory
                </p>
              </Reveal>
              <Reveal delay={100}>
                <h2 className="display-2 mt-6 text-white tracking-tight leading-tight">
                  Let's align your
                  <br className="hidden md:inline" /> property goals.
                </h2>
              </Reveal>
              <Reveal delay={200}>
                <p className="mt-6 text-[16px] leading-relaxed text-zinc-300 max-w-lg">
                  Skip the generic sales pitches. Schedule a complimentary consultation to map out
                  your budget, timeline, and cash-flow spreadsheet honestly.
                </p>
              </Reveal>

              {/* Value checklist bullets */}
              <ul className="mt-10 space-y-5">
                {[
                  [
                    "Developer Track Record & Quality",
                    "Objective architectural and builder comparisons.",
                  ],
                  [
                    "Personalized Cash-Flow Map",
                    "Custom spreadsheet breaking down payments and amortizations.",
                  ],
                  [
                    "Viber & WhatsApp Friendly",
                    "Easy remote coordination tailored for OFWs and busy professionals.",
                  ],
                ].map(([title, desc], idx) => (
                  <Reveal as="li" key={title} delay={300 + idx * 80} className="flex gap-4 items-start">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1A56DB]/20 border border-[#1A56DB]/35 text-primary">
                      <Check size={11} className="stroke-[3]" />
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[14.5px] font-bold text-white leading-snug">
                        {title}
                      </span>
                      <span className="text-[13px] text-zinc-400 mt-1 leading-snug">
                        {desc}
                      </span>
                    </div>
                  </Reveal>
                ))}
              </ul>

              {/* Accredited partner trust row */}
              <Reveal
                delay={600}
                className="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center gap-6"
              >
                <div className="flex items-center gap-3">
                  <img
                    src="/dmci-homes-seeklogo.png"
                    alt="DMCI Homes"
                    className="h-8 object-contain brightness-0 invert opacity-75"
                  />
                  <div className="text-[9.5px] font-mono tracking-widest uppercase text-white/50 leading-tight">
                    Accredited<br />Partner
                  </div>
                </div>
                <div className="h-6 w-px bg-white/10 hidden sm:block" />
                <div className="flex items-center gap-2 text-[10.5px] font-mono tracking-wider text-zinc-400">
                  <ShieldCheck size={14} className="text-gold shrink-0" />
                  <span>OBJECTIVE GUIDANCE · ZERO PRESSURE</span>
                </div>
              </Reveal>
            </div>

            {/* Right Column: Inline Inquiry Form Card */}
            <div className="lg:col-span-5 lg:col-start-8">
              <Reveal delay={250}>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] backdrop-blur-md p-6 md:p-8 shadow-2xl">
                  {sent ? (
                    <div className="py-12 text-center flex flex-col items-center justify-center">
                      <div className="h-12 w-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-6">
                        <Check size={24} className="stroke-[2.5]" />
                      </div>
                      <h3 className="text-[20px] font-bold tracking-tight text-white">
                        Consultation Booked
                      </h3>
                      <p className="mt-3 text-[14.5px] text-zinc-400 leading-relaxed max-w-xs mx-auto">
                        Thank you! We've received your request and typically reach out via WhatsApp
                        or Viber within a few hours.
                      </p>
                      <button
                        onClick={() => setSent(false)}
                        className="mt-8 text-xs font-semibold uppercase tracking-wider text-primary hover:text-white transition-colors cursor-pointer"
                      >
                        Send Another Request
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <div>
                        <h3 className="text-[17px] font-bold text-white flex items-center gap-2">
                          <Sparkles size={16} className="text-gold shrink-0" />
                          Quick Consultation
                        </h3>
                        <p className="text-[12.5px] text-zinc-400 mt-1 leading-normal">
                          Fill out the details below. We reply within a few hours.
                        </p>
                      </div>

                      {/* Honeypot hidden input */}
                      <input
                        {...register("company")}
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        className="hidden"
                        aria-hidden="true"
                      />
                      <input
                        {...register("form_started_at", { valueAsNumber: true })}
                        type="hidden"
                      />

                      {/* Name */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center px-1">
                          <label className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                            Full Name
                          </label>
                          {errors.name && (
                            <span className="text-[9.5px] font-bold text-red-400 uppercase tracking-wider">
                              {errors.name.message}
                            </span>
                          )}
                        </div>
                        <input
                          {...register("name")}
                          placeholder="Jane Doe"
                          className={`h-11 w-full rounded-full border bg-white/[0.04] px-5 text-[14px] text-white focus:outline-none transition-all placeholder-zinc-500 focus:ring-1 focus:ring-primary/40 ${
                            errors.name
                              ? "border-red-400 focus:border-red-400"
                              : "border-white/10 focus:border-primary/50 focus:bg-white/[0.06]"
                          }`}
                        />
                      </div>

                      {/* Email & Phone */}
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex justify-between items-center px-1">
                            <label className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                              Email
                            </label>
                            {errors.email && (
                              <span className="text-[9.5px] font-bold text-red-400 uppercase tracking-wider">
                                {errors.email.message}
                              </span>
                            )}
                          </div>
                          <input
                            {...register("email")}
                            type="email"
                            placeholder="jane@example.com"
                            className={`h-11 w-full rounded-full border bg-white/[0.04] px-5 text-[14px] text-white focus:outline-none transition-all placeholder-zinc-500 focus:ring-1 focus:ring-primary/40 ${
                              errors.email
                                ? "border-red-400 focus:border-red-400"
                                : "border-white/10 focus:border-primary/50 focus:bg-white/[0.06]"
                            }`}
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <div className="flex justify-between items-center px-1">
                            <label className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                              Viber / WhatsApp
                            </label>
                            {errors.phone && (
                              <span className="text-[9.5px] font-bold text-red-400 uppercase tracking-wider">
                                {errors.phone.message}
                              </span>
                            )}
                          </div>
                          <input
                            {...register("phone")}
                            placeholder="+63"
                            className={`h-11 w-full rounded-full border bg-white/[0.04] px-5 text-[14px] text-white focus:outline-none transition-all placeholder-zinc-500 focus:ring-1 focus:ring-primary/40 ${
                              errors.phone
                                ? "border-red-400 focus:border-red-400"
                                : "border-white/10 focus:border-primary/50 focus:bg-white/[0.06]"
                            }`}
                          />
                        </div>
                      </div>

                      {/* Role Select */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 px-1">
                          I'm a
                        </label>
                        <div className="relative">
                          <select
                            {...register("role")}
                            className="h-11 w-full rounded-full border border-white/10 bg-zinc-950 px-5 text-[14px] text-white focus:border-primary/50 focus:outline-none appearance-none cursor-pointer focus:ring-1 focus:ring-primary/40"
                          >
                            <option value="Professional in PH">Professional in PH</option>
                            <option value="Investor">Investor</option>
                            <option value="OFW">OFW</option>
                            <option value="Just exploring">Just exploring</option>
                          </select>
                          <ChevronDown
                            size={14}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
                          />
                        </div>
                      </div>

                      {/* Message */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 px-1">
                          Briefly share your goals (optional)
                        </label>
                        <textarea
                          {...register("message")}
                          rows={2}
                          placeholder="e.g. Budget, preferred area, unit count, etc..."
                          className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-[14px] text-white focus:outline-none focus:border-primary/50 focus:bg-white/[0.06] transition-all placeholder-zinc-500 focus:ring-1 focus:ring-primary/40"
                          style={{ resize: "none" }}
                        />
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-12 inline-flex items-center justify-center gap-2.5 rounded-full bg-white hover:bg-zinc-100 text-ink text-[13.5px] font-semibold tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Book Consultation
                            <ArrowRight size={14} />
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
