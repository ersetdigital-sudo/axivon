-- ============================================================
-- Seed data: 6 games + products
-- Run after 0001_init.sql
-- ============================================================

-- Games
insert into public.games (slug, name, short_name, publisher, hero_image) values
  ('mobile-legends', 'Mobile Legends: Bang Bang', 'Mobile Legends', 'Moonton', '/images/8f47dd26-4142-498f-a61c-14f17dc5cd18.png'),
  ('pubg-mobile', 'PUBG Mobile', 'PUBG Mobile', 'Tencent / Level Infinite', '/images/517d8ae9-25a3-412d-ac02-fda4eea809ac.png'),
  ('free-fire', 'Free Fire', 'Free Fire', 'Garena', '/images/068b552d-43d8-45eb-8ea5-420aac595ef2.png'),
  ('magic-chess', 'Magic Chess: Go Go', 'Magic Chess', 'Moonton', '/images/9d357c22-da08-4270-9750-efeb7890bc0e.png'),
  ('cod-mobile', 'Call of Duty: Mobile', 'COD Mobile', 'Activision / Garena', '/images/bae33449-55c9-489e-b7de-16530bdaca12.png'),
  ('genshin-impact', 'Genshin Impact', 'Genshin Impact', 'HoYoverse', '/images/dd9c2680-f65c-41a5-a7f9-6e9338c893e7.png')
on conflict (slug) do nothing;

-- Helper: products batch
do $$
declare
  ml_id bigint;
  pubg_id bigint;
  ff_id bigint;
  mc_id bigint;
  cod_id bigint;
  gi_id bigint;
