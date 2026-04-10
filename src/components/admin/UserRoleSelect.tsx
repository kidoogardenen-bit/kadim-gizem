"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { updateUserRole } from "@/app/admin/actions"

export function UserRoleSelect({
  userId,
  role,
}: {
  userId: string
  role: string
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <select
      defaultValue={role}
      disabled={isPending}
      onChange={(e) => {
        const next = e.target.value as "user" | "moderator" | "admin"
        startTransition(async () => {
          try {
            await updateUserRole(userId, next)
            toast.success("Rol güncellendi")
            router.refresh()
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Hata")
          }
        })
      }}
      className="h-8 rounded-md border border-input bg-transparent px-2 text-xs"
    >
      <option value="user">user</option>
      <option value="moderator">moderator</option>
      <option value="admin">admin</option>
    </select>
  )
}
