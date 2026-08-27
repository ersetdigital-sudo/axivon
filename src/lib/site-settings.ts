import { createSupabaseAdminClient } from "@/lib/supabase/server";

export type SiteSettings = {
  whatsapp_cs: string;
  site_tagline: string;
};

const DEFAULTS: SiteSettings = {
  whatsapp_cs: "6281234567890",
  site_tagline: "Top Up Game Online Termurah 24 Jam",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", ["whatsapp_cs", "site_tagline"]);
  const out = { ...DEFAULTS };
  for (const row of data || []) {
    const v = row.value;
    const s = typeof v === "string" ? v.replace(/^"|"$/g, "") : null;
    if (row.key === "whatsapp_cs" && s) out.whatsapp_cs = s;
    if (row.key === "site_tagline" && s) out.site_tagline = s;
  }
  return out;
}
