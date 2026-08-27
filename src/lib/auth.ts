import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function requireStaff() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, email")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/admin/login");

  return { user, profile, supabase };
}

export async function requireAdmin() {
  const ctx = await requireStaff();
  if (ctx.profile.role !== "admin") redirect("/admin");
  return ctx;
}
