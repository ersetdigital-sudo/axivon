"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const rupiah = (n: number) => "Rp" + n.toLocaleString("id-ID");

type Order = {
  order_code: string;
  status: string;
  total: number;
  subtotal: number | null;
  service_fee: number | null;
  payment_method: string;
  customer_uid: string;
  customer_zid: string | null;
  customer_whatsapp: string | null;
  notes: string | null;
  created_at: string;
  games: { slug: string; name: string } | null;
  products: { label: string; coins: number } | null;
};

type PaymentMethod = {
  label: string;
  type: string;
  account_number: string | null;
  account_name: string | null;
  bank_name: string | null;
  qris_image_url: string | null;
  instructions: string | null;
  fee_label: string | null;
};

export function OrderSuccessView({
  order,
  paymentMethod,
  whatsappCs,
}: {
  order: Order;
  paymentMethod: PaymentMethod | undefined;
  whatsappCs: string;
}) {
  const isPaid = order.status === "paid" || order.status === "success";
  const isPending = order.status === "pending";
  const isFailed = order.status === "failed";

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-80px)] max-w-3xl mx-auto px-4 sm:px-5 py-8 md:py-12 pb-32">
        <Hero order={order} isPaid={isPaid} isPending={isPending} isFailed={isFailed} />
        <OrderTimeline order={order} isPaid={isPaid} isPending={isPending} isFailed={isFailed} />
        {isPending && paymentMethod && (
          <PaymentInstructions order={order} pm={paymentMethod} whatsappCs={whatsappCs} />
        )}
        {isPaid && <PaidNextSteps order={order} />}
      </main>
      {isPending && paymentMethod && (
        <StickyActionBar order={order} pm={paymentMethod} whatsappCs={whatsappCs} />
      )}
      <div className="hidden lg:block">
        <Footer />
      </div>
    </>
  );
}

function Hero({
  order,
  isPaid,
  isPending,
  isFailed,
}: {
  order: Order;
  isPaid: boolean;
  isPending: boolean;
  isFailed: boolean;
}) {
  const accent = isPaid
    ? { from: "from-[#2fbf71]", to: "to-[#5ed98f]", glow: "shadow-[#2fbf71]/30", text: "text-[#2fbf71]", chip: "bg-[#2fbf71]/15 text-[#2fbf71] border-[#2fbf71]/30" }
    : isFailed
    ? { from: "from-[#ff5c5c]", to: "to-[#ff8a8a]", glow: "shadow-[#ff5c5c]/30", text: "text-[#ff5c5c]", chip: "bg-[#ff5c5c]/15 text-[#ff5c5c] border-[#ff5c5c]/30" }
    : { from: "from-[#ffb020]", to: "to-[#ffcb54]", glow: "shadow-[#ffb020]/30", text: "text-[#ffb020]", chip: "bg-[#ffb020]/15 text-[#ffb020] border-[#ffb020]/30" };

  return (
    <section className="relative text-center pt-2 pb-8 slide-up">
      <div className="relative mx-auto w-24 h-24 mb-5">
        {isPending && (
          <>
            <span className={`absolute inset-0 rounded-full ${accent.text} pulse-ring`} />
            <span className={`absolute inset-0 rounded-full ${accent.text} pulse-ring`} style={{ animationDelay: "1.2s" }} />
          </>
        )}
        <div className={`relative w-24 h-24 rounded-3xl grid place-items-center shadow-2xl ${accent.glow} bg-gradient-to-br ${accent.from} ${accent.to} rotate-3 hover:rotate-0 transition-transform duration-500`}>
          {isPaid ? (
            <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" className="check-stroke" />
            </svg>
          ) : isFailed ? (
            <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-12 h-12 text-white spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 3" />
            </svg>
          )}
        </div>
      </div>
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
        {isPaid ? "Pembayaran Berhasil!" : isFailed ? "Order Gagal" : "Order Berhasil Dibuat!"}
      </h1>
      <p className="text-sm md:text-base text-[#9aa3ad] mt-2 max-w-md mx-auto">
        {isPaid
          ? "Item kamu sudah masuk ke akun. Terima kasih sudah order!"
          : isFailed
          ? "Order ini gagal diproses. Hubungi CS untuk bantuan."
          : "Selesaikan pembayaran supaya item kamu langsung diproses otomatis."}
      </p>
      <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#171a1f] border border-[#262b33]">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#6d7681]">Order</span>
        <span className="font-mono font-extrabold text-sm tracking-wide">{order.order_code}</span>
        <CopyButton text={order.order_code} />
      </div>
    </section>
  );
}

