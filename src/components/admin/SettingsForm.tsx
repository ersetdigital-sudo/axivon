"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

type Result = { ok: boolean; message: string };

type Props = {
  action: (formData: FormData) => Promise<Result>;
  children: React.ReactNode;
  buttonLabel: string;
  successLabel?: string;
  buttonClassName?: string;
  redirectTo?: string;
};

export function SettingsForm({
  action,
  children,
  buttonLabel,
  successLabel = "Edit",
  buttonClassName = "px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#ff5c2b] to-[#ff7a3f] text-white text-xs font-bold hover:shadow-lg hover:shadow-[#ff5c2b]/30 transition-all duration-200 shrink-0 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed",
  redirectTo,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<Result | null>(null);
  const [justSaved, setJustSaved] = useState(false);
  const [locked, setLocked] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const fieldSetRef = useRef<HTMLDivElement>(null);

  // When locked, disable all form fields (visual + interaction)
  useEffect(() => {
    if (!fieldSetRef.current) return;
    const inputs = fieldSetRef.current.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      "input, select, textarea"
    );
    inputs.forEach((el) => {
      if (el.type === "hidden") return;
      el.disabled = locked;
    });
  }, [locked]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pending) return;
    const fd = new FormData(e.currentTarget);
    setResult(null);
    startTransition(async () => {
      const r = await action(fd);
      setResult(r);
      if (r.ok) {
        setJustSaved(true);
        setLocked(true);
        if (redirectTo) {
          setTimeout(() => router.push(redirectTo), 600);
        }
        // Return to Edit label after 2.5s (animation completes)
        setTimeout(() => setJustSaved(false), 2500);
      }
    });
  };

  const onEdit = () => {
    setLocked(false);
    setResult(null);
    setTimeout(() => {
      const firstInput = formRef.current?.querySelector<HTMLInputElement>(
        'input:not([type="hidden"]):not([disabled])'
      );
      firstInput?.focus();
    }, 50);
  };

  // Determine button state
  let btnClass = buttonClassName;
  let btnContent: React.ReactNode = buttonLabel;

  if (pending) {
    btnClass =
      "px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#ff5c2b]/70 to-[#ff7a3f]/70 text-white text-xs font-bold transition-all duration-200 shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 cursor-wait";
    btnContent = (
      <span className="inline-flex items-center gap-1.5">
        <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
        Menyimpan...
      </span>
    );
  } else if (result && !result.ok) {
    btnClass =
      "px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#ff5c5c] to-[#ff8a8a] text-white text-xs font-bold shadow-lg shadow-[#ff5c5c]/30 transition-all duration-200 shrink-0 inline-flex items-center gap-1.5";
    btnContent = (
      <span className="inline-flex items-center gap-1.5">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
        Coba lagi
      </span>
    );
  } else if (justSaved) {
    btnClass =
      "px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#2fbf71] to-[#25a061] text-white text-xs font-bold shadow-lg shadow-[#2fbf71]/30 transition-all duration-200 shrink-0 inline-flex items-center gap-1.5";
    btnContent = (
      <span className="inline-flex items-center gap-1.5">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
        Tersimpan!
      </span>
    );
  } else if (locked) {
    btnClass =
      "px-5 py-2.5 rounded-lg bg-[#1c2026] border border-[#2fbf71]/30 text-[#2fbf71] text-xs font-bold hover:bg-[#2fbf71]/10 hover:border-[#2fbf71]/50 transition-all duration-200 shrink-0 inline-flex items-center gap-1.5";
    btnContent = (
      <span className="inline-flex items-center gap-1.5">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        {successLabel}
      </span>
    );
  }

  const isSubmit = !pending && !result?.ok && !justSaved && !locked;

  return (
    <div>
      <form ref={formRef} onSubmit={onSubmit} className="contents">
        <div
          ref={fieldSetRef}
          className={`transition-opacity duration-300 ${locked ? "opacity-60" : "opacity-100"}`}
        >
          {children}
        </div>
        <div className="mt-2 text-[10px] min-h-[16px]">
          {result && !result.ok && (
            <div className="text-[#ff8a8a] flex items-center gap-1.5">
              <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v5M12 16h.01" />
              </svg>
              {result.message}
            </div>
          )}
          {result?.ok && !justSaved && (
            <div className="text-[#6d7681]">{result.message}</div>
          )}
          {locked && (
            <div className="text-[#2fbf71] flex items-center gap-1.5">
              <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Form terkunci. Klik Edit untuk mengubah lagi.
            </div>
          )}
        </div>
        <div className="mt-3">
          {isSubmit ? (
            <button type="submit" className={btnClass}>
              {btnContent}
            </button>
          ) : (
            <button type="button" onClick={onEdit} className={btnClass}>
              {btnContent}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
