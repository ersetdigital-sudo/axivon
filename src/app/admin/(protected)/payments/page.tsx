import { requireStaff } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { PaymentsManager } from "@/components/admin/PaymentsManager";
import { Toast } from "@/components/admin/Toast";
import Link from "next/link";

export default async function AdminPaymentsPage({ searchParams }: { searchParams: Promise<{ msg?: string; toast?: string }> }) {
  await requireStaff();
  const admin = createSupabaseAdminClient();
  const { data: methods } = await admin
    .from("payment_methods")
    .select("id, label, slug, type, bank_name, account_number, account_name, instructions, fee, fee_label, is_active")
    .order("sort_order", { ascending: true });

  const { msg, toast } = await searchParams;
  const variant: "success" | "error" = toast === "err" ? "error" : "success";

  const activeCount = methods?.filter((m: any) => m.is_active).length ?? 0;
  const totalCount = methods?.length ?? 0;

  return (
    <div className="space-y-6">
      {msg && <Toast message={msg} variant={variant} />}

      <div className="relative overflow-hidden rounded-2xl border border-[#262b33] bg-gradient-to-br from-[#171a1f] via-[#15181d] to-[#12151a] p-5 sm:p-6">
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#ff5c2b]/10 blur-3xl pointer-events-none" />
        <div className="relative flex flex-wrap items-end justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-[#ff5c2b] to-[#ff7a3f] grid place-items-center shadow-lg shadow-[#ff5c2b]/30">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="6" width="20" height="13" rx="2" />
                <path d="M2 10h20" />
                <path d="M6 15h3" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Payment Methods</h1>
              <p className="text-sm text-[#9aa3ad] mt-1">Toggle aktif/nonaktif, edit info, atau hapus metode.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-lg bg-[#1c2026] border border-[#262b33] text-xs">
              <span className="text-[#6d7681]">Aktif </span>
              <span className="font-extrabold text-[#2fbf71]">{activeCount}</span>
              <span className="text-[#6d7681]"> / {totalCount}</span>
            </div>
            <Link href="/admin" className="text-xs font-semibold text-[#9aa3ad] hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-[#1c2026]">
              ← Dashboard
            </Link>
          </div>
        </div>
      </div>

      <PaymentsManager methods={(methods as any) || []} />
    </div>
  );
}
