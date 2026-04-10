import { redirect } from "next/navigation"
import { eq, desc, and } from "drizzle-orm"
import { MessageSquare, Heart, CalendarDays } from "lucide-react"

import { auth } from "@/auth"
import { db } from "@/db"
import {
  users,
  comments,
  posts,
  categories,
  postLikes,
} from "@/db/schema"
import { Card, CardContent } from "@/components/ui/card"
import { ProfileHero } from "@/components/profile/ProfileHero"
import { ProfileTabs, type ProfileTabItem } from "@/components/profile/ProfileTabs"
import {
  CommentHistoryList,
  type CommentHistoryItem,
} from "@/components/profile/CommentHistoryList"
import { LikedPostsGrid } from "@/components/profile/LikedPostsGrid"
import { EditProfileForm } from "@/components/profile/EditProfileForm"
import type { PostCardData } from "@/components/post/PostCard"

export const metadata = {
  title: "Profilim | Kadim Gizem",
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

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/giris")
  }
  const userId = session.user.id

  const [userRow] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  if (!userRow) {
    redirect("/giris")
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
    .where(eq(comments.userId, userId))
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

  const likedRows = await db
    .select({
      id: posts.id,
      slug: posts.slug,
      title: posts.title,
      excerpt: posts.excerpt,
      coverImage: posts.coverImage,
      readingTime: posts.readingTime,
      publishedAt: posts.publishedAt,
      createdAt: posts.createdAt,
      categorySlug: categories.slug,
      categoryName: categories.name,
    })
    .from(postLikes)
    .innerJoin(posts, eq(postLikes.postId, posts.id))
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .where(eq(postLikes.userId, userId))
    .orderBy(desc(posts.publishedAt))
    .limit(24)

  const likedPosts: PostCardData[] = likedRows
    .filter((r) => r.categorySlug)
    .map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      excerpt: r.excerpt,
      coverImage: r.coverImage,
      readingTime: r.readingTime,
      publishedAt: r.publishedAt,
      createdAt: r.createdAt,
      categorySlug: r.categorySlug as string,
      categoryName: r.categoryName,
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
      label: "Yorumlarım",
      content: <CommentHistoryList comments={userComments} />,
    },
    {
      value: "liked",
      label: "Beğendiklerim",
      content: <LikedPostsGrid posts={likedPosts} />,
    },
    {
      value: "settings",
      label: "Ayarlar",
      content: (
        <EditProfileForm
          defaultValues={{
            name: userRow.name ?? "",
            bio: userRow.bio ?? "",
            image: userRow.image ?? "",
          }}
        />
      ),
    },
  ]

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12">
      <ProfileHero user={userRow} />
      <ProfileTabs tabs={tabs} defaultValue="general" />
    </main>
  )
}
