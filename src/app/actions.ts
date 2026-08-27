"use server";

import { redirect } from "next/navigation";
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server";

export async function createOrderAction(formData: FormData) {
  const gameSlug = String(formData.get("game_slug") || "");
  const productLabel = String(formData.get("product_label") || "");
  const productPrice = Number(formData.get("product_price") || 0);
  const productOldPrice = Number(formData.get("product_old_price") || 0) || null;
  const paymentLabel = String(formData.get("payment_label") || "");
  const paymentFee = Number(formData.get("payment_fee") || 0);
  const customerUid = String(formData.get("customer_uid") || "").trim();
  const customerZid = String(formData.get("customer_zid") || "").trim() || null;
  const customerWhatsapp = String(formData.get("customer_whatsapp") || "").trim() || null;

  if (!gameSlug || !productLabel || !paymentLabel || !customerUid) {
    redirect(`/order-error?msg=${encodeURIComponent("Data order tidak lengkap.")}`);
  }

  const admin = createSupabaseAdminClient();

  // Look up game & product (use label match to find product id)
  const { data: game } = await admin
    .from("games")
    .select("id, name, short_name")
    .eq("slug", gameSlug)
    .single();

  if (!game) redirect(`/order-error?msg=${encodeURIComponent("Game tidak ditemukan.")}`);

  const { data: product } = await admin
    .from("products")
    .select("id, label, price, coins")
    .eq("game_id", game.id)
    .eq("label", productLabel)
    .eq("is_active", true)
    .single();

  if (!product) redirect(`/order-error?msg=${encodeURIComponent("Produk tidak valid atau nonaktif.")}`);

  // Use price from server, not client (avoid tampering)
  const subtotal = product.price;
  const total = subtotal + paymentFee;

  // Generate order code
  const { data: codeData } = await admin.rpc("generate_order_code");
  const orderCode = codeData || `AX-${Date.now()}`;

  const { data: order, error: insertErr } = await admin
    .from("orders")
    .insert({
      order_code: orderCode,
      game_id: game.id,
      product_id: product.id,
      customer_uid: customerUid,
      customer_zid: customerZid,
      customer_whatsapp: customerWhatsapp,
      payment_method: paymentLabel,
      subtotal,
      service_fee: paymentFee,
      total,
      status: "pending",
    })
    .select("id, order_code")
    .single();

  if (insertErr || !order) {
    console.error("createOrder error:", insertErr?.message);
    redirect(`/order-error?msg=${encodeURIComponent("Gagal membuat order. Coba lagi.")}`);
  }

  // Log initial event
  await admin.from("order_events").insert({
    order_id: order.id,
    actor_id: null,
    actor_label: "system",
    from_status: null,
    to_status: "pending",
    note: "Order dibuat dari katalog",
  });

  redirect(`/order/${order.order_code}`);
}
