import Link from "next/link"
import { db } from "@/db"
import { categories } from "@/db/schema"
import { PostEditor } from "@/components/admin/PostEditor"
import { buttonVariants } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default async function NewPostPage() {
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
          <h1 className="text-2xl font-bold">Yeni Yazı</h1>
          <p className="text-sm text-muted-foreground">
            Yeni bir yazı oluştur ve yayınla.
          </p>
        </div>
      </div>

      <PostEditor categories={cats} />
    </div>
  )
}
