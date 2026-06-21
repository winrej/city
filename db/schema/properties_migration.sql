-- ============================================================
-- CityQlo — Properties Table Migration
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Create the properties table
CREATE TABLE IF NOT EXISTS public.properties (
  id              uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  name            text        NOT NULL,
  slug            text        NOT NULL UNIQUE,
  developer       text        NOT NULL DEFAULT 'DMCI Homes',
  city            text        NOT NULL,
  location        text        NOT NULL,
  price_display     text        NOT NULL DEFAULT '',
  price_min         numeric     NOT NULL DEFAULT 0 CHECK (price_min >= 0),
  price_max         numeric     NOT NULL DEFAULT 0 CHECK (price_max >= 0),
  price_max_display text        NOT NULL DEFAULT '',
  status          text        NOT NULL DEFAULT 'Pre-selling'
                              CHECK (status IN ('Pre-selling', 'RFO')),
  beds            integer     NOT NULL DEFAULT 1,
  baths           numeric     NOT NULL DEFAULT 1,
  area            text        NOT NULL DEFAULT '',
  unit_types      text[]      NOT NULL DEFAULT '{}',
  description     text        NOT NULL DEFAULT '',
  highlights      jsonb       NOT NULL DEFAULT '[]',
  category        text        NOT NULL DEFAULT 'Metro Core'
                              CHECK (category IN ('Metro Core', 'Suburban Enclaves', 'Resort & Leisure')),
  image_url       text,
  is_featured     boolean     NOT NULL DEFAULT false,
  is_active       boolean     NOT NULL DEFAULT true,
  is_deleted      boolean     NOT NULL DEFAULT false,
  display_order   integer     NOT NULL DEFAULT 0,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- 2. Indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_properties_slug
  ON public.properties (slug);

CREATE INDEX IF NOT EXISTS idx_properties_public
  ON public.properties (is_active, is_deleted, display_order);

CREATE INDEX IF NOT EXISTS idx_properties_featured
  ON public.properties (is_featured, is_active, is_deleted);

-- 3. Row Level Security
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Public can only read active + non-deleted rows
DROP POLICY IF EXISTS "Public can read active properties" ON public.properties;
CREATE POLICY "Public can read active properties"
  ON public.properties
  FOR SELECT
  USING (is_active = true AND is_deleted = false);

-- Authenticated users (admins) can do everything
DROP POLICY IF EXISTS "Admins can manage all properties" ON public.properties;
CREATE POLICY "Admins can manage all properties"
  ON public.properties
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4. Updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_properties_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_properties_updated_at ON public.properties;
CREATE TRIGGER trg_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION public.handle_properties_updated_at();

-- ============================================================
-- 5. Seed Data — All 28 hardcoded properties from properties.tsx
-- ============================================================

INSERT INTO public.properties
  (name, slug, developer, city, location, price_display, price_min, status,
   beds, baths, area, description, highlights, category, display_order)
VALUES
-- PASIG (3)
('The Valeron Tower',   'valeron-tower',   'DMCI Homes & Marubeni JV', 'C-5, Pasig City',               'Pasig',          '₱7.0M',  7.0,  'Pre-selling', 2, 2,   '62.0 sq.m.', 'A prestigious 55-storey high-rise development along the C-5 corridor in Brgy. Ugong. Built in partnership with Marubeni Corporation, blending Japanese quality checks with resort-style living.',                       '["Marubeni quality inspection","C-5 prime road access","Modern Artisanal architecture","Sky deck gardens"]',           'Metro Core',         10),
('Allegra Garden Place','allegra-garden',  'DMCI Homes',               'Pasig Boulevard, Pasig City',   'Pasig',          '₱5.0M',  5.0,  'Pre-selling', 2, 1.5, '57.0 sq.m.', 'A Moroccan-inspired dual-tower sanctuary bringing lush greenery, cross-ventilation, and refreshing pool areas to Pasig Boulevard.',                                                                                       '["Modern Moroccan architecture","Multi-tiered sky gardens","Strategic bridge links","Lounge pool & leisure areas"]',   'Metro Core',         20),
('Satori Residences',   'satori-residences','DMCI Homes',              'F. Pasco Ave, Santolan, Pasig City','Pasig',       '₱4.4M',  4.4,  'RFO',         1, 1,   '38.5 sq.m.', 'A Neo-Asian Minimalist residential enclave offering a tranquil resort escape from the urban rush, featuring generous open spaces and gardens.',                                                                             '["Neo-Asian minimalist theme","LRT-2 Santolan access","Spacious central atrium","Cross-ventilation hallways"]',         'Metro Core',         30),

-- QUEZON CITY (4)
('One Delta Terraces',  'one-delta-terraces','DMCI Homes',             'West Triangle, Quezon City',    'Quezon City',    '₱7.0M',  7.0,  'Pre-selling', 2, 2,   '54.0 sq.m.', 'A brand-new premium high-rise development rising at the corner of West Avenue and Quezon Avenue, offering urban luxury and unparalleled transit connectivity.',                                                              '["MRT-3 & Metro Manila Subway access","Chic modern aesthetics","Low-density privacy","Rooftop lounge bar"]',           'Metro Core',         40),
('The Erin Heights',    'erin-heights',    'DMCI Homes',               'Commonwealth Ave, Quezon City', 'Quezon City',    '₱5.1M',  5.1,  'Pre-selling', 2, 1.5, '56.5 sq.m.', 'Modern high-rise enclave located at Commonwealth and Tandang Sora Avenue, featuring Lumiventt natural air and light technology.',                                                                                             '["Future MRT-7 transit link","Commonwealth lifestyle corridor","Sky patio and leisure decks","Resort-style pool systems"]','Metro Core',      50),
('The Crestmont',       'crestmont',       'DMCI Homes',               'South Triangle, Quezon City',   'Quezon City',    '₱6.5M',  6.5,  'RFO',         3, 2,   '84.5 sq.m.', 'A modern boutique high-rise condominium in Quezon City''s lifestyle hub, designed for young professionals and growing families.',                                                                                               '["MRT-3 Quezon Ave access","Boutique, low-density layout","Turnkey rental potential","Panoramic city views"]',         'Metro Core',         60),
('The Oriana',          'oriana',          'DMCI Homes',               'Aurora Blvd, Quezon City',      'Quezon City',    '₱5.0M',  5.0,  'RFO',         2, 1.5, '54.5 sq.m.', 'Transit-oriented twin tower along Aurora Boulevard configured with breeze-conducting sky patios, active-play courts, and natural daylighting.',                                                                                   '["LRT-2 Anonas & Katipunan access","Lumiventt technology ventilation","Dual-tower privacy","Rooftop deck bar"]',       'Metro Core',         70),

-- TAGUIG (2)
('Mulberry Place',      'mulberry-place',  'DMCI Homes',               'Acacia Estates, Taguig City',   'Taguig / BGC',   '₱7.6M',  7.6,  'Pre-selling', 3, 2,   '64.5 sq.m.', 'An Asian-Polynesian-themed tropical resort sanctuary nestled inside the secure residential community of Acacia Estates, Taguig.',                                                                                               '["Acacia Estates gated security","Asian-Polynesian aesthetic","Low-rise building vibe","Clubhouse and kid-friendly pools"]','Metro Core',     80),
('Alder Residences',    'alder-residences','DMCI Homes',               'Acacia Estates, Taguig City',   'Taguig / BGC',   '₱7.4M',  7.4,  'RFO',         2, 2,   '67.0 sq.m.', 'Premium modern high-rise sanctuary inside Acacia Estates, configured with curated wellness amenities, expansive gardens, and spacious unit layouts.',                                                                          '["Acacia Estates prime address","Wellness & fitness amenities","Move-in ready units","Highly secure environment"]',    'Metro Core',         90),

-- MANDALUYONG (1)
('Sage Residences',     'sage-residences', 'DMCI Homes',               'Mauway, Mandaluyong City',      'Mandaluyong',    '₱6.5M',  6.5,  'Pre-selling', 2, 2,   '58.0 sq.m.', 'A high-rise tower rising in the heart of Mandaluyong''s residential district, featuring natural ventilation design, multi-tiered gardens, and premium unit configurations.',                                                    '["Mandaluyong central location","Lumiventt natural breeze system","Rooftop observation sky deck","Co-working space lounges"]','Metro Core',  100),

-- MAKATI (1)
('Fortis Residences',   'fortis-residences','DMCI Homes',              'Chino Roces Ave, Makati City',  'Makati',         '₱14.0M', 14.0, 'Pre-selling', 2, 2,   '72.5 sq.m.', 'A luxury-class residential tower located in the emerging Chino Roces creative district, featuring high-end fixtures, bespoke concierge, and smart-home features.',                                                               '["Makati CBD proximity","Luxury architectural finish","Bespoke concierge services","Smart-home ready layouts"]',       'Metro Core',         110),

-- SUBURBAN / EXTRA (14)
('Alea Residences',     'alea-residences', 'DMCI Homes',               'Bacoor, Cavite',                'Bacoor',         '₱4.2M',  4.2,  'RFO',         2, 1,   '62.0 sq.m.', 'First medium-rise development of DMCI Homes in Bacoor, Cavite. Nestled in a quiet location yet highly accessible to major thoroughfares.',                                                                                      '["Neo-Asian Balinese design","Near CAVITEX and Emilio Aguinaldo Hwy","Large central gardens","Secure gated community"]','Suburban Enclaves',120),
('Bristle Ridge',       'bristle-ridge',   'DMCI Homes',               'Pacdal Road, Baguio City',      'Baguio City',    '₱6.8M',  6.8,  'RFO',         2, 2,   '56.5 sq.m.', 'A country-club style mid-rise residential community nestled along Pacdal Road, Baguio City. Immersed in pine-scented cool mountain air.',                                                                                       '["Panoramic view of Baguio hills","Fireplace lounge areas","Close to Wright Park & The Mansion","Modern country aesthetics"]','Resort & Leisure',130),
('Willow Park Homes',   'willow-park',     'DMCI Homes',               'Cabuyao, Laguna',               'Cabuyao, Laguna','₱4.5M',  4.5,  'RFO',         3, 2,   '130.0 sq.m.','A low-density residential village in Cabuyao, Laguna, offering modern house & lot packages with vast tropical open green spaces.',                                                                                               '["House & lot ownership","Secured suburban environment","Laguna de Bay breeze access","Integrated active-play court"]', 'Suburban Enclaves',  140),
('The Calinea Tower',   'calinea-tower',   'DMCI Homes',               'Grace Park, Caloocan City',     'Caloocan',       '₱5.2M',  5.2,  'Pre-selling', 1, 1,   '34.0 sq.m.', 'A modern resort-style high-rise residence rising in the heart of Caloocan''s thriving commercial district, maximizing comfort and space.',                                                                                      '["LRT-1 Monumento proximity","High-growth commercial hub","Lumiventt technology corridors","Sky deck observations"]',  'Metro Core',         150),
('Kalea Heights',       'kalea-heights',   'DMCI Homes',               'Guadalupe, Cebu City',          'Cebu City',      '₱6.0M',  6.0,  'Pre-selling', 2, 1.5, '52.0 sq.m.', 'DMCI Homes'' flagship high-rise development in Cebu City, combining premium residential spaces with natural cross-ventilation structures.',                                                                                       '["Flagship Cebu development","Guadalupe prime address","Spectacular ocean & city views","Multi-tiered pool systems"]', 'Metro Core',         160),
('Verdon Parc',         'verdon-parc',     'DMCI Homes',               'Ecoland Drive, Davao City',     'Davao City',     '₱4.1M',  4.1,  'RFO',         2, 2,   '56.5 sq.m.', 'A sprawling resort-themed mid-to-high rise community along Ecoland Drive, offering a relaxing nature sanctuary right in Davao City.',                                                                                          '["Sprawling resort pool area","Central location in Ecoland","Stunning Mount Apo views","Lush gardens and walking trails"]','Metro Core',    170),
('Sonora Garden Residences','sonora-garden','DMCI Homes',              'Alabang-Zapote Road, Las Piñas', 'Las Piñas',     '₱5.6M',  5.6,  'Pre-selling', 2, 2,   '58.5 sq.m.', 'A modern resort-style condominium project in Las Piñas City, offering direct access to key business hubs, shopping, and dynamic school centers.',                                                                               '["Alabang-Zapote Rd address","Robinsons Place Las Piñas link","Lumiventt structural styling","Refreshing pool systems"]','Suburban Enclaves',180),
('Alta Vista de Boracay','alta-vista-boracay','DMCI Homes',            'Yapak, Boracay Island',         'Malay',          '₱8.5M',  8.5,  'RFO',         2, 2,   '62.0 sq.m.', 'A prestigious hillside residential resort complex in Boracay Island, featuring classic Southeast Asian-inspired villa design.',                                                                                                  '["Hillside vista over Boracay","Exclusive private beach access","Shuttle service to white sand","Premium resort-style operation"]','Resort & Leisure',190),
('The Camden Place',    'camden-place',    'DMCI Homes',               'Pandacan, Manila',              'Manila',         '₱5.3M',  5.3,  'Pre-selling', 2, 1.5, '54.5 sq.m.', 'A modern mid-to-high rise tower rising in Pandacan, Manila, designed to bring relaxing resort-inspired living close to capital school systems.',                                                                                  '["Near Manila educational centers","High rental demand profile","Breeze-conducting sky patios","Secured residential vibe"]','Metro Core',   200),
('Rhapsody Residences', 'rhapsody-residences','DMCI Homes',            'East Service Road, Muntinlupa', 'Muntinlupa',     '₱4.8M',  4.8,  'RFO',         2, 1,   '54.0 sq.m.', 'A resort-like mid-rise residential community along East Service Road, Muntinlupa, highlighted by its Neo-Asian architecture and extensive gardens.',                                                                               '["East Service Rd access","Sprawling active clubhouse","Lush gardens and pathways","Chic Neo-Asian build"]',           'Suburban Enclaves',  210),
('The Atherton',        'atherton',        'DMCI Homes',               'Dr. A. Santos Ave, Parañaque',  'Parañaque',      '₱5.8M',  5.8,  'RFO',         2, 2,   '56.0 sq.m.', 'A modern resort-style high-rise development on Dr. A. Santos Ave, offering refreshing greenery, cross-ventilation, and easy southern route links.',                                                                              '["SLEX & Sucat Rd link","Generous pool & play spaces","Lumiventt architecture layout","Turnkey moves possible"]',     'Suburban Enclaves',  220),
('Anissa Heights',      'anissa-heights',  'DMCI Homes',               'P. Zamora St, Pasay City',      'Pasay',          '₱4.5M',  4.5,  'Pre-selling', 1, 1,   '28.0 sq.m.', 'A transit-oriented mid-rise condominium development in Zamors St, Pasay City, providing quick access to Manila CBDs and airport terminals.',                                                                                    '["NAIA airport proximity","Transit-oriented Zamora link","Bespoke security checks","Great leasing opportunity"]',     'Metro Core',         230),
('Solmera Coast',       'solmera-coast',   'DMCI Homes',               'San Juan, Batangas',            'San Juan, Batangas','₱7.2M',7.2, 'Pre-selling', 2, 1.5, '52.0 sq.m.', 'The premier tropical beach park condominium by DMCI Homes in San Juan, Batangas. An exceptional investment for leisure and rental returns.',                                                                                     '["Direct beach front access","Batangas resort destination","Lease-back rental programs","Exclusive country club amenities"]','Resort & Leisure',240),
('Moncello Crest',      'moncello-crest',  'DMCI Homes',               'Tuba, Benguet',                 'Tuba, Benguet',  '₱6.5M',  6.5,  'Pre-selling', 2, 2,   '58.0 sq.m.', 'A premium mountain lodge resort condominium in Tuba, Benguet, offering cozy modern spaces surrounded by stunning pine forests and cool weather.',                                                                                 '["High altitude fresh climate","Modern lodge architecture","Breathtaking mountain ridges","Short drive from Baguio City"]','Resort & Leisure',250)

ON CONFLICT (slug) DO NOTHING;
