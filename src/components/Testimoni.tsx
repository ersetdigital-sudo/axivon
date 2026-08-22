const StarIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="m12 3 2.6 5.6 6.1.8-4.5 4.2 1.2 6.1L12 16.8 6.6 19.7l1.2-6.1L3.3 9.4l6.1-.8z" />
  </svg>
);

const testimonials = [
  {
    stars: 5,
    text: '"Diamond ML masuk belum sampai 20 detik. Udah langganan 3 bulan, nggak pernah gagal sekalipun."',
    name: "Rizky A.",
    city: "Bandung",
    initials: "RA",
  },
  {
    stars: 5,
    text: '"Harga UC PUBG paling murah yang pernah aku temuin, dan bisa bayar pakai QRIS. Mantap."',
    name: "Dea P.",
    city: "Surabaya",
    initials: "DP",
  },
  {
    stars: 4,
    text: '"Sempat salah isi ID, CS-nya bales cepat dan dibantu sampai beres. Servicenya niat."',
    name: "Bagas W.",
    city: "Semarang",
    initials: "BW",
  },
];

export default function Testimoni() {
  return (
    <section className="border-y border-[#262b33] bg-[#0d0f12]">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 py-14 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl md:text-4xl font-extrabold">Kata para pelanggan</h2>
          <div className="flex items-center gap-2">
            <span className="flex gap-0.5 text-[#ffb020]">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} />
              ))}
            </span>
            <span className="text-sm text-[#9aa3ad]">4,9 dari 18.402 ulasan</span>
          </div>
        </div>
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <figure key={t.name} className="bg-[#171a1f] border border-[#262b33] rounded-xl p-6">
              <span className="flex gap-0.5 text-[#ffb020]">
                {[...Array(t.stars)].map((_, i) => (
                  <StarIcon key={i} />
                ))}
                {t.stars < 5 &&
                  [...Array(5 - t.stars)].map((_, i) => (
                    <svg key={`empty-${i}`} className="w-4 h-4 text-[#3a424e]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="m12 3 2.6 5.6 6.1.8-4.5 4.2 1.2 6.1L12 16.8 6.6 19.7l1.2-6.1L3.3 9.4l6.1-.8z" />
                    </svg>
                  ))}
              </span>
              <blockquote className="mt-3 text-[15px] leading-relaxed">{t.text}</blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-[#262b33] grid place-items-center font-bold text-sm">{t.initials}</span>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-[#9aa3ad]">{t.city}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
