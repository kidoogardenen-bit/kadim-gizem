import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/db";
import {
  categories,
  posts,
  users,
  postTags,
  tags,
} from "@/db/schema";
import { eq, desc, asc, and, sql } from "drizzle-orm";
import {
  AncientPillarsScene,
  PapyrusGlobeScene,
  ParticleStormScene,
} from "@/components/3d";
import { PostCard, type PostCardData } from "@/components/post/PostCard";
import { Badge } from "@/components/ui/badge";
import { SITE } from "@/lib/constants";

export const revalidate = 300;

export async function generateStaticParams() {
  return [
    { category: "mitoloji" },
    { category: "tarih" },
    { category: "gercekler" },
  ];
}

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ sort?: string; page?: string }>;
}

const SCENES: Record<string, React.ComponentType<{ className?: string }>> = {
  mitoloji: AncientPillarsScene,
  tarih: PapyrusGlobeScene,
  gercekler: ParticleStormScene,
};

const PER_PAGE = 12;

async function fetchCategory(slug: string) {
  const rows = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);
  return rows[0] ?? null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await fetchCategory(slug);
  if (!category) return { title: "Kategori bulunamadı" };

  const title = `${category.name}`;
  const description =
    category.description ?? `${SITE.name} — ${category.name} yazıları`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${SITE.name}`,
      description,
      type: "website",
      url: `${SITE.url}/${slug}`,
      siteName: SITE.name,
      images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: { canonical: `${SITE.url}/${slug}` },
  };
}

function buildOrderBy(sort: string | undefined) {
  switch (sort) {
    case "popular":
      return desc(posts.viewCount);
    case "oldest":
      return asc(posts.publishedAt);
    case "latest":
    default:
      return desc(posts.publishedAt);
  }
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { category: slug } = await params;
  const { sort, page: pageStr } = await searchParams;
  const page = Math.max(1, Number(pageStr) || 1);

  const category = await fetchCategory(slug);
  if (!category) notFound();

  const Scene = SCENES[slug];

  const where = and(
    eq(posts.categoryId, category.id),
    eq(posts.status, "published")
  );

  const [{ total }] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(posts)
    .where(where);

  const offset = (page - 1) * PER_PAGE;

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
      authorName: users.name,
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .where(where)
    .orderBy(buildOrderBy(sort))
    .limit(PER_PAGE)
    .offset(offset);

  const cards: PostCardData[] = rows.map((r) => ({
    ...r,
    categorySlug: category.slug,
    categoryName: category.name,
  }));

  // Sidebar data
  const recentRows = await db
    .select({
      id: posts.id,
      slug: posts.slug,
      title: posts.title,
      publishedAt: posts.publishedAt,
      createdAt: posts.createdAt,
    })
    .from(posts)
    .where(where)
    .orderBy(desc(posts.publishedAt))
    .limit(5);

  const featuredRows = await db
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
    .where(and(where, eq(posts.featured, true)))
    .orderBy(desc(posts.publishedAt))
    .limit(1);

  const featured = featuredRows[0]
    ? ({
        ...featuredRows[0],
        categorySlug: category.slug,
        categoryName: category.name,
      } as PostCardData)
    : null;

  const tagRows = await db
    .select({
      id: tags.id,
      slug: tags.slug,
      name: tags.name,
      count: sql<number>`count(${postTags.postId})::int`,
    })
    .from(tags)
    .innerJoin(postTags, eq(postTags.tagId, tags.id))
    .innerJoin(posts, eq(posts.id, postTags.postId))
    .where(where)
    .groupBy(tags.id, tags.slug, tags.name)
    .orderBy(desc(sql`count(${postTags.postId})`))
    .limit(20);

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const currentSort = sort ?? "latest";

  return (
    <main className="min-h-screen">
      {/* HERO */}
      <section className="relative h-[60vh] min-h-[460px] w-full overflow-hidden">
        {Scene ? (
          <div className="absolute inset-0">
            <Scene className="h-full w-full" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <Badge className="mb-6 bg-amber-500/90 text-black backdrop-blur">
            Kategori
          </Badge>
          <h1 className="font-[family-name:var(--font-cinzel,serif)] text-5xl font-bold tracking-tight text-foreground drop-shadow-2xl sm:text-6xl lg:text-7xl">
            {category.name}
          </h1>
          {category.description ? (
            <p className="mt-6 max-w-2xl text-lg text-foreground/80">
              {category.description}
            </p>
          ) : null}
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
          {/* Posts column */}
          <div>
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                Toplam <span className="text-foreground">{total}</span> yazı
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  Sıralama:
                </span>
                <SortLink slug={slug} value="latest" current={currentSort} label="En Yeni" />
                <SortLink slug={slug} value="popular" current={currentSort} label="En Çok Okunan" />
                <SortLink slug={slug} value="oldest" current={currentSort} label="En Eski" />
              </div>
            </div>

            {cards.length === 0 ? (
              <div className="rounded-xl border border-dashed border-foreground/10 p-16 text-center">
                <p className="text-muted-foreground">
                  Bu kategoride henüz yazı bulunmuyor.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {cards.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 ? (
              <nav
                aria-label="Sayfalama"
                className="mt-12 flex items-center justify-center gap-2"
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                  const params = new URLSearchParams();
                  if (currentSort !== "latest") params.set("sort", currentSort);
                  if (p > 1) params.set("page", String(p));
                  const href = `/${slug}${params.toString() ? `?${params.toString()}` : ""}`;
                  const active = p === page;
                  return (
                    <Link
                      key={p}
                      href={href}
                      className={
                        "inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-medium ring-1 transition-colors " +
                        (active
                          ? "bg-amber-500 text-black ring-amber-500"
                          : "bg-card text-foreground ring-foreground/10 hover:ring-amber-500/40")
                      }
                    >
                      {p}
                    </Link>
                  );
                })}
              </nav>
            ) : null}
          </div>

          {/* Sidebar */}
          <aside className="space-y-10">
            {featured ? (
              <div>
                <h3 className="mb-4 text-xs uppercase tracking-widest text-amber-400">
                  Öne Çıkan
                </h3>
                <PostCard post={featured} />
              </div>
            ) : null}

            {tagRows.length > 0 ? (
              <div>
                <h3 className="mb-4 text-xs uppercase tracking-widest text-amber-400">
                  Etiketler
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tagRows.map((t) => (
                    <span
                      key={t.id}
                      className="inline-flex items-center rounded-full bg-card px-3 py-1 text-xs text-foreground/80 ring-1 ring-foreground/10"
                    >
                      {t.name}
                      <span className="ml-1.5 text-amber-400">{t.count}</span>
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {recentRows.length > 0 ? (
              <div>
                <h3 className="mb-4 text-xs uppercase tracking-widest text-amber-400">
                  Son Yazılar
                </h3>
                <ul className="space-y-3">
                  {recentRows.map((r) => (
                    <li key={r.id}>
                      <Link
                        href={`/${slug}/${r.slug}`}
                        className="block text-sm leading-snug text-foreground/80 hover:text-amber-400"
                      >
                        {r.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>
      </section>
    </main>
  );
}

function SortLink({
  slug,
  value,
  current,
  label,
}: {
  slug: string;
  value: string;
  current: string;
  label: string;
}) {
  const params = new URLSearchParams();
  if (value !== "latest") params.set("sort", value);
  const href = `/${slug}${params.toString() ? `?${params.toString()}` : ""}`;
  const active = current === value;
  return (
    <Link
      href={href}
      className={
        "rounded-full px-3 py-1 text-xs ring-1 transition-colors " +
        (active
          ? "bg-amber-500 text-black ring-amber-500"
          : "bg-card text-foreground/70 ring-foreground/10 hover:text-amber-400 hover:ring-amber-500/40")
      }
    >
      {label}
    </Link>
  );
}
