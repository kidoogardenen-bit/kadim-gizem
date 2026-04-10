"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  MessageSquare,
  Users,
  Settings,
} from "lucide-react"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/posts", label: "Yazılar", icon: FileText },
  { href: "/admin/categories", label: "Kategoriler", icon: FolderTree },
  { href: "/admin/comments", label: "Yorumlar", icon: MessageSquare },
  { href: "/admin/users", label: "Kullanıcılar", icon: Users },
  { href: "/admin/settings", label: "Ayarlar", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 shrink-0 border-r bg-card/50 min-h-screen">
      <div className="p-6 border-b">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold">
            K
          </div>
          <div>
            <p className="font-semibold leading-none">Kadim Gizem</p>
            <p className="text-xs text-muted-foreground mt-0.5">Admin Paneli</p>
          </div>
        </Link>
      </div>

      <nav className="p-3 space-y-1">
        {navItems.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                active
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
