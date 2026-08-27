import { requireStaff } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { PaymentsManager } from "@/components/admin/PaymentsManager";
import { AdminShell } from "@/components/admin/AdminShell";
import Link from "next/link";

const TYPE_META: Record<string, { label: string; num: string; ring: string; chip: string }> = {
  qris: { label: "QRIS", num: "text-[#ff8a3f]", ring: "border-[#ff5c2b]/30 bg-gradient-to-br from-[#ff5c2b]/10 to-transparent", chip: "bg-[#ff5c2b]/15 text-[#ff5c2b]" },
  bank_transfer: { label: "Transfer Bank", num: "text-[#5bc8ff]", ring: "border-[#5bc8ff]/30 bg-gradient-to-br from-[#5bc8ff]/10 to-transparent", chip: "bg-[#5bc8ff]/15 text-[#5bc8ff]" },
  ewallet: { label: "E-Wallet", num: "text-[#c07bff]", ring: "border-[#c07bff]/30 bg-gradient-to-br from-[#c07bff]/10 to-transparent", chip: "bg-[#c07bff]/15 text-[#c07bff]" },
  pulsa: { label: "Pulsa", num: "text-[#ffb020]", ring: "border-[#ffb020]/30 bg-gradient-to-br from-[#ffb020]/10 to-transparent", chip: "bg-[#ffb020]/15 text-[#ffb020]" },
};

export default async function AdminPaymentsPage({ searchParams }: { searchParams: Promise<{ msg?: string; toast?: string }> }) {
  const { profile } = await requireStaff();
  const admin = createSupabaseAdminClient();
  const { data: methods } = await admin
    .from("payment_methods")
    .select("id, label, slug, type, bank_name, account_number, account_name, instructions, fee, fee_label, qris_image_url, is_active")
    .order("sort_order", { ascending: true });

  const list = (methods as any) || [];
  const activeCount = list.filter((m: any) => m.is_active).length;
  const inactiveCount = list.length - activeCount;
  const totalFee = list.filter((m: any) => m.is_active).reduce((s: number, m: any) => s + (m.fee || 0), 0);
  const byType = list.reduce((acc: Record<string, number>, m: any) => {
    acc[m.type] = (acc[m.type] || 0) + 1;
    return acc;
  }, {});

  const { msg, toast } = await searchParams;
  const toastData = msg ? { message: msg, variant: (toast === "err" ? "error" : "success") as "success" | "error" } : undefined;

  return (
    <AdminShell profile={profile} toast={toastData}>
      <div className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Payment Methods</h1>
            <p className="text-sm text-[#9aa3ad] mt-1">Toggle, edit, atau hapus metode pembayaran.</p>
          </div>
          <Link
            href="/admin"
            className="text-xs font-semibold text-[#9aa3ad] hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-[#1c2026]"
          >
            ← Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KpiCard label="Total Metode" value={String(list.length)} sub={`${activeCount} aktif`} accent="orange" />
          <KpiCard label="Aktif" value={String(activeCount)} sub={`${inactiveCount} nonaktif`} accent="green" />
          <KpiCard label="Total Fee" value={rupiah(totalFee)} sub="dari semua metode" accent="blue" />
          <KpiCard label="Tipe" value={String(Object.keys(byType).length)} sub={Object.keys(byType).join(" · ")} accent="purple" />
        </div>

        <PaymentsManager methods={list} />
      </div>
    </AdminShell>
  );
}

const rupiah = (n: number) => "Rp" + Number(n || 0).toLocaleString("id-ID");

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
