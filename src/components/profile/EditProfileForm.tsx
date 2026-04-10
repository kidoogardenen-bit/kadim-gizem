"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { updateProfile, deleteAccount } from "@/app/profil/actions"

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "İsim en az 2 karakter olmalı")
    .max(60, "İsim en fazla 60 karakter"),
  bio: z.string().trim().max(500, "En fazla 500 karakter").optional(),
  image: z
    .string()
    .trim()
    .optional()
    .refine(
      (v) => !v || /^https?:\/\/.+/.test(v),
      "Geçerli bir URL giriniz"
    ),
})

type FormValues = z.infer<typeof formSchema>

interface EditProfileFormProps {
  defaultValues: {
    name: string
    bio: string
    image: string
  }
}

export function EditProfileForm({ defaultValues }: EditProfileFormProps) {
  const [isPending, startTransition] = useTransition()
  const [deleteOpen, setDeleteOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      try {
        await updateProfile({
          name: values.name,
          bio: values.bio ?? null,
          image: values.image ?? null,
        })
        toast.success("Profil güncellendi")
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Profil güncellenemedi"
        toast.error(message)
      }
    })
  }

  const onDelete = () => {
    startTransition(async () => {
      try {
        await deleteAccount()
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Hesap silinemedi"
        toast.error(message)
      }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="p-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="profile-name">İsim</Label>
              <Input
                id="profile-name"
                placeholder="Adınız Soyadınız"
                {...register("name")}
              />
              {errors.name ? (
                <p className="text-xs text-red-400">{errors.name.message}</p>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="profile-image">Avatar URL</Label>
              <Input
                id="profile-image"
                placeholder="https://..."
                {...register("image")}
              />
              {errors.image ? (
                <p className="text-xs text-red-400">{errors.image.message}</p>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="profile-bio">Biyografi</Label>
              <textarea
                id="profile-bio"
                rows={4}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500/60 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Kendinizden kısaca bahsedin..."
                {...register("bio")}
              />
              {errors.bio ? (
                <p className="text-xs text-red-400">{errors.bio.message}</p>
              ) : null}
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button type="submit" disabled={isPending || !isDirty}>
                {isPending ? "Kaydediliyor..." : "Kaydet"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-red-500/30">
        <CardContent className="flex flex-col gap-3 p-6">
          <div>
            <h3 className="text-sm font-semibold text-red-400">
              Tehlikeli Bölge
            </h3>
            <p className="text-xs text-muted-foreground">
              Hesabınızı silerseniz tüm yorum ve beğenileriniz kalıcı olarak
              kaldırılır.
            </p>
          </div>
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger
              render={
                <Button variant="destructive" className="w-fit">
                  Hesabı Sil
                </Button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Hesabınızı silmek istediğinize emin misiniz?</DialogTitle>
                <DialogDescription>
                  Bu işlem geri alınamaz. Tüm verileriniz silinecek.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDeleteOpen(false)}
                  disabled={isPending}
                >
                  Vazgeç
                </Button>
                <Button
                  variant="destructive"
                  onClick={onDelete}
                  disabled={isPending}
                >
                  {isPending ? "Siliniyor..." : "Evet, sil"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}
