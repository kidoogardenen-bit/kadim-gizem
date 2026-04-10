"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, Save } from "lucide-react"
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/app/admin/actions"

interface Category {
  id: number
  slug: string
  name: string
  nameEn: string | null
  description: string | null
  color: string | null
  icon: string | null
  youtubeChannel: string | null
  order: number
}

export function CategoriesManager({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const [edits, setEdits] = useState<Record<number, Partial<Category>>>({})

  // create form state
  const [form, setForm] = useState({
    slug: "",
    name: "",
    nameEn: "",
    description: "",
    color: "#a16207",
    icon: "",
    order: 0,
  })

  function handleCreate() {
    startTransition(async () => {
      try {
        await createCategory({
          slug: form.slug,
          name: form.name,
          nameEn: form.nameEn || null,
          description: form.description || null,
          color: form.color || null,
          icon: form.icon || null,
          youtubeChannel: null,
          order: form.order,
        })
        toast.success("Kategori eklendi")
        setOpen(false)
        setForm({ slug: "", name: "", nameEn: "", description: "", color: "#a16207", icon: "", order: 0 })
        router.refresh()
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Hata")
      }
    })
  }

  function handleSaveRow(id: number) {
    const patch = edits[id]
    if (!patch) return
    startTransition(async () => {
      try {
        await updateCategory(id, patch)
        toast.success("Güncellendi")
        setEdits((prev) => {
          const next = { ...prev }
          delete next[id]
          return next
        })
        router.refresh()
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Hata")
      }
    })
  }

  function handleDelete(id: number) {
    if (!confirm("Bu kategoriyi silmek istediğine emin misin?")) return
    startTransition(async () => {
      try {
        await deleteCategory(id)
        toast.success("Silindi")
        router.refresh()
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Hata")
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kategoriler</h1>
          <p className="text-muted-foreground mt-1">
            Kategorileri yönet, sırala ve düzenle.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className={buttonVariants()}>
            <Plus className="w-4 h-4 mr-2" />
            Yeni Kategori
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Kategori</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Ad</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Slug</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                />
              </div>
              <div>
                <Label>İngilizce Ad</Label>
                <Input
                  value={form.nameEn}
                  onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                />
              </div>
              <div>
                <Label>Açıklama</Label>
                <Input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label>Renk</Label>
                  <Input
                    type="color"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Icon</Label>
                  <Input
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Sıra</Label>
                  <Input
                    type="number"
                    value={form.order}
                    onChange={(e) =>
                      setForm({ ...form, order: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreate} disabled={isPending}>
                Kaydet
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/30">
              <tr className="text-left">
                <th className="p-3 font-medium">Ad</th>
                <th className="p-3 font-medium">Slug</th>
                <th className="p-3 font-medium">Renk</th>
                <th className="p-3 font-medium">Sıra</th>
                <th className="p-3 font-medium text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {categories.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-muted-foreground"
                  >
                    Henüz kategori yok.
                  </td>
                </tr>
              )}
              {categories.map((c) => {
                const dirty = !!edits[c.id]
                return (
                  <tr key={c.id} className="hover:bg-muted/20">
                    <td className="p-3 font-medium">{c.name}</td>
                    <td className="p-3 text-muted-foreground">/{c.slug}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          defaultValue={c.color || "#a16207"}
                          onChange={(e) =>
                            setEdits((prev) => ({
                              ...prev,
                              [c.id]: { ...prev[c.id], color: e.target.value },
                            }))
                          }
                          className="w-8 h-8 rounded cursor-pointer"
                        />
                        <span className="text-xs text-muted-foreground">
                          {edits[c.id]?.color ?? c.color}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <Input
                        type="number"
                        defaultValue={c.order}
                        className="w-20 h-8"
                        onChange={(e) =>
                          setEdits((prev) => ({
                            ...prev,
                            [c.id]: {
                              ...prev[c.id],
                              order: Number(e.target.value),
                            },
                          }))
                        }
                      />
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-1">
                        {dirty && (
                          <Button
                            size="icon"
                            variant="ghost"
                            disabled={isPending}
                            onClick={() => handleSaveRow(c.id)}
                          >
                            <Save className="w-4 h-4 text-green-500" />
                          </Button>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          disabled={isPending}
                          onClick={() => handleDelete(c.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
