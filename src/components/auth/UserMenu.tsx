import Link from "next/link"
import { auth } from "@/auth"
import { SignOutButton } from "./SignOutButton"

export async function UserMenu() {
  const session = await auth()

  if (!session?.user) {
    return (
      <Link
        href="/giris"
        className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
      >
        Giriş Yap
      </Link>
    )
  }

  const { user } = session
  const initial = (user.name ?? user.email ?? "U").charAt(0).toUpperCase()
  const isAdmin = user.role === "admin"

  return (
    <div className="group relative">
      <button
        type="button"
        className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 p-1 pr-3 text-sm text-white transition hover:bg-white/10"
      >
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.image}
            alt={user.name ?? "Avatar"}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-xs font-semibold">
            {initial}
          </span>
        )}
        <span className="hidden sm:inline">{user.name ?? user.email}</span>
      </button>

      <div className="invisible absolute right-0 mt-2 w-56 origin-top-right scale-95 rounded-xl border border-white/10 bg-black/90 p-2 opacity-0 shadow-2xl backdrop-blur-xl transition-all duration-150 group-hover:visible group-hover:scale-100 group-hover:opacity-100">
        <div className="border-b border-white/10 px-3 py-2">
          <p className="truncate text-sm font-medium text-white">
            {user.name ?? "Kullanıcı"}
          </p>
          <p className="truncate text-xs text-white/60">{user.email}</p>
        </div>
        <Link
          href="/profil"
          className="block rounded-lg px-3 py-2 text-sm text-white/90 transition hover:bg-white/10"
        >
          Profilim
        </Link>
        {isAdmin && (
          <Link
            href="/admin"
            className="block rounded-lg px-3 py-2 text-sm text-white/90 transition hover:bg-white/10"
          >
            Yönetim Paneli
          </Link>
        )}
        <div className="mt-1 border-t border-white/10 pt-1">
          <SignOutButton className="w-full rounded-lg px-3 py-2 text-left text-sm text-white/90 transition hover:bg-white/10" />
        </div>
      </div>
    </div>
  )
}

export default UserMenu
