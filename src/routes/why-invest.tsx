import { createFileRoute, Link } from "@tanstack/react-router";
import towerImg from "@/assets/tower-exterior.jpg";
import interiorImg from "@/assets/interior-living.jpg";
import { ConsultationCTA } from "@/components/site/ConsultationCTA";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/why-invest")({
  head: () => ({
    meta: [
      { title: "Why Invest — CityQlo" },
      {
        name: "description",
        content:
          "Why real estate, why Metro Manila, why condo investments, and why DMCI — explained without the sales pitch.",
      },
      { property: "og:title", content: "Why Invest — CityQlo" },
      {
        property: "og:description",
        content:
          "Why real estate, why Metro Manila, and why DMCI — explained without the sales pitch.",
      },
      { property: "og:url", content: "/why-invest" },
    ],
    links: [{ rel: "canonical", href: "/why-invest" }],
  }),
  component: WhyInvest,
});

const chapters = [
  {
    n: "01",
    t: "Why real estate",
    d: "Among all asset classes, real estate is one of the few that gives you shelter, cash flow, and appreciation in a single instrument. Held with patience, it outpaces inflation and compounds quietly.",
  },
  {
    n: "02",
    t: "Why Metro Manila",
    d: "Metro Manila concentrates population, jobs, and infrastructure spend. New CBDs, transit lines, and lifestyle districts continue to expand the value envelope for the right submarkets.",
  },
  {
    n: "03",
    t: "Why condo investments",
    d: "Condominiums offer a defined entry point, professional management, and rentability that suits both end-users and investors — when chosen with discipline.",
  },
  {
    n: "04",
    t: "Why DMCI",
    d: "Resort-inspired developments, defensive pricing, and a strong rental community profile have made DMCI a long-time favorite for both first-time buyers and seasoned investors.",
  },
];

const benefits = [
  [
    "Defensive cash flow",
    "Long-leased units in mature submarkets create stable, peso- and dollar-resilient yield.",
  ],
  [
    "Capital growth",
    "Locations near new infrastructure historically lead in long-horizon appreciation.",
  ],
  ["Inflation hedge", "Hard assets keep pace with — or outrun — rising cost of living."],
  ["Generational asset", "Pass it on, refinance it, or leverage it as part of a wider portfolio."],
];

const faqs = [
  [
    "Is now a good time to invest?",
    "It depends entirely on your timeline and liquidity. There is no universal good time — only the right time for your situation.",
  ],
  [
    "I'm an OFW. Can I buy from abroad?",
    "Yes. We work with many OFW clients end-to-end remotely, from goal-setting to turnover.",
  ],
  [
    "Do you charge for consultation?",
    "No. The initial conversation is complimentary, and there's never pressure to transact.",
  ],
  [
    "Do you only recommend DMCI?",
    "No. We recommend what fits your goals. DMCI is often a strong fit, but it's never the only option.",
  ],
];

function WhyInvest() {
  return (
    <>
      <section className="px-4 pb-32 pt-32 md:pt-64">
        <div className="container-prose">
          <Reveal>
            <p className="eyebrow">
              <span className="gold-rule" />
              Why invest
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="display-1 mt-10 max-w-5xl">
              The case for property,
              <span className="block text-primary">made calmly.</span>
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <p className="lede mt-12 max-w-2xl">
              A field guide to thinking about Metro Manila real estate the way long-term owners do —
              patiently, deliberately, and on your own terms.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-4">
        <Reveal className="container-wide img-luxe img-luxe-hover overflow-hidden rounded-[1.5rem]">
          <img
            src={towerImg}
            alt="Premium Metro Manila condominium"
            className="img-luxe h-[68vh] w-full object-cover"
            width={1600}
            height={1920}
            loading="lazy"
          />
        </Reveal>
      </section>

      {chapters.map((c, i) => (
        <section key={c.n} className={`px-4 section-pad ${i % 2 === 1 ? "surface" : ""}`}>
          <div className="container-prose grid gap-12 md:grid-cols-12">
            <Reveal className="md:col-span-4">
              <p className="text-[11px] font-semibold tracking-[0.28em] text-muted-foreground">
                {c.n}
              </p>
              <h2 className="display-2 mt-6">{c.t}</h2>
            </Reveal>
            <Reveal delay={140} className="md:col-span-7 md:col-start-6">
              <p className="lede">{c.d}</p>
            </Reveal>
          </div>
        </section>
      ))}

      <section className="px-4 section-pad">
        <div className="container-prose">
          <Reveal>
            <p className="eyebrow">
              <span className="gold-rule" />
              Investment benefits
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="display-2 mt-6 max-w-3xl">What ownership earns you over time.</h2>
          </Reveal>
          <div className="mt-16 grid md:mt-24 gap-y-20 gap-x-16 md:grid-cols-2">
            {benefits.map(([t, d], i) => (
              <Reveal key={t} delay={i * 80}>
                <div className="border-t border-hairline pt-8">
                  <p className="text-[11px] font-semibold tracking-[0.28em] text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-6 text-[26px] font-bold tracking-[-0.025em] md:text-[30px]">
                    {t}
                  </h3>
                  <p className="mt-5 max-w-md text-[16px] leading-relaxed text-muted-foreground">
                    {d}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4">
        <Reveal className="container-wide img-luxe img-luxe-hover overflow-hidden rounded-[1.5rem]">
          <img
            src={interiorImg}
            alt="Refined Manila condo interior"
            className="img-luxe h-[60vh] w-full object-cover"
            width={1920}
            height={1280}
            loading="lazy"
          />
        </Reveal>
      </section>

      <section className="px-4 section-pad">
        <div className="container-prose grid gap-20 md:grid-cols-12">
          <Reveal className="md:col-span-4">
            <p className="eyebrow">
              <span className="gold-rule" />
              FAQs
            </p>
            <h2 className="display-2 mt-6">
              Honest
              <br />
              answers.
            </h2>
            <p className="mt-8 text-[16px] leading-relaxed text-muted-foreground">
              If yours isn't here, ask us directly.
            </p>
            <div className="mt-10">
              <Link to="/contact" className="link-quiet hover:border-ink">
                Ask a question <span aria-hidden>→</span>
              </Link>
            </div>
          </Reveal>
          <div className="md:col-span-7 md:col-start-6">
            <dl className="divide-y divide-hairline border-y border-hairline">
              {faqs.map(([q, a], i) => (
                <Reveal key={q} delay={i * 60}>
                  <div className="grid gap-4 py-10 md:grid-cols-5 md:gap-8">
                    <dt className="text-[18px] font-semibold tracking-[-0.01em] md:col-span-2">
                      {q}
                    </dt>
                    <dd className="text-[16px] leading-relaxed text-muted-foreground md:col-span-3">
                      {a}
                    </dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <ConsultationCTA />
    </>
  );
}
