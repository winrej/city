-- Migration: Add project_buildings table
-- Run in Supabase SQL editor

CREATE TABLE IF NOT EXISTS public.project_buildings (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name          text NOT NULL,
  description   text,
  floors        text,
  total_units   text,
  status        text NOT NULL DEFAULT 'Under Construction'
                  CHECK (status IN ('Under Construction', 'Coming Soon', 'RFO')),
  image_url     text,
  display_order integer NOT NULL DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);

ALTER TABLE public.project_buildings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view project buildings" ON public.project_buildings;
CREATE POLICY "Anyone can view project buildings"
  ON public.project_buildings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage project buildings" ON public.project_buildings;
CREATE POLICY "Admins can manage project buildings"
  ON public.project_buildings FOR ALL USING (public.is_admin(auth.uid()));
