import { requireStaff } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { updateSiteSettingsAction, updateOwnProfileAction } from "../actions";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage({ searchParams }: { searchParams: Promise<{ msg?: string; toast?: string }> }) {
  const { profile } = await requireStaff();
  const admin = createSupabaseAdminClient();
  const { data: settingsRow } = await admin
    .from("site_settings")
    .select("key, value")
    .eq("key", "whatsapp_cs")
    .maybeSingle();
  let whatsappCs = "6281234567890";
  if (settingsRow?.value) {
    const v = settingsRow.value;
    if (typeof v === "string") whatsappCs = v.replace(/^"|"$/g, "");
  }
  const { msg, toast } = await searchParams;
  const toastData = msg ? { message: msg, variant: (toast === "err" ? "error" : "success") as "success" | "error" } : undefined;

  return (
    <AdminShell profile={profile} toast={toastData}>
      <div className="space-y-5 max-w-3xl">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Settings</h1>
          <p className="text-sm text-[#9aa3ad] mt-1">Profil kamu + pengaturan WhatsApp CS global.</p>
        </div>

        <section className="bg-[#171a1f] border border-[#262b33] rounded-2xl p-5">
          <h2 className="font-bold text-sm flex items-center gap-2">
            <svg className="w-4 h-4 text-[#ff5c2b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v5M12 16h.01" />
            </svg>
            WhatsApp Customer Service
          </h2>
          <p className="text-xs text-[#9aa3ad] mt-1 leading-relaxed">
            Nomor ini otomatis ke-reflect di landing page, footer, halaman game, dan thank-you page. Format: <span className="font-mono text-white">628xxxxxxxxx</span> (kode negara 62 + nomor HP, tanpa + atau 0 di depan).
          </p>
          <SettingsForm action={updateSiteSettingsAction} buttonLabel="Simpan">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="tel"
                name="whatsapp_cs"
                defaultValue={whatsappCs}
                placeholder="6281234567890"
                pattern="628[0-9]{8,12}"
                className="form-input flex-1 font-mono"
                required
              />
            </div>
            <div className="mt-2 text-[10px] text-[#6d7681]">Current: <span className="font-mono text-[#9aa3ad]">{whatsappCs}</span> · akan muncul di semua halaman</div>
          </SettingsForm>
        </section>

        <section className="bg-[#171a1f] border border-[#262b33] rounded-2xl p-5">
          <h2 className="font-bold text-sm flex items-center gap-2">
            <svg className="w-4 h-4 text-[#5bc8ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v5M12 16h.01" />
            </svg>
            Profil & Password
          </h2>
          <p className="text-xs text-[#9aa3ad] mt-1 leading-relaxed">Update nama tampil + ganti password. Kosongkan password jika tidak ingin ganti.</p>
          <SettingsForm action={updateOwnProfileAction} buttonLabel="Simpan Profil">
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6d7681]">Email</label>
              <input value={profile.email} disabled className="form-input bg-[#0a0c0f] text-[#6d7681] cursor-not-allowed" />
            </div>
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6d7681]">Nama Tampil</label>
              <input
                name="full_name"
                defaultValue={profile.full_name || ""}
                placeholder="Admin Axivon"
                className="form-input"
              />
            </div>
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6d7681]">Password Baru (opsional, min 6 char)</label>
              <input
                type="password"
                name="new_password"
                placeholder="••••••••"
                minLength={6}
                className="form-input font-mono"
                autoComplete="new-password"
              />
            </div>
          </SettingsForm>
        </section>
      </div>
    </AdminShell>
  );
}
