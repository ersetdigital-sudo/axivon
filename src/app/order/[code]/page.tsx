import Link from "next/link";
import { notFound } from "next/navigation";
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

  const isPending = order.status === "pending";
  const isPaid = order.status === "paid" || order.status === "success";

  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 sm:px-5 py-10 pb-24">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2fbf71] to-[#5ed98f] grid place-items-center shadow-lg shadow-[#2fbf71]/30">
            <svg className="w-9 h-9 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m5 12.5 4.5 4.5L19 7" />
            </svg>
          </div>
          <h1 className="mt-5 text-2xl md:text-3xl font-extrabold">Order Berhasil Dibuat!</h1>
          <p className="text-sm text-[#9aa3ad] mt-2">Selesaikan pembayaran supaya item kamu langsung diproses.</p>
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
            {order.customer_whatsapp && <Row label="WhatsApp" value={order.customer_whatsapp} />}
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

        {isPending && (
          <div className="mt-5 bg-[#20190d] border border-[#4a3a1c] rounded-xl p-5">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-[#ffb020] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v5M12 16h.01" />
              </svg>
              <div className="text-sm">
                <div className="font-semibold text-[#ffb020]">Cara bayar</div>
                <p className="text-[#9aa3ad] mt-1.5">
                  Silakan transfer tepat sebesar <span className="font-bold text-[#eef1f4]">{rupiah(order.total)}</span> ke nomor/virtual account yang dikirim ke WhatsApp kamu (kalau diisi). Konfirmasi otomatis akan diproses setelah pembayaran diterima. Order biasanya selesai dalam &lt; 30 detik.
                </p>
                <p className="text-[#9aa3ad] mt-2">
                  Butuh bantuan? Hubungi CS via WhatsApp:{" "}
                  <a href="https://wa.me/6281234567890" className="text-[#2fbf71] font-semibold hover:underline">+62 812-3456-7890</a>
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          <Link href="/" className="px-5 py-2.5 rounded-lg bg-[#1c2026] border border-[#262b33] text-sm font-semibold hover:border-[#3a424e] transition">
            ← Kembali ke Beranda
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
