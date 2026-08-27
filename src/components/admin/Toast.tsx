"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Variant = "success" | "error";

export function Toast({
  message,
  variant = "success",
  duration = 4000,
}: {
  message: string;
  variant?: Variant;
  duration?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), duration - 250);
    const t2 = setTimeout(() => {
      const params = new URLSearchParams(search.toString());
      params.delete("msg");
      params.delete("toast");
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }, duration);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [duration, pathname, router, search]);

  const isSuccess = variant === "success";
  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-auto fixed top-5 right-5 z-[100] max-w-sm transition-all duration-300 ease-out ${
        leaving ? "translate-x-[120%] opacity-0" : "translate-x-0 opacity-100"
      }`}
    >
      <div
        className={`flex items-start gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-md ${
          isSuccess
            ? "border-[#2fbf71]/40 bg-[#0d1a13]/95 shadow-[#2fbf71]/10"
            : "border-[#ff5c5c]/40 bg-[#1a0d0d]/95 shadow-[#ff5c5c]/10"
        }`}
      >
        <div
          className={`shrink-0 grid place-items-center w-8 h-8 rounded-lg ${
            isSuccess
              ? "bg-gradient-to-br from-[#2fbf71] to-[#25a061] shadow-[0_0_14px_rgba(47,191,113,0.5)]"
              : "bg-gradient-to-br from-[#ff5c5c] to-[#ff8a8a] shadow-[0_0_14px_rgba(255,92,92,0.5)]"
          }`}
        >
          {isSuccess ? (
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className={`text-[11px] font-extrabold uppercase tracking-wider ${isSuccess ? "text-[#2fbf71]" : "text-[#ff8a8a]"}`}>
            {isSuccess ? "Berhasil" : "Gagal"}
          </div>
          <div className="text-sm text-white mt-0.5 break-words leading-snug">{message}</div>
        </div>
        <button
          type="button"
          onClick={() => {
            const params = new URLSearchParams(search.toString());
            params.delete("msg");
            params.delete("toast");
            const qs = params.toString();
            router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
          }}
          className="shrink-0 -mr-1 -mt-1 p-1 rounded-md text-white/60 hover:text-white hover:bg-white/5 transition"
          aria-label="Tutup"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
