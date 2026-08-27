import Link from "next/link";
import { requireStaff } from "@/lib/auth";

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

export default async function AdminDashboardPage() {
  const { supabase } = await requireStaff();

  const [{ count: totalOrders }, { data: successOrders }, { count: pendingCount }, { data: todayOrders }] = await Promise.all([
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("total").eq("status", "success"),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("orders").select("total, created_at").gte("created_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
  ]);

  const totalRevenue = (successOrders || []).reduce((s, o) => s + (o.total || 0), 0);
  const todayRevenue = (todayOrders || []).reduce((s, o) => s + (o.total || 0), 0);

  const { data: recent } = await supabase
    .from("orders")
    .select("id, order_code, status, total, payment_method, created_at, game_id, product_id, games(slug, name), products(label)")
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold">Dashboard</h1>
        <p className="text-sm text-[#9aa3ad] mt-1">Ringkasan performa hari ini.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total Orders" value={totalOrders?.toLocaleString("id-ID") || "0"} sub="Semua waktu" accent="from-[#5bc8ff]/20 to-transparent" />
        <StatCard label="Pending" value={pendingCount?.toLocaleString("id-ID") || "0"} sub="Butuh diproses" accent="from-[#ffb020]/20 to-transparent" />
        <StatCard label="Hari Ini" value={rupiah(todayRevenue)} sub="Order masuk" accent="from-[#c07bff]/20 to-transparent" />
        <StatCard label="Revenue" value={rupiah(totalRevenue)} sub="Order sukses" accent="from-[#2fbf71]/20 to-transparent" />
      </div>

      <section className="bg-[#171a1f] border border-[#262b33] rounded-xl">
        <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-[#262b33]">
          <h2 className="font-bold">Order Terbaru</h2>
          <Link href="/admin/orders" className="text-xs font-semibold text-[#ff5c2b] hover:underline">Lihat semua →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-[#6d7681] border-b border-[#262b33]">
                <th className="px-4 sm:px-5 py-3">Order</th>
                <th className="px-4 sm:px-5 py-3">Game</th>
                <th className="px-4 sm:px-5 py-3">Produk</th>
                <th className="px-4 sm:px-5 py-3">Total</th>
                <th className="px-4 sm:px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {(!recent || recent.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-[#6d7681]">Belum ada order.</td>
                </tr>
              )}
              {recent?.map((o: any) => (
                <tr key={o.id} className="border-b border-[#262b33] last:border-0 hover:bg-[#1c2026]/50 transition">
                  <td className="px-4 sm:px-5 py-3 font-mono text-xs">{o.order_code}</td>
                  <td className="px-4 sm:px-5 py-3 text-[#9aa3ad]">{o.games?.name || "—"}</td>
                  <td className="px-4 sm:px-5 py-3">{o.products?.label || "—"}</td>
                  <td className="px-4 sm:px-5 py-3 font-bold text-[#ff5c2b]">{rupiah(o.total)}</td>
                  <td className="px-4 sm:px-5 py-3">
                    <span className={`inline-block text-[10px] font-bold px-2 py-1 rounded border ${STATUS_COLOR[o.status] || STATUS_COLOR.pending}`}>
                      {STATUS_LABEL[o.status] || o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, sub, accent }: { label: string; value: string; sub: string; accent: string }) {
  return (
    <div className="relative bg-[#171a1f] border border-[#262b33] rounded-xl p-4 overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${accent} pointer-events-none`} />
      <div className="relative">
        <div className="text-xs text-[#9aa3ad]">{label}</div>
        <div className="mt-1.5 text-xl md:text-2xl font-extrabold">{value}</div>
        <div className="text-[11px] text-[#6d7681] mt-0.5">{sub}</div>
      </div>
    </div>
  );
}
