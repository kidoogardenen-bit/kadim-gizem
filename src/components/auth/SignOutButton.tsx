"use client"

import { signOut } from "next-auth/react"

interface SignOutButtonProps {
  callbackUrl?: string
  className?: string
  children?: React.ReactNode
}

export function SignOutButton({
  callbackUrl = "/",
  className,
  children,
}: SignOutButtonProps) {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl })}
      className={
        className ??
        "inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
      }
    >
      {children ?? "Çıkış Yap"}
    </button>
  )
}

export default SignOutButton
