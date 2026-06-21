-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRATION: Add new OG/Twitter override fields to the existing `seo` row
--
-- Run this in Supabase SQL Editor ONCE if you already have a `seo` row in
-- site_settings (i.e. you ran seed_site_settings.sql previously).
--
-- This is SAFE to run multiple times — it uses jsonb_set to only ADD the
-- missing keys without touching any existing values.
-- ═══════════════════════════════════════════════════════════════════════════

UPDATE public.site_settings
SET value = value
  || '{"og_title": "", "og_description": "", "twitter_title": "", "twitter_description": ""}'::jsonb,
    updated_at = now()
WHERE key = 'seo'
  AND NOT (value ? 'og_title');  -- Only runs if the key is missing (idempotent)

-- Also make sure og_image_url is set to a working fallback if empty
UPDATE public.site_settings
SET value = jsonb_set(value, '{og_image_url}', '"https://cityqlo.com/Logo.png"'),
    updated_at = now()
WHERE key = 'seo'
  AND (value->>'og_image_url' = '' OR value->>'og_image_url' IS NULL);

-- ── Verify ───────────────────────────────────────────────────────────────────
SELECT key, value, updated_at
FROM public.site_settings
WHERE key = 'seo';
