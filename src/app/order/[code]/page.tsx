import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

const rupiah = (n: number) => "Rp" + n.toLocaleString("id-ID");

export default async function OrderPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const supabase = createSupabaseAdminClient();
  const { data: order } = await supabase
    .from("orders")
    .select("order_code, status, total, subtotal, service_fee, payment_method, customer_uid, customer_zid, customer_whatsapp, created_at, games(slug, name), products(label, coins)")
    .eq("order_code", code)
    .single();

  if (!order) notFound();

  // Find matching payment method detail
  const { data: paymentMethods } = await supabase
    .from("payment_methods")
    .select("label, type, account_number, account_name, bank_name, qris_image_url, instructions, fee_label, whatsapp_cs, account_number")
    .eq("is_active", true);
  const pm = (paymentMethods || []).find((m: any) => m.label === order.payment_method);

  console.log("[order/[code]]", { code, status: order.status, payment_method: order.payment_method, methods: paymentMethods?.map((m: any) => m.label), pmFound: !!pm, pmType: pm?.type, pmQR: pm?.qris_image_url?.slice(0, 50) });

  const isPending = order.status === "pending";
  const isPaid = order.status === "paid" || order.status === "success";

  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 sm:px-5 py-8 md:py-10 pb-24">
        {/* DEBUG: payment method lookup diagnostic */}
        <pre className="text-[10px] text-[#6d7681] mb-4 p-2 bg-[#0d0f12] border border-[#262b33] rounded overflow-x-auto">
{JSON.stringify({
  code,
  status: order.status,
  payment_method: order.payment_method,
  methods: paymentMethods?.map((m: any) => m.label),
  pmFound: !!pm,
  pmType: pm?.type,
  pmQR: pm?.qris_image_url?.slice(0, 40),
}, null, 2)}
        </pre>
        <div className="text-center">
          <div className={`mx-auto w-16 h-16 rounded-2xl grid place-items-center shadow-lg ${
            isPaid ? "bg-gradient-to-br from-[#2fbf71] to-[#5ed98f] shadow-[#2fbf71]/30" :
            isPending ? "bg-gradient-to-br from-[#ffb020] to-[#ffcb54] shadow-[#ffb020]/30" :
            "bg-gradient-to-br from-[#6d7681] to-[#9aa3ad]"
          }`}>
            <svg className="w-9 h-9 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {isPaid ? <path d="m5 12.5 4.5 4.5L19 7" /> : <path d="M12 8v5M12 16h.01" />}
            </svg>
          </div>
          <h1 className="mt-5 text-2xl md:text-3xl font-extrabold">
            {isPaid ? "Pembayaran Berhasil!" : "Order Berhasil Dibuat!"}
          </h1>
          <p className="text-sm text-[#9aa3ad] mt-2">
            {isPaid ? "Item kamu sudah masuk ke akun." : "Selesaikan pembayaran supaya item kamu langsung diproses."}
          </p>
        </div>

        <div className="mt-8 bg-[#171a1f] border border-[#262b33] rounded-xl p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#262b33]">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[#6d7681]">Order ID</div>
              <div className="font-mono font-bold text-lg mt-0.5">{order.order_code}</div>
            </div>
            <div className={`inline-block text-xs font-bold px-3 py-1.5 rounded-md border ${
              isPending ? "bg-[#ffb020]/15 text-[#ffb020] border-[#ffb020]/30" :
              isPaid ? "bg-[#2fbf71]/15 text-[#2fbf71] border-[#2fbf71]/30" :
              "bg-[#6d7681]/15 text-[#9aa3ad] border-[#6d7681]/30"
            }`}>
              {order.status.toUpperCase()}
            </div>
          </div>

          <dl className="mt-4 space-y-2.5 text-sm">
            <Row label="Game" value={(order as any).games?.name || "—"} />
            <Row label="Item" value={(order as any).products?.label || "—"} />
            {(order as any).products?.coins && <Row label="Item diterima" value={`${(order as any).products.coins.toLocaleString("id-ID")} koin`} />}
            <Row label="Akun" value={`${order.customer_uid}${order.customer_zid ? ` (${order.customer_zid})` : ""}`} />
            {order.customer_whatsapp && <Row label="WhatsApp kamu" value={order.customer_whatsapp} />}
            <Row label="Pembayaran" value={order.payment_method} />
          </dl>

          <div className="mt-4 pt-4 border-t border-[#262b33] space-y-1.5 text-sm">
            <div className="flex justify-between"><span className="text-[#9aa3ad]">Harga</span><span className="font-semibold">{rupiah(order.subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-[#9aa3ad]">Biaya layanan</span><span className="font-semibold">{rupiah(order.service_fee)}</span></div>
            <div className="flex justify-between items-baseline pt-2 border-t border-[#262b33]">
              <span className="text-[#9aa3ad]">Total bayar</span>
              <span className="font-extrabold text-2xl text-[#ff5c2b]">{rupiah(order.total)}</span>
            </div>
          </div>
        </div>

        {isPending && pm && (
          <div className="mt-5 bg-[#171a1f] border border-[#ff5c2b]/30 rounded-xl overflow-hidden">
            <div className="px-5 py-3 bg-gradient-to-r from-[#ff5c2b]/15 to-transparent border-b border-[#ff5c2b]/20 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#ff5c2b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v5M12 16h.01" />
              </svg>
              <h2 className="font-bold text-sm">Cara bayar via {pm.label}</h2>
              {pm.fee_label && <span className="ml-auto text-[10px] text-[#9aa3ad]">{pm.fee_label}</span>}
            </div>

            <div className="p-5 grid sm:grid-cols-[200px_1fr] gap-5 items-start">
              {/* QRIS Image */}
              {pm.type === "qris" && pm.qris_image_url && (
                <div className="bg-white rounded-lg p-2 aspect-square flex items-center justify-center overflow-hidden">
                  <Image src={pm.qris_image_url} alt="QRIS" width={240} height={240} className="w-full h-full object-contain" unoptimized />
                </div>
              )}

              <div className="space-y-3 text-sm min-w-0">
                {pm.instructions && (
                  <p className="text-[#9aa3ad]">{pm.instructions}</p>
                )}

                {pm.type === "bank_transfer" && (
                  <div className="bg-[#0d0f12] rounded-lg p-3 space-y-1.5">
                    {pm.bank_name && <div className="text-[10px] uppercase tracking-wider text-[#6d7681]">{pm.bank_name}</div>}
                    <button
                      onClick={() => {}}
                      className="font-mono font-bold text-lg text-[#eef1f4] tracking-wide select-all cursor-pointer hover:text-[#ff5c2b] transition w-full text-left"
                      title="Klik untuk salin"
                    >
                      {pm.account_number}
                    </button>
                    {pm.account_name && <div className="text-xs text-[#9aa3ad]">a/n {pm.account_name}</div>}
                  </div>
                )}

                {pm.type === "ewallet" && (
                  <div className="bg-[#0d0f12] rounded-lg p-3 space-y-1.5">
                    <button
                      className="font-mono font-bold text-base text-[#eef1f4] tracking-wide select-all cursor-pointer hover:text-[#ff5c2b] transition w-full text-left"
                      title="Klik untuk salin"
                    >
                      {pm.account_number}
                    </button>
                    {pm.account_name && <div className="text-xs text-[#9aa3ad]">a/n {pm.account_name}</div>}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#262b33]">
                  <a href={`https://wa.me/${(pm as any).account_number || "6281234567890"}`} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2fbf71] hover:underline">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.5 14.1c-.2.7-1.3 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5-4.5-.2-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.3.3c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.2.4-.2.6-.1l2 .9c.2.1.4.2.4.3.1.2.1.7-.1 1.3Z" /></svg>
                    Konfirmasi via WhatsApp
                  </a>
                  <span className="text-xs text-[#6d7681]">Order biasanya selesai &lt; 30 detik setelah bayar.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          <Link href="/" className="px-5 py-2.5 rounded-lg bg-[#1c2026] border border-[#262b33] text-sm font-semibold hover:border-[#3a424e] transition">
            ← Beranda
          </Link>
          <Link href="/mobile-legends" className="px-5 py-2.5 rounded-lg bg-[#ff5c2b] text-white text-sm font-semibold hover:bg-[#ff7043] transition">
            Top Up Lagi
          </Link>
        </div>
      </main>
      <div className="hidden lg:block">
        <Footer />
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-[#9aa3ad]">{label}</dt>
      <dd className="font-semibold text-right break-all">{value}</dd>
    </div>
  );
}