begin
  select id into ml_id from public.games where slug = 'mobile-legends';
  select id into pubg_id from public.games where slug = 'pubg-mobile';
  select id into ff_id from public.games where slug = 'free-fire';
  select id into mc_id from public.games where slug = 'magic-chess';
  select id into cod_id from public.games where slug = 'cod-mobile';
  select id into gi_id from public.games where slug = 'genshin-impact';

  -- Mobile Legends (9 products)
  insert into public.products (game_id, label, price, old_price, coins, description, icon_color, sort_order) values
    (ml_id, 'Weekly Diamond Pass', 32100, 35000, 321, 'Event Topup +100', 'text-[#5bc8ff]', 1),
    (ml_id, 'Weekly Diamond Pass x3', 96300, 105000, 963, 'Event Topup +100', 'text-[#5bc8ff]', 2),
    (ml_id, '86 Diamonds', 24500, 26000, 245, '78 + 8 bonus', 'text-[#5bc8ff]', 3),
    (ml_id, '172 Diamonds', 48500, 51000, 485, '156 + 16 bonus', 'text-[#5bc8ff]', 4),
    (ml_id, '296 Diamonds', 93017, 98000, 930, '256 + 40 bonus', 'text-[#5bc8ff]', 5),
    (ml_id, '345 Diamonds', 101651, 106790, 1016, '301 + 44 bonus', 'text-[#5bc8ff]', 6),
    (ml_id, '706 Diamonds', 220000, 233000, 2200, '636 + 70 bonus', 'text-[#5bc8ff]', 7),
    (ml_id, '2195 Diamonds', 645000, 680000, 6450, '2010 + 185 bonus', 'text-[#5bc8ff]', 8);
  insert into public.products (game_id, label, price, old_price, coins, description, icon_color, badge, sort_order) values
    (ml_id, 'Twilight Pass', 149000, 159000, 1490, 'Skin + 500 diamond', 'text-[#c07bff]', 'EVENT', 9);

  -- PUBG Mobile (9 products)
  insert into public.products (game_id, label, price, old_price, coins, description, icon_color, sort_order) values
    (pubg_id, '60 UC', 14000, 15000, 60, 'Bonus +5 UC', 'text-[#ffb020]', 1),
    (pubg_id, '300 UC', 68000, 72000, 300, 'Bonus +30 UC', 'text-[#ffb020]', 2),
    (pubg_id, '600 UC', 134000, 142000, 600, 'Bonus +75 UC', 'text-[#ffb020]', 3),
    (pubg_id, '1500 UC', 328000, 345000, 1500, 'Bonus +210 UC', 'text-[#ffb020]', 4),
    (pubg_id, '3000 UC', 645000, 680000, 3000, 'Bonus +450 UC', 'text-[#ffb020]', 5),
    (pubg_id, '6000 UC', 1280000, 1350000, 6000, 'Bonus +1000 UC', 'text-[#ffb020]', 6),
    (pubg_id, '12000 UC', 2540000, 2680000, 12000, 'Bonus +2200 UC', 'text-[#ffb020]', 7);
  insert into public.products (game_id, label, price, old_price, coins, description, icon_color, badge, sort_order) values
    (pubg_id, 'Elite Pass Plus', 169000, 189000, 1690, 'Skip reward 25 level', 'text-[#c07bff]', 'EVENT', 8);
  insert into public.products (game_id, label, price, old_price, coins, description, icon_color, sort_order) values
    (pubg_id, 'Royal Pass', 89000, 99000, 890, 'Akses 100 reward', 'text-[#c07bff]', 9);

  -- Free Fire (9 products)
  insert into public.products (game_id, label, price, old_price, coins, description, icon_color, sort_order) values
    (ff_id, '70 Diamond', 12000, 13500, 70, 'Bonus +5', 'text-[#ff5c2b]', 1),
    (ff_id, '140 Diamond', 23500, 26000, 140, 'Bonus +12', 'text-[#ff5c2b]', 2),
    (ff_id, '355 Diamond', 58000, 63000, 355, 'Bonus +30', 'text-[#ff5c2b]', 3),
    (ff_id, '720 Diamond', 115000, 125000, 720, 'Bonus +70', 'text-[#ff5c2b]', 4),
    (ff_id, '1450 Diamond', 228000, 245000, 1450, 'Bonus +150', 'text-[#ff5c2b]', 5),
    (ff_id, '2180 Diamond', 339000, 365000, 2180, 'Bonus +250', 'text-[#ff5c2b]', 6),
    (ff_id, '3680 Diamond', 559000, 595000, 3680, 'Bonus +450', 'text-[#ff5c2b]', 7),
    (ff_id, 'Weekly Membership', 28900, 32000, 289, 'Diamond harian 7 hari', 'text-[#c07bff]', 8);
  insert into public.products (game_id, label, price, old_price, coins, description, icon_color, badge, sort_order) values
    (ff_id, 'Monthly Membership', 79900, 89000, 799, 'Diamond harian 30 hari', 'text-[#c07bff]', 'BEST', 9);

  -- Magic Chess (9 products)
  insert into public.products (game_id, label, price, old_price, coins, description, icon_color, sort_order) values
    (mc_id, '86 Diamond', 24500, 26000, 245, '78 + 8 bonus', 'text-[#2fbf71]', 1),
    (mc_id, '172 Diamond', 48000, 51000, 480, '156 + 16 bonus', 'text-[#2fbf71]', 2),
    (mc_id, '296 Diamond', 93017, 98000, 930, '256 + 40 bonus', 'text-[#2fbf71]', 3),
    (mc_id, '345 Diamond', 101651, 106790, 1016, '301 + 44 bonus', 'text-[#2fbf71]', 4),
    (mc_id, '706 Diamond', 220000, 233000, 2200, '636 + 70 bonus', 'text-[#2fbf71]', 5),
    (mc_id, '1412 Diamond', 415000, 440000, 4150, '1262 + 150 bonus', 'text-[#2fbf71]', 6),
    (mc_id, '2195 Diamond', 645000, 680000, 6450, '2010 + 185 bonus', 'text-[#2fbf71]', 7);
  insert into public.products (game_id, label, price, old_price, coins, description, icon_color, badge, sort_order) values
    (mc_id, 'Magic Pass', 79000, 85000, 790, 'Reward eksklusif 30 hari', 'text-[#c07bff]', 'BARU', 8);
  insert into public.products (game_id, label, price, old_price, coins, description, icon_color, sort_order) values
    (mc_id, 'Magic Chest Bundle', 199000, 249000, 1990, '5 skin eksklusif', 'text-[#c07bff]', 9);

  -- COD Mobile (9 products)
  insert into public.products (game_id, label, price, old_price, coins, description, icon_color, sort_order) values
    (cod_id, '80 CP', 15000, 16500, 80, 'Bonus +8 CP', 'text-[#ff5c2b]', 1),
    (cod_id, '400 CP', 72000, 78000, 400, 'Bonus +45 CP', 'text-[#ff5c2b]', 2),
    (cod_id, '800 CP', 142000, 152000, 800, 'Bonus +90 CP', 'text-[#ff5c2b]', 3),
    (cod_id, '2000 CP', 348000, 370000, 2000, 'Bonus +240 CP', 'text-[#ff5c2b]', 4),
    (cod_id, '5000 CP', 845000, 895000, 5000, 'Bonus +650 CP', 'text-[#ff5c2b]', 5),
    (cod_id, '10000 CP', 1650000, 1750000, 10000, 'Bonus +1400 CP', 'text-[#ff5c2b]', 6),
    (cod_id, '20800 CP', 3390000, 3580000, 20800, 'Bonus +3000 CP', 'text-[#ff5c2b]', 7),
    (cod_id, 'Battle Pass', 99000, 109000, 990, 'Akses 100 tier reward', 'text-[#c07bff]', 8);
  insert into public.products (game_id, label, price, old_price, coins, description, icon_color, badge, sort_order) values
    (cod_id, 'Battle Pass Bundle', 249000, 289000, 2490, 'Pass + 1000 CP bonus', 'text-[#c07bff]', 'HOT', 9);

  -- Genshin Impact (9 products)
  insert into public.products (game_id, label, price, old_price, coins, description, icon_color, sort_order) values
    (gi_id, '60 Genesis', 16000, 17500, 60, 'Bonus 60 crystal', 'text-[#5bc8ff]', 1),
    (gi_id, '300 + 30 Genesis', 79000, 85000, 330, 'Bonus 30 crystal', 'text-[#5bc8ff]', 2),
    (gi_id, '980 + 110 Genesis', 249000, 265000, 1090, 'Bonus 110 crystal', 'text-[#5bc8ff]', 3),
    (gi_id, '1980 + 260 Genesis', 479000, 510000, 2240, 'Bonus 260 crystal', 'text-[#5bc8ff]', 4),
    (gi_id, '3280 + 600 Genesis', 799000, 845000, 3880, 'Bonus 600 crystal', 'text-[#5bc8ff]', 5),
    (gi_id, '6480 + 1600 Genesis', 1599000, 1690000, 8080, 'Bonus 1600 crystal', 'text-[#5bc8ff]', 6),
    (gi_id, '12960 + 3200 Genesis', 3199000, 3380000, 16160, 'Bonus 3200 crystal', 'text-[#5bc8ff]', 7),
    (gi_id, 'Welkin Moon', 79000, 85000, 2790, '90 crystal harian 30 hari', 'text-[#c07bff]', 8);
  insert into public.products (game_id, label, price, old_price, coins, description, icon_color, badge, sort_order) values
    (gi_id, 'Genesis Crystals + BP', 189000, 215000, 1890, 'Crystal + Battle Pass', 'text-[#c07bff]', 'BEST', 9);
end $$;

