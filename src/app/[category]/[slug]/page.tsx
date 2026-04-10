import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/db";
import {
  posts,
  categories,
  users,
  postTags,
  tags,
} from "@/db/schema";
import { eq, and, desc, sql, ne } from "drizzle-orm";
import { PostHeader } from "@/components/post/PostHeader";
import { ArticleBody } from "@/components/post/ArticleBody";
import { ShareButtons } from "@/components/post/ShareButtons";
import { PostCard, type PostCardData } from "@/components/post/PostCard";
import { Heart } from "lucide-react";
import { markdownToHtml } from "@/lib/markdown";
import { SITE } from "@/lib/constants";
import CommentSection from "@/components/comments/CommentSection";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams() {
  const rows = await db
    .select({
      categorySlug: categories.slug,
      slug: posts.slug,
    })
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .where(eq(posts.status, "published"));

  return rows
    .filter((r) => r.categorySlug)
    .map((r) => ({ category: r.categorySlug as string, slug: r.slug }));
}

async function fetchPost(categorySlug: string, slug: string) {
  const rows = await db
    .select({
      post: posts,
      category: categories,
      author: users,
    })
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .leftJoin(users, eq(posts.authorId, users.id))
    .where(
      and(
        eq(posts.slug, slug),
        eq(posts.status, "published"),
        eq(categories.slug, categorySlug)
      )
    )
    .limit(1);
  return rows[0] ?? null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const data = await fetchPost(category, slug);
  if (!data || !data.post || !data.category) {
    return { title: "Yazı bulunamadı" };
  }
  const { post, category: cat, author } = data;
  const title = post.title;
  const description = post.excerpt ?? `${cat.name} — ${SITE.name}`;
  const url = `${SITE.url}/${cat.slug}/${post.slug}`;
  const image = post.coverImage ?? SITE.ogImage;

  // Tag list for article meta
  const tagRows = await db
    .select({ name: tags.name })
    .from(postTags)
    .innerJoin(tags, eq(tags.id, postTags.tagId))
    .where(eq(postTags.postId, post.id));
  const tagNames = tagRows.map((t) => t.name);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      siteName: SITE.name,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      publishedTime: (post.publishedAt ?? post.createdAt).toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: author?.name ? [author.name] : undefined,
      tags: tagNames,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

async function incrementViewCount(postId: number) {
  try {
    await db
      .update(posts)
      .set({ viewCount: sql`${posts.viewCount} + 1` })
      .where(eq(posts.id, postId));
  } catch {
    // ignore
  }
}

export default async function PostPage({ params }: PageProps) {
  const { category: categorySlug, slug } = await params;
  const data = await fetchPost(categorySlug, slug);
  if (!data || !data.post || !data.category) notFound();

  const { post, category, author } = data;

  // Increment view count on each visit (server-side)
  await incrementViewCount(post.id);

  const html = await markdownToHtml(post.content);

  // Tags
  const postTagRows = await db
    .select({ id: tags.id, slug: tags.slug, name: tags.name })
    .from(postTags)
    .innerJoin(tags, eq(tags.id, postTags.tagId))
    .where(eq(postTags.postId, post.id));

  // Related posts (same category, exclude current)
  const relatedRows = await db
    .select({
      id: posts.id,
      slug: posts.slug,
      title: posts.title,
      excerpt: posts.excerpt,
      coverImage: posts.coverImage,
      readingTime: posts.readingTime,
      publishedAt: posts.publishedAt,
      createdAt: posts.createdAt,
      authorName: users.name,
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .where(
      and(
        eq(posts.categoryId, category.id),
        eq(posts.status, "published"),
        ne(posts.id, post.id)
      )
    )
    .orderBy(desc(posts.publishedAt))
    .limit(3);

  const related: PostCardData[] = relatedRows.map((r) => ({
    ...r,
    categorySlug: category.slug,
    categoryName: category.name,
  }));

  const fullUrl = `${SITE.url}/${category.slug}/${post.slug}`;

  return (
    <article className="min-h-screen pb-24">
      <PostHeader
        title={post.title}
        coverImage={post.coverImage}
        categorySlug={category.slug}
        categoryName={category.name}
        authorName={author?.name ?? null}
        authorImage={author?.image ?? null}
        publishedAt={post.publishedAt}
        createdAt={post.createdAt}
        readingTime={post.readingTime}
        viewCount={post.viewCount + 1}
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {post.youtubeVideoId ? (
          <div className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-2xl ring-1 ring-foreground/10">
            <div className="relative aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${post.youtubeVideoId}`}
                title={post.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </div>
        ) : null}

        <div className="mt-12">
          <ArticleBody html={html} />
        </div>

        {/* Tags */}
        {postTagRows.length > 0 ? (
          <div className="mx-auto mt-12 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-muted-foreground mr-2">
                Etiketler
              </span>
              {postTagRows.map((t) => (
                <span
                  key={t.id}
                  className="inline-flex items-center rounded-full bg-card px-3 py-1 text-xs text-foreground/80 ring-1 ring-foreground/10"
                >
                  #{t.name}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {/* Like + share */}
        <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-between gap-4 border-y border-foreground/10 py-6">
          <button
            type="button"
            aria-label="Beğen"
            className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm text-foreground/80 ring-1 ring-foreground/10 transition-colors hover:text-amber-400 hover:ring-amber-500/40"
          >
            <Heart className="size-4" />
            <span>Beğen</span>
          </button>
          <ShareButtons url={fullUrl} title={post.title} />
        </div>

        {/* Author bio */}
        {author ? (
          <div className="mx-auto mt-12 max-w-3xl rounded-2xl bg-card p-6 ring-1 ring-foreground/10">
            <div className="flex items-start gap-4">
              {author.image ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={author.image}
                  alt={author.name ?? "Yazar"}
                  className="size-16 rounded-full object-cover ring-1 ring-amber-500/40"
                />
              ) : (
                <div className="flex size-16 items-center justify-center rounded-full bg-amber-500/20 text-xl font-semibold text-amber-400 ring-1 ring-amber-500/40">
                  {(author.name ?? "K").charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wider text-amber-400">Yazar</p>
                <h4 className="font-[family-name:var(--font-cinzel,serif)] mt-1 text-xl font-semibold text-foreground">
                  {author.name ?? "Kadim Gizem"}
                </h4>
                {author.bio ? (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {author.bio}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        {/* Related */}
        {related.length > 0 ? (
          <div className="mx-auto mt-16 max-w-5xl">
            <h2 className="font-[family-name:var(--font-cinzel,serif)] mb-8 text-center text-3xl font-bold tracking-tight text-foreground">
              Bu Kategoriden Daha Fazla
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <PostCard key={r.id} post={r} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href={`/${category.slug}`}
                className="inline-flex items-center gap-1 text-sm text-amber-400 hover:text-amber-300"
              >
                Tüm {category.name} yazıları →
              </Link>
            </div>
          </div>
        ) : null}

        {/* Comments */}
        <CommentSection postId={post.id} />
      </div>
    </article>
  );
}
