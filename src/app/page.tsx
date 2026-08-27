import type { Metadata } from "next";
import Script from "next/script";
import { getSiteSettings } from "@/lib/site-settings";
import Header from "@/components/Header";
import BannerCarousel from "@/components/BannerCarousel";
import BenefitStrip from "@/components/BenefitStrip";
import GameCatalog from "@/components/GameCatalog";
import CaraTopUp from "@/components/CaraTopUp";
import Pembayaran from "@/components/Pembayaran";
import Testimoni from "@/components/Testimoni";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://axivon-psi.vercel.app";

export const metadata: Metadata = {
  alternates: { canonical: SITE_URL },
  openGraph: {
    url: SITE_URL,
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Apa itu Axivon Games?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Axivon Games adalah platform top up game online termurah dan tercepat di Indonesia. Kami melayani top up Mobile Legends, PUBG Mobile, Free Fire, Genshin Impact, Magic Chess, dan Call of Duty Mobile 24 jam otomatis.",
      },
    },
    {
      "@type": "Question",
      name: "Berapa lama proses top up?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Setelah pembayaran berhasil, item akan masuk ke akun game kamu dalam waktu kurang dari 30 detik. Proses otomatis 24 jam nonstop.",
      },
    },
    {
      "@type": "Question",
      name: "Metode pembayaran apa saja yang didukung?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Kami mendukung QRIS (semua e-wallet & m-banking), DANA, GoPay, OVO, ShopeePay, transfer bank BCA, BRI, dan Mandiri. Semua transaksi diproses otomatis.",
      },
    },
    {
      "@type": "Question",
      name: "Apakah aman bertransaksi di Axivon?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Aman. Kami hanya meminta User ID / Player ID, bukan password akun game kamu. Sistem pembayaran menggunakan payment gateway terenkripsi SSL.",
      },
    },
    {
      "@type": "Question",
      name: "Bagaimana cara top up di Axivon?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pilih game, masukkan User ID, pilih nominal diamond/UC/CP, pilih metode pembayaran, bayar. Item otomatis masuk ke akun kamu.",
      },
    },
  ],
};

export default async function HomePage() {
  const settings = await getSiteSettings();
  return (
    <>
      <Script
        id="ld-faq"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Header />

      <section className="mx-auto max-w-7xl px-4 sm:px-5 pt-5">
        <BannerCarousel />
        <BenefitStrip />
      </section>

      <GameCatalog />
      <CaraTopUp />
      <Pembayaran />
      <Testimoni />
      <FAQ />
      <CTA whatsappCs={settings.whatsapp_cs} />
      <Footer whatsappCs={settings.whatsapp_cs} />
    </>
  );
}
