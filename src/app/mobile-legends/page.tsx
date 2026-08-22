"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const nominals = [
  { label: "Weekly Diamond Pass", price: 32100, oldPrice: 35000, desc: "Event Topup +100", coins: 321, iconColor: "text-[#5bc8ff]" },
  { label: "Weekly Diamond Pass x3", price: 96300, oldPrice: 105000, desc: "Event Topup +100", coins: 963, iconColor: "text-[#5bc8ff]" },
  { label: "296 Diamonds", price: 93017, oldPrice: 98000, desc: "256 + 40 bonus", coins: 930, iconColor: "text-[#5bc8ff]" },
  { label: "345 Diamonds", price: 101651, oldPrice: 106790, desc: "301 + 44 bonus", coins: 1016, iconColor: "text-[#5bc8ff]" },
  { label: "86 Diamonds", price: 24500, oldPrice: 26000, desc: "78 + 8 bonus", coins: 245, iconColor: "text-[#5bc8ff]" },
  { label: "Twilight Pass", price: 149000, oldPrice: 159000, desc: "Skin + 500 diamond", coins: 1490, iconColor: "text-[#c07bff]" },
];

const payments = [
  { label: "QRIS", fee: 0, desc: "Semua e-wallet & m-banking" },
  { label: "DANA", fee: 1000, desc: "Biaya Rp1.000" },
  { label: "Transfer BCA", fee: 2500, desc: "Biaya Rp2.500" },
];

const ntabs = ["Harga Spesial", "MLBB Pass", "Elite Bundle", "Event", "Diamonds"];

const rupiah = (n: number) => "Rp" + n.toLocaleString("id-ID");

function CheckIcon() {
  return (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  );
}

function DiamondIcon({ color }: { color: string }) {
  return (
    <svg className={`w-6 h-6 ${color}`} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 3h12l4 6-10 12L2 9Z" opacity=".85" />
    </svg>
  );
}

export default function MobileLegendsPage() {
  const [selectedNominal, setSelectedNominal] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState(0);
  const [uid, setUid] = useState("");
  const [zid, setZid] = useState("");
  const [activeNtab, setActiveNtab] = useState(0);
  const [activePtab, setActivePtab] = useState(0);
  const [showWarn, setShowWarn] = useState(false);

  const nom = nominals[selectedNominal];
  const pay = payments[selectedPayment];
  const total = nom.price + pay.fee;
  const account = uid ? uid + (zid ? ` (${zid})` : "") : "\u2014";

  return (
    <>
      <Header />

      <div className="mx-auto max-w-7xl px-4 sm:px-5 pt-5 text-sm text-[#9aa3ad] flex items-center gap-2">
        <Link href="/" className="hover:text-white transition">Home</Link>
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m9 6 6 6-6 6" />
        </svg>
        <span className="text-[#eef1f4]">Mobile Legends</span>
      </div>

      <main className="mx-auto max-w-7xl px-4 sm:px-5 py-6 grid lg:grid-cols-[330px_1fr] gap-6 items-start">
        <aside className="lg:sticky lg:top-24 space-y-4">
          <GameInfoCard />
          <HowToTopUp />
          <HelpCard />
        </aside>

        <div className="space-y-4">
          <NoticeBar />

          <div className="bg-[#171a1f] border border-[#262b33] rounded-xl p-1.5 grid grid-cols-2 gap-1.5 text-sm">
            {["Pembelian", "Gift Voucher"].map((t, i) => (
              <button key={t} onClick={() => setActivePtab(i)}
                className={`px-4 py-2.5 rounded-lg font-semibold transition ${activePtab === i ? "bg-[#eef1f4] text-[#101215]" : "text-[#9aa3ad] hover:text-white"}`}>
                {t}
              </button>
            ))}
          </div>

          <Step1Nominal
            ntabs={ntabs} activeNtab={activeNtab} setActiveNtab={setActiveNtab}
            nominals={nominals} selectedNominal={selectedNominal} setSelectedNominal={setSelectedNominal}
          />

          <Step2Account uid={uid} setUid={setUid} zid={zid} setZid={setZid} />

          <Step3Payment payments={payments} selectedPayment={selectedPayment} setSelectedPayment={setSelectedPayment} />

          <SummaryPanel nom={nom} pay={pay} total={total} account={account} showWarn={showWarn} setShowWarn={setShowWarn} uid={uid} zid={zid} />
        </div>
      </main>

      <MobileStickyBar total={total} />
      <div className="mt-10">
        <Footer />
      </div>
    </>
  );
}

