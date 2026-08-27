import { requireStaff } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { OrdersManager } from "@/components/admin/OrdersManager";
import { AdminShell } from "@/components/admin/AdminShell";
import Link from "next/link";

const rupiah = (n: number) => "Rp" + Number(n || 0).toLocaleString("id-ID");

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ msg?: string; toast?: string }> }) {
  const { profile } = await requireStaff();
  const admin = createSupabaseAdminClient();
  const { data: orders } = await admin
    .from("orders")
    .select("id, order_code, status, total, subtotal, service_fee, payment_method, customer_uid, customer_zid, customer_whatsapp, notes, created_at, games(slug, name, short_name), products(label, coins)")
    .order("created_at", { ascending: false })
    .limit(100);

  const list = (orders as any) || [];
  const totalRevenue = list
    .filter((o: any) => o.status === "success" || o.status === "paid")
    .reduce((s: number, o: any) => s + (o.total || 0), 0);
  const pendingCount = list.filter((o: any) => ["pending", "paid", "processing"].includes(o.status)).length;
  const successCount = list.filter((o: any) => o.status === "success").length;
  const failedCount = list.filter((o: any) => o.status === "failed").length;
  const uniqueCustomers = new Set(list.map((o: any) => o.customer_uid).filter(Boolean)).size;

  const { msg, toast } = await searchParams;
  const toastData = msg ? { message: msg, variant: (toast === "err" ? "error" : "success") as "success" | "error" } : undefined;

  return (
    <AdminShell profile={profile} toast={toastData}>
      <div className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Orders</h1>
            <p className="text-sm text-[#9aa3ad] mt-1">100 order terakhir. Update status, hapus, atau filter.</p>
          </div>
          <Link
            href="/admin"
            className="text-xs font-semibold text-[#9aa3ad] hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-[#1c2026]"
          >
            ← Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <KpiCard label="Total Order" value={String(list.length)} sub={`${uniqueCustomers} UID unik`} accent="orange" />
          <KpiCard label="Pending" value={String(pendingCount)} sub="perlu diproses" accent="amber" />
          <KpiCard label="Success" value={String(successCount)} sub={`${failedCount} failed`} accent="green" />
          <KpiCard label="Revenue" value={rupiah(totalRevenue)} sub="paid + success" accent="blue" />
          <KpiCard label="Avg. Order" value={rupiah(list.length ? Math.round(totalRevenue / list.filter((o: any) => o.status === "success" || o.status === "paid").length) || 1 : 0)} sub="per order sukses" accent="purple" />
        </div>

        <OrdersManager orders={list} actorLabel={profile.email || profile.full_name || "admin"} />
      </div>
    </AdminShell>
  );
}

function KpiCard({ label, value, sub, accent }: { label: string; value: string; sub: string; accent: "orange" | "green" | "blue" | "purple" | "amber" }) {
  const styles: Record<string, { ring: string; chip: string; num: string }> = {
    orange: { ring: "border-[#ff5c2b]/30 bg-gradient-to-br from-[#ff5c2b]/10 to-transparent", chip: "bg-[#ff5c2b]/15 text-[#ff5c2b]", num: "text-[#ff5c2b]" },
    amber: { ring: "border-[#ffb020]/30 bg-gradient-to-br from-[#ffb020]/10 to-transparent", chip: "bg-[#ffb020]/15 text-[#ffb020]", num: "text-[#ffb020]" },
    green: { ring: "border-[#2fbf71]/30 bg-gradient-to-br from-[#2fbf71]/10 to-transparent", chip: "bg-[#2fbf71]/15 text-[#2fbf71]", num: "text-[#2fbf71]" },
    blue: { ring: "border-[#5bc8ff]/30 bg-gradient-to-br from-[#5bc8ff]/10 to-transparent", chip: "bg-[#5bc8ff]/15 text-[#5bc8ff]", num: "text-[#5bc8ff]" },
    purple: { ring: "border-[#c07bff]/30 bg-gradient-to-br from-[#c07bff]/10 to-transparent", chip: "bg-[#c07bff]/15 text-[#c07bff]", num: "text-[#c07bff]" },
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
