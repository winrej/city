<!--
============================================================
CityQlo — SEO Buyer's Guide (DRAFT / deliverable, not wired in)
Source inspiration: dmcihomes.com/guides/buyers-guide
Rewritten in original wording (no verbatim copying) + SEO-structured.
FULL 1:1 coverage of every source section. Nothing in the app is modified.
============================================================
-->

# SEO SPEC — fields for your `guides.$slug` post record

Map these to the columns your loader reads (`title`, `slug`, `excerpt`, `tags`, `read_time`, `published_at`, `cover_image_url`). The route builds `<title>`, canonical, OG and Twitter tags from these.

| Field | Recommended value |
|---|---|
| **title** | The Complete Condo Buyer's Guide for the Philippines (2026) |
| **slug** | condo-buyers-guide-philippines |
| **excerpt** (meta description, ~150–160 chars) | Everything about buying a Philippine condo — requirements, financing, fees, penalties, turnover, title transfer, ownership changes, and property management. |
| **tags** | Buyer's Guide, Condominium, Financing, Turnover, Philippines |
| **read_time** | 18 |
| **cover_image_url** | 1200×630-friendly hero so `buildOgImage()` yields a sharp share card. |

**Primary keyword:** condo buyer's guide Philippines
**Secondary keywords:** how to buy a condo Philippines, in-house vs bank financing, condo title transfer, condo turnover process, transfer of condo ownership, condo association dues, Maceda Law refund, loan restructuring condo
**Intent:** informational → soft conversion (book a consultation)

**On-page checklist**
- One `# H1` (the title). Sections `##`, sub-points `###` — your renderer auto-adds heading IDs → anchor targets / jump links.
- Front-load the primary keyword in the first 100 words.
- FAQ block at the end → eligible for FAQ rich results (add FAQPage JSON-LD later; note at bottom).
- Internal links to `/properties`, `/projects`, `/contact` kept in the copy.

---

<!-- ============ PASTE FROM HERE INTO THE `content` FIELD ============ -->

# The Complete Condo Buyer's Guide for the Philippines (2026)

Buying a condo in the Philippines involves far more than choosing a unit and paying for it. This complete condo buyer's guide covers the entire journey — reservation requirements, financing, fees and penalties, changing your documents, turnover, title transfer, and life as a unit owner — so nothing catches you off guard. Use the sections below as a reference; jump to whatever stage you're in.

Prefer a human to walk you through it? [Book a free consultation](/contact) any time.

## First, the basics

**Pre-selling vs. RFO.** Pre-selling units are sold before or during construction — cheaper, flexible terms, best unit selection, but you wait for turnover. Ready-for-Occupancy (RFO) units are finished and can be lived in or leased right away, at a higher price. Compare both across projects on our [listings page](/properties).

**Fully furnished units** are generally *not* offered by developers — expect a bare or semi-finished turnover standard.

**Can foreigners buy?** Yes. Foreign nationals can own condo units and may buy more than one, as long as total foreign ownership in a single condominium corporation stays within **40%**, per Philippine law. Land remains restricted, which is why condos are the usual entry point for foreign buyers.

---

## Part 1 — Documentary requirements and procedures

### Reserving your unit

Reservation locks in your unit. Prepare a standard document set: the Reservation Agreement and receipt, a Client Registration/Information Form, two valid IDs, your computation sheet, your TIN, a Special Power of Attorney (SPA) if someone transacts for you, and proof of billing.

> Submit complete requirements promptly — typically **within 30 days** of reservation. An incomplete file can forfeit your reservation.

### Paying in cash

The simplest path. After reservation, your documents are prepared for the **Deed of Absolute Sale (DOAS)**, which you'll usually sign and return within about 15 days. A photocopy is released quickly, while the notarized DOAS and title typically follow around one year after full payment. Note: cash buyers of non-RFO units may be asked to post a retention amount (often around ₱50,000) at turnover, with the account under a Contract to Sell until settled.

### In-house financing (through the developer)

Alongside the standard documents, expect extras like an auto-debit (ADA) enrollment, plus a birth or marriage certificate where relevant. After approval you receive a Notice of Approval and a **Contract to Sell (CTS)** to review, sign, and return — usually within 15 days — supported by post-dated checks (often a minimum of ~50 PDCs) or an enrolled auto-debit. The notarized CTS generally follows about 30 days from closing. In-house is easier to approve but carries higher interest than a bank.

### Bank financing

