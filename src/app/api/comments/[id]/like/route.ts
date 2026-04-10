import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { comments, commentLikes } from "@/db/schema"
import { auth } from "@/auth"
import { and, eq, sql } from "drizzle-orm"

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const commentId = Number(id)
  if (Number.isNaN(commentId)) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 })
  }

  const existing = await db.query.comments.findFirst({
    where: eq(comments.id, commentId),
  })
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const userId = session.user.id

  const existingLike = await db.query.commentLikes.findFirst({
    where: and(
      eq(commentLikes.userId, userId),
      eq(commentLikes.commentId, commentId)
    ),
  })

  let liked: boolean
  if (existingLike) {
    await db
      .delete(commentLikes)
      .where(
        and(
          eq(commentLikes.userId, userId),
          eq(commentLikes.commentId, commentId)
        )
      )
    await db
      .update(comments)
      .set({ likeCount: sql`GREATEST(${comments.likeCount} - 1, 0)` })
      .where(eq(comments.id, commentId))
    liked = false
  } else {
    await db.insert(commentLikes).values({ userId, commentId })
    await db
      .update(comments)
      .set({ likeCount: sql`${comments.likeCount} + 1` })
      .where(eq(comments.id, commentId))
    liked = true
  }

  const updated = await db.query.comments.findFirst({
    where: eq(comments.id, commentId),
  })

  return NextResponse.json({ liked, likeCount: updated?.likeCount ?? 0 })
}
