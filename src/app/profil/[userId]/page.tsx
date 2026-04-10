import { notFound } from "next/navigation"
import { eq, desc, and } from "drizzle-orm"
import type { Metadata } from "next"
import { MessageSquare, Heart, CalendarDays } from "lucide-react"

import { db } from "@/db"
import { users, comments, posts, categories, postLikes } from "@/db/schema"
import { Card, CardContent } from "@/components/ui/card"
import { ProfileHero } from "@/components/profile/ProfileHero"
import { ProfileTabs, type ProfileTabItem } from "@/components/profile/ProfileTabs"
import {
  CommentHistoryList,
  type CommentHistoryItem,
} from "@/components/profile/CommentHistoryList"

interface PageProps {
  params: Promise<{ userId: string }>
}

function formatDate(date: Date): string {
  try {
    return new Date(date).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  } catch {
    return ""
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { userId } = await params
  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      bio: users.bio,
      image: users.image,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  if (!user) {
    return { title: "Kullanıcı bulunamadı | Kadim Gizem" }
  }

  const name = user.name ?? "Üye"
  const description =
    user.bio ?? `${name} adlı üyenin Kadim Gizem profil sayfası.`

  return {
    title: `${name} | Kadim Gizem`,
    description,
    openGraph: {
      title: `${name} | Kadim Gizem`,
      description,
      type: "profile",
      images: user.image ? [user.image] : undefined,
    },
  }
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { userId } = await params

  const [userRow] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  if (!userRow) {
    notFound()
  }

  const commentRows = await db
    .select({
      id: comments.id,
      content: comments.content,
      likeCount: comments.likeCount,
      createdAt: comments.createdAt,
      isDeleted: comments.isDeleted,
      postSlug: posts.slug,
      postTitle: posts.title,
      categorySlug: categories.slug,
    })
    .from(comments)
    .leftJoin(posts, eq(comments.postId, posts.id))
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .where(
      and(
        eq(comments.userId, userId),
        eq(comments.isDeleted, false),
        eq(comments.isApproved, true)
      )
    )
    .orderBy(desc(comments.createdAt))
    .limit(20)

  const userComments: CommentHistoryItem[] = commentRows.map((r) => ({
    id: r.id,
    content: r.content,
    likeCount: r.likeCount,
    createdAt: r.createdAt,
    isDeleted: r.isDeleted,
    post:
      r.postSlug && r.postTitle && r.categorySlug
        ? {
            slug: r.postSlug,
            title: r.postTitle,
            categorySlug: r.categorySlug,
          }
        : null,
  }))

  const commentCountRows = await db
    .select({ id: comments.id })
    .from(comments)
    .where(and(eq(comments.userId, userId), eq(comments.isDeleted, false)))
  const commentCount = commentCountRows.length

  const likeCountRows = await db
    .select({ postId: postLikes.postId })
    .from(postLikes)
    .where(eq(postLikes.userId, userId))
  const likeCount = likeCountRows.length

  const generalTab = (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card>
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
            <MessageSquare className="size-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Yorum
            </p>
            <p className="text-2xl font-semibold text-foreground">
              {commentCount}
            </p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
            <Heart className="size-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Beğeni
            </p>
            <p className="text-2xl font-semibold text-foreground">
              {likeCount}
            </p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
            <CalendarDays className="size-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Üyelik
            </p>
            <p className="text-sm font-semibold text-foreground">
              {formatDate(userRow.createdAt)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const tabs: ProfileTabItem[] = [
    { value: "general", label: "Genel", content: generalTab },
    {
      value: "comments",
      label: "Yorumlar",
      content: <CommentHistoryList comments={userComments} />,
    },
  ]

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12">
      <ProfileHero user={userRow} />
      <ProfileTabs tabs={tabs} defaultValue="general" />
    </main>
  )
}
