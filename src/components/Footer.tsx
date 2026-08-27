import Image from "next/image";
import Link from "next/link";

type Props = { whatsappCs?: string };

export default function Footer({ whatsappCs }: Props = {}) {
  const wa = whatsappCs || "6281234567890";
  return (
    <footer className="border-t border-[#262b33] bg-[#0d0f12]">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <Image
              src="/images/0be83e1b-d666-4f18-bfdb-6da348303545.svg"
              alt="Axivon Games"
              width={96}
              height={96}
              className="h-24 w-auto -my-6"
            />
          </div>
          <p className="mt-4 text-sm text-[#9aa3ad] max-w-sm">
            Platform top up game dan voucher digital. Murah, legal, dan otomatis 24 jam.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-sm">Produk</h3>
          <ul className="mt-3 space-y-2 text-sm text-[#9aa3ad]">
            <li><Link href="#katalog" className="hover:text-white transition">Mobile Legends</Link></li>
            <li><Link href="#katalog" className="hover:text-white transition">PUBG Mobile</Link></li>
            <li><Link href="#katalog" className="hover:text-white transition">Free Fire</Link></li>
            <li><Link href="#katalog" className="hover:text-white transition">Genshin Impact</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-sm">Bantuan</h3>
          <ul className="mt-3 space-y-2 text-sm text-[#9aa3ad]">
            <li><Link href="#faq" className="hover:text-white transition">FAQ</Link></li>
            <li><Link href="#cara" className="hover:text-white transition">Cara Top Up</Link></li>
            <li><a href="mailto:halo@axivongames.net" className="hover:text-white transition">halo@axivongames.net</a></li>
            <li><a href={`https://wa.me/${wa}`} className="hover:text-white transition">WhatsApp CS</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[#262b33]">
        <div className="mx-auto max-w-7xl px-4 sm:px-5 py-5 text-xs text-[#6d7681] flex flex-wrap gap-2 justify-between">
          <span>© 2026 Axivon Games. Semua merek game adalah milik pemiliknya masing-masing.</span>
          <span>Syarat & Ketentuan · Kebijakan Privasi</span>
        </div>
      </div>
    </footer>
  );
}
