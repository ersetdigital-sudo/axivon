import { requireStaff } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import Link from "next/link";

const rupiah = (n: number) => "Rp" + Number(n || 0).toLocaleString("id-ID");

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-[#ffb020]/15 text-[#ffb020] border-[#ffb020]/30",
  paid: "bg-[#5bc8ff]/15 text-[#5bc8ff] border-[#5bc8ff]/30",
  processing: "bg-[#c07bff]/15 text-[#c07bff] border-[#c07bff]/30",
  success: "bg-[#2fbf71]/15 text-[#2fbf71] border-[#2fbf71]/30",
  failed: "bg-[#ff5c5c]/15 text-[#ff5c5c] border-[#ff5c5c]/30",
  refunded: "bg-[#6d7681]/15 text-[#9aa3ad] border-[#6d7681]/30",
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending", paid: "Paid", processing: "Processing",
  success: "Success", failed: "Failed", refunded: "Refunded",
};

export default async function AdminOverviewPage({ searchParams }: { searchParams: Promise<{ msg?: string; toast?: string }> }) {
  const { profile } = await requireStaff();
  const admin = createSupabaseAdminClient();

  const [ordersRes, productsRes, paymentsRes] = await Promise.all([
    admin.from("orders").select("id, order_code, status, total, customer_uid, customer_whatsapp, created_at, games(short_name), products(label)").order("created_at", { ascending: false }).limit(10),
    admin.from("products").select("id, label, is_active, price, games(name)").order("game_id").order("sort_order"),
    admin.from("payment_methods").select("id, label, type, is_active").order("sort_order"),
  ]);

  const orders = ordersRes.data || [];
  const products = productsRes.data || [];
  const payments = paymentsRes.data || [];

  const totalRevenue = orders
    .filter((o: any) => o.status === "success" || o.status === "paid")
    .reduce((s: number, o: any) => s + (o.total || 0), 0);
  const pendingCount = orders.filter((o: any) => ["pending", "paid", "processing"].includes(o.status)).length;
  const successCount = orders.filter((o: any) => o.status === "success").length;
  const failedCount = orders.filter((o: any) => o.status === "failed").length;
  const activeProducts = products.filter((p: any) => p.is_active).length;
  const activePayments = payments.filter((p: any) => p.is_active).length;
  const uniqueCustomers = new Set(orders.map((o: any) => o.customer_uid).filter(Boolean)).size;
  const topProducts = [...products]
    .filter((p: any) => p.is_active)
    .sort((a: any, b: any) => (b.price || 0) - (a.price || 0))
    .slice(0, 5);

  const { msg, toast } = await searchParams;
  const toastData = msg ? { message: msg, variant: (toast === "err" ? "error" : "success") as "success" | "error" } : undefined;

  return (
    <AdminShell profile={profile} toast={toastData}>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Dashboard</h1>
          <p className="text-sm text-[#9aa3ad] mt-1">Ringkasan real-time dari Supabase.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KpiCard label="Total Revenue" value={rupiah(totalRevenue)} sub={`${successCount} order sukses`} accent="orange" />
          <KpiCard label="Order Pending" value={String(pendingCount)} sub="perlu diproses" accent="amber" />
          <KpiCard label="Produk Aktif" value={`${activeProducts}`} sub={`dari ${products.length} total`} accent="green" />
          <KpiCard label="Pelanggan" value={String(uniqueCustomers)} sub={`${activePayments} metode bayar`} accent="blue" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Recent orders - spans 2 cols */}
          <section className="xl:col-span-2 bg-[#171a1f] border border-[#262b33] rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#262b33] flex items-center justify-between">
              <div>
                <h2 className="font-bold text-sm">Order Terbaru</h2>
                <p className="text-[11px] text-[#6d7681] mt-0.5">10 order terakhir dari semua status</p>
              </div>
              <Link href="/admin/orders" className="text-xs font-semibold text-[#ff5c2b] hover:underline">
                Lihat semua →
              </Link>
            </div>
            {orders.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-[#6d7681]">Belum ada order.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[640px]">
                  <thead>
                    <tr className="text-left text-[10px] uppercase tracking-wider text-[#6d7681] border-b border-[#262b33]">
                      <th className="px-4 py-2.5">Order</th>
                      <th className="px-4 py-2.5">Game</th>
                      <th className="px-4 py-2.5">UID</th>
                      <th className="px-4 py-2.5">Total</th>
                      <th className="px-4 py-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 8).map((o: any) => (
                      <tr key={o.id} className="border-b border-[#262b33] last:border-0 hover:bg-[#1c2026]/40">
                        <td className="px-4 py-2.5 font-mono text-xs font-semibold">{o.order_code}</td>
                        <td className="px-4 py-2.5 text-xs">{o.games?.short_name || "—"}</td>
                        <td className="px-4 py-2.5 text-xs font-mono text-[#9aa3ad]">{o.customer_uid}</td>
                        <td className="px-4 py-2.5 font-bold text-[#ff5c2b] text-xs">{rupiah(o.total)}</td>
                        <td className="px-4 py-2.5">
                          <StatusPill status={o.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Right column - quick actions + top products */}
          <div className="space-y-4">
            <section className="bg-gradient-to-br from-[#ff5c2b]/15 via-[#ff5c2b]/5 to-transparent border border-[#ff5c2b]/30 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#ff5c2b] to-[#ff7a3f] grid place-items-center shadow-lg shadow-[#ff5c2b]/30">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-sm">Quick Actions</div>
                  <div className="text-[11px] text-[#9aa3ad]">Tugas paling cepat</div>
                </div>
              </div>
              <div className="space-y-2">
                <QuickLink href="/admin/products" label="Tambah Produk Baru" desc="Input nominal baru" />
                <QuickLink href="/admin/orders" label={`Proses ${pendingCount} Order Pending`} desc="Update status manual" />
                <QuickLink href="/admin/payments" label="Kelola Payment Method" desc="Toggle aktif/nonaktif" />
              </div>
            </section>

            <section className="bg-[#171a1f] border border-[#262b33] rounded-2xl overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[#262b33] flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-sm">Top 5 Produk Aktif</h2>
                  <p className="text-[11px] text-[#6d7681] mt-0.5">Harga tertinggi</p>
                </div>
              </div>
              <div className="divide-y divide-[#262b33]">
                {topProducts.length === 0 ? (
                  <div className="px-5 py-6 text-center text-xs text-[#6d7681]">Belum ada produk aktif.</div>
                ) : (
                  topProducts.map((p: any, i: number) => (
                    <div key={p.id} className="px-5 py-2.5 flex items-center gap-3">
                      <div className="shrink-0 w-6 h-6 rounded-md bg-[#1c2026] border border-[#262b33] grid place-items-center text-[10px] font-extrabold text-[#9aa3ad]">
                        {i + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold truncate">{p.label}</div>
                        <div className="text-[10px] text-[#6d7681]">{p.games?.name || "—"}</div>
                      </div>
                      <div className="text-xs font-extrabold text-[#ff5c2b] shrink-0">{rupiah(p.price)}</div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

function StatusPill({ status }: { status: string }) {
  return (
    <span className={`inline-block text-[10px] font-extrabold px-2 py-1 rounded-md border ${STATUS_COLOR[status] || STATUS_COLOR.pending}`}>
      {STATUS_LABEL[status] || status}
    </span>
  );
}

function QuickLink({ href, label, desc }: { href: string; label: string; desc: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-2 rounded-xl bg-[#0d0f12]/60 border border-[#262b33] hover:border-[#ff5c2b]/50 px-3 py-2.5 transition group"
    >
      <div className="min-w-0">
        <div className="text-xs font-bold truncate">{label}</div>
        <div className="text-[10px] text-[#6d7681] truncate">{desc}</div>
      </div>
      <svg className="shrink-0 w-4 h-4 text-[#6d7681] group-hover:text-[#ff5c2b] group-hover:translate-x-0.5 transition" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

function KpiCard({ label, value, sub, accent }: { label: string; value: string; sub: string; accent: "orange" | "amber" | "green" | "blue" }) {
  const styles: Record<string, { ring: string; chip: string; num: string }> = {
    orange: { ring: "border-[#ff5c2b]/30 bg-gradient-to-br from-[#ff5c2b]/10 to-transparent", chip: "bg-[#ff5c2b]/15 text-[#ff5c2b]", num: "text-[#ff5c2b]" },
    amber: { ring: "border-[#ffb020]/30 bg-gradient-to-br from-[#ffb020]/10 to-transparent", chip: "bg-[#ffb020]/15 text-[#ffb020]", num: "text-[#ffb020]" },
    green: { ring: "border-[#2fbf71]/30 bg-gradient-to-br from-[#2fbf71]/10 to-transparent", chip: "bg-[#2fbf71]/15 text-[#2fbf71]", num: "text-[#2fbf71]" },
    blue: { ring: "border-[#5bc8ff]/30 bg-gradient-to-br from-[#5bc8ff]/10 to-transparent", chip: "bg-[#5bc8ff]/15 text-[#5bc8ff]", num: "text-[#5bc8ff]" },
  };
  const s = styles[accent];
  return (
    <div className={`relative overflow-hidden border ${s.ring} rounded-2xl p-4 hover:scale-[1.02] transition-transform`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#9aa3ad]">{label}</span>
        <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${s.chip}`}>Live</span>
      </div>
      <div className={`text-2xl md:text-3xl font-extrabold mt-1.5 ${s.num}`}>{value}</div>
      <div className="text-[11px] text-[#6d7681] mt-0.5">{sub}</div>
    </div>
  );
}
