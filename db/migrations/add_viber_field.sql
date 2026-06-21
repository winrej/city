-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRATION: Add viber field to the existing `contact` row in `site_settings`
--
-- Run this in Supabase SQL Editor ONCE if you already have a `contact` row in
-- site_settings (i.e. you ran seed_site_settings.sql previously).
--
-- This is SAFE to run multiple times — it uses JSONB merge operator `||`
-- to only add the missing key without touching any existing values.
-- ═══════════════════════════════════════════════════════════════════════════

UPDATE public.site_settings
SET value = value || '{"viber": ""}'::jsonb,
    updated_at = now()
WHERE key = 'contact'
  AND NOT (value ? 'viber');  -- Only runs if the key is missing (idempotent)

-- ── Verify ───────────────────────────────────────────────────────────────────
SELECT key, value, updated_at
FROM public.site_settings
WHERE key = 'contact';
