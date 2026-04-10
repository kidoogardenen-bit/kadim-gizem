import { Heart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { PostCard, type PostCardData } from "@/components/post/PostCard"

export function LikedPostsGrid({ posts }: { posts: PostCardData[] }) {
  if (posts.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-2 py-12 text-center text-muted-foreground">
          <Heart className="size-8 opacity-50" />
          <p className="text-sm">Henüz beğendiğiniz bir yazı yok.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((p) => (
        <PostCard key={p.id} post={p} />
      ))}
    </div>
  )
}
