"use client";

import { createContext, useContext, useState, useCallback, useRef, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ConfirmOptions = {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
};

type ConfirmFn = (opts: ConfirmOptions | string) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{
    opts: ConfirmOptions;
    resolve: (v: boolean) => void;
  } | null>(null);

  const confirm: ConfirmFn = useCallback((opts) => {
    const o = typeof opts === "string" ? { message: opts } : opts;
    return new Promise<boolean>((resolve) => {
      setState({ opts: o, resolve });
    });
  }, []);

  const close = (v: boolean) => {
    if (state) state.resolve(v);
    setState(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <AnimatePresence>
        {state && (
          <ConfirmModal
            key="modal"
            opts={state.opts}
            onClose={(v) => close(v)}
          />
        )}
      </AnimatePresence>
    </ConfirmContext.Provider>
  );
}

export function useConfirm(): ConfirmFn {
  const fn = useContext(ConfirmContext);
  if (!fn) {
    // Fallback to native if provider missing
    return (opts) => {
      const m = typeof opts === "string" ? opts : opts.message;
      return Promise.resolve(window.confirm(m));
    };
  }
  return fn;
}

function ConfirmModal({
  opts,
  onClose,
}: {
  opts: ConfirmOptions;
  onClose: (v: boolean) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const isDanger = opts.variant !== "info";
  const accent = isDanger
    ? { from: "from-[#ff5c5c]", to: "to-[#ff8a8a]", ring: "ring-[#ff5c5c]/40" }
    : { from: "from-[#5bc8ff]", to: "to-[#8dd6ff]", ring: "ring-[#5bc8ff]/40" };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        onClick={() => onClose(false)}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className={`relative bg-[#171a1f] border border-[#262b33] rounded-2xl shadow-2xl max-w-md w-full overflow-hidden`}
        role="alertdialog"
        aria-modal="true"
      >
        <div className={`h-1 w-full bg-gradient-to-r ${accent.from} ${accent.to}`} />
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`shrink-0 w-12 h-12 rounded-full grid place-items-center bg-gradient-to-br ${accent.from} ${accent.to} shadow-lg ${accent.ring}`}>
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 9v4M12 17h.01" />
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-extrabold text-white">{opts.title || "Konfirmasi"}</h2>
              <p className="text-sm text-[#9aa3ad] mt-1.5 leading-relaxed">{opts.message}</p>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="px-4 py-2 rounded-lg bg-[#1c2026] border border-[#262b33] text-sm font-bold text-[#9aa3ad] hover:border-[#3a424e] hover:text-white transition"
            >
              {opts.cancelText || "Batal"}
            </button>
            <button
              ref={ref}
              type="button"
              autoFocus
              onClick={() => onClose(true)}
              className={`px-4 py-2 rounded-lg text-sm font-bold text-white bg-gradient-to-r ${accent.from} ${accent.to} hover:shadow-lg transition`}
            >
              {opts.confirmText || "Lanjutkan"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
