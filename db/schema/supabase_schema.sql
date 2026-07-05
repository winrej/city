-- 1. Profiles Table (Unified UUID Key Strategy)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text default 'agent' check (role in ('super_admin', 'admin', 'editor', 'marketing', 'agent')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  last_login timestamptz
);

alter table public.profiles enable row level security;

-- Security Definer Functions with search_path protection to prevent search-path hijacking
create or replace function public.is_super_admin(user_id uuid)
returns boolean
security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from public.profiles
    where id = user_id and role = 'super_admin'
  );
end;
$$ language plpgsql;

create or replace function public.is_admin(user_id uuid)
returns boolean
security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from public.profiles
    where id = user_id and role in ('super_admin', 'admin')
  );
end;
$$ language plpgsql;

-- Profile RLS Policies
drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Admins and super admins can view all profiles" on public.profiles;
create policy "Admins and super admins can view all profiles"
  on public.profiles for select
  using (public.is_admin(auth.uid()));

drop policy if exists "Users can update own non-role metadata" on public.profiles;
create policy "Users can update own non-role metadata"
  on public.profiles for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id 
    and (role is null or role = (select role from public.profiles where id = auth.uid()))
  );

drop policy if exists "Only super admins can modify roles and all profiles" on public.profiles;
create policy "Only super admins can modify roles and all profiles"
  on public.profiles for all
  using (public.is_super_admin(auth.uid()));

-- 2. Automatic Profile Creation Trigger
create or replace function public.handle_new_user()
returns trigger
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    'agent'
  );
  return new;
end;
$$ language plpgsql;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Inquiries Table (Leads Pipeline with Unified UUID Primary Keys & Soft Delete)
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  role text,
  message text,
  source text default 'website',
  assigned_to uuid references auth.users(id) on delete set null,
  created_by uuid references auth.users(id) on delete set null,
  follow_up_at timestamptz,
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'closed', 'spam')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

alter table public.inquiries enable row level security;

-- Lead RLS Policies
-- SPAM MITIGATION: Public direct SQL inserts are blocked. Leads must be submitted via the server function API which performs Zod validation & verification.
drop policy if exists "Block direct public SQL inserts" on public.inquiries;
create policy "Block direct public SQL inserts"
  on public.inquiries for insert
  with check (false);

drop policy if exists "Admins, assignees, and creators can view and edit leads" on public.inquiries;
create policy "Admins, assignees, and creators can view and edit leads"
  on public.inquiries for all
  using (
    public.is_admin(auth.uid()) or
    assigned_to = auth.uid() or
    created_by = auth.uid()
  );

drop policy if exists "No physical deletes of leads allowed" on public.inquiries;
create policy "No physical deletes of leads allowed"
  on public.inquiries for delete
  using (false);

-- 4. Active Leads View (Enforces RLS at the query level by setting security_invoker = true)
create or replace view public.active_inquiries
  with (security_invoker = true) as
  select * from public.inquiries
  where deleted_at is null;

-- 5. Lead Notes Table (Unified UUID Foreign Keys and Split RLS)
create table if not exists public.lead_notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.inquiries(id) on delete cascade,
  author_id uuid references auth.users(id) on delete set null,
  note text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.lead_notes enable row level security;

drop policy if exists "Admins and assigned/creator users can view notes" on public.lead_notes;
create policy "Admins and assigned/creator users can view notes"
  on public.lead_notes for select
  using (
    public.is_admin(auth.uid()) or
    exists (
      select 1 from public.inquiries i
      where i.id = lead_id
      and (i.assigned_to = auth.uid() or i.created_by = auth.uid())
    )
  );

drop policy if exists "Admins and assigned/creator users can add notes" on public.lead_notes;
create policy "Admins and assigned/creator users can add notes"
  on public.lead_notes for insert
  with check (
    public.is_admin(auth.uid()) or
    exists (
      select 1 from public.inquiries i
      where i.id = lead_id
      and (i.assigned_to = auth.uid() or i.created_by = auth.uid())
    )
  );

