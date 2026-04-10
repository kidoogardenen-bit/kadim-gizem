import Link from "next/link"
import { MessageSquare, Heart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export interface CommentHistoryItem {
  id: number
  content: string
  likeCount: number
  createdAt: Date
  isDeleted: boolean
  post: {
    slug: string
    title: string
    categorySlug: string
  } | null
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

export function CommentHistoryList({
  comments,
}: {
  comments: CommentHistoryItem[]
}) {
  if (comments.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-2 py-12 text-center text-muted-foreground">
          <MessageSquare className="size-8 opacity-50" />
          <p className="text-sm">Henüz bir yorum yapmadınız.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <ul className="flex flex-col gap-3">
      {comments.map((c) => {
        const href = c.post
          ? `/${c.post.categorySlug}/${c.post.slug}#comment-${c.id}`
          : null
        return (
          <li key={c.id}>
            <Card className="transition-colors hover:ring-amber-500/30">
              <CardContent className="flex flex-col gap-3 p-5">
                <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                  <span>{formatDate(c.createdAt)}</span>
                  <span className="inline-flex items-center gap-1">
                    <Heart className="size-3" />
                    {c.likeCount}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-foreground line-clamp-3">
                  {c.isDeleted ? (
                    <span className="italic text-muted-foreground">
                      Bu yorum silindi.
                    </span>
                  ) : (
                    c.content
                  )}
                </p>
                {href && c.post ? (
                  <Link
                    href={href}
                    className="text-xs font-medium text-amber-500 hover:text-amber-400"
                  >
                    {c.post.title} &rarr;
                  </Link>
                ) : (
                  <span className="text-xs italic text-muted-foreground">
                    Kaynak yazı bulunamadı.
                  </span>
                )}
              </CardContent>
            </Card>
          </li>
        )
      })}
    </ul>
  )
}
