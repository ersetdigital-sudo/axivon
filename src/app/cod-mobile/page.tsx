import GameTopUpPage, { type GameTopUpConfig } from "@/components/GameTopUpPage";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const STATIC: Omit<GameTopUpConfig, "nominals"> = {
  slug: "/cod-mobile",
  name: "Call of Duty: Mobile",
  shortName: "COD Mobile",
  publisher: "Activision / Garena",
  heroImage: "/images/bae33449-55c9-489e-b7de-16530bdaca12.png",
  heroBadge: "TOP UP",
  nominalIconColor: "text-[#ff5c2b]",
  notice: "Top up via Activision ID. CP akan masuk otomatis ke akun kamu setelah bayar.",
  accountFields: [
    { id: "playerId", label: "Activision ID", placeholder: "Player#1234567" },
  ],
  accountHelp: (
    <>Buka profil dalam game, salin Activision ID. Format: <span className="text-[#eef1f4]">Nama#Tag Angka</span>.</>
  ),
  ntabs: ["Promo", "CP", "Battle Pass", "Bundle", "Event"],
  payments: [
    { label: "QRIS", fee: 0, desc: "Semua e-wallet & m-banking" },
    { label: "DANA", fee: 1000, desc: "Biaya Rp1.000" },
    { label: "Transfer Mandiri", fee: 2500, desc: "Biaya Rp2.500" },
  ],
  howToSteps: [
    "Buka COD Mobile, masuk ke profil dalam game.",
    "Salin Activision ID (format Nama#Tag).",
    "Pilih nominal CP yang kamu mau.",
    "Bayar, CP masuk otomatis ke akun.",
  ],
};

export default async function CodMobilePage() {
  const admin = createSupabaseAdminClient();
  const { data: prods } = await admin
    .from("products")
    .select("id, label, price, old_price, coins, description, badge, icon_color, sort_order")
    .eq("game_id", 5)
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
  return <GameTopUpPage config={{ ...STATIC, nominals }} iconKind="coin" />;
}
