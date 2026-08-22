import type { Metadata } from "next";
import localFont from "next/font/local";
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

export const metadata: Metadata = {
  title: "Axivon Games — Top Up Game & Voucher Digital Murah",
  description:
    "Top up diamond, UC, dan voucher game favoritmu dalam 30 detik. Harga murah, proses otomatis 24 jam, dijamin aman.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${plusJakarta.variable} ${bricolage.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
