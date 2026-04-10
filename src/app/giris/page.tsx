import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { SignInButton } from "@/components/auth/SignInButton"

export const metadata: Metadata = {
  title: "Giriş Yap | Kadim Gizem",
  description: "Kadim Gizem'e giriş yaparak kadim sırları keşfet.",
}

export default async function GirisPage() {
  const session = await auth()
  if (session?.user) {
    redirect("/")
  }

  return (
    <main className="relative flex min-h-screen w-full flex-col bg-black text-white lg:flex-row">
      {/* Left — Mystical hero panel */}
      <section className="relative hidden overflow-hidden lg:flex lg:w-1/2">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.35),transparent_60%),radial-gradient(circle_at_70%_80%,rgba(14,165,233,0.25),transparent_55%),linear-gradient(135deg,#0b0416_0%,#1a0b2e_50%,#020617_100%)]" />
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:48px_48px]" />

        {/* Floating orbs */}
        <div className="pointer-events-none absolute -left-20 top-1/3 h-80 w-80 rounded-full bg-purple-600/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 right-10 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative z-10 flex w-full flex-col justify-between p-12">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 font-serif text-lg">
              K
            </span>
            <span className="text-lg font-semibold tracking-wide">
              Kadim Gizem
            </span>
          </Link>

          <div className="max-w-md">
            <h1 className="font-serif text-5xl leading-tight tracking-tight">
              Kadim sırların <br />
              <span className="bg-gradient-to-r from-purple-300 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent">
                kapısı aralandı.
              </span>
            </h1>
            <p className="mt-6 text-base text-white/70">
              Mitoloji, ezoterizm ve unutulmuş bilgelerin derinliklerine
              yolculuğa çık. Giriş yaparak kendi okuma listeni oluştur,
              favorilerini kaydet ve topluluğa katıl.
            </p>
          </div>

          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Kadim Gizem. Tüm hakları saklıdır.
          </p>
        </div>
      </section>

      {/* Right — Sign in form */}
      <section className="flex w-full flex-1 items-center justify-center px-6 py-16 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="font-serif text-3xl tracking-tight">Hoş geldin</h2>
            <p className="mt-2 text-sm text-white/60">
              Devam etmek için bir yöntem seç.
            </p>
          </div>

          <div className="space-y-4">
            <SignInButton />
          </div>

          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs uppercase tracking-widest text-white/40">
              veya
            </span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <p className="text-center text-xs text-white/50">
            Giriş yaparak{" "}
            <Link
              href="/kullanim-kosullari"
              className="underline underline-offset-2 hover:text-white"
            >
              Kullanım Koşulları
            </Link>{" "}
            ve{" "}
            <Link
              href="/gizlilik"
              className="underline underline-offset-2 hover:text-white"
            >
              Gizlilik Politikası
            </Link>
            'nı kabul etmiş olursun.
          </p>

          <div className="mt-10 text-center">
            <Link
              href="/"
              className="text-sm text-white/60 transition hover:text-white"
            >
              ← Ana sayfaya dön
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
