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

export default function HomePage() {
  return (
    <>
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
      <CTA />
      <Footer />
    </>
  );
}
