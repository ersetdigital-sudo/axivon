import { requireStaff } from "@/lib/auth";
import { updatePaymentMethodAction, togglePaymentMethodAction } from "../actions";
import Link from "next/link";
import Image from "next/image";

const rupiah = (n: number) => "Rp" + n.toLocaleString("id-ID");

const TYPE_LABEL: Record<string, string> = {
  qris: "QRIS",
  bank_transfer: "Transfer Bank",
  ewallet: "E-Wallet",
  pulsa: "Pulsa",
};

export default async function AdminPaymentsPage({ searchParams }: { searchParams: Promise<{ msg?: string }> }) {
  const { supabase } = await requireStaff();
  const { data: methods } = await supabase
    .from("payment_methods")
    .select("*")
    .order("sort_order", { ascending: true });

  const { msg } = await searchParams;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Payment Methods</h1>
          <p className="text-sm text-[#9aa3ad] mt-1">Kelola metode pembayaran yang muncul di halaman top up & thank-you page.</p>
        </div>
        <Link href="/admin" className="text-xs font-semibold text-[#9aa3ad] hover:text-white">← Dashboard</Link>
      </div>

      {msg && (
        <div className="rounded-xl border border-[#ff5c5c]/40 bg-[#ff5c5c]/10 px-4 py-3 text-sm text-[#ffb4b4]">
          {msg}
        </div>
      )}

      <div className="space-y-4">
        {methods?.map((m: any) => (
          <PaymentMethodCard key={m.id} method={m} />
        ))}
        {(!methods || methods.length === 0) && (
          <div className="bg-[#171a1f] border border-[#262b33] rounded-xl p-8 text-center text-sm text-[#6d7681]">
            Belum ada payment method.
          </div>
        )}
      </div>
    </div>
  );
}

