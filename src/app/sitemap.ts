import type { MetadataRoute } from "next";
import { eq } from "drizzle-orm";

import { db, posts, categories } from "@/db";
import { SITE } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${base}/mitoloji`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${base}/tarih`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${base}/gercekler`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${base}/hakkinda`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  try {
    const rows = await db
      .select({
        slug: posts.slug,
        updatedAt: posts.updatedAt,
        publishedAt: posts.publishedAt,
        categorySlug: categories.slug,
      })
      .from(posts)
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .where(eq(posts.status, "published"));

    const postRoutes: MetadataRoute.Sitemap = rows
      .filter((r) => r.categorySlug)
      .map((r) => ({
        url: `${base}/${r.categorySlug}/${r.slug}`,
        lastModified: r.updatedAt ?? r.publishedAt ?? now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));

    return [...staticRoutes, ...postRoutes];
  } catch {
    return staticRoutes;
  }
}
