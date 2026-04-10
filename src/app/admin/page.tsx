import Link from "next/link"
import { db } from "@/db"
import { posts, comments, users, categories } from "@/db/schema"
import { count, desc, eq } from "drizzle-orm"
import { StatCard } from "@/components/admin/StatCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, MessageSquare, Users as UsersIcon, FolderTree, Plus, Eye } from "lucide-react"

export default async function AdminDashboard() {
  const [[{ postCount }], [{ commentCount }], [{ userCount }], [{ categoryCount }]] =
    await Promise.all([
      db.select({ postCount: count() }).from(posts),
      db.select({ commentCount: count() }).from(comments),
      db.select({ userCount: count() }).from(users),
      db.select({ categoryCount: count() }).from(categories),
    ])

  const recentPosts = await db
    .select({
      id: posts.id,
      title: posts.title,
      status: posts.status,
      createdAt: posts.createdAt,
      categoryName: categories.name,
    })
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .orderBy(desc(posts.createdAt))
    .limit(10)

  const pendingComments = await db
    .select({
      id: comments.id,
      content: comments.content,
      createdAt: comments.createdAt,
      userName: users.name,
    })
    .from(comments)
    .leftJoin(users, eq(comments.userId, users.id))
    .where(eq(comments.isApproved, false))
    .orderBy(desc(comments.createdAt))
    .limit(10)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Hoş geldin. İşte sitenin güncel durumu.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/posts/new" className={buttonVariants()}>
            <Plus className="w-4 h-4 mr-2" />
            Yeni Yazı
          </Link>
          <Link href="/admin/comments" className={buttonVariants({ variant: "outline" })}>
            <MessageSquare className="w-4 h-4 mr-2" />
            Yorumları Yönet
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Toplam Yazı" value={postCount} icon={FileText} />
        <StatCard title="Toplam Yorum" value={commentCount} icon={MessageSquare} />
        <StatCard title="Toplam Kullanıcı" value={userCount} icon={UsersIcon} />
        <StatCard title="Kategori" value={categoryCount} icon={FolderTree} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Son Yazılar</CardTitle>
            <Link href="/admin/posts" className={buttonVariants({ variant: "ghost", size: "sm" })}>
              Tümü
            </Link>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {recentPosts.length === 0 && (
                <p className="text-sm text-muted-foreground py-6 text-center">
                  Henüz yazı yok.
                </p>
              )}
              {recentPosts.map((post) => (
                <div key={post.id} className="py-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="font-medium hover:underline truncate block"
                    >
                      {post.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      {post.categoryName && <span>{post.categoryName}</span>}
                      <span>•</span>
                      <span>
                        {new Date(post.createdAt).toLocaleDateString("tr-TR")}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={post.status === "published" ? "default" : "secondary"}
                  >
                    {post.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Bekleyen Yorumlar
              {pendingComments.length > 0 && (
                <Badge variant="destructive">{pendingComments.length}</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingComments.length === 0 && (
                <p className="text-sm text-muted-foreground py-6 text-center">
                  Bekleyen yorum yok.
                </p>
              )}
              {pendingComments.map((c) => (
                <div key={c.id} className="p-3 rounded-md bg-muted/40 text-sm">
                  <p className="font-medium text-xs">{c.userName || "Anonim"}</p>
                  <p className="text-muted-foreground mt-1 line-clamp-2">
                    {c.content}
                  </p>
                </div>
              ))}
              {pendingComments.length > 0 && (
                <Link
                  href="/admin/comments"
                  className={buttonVariants({ variant: "outline", size: "sm", className: "w-full" })}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Tümünü Gör
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
