"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logoutAction } from "@/app/admin/(protected)/actions";
import { Toast } from "./Toast";
import { ConfirmProvider } from "./useConfirm";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const NAV_MAIN: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: <DashboardIcon /> },
  { href: "/admin/products", label: "Products", icon: <ProductsIcon /> },
  { href: "/admin/orders", label: "Orders", icon: <OrdersIcon /> },
  { href: "/admin/payments", label: "Payments", icon: <PaymentsIcon /> },
];

type Props = {
  profile: { full_name?: string; email?: string; role?: string };
  toast?: { message: string; variant: "success" | "error" };
  children: React.ReactNode;
};

export function AdminShell({ profile, toast, children }: Props) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = (profile.full_name || profile.email || "A")
    .split(/[\s@.]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  return (
    <ConfirmProvider>
      <div className="min-h-screen bg-[#101215] text-[#eef1f4] flex">
        {toast && <Toast message={toast.message} variant={toast.variant} />}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-60 shrink-0 border-r border-[#262b33] bg-[#0d0f12] flex-col transition-transform duration-200 ${mobileOpen ? "flex" : "hidden"} md:flex`}
      >
        <div className="px-5 py-5 border-b border-[#262b33] flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#ff5c2b] to-[#ff7a3f] grid place-items-center font-extrabold text-white text-sm shadow-lg shadow-[#ff5c2b]/30">
              A
            </div>
            <div>
              <div className="font-bold text-sm">Axivon Admin</div>
              <div className="text-[11px] text-[#6d7681] uppercase">{profile.role || "staff"}</div>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-[#6d7681] hover:text-white"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <NavLink href="/admin" label="Dashboard" active={pathname === "/admin"} icon={<DashboardIcon />} />
          <NavLink href="/admin/products" label="Products" active={pathname.startsWith("/admin/products")} icon={<ProductsIcon />} />
          <NavLink href="/admin/orders" label="Orders" active={pathname.startsWith("/admin/orders")} icon={<OrdersIcon />} />
          <NavLink href="/admin/payments" label="Payments" active={pathname.startsWith("/admin/payments")} icon={<PaymentsIcon />} />
          <NavLink href="/admin/admins" label="Admins" active={pathname.startsWith("/admin/admins")} icon={<UsersIcon />} />
          <NavLink href="/admin/settings" label="Settings" active={pathname.startsWith("/admin/settings")} icon={<SettingsIcon />} />
        </nav>

        <div className="px-3 py-3 border-t border-[#262b33] space-y-2">
          <div className="px-3 py-2 text-xs">
            <div className="font-semibold truncate text-white">{profile.full_name || "Admin"}</div>
            <div className="text-[#6d7681] truncate">{profile.email}</div>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full px-3 py-2 rounded-lg text-sm font-semibold bg-[#1c2026] border border-[#262b33] hover:border-[#3a424e] transition"
            >
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Backdrop on mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile topbar */}
        <header className="md:hidden border-b border-[#262b33] bg-[#0d0f12] px-4 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="text-white"
            aria-label="Open menu"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          </button>
          <div className="text-xs font-bold">Axivon Admin</div>
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#ff5c2b] to-[#ff7a3f] grid place-items-center text-white text-[10px] font-extrabold">
            {initials || "A"}
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">{children}</main>
      </div>
      </div>
    </ConfirmProvider>
  );
}

function NavLink({ href, label, active, icon }: { href: string; label: string; active: boolean; icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold transition ${
        active
          ? "bg-[#1c2026] text-white border border-[#262b33]"
          : "text-[#9aa3ad] hover:bg-[#1c2026]/60 hover:text-white border border-transparent"
      }`}
    >
      <span className={active ? "text-[#ff5c2b]" : "text-[#6d7681]"}>{icon}</span>
      {label}
    </Link>
  );
}

function DashboardIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  );
}

function ProductsIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41 13.41 20.59a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <path d="M7 7h.01" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function OrdersIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="m9 13 2 2 4-4" />
    </svg>
  );
}

function PaymentsIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="13" rx="2" />
      <path d="M2 10h20" />
      <path d="M6 15h3" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  );
}
