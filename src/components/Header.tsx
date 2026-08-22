"use client";

import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[#101215]/95 backdrop-blur border-b border-[#262b33]">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 h-16 flex items-center gap-3 sm:gap-4">
        <Link href="/" className="shrink-0">
          <Image
            src="/images/0be83e1b-d666-4f18-bfdb-6da348303545.svg"
            alt="Axivon Games"
            width={96}
            height={96}
            className="h-14 sm:h-24 w-auto -my-2 sm:-my-6"
          />
        </Link>
        <div className="flex flex-1 min-w-0 items-center gap-2 bg-[#1c2026] border border-[#262b33] rounded-lg px-3 py-2 max-w-md ml-auto">
          <svg className="w-4 h-4 text-[#9aa3ad] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.2-3.2" />
          </svg>
          <input
            type="text"
            placeholder="Cari game atau voucher…"
            className="w-full min-w-0 bg-transparent outline-none text-sm placeholder:text-[#6d7681]"
          />
        </div>
      </div>
    </header>
  );
}
