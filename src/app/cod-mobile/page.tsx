import type { Metadata } from "next";
import Script from "next/script";
import GameTopUpPage, { type GameTopUpConfig } from "@/components/GameTopUpPage";
import { loadActivePaymentMethods } from "@/lib/game-payment-loader";
import { getSiteSettings } from "@/lib/site-settings";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://axivon-psi.vercel.app";

export const dynamic = "force-dynamic";

const STATIC: Omit<GameTopUpConfig, "nominals" | "payments" | "whatsappCs"> = {
  slug: "/cod-mobile",
  name: "Call of Duty: Mobile",
  shortName: "COD Mobile",
  publisher: "Activision / Garena",
  heroImage: "/images/bae33449-55c9-489e-b7de-16530bdaca12.png",
  heroBadge: "TOP UP",
  nominalIconColor: "text-[#ff5c2b]",
  notice: "Top up via Activision ID. CP akan masuk otomatis ke akun kamu setelah bayar.",
  accountFields: [
    { id: "playerId", label: "Activision ID", placeholder: "Player#1234567" },
  ],
  accountHelp: (
    <>Buka profil dalam game, salin Activision ID. Format: <span className="text-[#eef1f4]">Nama#Tag Angka</span>.</>
  ),
  ntabs: ["Promo", "CP", "Battle Pass", "Bundle", "Event"],

  howToSteps: [
    "Buka COD Mobile, masuk ke profil dalam game.",
    "Salin Activision ID (format Nama#Tag).",
    "Pilih nominal CP yang kamu mau.",
    "Bayar, CP masuk otomatis ke akun.",
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Top Up CP COD Mobile Murah 24 Jam | Axivon",
    description: "Top up CP Call of Duty Mobile otomatis. Bayar via QRIS, DANA, BCA. CP langsung masuk ke akun COD Mobile kamu.",
    keywords: ["top up cod mobile", "top up CP COD", "CODM CP murah"],
    alternates: { canonical: `${SITE_URL}/cod-mobile` },
    openGraph: {
      title: "Top Up CP COD Mobile Murah 24 Jam | Axivon",
      description: "Top up CP COD Mobile otomatis 30 detik.",
      url: `${SITE_URL}/cod-mobile`,
      type: "website",
      images: [{ url: "/images/bae33449-55c9-489e-b7de-16530bdaca12.png", width: 800, height: 800, alt: "Top Up COD Mobile" }],
    },
  };
}

export default async function CodMobilePage() {
  const admin = createSupabaseAdminClient();
  const [{ data: prods }, payments, settings] = await Promise.all([
    admin
      .from("products")
      .select("id, label, price, old_price, coins, description, badge, icon_color, sort_order")
      .eq("game_id", 5)
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
    iconColor: p.icon_color || "text-[#ff5c2b]",
    badge: p.badge || undefined,
  }));

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/cod-mobile#service`,
    name: "Top Up CP COD Mobile",
    description: "Top up CP Call of Duty Mobile otomatis 24 jam.",
    provider: { "@id": `${SITE_URL}/#organization` },
    serviceType: "Digital Top-Up",
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
      { "@type": "ListItem", position: 2, name: "COD Mobile", item: `${SITE_URL}/cod-mobile` },
    ],
  };

  return (
    <>
      <Script id="ld-product-cod" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <Script id="ld-breadcrumb-cod" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <GameTopUpPage config={{ ...STATIC, nominals, payments, whatsappCs: settings.whatsapp_cs }} iconKind="coin" />
    </>
  );
}
