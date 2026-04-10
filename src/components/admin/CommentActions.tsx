"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Check, Trash2, Undo } from "lucide-react"
import {
  approveComment,
  unapproveComment,
  deleteComment,
} from "@/app/admin/actions"

export function CommentActions({
  id,
  approved,
  deleted,
}: {
  id: number
  approved: boolean
  deleted: boolean
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function run(fn: () => Promise<void>, msg: string) {
    startTransition(async () => {
      try {
        await fn()
        toast.success(msg)
        router.refresh()
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Hata")
      }
    })
  }

  return (
    <div className="flex items-center gap-1 justify-end">
      {!approved && !deleted && (
        <Button
          size="icon"
          variant="ghost"
          disabled={isPending}
          onClick={() => run(() => approveComment(id), "Yorum onaylandı")}
        >
          <Check className="w-4 h-4 text-green-500" />
        </Button>
      )}
      {approved && !deleted && (
        <Button
          size="icon"
          variant="ghost"
          disabled={isPending}
          onClick={() => run(() => unapproveComment(id), "Onay kaldırıldı")}
        >
          <Undo className="w-4 h-4" />
        </Button>
      )}
      <Button
        size="icon"
        variant="ghost"
        disabled={isPending}
        onClick={() => {
          if (!confirm("Bu yorumu silmek istediğine emin misin?")) return
          run(() => deleteComment(id), "Yorum silindi")
        }}
      >
        <Trash2 className="w-4 h-4 text-destructive" />
      </Button>
    </div>
  )
}
