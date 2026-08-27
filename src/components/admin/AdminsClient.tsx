"use client";

import { useState, useTransition } from "react";
import { SettingsForm } from "./SettingsForm";
import { useConfirm } from "./useConfirm";
import { createAdminAction, deleteAdminAction } from "@/app/admin/(protected)/actions";

type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string;
};

type Props = {
  profiles: Profile[];
  currentUserId: string;
};

export function AdminsClient({ profiles, currentUserId }: Props) {
  const confirm = useConfirm();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, startDelete] = useTransition();

  const handleDelete = async (id: string, email: string) => {
    const ok = await confirm({
      title: "Cabut akses admin?",
      message: `Admin ${email} tidak akan bisa login lagi. Tindakan ini permanen.`,
      confirmText: "Cabut Akses",
      variant: "danger",
    });
    if (!ok) return;
    setDeletingId(id);
    const fd = new FormData();
    fd.set("id", id);
    startDelete(async () => {
      await deleteAdminAction(fd);
      setDeletingId(null);
    });
  };

  return (
    <div className="space-y-5">
      <SettingsForm action={createAdminAction} buttonLabel="Tambah Admin">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6d7681]">Email</label>
            <input
              name="email"
              type="email"
              required
              placeholder="admin@axivongames.net"
              className="form-input mt-1"
            />
          </div>
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6d7681]">Nama Tampil</label>
            <input
              name="full_name"
              required
              placeholder="Nama Admin"
              className="form-input mt-1"
            />
          </div>
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6d7681]">Password (min 6 char)</label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              className="form-input font-mono mt-1"
              autoComplete="new-password"
            />
          </div>
        </div>
        <div className="text-[10px] text-[#6d7681] mt-1">
          Admin baru otomatis mendapat role <span className="font-bold text-[#ff5c2b]">admin</span>. Email harus unik.
        </div>
      </SettingsForm>

      <section className="bg-[#171a1f] border border-[#262b33] rounded-2xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#262b33] flex items-center justify-between">
          <div>
            <h2 className="font-bold text-sm">Daftar Admin &amp; Staff</h2>
            <p className="text-[11px] text-[#6d7681] mt-0.5">{profiles.length} akun terdaftar</p>
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
              {profiles.map((p) => {
                const isMe = p.id === currentUserId;
                const isDeletingThis = deletingId === p.id;
                return (
                  <tr key={p.id} className="border-b border-[#262b33] last:border-0 hover:bg-[#1c2026]/40 transition">
                    <td className="px-4 py-2.5 font-mono text-xs">
                      <div className="flex items-center gap-2">
                        {p.email}
                        {isMe && (
                          <span className="inline-flex items-center text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#ff5c2b]/15 text-[#ff5c2b] border border-[#ff5c2b]/30">
                            Kamu
                          </span>
                        )}
                      </div>
                    </td>
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
                      {isMe ? (
                        <span className="text-[10px] text-[#6d7681] italic">Akun sendiri</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id, p.email)}
                          disabled={isDeletingThis || isDeleting}
                          className="px-2.5 py-1 rounded-md bg-[#1c2026] border border-[#262b33] text-[10px] font-bold text-[#9aa3ad] hover:border-[#ff5c5c]/50 hover:text-[#ff8a8a] transition inline-flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isDeletingThis ? (
                            <>
                              <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                              </svg>
                              Menghapus...
                            </>
                          ) : (
                            <>
                              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 6h18" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              </svg>
                              Cabut Akses
                            </>
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
