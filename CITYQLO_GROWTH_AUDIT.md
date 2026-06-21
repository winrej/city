# CityQlo Growth Audit

**Prepared as:** Product strategy · SEO architecture · CRO · UX research · PH real-estate growth
**Scope:** Evidence-based audit of the live CityQlo implementation (TanStack Start + React + Supabase).
**Date:** June 2026
**Nature:** This is a **business growth audit**, not a code review. Every finding below is tied to what the codebase actually ships today.

> **How to read this:** Scores are diagnostic, not vanity. A 70 means "functional, monetizable, but leaving money on the table." The roadmap in Sections 13–14 is the part to act on.

---

## Section 1 — Executive Summary

CityQlo is a **property-advisory** brand (not a raw listings portal) positioned for Filipino professionals, OFWs, and investors buying DMCI Homes condos in Metro Manila. The platform is unusually well-built for its stage: dynamic DB-driven SEO, structured data, a real lead pipeline (`inquiries` table with status workflow), multiple conversion surfaces, and a polished, cinematic UI. The gap between **how good it looks** and **how much it converts/ranks** is the central story of this audit.

### Scorecard

| Dimension | Score | One-line verdict |
|---|---|---|
| **Overall** | **67 / 100** | Premium foundation, under-monetized. Strong build, weak distribution & proof. |
| SEO | 68 / 100 | Excellent technical base; thin content depth, weak interlinking, no programmatic scale. |
| Conversion | 72 / 100 | Many capture surfaces; no lead magnet, friction in CTA wording, over-CTA'd in places. |
| Trust | 58 / 100 | **Weakest pillar.** Founder story is good; hard credibility (licenses, reviews, named team) missing. |
| Mobile Experience | 75 / 100 | Best pillar. BottomNav, Messenger FAB, sticky bars, exit intent. Long pages risk scroll fatigue. |
| Lead Generation | 66 / 100 | Solid capture + mini-CRM; single-channel, no nurture, no magnet, no gated value. |

### Biggest strengths
1. **Technical SEO is genuinely strong** — DB-driven meta/canonicals, `Organization` + `WebSite`/`SearchAction` JSON-LD in `__root.tsx`, dynamic sitemap, `RealEstateListing`/`FAQPage`/`Breadcrumb` schema, and a new long-form pillar page (`/sonora-garden-residences`).
2. **Real conversion infrastructure** — `createLead` → Supabase `inquiries` with status (`new/contacted/qualified/closed/spam`), honeypot + timing anti-spam, exit-intent modal, project-specific lead forms, and a Messenger FAB.
3. **Brand & UX quality** — cinematic homepage, founder narrative, accredited-partner framing. It *feels* trustworthy and premium, which is rare in PH real estate.

### Biggest weaknesses
1. **Trust is asserted, not proven.** No visible PRC/DHSUD/REBL license numbers, no third-party reviews (Google/Facebook ratings), no named team, no case studies. After removing the (correctly deleted) fake "12yr / ₱2B / 98%" stats, the homepage now has a **proof vacuum** that nothing has filled.
2. **Content depth doesn't match SEO ambition.** ~86 DMCI properties exist in seed data, but only a handful are exposed with depth. No location pages, no developer hub, no comparison pages, weak guides↔projects interlinking. The engine is built; there's almost no fuel.
3. **No lead magnet / value exchange.** Every path is "talk to us." The "Download Brochure / Floor Plans" buttons are decorative (they scroll to a form, nothing is delivered). There is no price-list PDF, no computation tool, no buyer's checklist to trade for an email.
4. **CTA incoherence.** Wording oscillates between low-friction ("Get Price List") and high-friction/over-promising ("Get **Free Computation**", "Book Consultation"). Some project surfaces stack 5–6 CTAs, diluting the one action that matters.

---

## Section 2 — First Impression Audit

Based on the actual homepage (`src/routes/index.tsx`) and global chrome (`Nav`, `Footer`, `BottomNav`, `FloatingMessenger`).

**What CityQlo appears to do within 5 seconds:**
Hero reads **"Find the right property. Not just another condo."** with a lede about smarter decisions for Filipino professionals/investors/OFWs, over a cinematic Metro Manila backdrop, with the DMCI Homes logo in the nav. A visitor correctly infers: *a curated, advisory-led way to buy a (DMCI) condo in Metro Manila.* That's a clear, differentiated promise — better than the median listing site.

**What is unclear:**
- **Who CityQlo is.** Brokerage? Accredited seller? Aggregator? The DMCI logo implies affiliation but the relationship isn't stated in the fold.
- **Is it free?** Advisory businesses live or die on "do I pay you?" — not answered early.
- **Inventory scope.** "Not just another condo" implies selectivity, but a first-timer can't tell if there are 5 or 500 options.

**What creates trust:**
- Cinematic, high-craft design (premium signal).
- DMCI Homes logo in the nav (borrowed authority).
- Founder section with a real portrait and a decade-of-experience narrative.
- DB-backed testimonials with star ratings.

