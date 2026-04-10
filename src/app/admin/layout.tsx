import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ExternalLink } from "lucide-react"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user || session.user.role !== "admin") {
    redirect("/")
  }

  const user = session.user
  const initial = (user.name || user.email || "A").charAt(0).toUpperCase()

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b bg-card/50 backdrop-blur flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/admin" className="hover:text-foreground transition-colors">
              Admin
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/" className={buttonVariants({ variant: "outline", size: "sm" })}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Site&apos;ye Dön
            </Link>

            <div className="flex items-center gap-2 pl-3 border-l">
              <Avatar className="w-8 h-8">
                {user.image && <AvatarImage src={user.image} alt={user.name || ""} />}
                <AvatarFallback>{initial}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium leading-none">
                  {user.name || user.email}
                </span>
                <Badge variant="secondary" className="mt-1 text-[10px] h-4 px-1.5 w-fit">
                  ADMIN
                </Badge>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
