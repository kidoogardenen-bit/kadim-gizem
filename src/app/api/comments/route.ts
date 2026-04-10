import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { comments } from "@/db/schema"
import { auth } from "@/auth"
import { eq, asc } from "drizzle-orm"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const postIdParam = searchParams.get("postId")
  if (!postIdParam) {
    return NextResponse.json({ error: "postId required" }, { status: 400 })
  }
  const postId = Number(postIdParam)
  if (Number.isNaN(postId)) {
    return NextResponse.json({ error: "invalid postId" }, { status: 400 })
  }

  const rows = await db.query.comments.findMany({
    where: eq(comments.postId, postId),
    orderBy: [asc(comments.createdAt)],
    with: {
      user: {
        columns: { id: true, name: true, image: true, role: true },
      },
    },
  })

  return NextResponse.json({ comments: rows })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: { postId?: number; content?: string; parentId?: number | null }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const postId = Number(body.postId)
  const content = (body.content ?? "").trim()
  const parentId =
    body.parentId === undefined || body.parentId === null
      ? null
      : Number(body.parentId)

  if (!postId || Number.isNaN(postId)) {
    return NextResponse.json({ error: "postId required" }, { status: 400 })
  }
  if (!content) {
    return NextResponse.json({ error: "content required" }, { status: 400 })
  }

  const [inserted] = await db
    .insert(comments)
    .values({
      postId,
      userId: session.user.id,
      parentId,
      content,
    })
    .returning()

  const full = await db.query.comments.findFirst({
    where: eq(comments.id, inserted.id),
    with: {
      user: {
        columns: { id: true, name: true, image: true, role: true },
      },
    },
  })

  return NextResponse.json({ comment: full }, { status: 201 })
}