**What creates doubt:**
- **No hard credentials** anywhere in the fold or footer (license #, office address beyond "Metro Manila, Philippines", real phone).
- **Generic contact** (`hello@cityqlo.com`, no visible landline/office) reads small.
- **The post-removal proof gap** — the homepage used to show numbers (now correctly gone for being false); nothing credible replaced them, so the "Why CityQlo" claim ("Guidance you can build a decade on") is unsupported.

**First-impression score: 70/100** — strong promise and aesthetics, undermined by missing legitimacy markers.

---

## Section 3 — Filipino Buyer Persona Audit

Each persona scored on a 100 scale (blend of conversion likelihood, trust, and friction). Evidence drawn from the actual flows: homepage → properties/projects → lead form / Messenger.

### First-Time Homebuyer — **Score: 62/100**
- **Conversion likelihood:** Medium. The advisory framing reassures, but first-timers need hand-holding the site mostly defers to a form.
- **Trust level:** Medium. Founder story helps; absence of license/affiliation specifics hurts most for this anxious segment.
- **Friction points:** "Free Computation" sounds like a commitment; no glossary of terms (RFO, pre-selling, DP, amortization explained only inside the new Sonora pillar).
- **Missing info:** Total cost of ownership, step-by-step "how buying works", financing eligibility.
- **Why they'd leave:** Fear/overwhelm + no self-serve education hub.
- **Why they'd convert:** "Zero pressure / objective guidance" tagline + Messenger feels safe.

### OFW Buyer — **Score: 71/100**
- **Conversion likelihood:** High. This is CityQlo's sweet spot; copy explicitly addresses OFWs, Viber/WhatsApp emphasized, role dropdown includes "OFW".
- **Trust level:** Medium-high. Remote buyers need *more* proof (they can't visit) — the trust gap bites here.
- **Friction points:** Timezone/async handled via Messenger; but no explicit "we handle remote purchase via SPA" reassurance outside the Sonora page.
- **Missing info:** Remote-purchase process, document checklist, currency/financing for overseas income.
- **Why they'd leave:** Can't verify legitimacy from abroad.
- **Why they'd convert:** Viber-first contact + advisory tone + DMCI association.

### Property Investor — **Score: 66/100**
- **Conversion likelihood:** Medium-high. `/why-invest` exists with a thesis; but no live yield data, ROI calculator, or comparables.
- **Trust level:** Medium. Investors want numbers; the site is light on hard data (and burned by previously-fake stats).
- **Friction points:** No filtering by yield, no rental-comp data, "Compare coming soon".
- **Missing info:** Rental yields, price/sqm trends, capital-appreciation evidence, exit liquidity.
- **Why they'd leave:** No data to underwrite a decision.
- **Why they'd convert:** Clear investment narrative + curated DMCI focus.

### Growing Family — **Score: 64/100**
- **Conversion likelihood:** Medium. Project pages cover amenities, location (schools/hospitals), unit sizes.
- **Trust level:** Medium. Family buyers are deliberate; need safety/community proof.
- **Friction points:** No "family-friendly" filter; 2BR/3BR discovery is generic.
- **Missing info:** School proximity at portfolio level, floor-plan walkthroughs, neighborhood safety.
- **Why they'd leave:** Can't quickly find the right-sized, right-location home.
- **Why they'd convert:** Resort-amenity framing + advisory reassurance.

### High-Income Professional — **Score: 69/100**
- **Conversion likelihood:** High. Premium design matches their expectation; "decision, not just a condo" resonates.
- **Trust level:** Medium-high. Aesthetics buy credibility; lack of named advisors/credentials caps it.
- **Friction points:** Time-poor; wants concierge, gets a form.
- **Missing info:** Who exactly advises them; response SLA beyond "within a few hours".
- **Why they'd leave:** Feels like a lead funnel, not a concierge.
- **Why they'd convert:** Brand quality + low-pressure positioning.

### Retiree — **Score: 52/100**
- **Conversion likelihood:** Low-medium. Underserved persona.
- **Trust level:** Low-medium. Needs maximum legitimacy; gets minimal hard proof. Small fonts / dense long pages tax readability.
- **Friction points:** Reading experience on long cinematic pages; tech-forward Messenger may not suit.
- **Missing info:** Single-level living, accessibility, payment terms for fixed-income/pensioners, phone-first contact.
- **Why they'd leave:** Can't easily call a human; trust deficit.
- **Why they'd convert:** If a prominent phone number + reassurance existed (it largely doesn't).

### Research-Heavy Buyer — **Score: 60/100**
- **Conversion likelihood:** Medium. The new Sonora pillar is *exactly* what this persona wants — but it exists for **one** property only.
- **Trust level:** Medium. Rewards depth; most pages are thin vs. the Sonora exemplar.
- **Friction points:** No comparison tool, no downloadable specs, limited guides, weak interlinking to dig deeper.
- **Missing info:** Side-by-side comparisons, complete spec sheets, independent analysis across the portfolio.
- **Why they'd leave:** Hits the bottom of available depth fast (outside Sonora).
- **Why they'd convert:** If every project had Sonora-level depth, this persona converts highest.

### Mobile-First Buyer — **Score: 76/100**
- **Conversion likelihood:** High. Best-served persona: BottomNav, Messenger FAB, mobile sticky lead bar on projects, bottom-sheet filters.
- **Trust level:** Medium (same trust gaps apply).
- **Friction points:** Long pages = scroll fatigue; multiple floating elements (BottomNav + Messenger) compete at the bottom edge.
- **Missing info:** Same as desktop.
- **Why they'd leave:** Thumb-zone clutter; long scroll to forms.
- **Why they'd convert:** Frictionless tap-to-Messenger.

| Persona | Score | Priority to fix |
|---|---|---|
| Mobile-First | 76 | Maintain |
| OFW | 71 | **High** (highest LTV, fixable with trust + remote-process content) |
| High-Income Pro | 69 | Medium |
| Investor | 66 | **High** (needs data/tools) |
| Growing Family | 64 | Medium |
| First-Timer | 62 | **High** (needs education hub) |
| Research-Heavy | 60 | High (scale the Sonora pattern) |
| Retiree | 52 | Low-medium (niche, but easy trust wins help all) |

---

## Section 4 — Homepage Audit

Sections in render order (`src/routes/index.tsx`): **1) Hero → 2) "A different perspective" → 3) Why-Invest pillars → 4) Featured Opportunities → 5) "Why CityQlo" → 6) Founder (dark) → 7) Testimonials → 8) Consultation CTA → 9) Lifestyle band.**

