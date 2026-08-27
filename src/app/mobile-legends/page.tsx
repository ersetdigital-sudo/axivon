"use client";

import GameTopUpPage, { type GameTopUpConfig } from "@/components/GameTopUpPage";

const config: GameTopUpConfig = {
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
  nominals: [
    { label: "Weekly Diamond Pass", price: 32100, oldPrice: 35000, desc: "Event Topup +100", coins: 321, iconColor: "text-[#5bc8ff]" },
    { label: "Weekly Diamond Pass x3", price: 96300, oldPrice: 105000, desc: "Event Topup +100", coins: 963, iconColor: "text-[#5bc8ff]" },
    { label: "296 Diamonds", price: 93017, oldPrice: 98000, desc: "256 + 40 bonus", coins: 930, iconColor: "text-[#5bc8ff]" },
    { label: "345 Diamonds", price: 101651, oldPrice: 106790, desc: "301 + 44 bonus", coins: 1016, iconColor: "text-[#5bc8ff]" },
    { label: "86 Diamonds", price: 24500, oldPrice: 26000, desc: "78 + 8 bonus", coins: 245, iconColor: "text-[#5bc8ff]" },
    { label: "Twilight Pass", price: 149000, oldPrice: 159000, desc: "Skin + 500 diamond", coins: 1490, iconColor: "text-[#c07bff]" },
  ],
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

export default function MobileLegendsPage() {
  return <GameTopUpPage config={config} />;
}
