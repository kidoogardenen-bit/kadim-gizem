import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarDays } from "lucide-react"

export interface ProfileHeroUser {
  id: string
  name: string | null
  email?: string | null
  image: string | null
  bio: string | null
  role: string
  createdAt: Date
}

function formatDate(date: Date): string {
  try {
    return new Date(date).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  } catch {
    return ""
  }
}

function initials(name: string | null): string {
  if (!name) return "K"
  const parts = name.trim().split(/\s+/).slice(0, 2)
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "K"
}

const roleLabels: Record<string, string> = {
  admin: "Yönetici",
  moderator: "Moderatör",
  user: "Üye",
}

export function ProfileHero({ user }: { user: ProfileHeroUser }) {
  return (
    <section className="relative overflow-hidden rounded-2xl ring-1 ring-foreground/10">
      <div className="relative h-40 w-full bg-gradient-to-br from-amber-500/30 via-zinc-800 to-black sm:h-56">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.25),transparent_60%)]" />
      </div>

      <div className="relative -mt-16 flex flex-col items-center gap-4 px-6 pb-6 text-center sm:-mt-20 sm:flex-row sm:items-end sm:text-left">
        <Avatar className="size-28 ring-4 ring-background sm:size-36">
          <AvatarImage src={user.image ?? undefined} alt={user.name ?? "Kullanıcı"} />
          <AvatarFallback className="bg-amber-500/20 text-2xl font-semibold text-amber-300">
            {initials(user.name)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 sm:pb-2">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-[family-name:var(--font-cinzel,serif)] text-2xl tracking-tight text-foreground sm:text-3xl">
                {user.name ?? "İsimsiz Üye"}
              </h1>
              <div className="mt-1 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground sm:justify-start">
                <Badge
                  variant="default"
                  className="bg-amber-500/90 text-black"
                >
                  {roleLabels[user.role] ?? user.role}
                </Badge>
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="size-3" />
                  Üyelik: {formatDate(user.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {user.bio ? (
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {user.bio}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  )
}
