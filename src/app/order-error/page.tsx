import Link from "next/link";
import Header from "@/components/Header";

export default async function OrderErrorPage({ searchParams }: { searchParams: Promise<{ msg?: string }> }) {
  const { msg } = await searchParams;
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 sm:px-5 py-16 text-center">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ff5c5c] to-[#ff8a8a] grid place-items-center shadow-lg shadow-[#ff5c5c]/30">
          <svg className="w-9 h-9 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </div>
        <h1 className="mt-5 text-2xl md:text-3xl font-extrabold">Gagal Membuat Order</h1>
        <p className="text-sm text-[#9aa3ad] mt-2">{msg || "Terjadi kesalahan. Silakan coba lagi."}</p>
        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          <Link href="/" className="px-5 py-2.5 rounded-lg bg-[#1c2026] border border-[#262b33] text-sm font-semibold hover:border-[#3a424e] transition">
            ← Beranda
          </Link>
          <Link href="/mobile-legends" className="px-5 py-2.5 rounded-lg bg-[#ff5c2b] text-white text-sm font-semibold hover:bg-[#ff7043] transition">
            Coba Lagi
          </Link>
        </div>
      </main>
    </>
  );
}