| Element | Assessment | Recommendation |
|---|---|---|
| **Hero** | Clear, premium, differentiated promise. No proof, no scope, no "is it free". | Add a one-line credibility strip under the lede (license/affiliation + "free advisory"). Add a primary + secondary CTA in-fold ("Browse condos" / "Talk to an advisor"). |
| **Headlines** | "Find the right property. Not just another condo." is strong brand copy. "Guidance you can build a decade on" is unsupported. | Keep hero. Attach evidence to the decade claim (founder track record, # families helped — **only if true**). |
| **CTAs** | Mostly "Book Consultation" (high friction). One dominant action repeated. | Add a **low-friction entry** ("See the price list" / "Browse RFO units") for not-ready-to-talk visitors. |
| **Trust signals** | Founder + testimonials + DMCI logo. No licenses, no review aggregics, post-fake-stat vacuum. | Insert an **honest** proof band (accreditation #, partner badges, Google rating embed). See §9. |
| **Property discovery** | "Featured Opportunities" links to projects; full browse one click away. Good. | Surface 6–9 featured + a location quick-filter on homepage to pull mobile users into discovery faster. |
| **Lead-gen** | Consultation CTA mid/bottom; Messenger FAB; nav CTA. | Add a **lead magnet** offer here (e.g., "Get the 2026 DMCI price list" → email). Highest-ROI homepage change. |

**Homepage score: 70/100.**

---

## Section 5 — Navigation Audit

**Primary nav (`Nav.tsx`):** Properties · Why Invest · Guides · [More: About, FAQ, Careers] · **Contact** (CTA). Logo + DMCI logo. Socials: FB, IG, TikTok, LinkedIn, YouTube.
**Footer:** Explore (Properties, Why Invest, Guides, FAQ) · Company (About, Careers, Contact) · Legal (Privacy, Terms) · Metro Manila + `hello@cityqlo.com` + Book a Consultation.
**Mobile BottomNav:** Home · Browse · [center Search FAB] · Guides · Inquire.

| Dimension | Finding |
|---|---|
| **Menu structure** | Clean, conventional, not overloaded. Good. |
| **Information hierarchy** | Sound: revenue pages (Properties, Why Invest) primary; support (About/FAQ/Careers) demoted. |
| **Discoverability** | **Problem:** the new `/sonora-garden-residences` pillar is **not in any menu** — only reachable via internal links/sitemap. High-value page, semi-orphaned. |
| **User flow** | Properties → Project → Lead is coherent. Guides is a dead-end (no path back to inventory). |

**Wasted navigation space:** Careers sits in primary-adjacent nav despite near-zero revenue intent. The nav CTA goes to `/contact` (a generic form) rather than the highest-intent action (browse/price list).

**Hidden content:** The Sonora pillar; the FAQ (not linked from project/property pages where questions actually arise); guides not cross-linked from projects.

**Opportunities:**
1. Add a **"Buying Guide" / "Resources"** nav entry that houses pillar pages + guides (gives the Sonora-style pages a home and a cluster).
2. Point the nav CTA at a **two-option** menu (Browse vs Talk) instead of only `/contact`.
3. Add contextual links: FAQ from project pages, guides from project pages (the project→pillar back-link added recently is the right pattern — extend it).

**Navigation score: 72/100.**

---

## Section 6 — Project Pages Audit

Project pages (`src/routes/projects/$slug.tsx`) render generically from a DB `layout_flow` (hero, emotional-hook, overview, highlights, units, pricing, amenities, location, testimonials, FAQ, media, lead-capture, related). They carry `RealEstateListing` JSON-LD and a `BreadcrumbList`.

| Criterion | Assessment |
|---|---|
| **Search-intent coverage** | Partial. Covers "{project} price / units / amenities / location" implicitly, but copy is templated and shallow vs. a dedicated guide. |
| **Buyer-intent coverage** | Good for *ready* buyers (pricing, lead form, viewing CTA, Viber/call). Weak for *researching* buyers (no comparisons, no financing depth, thin FAQ). |
| **Content depth** | Templated/generic. The DB-driven sameness across projects is an SEO liability (near-duplicate structure, low unique word count). |
| **Schema** | `RealEstateListing` with `AggregateOffer` (lowPrice, offerCount) + breadcrumb. **Missing:** geo coordinates, `numberOfRooms`, per-unit `Offer`, `Review`/`AggregateRating`, `ImageObject`. |
| **Conversion** | **Strong.** Sticky desktop widget, mobile bottom bar, exit-intent modal, pricing-table CTA, lead form, call/Viber. Possibly *over*-CTA'd (5–6 actions). |

**Would a project page outperform the official DMCI page?**

- **For a templated project page: No.** It's thinner and more generic than DMCI's own. It wins only on UX polish and lead-capture aggressiveness, not on content authority or search depth.
- **For the Sonora pillar (`/sonora-garden-residences`): Yes, plausibly.** ~5,600 words, FAQ + Residence + Article schema, tables, financing, due-diligence, honest pros/cons, and now bi-directional interlinking with the project page. That's the page that out-ranks DMCI/Lamudi.

**The strategic takeaway:** the *pillar pattern* is the winner; the *templated project page* is the converter. The 12-month play is to give the top 8–12 projects the Sonora treatment and let templated pages handle the long tail.

**Project pages score: 64/100** (templated) — the Sonora exemplar would score ~85.

---

## Section 7 — SEO Architecture Audit

**Foundation (verified in code):**
- Root DB-driven SEO + `DEFAULT_SEO` fallback; full OG/Twitter; `Organization` + `WebSite`/`SearchAction` JSON-LD (`__root.tsx`).
- Per-route `head()` with canonicals is present across the public surface — verified on `/`, `/properties`, `/projects/$slug`, `/guides/*`, `/about`, `/faq`, `/why-invest`, `/contact`, `/careers`, and `/sonora-garden-residences`. Metadata coverage is effectively complete.
- Dynamic `sitemap.xml` (static + published projects + published blogs); `robots.txt` allows all + declares sitemap.
- Schema in use: `Organization`, `WebSite`, `RealEstateListing`, `BreadcrumbList`, `FAQPage`, `Residence`, `Article`.

> **Correction note:** An earlier draft of this audit flagged `/why-invest`, `/contact`, and `/careers` as missing `head()`/canonical. On direct verification that was false — all three ship complete metadata. The finding has been removed. Metadata is **not** a weak spot; content volume and interlinking are.

### Critical issues
1. **Near-duplicate templated project pages** — low unique content + identical structure across ~dozens of slugs risks thin-content suppression. Only the Sonora pillar has real depth.
2. **No location/programmatic pages** — ~86 properties across 25+ locations in seed data, but zero `/condos-in-{city}` pages. The single biggest organic-traffic gap.
3. **Project pages emit no `FAQPage` schema** — they render FAQ content (`faqSec`) but the JSON-LD is `RealEstateListing` only. Adding `FAQPage` unlocks AI Overviews / FAQ rich results across the whole portfolio (the Sonora pillar already does this; projects don't).

### Medium issues
4. **Sitemap lacks `<lastmod>`**, and omits `/careers`, `/privacy`, `/terms`.
5. **Weak interlinking / no topic clusters** — guides don't link to projects; FAQ is orphaned; pillar pages aren't grouped.
6. **Schema gaps** — no `Review`/`AggregateRating` (testimonials exist!), no `Person` (founder/team), no `ImageObject`, no per-unit `Offer`/geo on projects.
7. **Query-param duplication risk** — `/properties?focus=…`/filter params not canonicalized.

### Opportunities
- **Programmatic location hub:** `/condos-in-las-pinas`, `/dmci-condos-makati`, etc., templated from existing property data → 25–40 indexable pages targeting high-intent local queries.
- **Developer hub:** `/dmci-homes` aggregator (all DMCI projects) — captures brand searches.
- **Comparison pages:** `/sonora-vs-{x}` — long-tail, low-competition, high-intent.
- **AI Overview readiness:** the Sonora pattern (quick-answer box + FAQPage + entity-rich H2s) is exactly what wins AI Overviews — replicate it.
- **Entity SEO:** strengthen the `Organization` entity (sameAs, founder `Person`, awards) so Google trusts CityQlo as a named entity.

**SEO score: 68/100.**

---

## Section 8 — Content Strategy Audit

**Existing:** Homepage, `/why-invest` (thesis), `/about` (founder), `/faq` (DB-driven, FAQPage schema), `/guides` (Supabase `blogs`, markdown — note the renderer has **no table support**), project pages, and one pillar (`/sonora-garden-residences`).

**Missing (high-value):** location pages, developer hub, comparison pages, financing/computation guides, OFW remote-buying guide, neighborhood guides, per-project pillars.

**Content clusters to build (priority-ordered):**

| Priority | Cluster | Example pages | Why |
|---|---|---|---|
| **P0** | **Project pillars** (scale Sonora) | Top 8–12 DMCI projects, Sonora-style | Proven to out-rank DMCI/Lamudi; converts research-heavy + OFW buyers. |
| **P0** | **Location pages** | `/condos-in-las-pinas`, `/condos-in-pasig`, `/condos-in-quezon-city` | Programmatic, high-intent local search; uses existing data. |
| **P1** | **Investment/financing** | "DMCI payment terms explained", "Bank vs Pag-IBIG vs in-house", "Rental yields in Metro Manila 2026" | Serves investors (data gap) + first-timers (education). |
| **P1** | **OFW hub** | "How OFWs buy PH condos remotely (SPA guide)", "Financing on overseas income" | Highest-LTV persona, currently under-served. |
| **P2** | **Comparison pages** | "Sonora vs {X}", "RFO vs pre-selling", "DMCI vs {developer}" | Long-tail, low competition, decision-stage. |
| **P2** | **Developer hub** | `/dmci-homes` | Captures brand queries; anchors topical authority. |
| **P3** | **Neighborhood/lifestyle** | "Living in Las Piñas", schools/transit guides | Top-funnel, supports location cluster. |

**Authority building:** interlink everything into clusters (pillar ↔ projects ↔ location ↔ guides ↔ FAQ), add author/`Person` schema to guides, and publish a consistent guide cadence. The blog renderer should gain **table support** (currently can't render comparison tables in markdown) before scaling comparison content there — or keep comparisons as dedicated routes like Sonora.

**Content score: 55/100** (great template, almost no volume).

---

## Section 9 — Trust & Credibility Audit

**Exists:** founder story + portrait (`/about`, homepage §6), DB-driven testimonials with star ratings, DMCI Homes logo (accredited-partner framing), social links (FB/IG/TikTok/LinkedIn/YouTube), "zero pressure / objective guidance" positioning, project trust badges ("Official Developer Price", "No Hidden Fees", "Reply within 24 hours").

**Missing (the costly gaps):**
- **No PRC / DHSUD / REBL license or accreditation numbers** anywhere — table stakes for PH real estate legitimacy.
- **No third-party reviews** (Google Business rating, Facebook recommendations) — only first-party testimonials, which buyers discount.
- **No named team / advisor profiles** — "an advisor will contact you" but no human is shown.
- **No verifiable company facts** — after correctly removing the fake "12yr/₱2B/98%" stats, nothing honest replaced them. Office address is just "Metro Manila".
- **No media mentions, awards, or case studies.**
- **No data backing investment claims.**

### Why a visitor might hesitate to submit a lead — *every* reason
1. Can't confirm CityQlo is a licensed/legitimate brokerage (no license #).
2. Relationship with DMCI is implied, not stated — "are they official or just using the logo?"
3. No third-party reviews to corroborate testimonials.
4. No named, real human advisor — feels like an anonymous lead funnel.
5. Generic email + no landline/office → "is this a small/fly-by-night operation?"
6. Fear of spam/sales pressure after sharing phone/Viber.
7. Unclear if the service is free or commissioned.
8. No privacy reassurance near the form (what happens to my data?).
9. Investors: no data to justify the decision, so no reason to engage yet.
10. OFWs: can't verify legitimacy from abroad; high-stakes remote trust.
11. "Free Computation" sounds like it triggers obligation/hard sell.
12. Removed-stats vacuum → "Why CityQlo?" claim feels unsubstantiated.

**Trust score: 58/100 — the highest-leverage area in the entire audit.** Fixing trust lifts *every* persona and *every* conversion surface simultaneously.

---

## Section 10 — Conversion Audit

**Forms:** Consultation (`ConsultationCTA` — name, email, phone, role, message; honeypot `company` + 2.5s timing; success state + toast). Project lead (`LeadCaptureSection` — name, mobile, email, interested-in; "Get Free Computation"). Exit-intent modal (name, mobile). All write to `inquiries`.

**CTA placement:** Homepage (nav + mid + footer), Properties (cards, hero, CTA), Projects (sticky widget, mobile bar, exit modal, pricing CTA, lead form), Messenger FAB sitewide.

| Finding | Detail |
|---|---|
| **Strength** | Multiple capture paths; minimal fields; anti-spam without CAPTCHA friction; mobile-optimized; context-aware ("interested in" unit type). |
| **Decision friction** | "Free Computation" / "Book Consultation" imply commitment; no low-stakes alternative on some surfaces. |
| **Lead magnet** | **None.** "Download Brochure/Floor Plans" buttons don't deliver a file — they scroll to a form. This is a broken value-exchange and arguably erodes trust. |
| **CTA overload** | Project pages stack 5–6 CTAs; choice paralysis dilutes the primary action. |
| **No nurture** | Single touch (form → human). No email capture for not-ready buyers, no drip. |

### Quick wins (days)
1. Reword "Get Free Computation" → **"See the price & sample computation"** (outcome, not obligation). *Est. +5–10% form CTR.*
2. Add a privacy/no-spam microline under every form ("We'll only message you about this property. No spam."). *Est. +3–8% completion.*
3. Reduce project-page CTAs to **one primary + one secondary**. *Est. +5% on primary action.*
4. Make the Messenger FAB and BottomNav not collide on mobile (already mitigated — verify on small devices).

### High-impact opportunities (weeks)
5. **Ship a real lead magnet** — auto-deliver the "2026 DMCI price list & computation" PDF in exchange for email. Turns the dead download buttons into the #1 lead source. *Est. +20–40% total lead volume.*
6. **Two-tier CTA strategy** — "Browse / Get price list" (low friction, email) vs "Talk to an advisor" (high intent). Capture the 90% not ready to talk. *Est. +15–25% captured leads.*
7. **Add trust elements adjacent to forms** (license #, review snippet, advisor face). *Est. +10–20% form completion.*

**Conversion score: 72/100.**

---

## Section 11 — Mobile Experience Audit (assume 90% mobile)

**Infrastructure:** `BottomNav` (Home/Browse/Search-FAB/Guides/Inquire), `FloatingMessenger` FAB, project mobile sticky lead bar, bottom-sheet filters, responsive layouts, safe-area handling.

| Section | Mobile score | Note |
|---|---|---|
| Global chrome (BottomNav/Messenger) | 82 | Excellent thumb-reach; watch bottom-edge crowding (two floating systems). |
| Homepage | 74 | Cinematic but long; CTAs reachable; needs an earlier low-friction CTA. |
| Properties browse | 78 | Bottom-sheet filters are great; search FAB smart. |
| Project pages | 76 | Sticky lead bar strong; **scroll fatigue** on very long pages; 5–6 CTAs cramped. |
| Sonora pillar | 70 | Comprehensive = very long on mobile; needs sticky TOC / "jump to price". |
| Forms | 75 | Few fields, good. Add input `type`/`inputmode` for phone/email keyboards if not set. |
| Reading experience | 68 | Some small/low-contrast type on long pages taxes retirees and skimmers. |

**Key mobile fixes:** sticky "Get price list" mini-bar on long pillar pages; a persistent "jump to price/FAQ" affordance; verify thumb-zone separation of Messenger vs BottomNav; bump body contrast/size on dense sections.

**Mobile score: 75/100 — the strongest pillar.**

---

## Section 12 — Competitor Gap Analysis

| Competitor | They have that CityQlo lacks | CityQlo advantage over them |
|---|---|---|
| **DMCI Homes (official)** | Authority as the source; full inventory; brand trust; official price lists. | Better UX; honest/advisory tone; AI-Overview-ready pillar content; faster lead response framing. |
| **Lamudi** | Massive inventory & traffic; review system; agent network; brand recognition. | Curation & advisory (vs. noisy marketplace); deeper single-property content (Sonora pillar). |
| **DotProperty** | Scale, multi-developer breadth, portal SEO footprint. | Niche focus (DMCI), premium brand, editorial depth potential. |
| **Property24** | Listing volume, map search, established SEO. | Decision-support positioning, cleaner UX, content authority play. |
| **Hoppler** | Brokerage credibility, agent profiles, managed service reputation. | Modern digital experience, content/SEO engine, OFW-first messaging. |

**CityQlo's missing features vs the field:** map-based search, saved searches/favorites, working comparison tool ("coming soon"), agent/advisor profiles, third-party reviews, mortgage/yield calculators, broad multi-developer inventory.

**CityQlo's genuine competitive advantages:** (1) advisory positioning vs. commodity listings, (2) UX/brand craft, (3) the pillar-content engine that can out-rank everyone on specific high-intent terms, (4) OFW-first messaging + Viber/Messenger-native contact.

**Strategic read:** Don't fight portals on inventory breadth — **win on depth + trust + intent.** Own "{DMCI project} price/review" and "{city} DMCI condo" SERPs with pillar + location content. That's a war CityQlo can actually win.

---

## Section 13 — Revenue Impact Roadmap

### High Impact — Expected ROI: **Very High**

| Recommendation | Expected Impact | Difficulty | Priority |
|---|---|---|---|
| Ship a real lead magnet (auto-delivered price-list/computation PDF for email) | +20–40% lead volume; fixes broken download UX | Medium | P0 |
| Add hard trust signals (license #, third-party reviews, named advisors) sitewide | +10–20% form completion; lifts all personas | Low–Med | P0 |
| Programmatic **location pages** (`/condos-in-{city}`) from existing data | 25–40 indexable high-intent pages; major organic lift | Medium | P0 |
| Scale the **Sonora pillar pattern** to top 8–12 projects | Out-ranks DMCI/Lamudi on money terms; serves research/OFW buyers | Med–High | P0 |
| Emit `FAQPage` schema on project pages (FAQ content exists; schema doesn't) | AI Overviews / FAQ rich results across the whole portfolio; quick | Low | P0 |

### Medium Impact — Expected ROI: **Medium**

| Recommendation | Expected Impact | Difficulty | Priority |
|---|---|---|---|
| Two-tier CTA (low-friction browse/price vs talk) | +15–25% captured leads | Medium | P1 |
| Build interlinking clusters (guides↔projects↔location↔FAQ) | Compounding SEO + deeper sessions | Medium | P1 |
| Add `Review`/`AggregateRating` + `Person` (founder) schema | Rich results, entity trust | Low | P1 |
| OFW remote-buying hub + investor data/calculators | Converts two high-value personas | Med–High | P1 |
| Reduce CTA overload on project pages | +5% primary-action rate | Low | P1 |
| Sitemap `<lastmod>` + add missing routes | Crawl efficiency | Low | P1 |

### Low Impact — Expected ROI: **Low**

| Recommendation | Expected Impact | Difficulty | Priority |
|---|---|---|---|
| Map-based property search | Nice-to-have parity | High | P3 |
| Saved searches / favorites | Retention, minor | Medium | P3 |
| Demote/relocate Careers in nav | Marginal clarity | Low | P3 |
| YouTube/video schema + tours | Incremental engagement | Medium | P3 |
| Markdown table support in blog renderer | Enables comparison content in blog (or skip—use routes) | Medium | P2 |

---

## Section 14 — Top 50 Recommendations

Ranked by business impact (highest first). Impact/Effort: H/M/L.

| Rank | Recommendation | Impact | Effort | Priority |
|---|---|---|---|---|
| 1 | Auto-delivered lead magnet (price list/computation PDF for email) | H | M | P0 |
| 2 | Display PRC/DHSUD/accreditation license numbers sitewide | H | L | P0 |
| 3 | Embed third-party reviews (Google/Facebook rating) | H | M | P0 |
| 4 | Scale Sonora-style pillars to top 8–12 DMCI projects | H | H | P0 |
| 5 | Programmatic location pages `/condos-in-{city}` | H | M | P0 |
| 6 | Emit `FAQPage` schema on project pages (FAQ content exists, schema doesn't) | H | L | P0 |
| 7 | Reword "Free Computation" → outcome-based CTA | H | L | P0 |
| 8 | Privacy/no-spam microcopy beside every form | M | L | P0 |
| 9 | Named advisor profiles (faces + creds) | H | M | P0 |
| 10 | Clarify DMCI relationship + "free advisory" in hero/footer | H | L | P0 |
| 11 | Two-tier CTA strategy (browse vs talk) | H | M | P1 |
| 12 | Honest proof band to replace removed fake stats | M | L | P0 |
| 13 | Interlink guides → projects → location → FAQ clusters | M | M | P1 |
| 14 | Investor data: yields, price/sqm, ROI calculator | H | H | P1 |
| 15 | OFW remote-buying (SPA) hub page | H | M | P1 |
| 16 | `Review`/`AggregateRating` schema from testimonials | M | L | P1 |
| 17 | `Person` schema for founder/advisors | M | L | P1 |
| 18 | Developer hub `/dmci-homes` aggregator | M | M | P1 |
| 19 | Reduce project-page CTAs to 1 primary + 1 secondary | M | L | P1 |
| 20 | Add Sonora pillar to nav/"Resources" cluster | M | L | P1 |
| 21 | Sticky "jump to price/FAQ" bar on long pillar pages | M | M | P1 |
| 22 | Sitemap `<lastmod>` + include careers/privacy/terms | M | L | P1 |
| 23 | First-timer education hub ("How buying works") | M | M | P1 |
| 24 | Working comparison tool (replace "coming soon") | M | H | P2 |
| 25 | Comparison pages `/sonora-vs-{x}` | M | M | P2 |
| 26 | Per-unit `Offer` + geo on `RealEstateListing` | M | L | P2 |
| 27 | `ImageObject` schema on hero images | L | L | P2 |
| 28 | Canonicalize `/properties` filter/query params | M | M | P2 |
| 29 | Increase unique copy per templated project page | M | M | P2 |
| 30 | Financing guides (Bank vs Pag-IBIG vs in-house) | M | M | P1 |
| 31 | Glossary (RFO, pre-selling, DP, amortization) + tooltips | M | M | P2 |
| 32 | Prominent phone/landline + office address | M | L | P1 |
| 33 | Family filters (schools/size) on properties | M | M | P2 |
| 34 | Map-based search | L | H | P3 |
| 35 | Saved searches / favorites | L | M | P3 |
| 36 | Video tours + VideoObject schema | L | M | P3 |
| 37 | Markdown table support in blog renderer | L | M | P2 |
| 38 | Author bylines + dates on guides | L | L | P2 |
| 39 | Neighborhood/lifestyle guides | M | M | P2 |
| 40 | Retiree-friendly content (accessibility, phone-first) | L | M | P3 |
| 41 | Email nurture/drip for captured-but-not-ready leads | M | H | P2 |
| 42 | Response-time SLA stated near forms ("reply in 2 hrs") | M | L | P1 |
| 43 | Increase body text contrast/size on dense sections | M | L | P2 |
| 44 | Homepage location quick-filter to accelerate discovery | M | M | P2 |
| 45 | Case studies / success stories (real, verifiable) | M | M | P2 |
| 46 | Demote/relocate Careers out of revenue nav | L | L | P3 |
| 47 | A/B test hero CTA variants | M | M | P2 |
| 48 | Add `inputmode`/`type` to phone/email inputs | L | L | P2 |
| 49 | Awards/media-mention strip (if any exist) | L | L | P3 |
| 50 | hreflang/i18n groundwork (Tagalog) for OFW reach | L | H | P3 |

---

## Section 15 — Brutal Honesty Section

The founder asked for the truth. Here it is, unsoftened.

**1. You built a Ferrari engine and forgot the fuel.** The SEO/schema/conversion infrastructure is better than most funded PH proptechs. But you're pointing it at ~a dozen thin, templated pages. ~86 properties sit in seed data doing nothing for organic traffic. The platform's ceiling is being capped by **content volume**, not capability. Right now you're paying for an engine you're not feeding.

**2. Your trust story is a liability, not an asset.** You display a DMCI logo and say "guidance you can build a decade on," but show **zero** verifiable credentials — no license number, no third-party reviews, no named humans, no real address. To a wary Filipino buyer (especially an OFW wiring money from abroad), this pattern-matches to "could be a scam." You **correctly** deleted the fake "12yr/₱2B/98%" stats — that was the right call — but you left the wound open instead of dressing it with real proof. Asserting trust while hiding credentials is worse than saying nothing.

**3. The "Download Brochure / Floor Plans" buttons are a trust bug.** They imply a file and deliver a form. Users notice the bait-and-switch. Either deliver the file (and capture the email — your best lead magnet) or remove the buttons. Shipping fake affordances on a trust-sensitive purchase is self-sabotage.

**4. "Free Computation" is costing you leads.** It reads as "start a sales process," not "see a number." Outcome-framed CTAs ("See the price & sample computation") convert better because they promise *information*, not *obligation*. You already removed one "Free Computation" from the hero — finish the job everywhere.

**5. Over-CTA'd project pages signal desperation.** Five to six competing CTAs (sticky widget + mobile bar + exit modal + pricing CTA + lead form) is the digital equivalent of a pushy agent following you around the showroom. It depresses the one action you actually want. Confidence converts; clutter doesn't.

**6. The templated project pages will not rank — and may drag you down.** Near-identical structure with low unique content across many slugs is classic thin-content. Google may treat them as doorway-ish. Your **Sonora pillar** is the proof you know how to do it right; the rest of the portfolio is the opposite pattern. Pick a lane: deep pillars for top projects, and consider `noindex` or consolidation for the thin tail until it earns depth.

**7. You're under-serving your highest-LTV buyer.** OFWs are your sweet spot (you say so in copy), yet there's no remote-purchase guide, no SPA explainer, no overseas-financing content, and the trust gap hits them hardest because they can't visit. This is the clearest "money left on the table" in the audit.

**8. Investors get a thesis but no data.** `/why-invest` argues the case; nothing backs it. No yields, no comps, no calculator. Investors don't convert on vibes — and you've already taught them (via the deleted fake stats) to distrust your numbers. Rebuild credibility with **real, sourced** data or don't claim returns at all.

**9. Guides are a dead-end.** Content with no path back to inventory is traffic you pay to acquire and then let bounce. Every guide should funnel toward a project, location, or lead.

**10. The thing you should be proudest of is hidden.** The Sonora pillar is your best page — comprehensive, schema-rich, AI-Overview-ready, bi-directionally linked — and it's not in a single menu. You buried your best work. Surface it, then replicate it 10×.

**Bottom line:** CityQlo doesn't have a technology problem or a design problem. It has a **proof problem** and a **volume problem**. Fix trust (Section 9) and scale content (Section 8) and the excellent machinery you've already built will finally have something to convert. Do nothing else from this document and you'll still capture most of the upside by doing those two.

---

*End of audit. Sections 13–14 are your prioritized 12-month roadmap; Section 15 is what to confront first.*
