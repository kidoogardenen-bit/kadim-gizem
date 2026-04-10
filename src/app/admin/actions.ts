"use server"

import { z } from "zod"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { db } from "@/db"
import { posts, categories, comments, users } from "@/db/schema"

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Yetkisiz erişim")
  }
  return session.user
}

// ============ POSTS ============
const postSchema = z.object({
  title: z.string().min(3, "Başlık en az 3 karakter"),
  slug: z.string().min(1, "Slug gerekli"),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(1, "İçerik gerekli"),
  coverImage: z.string().optional().nullable(),
  categoryId: z.number().int().optional().nullable(),
  youtubeVideoId: z.string().optional().nullable(),
  featured: z.boolean().optional().default(false),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
})

export type PostFormData = z.infer<typeof postSchema>

export async function createPost(data: PostFormData) {
  const user = await requireAdmin()
  const parsed = postSchema.parse(data)

  const [created] = await db
    .insert(posts)
    .values({
      ...parsed,
      authorId: user.id!,
      publishedAt: parsed.status === "published" ? new Date() : null,
    })
    .returning({ id: posts.id })

  revalidatePath("/admin/posts")
  revalidatePath("/admin")
  redirect(`/admin/posts/${created.id}/edit`)
}

export async function updatePost(id: number, data: PostFormData) {
  await requireAdmin()
  const parsed = postSchema.parse(data)

  await db
    .update(posts)
    .set({
      ...parsed,
      updatedAt: new Date(),
      publishedAt: parsed.status === "published" ? new Date() : null,
    })
    .where(eq(posts.id, id))

  revalidatePath("/admin/posts")
  revalidatePath(`/admin/posts/${id}/edit`)
  revalidatePath("/admin")
}

export async function deletePost(id: number) {
  await requireAdmin()
  await db.delete(posts).where(eq(posts.id, id))
  revalidatePath("/admin/posts")
  revalidatePath("/admin")
}

// ============ CATEGORIES ============
const categorySchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  nameEn: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  youtubeChannel: z.string().optional().nullable(),
  order: z.number().int().default(0),
})

export type CategoryFormData = z.infer<typeof categorySchema>

export async function createCategory(data: CategoryFormData) {
  await requireAdmin()
  const parsed = categorySchema.parse(data)
  await db.insert(categories).values(parsed)
  revalidatePath("/admin/categories")
}

export async function updateCategory(id: number, data: Partial<CategoryFormData>) {
  await requireAdmin()
  await db.update(categories).set(data).where(eq(categories.id, id))
  revalidatePath("/admin/categories")
}

export async function deleteCategory(id: number) {
  await requireAdmin()
  await db.delete(categories).where(eq(categories.id, id))
  revalidatePath("/admin/categories")
}

// ============ COMMENTS ============
export async function approveComment(id: number) {
  await requireAdmin()
  await db
    .update(comments)
    .set({ isApproved: true, updatedAt: new Date() })
    .where(eq(comments.id, id))
  revalidatePath("/admin/comments")
  revalidatePath("/admin")
}

export async function unapproveComment(id: number) {
  await requireAdmin()
  await db
    .update(comments)
    .set({ isApproved: false, updatedAt: new Date() })
    .where(eq(comments.id, id))
  revalidatePath("/admin/comments")
}

export async function deleteComment(id: number) {
  await requireAdmin()
  await db
    .update(comments)
    .set({ isDeleted: true, updatedAt: new Date() })
    .where(eq(comments.id, id))
  revalidatePath("/admin/comments")
}

export async function hardDeleteComment(id: number) {
  await requireAdmin()
  await db.delete(comments).where(eq(comments.id, id))
  revalidatePath("/admin/comments")
}

// ============ USERS ============
export async function updateUserRole(
  userId: string,
  role: "user" | "admin" | "moderator"
) {
  await requireAdmin()
  await db.update(users).set({ role }).where(eq(users.id, userId))
  revalidatePath("/admin/users")
}
