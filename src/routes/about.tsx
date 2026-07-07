import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import founderFallback from "@/assets/founder-portrait.jpg";
import interiorImg from "@/assets/interior-living.jpg";
import { getSiteSettings } from "../lib/api/admin.functions";
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
  const { data: siteSettings } = useQuery({
    queryKey: ["portal-settings"],
    queryFn: () => getSiteSettings(),
  });
  const homepageSettings = siteSettings?.find((r: any) => r.key === "homepage")?.value ?? {};
  const founderImgSrc: string = homepageSettings.founder_image_url || founderFallback;
  const brokerImgSrc: string = homepageSettings.broker_image_url || "";

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

      {/* Compliance & Licensing */}
      <section className="px-4 section-pad">
        <div className="container-prose">
          <Reveal>
            <div className="rounded-[1.5rem] border border-hairline bg-surface px-8 py-10 md:px-14 md:py-12">
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-16">
                <div className="shrink-0">
                  <p className="eyebrow">
                    <span className="gold-rule" />
                    Licensing
                  </p>
                </div>
                <div className="flex-1">
                  <h2 className="text-[22px] font-bold tracking-[-0.02em] md:text-[26px]">
                    Licensed Broker Oversight
                  </h2>
                  <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                    CityQlo works under the supervision of licensed real estate broker{" "}
                    <span className="font-semibold text-foreground">Joy Lachica</span> (PRC Lic.
                    No.&nbsp;10101 · DHSUD NCR-B-6055). Property reservations and transactions are
                    processed in coordination with our supervising broker to help ensure compliance
                    with applicable Philippine real estate regulations.
                  </p>

                  {/* Joy Lachica card */}
                  <div className="mt-8 flex items-center gap-5 rounded-[1rem] border border-hairline bg-background px-5 py-4">
                    {brokerImgSrc ? (
                      <img
                        src={brokerImgSrc}
                        alt="Joy Lachica — Licensed Real Estate Broker"
                        className="h-16 w-16 rounded-full object-cover shrink-0 border border-hairline"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-surface border border-hairline shrink-0 flex items-center justify-center text-[22px] font-bold text-muted-foreground">
                        JL
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-[15px] tracking-[-0.01em]">Joy Lachica</p>
                      <p className="text-[12px] text-muted-foreground mt-0.5">
                        Licensed Real Estate Broker
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="rounded-full bg-surface border border-hairline px-3 py-1 text-[10px] font-semibold tracking-[0.14em] uppercase text-muted-foreground">
                          PRC Lic. No. 10101
                        </span>
                        <span className="rounded-full bg-surface border border-hairline px-3 py-1 text-[10px] font-semibold tracking-[0.14em] uppercase text-muted-foreground">
                          DHSUD NCR-B-6055
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <div className="rounded-full border border-hairline px-5 py-2.5 text-[11px] font-semibold tracking-[0.16em] uppercase text-muted-foreground">
                      PRC Lic. No. 10101
                    </div>
                    <div className="rounded-full border border-hairline px-5 py-2.5 text-[11px] font-semibold tracking-[0.16em] uppercase text-muted-foreground">
                      DHSUD NCR-B-6055
                    </div>
                    <div className="rounded-full border border-hairline px-5 py-2.5 text-[11px] font-semibold tracking-[0.16em] uppercase text-muted-foreground">
                      DMCI Homes Accredited
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="surface px-4 section-pad">
        <div className="container-prose grid items-center gap-16 md:grid-cols-12 md:gap-24">
          <Reveal className="md:col-span-6">
            <div className="img-luxe img-luxe-hover overflow-hidden rounded-[1.5rem]">
              <img
                src={founderImgSrc}
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

      <ConsultationCTA />
    </>
  );
}
