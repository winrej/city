import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import lifestyleImg from "@/assets/lifestyle-couple.jpg";
import { Reveal } from "@/components/site/Reveal";
import { BreadcrumbJsonLd } from "@/components/site/BreadcrumbJsonLd";
import { ContactFormSchema, createLead } from "../lib/api/admin.functions";
import type { z } from "zod";

type ContactFormData = z.infer<typeof ContactFormSchema>;

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — CityQlo" },
      {
        name: "description",
        content:
          "Book a complimentary consultation with CityQlo. We'll listen to your goals first.",
      },
      { property: "og:title", content: "Contact — CityQlo" },
      {
        property: "og:description",
        content: "Book a complimentary consultation. We'll listen first.",
      },
      { property: "og:url", content: "https://cityqlo.com/contact" },
    ],
    links: [{ rel: "canonical", href: "https://cityqlo.com/contact" }],
  }),
  component: Contact,
});

const benefits = [
  [
    "A clear-eyed view",
    "We map your goals, timeline, and liquidity before discussing any property.",
  ],
  ["No pressure", "If now isn't the right time to buy, we'll tell you. Honestly."],
  ["A curated shortlist", "Hand-picked options — only if and when it fits your plan."],
  ["A long-term partner", "We stay close through turnover, leasing, and the next decade."],
];

