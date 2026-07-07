import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "../components/site/Reveal";
import { ConsultationCTA } from "../components/site/ConsultationCTA";
import { Briefcase, ArrowRight, Compass, Shield, Users, X, CheckCircle2 } from "lucide-react";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { submitApplication } from "../lib/api/admin.functions";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers — CityQlo" },
      {
        name: "description",
        content:
          "Join the CityQlo team. Build a career in advisory-first real estate discovery in Metro Manila.",
      },
      { property: "og:title", content: "Careers — CityQlo" },
      { property: "og:url", content: "https://cityqlo.com/careers" },
    ],
    links: [{ rel: "canonical", href: "https://cityqlo.com/careers" }],
  }),
  component: CareersPage,
});

// ─── Static data ──────────────────────────────────────────────────────────────

const values = [
  {
    title: "Guidance, Not Pressure",
    desc: "We don't do hard sales. We train our advisors to act as consultants who align with the client's long-term cash flows.",
    icon: Shield,
  },
  {
    title: "Editorial Presentation",
    desc: "We build premium product discovery tools. We care deeply about clean aesthetics, structural data, and cinematic visual walk-throughs.",
    icon: Compass,
  },
  {
    title: "OFW & Investor Focus",
    desc: "We build robust, digitized communication systems to serve clients in Singapore, the Middle East, North America, and Europe seamlessly.",
    icon: Users,
  },
];

const jobs = [
  {
    title: "Property Advisory Consultant",
    type: "Full-Time / Commission Hybrid",
    location: "Metro Manila / Remote Friendly",
    desc: "Guide Filipino professionals and OFW investors in choosing the right DMCI properties. You will analyze spreadsheets, present cash-flow options, and act as a reliable advisor.",
  },
  {
    title: "Digital Content Producer",
    type: "Full-Time / Part-Time Option",
    location: "Makati & Quezon City Sites",
    desc: "Capture and produce cinematic video walkthroughs of construction updates, neighborhood features, and unit layouts. Proficiency in short-form mobile editing is preferred.",
  },
  {
    title: "Client Success Associate",
    type: "Full-Time",
    location: "Remote Friendly",
    desc: "Ensure seamless digital coordination for clients from reservation to turnover. You will manage document tracking, Viber inquiries, and coordinate bank financing options.",
  },
];

// ─── Application form schema (client-side) ───────────────────────────────────

const ApplicationFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().max(30).optional(),
  cover_letter: z.string().min(10, "Please write at least a short message").max(3000),
  linkedin_url: z
    .string()
    .optional()
    .refine((v) => !v || v === "" || /^https?:\/\/.+/.test(v), "Must be a valid URL"),
  portfolio_url: z
    .string()
    .optional()
    .refine((v) => !v || v === "" || /^https?:\/\/.+/.test(v), "Must be a valid URL"),
  // Honeypot
  company: z.string().max(0).optional(),
});

type ApplicationForm = z.infer<typeof ApplicationFormSchema>;

// ─── Apply Modal ─────────────────────────────────────────────────────────────

