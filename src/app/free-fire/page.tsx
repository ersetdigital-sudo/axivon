import GameTopUpPage, { type GameTopUpConfig } from "@/components/GameTopUpPage";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const STATIC: Omit<GameTopUpConfig, "nominals"> = {
  slug: "/free-fire",
  name: "Free Fire",
  shortName: "Free Fire",
  publisher: "Garena",
  heroImage: "/images/068b552d-43d8-45eb-8ea5-420aac595ef2.png",
  heroBadge: "TOP UP",
  nominalIconColor: "text-[#ff5c2b]",
  notice: "Top up via Login Google/Facebook. Diamond masuk instan setelah pembayaran sukses.",
  accountFields: [
    { id: "playerId", label: "Free Fire ID", placeholder: "123456789" },
  ],
  accountHelp: (
    <>Buka profil di dalam game, ID terlihat di samping avatar kamu. Contoh: <span className="text-[#eef1f4]">123456789</span>.</>
  ),
  ntabs: ["Promo", "Diamond", "Membership", "Bundle", "Event"],
  payments: [
    { label: "QRIS", fee: 0, desc: "Semua e-wallet & m-banking" },
    { label: "DANA", fee: 1000, desc: "Biaya Rp1.000" },
    { label: "OVO", fee: 1500, desc: "Biaya Rp1.500" },
  ],
  howToSteps: [
    "Login ke akun Free Fire kamu (Google/Facebook/VK).",
    "Salin Free Fire ID dari profil dalam game.",
    "Pilih nominal diamond yang kamu mau.",
    "Bayar, diamond masuk otomatis ke akun.",
  ],
};

export default async function FreeFirePage() {
  const admin = createSupabaseAdminClient();
  const { data: prods } = await admin
    .from("products")
    .select("id, label, price, old_price, coins, description, badge, icon_color, sort_order")
    .eq("game_id", 3)
    .eq("is_active", true)
    .order("sort_order");
  const nominals = (prods || []).map((p) => ({
    id: p.id,
    label: p.label,
    price: p.price,
    oldPrice: p.old_price ?? p.price,
    desc: p.description || "",
    coins: p.coins,
    iconColor: p.icon_color || "text-[#ff5c2b]",
    badge: p.badge || undefined,
  }));
  return <GameTopUpPage config={{ ...STATIC, nominals }} iconKind="diamond" />;
}
