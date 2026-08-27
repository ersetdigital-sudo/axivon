"use client";

import { useState, useTransition } from "react";
import { updateOrderStatusAction, deleteOrderAction } from "@/app/admin/(protected)/actions";
import { useConfirm } from "./useConfirm";

const rupiah = (n: number) => "Rp" + Number(n || 0).toLocaleString("id-ID");

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

type Order = {
  id: number;
  order_code: string;
  status: string;
  total: number;
  subtotal: number | null;
  service_fee: number | null;
  payment_method: string | null;
  customer_uid: string;
  customer_zid: string | null;
  customer_whatsapp: string | null;
  notes: string | null;
  created_at: string;
  games: { slug: string; name: string; short_name: string } | null;
  products: { label: string; coins: number } | null;
};

export function OrdersManager({ orders, actorLabel }: { orders: Order[]; actorLabel: string }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = orders.filter((o) => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      o.order_code.toLowerCase().includes(q) ||
      o.customer_uid.toLowerCase().includes(q) ||
      (o.games?.short_name || "").toLowerCase().includes(q) ||
      (o.products?.label || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[240px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari order, UID, atau game..."
            className="w-full rounded-lg bg-[#0d0f12] border border-[#262b33] pl-9 pr-3 py-2 text-sm text-white placeholder:text-[#5d6570] focus:outline-none focus:border-[#ff5c2b]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="form-select !w-auto !py-2 !text-xs"
        >
          <option value="all">Semua status</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
        </select>
      </div>

      <div className="bg-[#171a1f] border border-[#262b33] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[820px]">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider text-[#6d7681] border-b border-[#262b33] bg-[#0d0f12]/40">
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Game / Item</th>
                <th className="px-4 py-3">Akun</th>
                <th className="px-4 py-3">Bayar</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3 text-right">Status & Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-[#6d7681]">
                    {orders.length === 0 ? "Belum ada order." : "Tidak ada order yang cocok dengan filter."}
                  </td>
                </tr>
              )}
              {filtered.map((o) => (
                <OrderRow key={o.id} order={o} actorLabel={actorLabel} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function OrderRow({ order, actorLabel }: { order: Order; actorLabel: string }) {
  const confirm = useConfirm();
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState(order.status);
  const dirty = status !== order.status;

  return (
    <tr className="border-b border-[#262b33] last:border-0 hover:bg-[#1c2026]/40 transition">
      <td className="px-4 py-3 align-top">
        <div className="font-mono text-xs font-bold">{order.order_code}</div>
        <div className="text-[10px] text-[#6d7681] mt-0.5">
          {new Date(order.created_at).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" })}
        </div>
      </td>
      <td className="px-4 py-3 align-top">
        <div className="font-semibold text-xs">{order.games?.short_name || "—"}</div>
        <div className="text-[11px] text-[#9aa3ad] mt-0.5">{order.products?.label || "—"}</div>
      </td>
      <td className="px-4 py-3 align-top">
        <div className="text-xs font-mono">{order.customer_uid}</div>
        {order.customer_zid && <div className="text-[11px] text-[#9aa3ad]">({order.customer_zid})</div>}
        {order.customer_whatsapp && <div className="text-[11px] text-[#2fbf71] mt-0.5">{order.customer_whatsapp}</div>}
      </td>
      <td className="px-4 py-3 align-top">
        <div className="text-xs font-semibold">{order.payment_method || "—"}</div>
        <div className="text-[10px] text-[#6d7681]">fee {rupiah(order.service_fee || 0)}</div>
      </td>
      <td className="px-4 py-3 align-top">
        <div className="font-bold text-[#ff5c2b] text-sm">{rupiah(order.total)}</div>
      </td>
      <td className="px-4 py-3 align-top" colSpan={2}>
        <div className="flex items-center gap-1.5 justify-end">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={`appearance-none cursor-pointer text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1.5 rounded-md border bg-transparent focus:outline-none ${STATUS_COLOR[status] || STATUS_COLOR.pending} ${
              dirty ? "ring-2 ring-[#ff5c2b]/50" : ""
            }`}
          >
            {STATUS_OPTIONS.map((s) => <option key={s} value={s} className="bg-[#171a1f] text-white normal-case font-semibold">{STATUS_LABEL[s]}</option>)}
          </select>
          <button
            type="button"
            disabled={!dirty || pending}
            onClick={() => {
              const fd = new FormData();
              fd.set("order_id", String(order.id));
              fd.set("status", status);
              fd.set("actor_label", actorLabel);
              startTransition(async () => {
                await updateOrderStatusAction(fd);
              });
            }}
            title="Simpan perubahan"
            className="w-8 h-8 grid place-items-center rounded-md bg-gradient-to-br from-[#ff5c2b] to-[#ff7a3f] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-md hover:shadow-[#ff5c2b]/40 transition shrink-0"
          >
            {pending ? (
              <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            )}
          </button>
          <form
            action={deleteOrderAction}
            onSubmit={async (e) => {
              e.preventDefault();
              const ok = await confirm({
                title: "Hapus order?",
                message: `Order ${order.order_code} akan dihapus permanen dan tidak bisa dikembalikan.`,
                confirmText: "Hapus",
                variant: "danger",
              });
              if (ok) (e.currentTarget as HTMLFormElement).requestSubmit();
            }}
            className="inline"
          >
            <input type="hidden" name="order_id" value={order.id} />
            <button
              type="submit"
              title="Hapus order"
              className="w-8 h-8 grid place-items-center rounded-md bg-[#1c2026] border border-[#262b33] text-[#9aa3ad] hover:border-[#ff5c5c]/50 hover:text-[#ff8a8a] hover:bg-[#ff5c5c]/10 transition shrink-0"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          </form>
        </div>
      </td>
    </tr>
  );
}
