"use client";

import GameTopUpPage, { type GameTopUpConfig } from "@/components/GameTopUpPage";

const config: GameTopUpConfig = {
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
    <>
      Buka profil di dalam game, Player ID tertera di bawah nickname kamu. Salin tanpa spasi.
    </>
  ),
  ntabs: ["Harga Spesial", "UC", "Royal Pass", "Bundle", "Event"],
  nominals: [
    { label: "60 UC", price: 14000, oldPrice: 15000, desc: "Bonus +5 UC", coins: 60, iconColor: "text-[#ffb020]" },
    { label: "300 UC", price: 68000, oldPrice: 72000, desc: "Bonus +30 UC", coins: 300, iconColor: "text-[#ffb020]" },
    { label: "600 UC", price: 134000, oldPrice: 142000, desc: "Bonus +75 UC", coins: 600, iconColor: "text-[#ffb020]" },
    { label: "1500 UC", price: 328000, oldPrice: 345000, desc: "Bonus +210 UC", coins: 1500, iconColor: "text-[#ffb020]" },
    { label: "3000 UC", price: 645000, oldPrice: 680000, desc: "Bonus +450 UC", coins: 3000, iconColor: "text-[#ffb020]" },
    { label: "6000 UC", price: 1280000, oldPrice: 1350000, desc: "Bonus +1000 UC", coins: 6000, iconColor: "text-[#ffb020]" },
    { label: "12000 UC", price: 2540000, oldPrice: 2680000, desc: "Bonus +2200 UC", coins: 12000, iconColor: "text-[#ffb020]" },
    { label: "Elite Pass Plus", price: 169000, oldPrice: 189000, desc: "Skip reward 25 level", coins: 1690, iconColor: "text-[#c07bff]", badge: "EVENT" },
    { label: "Royal Pass", price: 89000, oldPrice: 99000, desc: "Akses 100 reward", coins: 890, iconColor: "text-[#c07bff]" },
  ],
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

export default function PubgMobilePage() {
  return <GameTopUpPage config={config} iconKind="uc" />;
}
