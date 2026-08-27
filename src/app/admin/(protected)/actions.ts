"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase/server";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  if (!email || !password) return { error: "Email & password wajib diisi." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  revalidatePath("/admin");
  redirect("/admin");
}

export async function logoutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  revalidatePath("/admin");
  redirect("/admin/login");
}

export async function updateOrderStatusAction(formData: FormData) {
  const orderId = Number(formData.get("order_id") || 0);
  const newStatus = String(formData.get("status") || "");
  const actorLabel = String(formData.get("actor_label") || "admin");
  const validStatuses = ["pending", "paid", "processing", "success", "failed", "refunded"];
  if (!orderId || !validStatuses.includes(newStatus)) return;

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data: order } = await supabase
    .from("orders")
    .select("status")
    .eq("id", orderId)
    .single();
  if (!order) return;

  const admin = createSupabaseAdminClient();

  await admin
    .from("orders")
    .update({ status: newStatus })
    .eq("id", orderId);

  await admin.from("order_events").insert({
    order_id: orderId,
    actor_id: user.id,
    actor_label: actorLabel,
    from_status: order.status,
    to_status: newStatus,
  });

  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}

export async function toggleProductAction(formData: FormData) {
  const productId = Number(formData.get("product_id") || 0);
  const isActive = formData.get("is_active") === "true";
  if (!productId) return;

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const admin = createSupabaseAdminClient();
  await admin.from("products").update({ is_active: isActive }).eq("id", productId);
  revalidatePath("/admin/products");
}
