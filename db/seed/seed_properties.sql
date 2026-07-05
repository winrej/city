-- =============================================================================
-- CityQlo CMS — Seed: Sonora Garden Residences
-- Run this against your Supabase project (SQL Editor or psql)
-- Idempotent: uses INSERT … ON CONFLICT DO NOTHING / DO UPDATE
-- =============================================================================
-- Schema reference (supabase_schema.sql):
--   • projects.category CHECK IN ('Metro Core','Suburban Enclaves','Resort & Leisure')
--   • projects has NO description column (store in project_meta of read model)
--   • project_sections uses display_order (not sort_order)
--   • project_units uses display_order (not sort_order)
--   • project_read_models has NO compiled_at column; use updated_at
--   • section_type keys already seeded: hero, emotional-hook, pricing-snapshot,
--     project-overview, highlights, amenities, location-map, unit-types,
--     decision-guide, media-experience, testimonials-slider, faq-list, lead-capture
-- =============================================================================

-- ─── 0. Ensure extra section types exist (idempotent) ────────────────────────
-- 'related' and underscore-alias keys are NOT in the base schema.
-- We add them safely here so subquery lookups below don't fail.

INSERT INTO section_types (key, name, description, schema_version) VALUES
  ('related', 'Related Projects', 'Similar project card grid', '1.0')
ON CONFLICT (key) DO NOTHING;

-- ─── 1. Project Record ───────────────────────────────────────────────────────

INSERT INTO projects (
  id,
  slug,
  title,
  developer,
  location_district,
  city,
  full_address,
  status,
  architectural_theme,
  land_area,
  floors,
  total_units,
  turnover,
  min_price,
  max_price,
  meta_title,
  meta_description,
  published_at,
  created_at,
  updated_at
) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'sonora-garden',
  'Sonora Garden Residences',
  'DMCI Homes',
  'Las Piñas City',
  'Las Piñas',
  'Alabang-Zapote Road, Pamplona Tres, Las Piñas City',
  'published',
  'Modern Resort Tropical',
  '1.8 Hectares',
  '5–7 Floors (Low-Rise Cluster)',
  '1,152 Units',
  '2027–2028',
  4500000,
  13500000,
  'Sonora Garden Residences — Las Piñas City · CityQlo',
  'Sonora Garden Residences by DMCI Homes in Las Piñas. Pre-selling condominium starting from ₱4.5M. Get your free price list and payment computation today.',
  NOW(),
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  title               = EXCLUDED.title,
  developer           = EXCLUDED.developer,
  location_district   = EXCLUDED.location_district,
  city                = EXCLUDED.city,
  full_address        = EXCLUDED.full_address,
  architectural_theme = EXCLUDED.architectural_theme,
  land_area           = EXCLUDED.land_area,
  floors              = EXCLUDED.floors,
  total_units         = EXCLUDED.total_units,
  turnover            = EXCLUDED.turnover,
  min_price           = EXCLUDED.min_price,
  max_price           = EXCLUDED.max_price,
  meta_title          = EXCLUDED.meta_title,
  meta_description    = EXCLUDED.meta_description,
  updated_at          = NOW();

-- ─── 2. Project Units ────────────────────────────────────────────────────────

DELETE FROM project_units WHERE project_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

INSERT INTO project_units (
  project_id, name, area_sqm, starting_price,
  description, profile_target, display_order
) VALUES
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Studio', 23.0, 4500000,
    'Efficient, modern studio layouts ideal for young professionals looking for a prime Las Piñas address.',
    'Single Professionals & Investors',
    1
  ),
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    '1-Bedroom', 37.0, 6800000,
    'Spacious 1BR units with dedicated living areas, perfect for couples or as a rental income property.',
    'Couples & Passive Income Investors',
    2
  ),
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    '2-Bedroom', 58.5, 9200000,
    'Our most popular layout — generous living spaces with full amenity access for growing families.',
    'Small Families & OFW Investors',
    3
  ),
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    '3-Bedroom', 84.0, 13500000,
    'Premium 3BR units with expansive floor plans, designed for families upsizing to resort-caliber living.',
    'Growing Families & Upsizing Homeowners',
    4
  );

-- ─── 3. Project Sections ─────────────────────────────────────────────────────
-- Keyed against the section_types already seeded in supabase_schema.sql.

DELETE FROM project_sections WHERE project_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

-- 3a. Hero
INSERT INTO project_sections (project_id, section_type_id, display_order, payload) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  (SELECT id FROM section_types WHERE key = 'hero'),
  10,
  '{
    "tagline": "Resort Living. Urban Access. One Address.",
    "hero_images": [],
    "cta_primary_text": "Request Price List",
    "cta_secondary_text": "Free Computation"
  }'::jsonb
);