-- 6. Site Settings Table
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "Public users can read site settings" on public.site_settings;
create policy "Public users can read site settings"
  on public.site_settings for select
  using (true);

drop policy if exists "Admins can modify site settings" on public.site_settings;
create policy "Admins can modify site settings"
  on public.site_settings for all
  using (public.is_admin(auth.uid()));

-- 7. Updated At Trigger Function
create or replace function public.update_updated_at_column()
returns trigger
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at_column();

create or replace trigger update_inquiries_updated_at
  before update on public.inquiries
  for each row execute procedure public.update_updated_at_column();

create or replace trigger update_lead_notes_updated_at
  before update on public.lead_notes
  for each row execute procedure public.update_updated_at_column();

create or replace trigger update_site_settings_updated_at
  before update on public.site_settings
  for each row execute procedure public.update_updated_at_column();

-- 8. Activity Logs Table
create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity text,
  entity_id text,
  created_at timestamptz default now()
);

alter table public.activity_logs enable row level security;

drop policy if exists "Admins insert logs" on public.activity_logs;
create policy "Admins insert logs"
  on public.activity_logs for insert
  with check (public.is_admin(auth.uid()));

drop policy if exists "Admins view logs" on public.activity_logs;
create policy "Admins view logs"
  on public.activity_logs for select
  using (public.is_admin(auth.uid()));

-- 9. Automatic Audit Logger Trigger for Inquiries Changes
create or replace function public.log_lead_changes()
returns trigger
security definer
set search_path = public
as $$
declare
  current_admin_id uuid;
begin
  current_admin_id := auth.uid();
  if TG_OP = 'UPDATE' then
    if old.status <> new.status then
      insert into public.activity_logs (admin_id, action, entity, entity_id)
      values (current_admin_id, 'status_change_to_' || new.status, 'inquiries', new.id::text);
    end if;
    if old.assigned_to is distinct from new.assigned_to then
      insert into public.activity_logs (admin_id, action, entity, entity_id)
      values (current_admin_id, 'assignment_changed', 'inquiries', new.id::text);
    end if;
    if old.deleted_at is null and new.deleted_at is not null then
      insert into public.activity_logs (admin_id, action, entity, entity_id)
      values (current_admin_id, 'soft_delete', 'inquiries', new.id::text);
    end if;
  elsif TG_OP = 'INSERT' then
    insert into public.activity_logs (admin_id, action, entity, entity_id)
    values (current_admin_id, 'lead_created', 'inquiries', new.id::text);
  end if;
  return new;
end;
$$ language plpgsql;

create or replace trigger audit_lead_changes
  after insert or update on public.inquiries
  for each row execute procedure public.log_lead_changes();

-- 10. Media Table
create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  file_name text,
  file_url text,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);

alter table public.media enable row level security;

drop policy if exists "Admins can manage media records" on public.media;
create policy "Admins can manage media records"
  on public.media for all
  using (public.is_admin(auth.uid()));

-- 11. Database Indexes & Performance Optimization
create index if not exists idx_inquiries_status on public.inquiries(status);
create index if not exists idx_inquiries_source on public.inquiries(source);
create index if not exists idx_inquiries_assigned on public.inquiries(assigned_to);
create index if not exists idx_inquiries_followup on public.inquiries(follow_up_at);
create index if not exists idx_inquiries_deleted on public.inquiries(deleted_at);
create index if not exists idx_inquiries_created on public.inquiries(created_at desc);
create index if not exists idx_lead_notes_lead_id on public.lead_notes(lead_id);
create index if not exists idx_inquiries_status_created on public.inquiries(status, created_at desc);
create index if not exists idx_inquiries_assigned_status on public.inquiries(assigned_to, status);

create index if not exists idx_inquiries_active_only 
  on public.inquiries(created_at desc) 
  where deleted_at is null;

