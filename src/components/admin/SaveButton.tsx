"use client";

import { useFormStatus } from "react-dom";
import { useEffect, useState } from "react";

type Props = {
  label: string;
  className?: string;
  successLabel?: string;
  onSuccessResetMs?: number;
};

export function SaveButton({
  label,
  className = "px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#ff5c2b] to-[#ff7a3f] text-white text-xs font-bold hover:shadow-lg hover:shadow-[#ff5c2b]/30 transition shrink-0 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none",
  successLabel = "Tersimpan ✓",
  onSuccessResetMs = 2400,
}: Props) {
  const { pending } = useFormStatus();
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    if (!pending && justSaved) {
      const t = setTimeout(() => setJustSaved(false), onSuccessResetMs);
      return () => clearTimeout(t);
    }
  }, [pending, justSaved, onSuccessResetMs]);

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={() => {
        if (!pending) setJustSaved(true);
      }}
      className={
        justSaved
          ? "px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#2fbf71] to-[#25a061] text-white text-xs font-bold shadow-lg shadow-[#2fbf71]/30 transition shrink-0 inline-flex items-center gap-1.5"
          : className
      }
    >
      {pending ? (
        <span className="inline-flex items-center gap-1.5">
          <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          Menyimpan...
        </span>
      ) : justSaved ? (
        <span className="inline-flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          {successLabel}
        </span>
      ) : (
        label
      )}
    </button>
  );
}
