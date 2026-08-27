"use client";

import GameTopUpPage, { type GameTopUpConfig } from "@/components/GameTopUpPage";

const config: GameTopUpConfig = {
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
    <>
      Buka game, tap Paimon Menu kiri atas. UID tertera di pojok kanan bawah. Server: Asia / America / Europe / TW / SAR.
    </>
  ),
  ntabs: ["Promo", "Genesis Crystal", "Blessing", "Bundle", "Event"],
  nominals: [
    { label: "60 Genesis", price: 16000, oldPrice: 17500, desc: "Bonus 60 crystal", coins: 60, iconColor: "text-[#5bc8ff]" },
    { label: "300 + 30 Genesis", price: 79000, oldPrice: 85000, desc: "Bonus 30 crystal", coins: 330, iconColor: "text-[#5bc8ff]" },
    { label: "980 + 110 Genesis", price: 249000, oldPrice: 265000, desc: "Bonus 110 crystal", coins: 1090, iconColor: "text-[#5bc8ff]" },
    { label: "1980 + 260 Genesis", price: 479000, oldPrice: 510000, desc: "Bonus 260 crystal", coins: 2240, iconColor: "text-[#5bc8ff]" },
    { label: "3280 + 600 Genesis", price: 799000, oldPrice: 845000, desc: "Bonus 600 crystal", coins: 3880, iconColor: "text-[#5bc8ff]" },
    { label: "6480 + 1600 Genesis", price: 1599000, oldPrice: 1690000, desc: "Bonus 1600 crystal", coins: 8080, iconColor: "text-[#5bc8ff]" },
    { label: "12960 + 3200 Genesis", price: 3199000, oldPrice: 3380000, desc: "Bonus 3200 crystal", coins: 16160, iconColor: "text-[#5bc8ff]" },
    { label: "Welkin Moon", price: 79000, oldPrice: 85000, desc: "90 crystal harian 30 hari", coins: 2790, iconColor: "text-[#c07bff]" },
    { label: "Genesis Crystals + BP", price: 189000, oldPrice: 215000, desc: "Crystal + Battle Pass", coins: 1890, iconColor: "text-[#c07bff]", badge: "BEST" },
  ],
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

export default function GenshinImpactPage() {
  return <GameTopUpPage config={config} iconKind="crystal" />;
}