function Contact() {
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStartedAt] = useState(() => Date.now());

  const {
    register,
    handleSubmit,
    formState: { errors },
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
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Contact", href: "/contact" },
        ]}
      />
      <section className="px-4 pb-32 pt-32 md:pt-52">
        <div className="container-prose">
          <div className="grid overflow-hidden rounded-[1.5rem] bg-background shadow-soft md:grid-cols-2">
            {/* Left */}
            <div className="relative p-10 md:p-20">
              <div
                aria-hidden
                className="absolute inset-0 -z-10 opacity-60"
                style={{ background: "linear-gradient(180deg, var(--surface), transparent 50%)" }}
              />
              <Reveal>
                <p className="eyebrow">
                  <span className="gold-rule" />
                  Consultation
                </p>
              </Reveal>
              <Reveal delay={120}>
                <h1 className="display-2 mt-6">
                  Let's talk about your
                  <br />
                  property goals.
                </h1>
              </Reveal>
              <Reveal delay={240}>
                <p className="lede mt-8 max-w-md">
                  Complimentary. Conversational. We listen first, then guide.
                </p>
              </Reveal>

              <ul className="mt-16 space-y-9">
                {benefits.map(([t, d], i) => (
                  <Reveal
                    as="li"
                    key={t}
                    delay={300 + i * 80}
                    className="grid grid-cols-[auto_1fr] gap-6"
                  >
                    <span className="mt-2 inline-flex h-8 w-8 items-center justify-center rounded-full border border-hairline text-[10.5px] font-semibold tracking-[0.16em] text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="text-[17px] font-semibold tracking-[-0.01em]">{t}</p>
                      <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{d}</p>
                    </div>
                  </Reveal>
                ))}
              </ul>

              <Reveal delay={700}>
                <div className="img-luxe img-luxe-hover mt-16 overflow-hidden rounded-[1.25rem]">
                  <img
                    src={lifestyleImg}
                    alt="A couple at home in Metro Manila"
                    className="img-luxe h-64 w-full object-cover"
                    width={1600}
                    height={1920}
                    loading="lazy"
                  />
                </div>
              </Reveal>
            </div>

            {/* Right */}
            <div className="surface border-t border-hairline p-10 md:border-l md:border-t-0 md:p-20">
              <Reveal>
                <h2 className="display-3">Send an inquiry.</h2>
                <p className="mt-4 text-[14px] text-muted-foreground">
                  We typically reply within one business day.
                </p>
              </Reveal>

              {sent ? (
                <Reveal>
                  <div className="mt-16 rounded-[1.25rem] border border-hairline bg-background p-12 text-center">
                    <p className="eyebrow">Received</p>
                    <p className="mt-4 text-2xl font-bold tracking-[-0.02em]">Thank you.</p>
                    <p className="mt-3 text-[15px] text-muted-foreground">
                      We'll be in touch shortly.
                    </p>
                    <button
                      onClick={() => setSent(false)}
                      className="mt-8 text-sm font-semibold text-primary hover:underline"
                    >
                      Send another inquiry
                    </button>
                  </div>
                </Reveal>
              ) : (
                <Reveal delay={120}>
                  <form onSubmit={handleSubmit(onSubmit)} className="mt-12 space-y-6">
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
                    <Field label="Full name" error={errors.name?.message}>
                      <input
                        {...register("name")}
                        autoComplete="name"
                        placeholder="Jane Doe"
                        className={`h-14 w-full rounded-full border bg-background px-6 text-[15px] focus:outline-none transition-colors ${
                          errors.name
                            ? "border-red-500 focus:border-red-500"
                            : "border-border focus:border-ink"
                        }`}
                      />
                    </Field>
                    <div className="grid gap-6 md:grid-cols-2">
                      <Field label="Email" error={errors.email?.message}>
                        <input
                          {...register("email")}
                          type="email"
                          autoComplete="email"
                          placeholder="jane@example.com"
                          className={`h-14 w-full rounded-full border bg-background px-6 text-[15px] focus:outline-none transition-colors ${
                            errors.email
                              ? "border-red-500 focus:border-red-500"
                              : "border-border focus:border-ink"
                          }`}
                        />
                      </Field>
                      <Field label="Phone (optional)" error={errors.phone?.message}>
                        <input
                          {...register("phone")}
                          type="tel"
                          autoComplete="tel"
                          placeholder="+63"
                          className={`h-14 w-full rounded-full border bg-background px-6 text-[15px] focus:outline-none transition-colors ${
                            errors.phone
                              ? "border-red-500 focus:border-red-500"
                              : "border-border focus:border-ink"
                          }`}
                        />
                      </Field>
                    </div>
                    <Field label="I'm a" error={errors.role?.message}>
                      <select
                        {...register("role")}
                        className="h-14 w-full rounded-full border border-border bg-background px-6 text-[15px] focus:border-ink focus:outline-none appearance-none cursor-pointer"
                      >
                        <option value="Professional in PH">Professional in PH</option>
                        <option value="Investor">Investor</option>
                        <option value="OFW">OFW</option>
                        <option value="Just exploring">Just exploring</option>
                      </select>
                    </Field>
                    <Field label="Tell us about your goals" error={errors.message?.message}>
                      <textarea
                        {...register("message")}
                        rows={5}
                        placeholder="Share a bit about what you're looking for..."
                        className={`w-full rounded-[1.25rem] border bg-background px-6 py-4 text-[15px] focus:outline-none transition-colors ${
                          errors.message
                            ? "border-red-500 focus:border-red-500"
                            : "border-border focus:border-ink"
                        }`}
                      />
                    </Field>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-ink px-9 py-5 text-[13px] font-semibold tracking-[0.02em] text-white transition-all duration-700 hover:-translate-y-[2px] hover:shadow-lift disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ transitionTimingFunction: "var(--ease-luxe)" }}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        "Book consultation"
                      )}
                    </button>
                    <p className="text-center text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      By submitting, you agree to be contacted by CityQlo.
                    </p>

                    <div className="mt-6 rounded-[1rem] border border-hairline bg-surface px-5 py-4 text-[11.5px] leading-relaxed text-muted-foreground">
                      <p className="font-semibold text-[10px] uppercase tracking-[0.2em] text-ink/40 mb-1.5">
                        Licensed Broker Oversight
                      </p>
                      <p>
                        CityQlo works under the supervision of licensed real estate broker{" "}
                        <span className="font-semibold text-foreground">Joy Lachica</span> (PRC Lic.
                        No. 10101 · DHSUD NCR-B-6055). Property reservations and transactions are
                        processed in coordination with our supervising broker to help ensure
                        compliance with applicable Philippine real estate regulations.
                      </p>
                    </div>
                  </form>
                </Reveal>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="flex justify-between items-center mb-3">
        <span className="block text-[10.5px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          {label}
        </span>
        {error && (
          <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">
            {error}
          </span>
        )}
      </div>
      {children}
    </label>
  );
}
