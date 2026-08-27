import Link from "next/link";
import { requireStaff } from "@/lib/auth";
import { logoutAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireStaff();
  return (
    <div className="min-h-screen bg-[#101215] text-[#eef1f4] flex">
      <aside className="hidden md:flex md:w-60 shrink-0 border-r border-[#262b33] bg-[#0d0f12] flex-col">
        <div className="px-5 py-5 border-b border-[#262b33] flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#ff5c2b] to-[#ff7a3f] grid place-items-center font-extrabold text-white text-sm">A</div>
          <div>
            <div className="font-bold text-sm">Axivon Admin</div>
            <div className="text-[11px] text-[#6d7681]">{profile.role.toUpperCase()}</div>
          </div>
        </div>
        <nav className="px-3 py-4 space-y-1 flex-1">
          <SideLink href="/admin" label="Dashboard" icon="dashboard" />
          <SideLink href="/admin/orders" label="Orders" icon="orders" />
          <SideLink href="/admin/products" label="Products" icon="products" />
        </nav>
        <div className="px-3 py-3 border-t border-[#262b33]">
          <div className="px-3 py-2 text-xs">
            <div className="font-semibold truncate">{profile.full_name || profile.email}</div>
            <div className="text-[#6d7681] truncate">{profile.email}</div>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full mt-1 px-3 py-2 rounded-lg text-sm font-semibold bg-[#1c2026] border border-[#262b33] hover:border-[#3a424e] transition"
            >
              Logout
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="md:hidden border-b border-[#262b33] bg-[#0d0f12] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff5c2b] to-[#ff7a3f] grid place-items-center font-extrabold text-white text-xs">A</div>
            <span className="font-bold text-sm">Axivon Admin</span>
          </div>
          <form action={logoutAction}>
            <button type="submit" className="text-xs px-3 py-1.5 rounded-lg bg-[#1c2026] border border-[#262b33] font-semibold">Logout</button>
          </form>
        </header>
        <nav className="md:hidden border-b border-[#262b33] bg-[#0d0f12] px-2 py-2 flex gap-1 overflow-x-auto no-scrollbar">
          <SideLink href="/admin" label="Dashboard" icon="dashboard" mobile />
          <SideLink href="/admin/orders" label="Orders" icon="orders" mobile />
          <SideLink href="/admin/products" label="Products" icon="products" mobile />
        </nav>
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}

function SideLink({ href, label, icon, mobile }: { href: string; label: string; icon: string; mobile?: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 rounded-lg font-semibold transition ${
        mobile ? "shrink-0 px-3 py-1.5 text-xs bg-[#1c2026] border border-[#262b33] text-[#9aa3ad]" : "px-3 py-2 text-sm text-[#9aa3ad] hover:bg-[#1c2026] hover:text-white"
      }`}
    >
      <NavIcon kind={icon} />
      {label}
    </Link>
  );
}

function NavIcon({ kind }: { kind: string }) {
  const cls = "w-4 h-4";
  if (kind === "dashboard") {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9" rx="1.5" />
        <rect x="14" y="3" width="7" height="5" rx="1.5" />
        <rect x="14" y="12" width="7" height="9" rx="1.5" />
        <rect x="3" y="16" width="7" height="5" rx="1.5" />
      </svg>
    );
  }
  if (kind === "orders") {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <path d="m9 13 2 2 4-4" />
      </svg>
    );
  }
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" />
      <path d="m3 8 9 5 9-5M12 13v8" />
    </svg>
  );
}
