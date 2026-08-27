type Props = { whatsappCs?: string };

export default function CTA({ whatsappCs }: Props = {}) {
  const wa = whatsappCs || "6281234567890";
  return (
    <section id="cek" className="mx-auto max-w-7xl px-4 sm:px-5 pb-16 md:pb-20">
      <div className="bg-[#171a1f] border border-[#262b33] rounded-xl p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold">Siap top up sekarang?</h2>
          <p className="text-[#9aa3ad] mt-2">Pilih game, isi User ID, bayar. Selesai dalam hitungan detik.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href="#katalog" className="px-6 py-3 rounded-lg bg-[#ff5c2b] text-white font-semibold transition hover:bg-[#ff7043]">
            Mulai Top Up
          </a>
          <a
            href={`https://wa.me/${wa}`}
            className="px-6 py-3 rounded-lg bg-[#1c2026] border border-[#262b33] font-semibold hover:border-[#3a424e] transition inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4 text-[#2fbf71]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.5 14.1c-.2.7-1.3 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5-4.5-.2-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.3.3c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.2.4-.2.6-.1l2 .9c.2.1.4.2.4.3.1.2.1.7-.1 1.3Z" />
            </svg>
            Chat CS
          </a>
        </div>
      </div>
    </section>
  );
}
