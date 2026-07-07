import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "../components/site/Reveal";
import { ConsultationCTA } from "../components/site/ConsultationCTA";
import { BreadcrumbJsonLd } from "../components/site/BreadcrumbJsonLd";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — CityQlo" },
      {
        name: "description",
        content: "Privacy Policy for CityQlo. Learn how we collect, protect, and handle your data.",
      },
      { property: "og:title", content: "Privacy Policy — CityQlo" },
      { property: "og:url", content: "https://cityqlo.com/privacy" },
    ],
    links: [{ rel: "canonical", href: "https://cityqlo.com/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Privacy Policy", href: "/privacy" },
        ]}
      />
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
            <h1 className="display-1 mt-6 text-ink">Privacy Policy.</h1>
          </Reveal>
          <Reveal delay={240}>
            <p className="lede mt-8 max-w-2xl text-muted-foreground">
              Last updated: June 16, 2026. Learn how we handle your personal information in
              accordance with the Philippine Data Privacy Act of 2012 (R.A. 10173).
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
                <h2 className="text-[20px] font-bold text-ink mb-4">1. Overview</h2>
                <p>
                  CityQlo ("we", "us", or "our") operates as a real estate advisory platform. We are
                  committed to protecting your personal privacy. This Privacy Policy details how we
                  collect, use, and safeguard personal information submitted by visitors on our
                  website or through our consulting channels.
                </p>
              </div>

              <div>
                <h2 className="text-[20px] font-bold text-ink mb-4">2. Information We Collect</h2>
                <p>
                  We only collect information that you voluntarily provide to us when booking a
                  consultation or inquiring about listed developments. This includes:
                </p>
                <ul className="list-disc pl-5 mt-3 space-y-2">
                  <li>
                    <strong>Identity Information:</strong> Full name, client role (e.g., OFW,
                    investor, PH professional).
                  </li>
                  <li>
                    <strong>Contact Information:</strong> Email address, mobile telephone number,
                    Viber / WhatsApp credentials.
                  </li>
                  <li>
                    <strong>Preference Data:</strong> Project preferences, budget parameters, and
                    notes on your specific property goals.
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-[20px] font-bold text-ink mb-4">
                  3. Viber and WhatsApp Communication
                </h2>
                <p>
                  Given the standard communication methods within the Philippine real estate market,
                  we frequently coordinate consultations via Viber or WhatsApp. By providing your
                  mobile telephone number, you consent to receive direct coordination messages from
                  our accredited advisors regarding your property inquiries.
                </p>
              </div>

              <div>
                <h2 className="text-[20px] font-bold text-ink mb-4">4. How We Use Your Data</h2>
                <p>
                  We utilize collected information strictly to deliver personalized real estate
                  advisory:
                </p>
                <ul className="list-disc pl-5 mt-3 space-y-2">
                  <li>To verify eligibility and matches for specific condominium projects.</li>
                  <li>To compile and send custom cash-flow breakdowns and spreadsheets.</li>
                  <li>
                    To facilitate communication with developers like DMCI Homes on your behalf.
                  </li>
                  <li>To prevent website spam and secure our digital infrastructure.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-[20px] font-bold text-ink mb-4">
                  5. Data Retention & Protection
                </h2>
                <p>
                  Your data is securely stored on databases managed by our database partners
                  (Supabase) under strict access controls. We maintain records only for as long as
                  is necessary to support your property discovery process. We do not sell or lease
                  your personal information to third-party marketing companies.
                </p>
              </div>

              <div>
                <h2 className="text-[20px] font-bold text-ink mb-4">6. Your Rights</h2>
                <p>
                  Under the Data Privacy Act of 2012, you hold the right to request access to your
                  stored personal data, request corrections to erroneous entries, or request the
                  deletion of your lead records from our systems. If you wish to execute these
                  rights, please email us directly at <strong>hello@cityqlo.com</strong>.
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
