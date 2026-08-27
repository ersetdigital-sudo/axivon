import { requireStaff } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { ProductsManager } from "@/components/admin/ProductsManager";
import { AdminShell } from "@/components/admin/AdminShell";
import Link from "next/link";

const rupiah = (n: number) => "Rp" + Number(n || 0).toLocaleString("id-ID");

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<{ msg?: string; toast?: string }> }) {
  const { profile } = await requireStaff();
  const admin = createSupabaseAdminClient();
  const [productsRes, gamesRes] = await Promise.all([
    admin.from("products").select("id, label, price, old_price, coins, description, badge, is_active, sort_order, icon_color, games(slug, name)").order("game_id").order("sort_order"),
    admin.from("games").select("id, name, short_name, slug").order("name"),
  ]);

  const products = (productsRes.data as any) || [];
  const games = (gamesRes.data as any) || [];
  const activeCount = products.filter((p: any) => p.is_active).length;
  const inactiveCount = products.length - activeCount;
  const gamesCount = new Set(products.map((p: any) => p.games?.slug).filter(Boolean)).size;
  const totalValue = products.filter((p: any) => p.is_active).reduce((s: number, p: any) => s + (p.price || 0), 0);
  const avgPrice = activeCount ? Math.round(totalValue / activeCount) : 0;
  const maxPrice = products.length ? Math.max(...products.map((p: any) => p.price || 0)) : 0;

  const { msg, toast } = await searchParams;
  const toastData = msg ? { message: msg, variant: (toast === "err" ? "error" : "success") as "success" | "error" } : undefined;

  return (
    <AdminShell profile={profile} toast={toastData}>
      <div className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Products</h1>
            <p className="text-sm text-[#9aa3ad] mt-1">Kelola nominal top up per game.</p>
          </div>
          <Link
            href="/admin"
            className="text-xs font-semibold text-[#9aa3ad] hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-[#1c2026]"
          >
            ← Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KpiCard label="Total Nominal" value={String(products.length)} sub={`${gamesCount} game`} accent="orange" />
          <KpiCard label="Aktif" value={String(activeCount)} sub={`${inactiveCount} nonaktif`} accent="green" />
          <KpiCard label="Rata-rata Harga" value={rupiah(avgPrice)} sub="per nominal aktif" accent="blue" />
          <KpiCard label="Harga Tertinggi" value={rupiah(maxPrice)} sub="top SKU" accent="purple" />
        </div>

        <ProductsManager products={products} games={games} />
      </div>
    </AdminShell>
  );
}

function KpiCard({ label, value, sub, accent }: { label: string; value: string; sub: string; accent: "orange" | "green" | "blue" | "purple" }) {
  const styles: Record<string, { ring: string; chip: string; num: string }> = {
    orange: { ring: "border-[#ff5c2b]/30 bg-gradient-to-br from-[#ff5c2b]/10 to-transparent", chip: "bg-[#ff5c2b]/15 text-[#ff5c2b]", num: "text-[#ff5c2b]" },
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
