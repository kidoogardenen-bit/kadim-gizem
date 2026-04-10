import { db } from "@/db"
import { categories } from "@/db/schema"
import { CategoriesManager } from "@/components/admin/CategoriesManager"

export default async function CategoriesPage() {
  const cats = await db.select().from(categories).orderBy(categories.order)
  return <CategoriesManager categories={cats} />
}
