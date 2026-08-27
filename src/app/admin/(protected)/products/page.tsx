import { requireStaff } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { ProductsManager } from "@/components/admin/ProductsManager";
import { Toast } from "@/components/admin/Toast";
import Link from "next/link";

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<{ msg?: string; toast?: string }> }) {
  await requireStaff();
  const admin = createSupabaseAdminClient();
  const [productsRes, gamesRes] = await Promise.all([
    admin.from("products").select("id, label, price, old_price, coins, description, badge, is_active, sort_order, icon_color, games(slug, name)").order("game_id").order("sort_order"),
    admin.from("games").select("id, name, short_name, slug").order("name"),
  ]);

  const { msg, toast } = await searchParams;
  const variant: "success" | "error" = toast === "err" ? "error" : "success";

  return (
    <div className="space-y-6">
      {msg && <Toast message={msg} variant={variant} />}

      <div className="relative overflow-hidden rounded-2xl border border-[#262b33] bg-gradient-to-br from-[#171a1f] via-[#15181d] to-[#12151a] p-5 sm:p-6">
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#ff5c2b]/10 blur-3xl pointer-events-none" />
        <div className="relative flex flex-wrap items-end justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-[#ff5c2b] to-[#ff7a3f] grid place-items-center shadow-lg shadow-[#ff5c2b]/30">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.59 13.41 13.41 20.59a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <path d="M7 7h.01" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Products</h1>
              <p className="text-sm text-[#9aa3ad] mt-1">Kelola nominal per game. Tambah, edit, aktif/nonaktif.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-lg bg-[#1c2026] border border-[#262b33] text-xs">
              <span className="text-[#6d7681]">Total </span>
              <span className="font-extrabold text-white">{productsRes.data?.length || 0}</span>
            </div>
            <Link href="/admin" className="text-xs font-semibold text-[#9aa3ad] hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-[#1c2026]">
              ← Dashboard
            </Link>
          </div>
        </div>
      </div>

      <ProductsManager products={(productsRes.data as any) || []} games={(gamesRes.data as any) || []} />
    </div>
  );
}
