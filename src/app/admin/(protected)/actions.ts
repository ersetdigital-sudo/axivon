"use server";

import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
  if (!orderId || !validStatuses.includes(newStatus)) {
    redirect("/admin/orders?msg=Data+order+tidak+valid&toast=err");
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/orders?msg=Unauthorized&toast=err");

  const { data: order } = await supabase
    .from("orders")
    .select("status")
    .eq("id", orderId)
    .single();
  if (!order) redirect("/admin/orders?msg=Order+tidak+ditemukan&toast=err");

  const admin = createSupabaseAdminClient();
  if (order.status !== newStatus) {
    await admin.from("orders").update({ status: newStatus }).eq("id", orderId);
    await admin.from("order_events").insert({
      order_id: orderId,
      actor_id: user.id,
      actor_label: actorLabel,
      from_status: order.status,
      to_status: newStatus,
    });
  }

  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  redirect(`/admin/orders?msg=Order+%23${orderId}+berhasil+diperbarui&toast=ok`);
}

export async function deleteOrderAction(formData: FormData) {
  const orderId = Number(formData.get("order_id") || 0);
  if (!orderId) redirect("/admin/orders?msg=Order+tidak+valid&toast=err");

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/orders?msg=Unauthorized&toast=err");

  const admin = createSupabaseAdminClient();
  await admin.from("order_events").delete().eq("order_id", orderId);
  const { error } = await admin.from("orders").delete().eq("id", orderId);
  if (error) redirect(`/admin/orders?msg=Gagal+hapus:+${encodeURIComponent(error.message)}&toast=err`);

  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  redirect("/admin/orders?msg=Order+berhasil+dihapus&toast=ok");
}

export async function toggleProductAction(formData: FormData) {
  const productId = Number(formData.get("product_id") || 0);
  const isActive = formData.get("is_active") === "true";
  if (!productId) redirect("/admin/products?msg=Produk+tidak+valid&toast=err");

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/products?msg=Unauthorized&toast=err");

  const admin = createSupabaseAdminClient();
  await admin.from("products").update({ is_active: isActive }).eq("id", productId);
  revalidatePath("/admin/products");
  redirect(`/admin/products?msg=${encodeURIComponent(isActive ? "Produk+diaktifkan" : "Produk+dinonaktifkan")}&toast=ok`);
}

export async function createProductAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/products?msg=Unauthorized&toast=err");

  const gameId = Number(formData.get("game_id") || 0);
  const label = String(formData.get("label") || "").trim();
  const price = Number(formData.get("price") || 0);
  const oldPriceRaw = String(formData.get("old_price") || "").trim();
  const coins = Number(formData.get("coins") || 0);
  const description = String(formData.get("description") || "").trim() || null;
  const badge = String(formData.get("badge") || "").trim() || null;
  const iconColor = String(formData.get("icon_color") || "").trim() || "text-[#5bc8ff]";
  const sortOrder = Number(formData.get("sort_order") || 99);

  if (!gameId || !label || !price || !coins) {
    redirect("/admin/products?msg=Field+wajib:+Game,+Label,+Harga,+Koin&toast=err");
  }

  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("products").insert({
    game_id: gameId,
    label,
    price,
    old_price: oldPriceRaw ? Number(oldPriceRaw) : null,
    coins,
    description,
    badge,
    icon_color: iconColor,
    sort_order: sortOrder,
    is_active: true,
  });
  if (error) redirect(`/admin/products?msg=Gagal+tambah:+${encodeURIComponent(error.message)}&toast=err`);

  revalidatePath("/admin/products");
  redirect("/admin/products?msg=Produk+berhasil+ditambahkan&toast=ok");
}

export async function updateProductAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/products?msg=Unauthorized&toast=err");

  const id = Number(formData.get("id") || 0);
  if (!id) redirect("/admin/products?msg=Produk+tidak+valid&toast=err");

  const label = String(formData.get("label") || "").trim();
  const price = Number(formData.get("price") || 0);
  const oldPriceRaw = String(formData.get("old_price") || "").trim();
  const coins = Number(formData.get("coins") || 0);
  const description = String(formData.get("description") || "").trim() || null;
  const badge = String(formData.get("badge") || "").trim() || null;
  const iconColor = String(formData.get("icon_color") || "").trim() || "text-[#5bc8ff]";
  const sortOrder = Number(formData.get("sort_order") || 99);

  if (!label || !price || !coins) {
    redirect("/admin/products?msg=Field+wajib:+Label,+Harga,+Koin&toast=err");
  }

  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("products").update({
    label,
    price,
    old_price: oldPriceRaw ? Number(oldPriceRaw) : null,
    coins,
    description,
    badge,
    icon_color: iconColor,
    sort_order: sortOrder,
  }).eq("id", id);
  if (error) redirect(`/admin/products?msg=Gagal+update:+${encodeURIComponent(error.message)}&toast=err`);

  revalidatePath("/admin/products");
  redirect("/admin/products?msg=Produk+berhasil+diperbarui&toast=ok");
}

export async function deleteProductAction(formData: FormData) {
  const productId = Number(formData.get("product_id") || 0);
  if (!productId) redirect("/admin/products?msg=Produk+tidak+valid&toast=err");

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/products?msg=Unauthorized&toast=err");

  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("products").delete().eq("id", productId);
  if (error) redirect(`/admin/products?msg=Gagal+hapus:+${encodeURIComponent(error.message)}&toast=err`);

  revalidatePath("/admin/products");
  redirect("/admin/products?msg=Produk+berhasil+dihapus&toast=ok");
}

export async function updatePaymentMethodAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/payments?msg=Unauthorized&toast=err");

  const id = Number(formData.get("id") || 0);
  if (!id) redirect("/admin/payments?msg=Invalid+id&toast=err");

  const admin = createSupabaseAdminClient();
  await admin.from("payment_methods").update({
    label: String(formData.get("label") || ""),
    bank_name: String(formData.get("bank_name") || "") || null,
    account_number: String(formData.get("account_number") || "") || null,
    account_name: String(formData.get("account_name") || "") || null,
    instructions: String(formData.get("instructions") || "") || null,
    fee: Number(formData.get("fee") || 0),
    fee_label: String(formData.get("fee_label") || "") || null,
  }).eq("id", id);

  revalidatePath("/admin/payments");
  redirect("/admin/payments?msg=Metode+pembayaran+berhasil+disimpan&toast=ok");
}

export async function togglePaymentMethodAction(formData: FormData) {
  const id = Number(formData.get("id") || 0);
  const isActive = formData.get("is_active") === "true";
  if (!id) redirect("/admin/payments?msg=Invalid+id&toast=err");

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/payments?msg=Unauthorized&toast=err");

  const admin = createSupabaseAdminClient();
  await admin.from("payment_methods").update({ is_active: isActive }).eq("id", id);
  revalidatePath("/admin/payments");
  redirect(`/admin/payments?msg=${encodeURIComponent(isActive ? "Metode+diaktifkan" : "Metode+dinonaktifkan")}&toast=ok`);
}

export async function deletePaymentMethodAction(formData: FormData) {
  const id = Number(formData.get("id") || 0);
  if (!id) redirect("/admin/payments?msg=Invalid+id&toast=err");

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/payments?msg=Unauthorized&toast=err");

  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("payment_methods").delete().eq("id", id);
  if (error) redirect(`/admin/payments?msg=Gagal+hapus:+${encodeURIComponent(error.message)}&toast=err`);

  revalidatePath("/admin/payments");
  redirect("/admin/payments?msg=Metode+pembayaran+berhasil+dihapus&toast=ok");
}
