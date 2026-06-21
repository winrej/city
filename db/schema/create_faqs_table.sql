-- Create FAQs Table
create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text not null default 'General',
  display_order integer not null default 0,
  status text not null default 'published' check (status in ('draft', 'published')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row-Level Security
alter table public.faqs enable row level security;

-- Drop existing policies if any
drop policy if exists "Public users can view published faqs" on public.faqs;
drop policy if exists "Admins can manage faqs" on public.faqs;

-- Select policy: Anyone can read published FAQs
create policy "Public users can view published faqs"
  on public.faqs for select
  using (status = 'published');

-- All actions policy: Only admin roles can manage
create policy "Admins can manage faqs"
  on public.faqs for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- Indexing for status and display_order lookup
create index if not exists idx_faqs_status_order on public.faqs(status, display_order);

-- Trigger for auto updated_at
create or replace trigger update_faqs_updated_at
  before update on public.faqs
  for each row execute procedure public.update_updated_at_column();

-- Seed some initial FAQs
insert into public.faqs (question, answer, category, display_order, status)
select 
  'What is the buying process for a condo in Metro Manila?', 
  'The process generally involves choosing a unit, submitting a reservation agreement with a reservation fee (usually around ₱20,000 to ₱50,000 depending on the project), submitting required identification documents, and completing the payment of the down payment (either in cash or monthly installments). Once completed, you will undergo credit assessment for the remaining balance via bank financing or in-house options.', 
  'Buying Process', 
  0, 
  'published'
where not exists (select 1 from public.faqs where question = 'What is the buying process for a condo in Metro Manila?');

insert into public.faqs (question, answer, category, display_order, status)
select 
  'Can foreigners own condominium units in the Philippines?', 
  'Yes, foreigners are legally permitted to own condominium units in the Philippines, provided that total foreign ownership in the specific condominium corporation does not exceed 40%. Foreigners are not allowed to own land in the country, but condo ownership represents an interest in the building and land co-owned by the corporation.', 
  'Legalities', 
  1, 
  'published'
where not exists (select 1 from public.faqs where question = 'Can foreigners own condominium units in the Philippines?');

insert into public.faqs (question, answer, category, display_order, status)
select 
  'What are the payment options and downpayment schemes?', 
  'We offer highly flexible payment terms. Pre-selling units typically require a downpayment (ranging from 10% to 15%) spread over the construction period, with the remaining 85% to 90% settled through bank financing or cash upon turnover. RFO (Ready for Occupancy) units may require a lump sum downpayment or bank approval before move-in.', 
  'Payment Options', 
  2, 
  'published'
where not exists (select 1 from public.faqs where question = 'What are the payment options and downpayment schemes?');

insert into public.faqs (question, answer, category, display_order, status)
select 
  'How do OFW investors purchase a property remotely?', 
  'OFW (Overseas Filipino Worker) investors can securely acquire properties without returning to the Philippines. The entire process is digitized: virtual project tours, online reservation, digital signing of documents, and payments via international wire transfer or accredited remittance centers. You can designate a Special Power of Attorney (SPA) representative in the Philippines to sign physical documents on your behalf.', 
  'OFW Investors', 
  3, 
  'published'
where not exists (select 1 from public.faqs where question = 'How do OFW investors purchase a property remotely?');

insert into public.faqs (question, answer, category, display_order, status)
select 
  'What makes DMCI Homes different from other developers?', 
  'DMCI Homes is known as a premier builder-developer, utilizing its own in-house construction division (D.M. Consunji, Inc.) which ensures high quality and structural integrity. Key advantages include their signature Lumiventt Design Technology (natural light and ventilation pathways in high-rises), resort-style amenities, and a lower-density footprint (more open space) compared to competitors.', 
  'DMCI Homes', 
  4, 
  'published'
where not exists (select 1 from public.faqs where question = 'What makes DMCI Homes different from other developers?');
