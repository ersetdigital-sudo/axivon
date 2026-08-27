"use client";

import GameTopUpPage, { type GameTopUpConfig } from "@/components/GameTopUpPage";

const config: GameTopUpConfig = {
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
    <>
      Buka profil dalam game, salin Activision ID. Format: <span className="text-[#eef1f4]">Nama#Tag Angka</span>.
    </>
  ),
  ntabs: ["Promo", "CP", "Battle Pass", "Bundle", "Event"],
  nominals: [
    { label: "80 CP", price: 15000, oldPrice: 16500, desc: "Bonus +8 CP", coins: 80, iconColor: "text-[#ff5c2b]" },
    { label: "400 CP", price: 72000, oldPrice: 78000, desc: "Bonus +45 CP", coins: 400, iconColor: "text-[#ff5c2b]" },
    { label: "800 CP", price: 142000, oldPrice: 152000, desc: "Bonus +90 CP", coins: 800, iconColor: "text-[#ff5c2b]" },
    { label: "2000 CP", price: 348000, oldPrice: 370000, desc: "Bonus +240 CP", coins: 2000, iconColor: "text-[#ff5c2b]" },
    { label: "5000 CP", price: 845000, oldPrice: 895000, desc: "Bonus +650 CP", coins: 5000, iconColor: "text-[#ff5c2b]" },
    { label: "Battle Pass", price: 99000, oldPrice: 109000, desc: "Akses 100 tier reward", coins: 990, iconColor: "text-[#c07bff]", badge: "HOT" },
  ],
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

export default function CodMobilePage() {
  return <GameTopUpPage config={config} iconKind="coin" />;
}