-- 3b. Emotional Hook  (key: emotional-hook)
INSERT INTO project_sections (project_id, section_type_id, display_order, payload) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  (SELECT id FROM section_types WHERE key = 'emotional-hook'),
  20,
  '{
    "headline": "Wake up 5 minutes from Alabang''s business core —",
    "sub": "where your workday begins, and your home feels like a resort escape.",
    "eyebrow": "The Sonora Lifestyle",
    "points": [
      "Skip the commute — Alabang CBD is 5 minutes away",
      "Come home to a lap pool, not rush-hour traffic",
      "Robinsons Las Piñas is just steps from your door",
      "World-class hospitals within a 10-minute drive"
    ]
  }'::jsonb
);

-- 3c. Pricing  (key: pricing-snapshot)
INSERT INTO project_sections (project_id, section_type_id, display_order, payload) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  (SELECT id FROM section_types WHERE key = 'pricing-snapshot'),
  30,
  '{
    "title": "Pricing",
    "sub_title": "for as low as",
    "description": "Pre-selling prices are currently at their lowest. Every quarter brings a price increase as construction progresses.",
    "show_urgency": true,
    "urgency_text_1": "Prices are expected to increase every quarter as construction milestones are reached.",
    "urgency_text_2": "Selected floors and unit types are selling fast. Secure your preferred floor while available."
  }'::jsonb
);

-- 3d. Overview  (key: project-overview)
INSERT INTO project_sections (project_id, section_type_id, display_order, payload) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  (SELECT id FROM section_types WHERE key = 'project-overview'),
  40,
  '{
    "title": "Project Overview",
    "headline_span": "Sonora Garden."
  }'::jsonb
);

-- 3e. Highlights  (key: highlights)
INSERT INTO project_sections (project_id, section_type_id, display_order, payload) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  (SELECT id FROM section_types WHERE key = 'highlights'),
  50,
  '{
    "eyebrow": "Why Sonora Garden",
    "items": [
      { "icon": "trees",       "title": "Resort-Inspired Living",   "description": "Lush landscaping, resort pools, and tropical gardens create a permanent vacation atmosphere." },
      { "icon": "mappin",      "title": "Strategic Location",        "description": "Prime Alabang-Zapote Road address with direct access to business, malls, and transport." },
      { "icon": "shoppingbag", "title": "Commercial Convenience",    "description": "Robinsons Las Piñas is steps away — groceries, dining, and entertainment at your doorstep." },
      { "icon": "zap",         "title": "Lumiventt Technology",      "description": "DMCI''s patented design delivers natural cross-ventilation and natural daylighting to every unit." },
      { "icon": "building2",   "title": "Spacious Unit Layouts",     "description": "Larger-than-average floor plans maximizing livable space and natural light in every room." },
      { "icon": "award",       "title": "DMCI Homes Quality",        "description": "Backed by a 70-year legacy of construction excellence and quality residential developments." }
    ]
  }'::jsonb
);

-- 3f. Amenities  (key: amenities)
INSERT INTO project_sections (project_id, section_type_id, display_order, payload) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  (SELECT id FROM section_types WHERE key = 'amenities'),
  60,
  '{
    "eyebrow": "Community",
    "intro": "Everything you need for a complete, resort-caliber life — all within Sonora Garden.",
    "items": [
      { "name": "Lap Pool",              "description": "Olympic-length resort pool for fitness and leisure",          "icon": "waves",    "category": "wellness"   },
      { "name": "Leisure Pool",          "description": "Relaxing shallow-entry pool with lounge deck",               "icon": "waves",    "category": "recreation" },
      { "name": "Fitness Gym",           "description": "Fully equipped air-conditioned gym with modern equipment",    "icon": "dumbbell", "category": "wellness"   },
      { "name": "Sky Promenade",         "description": "Elevated landscaped walkway with panoramic views",           "icon": "trees",    "category": "recreation" },
      { "name": "Children''s Playground","description": "Safe, shaded play area for young residents",                 "icon": "users",    "category": "social"     },
      { "name": "Function Rooms",        "description": "Multi-purpose event spaces for private gatherings",          "icon": "coffee",   "category": "social"     },
      { "name": "Landscaped Gardens",    "description": "Lush tropical gardens and relaxation spaces",                "icon": "trees",    "category": "recreation" },
      { "name": "24/7 Security",         "description": "Round-the-clock CCTV monitoring and roving guards",          "icon": "shield",   "category": "utility"    },
      { "name": "Grand Lobby",           "description": "Hotel-inspired reception lobby with concierge desk",         "icon": "building2","category": "utility"    },
      { "name": "High-Speed Elevators",  "description": "Multiple passenger elevators per building cluster",          "icon": "zap",      "category": "utility"    },
      { "name": "Covered Parking",       "description": "Ample parking for residents and guests",                     "icon": "car",      "category": "utility"    },
      { "name": "Lumiventt Tech",        "description": "DMCI''s signature natural light and ventilation design system","icon": "zap",   "category": "wellness"   }
    ]
  }'::jsonb
);

