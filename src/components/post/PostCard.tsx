import Link from "next/link";
import Image from "next/image";
import { Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface PostCardData {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  readingTime: number | null;
  publishedAt: Date | null;
  createdAt: Date;
  authorName?: string | null;
  categorySlug: string;
  categoryName?: string | null;
}

function formatDate(date: Date | null | undefined): string {
  if (!date) return "";
  try {
    return new Date(date).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export function PostCard({ post }: { post: PostCardData }) {
  const href = `/${post.categorySlug}/${post.slug}`;
  const date = post.publishedAt ?? post.createdAt;

  return (
    <Link
      href={href}
      className="group/postcard relative flex flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 transition-all duration-300 hover:-translate-y-1 hover:ring-amber-500/40 hover:shadow-[0_8px_30px_-12px_rgba(245,158,11,0.35)]"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover/postcard:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute left-3 top-3 z-10">
          <Badge variant="default" className="bg-amber-500/90 text-black backdrop-blur">
            {post.categoryName ?? post.categorySlug}
          </Badge>
        </div>

        {post.readingTime ? (
          <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs text-white backdrop-blur">
            <Clock className="size-3" />
            <span>{post.readingTime} dk</span>
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-[family-name:var(--font-cinzel,serif)] text-lg leading-snug tracking-tight text-foreground transition-colors group-hover/postcard:text-amber-400 line-clamp-2">
          {post.title}
        </h3>
        {post.excerpt ? (
          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
            {post.excerpt}
          </p>
        ) : null}
        <div className="mt-auto flex items-center justify-between pt-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <User className="size-3" />
            {post.authorName ?? "Kadim Gizem"}
          </span>
          <time dateTime={new Date(date).toISOString()}>{formatDate(date)}</time>
        </div>
      </div>
    </Link>
  );
}
