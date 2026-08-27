import { GeistSans } from "geist/font/sans";
import { requireStaff } from "@/lib/auth";
import { logoutAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireStaff();
  return (
    <div className={GeistSans.variable}>
      {children}
    </div>
  );
}
