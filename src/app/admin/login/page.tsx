"use client";

import { useActionState } from "react";
import { loginAction } from "../(protected)/actions";

const initial: { error?: string } = {};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initial);

  return (
    <div className="min-h-screen bg-[#101215] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ff5c2b] to-[#ff7a3f] grid place-items-center font-extrabold text-white text-xl shadow-lg shadow-[#ff5c2b]/30">
            A
          </div>
          <h1 className="mt-4 text-2xl font-extrabold">Admin Login</h1>
          <p className="text-sm text-[#9aa3ad] mt-1">Axivon Games Dashboard</p>
        </div>

        <form action={formAction} className="bg-[#171a1f] border border-[#262b33] rounded-xl p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#9aa3ad]">Email</label>
            <input
              name="email"
              type="email"
              required
              placeholder="admin@axivongames.net"
              className="mt-1.5 w-full rounded-lg px-3.5 py-3 text-sm bg-[#12151a] border border-[#262b33] focus:outline-none focus:border-[#ff5c2b] placeholder:text-[#5d6570]"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#9aa3ad]">Password</label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              className="mt-1.5 w-full rounded-lg px-3.5 py-3 text-sm bg-[#12151a] border border-[#262b33] focus:outline-none focus:border-[#ff5c2b] placeholder:text-[#5d6570]"
            />
          </div>
          {state?.error && (
            <p className="text-xs text-[#ff5c5c] bg-[#ff5c5c]/10 border border-[#ff5c5c]/30 rounded-lg px-3 py-2">
              {state.error}
            </p>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 rounded-lg bg-gradient-to-br from-[#ff5c2b] to-[#ff7a3f] text-white font-semibold transition hover:opacity-90 active:scale-[.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? "Logging in..." : "Login"}
          </button>
          <p className="text-xs text-center text-[#6d7681]">
            Belum punya akun? Buat lewat Supabase Dashboard → Authentication.
          </p>
        </form>
      </div>
    </div>
  );
}
