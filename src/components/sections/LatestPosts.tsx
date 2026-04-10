import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Clock, BookOpen } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { posts as postsTable, categories as categoriesTable } from '@/db/schema'

type Post = typeof postsTable.$inferSelect
type Category = typeof categoriesTable.$inferSelect

interface LatestPostsProps {
  posts: Post[]
  categoryMap?: Record<number, Category>
}

const PLACEHOLDER_GRADIENTS = [
  'linear-gradient(135deg, #1a1410 0%, #3a2f24 50%, #b8893a 100%)',
  'linear-gradient(135deg, #0f0b08 0%, #26201a 50%, #8b1e2d 100%)',
  'linear-gradient(135deg, #1a1410 0%, #3a2f24 50%, #d4a857 100%)',
  'linear-gradient(135deg, #0f0b08 0%, #26201a 50%, #b33343 100%)',
  'linear-gradient(135deg, #1a1410 0%, #3a2f24 50%, #8b6420 100%)',
  'linear-gradient(135deg, #0f0b08 0%, #26201a 50%, #d4455a 100%)',
]

export function LatestPosts({ posts, categoryMap = {} }: LatestPostsProps) {
  return (
    <section
      aria-labelledby="son-yazilar-heading"
      className="relative w-full overflow-hidden bg-parchment bg-parchment-texture py-28 sm:py-36"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 flex flex-col items-center text-center">
          <p className="mb-4 font-sans text-[10px] font-semibold uppercase tracking-[0.4em] text-gold">
            Arşiv
          </p>
          <h2
            id="son-yazilar-heading"
            className="font-display text-4xl font-bold tracking-wide text-ink sm:text-5xl md:text-6xl"
          >
            Son Yazılar
          </h2>
          <div
            aria-hidden="true"
            className="mt-8 h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent"
          />
          <p className="mt-8 max-w-xl font-serif text-lg italic text-ink-light sm:text-xl">
            Kadim bilgelerin son sözleri…
          </p>
        </div>

        {posts.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {posts.map((post, i) => {
                const cat = post.categoryId ? categoryMap[post.categoryId] : null
                const gradient = PLACEHOLDER_GRADIENTS[i % PLACEHOLDER_GRADIENTS.length]
                return (
                  <article key={post.id}>
                    <Link
                      href={`/yazi/${post.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-700 ease-out hover:-translate-y-1.5 hover:border-gold/60 hover:shadow-[0_25px_70px_-25px_rgba(184,137,58,0.5)]"
                    >
                      {/* Cover */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden">
                        {post.coverImage ? (
                          <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                          />
                        ) : (
                          <div
                            className="h-full w-full transition-transform duration-1000 ease-out group-hover:scale-105"
                            style={{ background: gradient }}
                            aria-hidden="true"
                          >
                            <div className="bg-starfield h-full w-full opacity-50" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        {cat && (
                          <Badge
                            variant="secondary"
                            className="absolute left-4 top-4 border-gold/40 bg-background/80 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-gold backdrop-blur-md"
                          >
                            {cat.name}
                          </Badge>
                        )}
                      </div>

                      {/* Body */}
                      <div className="flex flex-1 flex-col p-6 sm:p-7">
                        <h3 className="font-display text-xl font-bold leading-snug tracking-wide text-ink text-balance transition-colors duration-500 group-hover:text-gold-dark sm:text-2xl">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="mt-3 line-clamp-3 font-serif text-base leading-relaxed text-ink-light text-pretty sm:text-lg">
                            {post.excerpt}
                          </p>
                        )}

                        <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
                          <div className="flex items-center gap-2 font-sans text-xs text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{post.readingTime ?? 5} dk okuma</span>
                          </div>
                          <span className="flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-ink transition-colors duration-500 group-hover:text-gold-dark">
                            Devamını Oku
                            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </article>
                )
              })}
            </div>

            <div className="mt-16 flex justify-center">
              <Link
                href="/arsiv"
                className={cn(
                  buttonVariants({ size: 'lg', variant: 'outline' }),
                  'h-12 rounded-full border-gold/40 bg-transparent px-10 font-sans text-sm font-semibold uppercase tracking-[0.18em] text-ink transition-all duration-500 hover:border-gold hover:bg-gold/10 hover:text-ink'
                )}
              >
                Tüm Yazılar
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

function EmptyState() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-dashed border-gold/30 bg-card/40 px-8 py-16 text-center">
      <BookOpen className="mb-6 h-10 w-10 text-gold" aria-hidden="true" />
      <h3 className="font-display text-2xl font-bold tracking-wide text-ink">
        Arşiv Henüz Sessiz
      </h3>
      <p className="mt-3 font-serif text-base italic text-ink-light">
        İlk hikâyeler çok yakında bu sayfalara nakşedilecek. Geri dönmeyi
        unutma.
      </p>
    </div>
  )
}

export default LatestPosts
