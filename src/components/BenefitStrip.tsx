export default function BenefitStrip() {
  const benefits = [
    {
      icon: <path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12z" />,
      title: "Proses instan",
      desc: "Rata-rata <30 detik",
    },
    {
      icon: (
        <>
          <rect x="4" y="10" width="16" height="11" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </>
      ),
      title: "Tanpa login",
      desc: "Cukup User ID",
    },
    {
      icon: (
        <>
          <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z" />
          <circle cx="8" cy="8" r="1.4" />
        </>
      ),
      title: "Harga termurah",
      desc: "Distributor resmi",
    },
    {
      icon: (
        <>
          <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
          <rect x="2.5" y="14" width="4" height="6" rx="1.5" />
          <rect x="17.5" y="14" width="4" height="6" rx="1.5" />
        </>
      ),
      title: "CS 08.00–24.00",
      desc: "Balas cepat",
    },
  ];

  return (
    <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
      {benefits.map((b, i) => (
        <div key={i} className="bg-[#171a1f] border border-[#262b33] rounded-lg px-4 py-3 flex items-center gap-3">
          <svg className="w-5 h-5 shrink-0 text-[#ff5c2b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            {b.icon}
          </svg>
          <div>
            <div className="text-sm font-semibold">{b.title}</div>
            <div className="text-xs text-[#9aa3ad]">{b.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
