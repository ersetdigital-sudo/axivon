import GameTopUpPage, { type GameTopUpConfig } from "@/components/GameTopUpPage";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const STATIC: Omit<GameTopUpConfig, "nominals"> = {
  slug: "/mobile-legends",
  name: "Mobile Legends: Bang Bang",
  shortName: "Mobile Legends",
  publisher: "Moonton",
  heroImage: "/images/8f47dd26-4142-498f-a61c-14f17dc5cd18.png",
  heroBadge: "TOP UP",
  nominalIconColor: "text-[#5bc8ff]",
  notice: "Akun harus region Indonesia. Weekly Diamond Pass maksimal 10x dalam 70 hari.",
  accountFields: [
    { id: "uid", label: "User ID", placeholder: "1234567" },
    { id: "zid", label: "Zone ID", placeholder: "1234" },
  ],
  accountHelp: (
    <>
      Buka game, tap avatar di kiri atas. User ID dan Zone ID ada di bawah nama kamu, contoh{" "}
      <span className="text-[#eef1f4]">1234567 (1234)</span>.
    </>
  ),
  ntabs: ["Harga Spesial", "MLBB Pass", "Elite Bundle", "Event", "Diamonds"],
  payments: [
    { label: "QRIS", fee: 0, desc: "Semua e-wallet & m-banking" },
    { label: "DANA", fee: 1000, desc: "Biaya Rp1.000" },
    { label: "Transfer BCA", fee: 2500, desc: "Biaya Rp2.500" },
  ],
  howToSteps: [
    "Masukkan User ID dan Zone ID kamu.",
    "Contoh: 1234567 (1234).",
    "Pilih nominal diamond yang kamu mau.",
    "Pilih metode pembayaran, lalu bayar.",
    "Diamond masuk otomatis ke akunmu.",
  ],
};

export default async function MobileLegendsPage() {
  const admin = createSupabaseAdminClient();
  const { data: prods } = await admin
    .from("products")
    .select("id, label, price, old_price, coins, description, badge, icon_color, sort_order")
    .eq("game_id", 1)
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
  return <GameTopUpPage config={{ ...STATIC, nominals }} />;
}
