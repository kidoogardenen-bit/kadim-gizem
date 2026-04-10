import Link from "next/link"
import { and, desc, eq, ilike, or, count } from "drizzle-orm"
import { db } from "@/db"
import { posts, categories, users } from "@/db/schema"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DeletePostButton } from "@/components/admin/DeletePostButton"
import { Plus, Pencil, Eye, Search } from "lucide-react"

const PAGE_SIZE = 20

export default async function PostsListPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string
    status?: string
    category?: string
    page?: string
  }>
}) {
  const sp = await searchParams
  const q = sp.q?.trim() || ""
  const status = sp.status || ""
  const categoryId = sp.category ? Number(sp.category) : undefined
  const page = Math.max(1, Number(sp.page) || 1)

  const where = and(
    q ? or(ilike(posts.title, `%${q}%`), ilike(posts.slug, `%${q}%`)) : undefined,
    status ? eq(posts.status, status as "draft" | "published" | "archived") : undefined,
    categoryId ? eq(posts.categoryId, categoryId) : undefined
  )

  const [rows, [{ total }], cats] = await Promise.all([
    db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        status: posts.status,
        createdAt: posts.createdAt,
        categoryName: categories.name,
        authorName: users.name,
      })
      .from(posts)
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .leftJoin(users, eq(posts.authorId, users.id))
      .where(where)
      .orderBy(desc(posts.createdAt))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db.select({ total: count() }).from(posts).where(where),
    db.select({ id: categories.id, name: categories.name }).from(categories),
  ])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Yazılar</h1>
          <p className="text-muted-foreground mt-1">Tüm yazıları yönet.</p>
        </div>
        <Link href="/admin/posts/new" className={buttonVariants()}>
          <Plus className="w-4 h-4 mr-2" />
          Yeni Yazı
        </Link>
      </div>

      <Card>
        <CardContent className="p-4">
          <form className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs text-muted-foreground">Ara</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  name="q"
                  defaultValue={q}
                  placeholder="Başlık veya slug…"
                  className="pl-9"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Durum</label>
              <select
                name="status"
                defaultValue={status}
                className="block h-9 rounded-md border border-input bg-transparent px-3 text-sm"
              >
                <option value="">Tümü</option>
                <option value="draft">Taslak</option>
                <option value="published">Yayında</option>
                <option value="archived">Arşiv</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Kategori</label>
              <select
                name="category"
                defaultValue={sp.category || ""}
                className="block h-9 rounded-md border border-input bg-transparent px-3 text-sm"
              >
                <option value="">Tümü</option>
                {cats.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" variant="secondary">
              Filtrele
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/30">
              <tr className="text-left">
                <th className="p-3 font-medium">Başlık</th>
                <th className="p-3 font-medium">Kategori</th>
                <th className="p-3 font-medium">Yazar</th>
                <th className="p-3 font-medium">Durum</th>
                <th className="p-3 font-medium">Tarih</th>
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
                    Yazı bulunamadı.
                  </td>
                </tr>
              )}
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-muted/20">
                  <td className="p-3">
                    <Link
                      href={`/admin/posts/${row.id}/edit`}
                      className="font-medium hover:underline"
                    >
                      {row.title}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      /{row.slug}
                    </p>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {row.categoryName || "—"}
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {row.authorName || "—"}
                  </td>
                  <td className="p-3">
                    <Badge
                      variant={row.status === "published" ? "default" : "secondary"}
                    >
                      {row.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-muted-foreground text-xs">
                    {new Date(row.createdAt).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/yazi/${row.slug}`}
                        target="_blank"
                        className={buttonVariants({ variant: "ghost", size: "icon" })}
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/posts/${row.id}/edit`}
                        className={buttonVariants({ variant: "ghost", size: "icon" })}
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <DeletePostButton id={row.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Sayfa {page} / {totalPages} • Toplam {total} yazı
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={{
                  pathname: "/admin/posts",
                  query: { ...sp, page: page - 1 },
                }}
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                Önceki
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={{
                  pathname: "/admin/posts",
                  query: { ...sp, page: page + 1 },
                }}
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                Sonraki
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
