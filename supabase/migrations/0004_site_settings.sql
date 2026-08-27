-- ============================================================
-- Site settings (singleton key-value for app-wide config)
-- Run in Supabase SQL Editor
-- ============================================================

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

alter table public.site_settings enable row level security;

-- Public can read (for landing page)
create policy "site_settings public read" on public.site_settings
  for select using (true);

-- Only admin can write
create policy "site_settings admin write" on public.site_settings
  for all using (public.is_admin()) with check (public.is_admin());

-- Seed defaults
insert into public.site_settings (key, value) values
  ('whatsapp_cs', '"6281234567890"'),
  ('site_tagline', '"Top Up Game Online Termurah 24 Jam"')
on conflict (key) do nothing;
