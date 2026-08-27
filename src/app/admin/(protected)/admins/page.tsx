import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminsClient } from "@/components/admin/AdminsClient";

export default async function AdminAdminsPage({ searchParams }: { searchParams: Promise<{ msg?: string; toast?: string }> }) {
  const { profile } = await requireStaff();

  if (profile.role !== "admin") {
    redirect(`/admin?msg=Hanya+admin+yang+bisa+akses&toast=err`);
  }

  const admin = createSupabaseAdminClient();
  const { data: profiles } = await admin
    .from("profiles")
    .select("id, email, full_name, role, created_at")
    .order("created_at", { ascending: true }) as any;

  const { msg, toast } = await searchParams;
  const toastData = msg ? { message: msg, variant: (toast === "err" ? "error" : "success") as "success" | "error" } : undefined;

  return (
    <AdminShell profile={profile} toast={toastData}>
      <div className="space-y-5 max-w-4xl">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Manajemen Admin</h1>
          <p className="text-sm text-[#9aa3ad] mt-1">
            Tambah, lihat, dan hapus akun admin/staff. Admin baru otomatis mendapat role <span className="font-bold text-[#ff5c2b]">admin</span>.
          </p>
        </div>
        <AdminsClient profiles={(profiles || []) as any[]} currentUserId={profile.id} />
      </div>
    </AdminShell>
  );
}
