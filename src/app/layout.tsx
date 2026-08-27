import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";

const plusJakarta = localFont({
  src: [
    { path: "../../public/fonts/plusjakartasans-regular.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/plusjakartasans-medium.ttf", weight: "500", style: "normal" },
    { path: "../../public/fonts/plusjakartasans-semibold.ttf", weight: "600", style: "normal" },
    { path: "../../public/fonts/plusjakartasans-bold.ttf", weight: "700", style: "normal" },
    { path: "../../public/fonts/plusjakartasans-extrabold.ttf", weight: "800", style: "normal" },
  ],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const bricolage = localFont({
  src: [
    { path: "../../public/fonts/bricolagegrotesque-opsz-wdth-wght--semibold.ttf", weight: "600", style: "normal" },
    { path: "../../public/fonts/bricolagegrotesque-opsz-wdth-wght--bold.ttf", weight: "700", style: "normal" },
    { path: "../../public/fonts/bricolagegrotesque-opsz-wdth-wght--extrabold.ttf", weight: "800", style: "normal" },
  ],
  variable: "--font-bricolage",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://axivongames.net";
const SITE_NAME = "Axivon Games";
const SITE_DESC = "Top up diamond, UC, dan voucher game favoritmu dalam 30 detik. Harga murah, proses otomatis 24 jam, dijamin aman.";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#101215" },
    { media: "(prefers-color-scheme: light)", color: "#ff5c2b" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Top Up Game & Voucher Digital Murah 24 Jam`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESC,
  applicationName: SITE_NAME,
  keywords: [
    "top up mobile legends",
    "top up ML murah",
    "top up diamond ML",
    "top up PUBG Mobile",
    "top up UC PUBG",
    "top up Free Fire diamond",
    "top up Genshin Impact",
    "top up Magic Chess",
    "top up COD Mobile",
    "voucher game",
    "top up game online",
    "top up 24 jam",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Top Up Game & Voucher Digital Murah 24 Jam`,
    description: SITE_DESC,
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Top Up Game Termurah 24 Jam`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Top Up Game Termurah 24 Jam`,
    description: SITE_DESC,
    images: [`${SITE_URL}/og-image.png`],
    creator: "@axivongames",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "Gaming",
  classification: "Digital Top-Up Service",
  other: {
    "geo.region": "ID",
    "geo.placename": "Indonesia",
    "geo.position": "-6.2088;106.8456",
    "ICBM": "-6.2088, 106.8456",
    "distribution": "global",
    "revisit-after": "1 day",
    "rating": "general",
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: "Axivon",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/icon`,
    width: 512,
    height: 512,
  },
  description: SITE_DESC,
  foundingDate: "2026",
  areaServed: [
    { "@type": "Country", name: "Indonesia" },
    { "@type": "Country", name: "Malaysia" },
    { "@type": "Country", name: "Singapore" },
  ],
  knowsLanguage: ["id-ID", "en-US"],
  sameAs: [
    "https://www.facebook.com/profile.php?id=100063789148158",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: `${SITE_URL}/`,
      availableLanguage: ["Indonesian", "English"],
    },
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  description: SITE_DESC,
  inLanguage: "id-ID",
  publisher: { "@id": `${SITE_URL}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id-ID" className={`${plusJakarta.variable} ${bricolage.variable} antialiased`}>
      <head>
        <link rel="icon" href="/icon" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-icon" type="image/png" sizes="180x180" />
        <Script
          id="ld-org"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <Script
          id="ld-website"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
