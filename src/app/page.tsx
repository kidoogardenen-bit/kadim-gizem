import type { Metadata } from 'next'
import { desc, eq } from 'drizzle-orm'
import { db } from '@/db'
import { categories, posts } from '@/db/schema'
import { SITE } from '@/lib/constants'
import { Hero } from '@/components/sections/Hero'
import { Manifesto } from '@/components/sections/Manifesto'
import { CategoryGrid } from '@/components/sections/CategoryGrid'
import { LatestPosts } from '@/components/sections/LatestPosts'
import { StatsSection } from '@/components/sections/StatsSection'
import { Newsletter } from '@/components/sections/Newsletter'

export const metadata: Metadata = {
  title: `${SITE.name} — Kadim Bilgeliğin Modern Kapısı`,
  description: SITE.description,
  openGraph: {
    title: SITE.name,
    description: SITE.description,
    type: 'website',
    url: SITE.url,
    images: [{ url: SITE.ogImage }],
  },
}

// Re-validate periodically
export const revalidate = 300

type CategoryRow = typeof categories.$inferSelect
type PostRow = typeof posts.$inferSelect

async function getHomeData(): Promise<{
  categoryRows: CategoryRow[]
  postRows: PostRow[]
  categoryMap: Record<number, CategoryRow>
}> {
  try {
    const [categoryRows, postRows] = await Promise.all([
      db.select().from(categories).orderBy(categories.order),
      db
        .select()
        .from(posts)
        .where(eq(posts.status, 'published'))
        .orderBy(desc(posts.publishedAt))
        .limit(6),
    ])
    const categoryMap: Record<number, CategoryRow> = {}
    for (const c of categoryRows) categoryMap[c.id] = c
    return { categoryRows, postRows, categoryMap }
  } catch (err) {
    console.error('[home] Failed to load DB data:', err)
    return { categoryRows: [], postRows: [], categoryMap: {} }
  }
}

export default async function Home() {
  const { categoryRows, postRows, categoryMap } = await getHomeData()

  return (
    <main id="main" className="relative flex w-full flex-col">
      <Hero />
      <Manifesto />
      <CategoryGrid categories={categoryRows} />
      <LatestPosts posts={postRows} categoryMap={categoryMap} />
      <StatsSection />
      <Newsletter />
    </main>
  )
}
