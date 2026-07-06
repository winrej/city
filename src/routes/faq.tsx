import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { ChevronDown, Search, HelpCircle, MessageSquare } from "lucide-react";
import { getPublicFaqs } from "../lib/api/admin.functions";
import { Reveal } from "../components/site/Reveal";
import { ConsultationCTA } from "../components/site/ConsultationCTA";
import { BreadcrumbJsonLd } from "../components/site/BreadcrumbJsonLd";

export const Route = createFileRoute("/faq")({
  loader: async ({ context }) => {
    const faqs = await context.queryClient
      .ensureQueryData({
        queryKey: ["public-faqs"],
        queryFn: () => getPublicFaqs(),
      })
      .catch(() => []);
    return { initialFaqs: faqs };
  },
  head: () => ({
    meta: [
      { title: "DMCI Homes Condo Buying FAQ | CityQlo" },
      {
        name: "description",
        content:
          "Answers to common questions about buying DMCI Homes condos in Metro Manila — the buying process, legalities, payment terms, and OFW property investment.",
      },
      { property: "og:title", content: "DMCI Homes Condo Buying FAQ | CityQlo" },
      {
        property: "og:description",
        content: "Find answers about buying process, legalities, and DMCI Homes investments in Metro Manila.",
      },
      { property: "og:url", content: "https://cityqlo.com/faq" },
    ],
    links: [{ rel: "canonical", href: "https://cityqlo.com/faq" }],
  }),
  component: FaqPage,
});

type Faq = {
  id: string;
  question: string;
  answer: string;
  category: string;
  display_order: number;
};

