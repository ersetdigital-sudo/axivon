import type { Metadata } from "next";
import Script from "next/script";
import GameTopUpPage, { type GameTopUpConfig } from "@/components/GameTopUpPage";
import { loadActivePaymentMethods } from "@/lib/game-payment-loader";
import { getSiteSettings } from "@/lib/site-settings";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://axivongames.net";

export const dynamic = "force-dynamic";

const STATIC: Omit<GameTopUpConfig, "nominals" | "payments" | "whatsappCs"> = {
  slug: "/genshin-impact",
  name: "Genshin Impact",
  shortName: "Genshin Impact",
  publisher: "HoYoverse",
  heroImage: "/images/dd9c2680-f65c-41a5-a7f9-6e9338c893e7.png",
  heroBadge: "TOP UP",
  nominalIconColor: "text-[#5bc8ff]",
  notice: "Top up via UID Genshin Impact. Server Asia bisa pakai semua region. Genesis Crystal masuk otomatis.",
  accountFields: [
    { id: "uid", label: "UID", placeholder: "800000000" },
    { id: "server", label: "Server", placeholder: "Asia" },
  ],
  accountHelp: (
    <>Buka game, tap Paimon Menu kiri atas. UID tertera di pojok kanan bawah. Server: Asia / America / Europe / TW / SAR.</>
  ),
  ntabs: ["Promo", "Genesis Crystal", "Blessing", "Bundle", "Event"],

  howToSteps: [
    "Buka Genshin Impact, masuk ke Paimon Menu.",
    "Salin UID di pojok kanan bawah profil kamu.",
    "Pilih server (Asia/America/Europe/dst).",
    "Pilih nominal Genesis Crystal & bayar.",
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Top Up Genesis Crystal Genshin Impact Murah 24 Jam | Axivon",
    description: "Top up Genesis Crystal Genshin Impact otomatis. Bayar via QRIS, GoPay, BCA. Genesis Crystal langsung masuk ke akun kamu.",
    keywords: ["top up genshin impact", "genesis crystal murah", "welkin moon murah"],
    alternates: { canonical: `${SITE_URL}/genshin-impact` },
    openGraph: {
      title: "Top Up Genesis Crystal Genshin Impact Murah 24 Jam | Axivon",
      description: "Top up Genesis Crystal otomatis 30 detik.",
      url: `${SITE_URL}/genshin-impact`,
      type: "website",
      images: [{ url: "/images/dd9c2680-f65c-41a5-a7f9-6e9338c893e7.png", width: 800, height: 800, alt: "Top Up Genshin Impact" }],
    },
  };
}

export default async function GenshinImpactPage() {
  const admin = createSupabaseAdminClient();
  const [{ data: prods }, payments, settings] = await Promise.all([
    admin
      .from("products")
      .select("id, label, price, old_price, coins, description, badge, icon_color, sort_order")
      .eq("game_id", 6)
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
    "@id": `${SITE_URL}/genshin-impact#service`,
    name: "Top Up Genesis Crystal Genshin Impact",
    description: "Top up Genesis Crystal otomatis 24 jam.",
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
      { "@type": "ListItem", position: 2, name: "Genshin Impact", item: `${SITE_URL}/genshin-impact` },
    ],
  };

  return (
    <>
      <Script id="ld-product-gi" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <Script id="ld-breadcrumb-gi" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <GameTopUpPage config={{ ...STATIC, nominals, payments, whatsappCs: settings.whatsapp_cs }} iconKind="crystal" />
    </>
  );
}
