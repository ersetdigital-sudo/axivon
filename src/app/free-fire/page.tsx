"use client";

import GameTopUpPage, { type GameTopUpConfig } from "@/components/GameTopUpPage";

const config: GameTopUpConfig = {
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
    <>
      Buka profil di dalam game, ID terlihat di samping avatar kamu. Contoh:{" "}
      <span className="text-[#eef1f4]">123456789</span>.
    </>
  ),
  ntabs: ["Promo", "Diamond", "Membership", "Bundle", "Event"],
  nominals: [
    { label: "70 Diamond", price: 12000, oldPrice: 13500, desc: "Bonus +5", coins: 70, iconColor: "text-[#ff5c2b]" },
    { label: "140 Diamond", price: 23500, oldPrice: 26000, desc: "Bonus +12", coins: 140, iconColor: "text-[#ff5c2b]" },
    { label: "355 Diamond", price: 58000, oldPrice: 63000, desc: "Bonus +30", coins: 355, iconColor: "text-[#ff5c2b]" },
    { label: "720 Diamond", price: 115000, oldPrice: 125000, desc: "Bonus +70", coins: 720, iconColor: "text-[#ff5c2b]" },
    { label: "1450 Diamond", price: 228000, oldPrice: 245000, desc: "Bonus +150", coins: 1450, iconColor: "text-[#ff5c2b]" },
    { label: "2180 Diamond", price: 339000, oldPrice: 365000, desc: "Bonus +250", coins: 2180, iconColor: "text-[#ff5c2b]" },
    { label: "3680 Diamond", price: 559000, oldPrice: 595000, desc: "Bonus +450", coins: 3680, iconColor: "text-[#ff5c2b]" },
    { label: "Weekly Membership", price: 28900, oldPrice: 32000, desc: "Diamond harian 7 hari", coins: 289, iconColor: "text-[#c07bff]" },
    { label: "Monthly Membership", price: 79900, oldPrice: 89000, desc: "Diamond harian 30 hari", coins: 799, iconColor: "text-[#c07bff]", badge: "BEST" },
  ],
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

export default function FreeFirePage() {
  return <GameTopUpPage config={config} iconKind="diamond" />;
}