function FaqPage() {
  const { initialFaqs } = Route.useLoaderData();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const { data: faqs = [] } = useQuery<Faq[]>({
    queryKey: ["public-faqs"],
    queryFn: () => getPublicFaqs() as Promise<Faq[]>,
    initialData: initialFaqs as Faq[],
  });

  const faqSchema = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(f => ({
        "@type": "Question",
        "name": f.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.answer
        }
      }))
    };
  }, [faqs]);

  // Unique categories list
  const categories = useMemo(() => {
    const list = new Set(faqs.map((f) => f.category));
    return ["all", ...Array.from(list)];
  }, [faqs]);

  // Filtered FAQs based on category filter and search text
  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
      const matchesSearch =
        !search ||
        faq.question.toLowerCase().includes(search.toLowerCase()) ||
        faq.answer.toLowerCase().includes(search.toLowerCase()) ||
        faq.category.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [faqs, selectedCategory, search]);

  const countsByCategory = useMemo(() => {
    const counts: Record<string, number> = { all: faqs.length };
    for (const faq of faqs) {
      counts[faq.category] = (counts[faq.category] ?? 0) + 1;
    }
    return counts;
  }, [faqs]);

  // Visual labels for the categories section
  const categoryIcons: Record<string, string> = {
    all: "// DIRECTORY: ALL DISCOVERIES",
    "buying process": "// PROTOCOL: BUYING FLOW",
    legalities: "// PROTOCOL: REGULATORY",
    "payment options": "// FINANCES: STRUCTURES",
    "ofw investors": "// AUDIENCE: GLOBAL INVEST",
    "dmci homes": "// DEVELOPER: SPECIALIST",
  };

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "FAQ", href: "/faq" },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
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
              Resources & Support
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="display-1 mt-10 max-w-5xl text-white text-shadow-hero relative">
              Frequently Asked
              <span className="block text-primary text-shadow-sub">Questions.</span>
              
              <span
                className="absolute hidden lg:inline-block pointer-events-none opacity-80 text-[26px] tracking-wide rotate-[-3deg] select-none text-gold font-normal"
                style={{
                  fontFamily: '"Dancing Script", cursive',
                  bottom: "-10px",
                  right: "22%",
                }}
              >
                ~ Clear answers without the hype
              </span>
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <p className="lede mt-12 max-w-3xl text-zinc-300 text-shadow-sm">
              We believe in guidance, not pressure. Explore detailed information regarding the buying
              cycle, downpayment methods, foreign ownership rules, and developer highlights.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Floating Interactive Search Bar */}
      <section className="px-4 -mt-10 relative z-20">
        <Reveal className="max-w-3xl mx-auto">
          <div
            className="flex items-center gap-3 rounded-full border border-black/[0.08] bg-white/95 px-6 py-4 shadow-lift transition-all duration-300 focus-within:border-primary/40 focus-within:shadow-soft"
            style={{ backdropFilter: "blur(20px)" }}
          >
            <Search size={20} className="text-muted-foreground/60 shrink-0" />
            <input
              type="text"
              placeholder="Search by keyword (e.g. downpayment, foreigner, bank)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-[15px] text-ink placeholder-muted-foreground bg-transparent focus:outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-xs text-muted-foreground hover:text-ink cursor-pointer bg-black/5 hover:bg-black/10 rounded-full px-2.5 py-1 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </Reveal>
      </section>

      {/* Main Content Layout */}
      <section className="px-4 section-pad surface relative overflow-hidden min-h-[500px]">
        {/* Floating handwritten note */}
        <span
          className="absolute hidden xl:inline-block pointer-events-none opacity-[0.2] text-[32px] rotate-[-5deg] select-none text-gold"
          style={{
            fontFamily: '"Dancing Script", cursive',
            top: "12%",
            left: "4%",
          }}
        >
          Knowledge leads to confidence
        </span>

        <div className="container-wide grid gap-16 lg:grid-cols-12 relative z-10">
          {/* Sidebar Filters */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 lg:h-fit">
            <Reveal>
              <p className="eyebrow">
                <span className="gold-rule" />
                Filter by Topic
              </p>
              <h2 className="display-2 mt-6">Guided Categories</h2>
              <p className="mt-4 text-muted-foreground text-[15px] leading-relaxed">
                Filter answers by real estate topic to quickly narrow down your questions.
              </p>
            </Reveal>

            {/* Vertical list of categories */}
            <div className="mt-8 flex flex-col gap-2">
              {categories.map((cat, i) => {
                const isActive = selectedCategory === cat;
                const label = categoryIcons[cat.toLowerCase()] || "// TOPIC: GENERAL";
                const displayLabel = cat === "all" ? "All Questions" : cat;
                return (
                  <Reveal key={cat} delay={i * 50}>
                    <button
                      onClick={() => {
                        setSelectedCategory(cat);
                        setOpenFaq(null);
                      }}
                      className={`group w-full flex items-center justify-between rounded-xl px-5 py-4 text-left transition-all duration-500 border ${
                        isActive
                          ? "bg-background border-primary/20 text-[#1A56DB] shadow-soft"
                          : "border-transparent hover:bg-background/45 hover:border-border text-ink/75"
                      }`}
                      style={{ transitionTimingFunction: "var(--ease-luxe)" }}
                    >
                      <div className="flex flex-col">
                        <span className="font-mono text-[9px] tracking-widest text-muted-foreground/60 group-hover:text-primary/70 transition-colors uppercase">
                          {label}
                        </span>
                        <span className="text-[15px] font-bold mt-1 tracking-tight">
                          {displayLabel}
                        </span>
                      </div>
                      <span className="font-mono text-xs text-muted-foreground bg-black/5 px-2.5 py-1 rounded-full group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                        {countsByCategory[cat] ?? 0}
                      </span>
                    </button>
                  </Reveal>
                );
              })}
            </div>
          </div>

          {/* Accordion list */}
          <div className="lg:col-span-7 lg:col-start-6 flex flex-col gap-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, i) => {
                const isOpen = openFaq === faq.id;
                return (
                  <Reveal key={faq.id} delay={i * 50}>
                    <div
                      className={`border rounded-2xl transition-all duration-500 overflow-hidden ${
                        isOpen
                          ? "border-primary/20 bg-background shadow-soft"
                          : "border-border bg-background/40 hover:bg-background hover:border-border-hover"
                      }`}
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                        className="flex w-full items-center justify-between px-6 py-5 md:px-8 text-left focus:outline-none"
                        aria-expanded={isOpen}
                      >
                        <div className="flex flex-col gap-1.5 pr-4">
                          <span className="font-mono text-[9.5px] font-semibold tracking-[0.2em] text-[#1A56DB] uppercase">
                            {faq.category}
                          </span>
                          <span className="text-[18px] font-bold tracking-tight text-ink">
                            {faq.question}
                          </span>
                        </div>
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-all duration-500 ${
                            isOpen ? "bg-[#1A56DB] text-white border-[#1A56DB] rotate-180" : ""
                          }`}
                        >
                          <ChevronDown size={16} />
                        </div>
                      </button>

                      <div
                        className="transition-all duration-500 ease-in-out"
                        style={{
                          maxHeight: isOpen ? "400px" : "0px",
                          opacity: isOpen ? 1 : 0,
                          visibility: isOpen ? "visible" : "hidden",
                        }}
                      >
                        <div className="px-6 pb-6 md:px-8 md:pb-8 border-t border-hairline pt-5 mt-1">
                          <p className="text-[15.5px] leading-relaxed text-muted-foreground font-medium">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })
            ) : (
              <Reveal>
                <div className="border border-dashed border-border rounded-2xl p-12 text-center bg-background/50">
                  <div className="mx-auto w-12 h-12 rounded-full bg-black/5 flex items-center justify-center text-muted-foreground mb-4">
                    <HelpCircle size={22} />
                  </div>
                  <h3 className="text-[17px] font-bold text-ink">No matching answers found</h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                    Try searching for different terms or reset your filters. If you still can't find
                    what you need, get in touch below.
                  </p>
                  <button
                    onClick={() => {
                      setSearch("");
                      setSelectedCategory("all");
                    }}
                    className="mt-5 inline-flex items-center justify-center rounded-full bg-ink px-5 py-2 text-xs font-semibold text-white hover:bg-black/95 transition-all"
                  >
                    Reset filters
                  </button>
                </div>
              </Reveal>
            )}

            {/* Custom Question Box */}
            <Reveal delay={200}>
              <div className="border border-gold/25 rounded-2xl p-8 bg-[#fdfaf2] flex flex-col md:flex-row md:items-center justify-between gap-6 mt-6">
                <div>
                  <div className="flex items-center gap-2 text-gold">
                    <MessageSquare size={16} />
                    <span className="font-mono text-[9px] tracking-widest font-semibold uppercase">
                      ADVISORY CORNER
                    </span>
                  </div>
                  <h3 className="text-[19px] font-bold text-ink mt-2">Have a unique scenario?</h3>
                  <p className="mt-2 text-[14.5px] text-muted-foreground leading-relaxed max-w-lg">
                    Whether you are computing loan amortizations or assessing specific building
                    amenities, we can build custom scenarios for you.
                  </p>
                </div>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-[#1A56DB] hover:bg-[#1544C0] px-6 py-3 text-[13px] font-semibold text-white transition-all shrink-0 hover:shadow-soft"
                >
                  Ask us directly
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <ConsultationCTA />
    </>
  );
}
