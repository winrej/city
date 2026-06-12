-- CityQlo launch safety fix: restrict property writes to admin roles.
-- Run this in the Supabase SQL editor after properties_migration.sql.

alter table public.properties enable row level security;

drop policy if exists "Public can read active properties" on public.properties;
create policy "Public can read active properties"
  on public.properties
  for select
  to anon, authenticated
  using (is_active = true and is_deleted = false);

drop policy if exists "Admins can manage all properties" on public.properties;
create policy "Admins can manage all properties"
  on public.properties
  for all
  to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));
