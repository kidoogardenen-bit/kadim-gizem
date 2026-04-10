"use client"

import { useState, useTransition, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useEditor, EditorContent, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import TiptapLink from "@tiptap/extension-link"
import { toast } from "sonner"

import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Undo,
  Redo,
  Image as ImageIcon,
  Link2,
} from "lucide-react"
import {
  createPost,
  updatePost,
  type PostFormData,
} from "@/app/admin/actions"

const formSchema = z.object({
  title: z.string().min(3, "Başlık en az 3 karakter"),
  slug: z.string().min(1, "Slug gerekli"),
  excerpt: z.string().optional(),
  content: z.string().min(1, "İçerik gerekli"),
  coverImage: z.string().optional(),
  categoryId: z.string().optional(),
  youtubeVideoId: z.string().optional(),
  featured: z.boolean().optional(),
  status: z.enum(["draft", "published", "archived"]),
})

type FormValues = z.infer<typeof formSchema>

interface PostEditorProps {
  post?: {
    id: number
    title: string
    slug: string
    excerpt: string | null
    content: string
    coverImage: string | null
    categoryId: number | null
    youtubeVideoId: string | null
    featured: boolean
    status: "draft" | "published" | "archived"
  }
  categories: Array<{ id: number; name: string }>
}

function slugify(text: string): string {
  const map: Record<string, string> = {
    ç: "c", Ç: "c", ğ: "g", Ğ: "g", ı: "i", İ: "i",
    ö: "o", Ö: "o", ş: "s", Ş: "s", ü: "u", Ü: "u",
  }
  return text
    .split("")
    .map((ch) => map[ch] ?? ch)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

function ToolbarButton({
  onClick,
  active,
  children,
  title,
}: {
  onClick: () => void
  active?: boolean
  children: React.ReactNode
  title: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        "h-8 w-8 rounded flex items-center justify-center text-sm hover:bg-accent transition-colors",
        active && "bg-accent text-accent-foreground"
      )}
    >
      {children}
    </button>
  )
}

function EditorToolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null

  return (
    <div className="border-b p-2 flex items-center gap-1 flex-wrap bg-card sticky top-0 z-10">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        active={editor.isActive("heading", { level: 1 })}
        title="Heading 1"
      >
        <Heading1 className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive("heading", { level: 2 })}
        title="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive("heading", { level: 3 })}
        title="Heading 3"
      >
        <Heading3 className="w-4 h-4" />
      </ToolbarButton>
      <Separator orientation="vertical" className="h-6 mx-1" />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive("strike")}
        title="Strike"
      >
        <Strikethrough className="w-4 h-4" />
      </ToolbarButton>
      <Separator orientation="vertical" className="h-6 mx-1" />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
        title="Bullet list"
      >
        <List className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
        title="Ordered list"
      >
        <ListOrdered className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive("blockquote")}
        title="Blockquote"
      >
        <Quote className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        active={editor.isActive("codeBlock")}
        title="Code block"
      >
        <Code className="w-4 h-4" />
      </ToolbarButton>
      <Separator orientation="vertical" className="h-6 mx-1" />
      <ToolbarButton
        onClick={() => {
          const url = window.prompt("Link URL")
          if (url) editor.chain().focus().setLink({ href: url }).run()
        }}
        active={editor.isActive("link")}
        title="Link"
      >
        <Link2 className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => {
          const url = window.prompt("Image URL")
          if (url) editor.chain().focus().setImage({ src: url }).run()
        }}
        title="Image"
      >
        <ImageIcon className="w-4 h-4" />
      </ToolbarButton>
      <Separator orientation="vertical" className="h-6 mx-1" />
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        title="Undo"
      >
        <Undo className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        title="Redo"
      >
        <Redo className="w-4 h-4" />
      </ToolbarButton>
    </div>
  )
}

