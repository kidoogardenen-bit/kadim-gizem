import { Suspense } from "react";
import type { Metadata } from "next";
import { SearchIcon } from "lucide-react";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";

import { db, posts, categories } from "@/db";
import { PostCard, type PostCardData } from "@/components/post/PostCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Arama — Kadim Gizem",
  description: "Kadim Gizem arşivinde arama yapın.",
};

export const dynamic = "force-dynamic";

async function searchPosts(q: string): Promise<PostCardData[]> {
  const needle = `%${q}%`;
  const relevance = sql<number>`(
    case when ${posts.title} ilike ${needle} then 3 else 0 end +
    case when ${posts.excerpt} ilike ${needle} then 2 else 0 end +
    case when ${posts.content} ilike ${needle} then 1 else 0 end
  )`;

  const rows = await db
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
    .limit(48);

  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    coverImage: r.coverImage,
    readingTime: r.readingTime,
    publishedAt: r.publishedAt,
    createdAt: r.createdAt,
    categorySlug: r.categorySlug ?? "genel",
    categoryName: r.categoryName,
  }));
}

export default async function AramaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const results = query.length >= 2 ? await searchPosts(query) : [];

  return (
    <div className="container mx-auto px-4 py-10 md:px-6 md:py-14">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-[family-name:var(--font-cinzel,serif)] text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Arama
        </h1>
        <p className="mt-2 text-muted-foreground">
          Mitoloji, tarih ve gizli gerçeklerin arşivinde arama yapın.
        </p>

        <form method="GET" action="/arama" className="mt-6 flex gap-2">
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Örnek: Gılgamış, Atlantis, Olympos..."
              className="h-12 pl-10 text-base"
              autoFocus
            />
          </div>
          <Button type="submit" size="lg" className="h-12">
            Ara
          </Button>
        </form>
      </div>

      <div className="mx-auto mt-12 max-w-6xl">
        {query.length < 2 ? (
          <div className="rounded-xl border border-dashed border-foreground/10 bg-card/40 p-12 text-center">
            <SearchIcon className="mx-auto h-10 w-10 text-muted-foreground/60" />
            <p className="mt-4 text-muted-foreground">
              Aramaya başlamak için en az 2 karakter girin.
            </p>
          </div>
        ) : (
          <Suspense>
            <h2 className="mb-6 text-sm uppercase tracking-widest text-muted-foreground">
              <span className="text-foreground">{results.length}</span> sonuç
              bulundu
              {query ? (
                <>
                  {" "}
                  — <span className="italic text-foreground">“{query}”</span>
                </>
              ) : null}
            </h2>

            {results.length === 0 ? (
              <div className="rounded-xl border border-dashed border-foreground/10 bg-card/40 p-12 text-center">
                <p className="text-muted-foreground">
                  Sonuç bulunamadı. Farklı bir anahtar kelime deneyin.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </Suspense>
        )}
      </div>
    </div>
  );
}