function PaymentMethodCard({ method }: { method: any }) {
  return (
    <section className="bg-[#171a1f] border border-[#262b33] rounded-xl overflow-hidden">
      <div className="px-4 sm:px-5 py-3 border-b border-[#262b33] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-sm">{method.label}</h2>
            <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#262b33] text-[#9aa3ad] font-bold">
              {TYPE_LABEL[method.type] || method.type}
            </span>
          </div>
          <p className="text-[11px] text-[#6d7681] mt-0.5">/{method.slug} • Fee {method.fee > 0 ? rupiah(method.fee) : "Gratis"}</p>
        </div>
        <form action={togglePaymentMethodAction}>
          <input type="hidden" name="id" value={method.id} />
          <input type="hidden" name="is_active" value={(!method.is_active).toString()} />
          <button
            type="submit"
            className={`text-xs font-semibold px-2.5 py-1.5 rounded-md border transition ${
              method.is_active ? "bg-[#2fbf71]/15 text-[#2fbf71] border-[#2fbf71]/30 hover:bg-[#2fbf71]/25" : "bg-[#6d7681]/15 text-[#9aa3ad] border-[#6d7681]/30 hover:bg-[#6d7681]/25"
            }`}
          >
            {method.is_active ? "Aktif" : "Nonaktif"}
          </button>
        </form>
      </div>

      <div className="p-4 sm:p-5 grid lg:grid-cols-[1fr_280px] gap-5">
        <form action={updatePaymentMethodAction} className="space-y-3">
          <input type="hidden" name="id" value={method.id} />

          <div>
            <label className="text-xs font-semibold text-[#9aa3ad]">Label</label>
            <input name="label" defaultValue={method.label} className="mt-1 w-full rounded-lg px-3 py-2 text-sm bg-[#12151a] border border-[#262b33] focus:outline-none focus:border-[#ff5c2b]" />
          </div>

          {method.type === "bank_transfer" && (
            <>
              <div>
                <label className="text-xs font-semibold text-[#9aa3ad]">Nama Bank</label>
                <input name="bank_name" defaultValue={method.bank_name || ""} placeholder="BCA / BRI / Mandiri" className="mt-1 w-full rounded-lg px-3 py-2 text-sm bg-[#12151a] border border-[#262b33] focus:outline-none focus:border-[#ff5c2b]" />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#9aa3ad]">Nomor Rekening</label>
                <input name="account_number" defaultValue={method.account_number || ""} placeholder="1234567890" className="mt-1 w-full rounded-lg px-3 py-2 text-sm font-mono bg-[#12151a] border border-[#262b33] focus:outline-none focus:border-[#ff5c2b]" />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#9aa3ad]">Atas Nama</label>
                <input name="account_name" defaultValue={method.account_name || ""} placeholder="PT Axivon Digital Indonesia" className="mt-1 w-full rounded-lg px-3 py-2 text-sm bg-[#12151a] border border-[#262b33] focus:outline-none focus:border-[#ff5c2b]" />
              </div>
            </>
          )}

          {method.type === "ewallet" && (
            <>
              <div>
                <label className="text-xs font-semibold text-[#9aa3ad]">Nomor Akun / HP</label>
                <input name="account_number" defaultValue={method.account_number || ""} placeholder="081234567890" className="mt-1 w-full rounded-lg px-3 py-2 text-sm font-mono bg-[#12151a] border border-[#262b33] focus:outline-none focus:border-[#ff5c2b]" />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#9aa3ad]">Atas Nama</label>
                <input name="account_name" defaultValue={method.account_name || ""} placeholder="Axivon Games" className="mt-1 w-full rounded-lg px-3 py-2 text-sm bg-[#12151a] border border-[#262b33] focus:outline-none focus:border-[#ff5c2b]" />
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-semibold text-[#9aa3ad]">WhatsApp CS (untuk konfirmasi)</label>
            <input name="whatsapp_cs" defaultValue={method.account_number || ""} placeholder="6281234567890" className="mt-1 w-full rounded-lg px-3 py-2 text-sm font-mono bg-[#12151a] border border-[#262b33] focus:outline-none focus:border-[#ff5c2b]" />
            <p className="text-[10px] text-[#6d7681] mt-1">Override nomor WhatsApp CS yang ditampilkan khusus untuk metode ini. Kosongkan untuk pakai default.</p>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#9aa3ad]">Instruksi Pembayaran</label>
            <textarea name="instructions" defaultValue={method.instructions || ""} rows={3} placeholder="Scan QRIS, transfer, dll." className="mt-1 w-full rounded-lg px-3 py-2 text-sm bg-[#12151a] border border-[#262b33] focus:outline-none focus:border-[#ff5c2b] resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#9aa3ad]">Biaya (Rp)</label>
              <input name="fee" type="number" defaultValue={method.fee} className="mt-1 w-full rounded-lg px-3 py-2 text-sm bg-[#12151a] border border-[#262b33] focus:outline-none focus:border-[#ff5c2b]" />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#9aa3ad]">Label Biaya</label>
              <input name="fee_label" defaultValue={method.fee_label || ""} placeholder="Gratis / Biaya Rp1.000" className="mt-1 w-full rounded-lg px-3 py-2 text-sm bg-[#12151a] border border-[#262b33] focus:outline-none focus:border-[#ff5c2b]" />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" className="px-4 py-2 rounded-lg bg-[#ff5c2b] text-white text-xs font-semibold hover:bg-[#ff7043] transition">
              Simpan Perubahan
            </button>
          </div>
        </form>

        {/* QRIS Upload — show for qris / ewallet with image */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-[#9aa3ad]">
            {method.type === "qris" ? "QRIS Image" : "Logo / Image (opsional)"}
          </div>
          {method.qris_image_url ? (
            <div className="bg-white rounded-lg p-2 aspect-square flex items-center justify-center overflow-hidden">
              <Image src={method.qris_image_url} alt="QRIS" width={240} height={240} className="w-full h-full object-contain" />
            </div>
          ) : (
            <div className="bg-[#12151a] border-2 border-dashed border-[#262b33] rounded-lg aspect-square flex items-center justify-center text-center text-xs text-[#6d7681] p-4">
              Belum ada gambar.<br/>Upload di bawah.
            </div>
          )}
          <form action={updatePaymentMethodAction} encType="multipart/form-data" className="space-y-2">
            <input type="hidden" name="id" value={method.id} />
            <input type="hidden" name="upload_only" value="true" />
            <label className="block">
              <span className="text-[10px] text-[#6d7681]">Upload gambar baru (PNG/JPG/WebP, max 5MB)</span>
              <input type="file" name="file" accept="image/*" required className="mt-1 w-full text-xs text-[#9aa3ad] file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-[#1c2026] file:text-[#eef1f4] file:text-xs file:font-semibold hover:file:bg-[#262b33] file:cursor-pointer" />
            </label>
            <button type="submit" className="w-full px-3 py-2 rounded-lg bg-[#1c2026] border border-[#262b33] text-xs font-semibold hover:border-[#3a424e] transition">
              Upload ke Cloudinary
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
