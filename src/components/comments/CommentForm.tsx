"use client"

import { useState } from "react"
import CommentEditor from "./CommentEditor"
import { Button } from "@/components/ui/button"
import type { CommentRecord } from "@/lib/comments"
import { Loader2 } from "lucide-react"

interface CommentFormProps {
  postId: number
  parentId?: number | null
  onPosted?: (comment: CommentRecord) => void
  onCancel?: () => void
  autoFocus?: boolean
  placeholder?: string
  submitLabel?: string
}

function htmlIsEmpty(html: string) {
  const stripped = html
    .replace(/<p><\/p>/g, "")
    .replace(/<p>\s*<\/p>/g, "")
    .replace(/<[^>]*>/g, "")
    .trim()
  return stripped.length === 0
}

export default function CommentForm({
  postId,
  parentId = null,
  onPosted,
  onCancel,
  placeholder = "Yorum yazın...",
  submitLabel = "Gönder",
}: CommentFormProps) {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const disabled = loading || htmlIsEmpty(content)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (disabled) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, parentId, content }),
      })
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as {
          error?: string
        }
        throw new Error(body.error || "Gönderilemedi")
      }
      const data = (await res.json()) as { comment: CommentRecord }
      setContent("")
      onPosted?.(data.comment)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <CommentEditor
        value={content}
        onChange={setContent}
        placeholder={placeholder}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex items-center justify-end gap-2">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={loading}
          >
            İptal
          </Button>
        )}
        <Button type="submit" size="sm" disabled={disabled}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
