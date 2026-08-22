"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const slides = [
  {
    img: "/images/637b4030-9528-4526-9db2-b75ed167bf19.png",
    alt: "Promo Mobile Legends",
    badge: "EVENT SPESIAL",
    badgeClass: "bg-[#ff5c2b] text-white",
    title: "Diskon 12% Diamond\nMobile Legends",
    desc: "Berlaku untuk semua nominal. Kuota harian terbatas.",
    cta: "Top Up Sekarang",
    ctaClass: "bg-[#ff5c2b] text-white hover:bg-[#ff7043]",
    href: "#katalog",
  },
  {
    img: "/images/8d60523f-cf25-45b3-b06d-b564818fea66.png",
    alt: "Promo cashback",
    badge: "CASHBACK",
    badgeClass: "bg-[#ffb020] text-[#101215]",
    title: "Cashback 5% Tiap\nTransaksi QRIS",
    desc: "Saldo koin langsung masuk, bisa dipakai belanja lagi.",
    cta: "Lihat Caranya",
    ctaClass: "bg-[#eef1f4] text-[#101215] hover:bg-white",
    href: "#bayar",
  },
  {
    img: "/images/a27e64a1-d596-42aa-987d-b946ec6e88fb.png",
    alt: "Promo battle royale",
    badge: "SEASON BARU",
    badgeClass: "bg-[#2fbf71] text-[#101215]",
    title: "UC & Diamond BR\nHarga Termurah",
    desc: "PUBG Mobile, Free Fire, dan COD Mobile proses instan.",
    cta: "Pilih Game",
    ctaClass: "bg-[#ff5c2b] text-white hover:bg-[#ff7043]",
    href: "#katalog",
  },
];

export default function BannerCarousel() {
  return (
    <Swiper
      modules={[Pagination, Autoplay]}
      loop
      autoplay={{ delay: 4500, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      className="rounded-xl overflow-hidden border border-[#262b33]"
    >
      {slides.map((s, i) => (
        <SwiperSlide key={i} className="relative">
          <Image
            src={s.img}
            alt={s.alt}
            width={1200}
            height={340}
            className="w-full h-[220px] sm:h-[300px] md:h-[340px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#101215] via-[#101215]/75 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="px-6 sm:px-10 max-w-lg">
              <span className={`inline-block text-[11px] font-bold tracking-wide px-2.5 py-1 rounded ${s.badgeClass}`}>
                {s.badge}
              </span>
              <h2 className="mt-3 text-2xl sm:text-4xl font-extrabold leading-tight whitespace-pre-line">
                {s.title}
              </h2>
              <p className="mt-2 text-sm text-[#9aa3ad] hidden sm:block">{s.desc}</p>
              <a
                href={s.href}
                className={`mt-4 inline-flex px-5 py-2.5 rounded-lg text-sm font-semibold transition ${s.ctaClass}`}
              >
                {s.cta}
              </a>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
