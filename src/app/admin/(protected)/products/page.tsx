import { requireStaff } from "@/lib/auth";
import { toggleProductAction } from "../actions";
import Link from "next/link";

const rupiah = (n: number) => "Rp" + n.toLocaleString("id-ID");

export default async function AdminProductsPage() {
  const { supabase } = await requireStaff();
  const { data: products } = await supabase
    .from("products")
    .select("id, label, price, old_price, coins, description, badge, is_active, sort_order, games(slug, name)")
    .order("game_id", { ascending: true })
    .order("sort_order", { ascending: true });

  const grouped: Record<string, { game: any; items: any[] }> = {};
  products?.forEach((p: any) => {
    const key = p.games?.slug || "unknown";
    if (!grouped[key]) grouped[key] = { game: p.games, items: [] };
    grouped[key].items.push(p);
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Products</h1>
          <p className="text-sm text-[#9aa3ad] mt-1">Kelola nominal per game. Nonaktifkan untuk sembunyikan dari katalog.</p>
        </div>
        <Link href="/admin" className="text-xs font-semibold text-[#9aa3ad] hover:text-white">← Dashboard</Link>
      </div>

      <div className="space-y-4">
        {Object.values(grouped).map(({ game, items }) => (
          <section key={game?.slug} className="bg-[#171a1f] border border-[#262b33] rounded-xl overflow-hidden">
            <div className="px-4 sm:px-5 py-3 border-b border-[#262b33] flex items-center justify-between">
              <div>
                <h2 className="font-bold text-sm">{game?.name || "Unknown"}</h2>
                <p className="text-[11px] text-[#6d7681] mt-0.5">{items.length} nominal</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead>
                  <tr className="text-left text-[10px] uppercase tracking-wider text-[#6d7681] border-b border-[#262b33]">
                    <th className="px-4 py-2.5">Label</th>
                    <th className="px-4 py-2.5">Harga</th>
                    <th className="px-4 py-2.5">Coret</th>
                    <th className="px-4 py-2.5">Koin</th>
                    <th className="px-4 py-2.5">Badge</th>
                    <th className="px-4 py-2.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((p) => (
                    <tr key={p.id} className="border-b border-[#262b33] last:border-0 hover:bg-[#1c2026]/40 transition">
                      <td className="px-4 py-2.5">
                        <div className="font-semibold text-xs">{p.label}</div>
                        <div className="text-[10px] text-[#6d7681]">{p.description}</div>
                      </td>
                      <td className="px-4 py-2.5 font-bold text-[#ff5c2b] text-xs">{rupiah(p.price)}</td>
                      <td className="px-4 py-2.5 text-[11px] text-[#6d7681] line-through">{p.old_price ? rupiah(p.old_price) : "—"}</td>
                      <td className="px-4 py-2.5 text-xs">{p.coins.toLocaleString("id-ID")}</td>
                      <td className="px-4 py-2.5">
                        {p.badge && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#ff5c2b] text-white">{p.badge}</span>}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <form action={toggleProductAction} className="inline">
                          <input type="hidden" name="product_id" value={p.id} />
                          <input type="hidden" name="is_active" value={(!p.is_active).toString()} />
                          <button
                            type="submit"
                            className={`text-xs font-semibold px-2.5 py-1.5 rounded-md border transition ${
                              p.is_active ? "bg-[#2fbf71]/15 text-[#2fbf71] border-[#2fbf71]/30 hover:bg-[#2fbf71]/25" : "bg-[#6d7681]/15 text-[#9aa3ad] border-[#6d7681]/30 hover:bg-[#6d7681]/25"
                            }`}
                          >
                            {p.is_active ? "Aktif" : "Nonaktif"}
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
