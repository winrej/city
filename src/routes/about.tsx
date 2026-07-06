import { createFileRoute, Link } from "@tanstack/react-router";
import founderImg from "@/assets/founder-portrait.jpg";
import interiorImg from "@/assets/interior-living.jpg";
import { ConsultationCTA } from "@/components/site/ConsultationCTA";
import { Reveal } from "@/components/site/Reveal";
import { BreadcrumbJsonLd } from "@/components/site/BreadcrumbJsonLd";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About CityQlo | DMCI Homes Accredited Property Consultant" },
      {
        name: "description",
        content:
          "CityQlo is a DMCI Homes accredited property consultant in Metro Manila — a property advisory built around guidance, transparency, and the long term.",
      },
      {
        property: "og:title",
        content: "About CityQlo | DMCI Homes Accredited Property Consultant",
      },
      {
        property: "og:description",
        content: "A property advisory built around guidance, transparency, and the long term.",
      },
      { property: "og:url", content: "https://cityqlo.com/about" },
    ],
    links: [{ rel: "canonical", href: "https://cityqlo.com/about" }],
  }),
  component: About,
});

const values = [
  ["Clarity over hype", "We'd rather be useful than impressive."],
  ["Long-term first", "Decisions designed to age well — not to close this quarter."],
  ["Quiet expertise", "We do the homework, then explain it plainly."],
  ["Respect for capital", "It's your money, your family, your call."],
];

function About() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
        ]}
      />
      <section className="px-4 pb-32 pt-32 md:pt-64">
        <div className="container-prose">
          <Reveal>
            <p className="eyebrow">
              <span className="gold-rule" />
              About
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="display-1 mt-10 max-w-5xl">
              A property advisory,
              <span className="block text-primary">built around you.</span>
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="px-4">
        <Reveal className="container-wide img-luxe img-luxe-hover overflow-hidden rounded-[1.5rem]">
          <img
            src={interiorImg}
            alt="Refined interior"
            className="img-luxe h-[68vh] w-full object-cover"
            width={1920}
            height={1280}
            loading="lazy"
          />
        </Reveal>
      </section>

      <section className="px-4 section-pad">
        <div className="container-prose grid gap-16 md:grid-cols-12">
          <Reveal className="md:col-span-3">
            <p className="eyebrow">Story</p>
          </Reveal>
          <Reveal delay={140} className="md:col-span-8">
            <p className="lede">
              CityQlo started where many of our clients also began — frustrated by the noise of the
              Philippine property market. Glossy brochures. Rushed pitches. Numbers that didn't add
              up to a life.
            </p>
            <p className="lede mt-8">
              We built CityQlo to give Filipino families and OFWs an advisor in their corner.
              Someone who would look at the spreadsheet honestly, walk away from the wrong deal, and
              stay close for the next ten years.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="surface px-4 section-pad">
        <div className="container-prose grid gap-16 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <p className="eyebrow">
              <span className="gold-rule" />
              Mission
            </p>
            <h2 className="display-2 mt-6">Calmer property decisions.</h2>
          </Reveal>
          <Reveal delay={140} className="md:col-span-6 md:col-start-7">
            <p className="lede">
              We exist to make sound property decisions accessible — without the hard sell — so more
              Filipinos can build long-term wealth on a foundation they actually understand.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-4 section-pad">
        <div className="container-prose">
          <Reveal>
            <p className="eyebrow">
              <span className="gold-rule" />
              Values
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="display-2 mt-6 max-w-3xl">How we work — and what we won't do.</h2>
          </Reveal>
          <div className="mt-16 grid md:mt-24 gap-y-20 gap-x-16 md:grid-cols-2">
            {values.map(([t, d], i) => (
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

      <section className="surface px-4 section-pad">
        <div className="container-prose grid items-center gap-16 md:grid-cols-12 md:gap-24">
          <Reveal className="md:col-span-6">
            <div className="img-luxe img-luxe-hover overflow-hidden rounded-[1.5rem]">
              <img
                src={founderImg}
                alt="Founder portrait"
                className="img-luxe aspect-[4/5] w-full object-cover"
                width={1400}
                height={1750}
                loading="lazy"
              />
            </div>
          </Reveal>
          <Reveal delay={160} className="md:col-span-5 md:col-start-8">
            <p className="eyebrow">
              <span className="gold-rule" />
              Founder
            </p>
            <h2 className="display-2 mt-6">
              Built by a buyer,
              <br />
              for buyers.
            </h2>
            <p className="lede mt-10">
              Our founder spent a decade buying, holding, and advising on Metro Manila property —
              first for family, then for friends, and now for the CityQlo community.
            </p>
            <p className="mt-8 text-[16px] leading-relaxed text-muted-foreground">
              The conversation always starts the same way: tell me about your goals.
            </p>
            <div className="mt-12">
              <Link to="/contact" className="link-quiet hover:border-ink">
                Start the conversation <span aria-hidden>→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="px-4 section-pad-sm">
        <div className="container-prose">
          <Reveal>
            <p className="eyebrow mb-20">
              <span className="gold-rule" />
              Trust
            </p>
          </Reveal>
          <div className="grid gap-20 md:grid-cols-3 md:gap-16">
            {[
              ["12+", "Years in property"],
              ["350+", "Families advised"],
              ["100%", "Transparent recommendations"],
            ].map(([n, l], i) => (
              <Reveal key={l} delay={i * 120}>
                <div className="border-t border-hairline pt-10">
                  <p className="text-[4rem] font-extrabold leading-[0.95] tracking-[-0.04em] md:text-[7.5rem]">
                    {n}
                  </p>
                  <p className="mt-8 max-w-[16rem] text-[14px] leading-relaxed text-muted-foreground">
                    {l}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ConsultationCTA />
    </>
  );
}
