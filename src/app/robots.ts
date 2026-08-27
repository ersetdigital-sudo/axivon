import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://axivon-psi.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/*", "/order/", "/api/"],
      },
      // Explicitly allow AI search/citation crawlers
      { userAgent: "GPTBot", allow: "/", disallow: ["/admin", "/admin/*"] },
      { userAgent: "ChatGPT-User", allow: "/", disallow: ["/admin", "/admin/*"] },
      { userAgent: "PerplexityBot", allow: "/", disallow: ["/admin", "/admin/*"] },
      { userAgent: "ClaudeBot", allow: "/", disallow: ["/admin", "/admin/*"] },
      { userAgent: "anthropic-ai", allow: "/", disallow: ["/admin", "/admin/*"] },
      { userAgent: "Google-Extended", allow: "/", disallow: ["/admin", "/admin/*"] },
      { userAgent: "Bingbot", allow: "/", disallow: ["/admin", "/admin/*"] },
      { userAgent: "CCBot", disallow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
