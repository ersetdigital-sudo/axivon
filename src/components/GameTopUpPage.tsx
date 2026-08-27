"use client";

import { useState, ReactNode } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createOrderAction } from "@/app/actions";

export interface NominalItem {
  id?: number;
  label: string;
  price: number;
  oldPrice: number;
  desc: string;
  coins: number;
  iconColor: string;
  badge?: string;
}

export interface PaymentItem {
  id?: number;
  label: string;
  fee: number;
  desc: string;
}

export interface GameTopUpConfig {
  slug: string;
  name: string;
  shortName: string;
  publisher: string;
  heroImage: string;
  heroBadge: string;
  nominalIconColor: string;
  accountFields: { id: "uid" | "zid" | "playerId" | "server"; label: string; placeholder: string }[];
  accountHelp: ReactNode;
  notice: string;
  ntabs: string[];
  nominals: NominalItem[];
  payments: PaymentItem[];
  regionNote?: string;
  howToSteps: string[];
}

const rupiah = (n: number) => "Rp" + n.toLocaleString("id-ID");

function CheckIcon() {
  return (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  );
}

function NominalIcon({ color, kind = "diamond" }: { color: string; kind?: "diamond" | "uc" | "crystal" | "coin" }) {
  if (kind === "uc") {
    return (
      <svg className={`w-6 h-6 ${color}`} viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="9" opacity=".85" />
        <path d="M9 8h4.5a2.5 2.5 0 0 1 0 5H9V8Zm0 5h5a2.5 2.5 0 0 1 0 5H9v-5Z" fill="#101215" opacity=".25" />
      </svg>
    );
  }
  if (kind === "crystal") {
    return (
      <svg className={`w-6 h-6 ${color}`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2 4 9l8 13 8-13-8-7Z" opacity=".85" />
      </svg>
    );
  }
  if (kind === "coin") {
    return (
      <svg className={`w-6 h-6 ${color}`} viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="9" opacity=".85" />
        <path d="M12 6v12M9 9h4.5a1.5 1.5 0 0 1 0 3H9a1.5 1.5 0 0 0 0 3h5" stroke="#101215" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg className={`w-6 h-6 ${color}`} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 3h12l4 6-10 12L2 9Z" opacity=".85" />
    </svg>
  );
}

export default function GameTopUpPage({ config, iconKind = "diamond" as "diamond" | "uc" | "crystal" | "coin" }: { config: GameTopUpConfig; iconKind?: "diamond" | "uc" | "crystal" | "coin" }) {
  const [selectedNominal, setSelectedNominal] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState(0);
  const [activeNtab, setActiveNtab] = useState(0);
  const [activePtab, setActivePtab] = useState(0);
  const [showWarn, setShowWarn] = useState(false);

  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [whatsapp, setWhatsapp] = useState("");
  const setField = (id: string, v: string) => setFieldValues((p) => ({ ...p, [id]: v }));

  const nom = config.nominals[selectedNominal];
  const pay = config.payments[selectedPayment];
  const total = nom.price + pay.fee;
  const account = config.accountFields
    .map((f) => fieldValues[f.id])
    .filter(Boolean)
    .join(" / ") || "\u2014";

  const allFilled = config.accountFields.every((f) => fieldValues[f.id]?.trim());

  const handleBuy = (e: React.FormEvent) => {
    if (!allFilled) {
      e.preventDefault();
      setShowWarn(true);
    } else {
      setShowWarn(false);
    }
  };

  return (
    <>
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-5 pt-4 pb-2 text-sm text-[#9aa3ad] flex items-center gap-2">
        <Link href="/" className="hover:text-white transition">Home</Link>
        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m9 6 6 6-6 6" />
        </svg>
        <span className="text-[#eef1f4]">{config.name}</span>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-5 py-4 pb-24 lg:pb-6 overflow-hidden">
        <div className="lg:hidden mb-4">
          <GameInfoCard config={config} />
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-[330px_1fr] gap-5 items-start">
          <aside className="hidden lg:block lg:sticky lg:top-24 space-y-4 w-full">
            <GameInfoCard config={config} />
            <HowToTopUp steps={config.howToSteps} name={config.shortName} />
            <HelpCard />
          </aside>

          <div className="w-full min-w-0 space-y-4">
            <NoticeBar notice={config.notice} />

            <div className="bg-[#171a1f] border border-[#262b33] rounded-xl p-1.5 grid grid-cols-2 gap-1.5 text-sm">
              {["Pembelian", "Gift Voucher"].map((t, i) => (
                <button key={t} onClick={() => setActivePtab(i)}
                  className={`px-4 py-2.5 rounded-lg font-semibold transition ${activePtab === i ? "bg-[#eef1f4] text-[#101215]" : "text-[#9aa3ad] hover:text-white"}`}>
                  {t}
                </button>
              ))}
            </div>

            <Step1Nominal
              ntabs={config.ntabs} activeNtab={activeNtab} setActiveNtab={setActiveNtab}
              nominals={config.nominals} selectedNominal={selectedNominal} setSelectedNominal={setSelectedNominal}
              iconKind={iconKind} iconColor={config.nominalIconColor}
            />

            <Step2Account fields={config.accountFields} values={fieldValues} setField={setField} help={config.accountHelp} whatsapp={whatsapp} setWhatsapp={setWhatsapp} />

            <Step3Payment payments={config.payments} selectedPayment={selectedPayment} setSelectedPayment={setSelectedPayment} />

            <SummaryPanel
              nom={nom} pay={pay} total={total} account={account}
              showWarn={showWarn} allFilled={allFilled} handleBuy={handleBuy}
              gameSlug={config.slug.replace("/", "")} customerUid={fieldValues.uid || fieldValues.playerId || ""}
              customerZid={fieldValues.zid || fieldValues.server || ""}
              customerWhatsapp={whatsapp}
            />
          </div>
        </div>
      </main>

      <MobileStickyBar total={total} />
      <div className="mt-10 hidden lg:block">
        <Footer />
      </div>
    </>
  );
}

function GameInfoCard({ config }: { config: GameTopUpConfig }) {
  return (
    <div className="bg-[#171a1f] border border-[#262b33] rounded-xl overflow-hidden">
      <div className="p-4 sm:p-5 flex gap-3 sm:gap-4 items-center">
        <Image src={config.heroImage} alt={config.name} width={80} height={80}
          className="w-20 h-20 rounded-xl object-cover border border-[#262b33]" />
        <div className="min-w-0">
          <span className="inline-block text-[10px] font-bold tracking-wide px-2 py-0.5 rounded bg-[#ff5c2b] text-white">TOP UP</span>
          <h1 className="mt-1.5 text-lg font-extrabold leading-tight break-words">{config.name}</h1>
          <p className="text-xs text-[#9aa3ad] mt-1">{config.publisher}</p>
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

function HowToTopUp({ steps, name }: { steps: string[]; name: string }) {
  return (
    <div className="bg-[#171a1f] border border-[#262b33] rounded-xl p-4 sm:p-5">
      <h2 className="font-bold text-sm">Cara top up {name}</h2>
      <ol className="mt-3 space-y-2.5 text-sm text-[#9aa3ad]">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-3">
            <span className="shrink-0 w-5 h-5 rounded-md bg-[#262b33] grid place-items-center text-[11px] font-bold text-[#eef1f4]">{i + 1}</span>
            <span>{s}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function HelpCard() {
  return (
    <div className="bg-[#171a1f] border border-[#262b33] rounded-xl p-4 sm:p-5">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <svg className="w-4 h-4 text-[#ffb020]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v5M12 16h.01" />
        </svg>
        Butuh bantuan?
      </div>
      <p className="text-sm text-[#9aa3ad] mt-2">CS aktif 08.00–24.00 WIB, rata-rata balas di bawah 3 menit.</p>
      <a href="https://wa.me/6281234567890" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg bg-[#1c2026] border border-[#262b33] hover:border-[#3a424e] transition">
        <svg className="w-4 h-4 text-[#2fbf71]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.5 14.1c-.2.7-1.3 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5-4.5-.2-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.3.3c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.2.4-.2.6-.1l2 .9c.2.1.4.2.4.3.1.2.1.7-.1 1.3Z" />
        </svg>
        Chat CS
      </a>
    </div>
  );
}

function NoticeBar({ notice }: { notice: string }) {
  return (
    <div className="rounded-xl border border-[#4a3a1c] bg-[#20190d] px-4 py-3 text-sm flex gap-3">
      <svg className="w-5 h-5 text-[#ffb020] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.3 3.9 1.9 18a2 2 0 0 0 1.7 3h16.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
        <path d="M12 9v4M12 17h.01" />
      </svg>
      <span className="min-w-0">{notice}</span>
    </div>
  );
}

function TabIcon({ kind, active }: { kind: "promo" | "wallet" | "star" | "box" | "bolt"; active: boolean }) {
  const className = `w-4 h-4 ${active ? "text-white" : "text-[#9aa3ad]"}`;
  switch (kind) {
    case "wallet":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="6" width="18" height="14" rx="2.5" />
          <path d="M3 10h18" />
          <circle cx="17" cy="15" r="1.4" fill="currentColor" />
        </svg>
      );
    case "star":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 3 2.6 5.6 6.1.8-4.5 4.2 1.2 6.1L12 16.8 6.6 19.7l1.2-6.1L3.3 9.4l6.1-.8z" />
        </svg>
      );
    case "box":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" />
          <path d="m3 8 9 5 9-5M12 13v8" />
        </svg>
      );
    case "bolt":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12z" />
        </svg>
      );
    case "promo":
    default:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z" />
          <circle cx="8" cy="8" r="1.4" fill="currentColor" />
        </svg>
      );
  }
}

function Step1Nominal({ ntabs, activeNtab, setActiveNtab, nominals, selectedNominal, setSelectedNominal, iconKind, iconColor }: {
  ntabs: string[]; activeNtab: number; setActiveNtab: (n: number) => void;
  nominals: NominalItem[]; selectedNominal: number; setSelectedNominal: (n: number) => void;
  iconKind: "diamond" | "uc" | "crystal" | "coin"; iconColor: string;
}) {
  const tabIcons = ["promo", "wallet", "star", "box", "bolt"] as const;
  return (
    <section className="bg-[#171a1f] border border-[#262b33] rounded-xl p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <span className="w-6 h-6 rounded-lg grid place-items-center text-xs font-bold bg-[#ff5c2b] text-white">1</span>
        <h2 className="font-bold text-lg">Pilih nominal</h2>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 sm:hidden">
        {ntabs.map((t, i) => (
          <button key={t} onClick={() => setActiveNtab(i)}
            className={`relative flex flex-col items-center justify-center gap-1.5 px-2 py-3 rounded-xl font-semibold text-[11px] leading-tight transition-all ${
              activeNtab === i
                ? "bg-gradient-to-br from-[#ff5c2b] to-[#ff7a3f] text-white shadow-lg shadow-[#ff5c2b]/25"
                : "bg-[#1c2026] border border-[#262b33] text-[#9aa3ad] active:scale-95"
            }`}>
            <TabIcon kind={tabIcons[i] || "promo"} active={activeNtab === i} />
            <span className="line-clamp-1">{t}</span>
            {activeNtab === i && <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white" />}
          </button>
        ))}
      </div>

      <div className="mt-4 hidden sm:flex gap-2 overflow-x-auto no-scrollbar pb-1 text-sm">
        {ntabs.map((t, i) => (
          <button key={t} onClick={() => setActiveNtab(i)}
            className={`shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
              activeNtab === i
                ? "bg-[#eef1f4] text-[#101215] shadow-md"
                : "bg-[#1c2026] border border-[#262b33] text-[#9aa3ad] hover:text-white hover:border-[#3a424e]"
            }`}>
            <TabIcon kind={tabIcons[i] || "promo"} active={activeNtab === i} />
            {t}
          </button>
        ))}
      </div>

      <h3 className="mt-5 text-sm font-semibold text-[#9aa3ad]">Harga spesial minggu ini</h3>
      <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3">
        {nominals.map((n, i) => (
          <label key={i} className="relative block cursor-pointer group" onClick={() => setSelectedNominal(i)}>
            <div className={`relative bg-[#1c2026] border rounded-lg sm:rounded-xl p-2.5 sm:p-4 h-full transition-all duration-150 ${
              selectedNominal === i
                ? "border-[#ff5c2b] bg-[#231a17] shadow-[inset_0_0_0_1px_rgba(255,92,43,0.4)]"
                : "border-[#262b33] hover:border-[#3a424e] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30"
            }`}>
              <div className="flex items-start justify-between gap-1.5">
                <NominalIcon color={iconColor} kind={iconKind} />
                {n.badge && (
                  <span className="text-[9px] sm:text-[10px] font-bold tracking-wide px-1.5 py-0.5 rounded bg-[#ff5c2b] text-white">{n.badge}</span>
                )}
                <span className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#ff5c2b] grid place-items-center transition ml-auto ${selectedNominal === i ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}>
                  <CheckIcon />
                </span>
              </div>
              <div className="mt-2 sm:mt-3 font-semibold text-[12px] sm:text-sm leading-snug">{n.label}</div>
              <div className="text-[10px] sm:text-xs text-[#9aa3ad] mt-0.5 line-clamp-1">{n.desc}</div>
              <div className="mt-2 sm:mt-3 flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
                <span className="text-[10px] sm:text-xs text-[#9aa3ad] line-through">{rupiah(n.oldPrice)}</span>
                <span className="font-bold text-[#ff5c2b] text-sm sm:text-base">{rupiah(n.price)}</span>
              </div>
              <div className="mt-1.5 sm:mt-2 inline-flex items-center gap-1 text-[10px] sm:text-[11px] text-[#9aa3ad]">
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#ffb020]" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="9" /></svg>
                +{n.coins.toLocaleString("id-ID")} koin
              </div>
            </div>
          </label>
        ))}
      </div>
    </section>
  );
}

function Step2Account({ fields, values, setField, help, whatsapp, setWhatsapp }: {
  fields: GameTopUpConfig["accountFields"]; values: Record<string, string>;
  setField: (id: string, v: string) => void; help: ReactNode;
  whatsapp: string; setWhatsapp: (v: string) => void;
}) {
  const gridCols = fields.length === 1 ? "grid-cols-1" : fields.length === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-3";
  return (
    <section className="bg-[#171a1f] border border-[#262b33] rounded-xl p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <span className="w-6 h-6 rounded-lg grid place-items-center text-xs font-bold bg-[#ff5c2b] text-white">2</span>
        <h2 className="font-bold text-lg">Masukkan akun</h2>
      </div>
      <div className={`mt-4 grid ${gridCols} gap-3`}>
        {fields.map((f) => (
          <div key={f.id}>
            <label className="text-xs font-semibold text-[#9aa3ad]">{f.label}</label>
            <input type="text" placeholder={f.placeholder} value={values[f.id] || ""} onChange={(e) => setField(f.id, e.target.value)}
              className="mt-1.5 w-full rounded-lg px-3.5 py-3 text-sm placeholder:text-[#5d6570] bg-[#12151a] border border-[#262b33] focus:outline-none focus:border-[#ff5c2b]" />
          </div>
        ))}
        <div>
          <label className="text-xs font-semibold text-[#9aa3ad]">WhatsApp <span className="text-[#6d7681] font-normal">(opsional)</span></label>
          <input type="tel" inputMode="numeric" placeholder="6281234567890" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)}
            className="mt-1.5 w-full rounded-lg px-3.5 py-3 text-sm placeholder:text-[#5d6570] bg-[#12151a] border border-[#262b33] focus:outline-none focus:border-[#ff5c2b]" />
        </div>
      </div>
      <p className="mt-3 text-xs text-[#9aa3ad]">{help}</p>
    </section>
  );
}

function Step3Payment({ payments, selectedPayment, setSelectedPayment }: {
  payments: PaymentItem[]; selectedPayment: number; setSelectedPayment: (n: number) => void;
}) {
  return (
    <section className="bg-[#171a1f] border border-[#262b33] rounded-xl p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <span className="w-6 h-6 rounded-lg grid place-items-center text-xs font-bold bg-[#ff5c2b] text-white">3</span>
        <h2 className="font-bold text-lg">Metode pembayaran</h2>
      </div>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
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

function SummaryPanel({ nom, pay, total, account, showWarn, allFilled, handleBuy, gameSlug, customerUid, customerZid, customerWhatsapp }: {
  nom: NominalItem; pay: PaymentItem; total: number; account: string;
  showWarn: boolean; allFilled: boolean; handleBuy: (e: React.FormEvent) => void;
  gameSlug: string; customerUid: string; customerZid: string; customerWhatsapp: string;
}) {
  return (
    <section className="bg-[#171a1f] border border-[#262b33] rounded-xl p-4 sm:p-5">
      <h2 className="font-bold text-lg">Ringkasan pesanan</h2>
      <dl className="mt-4 space-y-2.5 text-sm">
        <div className="flex justify-between gap-4"><dt className="text-[#9aa3ad]">Produk</dt><dd className="font-semibold text-right">{nom.label}</dd></div>
        <div className="flex justify-between gap-4"><dt className="text-[#9aa3ad]">Akun</dt><dd className="font-semibold text-right break-all">{account}</dd></div>
        <div className="flex justify-between gap-4"><dt className="text-[#9aa3ad]">Pembayaran</dt><dd className="font-semibold text-right">{pay.label}</dd></div>
        <div className="flex justify-between gap-4"><dt className="text-[#9aa3ad]">Harga</dt><dd className="font-semibold text-right">{rupiah(nom.price)}</dd></div>
        <div className="flex justify-between gap-4"><dt className="text-[#9aa3ad]">Biaya layanan</dt><dd className="font-semibold text-right">{rupiah(pay.fee)}</dd></div>
      </dl>
      <form action={createOrderAction} onSubmit={handleBuy} className="mt-4 pt-4 border-t border-[#262b33] flex items-end justify-between gap-4 flex-wrap">
        <input type="hidden" name="game_slug" value={gameSlug} />
        <input type="hidden" name="product_id" value={nom.id} />
        <input type="hidden" name="product_label" value={nom.label} />
        <input type="hidden" name="product_price" value={nom.price} />
        <input type="hidden" name="product_old_price" value={nom.oldPrice} />
        <input type="hidden" name="payment_label" value={pay.label} />
        <input type="hidden" name="payment_fee" value={pay.fee} />
        {pay.id && <input type="hidden" name="payment_id" value={pay.id} />}
        <input type="hidden" name="customer_uid" value={customerUid} />
        <input type="hidden" name="customer_zid" value={customerZid} />
        <input type="hidden" name="customer_whatsapp" value={customerWhatsapp} />
        <div>
          <div className="text-xs text-[#9aa3ad]">Total bayar</div>
          <div className="text-2xl font-extrabold text-[#ff5c2b]">{rupiah(total)}</div>
        </div>
        <SubmitButton disabled={!allFilled} />
      </form>
      {showWarn && <p className="mt-3 text-xs text-[#ffb020]">Lengkapi data akun dulu ya sebelum lanjut bayar.</p>}
    </section>
  );
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  const isDisabled = disabled || pending;
  return (
    <button
      type="submit"
      disabled={isDisabled}
      className={`px-6 py-3 rounded-lg text-white font-semibold transition inline-flex items-center justify-center gap-2 min-w-[160px] ${
        isDisabled ? "bg-[#3a424e] cursor-not-allowed" : "bg-[#ff5c2b] hover:bg-[#ff7043] active:scale-[.98]"
      }`}
    >
      {pending ? (
        <>
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          Memproses...
        </>
      ) : (
        "Beli Sekarang"
      )}
    </button>
  );
}

function MobileStickyBar({ total }: { total: number }) {
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#101215]/95 backdrop-blur border-t border-[#262b33] px-4 py-3 flex items-center justify-between gap-4">
      <div>
        <div className="text-xs text-[#9aa3ad]">Total bayar</div>
        <div className="font-extrabold text-[#ff5c2b]">{rupiah(total)}</div>
      </div>
      <a href="#ringkasan" className="px-5 py-2.5 rounded-lg bg-[#ff5c2b] text-white font-semibold text-sm">Beli Sekarang</a>
    </div>
  );
}
