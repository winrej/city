-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRATION: Add `unit_types` to the existing `properties` table
--
-- Run this in Supabase SQL Editor ONCE if you already created the properties
-- table via properties_migration.sql before this column existed.
--
-- Safe to run multiple times — uses ADD COLUMN IF NOT EXISTS.
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS unit_types text[] NOT NULL DEFAULT '{}';

-- ── Optional backfill ────────────────────────────────────────────────────────
-- Existing rows default to an empty array, so the property card falls back to
-- the single `beds` count. Populate real unit mixes per property here, e.g.:
--
--   UPDATE public.properties SET unit_types = '{1BR,2BR,3BR}' WHERE slug = 'alder-residences';
--   UPDATE public.properties SET unit_types = '{Studio,1BR,2BR}' WHERE slug = 'anissa-heights';

-- ── Verify ───────────────────────────────────────────────────────────────────
SELECT slug, beds, unit_types
FROM public.properties
ORDER BY display_order;