You borrow from an accredited bank at typically lower rates, with stricter approval. Requirements to note: the account must carry **no outstanding balance**, advance Real Property Tax is usually collected, and the loan must be released within the due date to avoid penalties. Accredited banks commonly include **BDO, BPI, Metrobank, PNB, Security Bank, RCBC, Chinabank, PSBank, EastWest, Maybank, AUB, and Bank of Commerce**.

### Loan requirements by employment type

- **Locally employed:** COE, ITR, recent pay slips, bank statements, proof of billing.
- **OFW:** authenticated employment contract (POEA for seafarers; consulate-authenticated COE for direct hires).
- **Self-employed / business owner:** DTI or SEC registration, Articles of Incorporation, audited financials (~2 years), bank statements (~6 months), trade references, proof of billing.
- **Professionals (e.g. doctors):** practice/clinic details plus ~6 months of bank statements.
- **Rental / passive income:** tenant list, property addresses, ~6 months of bank statements.

### Changing your payment term (in-house → bank)

You can switch from in-house to bank financing later. The account is endorsed for an updated Statement of Account and a restructured computation sheet (commonly released within ~5 working days), which you confirm within a few days.

### Miscellaneous expenses and closing costs

The unit price is not the total. Miscellaneous expenses — documentary stamp tax, transfer and registration fees, and processing — commonly run **~3.6%–13.5% of the total contract price** and are often folded into your payment schedule. (For sales from mid-2008 onward these are typically already built into the schedule.)

### Clearance for unit turnover

Before you can take the unit, developers require: complete documents, a cleared down payment, a posted receipt (for bank financing), an updated payment status, and complete PDCs or an enrolled auto-debit.

### Title transfer

Transferring the title into your name typically takes **about one year** after full payment and a signed DOAS. You'll generally need full payment of the total contract price, the signed DOAS, an available title/tax declaration, and updated RPT and TIN. Released documents include the notarized DOAS, the Condominium/Transfer Certificate of Title, and the tax declaration. With bank financing, the bank holds the title until the loan is paid. Personal (DIY) processing of title transfer is generally not allowed.

---

## Part 2 — Changing your documents after purchase

Life changes, and so can your paperwork. These amendments usually require a formal request letter, an updated Statement of Account, and an administrative fee.

### Transfer of ownership

To move ownership to a new buyer, expect a request letter, a new Reservation Agreement, the new buyer's ID and proof of billing, an updated SOA, and an administrative fee (commonly in the tens of thousands, higher for premium projects). Only the principal buyer may request it, and fully paid or penalized accounts are typically ineligible.

### Adding a co-owner

Adding a joint buyer follows similar requirements. Only one billing address may be declared for the account.

### Removing a name

Removing a name requires a request letter, an updated SOA, and an admin fee — usually waived if the removal is due to death. Death cases additionally require a notarized extra-judicial settlement, publication, the death certificate, and estate tax.

### Updating personal information

- **Marital status:** request letter, proof of marriage, ID, updated TIN (plus legal documents if moving from married to single).
- **Citizenship:** request letter, ID, reservation agreement, oath of allegiance, and a small administrative fee.
- **Billing address / contact details:** a signed Customer Information Update Form and proof of billing.

### Transferring to a different unit

Switching to another unit is generally allowed **within six months of the reservation date**, subject to approval, with the account current and a transfer fee (often around ₱20,000). It's typically not allowed after turnover or full payment.

---

## Part 3 — Financing: receipts, checks, penalties, and restructuring

### Official receipts

Depending on the account type, invoices are issued monthly or quarterly. Only the principal/co-buyers or an authorized representative (with an authorization letter and IDs) may claim official receipts.

### Holding a check

Need to defer a check? Submit the request **at least 15 banking days before the due date**, usually with a per-check holding fee (often around ₱2,000, cash).

### Pulling out or replacing checks

For returned or replacement checks, coordinate with Customer Care. Original checks are typically released within about 7 banking days (held at treasury) or ~15 banking days (warehoused at banks).

### How penalties escalate

Missed payments accrue penalties that grow the longer they're unpaid — commonly starting at **3% for 1–30 days past due and rising ~3% every 30 days**, up to a cap around 36%. Staying current is far cheaper than catching up.

| Days past due | Typical penalty |
|---|---|
| 1–30 | 3% |
| 31–60 | 6% |
| 61–90 | 9% |
| 91–120 | 12% |
| Over 365 | up to 36%+ |

### Loan restructuring

