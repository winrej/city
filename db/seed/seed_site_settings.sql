-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRATION: Seed site_settings rows
--
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query).
-- Safe to run multiple times — ON CONFLICT DO NOTHING will skip existing rows.
--
-- This does NOT recreate any tables, policies, or triggers.
-- Only adds/skips the CMS settings rows.
-- ═══════════════════════════════════════════════════════════════════════════

insert into public.site_settings (key, value) values

-- General
('general', '{
  "site_name": "CityQlo",
  "tagline": "Smarter Property Decisions in Metro Manila",
  "support_email": "hello@cityqlo.com"
}'::jsonb),

-- Contact
('contact', '{
  "phone": "",
  "whatsapp": "",
  "viber": "",
  "messenger": "",
  "email": "contact@cityqlo.com",
  "address": "Metro Manila, Philippines"
}'::jsonb),

-- Homepage — Hero, Founder, Team Member, Stats
('homepage', '{
  "hero_media_type": "image",
  "hero_image_url": "",
  "hero_video_url": "",
  "hero_eyebrow": "CityQlo \u00b7 Metro Manila",
  "hero_headline_1": "Find the right",
  "hero_headline_2": "property.",
  "hero_headline_sub": "Not just another condo.",
  "hero_lede": "Helping Filipino professionals, investors, and OFWs make smarter property decisions \u2014 with guidance, not pressure.",
  "hero_cta_text": "Book consultation",
  "hero_cta_link": "/contact",
  "hero_secondary_cta_text": "Why invest",
  "hero_secondary_cta_link": "/why-invest",
  "hero_badge_1_bold": "Goal-first",
  "hero_badge_1_regular": "advisory",
  "hero_badge_2_bold": "DMCI",
  "hero_badge_2_regular": "specialists",
  "hero_badge_3_bold": "OFW",
  "hero_badge_3_regular": "friendly",
  "hero_badge_4_bold": "No-pressure",
  "hero_badge_4_regular": "consultations",
  "founder_eyebrow": "Founder",
  "founder_headline": "A quieter way to invest.",
  "founder_lede": "CityQlo began with a simple frustration: Filipino buyers deserved an advisor \u2014 not another salesperson. We exist to give that conversation back to families and OFWs planning for the long run.",
  "founder_cta_text": "Read our story",
  "founder_cta_link": "/about",
  "founder_image_url": "",
  "enable_team_member": false,
  "team_member_name": "",
  "team_member_role": "",
  "team_member_bio": "",
  "team_member_image_url": "",
  "stat_1_val": "12+",
  "stat_1_desc": "Years advising Filipino buyers",
  "stat_2_val": "\u20b12B+",
  "stat_2_desc": "In property value placed",
  "stat_3_val": "98%",
  "stat_3_desc": "Of clients say they\u2019d return"
}'::jsonb),

-- SEO
('seo', '{
  "meta_title": "CityQlo \u2014 Find the Right Property, Not Just Another Condo",
  "meta_description": "Premium property advisory for Filipino professionals, investors, and OFWs. Make smarter property decisions with CityQlo.",
  "og_image_url": "https://cityqlo.com/Logo.png",
  "og_title": "",
  "og_description": "",
  "twitter_title": "",
  "twitter_description": ""
}'::jsonb),

-- Social
('social', '{
  "facebook": "",
  "instagram": "",
  "tiktok": "",
  "youtube": ""
}'::jsonb)

on conflict (key) do nothing;

-- ── Verification query (run after to confirm rows were created) ─────────────
-- select key, updated_at from public.site_settings order by key;