export function PostEditor({ post, categories }: PostEditorProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [slugTouched, setSlugTouched] = useState(!!post)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post?.title ?? "",
      slug: post?.slug ?? "",
      excerpt: post?.excerpt ?? "",
      content: post?.content ?? "",
      coverImage: post?.coverImage ?? "",
      categoryId: post?.categoryId ? String(post.categoryId) : "",
      youtubeVideoId: post?.youtubeVideoId ?? "",
      featured: post?.featured ?? false,
      status: post?.status ?? "draft",
    },
  })

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      TiptapLink.configure({ openOnClick: false }),
    ],
    content: post?.content ?? "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-invert dark:prose-invert max-w-none min-h-[400px] p-4 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      setValue("content", editor.getHTML(), { shouldValidate: true })
    },
  })

  const title = watch("title")
  useEffect(() => {
    if (title && !slugTouched) {
      setValue("slug", slugify(title))
    }
  }, [title, slugTouched, setValue])

  const onSubmit = (values: FormValues, publish = false) => {
    const payload: PostFormData = {
      title: values.title,
      slug: values.slug,
      content: values.content,
      status: publish ? "published" : values.status,
      categoryId: values.categoryId ? Number(values.categoryId) : null,
      excerpt: values.excerpt || null,
      coverImage: values.coverImage || null,
      youtubeVideoId: values.youtubeVideoId || null,
      featured: values.featured ?? false,
    }

    startTransition(async () => {
      try {
        if (post) {
          await updatePost(post.id, payload)
          toast.success("Yazı güncellendi")
          router.refresh()
        } else {
          await createPost(payload)
          toast.success("Yazı oluşturuldu")
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Hata oluştu"
        if (!msg.includes("NEXT_REDIRECT")) {
          toast.error(msg)
        }
      }
    })
  }

  return (
    <form
      onSubmit={handleSubmit((v) => onSubmit(v, false))}
      className="grid gap-6 lg:grid-cols-[1fr_320px]"
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Başlık</Label>
          <Input
            id="title"
            {...register("title")}
            placeholder="Yazı başlığı"
            className="text-lg"
          />
          {errors.title && (
            <p className="text-xs text-destructive mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            {...register("slug")}
            onChange={(e) => {
              setSlugTouched(true)
              setValue("slug", e.target.value)
            }}
            placeholder="url-slug"
          />
          {errors.slug && (
            <p className="text-xs text-destructive mt-1">{errors.slug.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="excerpt">Özet</Label>
          <textarea
            id="excerpt"
            {...register("excerpt")}
            rows={2}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
            placeholder="Kısa özet (isteğe bağlı)"
          />
        </div>

        <Card className="p-0 overflow-hidden">
          <EditorToolbar editor={editor} />
          <EditorContent editor={editor} />
        </Card>
        {errors.content && (
          <p className="text-xs text-destructive">{errors.content.message}</p>
        )}
      </div>

      <div className="space-y-4">
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex gap-2">
              <Button type="submit" disabled={isPending} className="flex-1">
                Kaydet
              </Button>
              <Button
                type="button"
                variant="default"
                disabled={isPending}
                onClick={handleSubmit((v) => onSubmit(v, true))}
              >
                Yayınla
              </Button>
            </div>
            {post && (
              <Link
                href={`/yazi/${watch("slug")}`}
                target="_blank"
                className={buttonVariants({ variant: "outline", className: "w-full" })}
              >
                Önizleme
              </Link>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-4">
            <div>
              <Label htmlFor="status">Durum</Label>
              <select
                id="status"
                {...register("status")}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
              >
                <option value="draft">Taslak</option>
                <option value="published">Yayında</option>
                <option value="archived">Arşivlendi</option>
              </select>
            </div>

            <div>
              <Label htmlFor="categoryId">Kategori</Label>
              <select
                id="categoryId"
                {...register("categoryId")}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
              >
                <option value="">— Seçiniz —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="coverImage">Kapak Görseli URL</Label>
              <Input id="coverImage" {...register("coverImage")} placeholder="https://…" />
            </div>

            <div>
              <Label htmlFor="youtubeVideoId">YouTube Video ID</Label>
              <Input
                id="youtubeVideoId"
                {...register("youtubeVideoId")}
                placeholder="dQw4w9WgXcQ"
              />
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register("featured")} />
              Öne Çıkar
            </label>
          </CardContent>
        </Card>
      </div>
    </form>
  )
}
