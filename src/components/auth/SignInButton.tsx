"use client"

import { signIn } from "next-auth/react"

interface SignInButtonProps {
  provider?: string
  callbackUrl?: string
  className?: string
  children?: React.ReactNode
}

export function SignInButton({
  provider = "google",
  callbackUrl = "/",
  className,
  children,
}: SignInButtonProps) {
  return (
    <button
      type="button"
      onClick={() => signIn(provider, { callbackUrl })}
      className={
        className ??
        "inline-flex w-full items-center justify-center gap-3 rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur transition hover:bg-white/10 hover:border-white/40"
      }
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#EA4335"
          d="M12 10.2v3.9h5.5c-.2 1.4-1.6 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.4 14.6 2.5 12 2.5 6.7 2.5 2.5 6.7 2.5 12S6.7 21.5 12 21.5c6.9 0 9.5-4.8 9.5-7.3 0-.5 0-.9-.1-1.3H12z"
        />
      </svg>
      {children ?? "Google ile Giriş Yap"}
    </button>
  )
}

export default SignInButton
