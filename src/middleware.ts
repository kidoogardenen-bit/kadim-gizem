import { auth } from "@/auth"

export default auth((req) => {
  const isAdmin = req.nextUrl.pathname.startsWith("/admin")
  const isProfile = req.nextUrl.pathname.startsWith("/profil")

  if ((isAdmin || isProfile) && !req.auth) {
    return Response.redirect(new URL("/giris", req.nextUrl))
  }

  if (isAdmin && req.auth?.user?.role !== "admin") {
    return Response.redirect(new URL("/", req.nextUrl))
  }
})

export const config = {
  matcher: ["/admin/:path*", "/profil/:path*"],
}
