import { requireStaff } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { OrdersManager } from "@/components/admin/OrdersManager";
import { Toast } from "@/components/admin/Toast";
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

  const { msg, toast } = await searchParams;
  const variant: "success" | "error" = toast === "err" ? "error" : "success";

  const totalOrders = orders?.length ?? 0;
  const pendingCount = orders?.filter((o: any) => ["pending", "paid", "processing"].includes(o.status)).length ?? 0;
  const totalRevenue = (orders || [])
    .filter((o: any) => o.status === "success" || o.status === "paid")
    .reduce((sum: number, o: any) => sum + (o.total || 0), 0);

  return (
    <div className="space-y-6">
      {msg && <Toast message={msg} variant={variant} />}

      <div className="relative overflow-hidden rounded-2xl border border-[#262b33] bg-gradient-to-br from-[#171a1f] via-[#15181d] to-[#12151a] p-5 sm:p-6">
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#ff5c2b]/10 blur-3xl pointer-events-none" />
        <div className="relative flex flex-wrap items-end justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-[#ff5c2b] to-[#ff7a3f] grid place-items-center shadow-lg shadow-[#ff5c2b]/30">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                <rect x="9" y="3" width="6" height="4" rx="1" />
                <path d="m9 13 2 2 4-4" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Orders</h1>
              <p className="text-sm text-[#9aa3ad] mt-1">100 order terakhir. Update status, hapus, atau filter.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="px-3 py-1.5 rounded-lg bg-[#1c2026] border border-[#262b33] text-xs">
              <span className="text-[#6d7681]">Pending </span>
              <span className="font-extrabold text-[#ffb020]">{pendingCount}</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-[#1c2026] border border-[#262b33] text-xs">
              <span className="text-[#6d7681]">Revenue </span>
              <span className="font-extrabold text-[#2fbf71]">{rupiah(totalRevenue)}</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-[#1c2026] border border-[#262b33] text-xs">
              <span className="text-[#6d7681]">Total </span>
              <span className="font-extrabold text-white">{totalOrders}</span>
            </div>
            <Link href="/admin" className="text-xs font-semibold text-[#9aa3ad] hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-[#1c2026]">
              ← Dashboard
            </Link>
          </div>
        </div>
      </div>

      <OrdersManager
        orders={(orders as any) || []}
        actorLabel={profile.email || profile.full_name || "admin"}
      />
    </div>
  );
}
