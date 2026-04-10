import { desc, ilike, or } from "drizzle-orm"
import { db } from "@/db"
import { users } from "@/db/schema"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { UserRoleSelect } from "@/components/admin/UserRoleSelect"
import { Search } from "lucide-react"

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const sp = await searchParams
  const q = sp.q?.trim() || ""

  const where = q
    ? or(ilike(users.name, `%${q}%`), ilike(users.email, `%${q}%`))
    : undefined

  const rows = await db
    .select()
    .from(users)
    .where(where)
    .orderBy(desc(users.createdAt))
    .limit(100)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Kullanıcılar</h1>
        <p className="text-muted-foreground mt-1">
          Kullanıcıları ve rollerini yönet.
        </p>
      </div>

      <Card>
        <CardContent className="p-4">
          <form className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                name="q"
                defaultValue={q}
                placeholder="İsim veya email…"
                className="pl-9"
              />
            </div>
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
                <th className="p-3 font-medium">Kullanıcı</th>
                <th className="p-3 font-medium">Email</th>
                <th className="p-3 font-medium">Rol</th>
                <th className="p-3 font-medium">Kayıt</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="p-8 text-center text-muted-foreground"
                  >
                    Kullanıcı bulunamadı.
                  </td>
                </tr>
              )}
              {rows.map((u) => {
                const initial = (u.name || u.email || "?")
                  .charAt(0)
                  .toUpperCase()
                return (
                  <tr key={u.id} className="hover:bg-muted/20">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-9 h-9">
                          {u.image && (
                            <AvatarImage src={u.image} alt={u.name || ""} />
                          )}
                          <AvatarFallback>{initial}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{u.name || "—"}</span>
                      </div>
                    </td>
                    <td className="p-3 text-muted-foreground">{u.email}</td>
                    <td className="p-3">
                      <UserRoleSelect userId={u.id} role={u.role} />
                    </td>
                    <td className="p-3 text-xs text-muted-foreground">
                      {new Date(u.createdAt).toLocaleDateString("tr-TR")}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
