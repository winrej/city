import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "../components/site/Reveal";
import { ConsultationCTA } from "../components/site/ConsultationCTA";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — CityQlo" },
      {
        name: "description",
        content: "Terms of Service for CityQlo. Learn about our advisory service rules and policies.",
      },
      { property: "og:title", content: "Terms of Service — CityQlo" },
      { property: "og:url", content: "https://cityqlo.com/terms" },
    ],
    links: [{ rel: "canonical", href: "https://cityqlo.com/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <>
      {/* Light Clean Header */}
      <section className="px-4 pb-20 pt-32 md:pt-48 bg-background">
        <div className="container-prose">
          <Reveal>
            <p className="eyebrow">
              <span className="gold-rule" />
              Legal Documents
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="display-1 mt-6 text-ink">
              Terms of Service.
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <p className="lede mt-8 max-w-2xl text-muted-foreground">
              Last updated: June 16, 2026. Please read these terms carefully before utilizing our real estate advisory platform.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Main Text Content */}
      <section className="px-4 pb-24 surface">
        <div className="container-prose">
          <Reveal>
            <div className="rounded-[1.5rem] border border-border bg-background p-8 md:p-16 space-y-10 text-[16px] leading-relaxed text-muted-foreground">
              <div>
                <h2 className="text-[20px] font-bold text-ink mb-4">1. Acceptance of Terms</h2>
                <p>
                  By accessing and browsing this website, or by engaging in consultations with us, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please discontinue use of our site and advisory services.
                </p>
              </div>

              <div>
                <h2 className="text-[20px] font-bold text-ink mb-4">2. Nature of Services</h2>
                <p>
                  CityQlo operates as an independent property advisory group. We provide market analysis, project短lists, cash-flow estimations, and coordinates with accredited developers (such as DMCI Homes). We do not act as the primary developer corporation, nor do we issue property deeds or directly handle payment holdings. All final financial and reservation contracts are entered into directly between the client and the respective developer.
                </p>
              </div>

              <div>
                <h2 className="text-[20px] font-bold text-ink mb-4">3. Accuracy of Listings</h2>
                <p>
                  While we strive to keep property descriptions, starting prices, unit configurations, and amenities updated and accurate, pricing and availability are subject to rapid shifts by developer inventory divisions. Information listed on this platform does not constitute a formal, binding financial quote. Formal computations are verified upon unit reservation with the developer.
                </p>
              </div>

              <div>
                <h2 className="text-[20px] font-bold text-ink mb-4">4. Client Obligations</h2>
                <p>
                  Clients seeking consultation or submitting details agree to provide truthful, accurate contact details (including legal name and mobile number). Any automated form submissions, crawl systems, or attempts to disrupt portal operations are strictly prohibited.
                </p>
              </div>

              <div>
                <h2 className="text-[20px] font-bold text-ink mb-4">5. Limitation of Liability</h2>
                <p>
                  CityQlo and its advisors shall not be liable for any indirect, consequential, or economic damages arising from investment choices, property market fluctuations in Metro Manila, or developer project delays. Real estate investments contain standard market risks, and clients are encouraged to perform their own financial due diligence.
                </p>
              </div>

              <div>
                <h2 className="text-[20px] font-bold text-ink mb-4">6. Intellectual Property</h2>
                <p>
                  All content, display text, custom scripts, layout flow designs, and logos featured on this website are the intellectual property of CityQlo. Brand assets of partner developers (e.g., DMCI Homes logos) belong to their respective corporations and are displayed under proper partner accreditations.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <ConsultationCTA />
    </>
  );
}
