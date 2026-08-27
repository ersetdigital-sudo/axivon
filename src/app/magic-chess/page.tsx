"use client";

import GameTopUpPage, { type GameTopUpConfig } from "@/components/GameTopUpPage";

const config: GameTopUpConfig = {
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
    <>
      Sama dengan akun Mobile Legends. Buka game, tap avatar kiri atas, lihat User ID & Zone ID, contoh{" "}
      <span className="text-[#eef1f4]">1234567 (1234)</span>.
    </>
  ),
  ntabs: ["Promo", "Diamond", "Magic Pass", "Bundle", "Event"],
  nominals: [
    { label: "86 Diamond", price: 24500, oldPrice: 26000, desc: "78 + 8 bonus", coins: 245, iconColor: "text-[#2fbf71]" },
    { label: "172 Diamond", price: 48000, oldPrice: 51000, desc: "156 + 16 bonus", coins: 480, iconColor: "text-[#2fbf71]" },
    { label: "296 Diamond", price: 93017, oldPrice: 98000, desc: "256 + 40 bonus", coins: 930, iconColor: "text-[#2fbf71]" },
    { label: "345 Diamond", price: 101651, oldPrice: 106790, desc: "301 + 44 bonus", coins: 1016, iconColor: "text-[#2fbf71]" },
    { label: "706 Diamond", price: 220000, oldPrice: 233000, desc: "636 + 70 bonus", coins: 2200, iconColor: "text-[#2fbf71]" },
    { label: "1412 Diamond", price: 415000, oldPrice: 440000, desc: "1262 + 150 bonus", coins: 4150, iconColor: "text-[#2fbf71]" },
    { label: "2195 Diamond", price: 645000, oldPrice: 680000, desc: "2010 + 185 bonus", coins: 6450, iconColor: "text-[#2fbf71]" },
    { label: "Magic Pass", price: 79000, oldPrice: 85000, desc: "Reward eksklusif 30 hari", coins: 790, iconColor: "text-[#c07bff]", badge: "BARU" },
    { label: "Magic Chest Bundle", price: 199000, oldPrice: 249000, desc: "5 skin eksklusif", coins: 1990, iconColor: "text-[#c07bff]" },
  ],
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

export default function MagicChessPage() {
  return <GameTopUpPage config={config} iconKind="diamond" />;
}
