import { notFound } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { OrderSuccessView } from "@/components/OrderSuccessView";

const rupiah = (n: number) => "Rp" + n.toLocaleString("id-ID");

export default async function OrderPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const supabase = createSupabaseAdminClient();
  const { data: order } = await supabase
    .from("orders")
    .select("order_code, status, total, subtotal, service_fee, payment_method, customer_uid, customer_zid, customer_whatsapp, notes, created_at, games(slug, name), products(label, coins)")
    .eq("order_code", code)
    .single();

  if (!order) notFound();

  const { data: paymentMethods } = await supabase
    .from("payment_methods")
    .select("label, type, account_number, account_name, bank_name, qris_image_url, instructions, fee_label")
    .eq("is_active", true);
  const pm = (paymentMethods || []).find((m: any) => m.label === order.payment_method);

  return <OrderSuccessView order={order as any} paymentMethod={pm as any} />;
}