-- 3g. Location / Nearby  (key: location-map)
INSERT INTO project_sections (project_id, section_type_id, display_order, payload) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  (SELECT id FROM section_types WHERE key = 'location-map'),
  70,
  '{
    "eyebrow": "Location Advantage",
    "intro": "Sonora Garden''s Alabang-Zapote Road address puts the entire South Metro at your doorstep — schools, hospitals, malls, and business hubs within minutes.",
    "map_label": "Alabang-Zapote Road, Las Piñas",
    "maps_url": "https://maps.google.com/?q=Sonora+Garden+Residences+Las+Pinas",
    "nearby": [
      { "name": "Robinsons Place Las Piñas",       "time": "2 min walk", "category": "mall"     },
      { "name": "SM City Southmall",               "time": "8 mins",     "category": "mall"     },
      { "name": "Alabang Town Center",             "time": "10 mins",    "category": "mall"     },
      { "name": "Las Piñas General Hospital",      "time": "5 mins",     "category": "hospital" },
      { "name": "Asian Hospital & Medical Center", "time": "12 mins",    "category": "hospital" },
      { "name": "St. Scholastica''s College Manila","time": "10 mins",   "category": "school"   },
      { "name": "De La Salle University Dasmariñas","time": "18 mins",   "category": "school"   },
      { "name": "Alabang CBD (Filinvest)",         "time": "5 mins",     "category": "business" },
      { "name": "Makati CBD",                      "time": "25 mins",    "category": "business" },
      { "name": "BGC / Fort Bonifacio",            "time": "30 mins",    "category": "business" },
      { "name": "NAIA International Airport",      "time": "15 mins",    "category": "transit"  },
      { "name": "Las Piñas Bus Terminal",          "time": "3 mins",     "category": "transit"  }
    ]
  }'::jsonb
);

-- 3h. Units  (key: unit-types)
INSERT INTO project_sections (project_id, section_type_id, display_order, payload) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  (SELECT id FROM section_types WHERE key = 'unit-types'),
  80,
  '{
    "eyebrow": "Unit Configurations",
    "headline": "Choose Your Space"
  }'::jsonb
);

-- 3i. Decision Guide  (key: decision-guide)
INSERT INTO project_sections (project_id, section_type_id, display_order, payload) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  (SELECT id FROM section_types WHERE key = 'decision-guide'),
  90,
  '{
    "eyebrow": "Decision Guide",
    "headline": "Which unit is",
    "headline_accent": "right for you?"
  }'::jsonb
);

-- 3j. Media Gallery  (key: media-experience)
INSERT INTO project_sections (project_id, section_type_id, display_order, payload) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  (SELECT id FROM section_types WHERE key = 'media-experience'),
  100,
  '{
    "eyebrow": "Media",
    "photos": [],
    "videos": [
      { "title": "Project Walkthrough",  "duration": "3:24" },
      { "title": "Amenity Tour",         "duration": "2:08" },
      { "title": "Virtual Unit Preview", "duration": "4:15" }
    ],
    "downloads": [
      { "name": "Project Brochure", "size": "PDF · 4.2 MB", "icon": "📋" },
      { "name": "Floor Plans",      "size": "PDF · 8.5 MB", "icon": "📐" },
      { "name": "Payment Terms",    "size": "PDF · 1.1 MB", "icon": "💳" },
      { "name": "Location Map",     "size": "PDF · 2.3 MB", "icon": "🗺️" }
    ]
  }'::jsonb
);

-- 3k. Testimonials  (key: testimonials-slider)
INSERT INTO project_sections (project_id, section_type_id, display_order, payload) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  (SELECT id FROM section_types WHERE key = 'testimonials-slider'),
  110,
  '{
    "stats": [
      { "value": "1,200+", "label": "Inquiries handled"       },
      { "value": "₱2B+",   "label": "Property value placed"   },
      { "value": "98%",    "label": "Client satisfaction rate" }
    ],
    "testimonials": [
      { "name": "Maria Santos",  "role": "OFW Investor, Dubai",       "quote": "CityQlo made the entire process seamless from abroad. No pressure, just clear advice. I closed my unit in 2 weeks." },
      { "name": "James Reyes",   "role": "First-Time Buyer, Alabang", "quote": "I was nervous about buying my first property. My advisor walked me through everything — payment terms, bank loan options, all of it." },
      { "name": "Carla Mendoza", "role": "Property Investor, Makati", "quote": "Already on my third unit through CityQlo. The team consistently finds properties that match my investment goals." }
    ]
  }'::jsonb
);

