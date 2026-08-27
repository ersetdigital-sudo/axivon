import type { Metadata } from "next";
import Script from "next/script";
import GameTopUpPage, { type GameTopUpConfig } from "@/components/GameTopUpPage";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://axivon-psi.vercel.app";

export const dynamic = "force-dynamic";

const STATIC: Omit<GameTopUpConfig, "nominals"> = {
  slug: "/pubg-mobile",
  name: "PUBG Mobile",
  shortName: "PUBG Mobile",
  publisher: "Tencent / Level Infinite",
  heroImage: "/images/517d8ae9-25a3-412d-ac02-fda4eea809ac.png",
  heroBadge: "TOP UP",
  nominalIconColor: "text-[#ffb020]",
  notice: "Pastikan login ke akun PUBG Mobile yang benar. UC masuk otomatis setelah pembayaran sukses.",
  accountFields: [
    { id: "playerId", label: "Player ID", placeholder: "5123456789" },
  ],
  accountHelp: (
    <>Buka profil di dalam game, Player ID tertera di bawah nickname kamu. Salin tanpa spasi.</>
  ),
  ntabs: ["Harga Spesial", "UC", "Royal Pass", "Bundle", "Event"],
  payments: [
    { label: "QRIS", fee: 0, desc: "Semua e-wallet & m-banking" },
    { label: "GoPay", fee: 1000, desc: "Biaya Rp1.000" },
    { label: "Transfer BCA", fee: 2500, desc: "Biaya Rp2.500" },
  ],
  howToSteps: [
    "Buka game, masuk ke profil kamu.",
    "Salin Player ID yang tertera di bawah nickname.",
    "Pilih nominal UC yang kamu mau.",
    "Selesaikan pembayaran, UC masuk otomatis.",
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Top Up UC PUBG Mobile Murah 24 Jam | Axivon",
    description: "Top up UC PUBG Mobile paling murah, proses otomatis. Bayar via QRIS, GoPay, OVO, BCA. UC langsung masuk ke akun PUBG kamu.",
    keywords: ["top up pubg mobile", "top up UC PUBG", "UC PUBG murah", "top up PUBG 24 jam"],
    alternates: { canonical: `${SITE_URL}/pubg-mobile` },
    openGraph: {
      title: "Top Up UC PUBG Mobile Murah 24 Jam | Axivon",
      description: "Top up UC PUBG Mobile paling murah, proses otomatis 30 detik.",
      url: `${SITE_URL}/pubg-mobile`,
      type: "website",
      images: [{ url: "/images/517d8ae9-25a3-412d-ac02-fda4eea809ac.png", width: 800, height: 800, alt: "Top Up PUBG Mobile" }],
    },
  };
}

export default async function PubgMobilePage() {
  const admin = createSupabaseAdminClient();
  const [{ data: prods }] = await Promise.all([
    admin
      .from("products")
      .select("id, label, price, old_price, coins, description, badge, icon_color, sort_order")
      .eq("game_id", 2)
      .eq("is_active", true)
      .order("sort_order"),
  ]);
  const nominals = (prods || []).map((p) => ({
    id: p.id,
    label: p.label,
    price: p.price,
    oldPrice: p.old_price ?? p.price,
    desc: p.description || "",
    coins: p.coins,
    iconColor: p.icon_color || "text-[#ffb020]",
    badge: p.badge || undefined,
  }));

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/pubg-mobile#service`,
    name: "Top Up UC PUBG Mobile",
    description: "Top up UC PUBG Mobile otomatis 24 jam. Pilih nominal, bayar via QRIS/e-wallet, UC langsung masuk ke akun PUBG kamu.",
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
      { "@type": "ListItem", position: 2, name: "PUBG Mobile", item: `${SITE_URL}/pubg-mobile` },
    ],
  };

  return (
    <>
      <Script id="ld-product-pubg" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <Script id="ld-breadcrumb-pubg" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <GameTopUpPage config={{ ...STATIC, nominals }} iconKind="uc" />
    </>
  );
}
