-- Seed blogs table with dynamic author assignment
do $$
declare
  v_author_id uuid;
begin
  -- Retrieve the first available profile (fallback to null if none exists)
  select id into v_author_id from public.profiles order by created_at asc limit 1;

  -- Insert Blogs
  insert into public.blogs (title, slug, excerpt, content, cover_image_url, author_id, status, published_at, tags, read_time)
  values
    (
      'First-Time Buyer Guide: Navigating Metro Manila Real Estate',
      'first-time-buyer',
      'What to know before you sign anything. A plain-spoken walkthrough for Filipinos buying their first property.',
      '# First-Time Buyer Guide: Navigating Metro Manila Real Estate

Buying your first home or investment property in Metro Manila is an exciting milestone, but it can also be incredibly overwhelming. With hundreds of developments, complex financing terms, and legal documents to sign, it is easy to make a costly mistake.

This guide is a plain-spoken walkthrough designed to help you navigate the process calmly, confidently, and correctly.

## 1. Define Your Real Budget (Beyond the Selling Price)

When looking at property listings, the price you see is almost never the total amount you will pay. First-time buyers often forget to account for **closing fees** and **transfer costs**.

### Key Additional Costs to Expect:
- **Government Taxes**: Document stamp tax, transfer tax, and registration fees (usually around 2.5% to 3.5% of the property value).
- **Move-In Fees**: Utility connection charges, membership fees, and advance association dues.
- **Bank Loan Fees**: Appraisal fees, handling charges, and mortgage redemption insurance (MRI).

*Rule of thumb:* Always prepare an additional **5% to 10%** of the contract price for transaction fees.

## 2. Pre-selling vs. Ready-For-Occupancy (RFO)

You need to decide which stage of development matches your timeline and cash flow.

| Feature | Pre-selling | Ready-For-Occupancy (RFO) |
| :--- | :--- | :--- |
| **Pricing** | Lower introductory rates | Market value (higher initial price) |
| **Payment** | Long downpayment terms (low monthly) | Higher upfront equity or immediate loan |
| **Timeline** | 2 to 5 years before move-in | Move in within 30 to 60 days |

If you have a place to live and want to build equity slowly, **pre-selling** offers the best value. If you need to move in immediately or want instant rental income, **RFO** is the way to go.

## 3. Understand the Payment Structure

A typical developer payment plan consists of:
1. **Reservation Fee**: A non-refundable fee (usually ₱20,000 to ₱50,000) to lock in the unit and price.
2. **Downpayment (Equity)**: Typically 10% to 20% of the total price, paid in monthly installments over a set period.
3. **Remaining Balance**: The 80% to 90% balance, paid through a lump-sum cash payment or bank financing at turnover.

Never assume you can qualify for bank financing until you have checked your credit history and income stability. Apply for pre-qualification at least six months before your downpayment period ends.

## 4. Work with an Accredited Advisor

Working directly with a single developer agent restricts your options. An independent, accredited advisory service (like **CityQlo**) represents you and handles comparisons across multiple developers, pricing structures, and locations at no extra cost.',
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=600&auto=format&fit=crop',
      v_author_id,
      'published',
      now() - interval '5 days',
      array['Buying', 'Guide'],
      8
    ),
    (
      'The OFW Property Buying Guide: Remote Real Estate Investing',
      'ofw-property-guide',
      'Buying from abroad, calmly and correctly. How to navigate the process remotely without the pitfalls.',
      '# The OFW Property Buying Guide: Remote Real Estate Investing

As an Overseas Filipino Worker (OFW), investing in real estate is one of the most reliable ways to build generational wealth and secure your family''s future back home. However, buying a condo or home from thousands of miles away presents unique challenges.

This guide outlines the remote buying process step-by-step to protect your hard-earned money.

## 1. Select the Special Power of Attorney (SPA)

Since you cannot sign contracts or file loan documents in person, you must designate a trusted representative in the Philippines (your **Attorney-in-Fact**).

- **Who to Choose**: Select a spouse, parent, sibling, or trusted professional.
- **The SPA Document**: The developer or bank will provide an SPA form specifying exactly what actions your representative can perform on your behalf.
- **Consularization**: You must have the SPA authenticated or "consularized" at the Philippine Embassy or Consulate in the country where you are working, or apostilled by a notary.

## 2. Choosing the Right Developer

When buying remotely, developer reputation is your primary security blanket. Stick to top-tier developers with a proven track record of:
- **On-time delivery** of units.
- **High-quality construction** and building maintenance.
- **Transparent documentation** and customer service.

Developers like **DMCI Homes** are highly recommended for OFWs due to their resort-style amenities, consistent rental demand, and transparent online account management portals.

## 3. Handling Remote Payments

Avoid sending reservation fees or monthly downpayments directly to personal bank accounts. Always transact through:
- **Direct Bank-to-Bank Wire Transfers** to the developer''s corporate account.
- **Authorized Remittance Partners** (like BDO Remit, Metrobank Remit, etc.).
- **Auto-Debit Agreements (ADA)** set up with your Philippine bank account.',
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop',
      v_author_id,
      'published',
      now() - interval '4 days',
      array['OFW', 'Investing'],
      10
    ),
    (
      'Condo Investment: 5 Critical Questions to Ask Before Reserving',
      'condo-investment',
      'The five questions every investor should ask before signing a reservation agreement.',
      '# Condo Investment: 5 Critical Questions to Ask Before Reserving

Condominiums are the go-to investment for urban rental income and capital appreciation in Metro Manila. But not all condos are created equal.

Before paying a reservation fee, ensure you have clear answers to these five essential questions:

## 1. What is the True Cost of Association Dues?
Association dues pay for security, building upkeep, and amenity maintenance. They are calculated per square meter of your unit.
*Check:* Are the dues reasonable for the amenities provided, or will they eat up a massive portion of your potential rental yields?

## 2. What is the Target Tenant Profile?
Are you renting to college students, BPO professionals, expat executives, or families?
Your target tenant determines your unit design, location choice, and ideal amenities. A BPO worker wants proximity to transport hubs, while a student needs study halls and high-speed internet.

## 3. What is the Developer''s Historical Appreciation Rate?
Top-tier developers see their properties appreciate in value from pre-selling to turnover, and further during secondary market transitions. Analyze historical pricing databases in the local submarket before committing.

## 4. Are Short-Term Rentals (Airbnb) Allowed?
If your investment strategy relies on Airbnb or short-term vacation rentals, check the condominium house rules first. Many luxury developments restrict short-term leases to maintain security and keep association costs manageable.

## 5. What Infrastructure Projects are Under Construction Nearby?
New subway stations, highway extensions, and commercial hubs drive property value upward. Research the local municipal plan to see if a new infrastructure project is coming near your property.',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600&auto=format&fit=crop',
      v_author_id,
      'published',
      now() - interval '3 days',
      array['Investing', 'Condo'],
      6
    ),
    (
      'Property Financing in the Philippines: Banks vs In-House vs Pag-IBIG',
      'property-financing',
      'Loans, downpayments, and the math behind them — explained without the jargon.',
      '# Property Financing in the Philippines: Banks vs In-House vs Pag-IBIG

Once your downpayment period ends, you must pay the remaining balance. Knowing how to finance this balance can save you hundreds of thousands of pesos in interest fees.

Here is a breakdown of the three primary financing options in the Philippines:

## 1. Bank Financing (Best for Lowest Rates)
Local banks offer the most competitive interest rates, usually ranging from 6% to 8% per year.
- **Pros**: Lowest interest cost, flexible terms up to 20 or 25 years.
- **Cons**: Strict credit checks, high documentation requirements, and initial bank fees.

## 2. In-House Financing (Best for Convenience)
In-house financing means you borrow directly from the property developer.
- **Pros**: No strict credit checks, minimal documents, and high approval rates.
- **Cons**: Extremely high interest rates (often 12% to 16% per year) and shorter repayment periods (maximum of 10 years).

## 3. Pag-IBIG Fund (Best for Long-Term Stability)
The government-backed Pag-IBIG HDMF loan is a popular choice for affordable housing projects.
- **Pros**: Low interest rates for low-value loans, maximum term of 30 years, stable interest rate locks.
- **Cons**: Caps on total loan value, slower processing times, and strict membership contribution rules.',
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop',
      v_author_id,
      'published',
      now() - interval '2 days',
      array['Financing', 'Guide'],
      9
    ),
    (
      'The DMCI Homes Buying Process: From Reservation to Turnover',
      'dmci-buying-process',
      'From reservation to turnover, step by step. Everything you know about buying through DMCI Homes.',
      '# The DMCI Homes Buying Process: From Reservation to Turnover

Buying a resort-style residence through DMCI Homes follows a structured, transparent process. Here is what to expect from day one to the day you receive your keys:

## Step 1: Unit Reservation and Registration
Select your unit, parking space, and preferred payment term. Pay the reservation fee and register your account online via the DMCI customer portal.

## Step 2: Submission of Documents
Within 30 days of reserving, submit required IDs, proof of billing, tax documents, and post-dated checks (PDCs) or auto-debit authorizations for the downpayment.

## Step 3: Construction Phase
Monitor construction progress online. DMCI publishes monthly building photo logs so you can watch your home take shape.

## Step 4: Loan Takeout or Balance Payment
Six months before construction ends, prepare your loan documents. If using bank financing, the bank must issue a Letter of Guarantee (LOG) to pay the developer.

## Step 5: Inspection and Turnover
Once cleared, schedule a unit walk-through. Inspect the unit carefully for any cosmetic issues before signing the acceptance certificate and collecting your keys.',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600&auto=format&fit=crop',
      v_author_id,
      'published',
      now() - interval '1 day',
      array['DMCI', 'Guide'],
      7
    ),
    (
      'Metro Manila Real Estate Market Insights: Where Value is Moving',
      'metro-manila-insights',
      'Submarket reads and where value is moving. A quarterly look at Metro Manila''s property landscape.',
      '# Metro Manila Real Estate Market Insights: Where Value is Moving

The Metro Manila real estate market is shifting. While traditional business districts like Makati and BGC remain solid, new high-growth corridors are emerging due to new infrastructure projects.

Here is a summary of the most promising submarkets this quarter:

## 1. Pasig City and the Ortigas-BGC Bridge
The opening of the BGC-Ortigas Link Bridge has dramatically slashed travel times between Pasig and Bonifacio Global City. Developers like DMCI (with projects like **Satori Residences** and **Allegra Garden Place**) are seeing high rental demand from young professionals working in BGC but living in affordable Pasig neighborhoods.

## 2. Las Piñas and the Cavite Extension
The expansion of the LRT-1 line into Cavite and the development of new expressway loops have placed Southern Metro Manila in high demand. Las Piñas properties offer highly competitive per-square-meter rates with massive potential for capital growth.

## 3. Transit-Oriented Developments (Quezon City)
Properties near the Metro Manila Subway line are already seeing price increases. Access to reliable rail transport is the primary driver of capital appreciation in high-density residential hubs.',
      'https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=600&auto=format&fit=crop',
      v_author_id,
      'published',
      now() - interval '12 hours',
      array['Market', 'Metro Manila'],
      5
    ),
    (
      'Building Generational Wealth Through Manila Real Estate',
      'generational-wealth-manila-real-estate',
      'A deep dive into leverage, capital appreciation, and rental yields in high-growth districts.',
      '# Building Generational Wealth Through Manila Real Estate

Real estate has long been the cornerstone of the world''s wealthiest families. Unlike stocks, which can fluctuate wildly overnight, or currency, which degrades with inflation, physical property represents tangibility, security, and perpetual utility.

In a rapidly developing economy like the Philippines, real estate is one of the most powerful engines for building long-term generational wealth.

Here is how smart investors leverage Manila''s property market to build lasting assets for their heirs.

## 1. The Power of Capital Appreciation
Land is finite. As Metro Manila''s population grows and land becomes increasingly scarce, the value of well-located properties naturally rises. By purchasing property early in its development lifecycle (e.g., pre-selling condos), investors lock in low prices and capture the capital appreciation as the area develops.

*Example:* A pre-selling condo unit purchased in Pasig or Quezon City during early-stage development can see its value appreciate by 30% to 50% by the time of turnover.

## 2. Leveraging Rental Yields for Cash Flow
A prime property does not just appreciate in value; it also produces recurring monthly cash flow. Using rental income to pay off your mortgage allows you to build equity using "other people''s money" (your tenants). Once the loan is paid off, the rental income becomes pure passive cash flow.

## 3. Choosing High-Growth Corridors
To build wealth that lasts, look where the government is investing. Properties located near major infrastructure projects — like the Metro Manila Subway, LRT extension projects, and new bridges — experience faster capital appreciation and stronger rental demand.

## 4. The Legacy Asset
Unlike other asset classes, real estate can easily be passed down to heirs. Under Philippine tax laws, planning your property inheritance early protects your family from high estate taxes and secures a debt-free cash-flowing asset for your children.

Investing in Metro Manila real estate is not a get-rich-quick scheme. It is a slow, steady, and incredibly secure strategy to ensure your family''s financial independence for generations to come.',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop',
      v_author_id,
      'published',
      now(),
      array['Wealth', 'Investing', 'Strategy'],
      12
    );
end $$;
