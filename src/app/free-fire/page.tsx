import type { Metadata } from "next";
import Script from "next/script";
import GameTopUpPage, { type GameTopUpConfig } from "@/components/GameTopUpPage";
import { loadActivePaymentMethods } from "@/lib/game-payment-loader";
import { getSiteSettings } from "@/lib/site-settings";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://axivongames.net";

export const dynamic = "force-dynamic";

const STATIC: Omit<GameTopUpConfig, "nominals" | "payments" | "whatsappCs"> = {
  slug: "/free-fire",
  name: "Free Fire",
  shortName: "Free Fire",
  publisher: "Garena",
  heroImage: "/images/068b552d-43d8-45eb-8ea5-420aac595ef2.png",
  heroBadge: "TOP UP",
  nominalIconColor: "text-[#ff5c2b]",
  notice: "Top up via Login Google/Facebook. Diamond masuk instan setelah pembayaran sukses.",
  accountFields: [
    { id: "playerId", label: "Free Fire ID", placeholder: "123456789" },
  ],
  accountHelp: (
    <>Buka profil di dalam game, ID terlihat di samping avatar kamu. Contoh: <span className="text-[#eef1f4]">123456789</span>.</>
  ),
  ntabs: ["Promo", "Diamond", "Membership", "Bundle", "Event"],
  howToSteps: [
    "Login ke akun Free Fire kamu (Google/Facebook/VK).",
    "Salin Free Fire ID dari profil dalam game.",
    "Pilih nominal diamond yang kamu mau.",
    "Bayar, diamond masuk otomatis ke akun.",
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Top Up Diamond Free Fire Murah 24 Jam | Axivon",
    description: "Top up diamond Free Fire paling murah, proses otomatis 30 detik. Bayar via QRIS, DANA, OVO. Diamond langsung masuk ke akun FF kamu.",
    keywords: ["top up free fire", "top up diamond FF", "FF diamond murah"],
    alternates: { canonical: `${SITE_URL}/free-fire` },
    openGraph: {
      title: "Top Up Diamond Free Fire Murah 24 Jam | Axivon",
      description: "Top up diamond Free Fire paling murah, proses otomatis.",
      url: `${SITE_URL}/free-fire`,
      type: "website",
      images: [{ url: "/images/068b552d-43d8-45eb-8ea5-420aac595ef2.png", width: 800, height: 800, alt: "Top Up Free Fire" }],
    },
  };
}

export default async function FreeFirePage() {
  const admin = createSupabaseAdminClient();
  const [{ data: prods }, payments, settings] = await Promise.all([
    admin
      .from("products")
      .select("id, label, price, old_price, coins, description, badge, icon_color, sort_order")
      .eq("game_id", 3)
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
    "@id": `${SITE_URL}/free-fire#service`,
    name: "Top Up Diamond Free Fire",
    description: "Top up diamond Free Fire otomatis 24 jam.",
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
      { "@type": "ListItem", position: 2, name: "Free Fire", item: `${SITE_URL}/free-fire` },
    ],
  };

  return (
    <>
      <Script id="ld-product-ff" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <Script id="ld-breadcrumb-ff" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <GameTopUpPage config={{ ...STATIC, nominals, payments, whatsappCs: settings.whatsapp_cs }} iconKind="diamond" />
    </>
  );
}
