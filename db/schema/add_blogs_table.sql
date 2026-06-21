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

-- Drop existing policies if any
drop policy if exists "Public users can view published blogs" on public.blogs;
drop policy if exists "Admins can manage blogs" on public.blogs;

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
