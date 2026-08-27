import type { Metadata } from "next";
import Script from "next/script";
import GameTopUpPage, { type GameTopUpConfig } from "@/components/GameTopUpPage";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { loadActivePaymentMethods } from "@/lib/game-payment-loader";
import { getSiteSettings } from "@/lib/site-settings";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://axivon-psi.vercel.app";

export const dynamic = "force-dynamic";

const STATIC: Omit<GameTopUpConfig, "nominals" | "payments" | "whatsappCs"> = {
  slug: "/mobile-legends",
  name: "Mobile Legends: Bang Bang",
  shortName: "Mobile Legends",
  publisher: "Moonton",
  heroImage: "/images/8f47dd26-4142-498f-a61c-14f17dc5cd18.png",
  heroBadge: "TOP UP",
  nominalIconColor: "text-[#5bc8ff]",
  notice: "Akun harus region Indonesia. Weekly Diamond Pass maksimal 10x dalam 70 hari.",
  accountFields: [
    { id: "uid", label: "User ID", placeholder: "1234567" },
    { id: "zid", label: "Zone ID", placeholder: "1234" },
  ],
  accountHelp: (
    <>
      Buka game, tap avatar di kiri atas. User ID dan Zone ID ada di bawah nama kamu, contoh{" "}
      <span className="text-[#eef1f4]">1234567 (1234)</span>.
    </>
  ),
  ntabs: ["Harga Spesial", "MLBB Pass", "Elite Bundle", "Event", "Diamonds"],
  howToSteps: [
    "Masukkan User ID dan Zone ID kamu.",
    "Contoh: 1234567 (1234).",
    "Pilih nominal diamond yang kamu mau.",
    "Pilih metode pembayaran, lalu bayar.",
    "Diamond masuk otomatis ke akunmu.",
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Top Up Mobile Legends (MLBB) Diamond Murah 24 Jam",
    description: "Top up diamond Mobile Legends paling murah, proses otomatis 30 detik. Bayar via QRIS, DANA, GoPay, OVO, BCA. Login & diamond langsung masuk ke akun ML kamu.",
    keywords: [
      "top up mobile legends",
      "top up diamond ML",
      "top up MLBB",
      "ML diamond murah",
      "top up ML 24 jam",
    ],
    alternates: { canonical: `${SITE_URL}/mobile-legends` },
    openGraph: {
      title: "Top Up Mobile Legends Diamond Murah 24 Jam | Axivon",
      description: "Top up diamond ML paling murah, proses otomatis 30 detik. Bayar via QRIS, DANA, GoPay, OVO, BCA.",
      url: `${SITE_URL}/mobile-legends`,
      type: "website",
      images: [{ url: "/images/8f47dd26-4142-498f-a61c-14f17dc5cd18.png", width: 800, height: 800, alt: "Top Up Mobile Legends" }],
    },
  };
}

export default async function MobileLegendsPage() {
  const admin = createSupabaseAdminClient();
  const [{ data: prods }, payments, settings] = await Promise.all([
    admin
      .from("products")
      .select("id, label, price, old_price, coins, description, badge, icon_color, sort_order")
      .eq("game_id", 1)
      .eq("is_active", true)
      .order("sort_order"),
    loadActivePaymentMethods(),
    getSiteSettings(),
  ]);
  const nominals = (prods || []).map((p) => ({
    id: p.id,
    label: p.label,
    price: p.price,
    oldPrice: p.old_price ?? p.price,
    desc: p.description || "",
    coins: p.coins,
    iconColor: p.icon_color || "text-[#5bc8ff]",
    badge: p.badge || undefined,
  }));

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/mobile-legends#service`,
    name: "Top Up Mobile Legends Diamond",
    description: "Top up diamond Mobile Legends: Bang Bang otomatis 24 jam. Pilih nominal, bayar via QRIS/DANA/e-wallet, diamond langsung masuk ke akun ML kamu.",
    provider: { "@id": `${SITE_URL}/#organization` },
    serviceType: "Digital Top-Up",
    areaServed: { "@type": "Country", name: "Indonesia" },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "IDR",
      lowPrice: nominals.length ? Math.min(...nominals.map((n) => n.price)) : 0,
      highPrice: nominals.length ? Math.max(...nominals.map((n) => n.price)) : 0,
      offerCount: nominals.length,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Beranda", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Mobile Legends", item: `${SITE_URL}/mobile-legends` },
    ],
  };

  return (
    <>
      <Script
        id="ld-product-ml"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <Script
        id="ld-breadcrumb-ml"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <GameTopUpPage config={{ ...STATIC, nominals, payments, whatsappCs: settings.whatsapp_cs }} />
    </>
  );
}
