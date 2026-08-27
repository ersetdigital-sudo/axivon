import GameTopUpPage, { type GameTopUpConfig } from "@/components/GameTopUpPage";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const STATIC: Omit<GameTopUpConfig, "nominals"> = {
  slug: "/genshin-impact",
  name: "Genshin Impact",
  shortName: "Genshin Impact",
  publisher: "HoYoverse",
  heroImage: "/images/dd9c2680-f65c-41a5-a7f9-6e9338c893e7.png",
  heroBadge: "TOP UP",
  nominalIconColor: "text-[#5bc8ff]",
  notice: "Top up via UID Genshin Impact. Server Asia bisa pakai semua region. Genesis Crystal masuk otomatis.",
  accountFields: [
    { id: "uid", label: "UID", placeholder: "800000000" },
    { id: "server", label: "Server", placeholder: "Asia" },
  ],
  accountHelp: (
    <>Buka game, tap Paimon Menu kiri atas. UID tertera di pojok kanan bawah. Server: Asia / America / Europe / TW / SAR.</>
  ),
  ntabs: ["Promo", "Genesis Crystal", "Blessing", "Bundle", "Event"],
  payments: [
    { label: "QRIS", fee: 0, desc: "Semua e-wallet & m-banking" },
    { label: "GoPay", fee: 1000, desc: "Biaya Rp1.000" },
    { label: "Transfer BCA", fee: 2500, desc: "Biaya Rp2.500" },
  ],
  howToSteps: [
    "Buka Genshin Impact, masuk ke Paimon Menu.",
    "Salin UID di pojok kanan bawah profil kamu.",
    "Pilih server (Asia/America/Europe/dst).",
    "Pilih nominal Genesis Crystal & bayar.",
  ],
};

export default async function GenshinImpactPage() {
  const admin = createSupabaseAdminClient();
  const { data: prods } = await admin
    .from("products")
    .select("id, label, price, old_price, coins, description, badge, icon_color, sort_order")
    .eq("game_id", 6)
    .eq("is_active", true)
    .order("sort_order");
  const nominals = (prods || []).map((p) => ({
    id: p.id,
    label: p.label,
    price: p.price,
    oldPrice: p.old_price ?? p.price,
    desc: p.description || "",
    coins: p.coins,
    iconColor: p.icon_color || "text-[#5bc8ff]",
    badge: p.badge || undefined,
  }));
  return <GameTopUpPage config={{ ...STATIC, nominals }} iconKind="crystal" />;
}