function GameInfoCard() {
  return (
    <div className="bg-[#171a1f] border border-[#262b33] rounded-xl overflow-hidden">
      <div className="p-5 flex gap-4 items-center">
        <Image src="/images/8f47dd26-4142-498f-a61c-14f17dc5cd18.png" alt="Mobile Legends" width={80} height={80}
          className="w-20 h-20 rounded-xl object-cover border border-[#262b33]" />
        <div>
          <span className="text-[10px] font-bold tracking-wide px-2 py-0.5 rounded bg-[#ff5c2b] text-white">TOP UP</span>
          <h1 className="mt-1.5 text-lg font-extrabold leading-tight">Mobile Legends:<br />Bang Bang</h1>
          <p className="text-xs text-[#9aa3ad] mt-1">Moonton</p>
        </div>
      </div>
      <div className="grid grid-cols-2 border-t border-[#262b33] text-xs">
        <div className="px-4 py-3 flex items-center gap-2 border-r border-[#262b33]">
          <svg className="w-4 h-4 text-[#2fbf71] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3 4.5 6v6c0 4.2 3.1 7.9 7.5 9 4.4-1.1 7.5-4.8 7.5-9V6Z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          Supply resmi
        </div>
        <div className="px-4 py-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-[#2fbf71] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 1 3 6.7" />
            <path d="M3 20v-5h5" />
          </svg>
          Garansi refund
        </div>
      </div>
    </div>
  );
}

function HowToTopUp() {
  const steps = [
    "Masukkan User ID dan Zone ID kamu.",
    "Contoh: 1234567 (1234).",
    "Pilih nominal diamond yang kamu mau.",
    "Pilih metode pembayaran, lalu bayar.",
    "Diamond masuk otomatis ke akunmu.",
  ];
  return (
    <div className="bg-[#171a1f] border border-[#262b33] rounded-xl p-5">
      <h2 className="font-bold text-sm">Cara top up Mobile Legends</h2>
      <ol className="mt-3 space-y-2.5 text-sm text-[#9aa3ad]">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-3">
            <span className="shrink-0 w-5 h-5 rounded-md bg-[#262b33] grid place-items-center text-[11px] font-bold text-[#eef1f4]">{i + 1}</span>
            {i === 1 ? <>Contoh: <span className="text-[#eef1f4]">1234567 (1234)</span>.</> : s}
          </li>
        ))}
      </ol>
    </div>
  );
}

