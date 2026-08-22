export default function CaraTopUp() {
  const steps = [
    {
      icon: (
        <>
          <rect x="3" y="4" width="18" height="14" rx="2" />
          <path d="M9 9h6M9 13h3" />
        </>
      ),
      num: "LANGKAH 01",
      title: "Pilih game",
      desc: "Cari game favoritmu di katalog atau kolom pencarian.",
    },
    {
      icon: (
        <>
          <circle cx="12" cy="8" r="3.4" />
          <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
        </>
      ),
      num: "LANGKAH 02",
      title: "Isi User ID",
      desc: "Masukkan ID & server. Nggak perlu password, aman.",
    },
    {
      icon: (
        <>
          <rect x="2.5" y="5" width="19" height="14" rx="2" />
          <path d="M2.5 10h19M6 15h4" />
        </>
      ),
      num: "LANGKAH 03",
      title: "Bayar",
      desc: "QRIS, e-wallet, transfer bank, atau pulsa. Bebas.",
    },
    {
      icon: (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="m8 12.5 2.6 2.6L16 9.8" />
        </>
      ),
      num: "LANGKAH 04",
      title: "Langsung masuk",
      desc: "Item masuk otomatis dalam hitungan detik. Gas main.",
    },
  ];

  return (
    <section id="cara" className="border-y border-[#262b33] bg-[#0d0f12]">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 py-14 md:py-20">
        <h2 className="text-3xl md:text-4xl font-extrabold">Cara top up-nya gampang</h2>
        <p className="text-[#9aa3ad] mt-2">Empat langkah, nggak sampai satu menit.</p>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s, i) => (
            <div key={i} className="bg-[#171a1f] border border-[#262b33] rounded-xl p-6">
              <svg className="w-6 h-6 text-[#ff5c2b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                {s.icon}
              </svg>
              <div className="mt-4 text-xs font-semibold text-[#9aa3ad] tracking-widest">{s.num}</div>
              <h3 className="mt-1 font-bold text-lg">{s.title}</h3>
              <p className="text-sm text-[#9aa3ad] mt-2">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
