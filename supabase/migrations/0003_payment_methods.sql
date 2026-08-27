-- ============================================================
-- Payment methods table
-- Run after 0001_init.sql
-- ============================================================

create table if not exists public.payment_methods (
  id bigserial primary key,
  slug text unique not null,
  label text not null,
  type text not null check (type in ('qris', 'bank_transfer', 'ewallet', 'pulsa')),
  account_number text,
  account_name text,
  bank_name text,
  qris_image_url text,
  instructions text,
  fee integer not null default 0,
  fee_label text,
  icon text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists payment_methods_active_idx on public.payment_methods(is_active, sort_order);

alter table public.payment_methods enable row level security;

-- Public can read active payment methods
create policy "payment_methods public read" on public.payment_methods
  for select using (is_active = true);

create policy "payment_methods admin read all" on public.payment_methods
  for select using (public.is_admin());

create policy "payment_methods admin write" on public.payment_methods
  for all using (public.is_admin()) with check (public.is_admin());

-- Realtime for admin updates
alter publication supabase_realtime add table public.payment_methods;

-- Seed default methods
insert into public.payment_methods (slug, label, type, fee, fee_label, instructions, account_name, sort_order) values
  ('qris', 'QRIS', 'qris', 0, 'Gratis', 'Scan QRIS di atas menggunakan aplikasi e-wallet atau m-banking apapun (OVO, GoPay, DANA, ShopeePay, BCA Mobile, dll). Pembayaran otomatis terdeteksi dalam hitungan detik.', null, 1),
  ('dana', 'DANA', 'ewallet', 1000, 'Biaya Rp1.000', 'Buka aplikasi DANA, pilih Kirim → ke nomor berikut. Pastikan nominal transfer tepat sesuai total bayar.', 'Axivon Games', 2),
  ('bca', 'Transfer BCA', 'bank_transfer', 2500, 'Biaya Rp2.500', 'Transfer ke rekening BCA di bawah ini. Konfirmasi manual via WhatsApp setelah bayar.', 'PT Axivon Digital Indonesia', 3)
on conflict (slug) do nothing;
