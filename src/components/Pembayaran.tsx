export default function Pembayaran() {
  const methods = [
    { name: "QRIS", accent: true },
    { name: "GoPay" },
    { name: "OVO" },
    { name: "DANA" },
    { name: "ShopeePay" },
    { name: "BCA" },
    { name: "Mandiri" },
    { name: "BRI" },
    { name: "Alfamart" },
    { name: "Indomaret" },
    { name: "Pulsa" },
    { name: "+12 lagi", muted: true },
  ];

  return (
    <section id="bayar" className="mx-auto max-w-7xl px-4 sm:px-5 py-14 md:py-20">
      <div className="grid lg:grid-cols-[.9fr_1.1fr] gap-10 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold">Bayar pakai apa aja</h2>
          <p className="text-[#9aa3ad] mt-3">
            Lebih dari 20 metode pembayaran, semua diproses lewat payment gateway berlisensi. Nggak ada biaya tersembunyi, harga yang kamu lihat itu yang kamu bayar.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            {["Verifikasi pembayaran otomatis", "Struk digital untuk tiap transaksi", "Koneksi terenkripsi SSL"].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <svg className="w-4 h-4 text-[#2fbf71]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 12.5 4.5 4.5L19 7" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {methods.map((m) => (
            <div
              key={m.name}
              className={`bg-[#1c2026] border border-[#262b33] rounded-lg h-16 grid place-items-center font-bold text-sm ${
                m.accent ? "text-[#ff5c2b]" : m.muted ? "text-[#9aa3ad]" : ""
              }`}
            >
              {m.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