function HelpCard() {
  return (
    <div className="bg-[#171a1f] border border-[#262b33] rounded-xl p-5">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <svg className="w-4 h-4 text-[#ffb020]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v5M12 16h.01" />
        </svg>
        Butuh bantuan?
      </div>
      <p className="text-sm text-[#9aa3ad] mt-2">CS aktif 08.00\u201324.00 WIB, rata-rata balas di bawah 3 menit.</p>
      <a href="https://wa.me/6281234567890" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg bg-[#1c2026] border border-[#262b33] hover:border-[#3a424e] transition">
        <svg className="w-4 h-4 text-[#2fbf71]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.5 14.1c-.2.7-1.3 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5-4.5-.2-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.3.3c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.2.4-.2.6-.1l2 .9c.2.1.4.2.4.3.1.2.1.7-.1 1.3Z" />
        </svg>
        Chat CS
      </a>
    </div>
  );
}

function NoticeBar() {
  return (
    <div className="rounded-xl border border-[#4a3a1c] bg-[#20190d] px-4 py-3 text-sm flex gap-3">
      <svg className="w-5 h-5 text-[#ffb020] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.3 3.9 1.9 18a2 2 0 0 0 1.7 3h16.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
        <path d="M12 9v4M12 17h.01" />
      </svg>
      <span className="min-w-0">Akun harus region Indonesia. Weekly Diamond Pass maksimal 10x dalam 70 hari.</span>
    </div>
  );
}

interface NominalItem { label: string; price: number; oldPrice: number; desc: string; coins: number; iconColor: string; }

function Step1Nominal({ ntabs, activeNtab, setActiveNtab, nominals, selectedNominal, setSelectedNominal }: {
  ntabs: string[]; activeNtab: number; setActiveNtab: (n: number) => void;
  nominals: NominalItem[]; selectedNominal: number; setSelectedNominal: (n: number) => void;
}) {
  return (
    <section className="bg-[#171a1f] border border-[#262b33] rounded-xl p-5">
      <div className="flex items-center gap-3">
        <span className="w-6 h-6 rounded-lg grid place-items-center text-xs font-bold bg-[#ff5c2b] text-white">1</span>
        <h2 className="font-bold text-lg">Pilih nominal</h2>
      </div>
      <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar pb-1 text-sm">
        {ntabs.map((t, i) => (
          <button key={t} onClick={() => setActiveNtab(i)}
            className={`shrink-0 px-3.5 py-1.5 rounded-lg font-semibold transition ${activeNtab === i ? "bg-[#eef1f4] text-[#101215]" : "bg-[#1c2026] border border-[#262b33] text-[#9aa3ad] hover:text-white"}`}>
            {t}
          </button>
        ))}
      </div>
      <h3 className="mt-5 text-sm font-semibold text-[#9aa3ad]">Harga spesial minggu ini</h3>
      <div className="mt-3 grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {nominals.map((n, i) => (
          <label key={i} className="relative block cursor-pointer" onClick={() => setSelectedNominal(i)}>
            <div className={`bg-[#1c2026] border rounded-xl p-4 h-full transition ${selectedNominal === i ? "border-[#ff5c2b] bg-[#231a17]" : "border-[#262b33]"}`}>
              <div className="flex items-start justify-between gap-2">
                <DiamondIcon color={n.iconColor} />
                <span className={`w-5 h-5 rounded-full bg-[#ff5c2b] grid place-items-center transition ${selectedNominal === i ? "opacity-100" : "opacity-0"}`}>
                  <CheckIcon />
                </span>
              </div>
              <div className="mt-3 font-semibold text-sm leading-snug">{n.label}</div>
              <div className="text-xs text-[#9aa3ad] mt-0.5">{n.desc}</div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-xs text-[#9aa3ad] line-through">{rupiah(n.oldPrice)}</span>
                <span className="font-bold text-[#ff5c2b]">{rupiah(n.price)}</span>
              </div>
              <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-[#9aa3ad]">
                <svg className="w-3.5 h-3.5 text-[#ffb020]" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="9" /></svg>
                +{n.coins.toLocaleString("id-ID")} koin
              </div>
            </div>
          </label>
        ))}
      </div>
    </section>
  );
}

function Step2Account({ uid, setUid, zid, setZid }: {
  uid: string; setUid: (v: string) => void; zid: string; setZid: (v: string) => void;
}) {
  return (
    <section className="bg-[#171a1f] border border-[#262b33] rounded-xl p-5">
      <div className="flex items-center gap-3">
        <span className="w-6 h-6 rounded-lg grid place-items-center text-xs font-bold bg-[#ff5c2b] text-white">2</span>
        <h2 className="font-bold text-lg">Masukkan akun</h2>
      </div>
      <div className="mt-4 grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-[#9aa3ad]">User ID</label>
          <input type="text" inputMode="numeric" placeholder="1234567" value={uid} onChange={(e) => setUid(e.target.value)}
            className="mt-1.5 w-full rounded-lg px-3.5 py-3 text-sm placeholder:text-[#5d6570] bg-[#12151a] border border-[#262b33] focus:outline-none focus:border-[#ff5c2b]" />
        </div>
        <div>
          <label className="text-xs font-semibold text-[#9aa3ad]">Zone ID</label>
          <input type="text" inputMode="numeric" placeholder="1234" value={zid} onChange={(e) => setZid(e.target.value)}
            className="mt-1.5 w-full rounded-lg px-3.5 py-3 text-sm placeholder:text-[#5d6570] bg-[#12151a] border border-[#262b33] focus:outline-none focus:border-[#ff5c2b]" />
        </div>
      </div>
      <p className="mt-3 text-xs text-[#9aa3ad]">
        Buka game, tap avatar di kiri atas. User ID dan Zone ID ada di bawah nama kamu, contoh <span className="text-[#eef1f4]">1234567 (1234)</span>.
      </p>
    </section>
  );
}

interface PaymentItem { label: string; fee: number; desc: string; }

