"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Berapa lama item masuk ke akun?",
    a: "Rata-rata di bawah 30 detik setelah pembayaran terkonfirmasi. Kalau lebih dari 5 menit, hubungi CS dan akan kami cek langsung.",
  },
  {
    q: "Perlu kasih password akun game?",
    a: "Nggak pernah. Kami cuma butuh User ID dan Server ID. Jangan pernah kasih password ke siapa pun, termasuk yang ngaku CS kami.",
  },
  {
    q: "Kalau salah masukin User ID gimana?",
    a: "Sistem memvalidasi nickname sebelum bayar, jadi kesalahan jarang terjadi. Kalau tetap terlanjur, hubungi CS maksimal 1x24 jam dengan bukti transaksi.",
  },
  {
    q: "Apakah transaksinya legal dan aman?",
    a: "Ya. Semua produk berasal dari distributor resmi dan pembayaran diproses lewat payment gateway berlisensi Bank Indonesia.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 sm:px-5 py-14 md:py-20">
      <h2 className="text-3xl md:text-4xl font-extrabold">Pertanyaan yang sering ditanya</h2>
      <div className="mt-8 space-y-3">
        {faqs.map((f, i) => (
          <div key={i} className="bg-[#171a1f] border border-[#262b33] rounded-xl p-5">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between cursor-pointer font-semibold gap-4 text-left"
            >
              {f.q}
              <svg
                className={`w-4 h-4 text-[#9aa3ad] shrink-0 transition-transform duration-200 ${openIndex === i ? "rotate-180" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            {openIndex === i && <p className="mt-3 text-sm text-[#9aa3ad]">{f.a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
