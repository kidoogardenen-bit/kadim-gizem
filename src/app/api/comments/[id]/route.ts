import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { comments } from "@/db/schema"
import { auth } from "@/auth"
import { eq } from "drizzle-orm"

export async function PATCH(
  req: NextRequest,
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

  let body: { content?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const content = (body.content ?? "").trim()
  if (!content) {
    return NextResponse.json({ error: "content required" }, { status: 400 })
  }

  const existing = await db.query.comments.findFirst({
    where: eq(comments.id, commentId),
  })
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const isOwner = existing.userId === session.user.id
  const isAdmin = session.user.role === "admin"
  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const [updated] = await db
    .update(comments)
    .set({ content, updatedAt: new Date() })
    .where(eq(comments.id, commentId))
    .returning()

  return NextResponse.json({ comment: updated })
}

export async function DELETE(
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

  const isOwner = existing.userId === session.user.id
  const isAdmin = session.user.role === "admin"
  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  await db
    .update(comments)
    .set({ isDeleted: true, updatedAt: new Date() })
    .where(eq(comments.id, commentId))

  return NextResponse.json({ ok: true })
}