function ApplyModal({ role, onClose }: { role: string; onClose: () => void }) {
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const formStartRef = useRef(Date.now());

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationForm>({
    resolver: zodResolver(ApplicationFormSchema),
  });

  async function onSubmit(values: ApplicationForm) {
    setServerError(null);
    try {
      await submitApplication({
        data: {
          ...values,
          role,
          phone: values.phone || undefined,
          linkedin_url: values.linkedin_url || undefined,
          portfolio_url: values.portfolio_url || undefined,
          form_started_at: formStartRef.current,
        },
      });
      setSuccess(true);
    } catch (err: any) {
      setServerError(err?.message ?? "Something went wrong. Please try again.");
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full rounded-3xl bg-background shadow-[0_24px_80px_rgba(0,0,0,0.25)] overflow-hidden"
        style={{ maxWidth: "560px", maxHeight: "90dvh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Blue top rule */}
        <div className="h-[3px] w-full bg-gradient-to-r from-[#1A56DB]/40 via-[#1A56DB] to-[#1A56DB]/40" />

        <div className="px-7 py-7">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground mb-1">
                Apply Now
              </p>
              <h2 className="text-[22px] font-bold text-ink leading-snug">{role}</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="ml-4 mt-1 flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-surface hover:text-ink shrink-0"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>

          {success ? (
            <div className="flex flex-col items-center gap-5 py-10 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
                <CheckCircle2 className="text-emerald-500" size={32} />
              </div>
              <div>
                <h3 className="text-[20px] font-bold text-ink">Application Received!</h3>
                <p className="mt-2 text-[14px] text-muted-foreground max-w-xs">
                  Thank you for applying. We review applications within 3–5 business days and will
                  reach out via email.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#1A56DB] px-6 py-2.5 text-[13px] font-semibold text-white"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
              {/* Honeypot */}
              <input {...register("company")} type="text" tabIndex={-1} className="hidden" />

              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-ink/70 tracking-wide uppercase">
                  Full Name *
                </label>
                <input
                  {...register("name")}
                  type="text"
                  placeholder="Maria Santos"
                  className={`w-full rounded-xl border bg-surface px-4 py-3 text-[14px] text-ink placeholder:text-muted-foreground/50 outline-none transition-all duration-200 focus:border-[#1A56DB]/40 focus:ring-2 focus:ring-[#1A56DB]/10 ${errors.name ? "border-red-400/60" : "border-border"}`}
                />
                {errors.name && <p className="text-[11px] text-red-500">{errors.name.message}</p>}
              </div>

              {/* Email + Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold text-ink/70 tracking-wide uppercase">
                    Email *
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="you@email.com"
                    className={`w-full rounded-xl border bg-surface px-4 py-3 text-[14px] text-ink placeholder:text-muted-foreground/50 outline-none transition-all duration-200 focus:border-[#1A56DB]/40 focus:ring-2 focus:ring-[#1A56DB]/10 ${errors.email ? "border-red-400/60" : "border-border"}`}
                  />
                  {errors.email && (
                    <p className="text-[11px] text-red-500">{errors.email.message}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold text-ink/70 tracking-wide uppercase">
                    Phone
                  </label>
                  <input
                    {...register("phone")}
                    type="tel"
                    placeholder="+63 9XX XXX XXXX"
                    className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-[14px] text-ink placeholder:text-muted-foreground/50 outline-none transition-all duration-200 focus:border-[#1A56DB]/40 focus:ring-2 focus:ring-[#1A56DB]/10"
                  />
                </div>
              </div>

              {/* Cover letter */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-ink/70 tracking-wide uppercase">
                  Why You? *
                </label>
                <textarea
                  {...register("cover_letter")}
                  rows={5}
                  placeholder="Tell us about your background, what draws you to this role, and what you'd bring to the team..."
                  className={`w-full rounded-xl border bg-surface px-4 py-3 text-[14px] text-ink placeholder:text-muted-foreground/50 outline-none transition-all duration-200 focus:border-[#1A56DB]/40 focus:ring-2 focus:ring-[#1A56DB]/10 resize-none ${errors.cover_letter ? "border-red-400/60" : "border-border"}`}
                />
                {errors.cover_letter && (
                  <p className="text-[11px] text-red-500">{errors.cover_letter.message}</p>
                )}
              </div>

              {/* LinkedIn + Portfolio */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold text-ink/70 tracking-wide uppercase">
                    LinkedIn
                  </label>
                  <input
                    {...register("linkedin_url")}
                    type="url"
                    placeholder="https://linkedin.com/in/..."
                    className={`w-full rounded-xl border bg-surface px-4 py-3 text-[14px] text-ink placeholder:text-muted-foreground/50 outline-none transition-all duration-200 focus:border-[#1A56DB]/40 focus:ring-2 focus:ring-[#1A56DB]/10 ${errors.linkedin_url ? "border-red-400/60" : "border-border"}`}
                  />
                  {errors.linkedin_url && (
                    <p className="text-[11px] text-red-500">{errors.linkedin_url.message}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold text-ink/70 tracking-wide uppercase">
                    Portfolio
                  </label>
                  <input
                    {...register("portfolio_url")}
                    type="url"
                    placeholder="https://yoursite.com"
                    className={`w-full rounded-xl border bg-surface px-4 py-3 text-[14px] text-ink placeholder:text-muted-foreground/50 outline-none transition-all duration-200 focus:border-[#1A56DB]/40 focus:ring-2 focus:ring-[#1A56DB]/10 ${errors.portfolio_url ? "border-red-400/60" : "border-border"}`}
                  />
                  {errors.portfolio_url && (
                    <p className="text-[11px] text-red-500">{errors.portfolio_url.message}</p>
                  )}
                </div>
              </div>

              {serverError && (
                <p className="rounded-xl bg-red-500/10 px-4 py-3 text-[13px] text-red-600 border border-red-400/30">
                  {serverError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#1A56DB] px-6 py-3.5 text-[14px] font-semibold tracking-[0.02em] text-white transition-all duration-300 hover:bg-[#1544C0] hover:-translate-y-[1px] hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <ArrowRight size={15} />
                  </>
                )}
              </button>

              <p className="text-center text-[10.5px] text-muted-foreground/60">
                Your information is handled securely. We'll only use it to process your application.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function CareersPage() {
  const [applyingFor, setApplyingFor] = useState<string | null>(null);

  return (
    <>
      {/* Cinematic Dark Hero */}
      <section
        className="px-4 pb-36 pt-32 md:pt-48 md:pb-48"
        style={{
          background: "oklch(0.21 0.012 252)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 70% 70% at 50% 60%, oklch(0.43 0.20 258 / 0.13) 0%, transparent 80%)",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat",
            backgroundSize: "180px 180px",
            pointerEvents: "none",
            opacity: 0.5,
          }}
        />

        <div className="container-prose relative z-10">
          <Reveal>
            <p className="eyebrow text-white/50">
              <span className="gold-rule" />
              Join Our Mission
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="display-1 mt-10 max-w-5xl text-white text-shadow-hero relative">
              Build the future of
              <span className="block text-primary text-shadow-sub">property advisory.</span>
              <span
                className="absolute hidden lg:inline-block pointer-events-none opacity-80 text-[26px] tracking-wide rotate-[-3deg] select-none text-gold font-normal"
                style={{
                  fontFamily: '"Dancing Script", cursive',
                  bottom: "-10px",
                  right: "15%",
                }}
              >
                ~ Help families compound wealth
              </span>
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <p className="lede mt-12 max-w-3xl text-zinc-300 text-shadow-sm">
              We are restructuring how real estate transactions are done in the Philippines—focusing
              on objective advice, premium content discovery, and long-term client relationships.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="px-4 section-pad bg-background">
        <div className="container-wide">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Reveal>
              <p className="eyebrow justify-center">
                <span className="gold-rule" />
                Our Culture
              </p>
              <h2 className="display-2 mt-6">A disciplined, client-first approach.</h2>
            </Reveal>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <Reveal key={v.title} delay={i * 100}>
                  <div className="group relative border border-hairline rounded-[1.5rem] bg-surface p-8 md:p-10 transition-all duration-500 hover:-translate-y-1 hover:shadow-soft">
                    <div className="h-10 w-10 rounded-full bg-[#1A56DB]/10 text-primary flex items-center justify-center mb-6">
                      <Icon size={18} />
                    </div>
                    <h3 className="text-[20px] font-bold text-ink">{v.title}</h3>
                    <p className="mt-4 text-[14.5px] leading-relaxed text-muted-foreground">
                      {v.desc}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="px-4 section-pad surface relative overflow-hidden">
        <span
          className="absolute hidden xl:inline-block pointer-events-none opacity-[0.2] text-[34px] rotate-[4deg] select-none text-gold"
          style={{
            fontFamily: '"Dancing Script", cursive',
            bottom: "10%",
            right: "5%",
          }}
        >
          Grow with us
        </span>

        <div className="container-wide grid gap-16 lg:grid-cols-12 relative z-10">
          {/* Left Title */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 lg:h-fit">
            <Reveal>
              <p className="eyebrow">
                <span className="gold-rule" />
                Opportunities
              </p>
              <h2 className="display-2 mt-6">Open Roles</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                We are actively looking for professionals who align with our values of transparency
                and patient growth.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                Don't see your specific role? Send an open application to{" "}
                <a
                  href="mailto:careers@cityqlo.com"
                  className="font-semibold text-primary hover:underline"
                >
                  careers@cityqlo.com
                </a>
                .
              </p>
            </Reveal>
          </div>

          {/* Jobs List */}
          <div className="lg:col-span-7 lg:col-start-6 flex flex-col gap-6">
            {jobs.map((job, idx) => (
              <Reveal key={job.title} delay={idx * 100}>
                <div
                  className="group relative rounded-[1.5rem] border border-border bg-background p-8 transition-all duration-700 hover:shadow-lift hover:border-primary/30 overflow-hidden"
                  style={{ transitionTimingFunction: "var(--ease-luxe)" }}
                >
                  <div
                    className="absolute bottom-0 left-0 h-[2px] bg-gold w-0 group-hover:w-full transition-all duration-700"
                    style={{ transitionTimingFunction: "var(--ease-luxe)" }}
                  />

                  <div className="flex flex-col gap-4 relative z-10">
                    <div className="flex items-center gap-4 flex-wrap justify-between">
                      <span className="font-mono text-xs font-semibold tracking-[0.2em] text-[#1A56DB] bg-[#1A56DB]/5 px-3 py-1 rounded-full uppercase">
                        {job.type}
                      </span>
                      <span className="font-mono text-[10px] tracking-widest text-muted-foreground/60 uppercase">
                        {job.location}
                      </span>
                    </div>

                    <h3 className="text-[22px] md:text-[24px] font-bold tracking-tight text-ink mt-2">
                      {job.title}
                    </h3>
                    <p className="text-[15px] leading-relaxed text-muted-foreground">{job.desc}</p>

                    <div className="mt-4 flex justify-between items-center">
                      <button
                        type="button"
                        onClick={() => setApplyingFor(job.title)}
                        className="inline-flex items-center gap-2 text-[13px] font-bold text-[#1A56DB] group-hover:translate-x-1 transition-transform"
                      >
                        Apply for this role
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ConsultationCTA />

      {/* Apply Modal */}
      {applyingFor && <ApplyModal role={applyingFor} onClose={() => setApplyingFor(null)} />}
    </>
  );
}