function Step3Payment({ payments, selectedPayment, setSelectedPayment }: {
  payments: PaymentItem[]; selectedPayment: number; setSelectedPayment: (n: number) => void;
}) {
  return (
    <section className="bg-[#171a1f] border border-[#262b33] rounded-xl p-5">
      <div className="flex items-center gap-3">
        <span className="w-6 h-6 rounded-lg grid place-items-center text-xs font-bold bg-[#ff5c2b] text-white">3</span>
        <h2 className="font-bold text-lg">Metode pembayaran</h2>
      </div>
      <div className="mt-4 grid sm:grid-cols-3 gap-3">
        {payments.map((p, i) => (
          <label key={i} className="relative block cursor-pointer" onClick={() => setSelectedPayment(i)}>
            <div className={`bg-[#1c2026] border rounded-xl px-4 py-3 flex items-center justify-between transition ${selectedPayment === i ? "border-[#ff5c2b]" : "border-[#262b33]"}`}>
              <div>
                <div className="font-semibold text-sm">{p.label}</div>
                <div className="text-xs text-[#9aa3ad]">{p.desc}</div>
              </div>
              <span className={`w-5 h-5 rounded-full bg-[#ff5c2b] grid place-items-center shrink-0 transition ${selectedPayment === i ? "opacity-100" : "opacity-0"}`}>
                <CheckIcon />
              </span>
            </div>
          </label>
        ))}
      </div>
    </section>
  );
}

function SummaryPanel({ nom, pay, total, account, showWarn, setShowWarn, uid, zid }: {
  nom: NominalItem; pay: PaymentItem; total: number; account: string;
  showWarn: boolean; setShowWarn: (v: boolean) => void; uid: string; zid: string;
}) {
  const handleBuy = () => {
    if (!uid.trim() || !zid.trim()) {
      setShowWarn(true);
    } else {
      setShowWarn(false);
    }
  };

  return (
    <section className="bg-[#171a1f] border border-[#262b33] rounded-xl p-5">
      <h2 className="font-bold text-lg">Ringkasan pesanan</h2>
      <dl className="mt-4 space-y-2.5 text-sm">
        <div className="flex justify-between gap-4"><dt className="text-[#9aa3ad]">Produk</dt><dd className="font-semibold text-right">{nom.label}</dd></div>
        <div className="flex justify-between gap-4"><dt className="text-[#9aa3ad]">Akun</dt><dd className="font-semibold text-right">{account}</dd></div>
        <div className="flex justify-between gap-4"><dt className="text-[#9aa3ad]">Pembayaran</dt><dd className="font-semibold text-right">{pay.label}</dd></div>
        <div className="flex justify-between gap-4"><dt className="text-[#9aa3ad]">Harga</dt><dd className="font-semibold text-right">{rupiah(nom.price)}</dd></div>
        <div className="flex justify-between gap-4"><dt className="text-[#9aa3ad]">Biaya layanan</dt><dd className="font-semibold text-right">{rupiah(pay.fee)}</dd></div>
      </dl>
      <div className="mt-4 pt-4 border-t border-[#262b33] flex items-end justify-between gap-4">
        <div>
          <div className="text-xs text-[#9aa3ad]">Total bayar</div>
          <div className="text-2xl font-extrabold text-[#ff5c2b]">{rupiah(total)}</div>
        </div>
        <button onClick={handleBuy} className="px-6 py-3 rounded-lg bg-[#ff5c2b] text-white font-semibold transition hover:bg-[#ff7043]">
          Beli Sekarang
        </button>
      </div>
      {showWarn && <p className="mt-3 text-xs text-[#ffb020]">Isi User ID dan Zone ID dulu ya sebelum lanjut bayar.</p>}
    </section>
  );
}

function MobileStickyBar({ total }: { total: number }) {
  return (
    <div className="lg:hidden sticky bottom-0 z-40 bg-[#101215]/95 backdrop-blur border-t border-[#262b33] px-4 py-3 flex items-center justify-between gap-4">
      <div>
        <div className="text-xs text-[#9aa3ad]">Total bayar</div>
        <div className="font-extrabold text-[#ff5c2b]">{rupiah(total)}</div>
      </div>
      <a href="#beli" className="px-5 py-2.5 rounded-lg bg-[#ff5c2b] text-white font-semibold text-sm">Beli Sekarang</a>
    </div>
  );
}
