-- Seed the three rental-strategy guides linked from the Why Invest page.
-- Slugs here MUST match the guide_slug values in src/lib/marketing-pages.ts
-- (rental_strategies[].guide_slug). Safe to re-run: existing slugs are skipped.
do $$
declare
  v_author_id uuid;
begin
  -- Reuse the earliest profile as author (same pattern as seed_blogs.sql)
  select id into v_author_id from public.profiles order by created_at asc limit 1;

  insert into public.blogs (title, slug, excerpt, content, cover_image_url, author_id, status, published_at, tags, read_time)
  values
    (
      'Short-Term & Airbnb Rentals in Metro Manila: The Complete Playbook',
      'short-term-airbnb-rentals-manila',
      'Nightly stays can produce the highest yield of any rental strategy - if your building allows it and your occupancy holds. Here is how the model really works.',
      '# Short-Term & Airbnb Rentals in Metro Manila: The Complete Playbook

Short-term rentals - nightly and weekly stays booked through Airbnb, Booking.com, or Agoda - can produce the highest gross yield of any rental strategy. They also demand the most work. This playbook lays out how the model actually performs in Metro Manila, and what it takes to run one well.

## Is your building even allowed to do it?

Before anything else, confirm short-term letting is permitted. Many condominium corporations restrict or ban stays under a set number of nights to protect security and keep association dues predictable.

- Read the **Master Deed** and **House Rules** for minimum-stay clauses.
- Ask the property management office directly, in writing.
- Check whether the LGU requires a business permit or accreditation for short-stay accommodation.

> If short-term rentals are prohibited, the numbers below are irrelevant - pick the staycation or long-term route instead.

## The economics

Short-term rentals trade stability for upside. You can earn considerably more per booked night than a monthly lease implies, but only if occupancy holds.

| Driver | Why it matters |
| :--- | :--- |
| **Location** | Proximity to airports, CBDs, hospitals, and tourist anchors sets nightly demand. |
| **Occupancy** | 60% to 75% is a realistic target; below 50% the model rarely beats a long lease. |
| **Seasonality** | Holidays, conventions, and summer swing rates up; the wet season pulls them down. |
| **Reviews** | A 4.8+ rating and Superhost status lift both bookings and price. |

## What it costs to run

The nightly rate is gross, not net. Budget for:

1. **Furnishing and styling** - photogenic interiors are the single biggest conversion lever.
2. **Cleaning and linen** - turnover between every guest.
3. **Utilities and internet** - always included, always on.
4. **Platform fees** - roughly 3% to 15% depending on the channel.
5. **Management** - 15% to 25% of revenue if you hire a co-host.

## Who this suits

Owners who treat the unit as a small hospitality business - or who pay a manager to - and who own in a high-traffic, short-stay-friendly location. If you want hands-off income, this is not it.

*Talk to us before you commit - we will tell you honestly whether your building and submarket support the model.*',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=600&auto=format&fit=crop',
      v_author_id,
      'published',
      now() - interval '3 days',
      array['Rental Income', 'Airbnb'],
      9
    ),
    (
      'Staycation Rentals: Turning Resort-Style Amenities into Weekend Income',
      'staycation-rentals-dmci',
      'For amenity-rich developments, staycations are often the most natural income strategy. Here is how weekend and holiday demand translates into returns.',
      '# Staycation Rentals: Turning Resort-Style Amenities into Weekend Income

A staycation rental is a short stay sold on experience rather than location - guests book your unit for the pool, the amenities, and a change of scenery, usually over weekends and holidays. For resort-style developments like DMCI Homes, it is often the most natural income strategy.

## Why resort-style units fit the model

DMCI is known for lagoon-style pools, landscaped grounds, and clubhouse amenities. Those are exactly what local staycation guests pay for.

- **Amenity-led demand** - guests choose the property for the leisure experience.
- **Local market** - you are selling to Metro Manila families and barkadas, not foreign tourists, so demand is weather- and holiday-driven.
- **Weekend concentration** - Friday to Sunday and long weekends do the heavy lifting.

## Staycation vs pure Airbnb

They overlap, but the emphasis differs.

| Aspect | Staycation | Pure short-term (Airbnb) |
| :--- | :--- | :--- |
| **Guest** | Local leisure, families | Travelers, business, tourists |
| **Peak demand** | Weekends, holidays | Varies with travel demand |
| **Sells on** | Amenities and vibe | Location and convenience |
| **Weekday occupancy** | Lower | Higher |

## Making the unit book

Presentation is everything in a market that buys on photos.

1. **Design a theme** - a cohesive, photogenic interior outperforms a generic one.
2. **Sleep more than the floor plan suggests** - sofa beds and bunk options widen your market.
3. **Lean into the amenities** - feature the pool and grounds in every listing.
4. **Bundle little extras** - board games, streaming, a welcome note; small touches drive five-star reviews.

## The honest trade-off

Weekday occupancy is usually soft, so annualized yield can land below a well-run pure-Airbnb unit - but with less intensity and turnover. Confirm your building allows short stays before you count on it.

*We can help you assess whether your specific tower and unit will draw staycation demand.*',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=600&auto=format&fit=crop',
      v_author_id,
      'published',
      now() - interval '2 days',
      array['Rental Income', 'Staycation'],
      7
    ),
    (
      'Long-Term Rentals: The Passive Income Playbook for Condo Owners',
      'long-term-rentals-metro-manila',
      'A lease of six months or more trades peak yield for predictable, low-effort cash flow. Here is how to price it, fill it, and keep it running.',
      '# Long-Term Rentals: The Passive Income Playbook for Condo Owners

A long-term rental - a lease of six months or more - is the classic, low-effort way to earn from a condo. It trades the peak yields of nightly stays for something many owners value more: predictability.

## Why owners choose it

- **Steady cash flow** - one tenant, one monthly payment, minimal turnover.
- **Lower operating cost** - no nightly cleaning, furnishing churn, or platform fees.
- **Time-light** - once a good tenant is in place, the unit largely runs itself.
- **Building-friendly** - almost every condominium permits long leases, unlike short stays.

## Pricing the lease

Set rent against comparable units in your building and submarket, not against your mortgage.

| Factor | Effect on rent |
| :--- | :--- |
| **Furnished vs bare** | Furnished commands a premium but adds wear and replacement cost. |
| **Floor and view** | Higher floors and unobstructed views lease faster and higher. |
| **Transport access** | Proximity to transit and CBDs widens your tenant pool. |
| **Condition** | Well-maintained units justify - and hold - higher rent. |

## Finding and keeping good tenants

The quality of your tenant matters more than a few hundred pesos of rent.

1. **Screen properly** - verify employment, income, and references.
2. **Use a clear contract** - spell out term, deposit, dues, and house rules.
3. **Collect the standard deposits** - typically two months plus one month advance.
4. **Keep the unit maintained** - responsive owners retain tenants and avoid vacancy.

> A one-month vacancy erases roughly 8% of your annual rental income. Retention beats re-listing.

## Who this suits

Owners who want dependable, largely passive income and are happy to trade top-line yield for peace of mind - OFWs and busy professionals especially.

*We help owners price, list, and screen - so the passive part actually stays passive.*',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=600&auto=format&fit=crop',
      v_author_id,
      'published',
      now() - interval '1 day',
      array['Rental Income', 'Leasing'],
      8
    )
  on conflict (slug) do nothing;
end $$;
