"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import {
  togglePaymentMethodAction,
  updatePaymentMethodAction,
  deletePaymentMethodAction,
  uploadPaymentQRISAction,
} from "@/app/admin/(protected)/actions";

const rupiah = (n: number) => "Rp" + Number(n || 0).toLocaleString("id-ID");

const TYPE_META: Record<string, { label: string; color: string }> = {
  qris: { label: "QRIS", color: "from-[#ff5c2b]/20 to-[#ff8a3f]/10 text-[#ff8a3f] border-[#ff5c2b]/30" },
  bank_transfer: { label: "Transfer Bank", color: "from-[#5bc8ff]/20 to-[#5bc8ff]/5 text-[#5bc8ff] border-[#5bc8ff]/30" },
  ewallet: { label: "E-Wallet", color: "from-[#c07bff]/20 to-[#c07bff]/5 text-[#c07bff] border-[#c07bff]/30" },
  pulsa: { label: "Pulsa", color: "from-[#ffb020]/20 to-[#ffb020]/5 text-[#ffb020] border-[#ffb020]/30" },
};

type Method = {
  id: number;
  label: string;
  slug: string;
  type: string;
  bank_name: string | null;
  account_number: string | null;
  account_name: string | null;
  instructions: string | null;
  fee: number;
  fee_label: string | null;
  qris_image_url: string | null;
  is_active: boolean;
};