function CopyButton({ text, label = "Salin" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="ml-1 inline-flex items-center justify-center w-6 h-6 rounded-md text-[#6d7681] hover:text-white hover:bg-[#262b33] transition"
      title={label}
    >
      {copied ? (
        <svg className="w-3.5 h-3.5 text-[#2fbf71]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  );
}

function OrderTimeline({ order, isPaid, isPending, isFailed }: { order: Order; isPaid: boolean; isPending: boolean; isFailed: boolean }) {
  return (
    <div className="bg-[#171a1f] border border-[#262b33] rounded-2xl p-5 mt-4 slide-up slide-up-d1">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <h2 className="text-[10px] font-extrabold uppercase tracking-wider text-[#6d7681] mb-2">Detail Akun</h2>
          <dl className="space-y-1.5 text-sm">
            <DetailRow label="Game" value={order.games?.name || "—"} />
            <DetailRow label="Item" value={order.products?.label || "—"} />
            {order.products?.coins != null && (
              <DetailRow label="Item diterima" value={`${order.products.coins.toLocaleString("id-ID")} koin`} accent="green" />
            )}
            <DetailRow label="Akun" value={`${order.customer_uid}${order.customer_zid ? ` (${order.customer_zid})` : ""}`} mono />
            {order.customer_whatsapp && <DetailRow label="WhatsApp" value={order.customer_whatsapp} mono />}
            <DetailRow label="Pembayaran" value={order.payment_method} />
          </dl>
        </div>
        <div>
          <h2 className="text-[10px] font-extrabold uppercase tracking-wider text-[#6d7681] mb-2">Rincian Biaya</h2>
          <dl className="space-y-1.5 text-sm">
            <DetailRow label="Harga" value={rupiah(order.subtotal ?? 0)} />
            <DetailRow label="Biaya layanan" value={rupiah(order.service_fee ?? 0)} />
          </dl>
          <div className="mt-3 pt-3 border-t border-[#262b33] flex items-baseline justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6d7681]">Total bayar</span>
            <span className="font-extrabold text-2xl md:text-3xl text-[#ff5c2b] tracking-tight">{rupiah(order.total)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px]">
            <span className="text-[#6d7681]">Order ID</span>
            <span className="font-mono text-[#9aa3ad]">{order.order_code}</span>
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-[#6d7681]">Dibuat</span>
            <span className="text-[#9aa3ad]">{new Date(order.created_at).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, mono, accent }: { label: string; value: string; mono?: boolean; accent?: "green" }) {
  const accentClass = accent === "green" ? "text-[#2fbf71]" : "text-white";
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-[#9aa3ad] text-xs shrink-0">{label}</dt>
      <dd className={`font-semibold text-right break-all ${mono ? "font-mono text-sm" : ""} ${accentClass}`}>{value}</dd>
    </div>
  );
}

function PaymentInstructions({ order, pm, whatsappCs }: { order: Order; pm: PaymentMethod; whatsappCs: string }) {
  return (
    <section className="mt-5 slide-up slide-up-d2">
      <div className="bg-[#171a1f] border border-[#ff5c2b]/30 rounded-2xl overflow-hidden">
        <div className="relative px-5 py-4 bg-gradient-to-r from-[#ff5c2b]/15 via-[#ff5c2b]/5 to-transparent border-b border-[#ff5c2b]/20 overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#ff5c2b] to-[#ff7a3f]" />
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-[#ff5c2b]/15 border border-[#ff5c2b]/30 grid place-items-center shrink-0">
                <PaymentMethodIcon type={pm.type} />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#ff5c2b]">Cara bayar via</div>
                <div className="font-bold text-sm truncate">{pm.label}</div>
              </div>
            </div>
            <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#ff5c2b]/15 text-[#ff5c2b] border border-[#ff5c2b]/30">
              {pm.fee_label || "Gratis"}
            </span>
          </div>
        </div>

        <div className="p-5 sm:p-6 grid sm:grid-cols-[260px_1fr] gap-6 items-start">
          {pm.type === "qris" && pm.qris_image_url && (
            <div className="space-y-3 slide-up slide-up-d3">
              <div className="relative bg-white rounded-2xl p-3 aspect-square flex items-center justify-center overflow-hidden border border-[#262b33] shadow-2xl shadow-black/30">
                <Image src={pm.qris_image_url} alt="QRIS" width={260} height={260} className="w-full h-full object-contain" unoptimized priority />
                <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-[#ff5c2b]/20 rounded-2xl" />
              </div>
              <a
                href={pm.qris_image_url}
                download={`QRIS-${order.order_code}.png`}
                target="_blank"
                rel="noopener"
                className="flex items-center justify-center gap-1.5 w-full px-3 py-2 rounded-lg bg-[#1c2026] border border-[#262b33] text-xs font-bold text-[#9aa3ad] hover:border-[#ff5c2b]/50 hover:text-white transition"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download QR
              </a>
            </div>
          )}

          <div className="space-y-4 slide-up slide-up-d4">
            {pm.instructions && (
              <p className="text-sm text-[#9aa3ad] leading-relaxed">{pm.instructions}</p>
            )}

            {(pm.type === "bank_transfer" || pm.type === "ewallet") && pm.account_number && (
              <div className="bg-gradient-to-br from-[#0d0f12] to-[#12151a] rounded-xl p-4 space-y-2 border border-[#262b33]">
                <div className="flex items-center justify-between">
                  {pm.bank_name && <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#6d7681]">{pm.bank_name}</div>}
                  <CopyButton text={pm.account_number} label="Salin nomor" />
                </div>
                <div className="font-mono font-extrabold text-2xl text-[#eef1f4] tracking-wider select-all">
                  {pm.account_number}
                </div>
                {pm.account_name && <div className="text-xs text-[#9aa3ad]">a/n <span className="text-white font-semibold">{pm.account_name}</span></div>}
              </div>
            )}

            <div className="space-y-1.5 text-[10px] text-[#6d7681] font-bold uppercase tracking-wider">
              <p>Instruksi:</p>
              <ol className="space-y-1.5 normal-case font-normal text-xs text-[#9aa3ad]">
                <Step n={1}>Buka aplikasi {pm.label} atau m-banking kamu.</Step>
                <Step n={2}>Scan QR / masukkan nomor tujuan di atas.</Step>
                <Step n={3}>Pastikan nominal transfer sesuai total bayar.</Step>
                <Step n={4}>Selesaikan pembayaran. Item masuk otomatis <span className="text-[#2fbf71] font-semibold">&lt; 30 detik</span> setelah bayar.</Step>
              </ol>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#262b33]">
              <a
                href={`https://wa.me/${whatsappCs}?text=Halo%20Admin%2C%20saya%20butuh%20bantuan%20order%20${order.order_code}`}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2fbf71]/10 border border-[#2fbf71]/30 text-[#2fbf71] text-xs font-bold hover:bg-[#2fbf71]/20 transition"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.683 5.522l-.999 3.648 3.805-.869zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                Konfirmasi via WhatsApp
              </a>
              <span className="text-[10px] text-[#6d7681] uppercase tracking-wider font-bold">Order biasanya selesai &lt; 30 detik</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="shrink-0 w-5 h-5 rounded-full bg-[#ff5c2b]/15 text-[#ff5c2b] text-[10px] font-extrabold grid place-items-center border border-[#ff5c2b]/30">{n}</span>
      <span className="pt-0.5">{children}</span>
    </li>
  );
}

function PaymentMethodIcon({ type }: { type: string }) {
  if (type === "qris") {
    return (
      <svg className="w-5 h-5 text-[#ff5c2b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <path d="M14 14h3v3h-3zM18 18h3v3M14 18h2" />
      </svg>
    );
  }
  if (type === "bank_transfer") {
    return (
      <svg className="w-5 h-5 text-[#5bc8ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 10 12 4l9 6" />
        <path d="M5 10v9h14v-9" />
        <path d="M9 19v-5h6v5" />
      </svg>
    );
  }
  return (
    <svg className="w-5 h-5 text-[#c07bff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10h18" />
      <path d="M6 15h3" />
    </svg>
  );
}

function PaidNextSteps({ order }: { order: Order }) {
  return (
    <section className="mt-5 slide-up slide-up-d2">
      <div className="bg-gradient-to-br from-[#2fbf71]/15 via-[#2fbf71]/5 to-transparent border border-[#2fbf71]/30 rounded-2xl p-5">
        <h2 className="font-bold text-sm flex items-center gap-2">
          <svg className="w-4 h-4 text-[#2fbf71]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 12l2 2 4-4" />
            <circle cx="12" cy="12" r="9" />
          </svg>
          Item sudah masuk
        </h2>
        <p className="text-xs text-[#9aa3ad] mt-1.5 leading-relaxed">
          Diamond / item sudah ditambahkan ke akun <span className="font-mono text-white">{order.customer_uid}{order.customer_zid ? ` (${order.customer_zid})` : ""}</span>.
          Buka game kamu untuk cek.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href={`/${order.games?.slug || "mobile-legends"}`} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-[#ff5c2b] to-[#ff7a3f] text-white text-xs font-bold hover:shadow-lg hover:shadow-[#ff5c2b]/30 transition">
            Top Up Lagi
          </Link>
          <Link href="/" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1c2026] border border-[#262b33] text-xs font-bold hover:border-[#3a424e] transition">
            ← Beranda
          </Link>
        </div>
      </div>
    </section>
  );
}

function StickyActionBar({ order, pm, whatsappCs }: { order: Order; pm: PaymentMethod; whatsappCs: string }) {
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-[#101215] via-[#101215]/95 to-transparent pt-6 pb-4 px-4 sm:hidden">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <a
            href={`https://wa.me/${whatsappCs}?text=Halo%2C%20saya%20sudah%20bayar%20${order.order_code}`}
            target="_blank"
            rel="noopener"
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#2fbf71] text-white text-sm font-bold shadow-lg shadow-[#2fbf71]/30 hover:shadow-xl transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24z" />
            </svg>
            Sudah Bayar? Konfirmasi
          </a>
        </div>
      </div>
    </>
  );
}
