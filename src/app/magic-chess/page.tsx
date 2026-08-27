import type { Metadata } from "next";
import Script from "next/script";
import GameTopUpPage, { type GameTopUpConfig } from "@/components/GameTopUpPage";
import { loadActivePaymentMethods } from "@/lib/game-payment-loader";
import { getSiteSettings } from "@/lib/site-settings";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://axivon-psi.vercel.app";

export const dynamic = "force-dynamic";

const STATIC: Omit<GameTopUpConfig, "nominals" | "payments" | "whatsappCs"> = {
  slug: "/magic-chess",
  name: "Magic Chess: Go Go",
  shortName: "Magic Chess",
  publisher: "Moonton",
  heroImage: "/images/9d357c22-da08-4270-9750-efeb7890bc0e.png",
  heroBadge: "TOP UP",
  nominalIconColor: "text-[#2fbf71]",
  notice: "Pakai akun Moonton yang sama dengan Mobile Legends kamu. Diamond langsung masuk instan.",
  accountFields: [
    { id: "uid", label: "User ID", placeholder: "1234567" },
    { id: "zid", label: "Zone ID", placeholder: "1234" },
  ],
  accountHelp: (
    <>Sama dengan akun Mobile Legends. Buka game, tap avatar kiri atas, lihat User ID & Zone ID, contoh <span className="text-[#eef1f4]">1234567 (1234)</span>.</>
  ),
  ntabs: ["Promo", "Diamond", "Magic Pass", "Bundle", "Event"],

  howToSteps: [
    "Buka Magic Chess, login pakai akun Moonton.",
    "Tap avatar kiri atas, salin User ID & Zone ID.",
    "Pilih nominal diamond favoritmu.",
    "Selesaikan pembayaran, diamond masuk otomatis.",
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Top Up Diamond Magic Chess Go Go Murah 24 Jam | Axivon",
    description: "Top up diamond Magic Chess: Go Go otomatis 30 detik. Bayar via QRIS, GoPay, BCA. Diamond langsung masuk ke akun Moonton kamu.",
    keywords: ["top up magic chess", "top up diamond magic chess", "MCGG diamond murah"],
    alternates: { canonical: `${SITE_URL}/magic-chess` },
    openGraph: {
      title: "Top Up Diamond Magic Chess Murah 24 Jam | Axivon",
      description: "Top up diamond Magic Chess otomatis 30 detik.",
      url: `${SITE_URL}/magic-chess`,
      type: "website",
      images: [{ url: "/images/9d357c22-da08-4270-9750-efeb7890bc0e.png", width: 800, height: 800, alt: "Top Up Magic Chess" }],
    },
  };
}

export default async function MagicChessPage() {
  const admin = createSupabaseAdminClient();
  const [{ data: prods }, payments, settings] = await Promise.all([
    admin
      .from("products")
      .select("id, label, price, old_price, coins, description, badge, icon_color, sort_order")
      .eq("game_id", 4)
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
    iconColor: p.icon_color || "text-[#2fbf71]",
    badge: p.badge || undefined,
  }));

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/magic-chess#service`,
    name: "Top Up Diamond Magic Chess",
    description: "Top up diamond Magic Chess otomatis 24 jam.",
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
      { "@type": "ListItem", position: 2, name: "Magic Chess", item: `${SITE_URL}/magic-chess` },
    ],
  };

  return (
    <>
      <Script id="ld-product-mc" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <Script id="ld-breadcrumb-mc" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <GameTopUpPage config={{ ...STATIC, nominals, payments, whatsappCs: settings.whatsapp_cs }} iconKind="diamond" />
    </>
  );
}
