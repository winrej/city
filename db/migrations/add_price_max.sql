-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRATION: Add `price_max` + `price_max_display` to the `properties` table
--
-- Run this in Supabase SQL Editor ONCE if you created the properties table via
-- properties_migration.sql before these columns existed.
--
-- Safe to run multiple times — uses ADD COLUMN IF NOT EXISTS.
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS price_max numeric NOT NULL DEFAULT 0 CHECK (price_max >= 0);

ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS price_max_display text NOT NULL DEFAULT '';

-- ── Optional backfill ────────────────────────────────────────────────────────
-- Rows without a max show only the entry price ("Starts at …") on the card.
-- Populate real ceilings per property, e.g.:
--
--   UPDATE public.properties
--   SET price_max = 11.2, price_max_display = '₱11.2M'
--   WHERE slug = 'alder-residences';

-- ── Verify ───────────────────────────────────────────────────────────────────
SELECT slug, price_display, price_min, price_max, price_max_display
FROM public.properties
ORDER BY display_order;
