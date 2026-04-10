"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { deletePost } from "@/app/admin/actions"

export function DeletePostButton({ id }: { id: number }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      variant="ghost"
      size="icon"
      disabled={isPending}
      onClick={() => {
        if (!confirm("Bu yazıyı silmek istediğine emin misin?")) return
        startTransition(async () => {
          try {
            await deletePost(id)
            toast.success("Yazı silindi")
            router.refresh()
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Hata")
          }
        })
      }}
    >
      <Trash2 className="w-4 h-4 text-destructive" />
    </Button>
  )
}
