"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const games = [
  { name: "Mobile Legends", slug: "/mobile-legends", cat: "mobile", price: "mulai Rp 3.500", badge: "-12%", badgeColor: "bg-[#ff5c2b] text-white", img: "/images/8f47dd26-4142-498f-a61c-14f17dc5cd18.png", search: "mobile legends mlbb diamond" },
  { name: "PUBG Mobile", slug: "/pubg-mobile", cat: "mobile", price: "mulai Rp 14.000", badge: "-5%", badgeColor: "bg-[#ff5c2b] text-white", img: "/images/517d8ae9-25a3-412d-ac02-fda4eea809ac.png", search: "pubg mobile uc" },
  { name: "Free Fire", slug: "/free-fire", cat: "mobile", price: "mulai Rp 2.900", badge: "TERLARIS", badgeColor: "bg-[#ffb020] text-[#101215]", img: "/images/068b552d-43d8-45eb-8ea5-420aac595ef2.png", search: "free fire ff diamond" },
  { name: "Magic Chess", slug: "/magic-chess", cat: "baru", price: "mulai Rp 5.000", badge: "BARU", badgeColor: "bg-[#2fbf71] text-[#101215]", img: "/images/9d357c22-da08-4270-9750-efeb7890bc0e.png", search: "magic chess go go" },
  { name: "COD Mobile", slug: "/cod-mobile", cat: "mobile", price: "mulai Rp 12.000", badge: "-6%", badgeColor: "bg-[#ff5c2b] text-white", img: "/images/bae33449-55c9-489e-b7de-16530bdaca12.png", search: "call of duty cod mobile" },
  { name: "Genshin Impact", slug: "/genshin-impact", cat: "pc", price: "mulai Rp 16.000", badge: "TERLARIS", badgeColor: "bg-[#ffb020] text-[#101215]", img: "/images/dd9c2680-f65c-41a5-a7f9-6e9338c893e7.png", search: "genshin impact genesis crystal" },
];

const tabList = [
  { id: "all", label: "Lagi Populer", icon: true },
  { id: "mobile", label: "Top Up Langsung" },
  { id: "baru", label: "Baru Rilis" },
  { id: "voucher", label: "Voucher" },
  { id: "pc", label: "PC Games" },
];

const vouchers = [
  { name: "Steam", price: "Rp 12.000+", accent: true },
  { name: "Google Play", price: "Rp 20.000+" },
  { name: "PlayStation", price: "Rp 50.000+" },
  { name: "Garena Shell", price: "Rp 10.000+" },
  { name: "Razer Gold", price: "Rp 15.000+" },
  { name: "Pulsa & Data", price: "Rp 5.000+" },
];

export default function GameCatalog() {
  const [activeTab, setActiveTab] = useState("all");
  const [query, setQuery] = useState("");

  const filtered = games.filter((g) => {
    const matchQ = g.search.includes(query.toLowerCase());
    const matchC = activeTab === "all" || activeTab === "voucher" || g.cat === activeTab;
    return matchQ && matchC;
  });

  return (
    <section id="katalog" className="mx-auto max-w-7xl px-4 sm:px-5 py-10 md:py-14">
      {/* Search */}
      <div className="bg-[#171a1f] border border-[#262b33] rounded-xl p-2 flex flex-col sm:flex-row gap-2">
        <div className="flex items-center gap-3 flex-1 px-3">
          <svg className="w-5 h-5 text-[#9aa3ad] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.2-3.2" />
          </svg>
          <input
            type="text"
            placeholder="Cari game… (Mobile Legends, PUBG, Genshin)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent py-3 outline-none placeholder:text-[#6d7681] text-[15px]"
          />
        </div>
        <a href="#grid" className="text-center font-semibold px-6 py-3 rounded-lg bg-[#ff5c2b] text-white transition hover:bg-[#ff7043]">
          Cari
        </a>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-2 overflow-x-auto no-scrollbar pb-1 text-sm">
        {tabList.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`shrink-0 px-4 py-2 rounded-lg font-semibold inline-flex items-center gap-2 transition ${
              activeTab === t.id
                ? "bg-[#eef1f4] text-[#101215]"
                : "bg-[#1c2026] border border-[#262b33] text-[#9aa3ad] hover:text-white"
            }`}
          >
            {t.icon && (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3c2 3.5.5 5.5-1 7-1.4 1.4-2 2.6-2 4a5 5 0 0 0 10 0c0-3-2-5.5-4-8-.6 1.6-1.6 2.2-3 3Z" />
              </svg>
            )}
            {t.label}
          </button>
        ))}
      </div>

      {/* Game Grid */}
      <div id="grid" className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {filtered.map((g) => (
          <Link
            key={g.name}
            href={g.slug}
            className="bg-[#1c2026] border border-[#262b33] rounded-xl overflow-hidden transition hover:border-[#3a424e] hover:bg-[#20252c] group"
          >
            <div className="relative overflow-hidden aspect-square">
              <Image src={g.img} alt={g.name} width={300} height={300} className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105" />
              <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-1 rounded ${g.badgeColor}`}>
                {g.badge}
              </span>
            </div>
            <div className="p-3">
              <div className="font-semibold text-sm leading-tight">{g.name}</div>
              <div className="text-xs text-[#9aa3ad] mt-1">{g.price}</div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-[#9aa3ad] mt-8 text-sm">Game nggak ketemu. Coba kata kunci lain ya.</p>
      )}

      {/* Voucher Row */}
      <div className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <h3 className="text-xl font-bold">Voucher digital</h3>
          <a href="#" className="text-sm text-[#9aa3ad] hover:text-white transition">Lihat semua</a>
        </div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {vouchers.map((v) => (
            <div key={v.name} className="bg-[#1c2026] border border-[#262b33] rounded-xl p-4 h-28 flex flex-col justify-between">
              <span className={`font-bold ${v.accent ? "text-[#ff5c2b]" : ""}`}>{v.name}</span>
              <span className="text-xs text-[#9aa3ad]">{v.price}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
