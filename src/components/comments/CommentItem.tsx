"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Heart,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  formatCommentDate,
  type CommentNode,
  type CommentRecord,
} from "@/lib/comments"
import CommentForm from "./CommentForm"
import CommentEditor from "./CommentEditor"

interface CommentItemProps {
  comment: CommentNode
  currentUserId?: string | null
  currentUserRole?: string | null
  postId: number
  depth?: number
  onReplyPosted: (comment: CommentRecord) => void
  onEdited: (comment: CommentRecord) => void
  onDeleted: (commentId: number) => void
}

export default function CommentItem({
  comment,
  currentUserId,
  currentUserRole,
  postId,
  depth = 0,
  onReplyPosted,
  onEdited,
  onDeleted,
}: CommentItemProps) {
  const [showReply, setShowReply] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [editLoading, setEditLoading] = useState(false)
  const [likeCount, setLikeCount] = useState(comment.likeCount)
  const [liked, setLiked] = useState(!!comment.likedByMe)
  const [likePending, setLikePending] = useState(false)

  const isOwner = currentUserId && currentUserId === comment.userId
  const isAdmin = currentUserRole === "admin"
  const canModify = isOwner || isAdmin
  const isAuthed = !!currentUserId

  const handleLike = async () => {
    if (!isAuthed || likePending) return
    setLikePending(true)
    const prevLiked = liked
    const prevCount = likeCount
    setLiked(!prevLiked)
    setLikeCount(prevCount + (prevLiked ? -1 : 1))
    try {
      const res = await fetch(`/api/comments/${comment.id}/like`, {
        method: "POST",
      })
      if (!res.ok) throw new Error("fail")
      const data = (await res.json()) as { liked: boolean; likeCount: number }
      setLiked(data.liked)
      setLikeCount(data.likeCount)
    } catch {
      setLiked(prevLiked)
      setLikeCount(prevCount)
    } finally {
      setLikePending(false)
    }
  }

  const handleSaveEdit = async () => {
    setEditLoading(true)
    try {
      const res = await fetch(`/api/comments/${comment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editContent }),
      })
      if (!res.ok) throw new Error("fail")
      const data = (await res.json()) as { comment: CommentRecord }
      onEdited({ ...comment, ...data.comment, user: comment.user })
      setEditing(false)
    } catch {
      // keep editing open
    } finally {
      setEditLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Bu yorumu silmek istediğinize emin misiniz?")) return
    try {
      const res = await fetch(`/api/comments/${comment.id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("fail")
      onDeleted(comment.id)
    } catch {
      // noop
    }
  }

  const initial =
    comment.user?.name?.trim()?.charAt(0)?.toUpperCase() ?? "?"

  return (
    <div
      className={cn(
        "flex gap-3",
        depth > 0 && "mt-4 ml-4 border-l border-border/40 pl-4 sm:ml-6 sm:pl-6"
      )}
    >
      <Avatar className="h-9 w-9 shrink-0">
        {comment.user?.image && (
          <AvatarImage src={comment.user.image} alt={comment.user.name ?? ""} />
        )}
        <AvatarFallback>{initial}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">
            {comment.user?.name ?? "Kullanıcı"}
          </span>
          {comment.user?.role === "admin" && (
            <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-primary">
              Admin
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            {formatCommentDate(comment.createdAt)}
          </span>
        </div>

        {comment.isDeleted ? (
          <p className="mt-1 text-sm italic text-muted-foreground">
            [Silindi]
          </p>
        ) : editing ? (
          <div className="mt-2 space-y-2">
            <CommentEditor value={editContent} onChange={setEditContent} />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditing(false)
                  setEditContent(comment.content)
                }}
                disabled={editLoading}
              >
                İptal
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleSaveEdit}
                disabled={editLoading}
              >
                Kaydet
              </Button>
            </div>
          </div>
        ) : (
          <div
            className="prose prose-sm dark:prose-invert mt-1 max-w-none break-words"
            dangerouslySetInnerHTML={{ __html: comment.content }}
          />
        )}

        {!comment.isDeleted && !editing && (
          <div className="mt-2 flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-2"
              onClick={handleLike}
              disabled={!isAuthed || likePending}
            >
              <Heart
                className={cn(
                  "mr-1 h-4 w-4",
                  liked && "fill-red-500 text-red-500"
                )}
              />
              <span className="text-xs">{likeCount}</span>
            </Button>

            {isAuthed && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={() => setShowReply((s) => !s)}
              >
                <MessageSquare className="mr-1 h-4 w-4" />
                <span className="text-xs">Yanıtla</span>
              </Button>
            )}

            {canModify && (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      aria-label="Daha fazla"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  }
                />
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setEditing(true)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Düzenle
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={handleDelete}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Sil
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}

        {showReply && isAuthed && (
          <div className="mt-3">
            <CommentForm
              postId={postId}
              parentId={comment.id}
              placeholder="Yanıtınızı yazın..."
              submitLabel="Yanıtla"
              onCancel={() => setShowReply(false)}
              onPosted={(c) => {
                onReplyPosted(c)
                setShowReply(false)
              }}
            />
          </div>
        )}

        {comment.replies.length > 0 && (
          <div className="mt-2">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                currentUserId={currentUserId}
                currentUserRole={currentUserRole}
                postId={postId}
                depth={depth + 1}
                onReplyPosted={onReplyPosted}
                onEdited={onEdited}
                onDeleted={onDeleted}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
