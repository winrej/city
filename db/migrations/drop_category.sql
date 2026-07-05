-- ============================================================
-- CityQlo — Drop the property/project "category" feature
-- (Metro Core / Suburban Enclaves / Resort & Leisure)
-- Run this in the Supabase SQL Editor.
-- ============================================================

-- Dropping the column also drops its NOT NULL + CHECK constraints.
ALTER TABLE public.projects   DROP COLUMN IF EXISTS category;
ALTER TABLE public.properties DROP COLUMN IF EXISTS category;
