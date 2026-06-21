-- ============================================================
-- CityQlo — Properties Table & Site Settings Schema Upgrade
-- Run this script in your Supabase SQL Editor
-- ============================================================

-- 1. Alter properties table to add new columns
ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS promo_badge text,
  ADD COLUMN IF NOT EXISTS is_spotlight boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS featured_rank integer DEFAULT 0;

-- 2. Performance Indexing
CREATE INDEX IF NOT EXISTS idx_properties_featured_rank
  ON public.properties (is_featured, featured_rank DESC);

CREATE INDEX IF NOT EXISTS idx_properties_spotlight
  ON public.properties (is_spotlight) WHERE is_spotlight = true;

-- 3. Spotlight Exclusivity Trigger
-- Automatically shifts spotlight designation to a single property in a single transaction
CREATE OR REPLACE FUNCTION public.handle_spotlight_exclusivity()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.is_spotlight = true AND (TG_OP = 'INSERT' OR OLD.is_spotlight = false) THEN
    UPDATE public.properties
    SET is_spotlight = false
    WHERE id != NEW.id AND is_spotlight = true;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_properties_spotlight_exclusivity ON public.properties;
CREATE TRIGGER trg_properties_spotlight_exclusivity
  BEFORE INSERT OR UPDATE OF is_spotlight ON public.properties
  FOR EACH ROW EXECUTE FUNCTION public.handle_spotlight_exclusivity();

-- 4. Seed Default Site Settings (Idempotent)
INSERT INTO public.site_settings (key, value) VALUES

-- Collections Settings
('collections_settings', '{
  "Metro Core": {
    "tagline": "High-yield urban spacing.",
    "description": "Makati, Taguig, Pasig, Mandaluyong, Quezon City, Caloocan, Manila, Pasay, Cebu, Davao",
    "image_url": ""
  },
  "Suburban Enclaves": {
    "tagline": "Suburban breathing room.",
    "description": "Parañaque, Muntinlupa, Las Piñas, Bacoor, Cabuyao",
    "image_url": ""
  },
  "Resort & Leisure": {
    "tagline": "Premium coastal & mountain retreats.",
    "description": "Boracay (Malay), Batangas (Solmera), Baguio, Tuba (Benguet)",
    "image_url": ""
  }
}'::jsonb),

-- Featured District Settings
('featured_district', '{
  "district_name": "Pasig",
  "tagline": "Featured District",
  "headline": "The Pasig Collection.",
  "description": "Pasig City stands as Metro Manila''s residential sweet spot—blending central business accessibility to Ortigas, Bonifacio Global City, and Quezon City with expansive resort-inspired developments. The air is clear, corridors are wider, and long-term capital appreciation has consistently outpaced surrounding submarkets.",
  "projects_count": 12,
  "entry_price": "₱4.8M+",
  "image_url": ""
}'::jsonb)

ON CONFLICT (key) DO NOTHING;