-- ═══════════════════════════════════════════════════════════════════════════
-- 12. Site Settings — Seed Data
--
-- The site_settings table stores all CMS-configurable content as flat
-- JSON objects keyed by section name. Each row's `value` column is JSONB
-- and holds all editable fields for that section.
--
-- Managed by the Admin Portal at /portal/settings (General, Contact, SEO,
-- Social) and /portal/content (Homepage Editor — Hero, Founder, Stats).
--
-- Run this block once on a fresh Supabase project to pre-create all rows.
-- The Admin Portal will upsert into these rows on save.
-- ═══════════════════════════════════════════════════════════════════════════

insert into public.site_settings (key, value) values

-- ── General ──────────────────────────────────────────────────────────────
('general', '{
  "site_name": "CityQlo",
  "tagline": "Smarter Property Decisions in Metro Manila",
  "support_email": "hello@cityqlo.com"
}'::jsonb),

-- ── Contact ──────────────────────────────────────────────────────────────
('contact', '{
  "phone": "",
  "whatsapp": "",
  "messenger": "",
  "email": "contact@cityqlo.com",
  "address": "Metro Manila, Philippines"
}'::jsonb),

-- ── Homepage (Hero + Founder + Stats)
--
--   hero_media_type     : "image" | "video"
--   hero_image_url      : URL to background image (empty = use default asset; used when no carousel slides set)
--   hero_video_url      : URL to background MP4 video (used when media_type = "video")
--   hero_eyebrow        : Small uppercase tagline above the headline
--   hero_headline_1     : First line of the H1 headline
--   hero_headline_2     : Second line of the H1 headline (large emphasis)
--   hero_headline_sub   : Muted sub-line below the headline
--   hero_lede           : Body paragraph text
--   hero_cta_text       : Primary CTA button label
--   hero_cta_link       : Primary CTA button href
--   hero_secondary_cta_text : Secondary CTA button label
--   hero_secondary_cta_link : Secondary CTA button href
--   hero_badge_1_bold … hero_badge_4_regular : Bottom trust bar badges (4 pairs)
--   hero_title_color    : CSS color for headline (empty = white #ffffff)
--   hero_subtitle_color : CSS color for sub-headline (empty = muted #a3a3a3)
--   hero_lede_color     : CSS color for lede paragraph (empty = #d4d4d8)
--   hero_overlay_opacity: 0–1 darkness overlay on hero background (default 0.8)
--
--   carousel_slide_1_url … carousel_slide_4_url :
--       Background image URLs for the autoplay carousel (up to 4 slides).
--       If all four are empty, falls back to hero_image_url or the default asset.
--   carousel_speed_s    : Seconds each carousel slide is shown (default 5, min 2, max 12)
--
--   founder_eyebrow     : Eyebrow label for the Founder section
--   founder_headline    : Headline for the Founder section
--   founder_lede        : Body paragraph for the Founder section
--   founder_cta_text    : CTA link label
--   founder_cta_link    : CTA link href
--   founder_image_url   : Founder photo URL (empty = use default asset)
--
--   enable_team_member  : boolean — show a second team member alongside the founder
--   team_member_name    : Team member display name
--   team_member_role    : Team member role / title
--   team_member_bio     : Team member short bio paragraph
--   team_member_image_url : Team member photo URL (empty = uses founder default)
--
--   stat_1_val … stat_3_val  : "By the Numbers" large metric values (e.g. "12+")
--   stat_1_desc … stat_3_desc: Labels below each metric
-- ─────────────────────────────────────────────────────────────────────────
('homepage', '{
  "hero_media_type": "image",
  "hero_image_url": "",
  "hero_video_url": "",
  "hero_eyebrow": "CityQlo · Metro Manila",
  "hero_headline_1": "Find the right",
  "hero_headline_2": "property.",
  "hero_headline_sub": "Not just another condo.",
  "hero_lede": "Helping Filipino professionals, investors, and OFWs make smarter property decisions — with guidance, not pressure.",
  "hero_cta_text": "Book consultation",
  "hero_cta_link": "/contact",
  "hero_secondary_cta_text": "Why invest",
  "hero_secondary_cta_link": "/why-invest",
  "hero_title_color": "",
  "hero_subtitle_color": "",
  "hero_lede_color": "",
  "hero_overlay_opacity": 0.8,
  "hero_badge_1_bold": "Goal-first",
  "hero_badge_1_regular": "advisory",
  "hero_badge_2_bold": "DMCI",
  "hero_badge_2_regular": "specialists",
  "hero_badge_3_bold": "OFW",
  "hero_badge_3_regular": "friendly",
  "hero_badge_4_bold": "No-pressure",
  "hero_badge_4_regular": "consultations",
  "carousel_slide_1_url": "",
  "carousel_slide_2_url": "",
  "carousel_slide_3_url": "",
  "carousel_slide_4_url": "",
  "carousel_speed_s": 5,
  "founder_eyebrow": "Founder",
  "founder_headline": "A quieter way to invest.",
  "founder_lede": "CityQlo began with a simple frustration: Filipino buyers deserved an advisor — not another salesperson. We exist to give that conversation back to families and OFWs planning for the long run.",
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
  "stat_2_val": "₱2B+",
  "stat_2_desc": "In property value placed",
  "stat_3_val": "98%",
  "stat_3_desc": "Of clients say they\u2019d return"
}'::jsonb),

-- ── SEO ──────────────────────────────────────────────────────────────────
('seo', '{
  "meta_title": "CityQlo — Find the Right Property, Not Just Another Condo",
  "meta_description": "Premium property advisory for Filipino professionals, investors, and OFWs. Make smarter property decisions with CityQlo.",
  "og_image_url": ""
}'::jsonb),

-- ── Social ───────────────────────────────────────────────────────────────
('social', '{
  "facebook": "",
  "instagram": "",
  "tiktok": "",
  "youtube": "",
  "linkedin": "",
  "reddit": ""
}'::jsonb)

on conflict (key) do nothing;
-- Use "on conflict (key) do nothing" so re-running this script on an existing
-- project won't overwrite any admin-customised values.
-- To reset a specific key to defaults, run:
--   delete from public.site_settings where key = 'homepage';
-- then re-run the insert above.


-- 12. Testimonials Table (Unified UUID Key Strategy)
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  message text not null,
  rating integer default 5 check (rating >= 1 and rating <= 5),
  image_url text,
  status text not null default 'draft' check (status in ('published', 'draft')),
  display_order integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.testimonials enable row level security;

-- Testimonials RLS Policies
drop policy if exists "Public users can view published testimonials" on public.testimonials;
create policy "Public users can view published testimonials"
  on public.testimonials for select
  using (status = 'published');

drop policy if exists "Admins can manage testimonials" on public.testimonials;
create policy "Admins can manage testimonials"
  on public.testimonials for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- Trigger for Auto-Updating updated_at
create or replace trigger update_testimonials_updated_at
  before update on public.testimonials
  for each row execute procedure public.update_updated_at_column();

-- Indexes for performance
create index if not exists idx_testimonials_status_order on public.testimonials(status, display_order);

-- Seed premium testimonials (if table is empty)
insert into public.testimonials (name, role, message, rating, status, display_order)
select 'Celestine Cruz', 'Business Owner, Quezon City', 'Navigating Manila''s premium real estate market can be overwhelming. The advisory at CityQlo was direct, objective, and gave us the clarity we needed. No sales pressure, just genuine guidance.', 5, 'published', 0
where not exists (select 1 from public.testimonials);

insert into public.testimonials (name, role, message, rating, status, display_order)
select 'Arch. Marcus Go', 'Design Director, Makati', 'As an architect, I appreciate space and builder quality. CityQlo didn''t just show me floor plans; they provided detailed structural insights and developer track records that made our decision effortless.', 5, 'published', 1
where not exists (select 1 from public.testimonials where name = 'Arch. Marcus Go');

insert into public.testimonials (name, role, message, rating, status, display_order)
select 'Elena & David Vance', 'OFW Investors, Singapore', 'Being based abroad makes purchasing properties challenging. CityQlo kept us informed every step of the way with objective comparisons. They are our trusted eyes on the ground in Manila.', 5, 'published', 2
where not exists (select 1 from public.testimonials where name = 'Elena & David Vance');


-- ═══════════════════════════════════════════════════════════════════════════
-- 13. Dynamic Property CMS & Search Indexing Schema Upgrades
-- ═══════════════════════════════════════════════════════════════════════════

-- 13.1 Publish Pipeline States
do $$
begin
  if not exists (select 1 from pg_type where typname = 'project_publish_state') then
    create type project_publish_state as enum ('draft', 'in_review', 'approved', 'published', 'archived');
  end if;
end$$;

-- 13.2 Section Types Table with Schema Versioning
create table if not exists public.section_types (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  name text not null,
  description text,
  schema_version text not null default '1.0',
  validation_schema jsonb not null default '{}'::jsonb,
  layout_constraints jsonb not null default '{"allowed_children": [], "max_instances": 1}'::jsonb,
  created_at timestamptz default now()
);

-- Seed Default Section Types
insert into public.section_types (key, name, description, schema_version) values
('hero', 'Hero Section', 'Top banner section with images, title, developer and primary CTAs', '1.0'),
('emotional-hook', 'Emotional Hook', 'Luxe section explaining highlights and resort lifestyle hooks', '1.0'),
('pricing-snapshot', 'Pricing Snapshot', 'Dynamic table layout matching project unit price starting list', '1.0'),
('project-overview', 'Project Overview', 'Side by side split mapping technical project attributes', '1.0'),
('highlights', 'Key Highlights', 'Resort-themed icon blocks highlighting construction and location values', '1.0'),
('amenities', 'Amenities & Features', 'Filtered category layouts indexing pool, gym, garden components', '1.0'),
('location-map', 'Location Map', 'Decoupled location indexing map and nearby travel time landmarks', '1.0'),
('unit-types', 'Unit Configurations', 'Clean dynamic array cards loading starting price details', '1.0'),
('decision-guide', 'Decision Guide', 'Sleek alignment helper suggesting layouts to target buyer categories', '1.0'),
('media-experience', 'Media Experience', 'Interactive tab component serving exterior and interior variant images', '1.0'),
('testimonials-slider', 'Client Testimonials', 'Testimonials carousel displaying real-estate investor feedback', '1.0'),
('faq-list', 'Frequently Asked Questions', 'Dynamic accordion layout mapping user computation questions', '1.0'),
('lead-capture', 'Lead Capture Form', 'Secure form captures visitor Viber/WhatsApp details', '1.0')
on conflict (key) do nothing;

-- 13.3 Projects Master Table
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  developer text not null default 'DMCI Homes',
  location_district text not null,
  city text not null,
  full_address text not null,
  status project_publish_state not null default 'draft',
  architectural_theme text,
  land_area text,
  floors text,
  total_units text,
  turnover text,
  min_price numeric(12, 2) not null,
  max_price numeric(12, 2) not null,
  meta_title text,
  meta_description text,
  og_metadata jsonb default '{}'::jsonb,
  is_featured boolean not null default false,
  published_at timestamptz,
  current_version_id uuid, -- Reference pointing to public.project_revisions(id), updated on publish
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS on new tables
alter table public.section_types enable row level security;
alter table public.projects enable row level security;

-- Policies for public reads
drop policy if exists "Anyone can view section types" on public.section_types;
create policy "Anyone can view section types" on public.section_types for select using (true);

drop policy if exists "Anyone can view published projects" on public.projects;
create policy "Anyone can view published projects" on public.projects for select using (status = 'published');

drop policy if exists "Admins can manage section types" on public.section_types;
create policy "Admins can manage section types" on public.section_types for all using (public.is_admin(auth.uid()));

drop policy if exists "Admins can manage projects" on public.projects;
create policy "Admins can manage projects" on public.projects for all using (public.is_admin(auth.uid()));

-- 13.4 State Machine Transition Enforcement
create or replace function public.check_project_status_transition()
returns trigger as $$
begin
  if old.status = 'draft' and new.status not in ('draft', 'in_review') then
    raise exception 'Invalid state transition from draft to %', new.status;
  elsif old.status = 'in_review' and new.status not in ('draft', 'approved') then
    raise exception 'Invalid state transition from in_review to %', new.status;
  elsif old.status = 'approved' and new.status not in ('draft', 'published') then
    raise exception 'Invalid state transition from approved to %', new.status;
  elsif old.status = 'published' and new.status not in ('archived') then
    raise exception 'Invalid state transition from published to %', new.status;
  end if;
  return new;
end;
$$ language plpgsql;

create or replace trigger enforce_status_workflow
  before update of status on public.projects
  for each row execute procedure public.check_project_status_transition();

-- 13.5 Project Revisions Table (Immutable layout snapshots history ledger)
create table if not exists public.project_revisions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  snapshot jsonb not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);

alter table public.project_revisions enable row level security;
drop policy if exists "Admins can manage revisions" on public.project_revisions;
create policy "Admins can manage revisions" on public.project_revisions for all using (public.is_admin(auth.uid()));

-- Link projects to revisions
alter table public.projects drop constraint if exists fk_projects_current_version_id;
alter table public.projects 
  add constraint fk_projects_current_version_id 
  foreign key (current_version_id) references public.project_revisions(id) on delete set null;

-- 13.6 Admin Sandbox Draft Workspaces (Active mutable sandbox edits)
create table if not exists public.project_draft_workspaces (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  draft_snapshot jsonb not null,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz default now(),
  unique (project_id)
);

alter table public.project_draft_workspaces enable row level security;
drop policy if exists "Admins can manage draft workspaces" on public.project_draft_workspaces;
create policy "Admins can manage draft workspaces" on public.project_draft_workspaces for all using (public.is_admin(auth.uid()));

-- 13.7 Media Assets & Responsive Variants (Replacing/Extending baseline media)
create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  type text not null check (type in ('image', 'video')),
  blurhash text,
  project_id uuid references public.projects(id) on delete set null,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists public.media_variants (
  id uuid primary key default gen_random_uuid(),
  media_asset_id uuid not null references public.media_assets(id) on delete cascade,
  size text not null check (size in ('thumbnail', 'medium', 'large', 'original')),
  url text not null,
  width integer not null,
  height integer not null,
  created_at timestamptz default now(),
  unique (media_asset_id, size)
);

alter table public.media_assets enable row level security;
alter table public.media_variants enable row level security;

drop policy if exists "Anyone can view media assets" on public.media_assets;
create policy "Anyone can view media assets" on public.media_assets for select using (true);

drop policy if exists "Anyone can view media variants" on public.media_variants;
create policy "Anyone can view media variants" on public.media_variants for select using (true);

drop policy if exists "Admins can manage media assets" on public.media_assets;
create policy "Admins can manage media assets" on public.media_assets for all using (public.is_admin(auth.uid()));

drop policy if exists "Admins can manage media variants" on public.media_variants;
create policy "Admins can manage media variants" on public.media_variants for all using (public.is_admin(auth.uid()));

-- 13.8 Project Layout Sections
create table if not exists public.project_sections (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  section_type_id uuid not null references public.section_types(id) on delete restrict,
  display_order integer not null default 0,
  payload jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  depends_on_section_id uuid references public.project_sections(id) on delete set null,
  visibility_rules jsonb not null default '{"conditions": []}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.project_sections enable row level security;
drop policy if exists "Anyone can view project sections" on public.project_sections;
create policy "Anyone can view project sections" on public.project_sections for select using (true);

drop policy if exists "Admins can manage project sections" on public.project_sections;
create policy "Admins can manage project sections" on public.project_sections for all using (public.is_admin(auth.uid()));

-- 13.9 Project Units Table
create table if not exists public.project_units (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  area_sqm numeric(6, 2) not null,
  starting_price numeric(12, 2) not null,
  description text,
  profile_target text,
  media_asset_id uuid references public.media_assets(id) on delete set null,
  display_order integer not null default 0,
  created_at timestamptz default now()
);

alter table public.project_units enable row level security;
drop policy if exists "Anyone can view project units" on public.project_units;
create policy "Anyone can view project units" on public.project_units for select using (true);

drop policy if exists "Admins can manage project units" on public.project_units;
create policy "Admins can manage project units" on public.project_units for all using (public.is_admin(auth.uid()));

-- 13.9.5 Project Buildings Table
create table if not exists public.project_buildings (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  description text,
  floors text,
  total_units text,
  status text not null default 'Under Construction' check (status in ('Under Construction', 'Coming Soon', 'RFO')),
  image_url text,
  display_order integer not null default 0,
  created_at timestamptz default now()
);

alter table public.project_buildings enable row level security;
drop policy if exists "Anyone can view project buildings" on public.project_buildings;
create policy "Anyone can view project buildings" on public.project_buildings for select using (true);

drop policy if exists "Admins can manage project buildings" on public.project_buildings;
create policy "Admins can manage project buildings" on public.project_buildings for all using (public.is_admin(auth.uid()));

-- 13.10 Landmarks junction
create table if not exists public.landmarks (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text not null check (category in ('transit', 'mall', 'school', 'hospital', 'business', 'leisure')),
  created_at timestamptz default now()
);

create table if not exists public.project_landmarks (
  project_id uuid not null references public.projects(id) on delete cascade,
  landmark_id uuid not null references public.landmarks(id) on delete cascade,
  travel_time text not null,
  primary key (project_id, landmark_id)
);

alter table public.landmarks enable row level security;
alter table public.project_landmarks enable row level security;

drop policy if exists "Anyone can view landmarks" on public.landmarks;
create policy "Anyone can view landmarks" on public.landmarks for select using (true);

drop policy if exists "Anyone can view project landmarks" on public.project_landmarks;
create policy "Anyone can view project landmarks" on public.project_landmarks for select using (true);

drop policy if exists "Admins can manage landmarks" on public.landmarks;
create policy "Admins can manage landmarks" on public.landmarks for all using (public.is_admin(auth.uid()));

drop policy if exists "Admins can manage project landmarks" on public.project_landmarks;
create policy "Admins can manage project landmarks" on public.project_landmarks for all using (public.is_admin(auth.uid()));

-- 13.11 Read Model Projection Table
create table if not exists public.project_read_models (
  project_id uuid primary key references public.projects(id) on delete cascade,
  slug text not null unique,
  version_id uuid references public.project_revisions(id) on delete set null,
  content_payload jsonb not null,
  updated_at timestamptz default now()
);

alter table public.project_read_models enable row level security;
drop policy if exists "Anyone can view project read models" on public.project_read_models;
create policy "Anyone can view project read models" on public.project_read_models for select using (true);

drop policy if exists "Admins can manage project read models" on public.project_read_models;
create policy "Admins can manage project read models" on public.project_read_models for all using (public.is_admin(auth.uid()));

-- 13.12 Faceted Indexing for Search Filters
create table if not exists public.project_facets (
  project_id uuid not null references public.projects(id) on delete cascade,
  facet_key text not null,
  facet_value text not null,
  primary key (project_id, facet_key, facet_value)
);

alter table public.project_facets enable row level security;
drop policy if exists "Anyone can view project facets" on public.project_facets;
create policy "Anyone can view project facets" on public.project_facets for select using (true);

drop policy if exists "Admins can manage project facets" on public.project_facets;
create policy "Admins can manage project facets" on public.project_facets for all using (public.is_admin(auth.uid()));

-- 13.13 Transactional Event Outbox Ledger
create table if not exists public.event_outbox (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending', 'processed', 'failed')),
  retry_count integer not null default 0,
  error_log text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.event_outbox enable row level security;
drop policy if exists "Admins can manage event outbox" on public.event_outbox;
create policy "Admins can manage event outbox" on public.event_outbox for all using (public.is_admin(auth.uid()));

-- 13.14 Property Interaction Analytics
create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  event_name text not null,
  session_id text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz default now()
);

alter table public.analytics_events enable row level security;
drop policy if exists "Anyone can insert analytics events" on public.analytics_events;
create policy "Anyone can insert analytics events" on public.analytics_events for insert with check (true);

drop policy if exists "Admins can view analytics events" on public.analytics_events;
create policy "Admins can view analytics events" on public.analytics_events for select using (public.is_admin(auth.uid()));

-- 13.15 System Observability Logs
create table if not exists public.system_observability_logs (
  id uuid primary key default gen_random_uuid(),
  log_level text not null check (log_level in ('info', 'warn', 'error')),
  message text not null,
  context jsonb,
  created_at timestamptz default now()
);

alter table public.system_observability_logs enable row level security;
drop policy if exists "Admins can manage system observability logs" on public.system_observability_logs;
create policy "Admins can manage system observability logs" on public.system_observability_logs for all using (public.is_admin(auth.uid()));

-- 13.16 GIN Indexes for payload properties query acceleration
create index if not exists idx_project_sections_payload on public.project_sections using gin(payload);
create index if not exists idx_project_revisions_snapshot on public.project_revisions using gin(snapshot);
create index if not exists idx_project_draft_workspaces_snapshot on public.project_draft_workspaces using gin(draft_snapshot);
create index if not exists idx_project_read_models_payload on public.project_read_models using gin(content_payload);



-- Triggers for automatic outbox generation
create or replace function public.on_project_write_event()
returns trigger as $$
declare
  v_project_id uuid;
  v_slug text;
begin
  if TG_TABLE_NAME = 'projects' then
    if TG_OP = 'DELETE' then
      v_project_id := old.id;
      v_slug := old.slug;
    else
      v_project_id := new.id;
      v_slug := new.slug;
    end if;
  else
    if TG_OP = 'DELETE' then
      v_project_id := old.project_id;
    else
      v_project_id := new.project_id;
    end if;
    
    if v_project_id is not null then
      select slug into v_slug from public.projects where id = v_project_id;
    end if;
  end if;

  if v_project_id is not null then
    insert into public.event_outbox (event_name, payload)
    values (
      'read_model.rebuild',
      json_build_object(
        'project_id', v_project_id,
        'slug', coalesce(v_slug, '')
      )
    );
  end if;

  if TG_OP = 'DELETE' then
    return old;
  else
    return new;
  end if;
end;
$$ language plpgsql security definer;

create or replace trigger trigger_outbox_projects
  after insert or update or delete on public.projects
  for each row execute procedure public.on_project_write_event();

create or replace trigger trigger_outbox_project_sections
  after insert or update or delete on public.project_sections
  for each row execute procedure public.on_project_write_event();

create or replace trigger trigger_outbox_project_units
  after insert or update or delete on public.project_units
  for each row execute procedure public.on_project_write_event();

create or replace trigger trigger_outbox_project_landmarks
  after insert or update or delete on public.project_landmarks
  for each row execute procedure public.on_project_write_event();


-- Create Blogs Table
create table if not exists public.blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content text not null, -- Markdown content
  cover_image_url text,
  author_id uuid references public.profiles(id) on delete set null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  tags text[] default '{}'::text[],
  read_time integer default 5
);

-- Enable RLS
alter table public.blogs enable row level security;

-- Select policy: Anyone can read published posts
create policy "Public users can view published blogs"
  on public.blogs for select
  using (status = 'published');

-- All actions policy: Only admin roles can manage
create policy "Admins can manage blogs"
  on public.blogs for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- Indexing for slug and status+published lookup
create index if not exists idx_blogs_slug on public.blogs(slug);
create index if not exists idx_blogs_status_published on public.blogs(status, published_at desc);

-- Trigger for auto updated_at
create or replace trigger update_blogs_updated_at
  before update on public.blogs
  for each row execute procedure public.update_updated_at_column();

