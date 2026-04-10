import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { categories as categoriesTable } from '@/db/schema'

type Category = typeof categoriesTable.$inferSelect

interface CategoryGridProps {
  categories: Category[]
}

// Fallback categories in case DB is empty
const FALLBACK_CATEGORIES: Category[] = [
  {
    id: 1,
    slug: 'mitoloji',
    name: 'Mitoloji',
    nameEn: 'Mythology',
    description: 'Tanrılar, kahramanlar ve kadim efsaneler',
    color: '#b8893a',
    icon: '☉',
    youtubeChannel: null,
    order: 1,
  },
  {
    id: 2,
    slug: 'tarih',
    name: 'Tarih',
    nameEn: 'History',
    description: 'Kayıp uygarlıklar ve unutulmuş olaylar',
    color: '#8b1e2d',
    icon: '⚜',
    youtubeChannel: null,
    order: 2,
  },
  {
    id: 3,
    slug: 'gercekler',
    name: 'Gerçekler',
    nameEn: 'Truths',
    description: 'Bilim ve gizemin buluştuğu nokta',
    color: '#d4a857',
    icon: '✦',
    youtubeChannel: null,
    order: 3,
  },
]

const ICON_FALLBACKS: Record<string, string> = {
  mitoloji: '☉',
  tarih: '⚜',
  gercekler: '✦',
  semboller: '☥',
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  const list = (categories.length ? categories : FALLBACK_CATEGORIES).slice(0, 3)

  return (
    <section
      id="kategoriler"
      aria-labelledby="kategoriler-heading"
      className="relative w-full overflow-hidden bg-background py-28 sm:py-36"
    >
      {/* Top divider */}
      <div className="mx-auto mb-16 flex max-w-5xl flex-col items-center px-6 text-center">
        <p className="mb-4 font-sans text-[10px] font-semibold uppercase tracking-[0.4em] text-gold">
          Keşif
        </p>
        <h2
          id="kategoriler-heading"
          className="font-display text-4xl font-bold tracking-wide text-foreground sm:text-5xl md:text-6xl"
        >
          Üç Kapı
        </h2>
        <div
          aria-hidden="true"
          className="mt-8 h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent"
        />
        <p className="mt-8 max-w-xl font-serif text-lg italic text-muted-foreground sm:text-xl">
          Hangisinin ardından geçeceksin?
        </p>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 md:grid-cols-3 md:gap-8">
        {list.map((cat, i) => {
          const accent = cat.color ?? (i === 1 ? '#8b1e2d' : '#b8893a')
          const icon = cat.icon ?? ICON_FALLBACKS[cat.slug] ?? '✦'
          return (
            <Link
              key={cat.id}
              href={`/${cat.slug}`}
              aria-label={`${cat.name} kategorisini keşfet`}
              className="group relative flex min-h-[420px] flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all duration-700 ease-out hover:-translate-y-2 hover:border-[color:var(--gold)]/60 hover:shadow-[0_30px_80px_-20px_rgba(212,168,87,0.45)]"
              style={
                {
                  ['--cat-accent' as string]: accent,
                } as React.CSSProperties
              }
            >
              {/* Gradient backdrop */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-700 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(circle at 30% 0%, ${accent}25 0%, transparent 60%), linear-gradient(180deg, transparent 0%, ${accent}10 100%)`,
                }}
              />
              {/* Animated orb */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-20 blur-3xl transition-all duration-1000 group-hover:scale-125 group-hover:opacity-40"
                style={{ background: accent }}
              />

              {/* Content */}
              <div className="relative z-10">
                <div
                  className="mb-8 flex h-16 w-16 items-center justify-center rounded-xl border border-[color:var(--gold)]/30 bg-background/40 font-display text-3xl backdrop-blur-sm transition-all duration-700 group-hover:scale-110 group-hover:border-[color:var(--gold)]/70"
                  style={{ color: accent }}
                >
                  {icon}
                </div>
                <p className="mb-2 font-sans text-[10px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">
                  Kategori 0{i + 1}
                </p>
                <h3 className="font-display text-3xl font-bold tracking-wide text-foreground sm:text-4xl">
                  {cat.name}
                </h3>
                <p className="mt-4 max-w-xs font-serif text-lg italic leading-relaxed text-muted-foreground">
                  {cat.description ?? 'Kadim bilgelik seni bekliyor.'}
                </p>
              </div>

              <div className="relative z-10 mt-8 flex items-center gap-3 font-sans text-sm font-semibold uppercase tracking-[0.18em] text-foreground transition-colors duration-500 group-hover:text-gold">
                <span>Keşfet</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1.5" />
              </div>

              {/* Bottom border accent */}
              <div
                aria-hidden="true"
                className="absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-700 group-hover:w-full"
                style={{
                  background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
                }}
              />
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default CategoryGrid
