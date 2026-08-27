import GameTopUpPage, { type GameTopUpConfig } from "@/components/GameTopUpPage";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const STATIC: Omit<GameTopUpConfig, "nominals"> = {
  slug: "/magic-chess",
  name: "Magic Chess: Go Go",
  shortName: "Magic Chess",
  publisher: "Moonton",
  heroImage: "/images/9d357c22-da08-4270-9750-efeb7890bc0e.png",
  heroBadge: "TOP UP",
  nominalIconColor: "text-[#2fbf71]",
  notice: "Pakai akun Moonton yang sama dengan Mobile Legends kamu. Diamond langsung masuk instan.",
  accountFields: [
    { id: "uid", label: "User ID", placeholder: "1234567" },
    { id: "zid", label: "Zone ID", placeholder: "1234" },
  ],
  accountHelp: (
    <>Sama dengan akun Mobile Legends. Buka game, tap avatar kiri atas, lihat User ID & Zone ID, contoh <span className="text-[#eef1f4]">1234567 (1234)</span>.</>
  ),
  ntabs: ["Promo", "Diamond", "Magic Pass", "Bundle", "Event"],
  payments: [
    { label: "QRIS", fee: 0, desc: "Semua e-wallet & m-banking" },
    { label: "GoPay", fee: 1000, desc: "Biaya Rp1.000" },
    { label: "Transfer BRI", fee: 2500, desc: "Biaya Rp2.500" },
  ],
  howToSteps: [
    "Buka Magic Chess, login pakai akun Moonton.",
    "Tap avatar kiri atas, salin User ID & Zone ID.",
    "Pilih nominal diamond favoritmu.",
    "Selesaikan pembayaran, diamond masuk otomatis.",
  ],
};

export default async function MagicChessPage() {
  const admin = createSupabaseAdminClient();
  const { data: prods } = await admin
    .from("products")
    .select("id, label, price, old_price, coins, description, badge, icon_color, sort_order")
    .eq("game_id", 4)
    .eq("is_active", true)
    .order("sort_order");
  const nominals = (prods || []).map((p) => ({
    id: p.id,
    label: p.label,
    price: p.price,
    oldPrice: p.old_price ?? p.price,
    desc: p.description || "",
    coins: p.coins,
    iconColor: p.icon_color || "text-[#2fbf71]",
    badge: p.badge || undefined,
  }));
  return <GameTopUpPage config={{ ...STATIC, nominals }} iconKind="diamond" />;
}