If payments get tight, restructuring can help before things escalate. Options commonly include extending the term (often up to ~10 years less months already used, if you're under 65 at term-end), shortening the term, advancing or paying off the balance, converting the scheme, adjusting the down payment, or recapitalizing arrears (usually allowed once, with a portion of arrears collected upfront). Expect a restructuring fee (often around ₱10,000) for term extensions and conversions.

### Cancellation due to default

Unpaid accounts get a reminder, then move to legal, where the **Maceda Law** is applied and a Notice of Cancellation is issued. Cancelled clients can typically purchase again after about one year.

### Backing out voluntarily

To back out, submit a notarized cancellation letter. Under the **Maceda Law**, buyers who have paid **at least two years of installments** may be entitled to a partial refund of payments.

---

## Part 4 — Tandem units, custom finishes, turnover, and warranty

### Tandem units

Combining adjacent units ("tandem") requires a formal request with a cash/check bond (often around ₱200,000), released after the Certificate of Acceptance. Submit the request at least ~10 days before the construction schedule.

### Non-installation of finishes and partitions

Planning to customize? You can request that certain finishes or partitions be left uninstalled, typically with a smaller bond (often around ₱100,000) and the same ~10-day lead time and bond-release process.

### The turnover process

When your unit is ready:

1. A coordinator sends your turnover schedule and fees.
2. You inspect the unit. If satisfactory, you sign the acceptance documents; defects go on a **punch list** for the developer to fix.
3. You settle turnover fees — Meralco and water deposits, the condo corporation joining fee, and prorated plus a couple of months' advance association dues — and set up dues payment (often ~1 year of checks).

A representative can accept on your behalf with a notarized SPA and IDs.

> Don't ignore the turnover notice. If you fail to accept within the stated window (commonly **30 days**), many contracts treat the unit as legally accepted — and association dues start whether you've moved in or not.

### Unit warranty

Developers typically provide a **2-year warranty** on workmanship and material defects from acceptance. It excludes normal wear, misuse, and renovation damage — and unauthorized alterations may void it.

---

## Part 5 — Property management and ongoing obligations

### Who manages the building

- **Condominium corporation** — a non-stock, non-profit corporation of unit owners, registered with the SEC, that maintains common areas under the Master Deed. As an owner, you're a member/stockholder.
- **Property Management Office (PMO)** — the arm through which the corporation runs day-to-day operations: administration, accounting, maintenance and engineering, security and safety (fire code and occupational safety), and housekeeping and landscaping.

### Association dues

Monthly assessments that cover service providers, admin, supplies, common-area maintenance and utilities, RPT on common areas, and building insurance. They begin at unit acceptance, and late payments incur penalties.

### Real property tax on your unit

Paid by the owner, based on floor/lot area: **Basic Tax = Assessed Value × the municipal RPT rate.** Developers often advance this and release title once it's settled.

### Special assessment fees

Occasional charges outside regular dues — common-area insurance, annual RPT on common areas, major repairs, new equipment, or special services like termite treatment. Usually computed as total expense ÷ total saleable area × your unit area.

### Leasing your unit

Bought as an investment? Developers and third-party managers can market and manage the lease — registering your unit, assessing and inventorying the property, then actively marketing it once accepted. Browse [projects](/projects) if you're comparing rental potential before buying.

---

## Frequently asked questions

### How much do I really need to buy a condo in the Philippines?
Beyond the down payment, budget for miscellaneous expenses (~3.6%–13.5% of the contract price), advance real property tax, and turnover fees (utility deposits, condo corp fee, advance association dues). The unit price alone is not the full cost.

### Is pre-selling cheaper than RFO?
Usually yes — pre-selling is priced lower with flexible terms, but you wait for construction. RFO costs more but you can move in or lease immediately.

### Can I get money back if I stop paying?
Under the Maceda Law, buyers who have paid at least two years of installments may be entitled to a partial refund. Before defaulting, ask about restructuring your term.

### How long does condo title transfer take?
Typically about one year after full payment and a signed Deed of Absolute Sale. With bank financing, the bank holds the title until the loan is settled.

### Can I transfer my condo to another person or unit?
Yes. Ownership can be transferred to a new buyer (via the principal buyer, with fees), and you can switch to a different unit generally within six months of reservation if the account is current.

### Can foreigners buy a condo here?
Yes, as long as total foreign ownership in the condominium corporation stays within 40%.

---

*This guide is general information, not legal or financial advice. Fees, figures, and requirements vary by developer and project and can change without notice. For guidance on a specific unit, [book a consultation with CityQlo](/contact) — no pressure, just honest advice.*

<!-- ============ END OF PASTE ============ -->

---

# Optional next step (not done yet)

To make the FAQ section eligible for Google's FAQ rich results, add an `FAQPage` JSON-LD component alongside your existing `BreadcrumbJsonLd` in `guides.$slug.tsx`. Say the word and I'll wire it in.
