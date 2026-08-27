-- ============================================================
-- Axivon Games — Database schema
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard)
-- ============================================================

-- 1) Profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'staff' check (role in ('admin', 'staff')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Trigger: auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''), 'staff');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2) Games master data
create table if not exists public.games (
  id bigserial primary key,
  slug text unique not null,
  name text not null,
  short_name text not null,
  publisher text not null,
  hero_image text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.games enable row level security;

-- 3) Products (nominals)
create table if not exists public.products (
  id bigserial primary key,
  game_id bigint not null references public.games(id) on delete cascade,
  label text not null,
  price integer not null,
  old_price integer,
  coins integer not null default 0,
  desc text,
  icon_color text,
  badge text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists products_game_id_idx on public.products(game_id);

alter table public.products enable row level security;

-- 4) Orders
create table if not exists public.orders (
  id bigserial primary key,
  order_code text unique not null,
  game_id bigint not null references public.games(id),
  product_id bigint not null references public.products(id),
  customer_uid text not null,
  customer_zid text,
  customer_whatsapp text,
  payment_method text not null,
  subtotal integer not null,
  service_fee integer not null default 0,
  total integer not null,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'processing', 'success', 'failed', 'refunded')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_status_idx on public.orders(status);
create index if not exists orders_created_at_idx on public.orders(created_at desc);

alter table public.orders enable row level security;

-- 5) Order events (audit log)
create table if not exists public.order_events (
  id bigserial primary key,
  order_id bigint not null references public.orders(id) on delete cascade,
  actor_id uuid references auth.users(id),
  actor_label text,
  from_status text,
  to_status text not null,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists order_events_order_id_idx on public.order_events(order_id);

alter table public.order_events enable row level security;

-- 6) Helper: is_admin()
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select coalesce(
    (select role = 'admin' from public.profiles where id = auth.uid()),
    false
  );
$$;

-- 7) Helper: is_staff_or_admin()
create or replace function public.is_staff_or_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select coalesce(
    (select role in ('admin', 'staff') from public.profiles where id = auth.uid()),
    false
  );
$$;

-- ============================================================
-- RLS Policies
-- ============================================================

-- Profiles: users can read own, admins can read/update all
create policy "profiles self read" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles admin read all" on public.profiles
  for select using (public.is_admin());

create policy "profiles admin update" on public.profiles
  for update using (public.is_admin());

-- Games: public read, admin write
create policy "games public read" on public.games
  for select using (is_active = true);

create policy "games admin read all" on public.games
  for select using (public.is_admin());

create policy "games admin write" on public.games
  for all using (public.is_admin()) with check (public.is_admin());

-- Products: public read active, admin read all + write
create policy "products public read" on public.products
  for select using (is_active = true);

create policy "products admin read all" on public.products
  for select using (public.is_admin());

create policy "products admin write" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

-- Orders: staff/admin can read all, customers can insert (via anon key, no auth required for guest checkout)
-- Allow anon insert for guest checkout
create policy "orders guest insert" on public.orders
  for insert with check (true);

create policy "orders staff read" on public.orders
  for select using (public.is_staff_or_admin());

create policy "orders staff update" on public.orders
  for update using (public.is_staff_or_admin()) with check (public.is_staff_or_admin());

-- Order events: staff/admin can read & write
create policy "order_events staff read" on public.order_events
  for select using (public.is_staff_or_admin());

create policy "order_events staff insert" on public.order_events
  for insert with check (public.is_staff_or_admin());

-- ============================================================
-- Realtime: enable for orders + order_events
-- ============================================================
alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.order_events;

-- ============================================================
-- updated_at trigger for orders
-- ============================================================
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists orders_touch_updated_at on public.orders;
create trigger orders_touch_updated_at
  before update on public.orders
  for each row execute function public.touch_updated_at();

-- ============================================================
-- Order code generator: AX-YYYYMMDD-XXXX
-- ============================================================
create or replace function public.generate_order_code()
returns text
language plpgsql
as $$
declare
  d text;
  seq integer;
  result text;
begin
  d := to_char(now(), 'YYYYMMDD');
  select count(*) + 1 into seq from public.orders where order_code like 'AX-' || d || '-%';
  result := 'AX-' || d || '-' || lpad(seq::text, 4, '0');
  return result;
end;
$$;
