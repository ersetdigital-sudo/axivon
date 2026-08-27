"use client";

import { useState, useTransition } from "react";
import {
  toggleProductAction,
  createProductAction,
  updateProductAction,
  deleteProductAction,
} from "@/app/admin/(protected)/actions";
import { useConfirm } from "./useConfirm";

const rupiah = (n: number) => "Rp" + Number(n || 0).toLocaleString("id-ID");

type Product = {
  id: number;
  label: string;
  price: number;
  old_price: number | null;
  coins: number;
  description: string | null;
  badge: string | null;
  is_active: boolean;
  sort_order: number;
  icon_color: string | null;
  games: { slug: string; name: string; short_name: string } | null;
};

type Game = { id: number; name: string; short_name: string; slug: string };

export function ProductsManager({ products, games }: { products: Product[]; games: Game[] }) {
  const confirm = useConfirm();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [pendingToggle, startToggle] = useTransition();
  const [optimisticActive, setOptimisticActive] = useState<Record<number, boolean>>({});
  const [search, setSearch] = useState("");

  const filtered = products.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.label.toLowerCase().includes(q) ||
      (p.games?.name || "").toLowerCase().includes(q) ||
      (p.description || "").toLowerCase().includes(q)
    );
  });

  const grouped: Record<string, { game: Game | null; items: Product[] }> = {};
  for (const p of filtered) {
    const key = p.games?.slug || "unknown";
    if (!grouped[key]) grouped[key] = { game: p.games as any, items: [] };
    grouped[key].items.push(p);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari produk..."
            className="w-full rounded-lg bg-[#0d0f12] border border-[#262b33] pl-9 pr-3 py-2 text-sm text-white placeholder:text-[#5d6570] focus:outline-none focus:border-[#ff5c2b]"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowAdd((v) => !v)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-[#2fbf71] to-[#25a061] text-white text-xs font-bold hover:shadow-lg hover:shadow-[#2fbf71]/30 transition"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Tambah Produk
        </button>
      </div>

      {showAdd && (
        <AddProductForm games={games} action={createProductAction} onClose={() => setShowAdd(false)} />
      )}

      {Object.values(grouped).map(({ game, items }) => (
        <section key={game?.slug || "unknown"} className="bg-[#171a1f] border border-[#262b33] rounded-2xl overflow-hidden">
          <div className="px-4 sm:px-5 py-3.5 border-b border-[#262b33] bg-gradient-to-r from-[#15181d] to-transparent flex items-center justify-between">
            <div>
              <h2 className="font-bold text-sm">{game?.name || "Unknown"}</h2>
              <p className="text-[11px] text-[#6d7681] mt-0.5">{items.length} nominal</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[860px]">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-wider text-[#6d7681] border-b border-[#262b33] bg-[#0d0f12]/40">
                  <th className="px-4 py-2.5">Label</th>
                  <th className="px-4 py-2.5">Harga</th>
                  <th className="px-4 py-2.5">Coret</th>
                  <th className="px-4 py-2.5">Koin</th>
                  <th className="px-4 py-2.5">Badge</th>
                  <th className="px-4 py-2.5">Sort</th>
                  <th className="px-4 py-2.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => {
                  const isActive = optimisticActive[p.id] ?? p.is_active;
                  const isEditing = editingId === p.id;
                  return (
                    <>
                      <tr
                        key={p.id}
                        className={`border-b border-[#262b33] last:border-0 transition ${!isActive ? "opacity-60" : "hover:bg-[#1c2026]/40"}`}
                      >
                        <td className="px-4 py-2.5">
                          <div className={`font-semibold text-xs ${p.icon_color || "text-[#5bc8ff]"}`}>{p.label}</div>
                          <div className="text-[10px] text-[#6d7681]">{p.description || "—"}</div>
                        </td>
                        <td className="px-4 py-2.5 font-bold text-[#ff5c2b] text-xs">{rupiah(p.price)}</td>
                        <td className="px-4 py-2.5 text-[11px] text-[#6d7681] line-through">
                          {p.old_price ? rupiah(p.old_price) : "—"}
                        </td>
                        <td className="px-4 py-2.5 text-xs">{p.coins.toLocaleString("id-ID")}</td>
                        <td className="px-4 py-2.5">
                          {p.badge && (
                            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-gradient-to-r from-[#ff5c2b] to-[#ff7a3f] text-white">
                              {p.badge}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-[11px] text-[#6d7681]">{p.sort_order}</td>
                        <td className="px-4 py-2.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              role="switch"
                              aria-checked={isActive}
                              disabled={pendingToggle}
                              onClick={() => {
                                const next = !isActive;
                                setOptimisticActive((m) => ({ ...m, [p.id]: next }));
                                const fd = new FormData();
                                fd.set("product_id", String(p.id));
                                fd.set("is_active", String(next));
                                startToggle(async () => {
                                  await toggleProductAction(fd);
                                  setOptimisticActive((m) => {
                                    const c = { ...m };
                                    delete c[p.id];
                                    return c;
                                  });
                                });
                              }}
                              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5c2b]/50 disabled:opacity-60 ${
                                isActive
                                  ? "bg-gradient-to-r from-[#2fbf71] to-[#25a061] border-[#2fbf71]/50 shadow-[0_0_10px_rgba(47,191,113,0.3)]"
                                  : "bg-[#1c2026] border-[#262b33] hover:border-[#3a424e]"
                              }`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition duration-200 ${
                                  isActive ? "translate-x-[18px]" : "translate-x-0.5"
                                }`}
                              />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(isEditing ? null : p.id)}
                              className="px-2.5 py-1 rounded-md bg-[#1c2026] border border-[#262b33] text-[10px] font-bold text-[#9aa3ad] hover:border-[#3a424e] hover:text-white transition"
                            >
                              {isEditing ? "Tutup" : "Edit"}
                            </button>
                            <form
                              action={deleteProductAction}
                              onSubmit={async (e) => {
                                e.preventDefault();
                                const ok = await confirm({
                                  title: "Hapus produk?",
                                  message: `Produk "${p.label}" akan dihapus permanen dan tidak bisa dikembalikan.`,
                                  confirmText: "Hapus",
                                  variant: "danger",
                                });
                                if (ok) (e.currentTarget as HTMLFormElement).requestSubmit();
                              }}
                              className="inline"
                            >
                              <input type="hidden" name="product_id" value={p.id} />
                              <button
                                type="submit"
                                className="px-2.5 py-1 rounded-md bg-[#1c2026] border border-[#262b33] text-[10px] font-bold text-[#9aa3ad] hover:border-[#ff5c5c]/50 hover:text-[#ff8a8a] transition"
                              >
                                Hapus
                              </button>
                            </form>
                          </div>
                        </td>
                      </tr>
                      {isEditing && (
                        <tr key={`${p.id}-edit`} className="bg-[#0d0f12]/60 border-b border-[#262b33]">
                          <td colSpan={7} className="px-4 py-4">
                            <EditProductForm product={p} action={updateProductAction} onDone={() => setEditingId(null)} />
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      {Object.keys(grouped).length === 0 && (
        <div className="bg-[#171a1f] border border-[#262b33] rounded-xl p-8 text-center text-sm text-[#6d7681]">
          {search ? "Tidak ada produk yang cocok dengan pencarian." : "Belum ada produk."}
        </div>
      )}
    </div>
  );
}

function AddProductForm({ games, action, onClose }: { games: Game[]; action: (fd: FormData) => Promise<void>; onClose: () => void }) {
  const [pending, startTransition] = useTransition();
  return (
    <form
      action={(fd) => startTransition(async () => { await action(fd); onClose(); })}
      className="bg-[#171a1f] border border-[#2fbf71]/30 rounded-2xl p-4 sm:p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <svg className="w-4 h-4 text-[#2fbf71]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Tambah Produk Baru
        </h3>
        <button type="button" onClick={onClose} className="text-[#6d7681] hover:text-white text-xs">✕</button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <Field label="Game" required>
          <select name="game_id" required defaultValue="" className="form-select">
            <option value="" disabled>— Pilih game —</option>
            {games.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </Field>
        <Field label="Label" required>
          <input name="label" required placeholder="86 Diamonds" className="form-input" />
        </Field>
        <Field label="Koin" required>
          <input name="coins" type="number" min="0" required placeholder="86" className="form-input" />
        </Field>
        <Field label="Harga (Rp)" required>
          <input name="price" type="number" min="0" required placeholder="24500" className="form-input" />
        </Field>
        <Field label="Harga Coret (Rp)">
          <input name="old_price" type="number" min="0" placeholder="26000" className="form-input" />
        </Field>
        <Field label="Sort Order">
          <input name="sort_order" type="number" min="0" defaultValue={99} className="form-input" />
        </Field>
        <Field label="Badge">
          <input name="badge" placeholder="HOT / EVENT / BEST" className="form-input" />
        </Field>
        <Field label="Icon Color (Tailwind)">
          <input name="icon_color" defaultValue="text-[#5bc8ff]" className="form-input" />
        </Field>
        <Field label="Deskripsi" full>
          <input name="description" placeholder="Bonus +5 diamond" className="form-input" />
        </Field>
      </div>
      <div className="flex justify-end gap-2 mt-3">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-[#1c2026] border border-[#262b33] text-xs font-bold hover:border-[#3a424e] transition">
          Batal
        </button>
        <button
          type="submit"
          disabled={pending || games.length === 0}
          className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#2fbf71] to-[#25a061] text-white text-xs font-bold hover:shadow-lg hover:shadow-[#2fbf71]/30 transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
        >
          {pending ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
}

function EditProductForm({ product, action, onDone }: { product: Product; action: (fd: FormData) => Promise<void>; onDone: () => void }) {
  const [pending, startTransition] = useTransition();
  return (
    <form
      action={(fd) => startTransition(async () => { await action(fd); onDone(); })}
      className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3"
    >
      <input type="hidden" name="id" value={product.id} />
      <Field label="Label" required>
        <input name="label" required defaultValue={product.label} className="form-input" />
      </Field>
      <Field label="Harga (Rp)" required>
        <input name="price" type="number" min="0" required defaultValue={product.price} className="form-input" />
      </Field>
      <Field label="Harga Coret (Rp)">
        <input name="old_price" type="number" min="0" defaultValue={product.old_price || ""} className="form-input" />
      </Field>
      <Field label="Koin" required>
        <input name="coins" type="number" min="0" required defaultValue={product.coins} className="form-input" />
      </Field>
      <Field label="Sort Order">
        <input name="sort_order" type="number" min="0" defaultValue={product.sort_order ?? 99} className="form-input" />
      </Field>
      <Field label="Badge">
        <input name="badge" defaultValue={product.badge || ""} placeholder="HOT / EVENT / BEST" className="form-input" />
      </Field>
      <Field label="Icon Color" full>
        <input name="icon_color" defaultValue={product.icon_color || "text-[#5bc8ff]"} className="form-input" />
      </Field>
      <Field label="Deskripsi" full>
        <input name="description" defaultValue={product.description || ""} placeholder="Bonus +5 diamond" className="form-input" />
      </Field>
      <div className="sm:col-span-2 lg:col-span-3 flex justify-end gap-2 pt-1">
        <button type="button" onClick={onDone} className="px-4 py-2 rounded-lg bg-[#1c2026] border border-[#262b33] text-xs font-bold hover:border-[#3a424e] transition">
          Batal
        </button>
        <button
          type="submit"
          disabled={pending}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#ff5c2b] to-[#ff7a3f] text-white text-xs font-bold hover:shadow-lg hover:shadow-[#ff5c2b]/30 transition disabled:opacity-50"
        >
          {pending ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
}

function Field({ label, required, full, children }: { label: string; required?: boolean; full?: boolean; children: React.ReactNode }) {
  return (
    <div className={full ? "sm:col-span-2 lg:col-span-3" : ""}>
      <label className="text-[10px] font-bold uppercase tracking-wider text-[#6d7681]">
        {label} {required && <span className="text-[#ff5c2b]">*</span>}
      </label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
