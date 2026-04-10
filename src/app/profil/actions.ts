"use server"

import { z } from "zod"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { auth, signOut } from "@/auth"
import { db } from "@/db"
import { users } from "@/db/schema"

async function requireUser() {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Oturum bulunamadı")
  }
  return session.user
}

const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "İsim en az 2 karakter olmalı")
    .max(60, "İsim en fazla 60 karakter olabilir"),
  bio: z
    .string()
    .trim()
    .max(500, "Biyografi en fazla 500 karakter olabilir")
    .optional()
    .nullable(),
  image: z
    .string()
    .trim()
    .url("Geçerli bir URL giriniz")
    .optional()
    .nullable()
    .or(z.literal("")),
})

export type ProfileFormData = z.infer<typeof profileSchema>

export async function updateProfile(data: ProfileFormData) {
  const user = await requireUser()
  const parsed = profileSchema.parse(data)

  await db
    .update(users)
    .set({
      name: parsed.name,
      bio: parsed.bio ?? null,
      image: parsed.image && parsed.image.length > 0 ? parsed.image : null,
    })
    .where(eq(users.id, user.id!))

  revalidatePath("/profil")
  revalidatePath(`/profil/${user.id}`)

  return { success: true }
}

export async function deleteAccount() {
  const user = await requireUser()

  await db.delete(users).where(eq(users.id, user.id!))

  await signOut({ redirect: false })

  revalidatePath("/")
  redirect("/")
}
