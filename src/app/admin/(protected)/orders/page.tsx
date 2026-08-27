import { requireStaff } from "@/lib/auth";
import { updateOrderStatusAction } from "../actions";
import Link from "next/link";

const rupiah = (n: number) => "Rp" + n.toLocaleString("id-ID");

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending", paid: "Paid", processing: "Processing",
  success: "Success", failed: "Failed", refunded: "Refunded",
};
const STATUS_COLOR: Record<string, string> = {
  pending: "bg-[#ffb020]/15 text-[#ffb020] border-[#ffb020]/30",
  paid: "bg-[#5bc8ff]/15 text-[#5bc8ff] border-[#5bc8ff]/30",
  processing: "bg-[#c07bff]/15 text-[#c07bff] border-[#c07bff]/30",
  success: "bg-[#2fbf71]/15 text-[#2fbf71] border-[#2fbf71]/30",
  failed: "bg-[#ff5c5c]/15 text-[#ff5c5c] border-[#ff5c5c]/30",
  refunded: "bg-[#6d7681]/15 text-[#9aa3ad] border-[#6d7681]/30",
};
const STATUS_OPTIONS = ["pending", "paid", "processing", "success", "failed", "refunded"] as const;

export default async function AdminOrdersPage() {
  const { supabase, profile } = await requireStaff();
  const { data: orders } = await supabase
    .from("orders")
    .select("id, order_code, status, total, subtotal, service_fee, payment_method, customer_uid, customer_zid, customer_whatsapp, notes, created_at, updated_at, games(slug, name), products(label, coins)")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Orders</h1>
          <p className="text-sm text-[#9aa3ad] mt-1">100 order terakhir. Update status untuk proses pesanan.</p>
        </div>
        <Link href="/admin" className="text-xs font-semibold text-[#9aa3ad] hover:text-white">← Kembali ke Dashboard</Link>
      </div>

      <div className="bg-[#171a1f] border border-[#262b33] rounded-xl overflow-x-auto">
        <table className="w-full text-sm min-w-[920px]">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-[#6d7681] border-b border-[#262b33]">
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Game / Item</th>
              <th className="px-4 py-3">Akun</th>
              <th className="px-4 py-3">Bayar</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {(!orders || orders.length === 0) && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-sm text-[#6d7681]">Belum ada order.</td>
              </tr>
            )}
            {orders?.map((o: any) => (
              <tr key={o.id} className="border-b border-[#262b33] last:border-0 hover:bg-[#1c2026]/40 transition">
                <td className="px-4 py-3 align-top">
                  <div className="font-mono text-xs font-semibold">{o.order_code}</div>
                  <div className="text-[10px] text-[#6d7681] mt-0.5">{new Date(o.created_at).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" })}</div>
                </td>
                <td className="px-4 py-3 align-top">
                  <div className="font-semibold text-xs">{o.games?.short_name || "—"}</div>
                  <div className="text-[11px] text-[#9aa3ad] mt-0.5">{o.products?.label || "—"}</div>
                </td>
                <td className="px-4 py-3 align-top">
                  <div className="text-xs font-mono">{o.customer_uid}</div>
                  {o.customer_zid && <div className="text-[11px] text-[#9aa3ad]">({o.customer_zid})</div>}
                  {o.customer_whatsapp && <div className="text-[11px] text-[#2fbf71] mt-0.5">{o.customer_whatsapp}</div>}
                </td>
                <td className="px-4 py-3 align-top">
                  <div className="text-xs font-semibold">{o.payment_method}</div>
                  <div className="text-[10px] text-[#6d7681]">fee {rupiah(o.service_fee || 0)}</div>
                </td>
                <td className="px-4 py-3 align-top">
                  <div className="font-bold text-[#ff5c2b] text-sm">{rupiah(o.total)}</div>
                </td>
                <td className="px-4 py-3 align-top">
                  <span className={`inline-block text-[10px] font-bold px-2 py-1 rounded border ${STATUS_COLOR[o.status] || STATUS_COLOR.pending}`}>
                    {STATUS_LABEL[o.status] || o.status}
                  </span>
                </td>
                <td className="px-4 py-3 align-top text-right">
                  <form action={updateOrderStatusAction} className="flex items-center gap-1.5 justify-end">
                    <input type="hidden" name="order_id" value={o.id} />
                    <input type="hidden" name="actor_label" value={profile.email || profile.full_name || "admin"} />
                    <select name="status" defaultValue={o.status} className="bg-[#12151a] border border-[#262b33] rounded-md text-xs px-2 py-1.5 focus:outline-none focus:border-[#ff5c2b]">
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                    </select>
                    <button type="submit" className="px-2.5 py-1.5 rounded-md bg-[#ff5c2b] text-white text-xs font-semibold hover:bg-[#ff7043] transition">Simpan</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
