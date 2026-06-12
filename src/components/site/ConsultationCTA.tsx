import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";

export function ConsultationCTA() {
  return (
    <section className="px-4 section-pad">
      <div className="container-prose">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-20 text-white md:px-24 md:py-40">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-40 -top-40 h-[36rem] w-[36rem] rounded-full opacity-70"
            style={{
              background:
                "radial-gradient(closest-side, color-mix(in oklab, var(--primary) 55%, transparent), transparent 70%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-32 -left-24 h-[24rem] w-[24rem] rounded-full opacity-40"
            style={{
              background:
                "radial-gradient(closest-side, color-mix(in oklab, var(--gold) 35%, transparent), transparent 70%)",
            }}
          />
          <Reveal>
            <p className="eyebrow text-white/50">
              <span className="gold-rule" />
              Begin
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="display-1 mt-8 max-w-4xl text-white">
              Let's talk about
              <br />
              your property goals.
            </h2>
          </Reveal>
          <Reveal delay={260}>
            <p className="lede mt-10 max-w-xl text-white/65">
              A complimentary, no-pressure consultation. We listen first, then guide.
            </p>
          </Reveal>
          <Reveal delay={400}>
            <div className="mt-14">
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 rounded-full bg-white px-9 py-4 text-[13px] font-semibold tracking-[0.02em] text-ink transition-all duration-700 hover:-translate-y-[2px] hover:shadow-lift"
                style={{ transitionTimingFunction: "var(--ease-luxe)" }}
              >
                Book Consultation
                <span aria-hidden>→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
