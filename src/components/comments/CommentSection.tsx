import { db } from "@/db"
import { comments, commentLikes } from "@/db/schema"
import { auth } from "@/auth"
import { eq, asc } from "drizzle-orm"
import CommentList from "./CommentList"
import type { CommentRecord } from "@/lib/comments"

interface CommentSectionProps {
  postId: number
}

export default async function CommentSection({ postId }: CommentSectionProps) {
  const session = await auth()
  const currentUserId = session?.user?.id ?? null
  const currentUserRole = session?.user?.role ?? null

  const rows = await db.query.comments.findMany({
    where: eq(comments.postId, postId),
    orderBy: [asc(comments.createdAt)],
    with: {
      user: {
        columns: { id: true, name: true, image: true, role: true },
      },
    },
  })

  let likedIds: Set<number> = new Set()
  if (currentUserId) {
    const myLikes = await db.query.commentLikes.findMany({
      where: eq(commentLikes.userId, currentUserId),
    })
    likedIds = new Set(myLikes.map((l) => l.commentId))
  }

  const initialComments: CommentRecord[] = rows.map((r) => ({
    id: r.id,
    postId: r.postId,
    userId: r.userId,
    parentId: r.parentId,
    content: r.isDeleted ? "" : r.content,
    likeCount: r.likeCount,
    isDeleted: r.isDeleted,
    isApproved: r.isApproved,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    user: {
      id: r.user?.id ?? r.userId,
      name: r.user?.name ?? null,
      image: r.user?.image ?? null,
      role: r.user?.role ?? undefined,
    },
    likedByMe: likedIds.has(r.id),
  }))

  return (
    <section id="yorumlar" className="mx-auto mt-12 max-w-3xl">
      <CommentList
        postId={postId}
        initialComments={initialComments}
        currentUserId={currentUserId}
        currentUserRole={currentUserRole}
        canComment={!!currentUserId}
      />
    </section>
  )
}
