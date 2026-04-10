import Link from "next/link"
import { and, desc, eq, ilike } from "drizzle-orm"
import { db } from "@/db"
import { comments, posts, users } from "@/db/schema"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button, buttonVariants } from "@/components/ui/button"
import { CommentActions } from "@/components/admin/CommentActions"
import { Search } from "lucide-react"

export default async function CommentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; filter?: string }>
}) {
  const sp = await searchParams
  const q = sp.q?.trim() || ""
  const filter = sp.filter || "all"

  const where = and(
    q ? ilike(comments.content, `%${q}%`) : undefined,
    filter === "approved" ? eq(comments.isApproved, true) : undefined,
    filter === "pending" ? eq(comments.isApproved, false) : undefined,
    filter === "deleted" ? eq(comments.isDeleted, true) : undefined
  )

  const rows = await db
    .select({
      id: comments.id,
      content: comments.content,
      createdAt: comments.createdAt,
      isApproved: comments.isApproved,
      isDeleted: comments.isDeleted,
      authorName: users.name,
      authorEmail: users.email,
      postTitle: posts.title,
      postSlug: posts.slug,
    })
    .from(comments)
    .leftJoin(users, eq(comments.userId, users.id))
    .leftJoin(posts, eq(comments.postId, posts.id))
    .where(where)
    .orderBy(desc(comments.createdAt))
    .limit(100)

  const tabs = [
    { key: "all", label: "Tümü" },
    { key: "pending", label: "Bekleyen" },
    { key: "approved", label: "Onaylı" },
    { key: "deleted", label: "Silinen" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Yorumlar</h1>
        <p className="text-muted-foreground mt-1">
          Yorumları onayla, reddet veya sil.
        </p>
      </div>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex gap-2">
            {tabs.map((t) => (
              <Link
                key={t.key}
                href={{ pathname: "/admin/comments", query: { ...sp, filter: t.key } }}
                className={buttonVariants({
                  variant: filter === t.key ? "default" : "outline",
                  size: "sm",
                })}
              >
                {t.label}
              </Link>
            ))}
          </div>
          <form className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                name="q"
                defaultValue={q}
                placeholder="Yorum içeriğinde ara…"
                className="pl-9"
              />
            </div>
            <input type="hidden" name="filter" value={filter} />
            <Button type="submit" variant="secondary">
              Ara
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/30">
              <tr className="text-left">
                <th className="p-3 font-medium">Yazar</th>
                <th className="p-3 font-medium">Yazı</th>
                <th className="p-3 font-medium">İçerik</th>
                <th className="p-3 font-medium">Tarih</th>
                <th className="p-3 font-medium">Durum</th>
                <th className="p-3 font-medium text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-muted-foreground"
                  >
                    Yorum bulunamadı.
                  </td>
                </tr>
              )}
              {rows.map((c) => (
                <tr key={c.id} className="hover:bg-muted/20 align-top">
                  <td className="p-3">
                    <p className="font-medium">{c.authorName || "Anonim"}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.authorEmail}
                    </p>
                  </td>
                  <td className="p-3">
                    {c.postSlug ? (
                      <Link
                        href={`/yazi/${c.postSlug}`}
                        className="hover:underline text-xs"
                      >
                        {c.postTitle}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="p-3 max-w-md">
                    <p className="line-clamp-3">{c.content}</p>
                  </td>
                  <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(c.createdAt).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="p-3">
                    {c.isDeleted ? (
                      <Badge variant="destructive">Silindi</Badge>
                    ) : c.isApproved ? (
                      <Badge>Onaylı</Badge>
                    ) : (
                      <Badge variant="secondary">Bekliyor</Badge>
                    )}
                  </td>
                  <td className="p-3">
                    <CommentActions
                      id={c.id}
                      approved={c.isApproved}
                      deleted={c.isDeleted}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
