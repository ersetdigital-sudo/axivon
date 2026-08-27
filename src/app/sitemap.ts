import type { MetadataRoute } from "next";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://axivongames.net";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createSupabaseAdminClient();
  const { data: games } = await supabase
    .from("games")
    .select("slug, name")
    .order("id");

  const now = new Date();

  const staticUrls: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1.0 },
  ];

  const gameUrls: MetadataRoute.Sitemap = (games || []).map((g) => ({
    url: `${SITE_URL}/${g.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [...staticUrls, ...gameUrls];
}
