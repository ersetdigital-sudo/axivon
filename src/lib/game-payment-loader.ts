import { createSupabaseAdminClient } from "@/lib/supabase/server";

export type LoadedPaymentMethod = {
  id: number;
  label: string;
  fee: number;
  desc: string;
  type: string;
};

export async function loadActivePaymentMethods(): Promise<LoadedPaymentMethod[]> {
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("payment_methods")
    .select("id, label, type, fee, instructions, fee_label")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  return (data || []).map((m) => ({
    id: m.id,
    label: m.label,
    fee: m.fee || 0,
    desc: m.fee_label || "Gratis",
    type: m.type,
  }));
}
