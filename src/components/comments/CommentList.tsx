"use client"

import { useCallback, useMemo, useState } from "react"
import {
  buildCommentTree,
  type CommentRecord,
} from "@/lib/comments"
import CommentItem from "./CommentItem"
import CommentForm from "./CommentForm"

interface CommentListProps {
  postId: number
  initialComments: CommentRecord[]
  currentUserId?: string | null
  currentUserRole?: string | null
  canComment: boolean
}

export default function CommentList({
  postId,
  initialComments,
  currentUserId,
  currentUserRole,
  canComment,
}: CommentListProps) {
  const [comments, setComments] = useState<CommentRecord[]>(initialComments)

  const tree = useMemo(() => buildCommentTree(comments), [comments])

  const handlePosted = useCallback((c: CommentRecord) => {
    setComments((prev) => [...prev, c])
  }, [])

  const handleEdited = useCallback((c: CommentRecord) => {
    setComments((prev) =>
      prev.map((x) => (x.id === c.id ? { ...x, ...c } : x))
    )
  }, [])

  const handleDeleted = useCallback((id: number) => {
    setComments((prev) =>
      prev.map((x) =>
        x.id === id ? { ...x, isDeleted: true, content: "" } : x
      )
    )
  }, [])

  const rootCount = tree.length
  const totalCount = comments.filter((c) => !c.isDeleted).length

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <h3 className="text-lg font-semibold">
          Yorumlar{" "}
          <span className="text-sm font-normal text-muted-foreground">
            ({totalCount})
          </span>
        </h3>
      </div>

      {canComment ? (
        <CommentForm postId={postId} onPosted={handlePosted} />
      ) : (
        <div className="rounded-md border border-dashed border-border/60 p-4 text-center text-sm text-muted-foreground">
          Yorum yazmak için{" "}
          <a href="/giris" className="text-primary underline">
            giriş yapın
          </a>
          .
        </div>
      )}

      {rootCount === 0 ? (
        <p className="text-sm text-muted-foreground">
          Henüz yorum yok. İlk yorumu siz yazın.
        </p>
      ) : (
        <div className="space-y-6">
          {tree.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              currentUserId={currentUserId}
              currentUserRole={currentUserRole}
              postId={postId}
              onReplyPosted={handlePosted}
              onEdited={handleEdited}
              onDeleted={handleDeleted}
            />
          ))}
        </div>
      )}
    </div>
  )
}