export function PaymentsManager({ methods }: { methods: Method[] }) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [pending, startPending] = useTransition();
  const [optimisticActive, setOptimisticActive] = useState<Record<number, boolean>>({});
  const [search, setSearch] = useState("");

  const filtered = methods.filter((m) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return m.label.toLowerCase().includes(q) || m.slug.toLowerCase().includes(q) || m.type.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari metode pembayaran..."
          className="w-full max-w-md rounded-lg bg-[#0d0f12] border border-[#262b33] pl-9 pr-3 py-2 text-sm text-white placeholder:text-[#5d6570] focus:outline-none focus:border-[#ff5c2b]"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((m) => {
          const meta = TYPE_META[m.type] || { label: m.type, color: "from-[#6d7681]/20 to-[#6d7681]/5 text-[#9aa3ad] border-[#6d7681]/30" };
          const isActive = optimisticActive[m.id] ?? m.is_active;
          const isEditing = editingId === m.id;
          return (
            <section
              key={m.id}
              className={`group bg-[#171a1f] border rounded-2xl overflow-hidden transition ${isActive ? "border-[#262b33] hover:border-[#3a424e]" : "border-[#262b33]/60 opacity-70 hover:opacity-100"}`}
            >
              <div className="px-4 sm:px-5 py-3.5 border-b border-[#262b33] bg-gradient-to-r from-[#15181d] to-transparent flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${meta.color} border grid place-items-center text-xs font-extrabold`}>
                    {meta.label.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-bold text-sm truncate">{m.label}</h2>
                      <span className={`shrink-0 inline-flex items-center text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-md font-bold bg-gradient-to-r ${meta.color} border`}>
                        {meta.label}
                      </span>
                      {!isActive && (
                        <span className="shrink-0 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-md font-bold bg-[#6d7681]/15 text-[#9aa3ad] border border-[#6d7681]/30">
                          Nonaktif
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#6d7681] mt-0.5">
                      /{m.slug} · Fee {m.fee > 0 ? rupiah(m.fee) : "Gratis"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end shrink-0">
                  <span className="text-[10px] uppercase tracking-wider text-[#6d7681] font-bold">Status</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isActive}
                    disabled={pending}
                    onClick={() => {
                      const next = !isActive;
                      setOptimisticActive((s) => ({ ...s, [m.id]: next }));
                      const fd = new FormData();
                      fd.set("id", String(m.id));
                      fd.set("is_active", String(next));
                      startPending(async () => {
                        await togglePaymentMethodAction(fd);
                        setOptimisticActive((s) => {
                          const c = { ...s };
                          delete c[m.id];
                          return c;
                        });
                      });
                    }}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5c2b]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#101215] disabled:opacity-60 ${
                      isActive
                        ? "bg-gradient-to-r from-[#2fbf71] to-[#25a061] border-[#2fbf71]/50 shadow-[0_0_12px_rgba(47,191,113,0.35)]"
                        : "bg-[#1c2026] border-[#262b33] hover:border-[#3a424e]"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition duration-200 ${
                        isActive ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {isEditing ? (
                <EditMethodForm method={m} action={updatePaymentMethodAction} onDone={() => setEditingId(null)} />
              ) : (
                <div className="p-4 sm:p-5 grid lg:grid-cols-[1fr_240px] gap-5">
                  <div className="space-y-3">
                    <dl className="grid grid-cols-2 gap-3 text-xs">
                      <Field label="Label" value={m.label} />
                      <Field label="Slug" value={`/${m.slug}`} mono />
                      <Field label="Tipe" value={meta.label} />
                      <Field label="Fee" value={m.fee > 0 ? rupiah(m.fee) : "Gratis"} />
                      {m.bank_name && <Field label="Bank" value={m.bank_name} />}
                      {m.account_number && <Field label="No. Rekening" value={m.account_number} mono />}
                      {m.account_name && <Field label="Atas Nama" value={m.account_name} />}
                      {m.instructions && <Field label="Instruksi" value={m.instructions} full />}
                    </dl>
                    <div className="flex justify-end gap-2 pt-2">
                      <form
                        action={deletePaymentMethodAction}
                        onSubmit={(e) => {
                          if (!confirm(`Hapus metode pembayaran "${m.label}"? Tindakan ini tidak bisa dibatalkan.`)) e.preventDefault();
                        }}
                        className="inline"
                      >
                        <input type="hidden" name="id" value={m.id} />
                        <button
                          type="submit"
                          className="px-3 py-2 rounded-lg bg-[#1c2026] border border-[#262b33] text-xs font-bold text-[#9aa3ad] hover:border-[#ff5c5c]/50 hover:text-[#ff8a8a] transition inline-flex items-center gap-1.5"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                          Hapus
                        </button>
                      </form>
                      <button
                        type="button"
                        onClick={() => setEditingId(m.id)}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#ff5c2b] to-[#ff7a3f] text-white text-xs font-bold hover:shadow-lg hover:shadow-[#ff5c2b]/30 transition"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                  {m.type === "qris" && (
                    <QRUploader methodId={m.id} currentUrl={m.qris_image_url} methodLabel={m.label} />
                  )}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-[#171a1f] border border-[#262b33] rounded-xl p-8 text-center text-sm text-[#6d7681]">
          {search ? "Tidak ada metode yang cocok." : "Belum ada metode pembayaran."}
        </div>
      )}
    </div>
  );
}

function EditMethodForm({ method, action, onDone }: { method: Method; action: (fd: FormData) => Promise<void>; onDone: () => void }) {
  const [pending, startTransition] = useTransition();
  return (
    <form
      action={(fd) => startTransition(async () => { await action(fd); onDone(); })}
      className="p-4 sm:p-5 bg-[#0d0f12]/30"
    >
      <div className="grid sm:grid-cols-2 gap-3">
        <EditField label="Label" required>
          <input name="label" required defaultValue={method.label} className="form-input" />
        </EditField>
        <EditField label="Fee (Rp)">
          <input name="fee" type="number" min="0" defaultValue={method.fee} className="form-input" />
        </EditField>
        {(method.type === "bank_transfer" || method.type === "ewallet") && (
          <>
            {method.type === "bank_transfer" && (
              <EditField label="Nama Bank">
                <input name="bank_name" defaultValue={method.bank_name || ""} placeholder="BCA / BRI / Mandiri" className="form-input" />
              </EditField>
            )}
            <EditField label={method.type === "bank_transfer" ? "Nomor Rekening" : "Nomor Akun / HP"}>
              <input name="account_number" defaultValue={method.account_number || ""} placeholder={method.type === "bank_transfer" ? "1234567890" : "081234567890"} className="form-input font-mono" />
            </EditField>
            <EditField label="Atas Nama">
              <input name="account_name" defaultValue={method.account_name || ""} placeholder={method.type === "bank_transfer" ? "PT Axivon Digital Indonesia" : "Axivon Games"} className="form-input" />
            </EditField>
          </>
        )}
        <EditField label="Instruksi Pembayaran" full>
          <textarea name="instructions" defaultValue={method.instructions || ""} rows={3} placeholder="Scan QRIS, transfer, dll." className="form-input resize-none" />
        </EditField>
      </div>
      <div className="flex justify-end gap-2 pt-3">
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

function QRUploader({ methodId, currentUrl, methodLabel }: { methodId: number; currentUrl: string | null; methodLabel: string }) {
  const [pending, startTransition] = useTransition();
  const [preview, setPreview] = useState<string | null>(currentUrl);
  const [compressing, setCompressing] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const compressImage = (file: File, maxSize = 1024, quality = 0.85): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        let { width, height } = img;
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          } else {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas not supported"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Compression failed"));
              return;
            }
            const compressedName = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
            resolve(new File([blob], compressedName, { type: "image/jpeg" }));
          },
          "image/jpeg",
          quality,
        );
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Gagal membaca gambar"));
      };
      img.src = objectUrl;
    });
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const original = e.target.files?.[0];
    if (!original) return;
    if (original.size > 15 * 1024 * 1024) {
      alert("File terlalu besar (maks 15MB)");
      e.target.value = "";
      return;
    }
    if (!original.type.startsWith("image/")) {
      alert("File harus berupa gambar");
      e.target.value = "";
      return;
    }
    let fileToUpload = original;
    try {
      setCompressing(true);
      fileToUpload = await compressImage(original);
    } catch (err) {
      console.warn("Compress failed, upload original", err);
    } finally {
      setCompressing(false);
    }

    if (fileToUpload.size > 5 * 1024 * 1024) {
      alert("File hasil kompres masih >5MB, coba gambar lain");
      e.target.value = "";
      return;
    }

    const fd = new FormData();
    fd.set("id", String(methodId));
    fd.set("file", fileToUpload);
    startTransition(async () => {
      await uploadPaymentQRISAction(fd);
    });
  };

  return (
    <form ref={formRef} action={uploadPaymentQRISAction} encType="multipart/form-data" className="space-y-2">
      <input type="hidden" name="id" value={methodId} />
      <div className="text-[10px] font-bold uppercase tracking-wider text-[#6d7681]">QRIS Image</div>
      {preview ? (
        <div className="relative bg-white rounded-lg p-2 aspect-square flex items-center justify-center overflow-hidden border border-[#262b33]">
          <Image
            src={preview}
            alt={`QRIS ${methodLabel}`}
            width={240}
            height={240}
            className="w-full h-full object-contain"
            unoptimized
          />
        </div>
      ) : (
        <div className="bg-[#0d0f12] border-2 border-dashed border-[#262b33] rounded-lg aspect-square flex flex-col items-center justify-center text-center text-xs text-[#6d7681] p-4 gap-2">
          <svg className="w-8 h-8 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <path d="M14 14h3v3h-3zM18 18h3v3M14 18h2" />
          </svg>
          <span>Belum ada QR.<br />Upload di bawah.</span>
        </div>
      )}
      <label className="block">
        <span className="text-[10px] text-[#6d7681]">Upload gambar baru (PNG/JPG/WebP, max 5MB)</span>
        <input
          type="file"
          name="file"
          accept="image/*"
          required
          onChange={onFileChange}
          disabled={pending}
          className="mt-1 w-full text-xs text-[#9aa3ad] file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-[#1c2026] file:text-[#eef1f4] file:text-xs file:font-bold hover:file:bg-[#262b33] file:cursor-pointer disabled:opacity-50"
        />
      </label>
      {(pending || compressing) && (
        <div className="text-[10px] flex items-center gap-1.5">
          {compressing ? (
            <>
              <svg className="w-3 h-3 animate-spin text-[#5bc8ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              <span className="text-[#5bc8ff]">Mengompres gambar...</span>
            </>
          ) : (
            <>
              <svg className="w-3 h-3 animate-spin text-[#ff5c2b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              <span className="text-[#ff5c2b]">Mengupload...</span>
            </>
          )}
        </div>
      )}
    </form>
  );
}

function Field({ label, value, mono, full }: { label: string; value: string; mono?: boolean; full?: boolean }) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <dt className="text-[10px] font-bold uppercase tracking-wider text-[#6d7681]">{label}</dt>
      <dd className={`text-xs mt-1 text-white ${mono ? "font-mono" : ""}`}>{value}</dd>
    </div>
  );
}

function EditField({ label, required, full, children }: { label: string; required?: boolean; full?: boolean; children: React.ReactNode }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="text-[10px] font-bold uppercase tracking-wider text-[#6d7681]">
        {label} {required && <span className="text-[#ff5c2b]">*</span>}
      </label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

