import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { createAdminAction, deleteAdminAction } from "../actions";

export default async function AdminAdminsPage({ searchParams }: { searchParams: Promise<{ msg?: string; toast?: string }> }) {
  const { profile, supabase } = await requireStaff();

  // Only admin role can manage admins
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
          <p className="text-sm text-[#9aa3ad] mt-1">Tambah, lihat, dan hapus akun admin/staff.</p>
        </div>

        <section className="bg-[#171a1f] border border-[#2fbf71]/30 rounded-2xl p-5">
          <h2 className="font-bold text-sm flex items-center gap-2">
            <svg className="w-4 h-4 text-[#2fbf71]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Tambah Admin Baru
          </h2>
          <form action={createAdminAction} className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <input name="email" type="email" required placeholder="admin@axivongames.net" className="form-input" />
            <input name="full_name" required placeholder="Nama Admin" className="form-input" />
            <input name="password" type="password" required minLength={6} placeholder="Password (min 6)" className="form-input font-mono" />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#2fbf71] to-[#25a061] text-white text-xs font-bold hover:shadow-lg hover:shadow-[#2fbf71]/30 transition"
            >
              Tambah Admin
            </button>
          </form>
        </section>

        <section className="bg-[#171a1f] border border-[#262b33] rounded-2xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[#262b33] flex items-center justify-between">
            <div>
              <h2 className="font-bold text-sm">Daftar Admin & Staff</h2>
              <p className="text-[11px] text-[#6d7681] mt-0.5">{profiles?.length || 0} akun terdaftar</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-wider text-[#6d7681] border-b border-[#262b33] bg-[#0d0f12]/40">
                  <th className="px-4 py-2.5">Email</th>
                  <th className="px-4 py-2.5">Nama</th>
                  <th className="px-4 py-2.5">Role</th>
                  <th className="px-4 py-2.5">Dibuat</th>
                  <th className="px-4 py-2.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {((profiles || []) as any[]).map((p: any) => (
                  <tr key={p.id} className="border-b border-[#262b33] last:border-0 hover:bg-[#1c2026]/40">
                    <td className="px-4 py-2.5 font-mono text-xs">{p.email}</td>
                    <td className="px-4 py-2.5">{p.full_name || "—"}</td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${
                        p.role === "admin"
                          ? "bg-[#ff5c2b]/15 text-[#ff5c2b] border-[#ff5c2b]/30"
                          : "bg-[#5bc8ff]/15 text-[#5bc8ff] border-[#5bc8ff]/30"
                      }`}>
                        {p.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-[10px] text-[#6d7681]">
                      {new Date(p.created_at).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" })}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      {p.id === profile.id ? (
                        <span className="text-[10px] text-[#6d7681] italic">You</span>
                      ) : (
                        <form
                          action={deleteAdminAction}
                          onSubmit={(e) => {
                            if (!confirm(`Hapus admin ${p.email}? Akun ini akan dihapus permanen.`)) e.preventDefault();
                          }}
                          className="inline"
                        >
                          <input type="hidden" name="id" value={p.id} />
                          <button
                            type="submit"
                            className="px-2 py-1 rounded-md bg-[#1c2026] border border-[#262b33] text-[10px] font-bold text-[#9aa3ad] hover:border-[#ff5c5c]/50 hover:text-[#ff8a8a] transition"
                          >
                            Hapus
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
