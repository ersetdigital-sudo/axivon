import GameTopUpPage, { type GameTopUpConfig } from "@/components/GameTopUpPage";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const STATIC: Omit<GameTopUpConfig, "nominals"> = {
  slug: "/pubg-mobile",
  name: "PUBG Mobile",
  shortName: "PUBG Mobile",
  publisher: "Tencent / Level Infinite",
  heroImage: "/images/517d8ae9-25a3-412d-ac02-fda4eea809ac.png",
  heroBadge: "TOP UP",
  nominalIconColor: "text-[#ffb020]",
  notice: "Pastikan login ke akun PUBG Mobile yang benar. UC masuk otomatis setelah pembayaran sukses.",
  accountFields: [
    { id: "playerId", label: "Player ID", placeholder: "5123456789" },
  ],
  accountHelp: (
    <>Buka profil di dalam game, Player ID tertera di bawah nickname kamu. Salin tanpa spasi.</>
  ),
  ntabs: ["Harga Spesial", "UC", "Royal Pass", "Bundle", "Event"],
  payments: [
    { label: "QRIS", fee: 0, desc: "Semua e-wallet & m-banking" },
    { label: "GoPay", fee: 1000, desc: "Biaya Rp1.000" },
    { label: "Transfer BCA", fee: 2500, desc: "Biaya Rp2.500" },
  ],
  howToSteps: [
    "Buka game, masuk ke profil kamu.",
    "Salin Player ID yang tertera di bawah nickname.",
    "Pilih nominal UC yang kamu mau.",
    "Selesaikan pembayaran, UC masuk otomatis.",
  ],
};

export default async function PubgMobilePage() {
  const admin = createSupabaseAdminClient();
  const { data: prods } = await admin
    .from("products")
    .select("id, label, price, old_price, coins, description, badge, icon_color, sort_order")
    .eq("game_id", 2)
    .eq("is_active", true)
    .order("sort_order");
  const nominals = (prods || []).map((p) => ({
    id: p.id,
    label: p.label,
    price: p.price,
    oldPrice: p.old_price ?? p.price,
    desc: p.description || "",
    coins: p.coins,
    iconColor: p.icon_color || "text-[#ffb020]",
    badge: p.badge || undefined,
  }));
  return <GameTopUpPage config={{ ...STATIC, nominals }} iconKind="uc" />;
}