-- 3l. FAQ  (key: faq-list)
INSERT INTO project_sections (project_id, section_type_id, display_order, payload) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  (SELECT id FROM section_types WHERE key = 'faq-list'),
  120,
  '{
    "items": [
      { "q": "Where is Sonora Garden Residences located?",             "a": "Sonora Garden Residences is strategically located along Alabang-Zapote Road, Pamplona Tres, Las Piñas City — directly adjacent to Robinsons Place Las Piñas and minutes from the Alabang business district." },
      { "q": "What unit types are available?",                         "a": "We offer Studio (23 sq.m.), 1-Bedroom (37 sq.m.), 2-Bedroom (58.5 sq.m.), and 3-Bedroom (84 sq.m.) units." },
      { "q": "Is Sonora Garden Residences pre-selling or RFO?",        "a": "Sonora Garden Residences is currently in its Pre-Selling phase with projected turnover in 2027–2028. This is an ideal time to invest as prices are at their lowest." },
      { "q": "How can I schedule a property viewing or presentation?", "a": "Fill out the inquiry form below or send us a message via WhatsApp/Viber and we''ll coordinate a personal property presentation at your preferred schedule — no obligation required." },
      { "q": "How do I request a free payment computation?",           "a": "Simply submit your name and contact number in our lead form and we''ll prepare a personalized computation (bank loan, in-house, PAG-IBIG) within 24 hours." },
      { "q": "Are there any additional fees beyond the unit price?",   "a": "When you purchase through CityQlo, you pay the official developer price — no mark-ups, no hidden fees. We provide full transparency on all transaction costs including transfer fees, notarial fees, and association dues." },
      { "q": "Can OFWs purchase units in Sonora Garden?",             "a": "Absolutely. We specialize in assisting OFW buyers with remote processing, SPA documentation, and PAG-IBIG fund applications. Many of our clients are OFW investors." }
    ]
  }'::jsonb
);

-- 3m. Lead Capture  (key: lead-capture)
INSERT INTO project_sections (project_id, section_type_id, display_order, payload) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  (SELECT id FROM section_types WHERE key = 'lead-capture'),
  130,
  '{
    "eyebrow": "Get Started Today",
    "headline": "Interested in",
    "headline_accent": "Sonora Garden?",
    "sub": "Leave your details and we''ll prepare your personalized price list and payment computation within 24 hours.",
    "unit_options": ["Studio", "1-Bedroom", "2-Bedroom", "3-Bedroom", "Price List Only"]
  }'::jsonb
);

-- 3n. Related Projects  (key: related — inserted in step 0 above)
INSERT INTO project_sections (project_id, section_type_id, display_order, payload) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  (SELECT id FROM section_types WHERE key = 'related'),
  140,
  '{
    "related_slugs": ["allegra-garden", "satori-residences", "atherton"]
  }'::jsonb
);

-- ─── 4. Initial Read Model Cache Row ─────────────────────────────────────────
-- The Edge worker will overwrite this on the first publish cycle.
-- The content_payload embeds description (not a projects column) in project_meta.

INSERT INTO project_read_models (
  project_id,
  slug,
  content_payload,
  version_id
)
SELECT
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'sonora-garden',
  jsonb_build_object(
    'api_version',    '1.2',
    'schema_version', '2026-06',
    'generated_at',   NOW()::text,
    'project_meta', jsonb_build_object(
      'id',                 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      'title',              'Sonora Garden Residences',
      'slug',               'sonora-garden',
      'developer',          'DMCI Homes',
      'location_district',  'Las Piñas City',
      'city',               'Las Piñas',
      'full_address',       'Alabang-Zapote Road, Pamplona Tres, Las Piñas City',
      'status',             'Pre-selling',
      'architectural_theme','Modern Resort Tropical',
      'land_area',          '1.8 Hectares',
      'floors',             '5–7 Floors (Low-Rise Cluster)',
      'total_units',        '1,152 Units',
      'turnover',           '2027–2028',
      'description',        'Sonora Garden Residences is DMCI Homes'' premier resort-inspired condominium along the strategic Alabang-Zapote Road in Las Piñas City. Designed with a Modern Resort Tropical architectural theme, it brings a refreshing escape from city life — without leaving the city. Each building is oriented to maximize natural ventilation through DMCI''s signature Lumiventt Technology, delivering cross-breezes and natural light to corridors and common areas.',
      'min_price',          4500000,
      'max_price',          13500000,
      'meta_title',         'Sonora Garden Residences — Las Piñas City · CityQlo',
      'meta_description',   'Sonora Garden Residences by DMCI Homes in Las Piñas. Pre-selling condominium starting from ₱4.5M.'
    ),
    'units', '[]'::jsonb,
    'layout_flow', '[]'::jsonb,
    'landmarks', '[]'::jsonb
  ),
  NULL
ON CONFLICT (slug) DO UPDATE SET
  content_payload = EXCLUDED.content_payload,
  updated_at      = NOW();
