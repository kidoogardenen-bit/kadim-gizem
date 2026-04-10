import { desc, eq } from "drizzle-orm";

import { db, posts, categories } from "@/db";
import { SITE } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const revalidate = 1800;

function escapeXml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

export async function GET() {
  const base = SITE.url.replace(/\/$/, "");

  const rows = await db
    .select({
      id: posts.id,
      slug: posts.slug,
      title: posts.title,
      excerpt: posts.excerpt,
      content: posts.content,
      publishedAt: posts.publishedAt,
      createdAt: posts.createdAt,
      categorySlug: categories.slug,
      categoryName: categories.name,
    })
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .where(eq(posts.status, "published"))
    .orderBy(desc(posts.publishedAt))
    .limit(50);

  const items = rows
    .map((p) => {
      const link = `${base}/${p.categorySlug ?? "genel"}/${p.slug}`;
      const pubDate = new Date(
        p.publishedAt ?? p.createdAt ?? Date.now()
      ).toUTCString();
      const desc = p.excerpt ?? stripHtml(p.content).slice(0, 280);
      const category = p.categoryName ?? p.categorySlug ?? "";

      return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <description>${escapeXml(desc)}</description>
      <pubDate>${pubDate}</pubDate>
      ${category ? `<category>${escapeXml(category)}</category>` : ""}
    </item>`;
    })
    .join("\n");

  const lastBuildDate = new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE.name)}</title>
    <link>${escapeXml(base)}</link>
    <description>${escapeXml(SITE.description)}</description>
    <language>tr</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${escapeXml(base)}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=1800, s-maxage=1800",
    },
  });
}
