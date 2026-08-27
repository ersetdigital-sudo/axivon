"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase/server";

export async function loginAction(_prev: { error?: string } | undefined, formData: FormData) {
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

export async function updatePaymentMethodAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/payments?msg=Unauthorized");

  const id = Number(formData.get("id") || 0);
  if (!id) redirect("/admin/payments?msg=Invalid+id");

  const admin = createSupabaseAdminClient();
  const uploadOnly = formData.get("upload_only") === "true";

  if (uploadOnly) {
    const file = formData.get("file") as File | null;
    if (!file || file.size === 0) redirect("/admin/payments?msg=No+file+uploaded");
    if (file!.size > 5 * 1024 * 1024) redirect("/admin/payments?msg=File+max+5MB");
    if (!file!.type.startsWith("image/")) redirect("/admin/payments?msg=File+harus+gambar");

    try {
      const { uploadToCloudinary } = await import("@/lib/cloudinary");
      const { secure_url } = await uploadToCloudinary(file!, `axivon/payment-methods/${id}`);
      await admin.from("payment_methods").update({ qris_image_url: secure_url }).eq("id", id);
    } catch (err) {
      redirect(`/admin/payments?msg=Upload+gagal:+${encodeURIComponent(String((err as Error).message || err))}`);
    }
    revalidatePath("/admin/payments");
    return;
  }

  await admin.from("payment_methods").update({
    label: String(formData.get("label") || ""),
    bank_name: String(formData.get("bank_name") || "") || null,
    account_number: String(formData.get("account_number") || String(formData.get("whatsapp_cs") || "")) || null,
    account_name: String(formData.get("account_name") || "") || null,
    instructions: String(formData.get("instructions") || "") || null,
    fee: Number(formData.get("fee") || 0),
    fee_label: String(formData.get("fee_label") || "") || null,
  }).eq("id", id);

  revalidatePath("/admin/payments");
}

export async function togglePaymentMethodAction(formData: FormData) {
  const id = Number(formData.get("id") || 0);
  const isActive = formData.get("is_active") === "true";
  if (!id) return;

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const admin = createSupabaseAdminClient();
  await admin.from("payment_methods").update({ is_active: isActive }).eq("id", id);
  revalidatePath("/admin/payments");
}
