import Link from "next/link"
import { notFound } from "next/navigation"
import { eq } from "drizzle-orm"
import { db } from "@/db"
import { posts, categories } from "@/db/schema"
import { PostEditor } from "@/components/admin/PostEditor"
import { buttonVariants } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const postId = Number(id)
  if (!Number.isFinite(postId)) notFound()

  const [post] = await db.select().from(posts).where(eq(posts.id, postId)).limit(1)
  if (!post) notFound()

  const cats = await db
    .select({ id: categories.id, name: categories.name })
    .from(categories)
    .orderBy(categories.order)

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/posts" className={buttonVariants({ variant: "ghost", size: "icon" })}>
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Yazıyı Düzenle</h1>
          <p className="text-sm text-muted-foreground">#{post.id} — {post.title}</p>
        </div>
      </div>

      <PostEditor
        post={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage,
          categoryId: post.categoryId,
          youtubeVideoId: post.youtubeVideoId,
          featured: post.featured,
          status: post.status,
        }}
        categories={cats}
      />
    </div>
  )
}
