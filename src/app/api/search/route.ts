import { NextRequest, NextResponse } from "next/server";
import { db, posts, categories } from "@/db";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (!q || q.length < 2) {
    return NextResponse.json({ query: q, results: [] });
  }

  const needle = `%${q}%`;

  // Relevance: title match (3) > excerpt (2) > content (1)
  const relevance = sql<number>`(
    case when ${posts.title} ilike ${needle} then 3 else 0 end +
    case when ${posts.excerpt} ilike ${needle} then 2 else 0 end +
    case when ${posts.content} ilike ${needle} then 1 else 0 end
  )`;

  const results = await db
    .select({
      id: posts.id,
      slug: posts.slug,
      title: posts.title,
      excerpt: posts.excerpt,
      coverImage: posts.coverImage,
      readingTime: posts.readingTime,
      publishedAt: posts.publishedAt,
      createdAt: posts.createdAt,
      categorySlug: categories.slug,
      categoryName: categories.name,
      relevance,
    })
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .where(
      and(
        eq(posts.status, "published"),
        or(
          ilike(posts.title, needle),
          ilike(posts.excerpt, needle),
          ilike(posts.content, needle)
        )
      )
    )
    .orderBy(desc(relevance), desc(posts.publishedAt))
    .limit(20);

  return NextResponse.json({ query: q, results });
}
