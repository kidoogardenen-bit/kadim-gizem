import Image from "next/image";
import Link from "next/link";
import { Clock, Eye, Calendar, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface PostHeaderProps {
  title: string;
  coverImage: string | null;
  categorySlug: string;
  categoryName: string;
  authorName: string | null;
  authorImage: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  readingTime: number | null;
  viewCount: number;
}

function formatDate(date: Date): string {
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

export function PostHeader({
  title,
  coverImage,
  categorySlug,
  categoryName,
  authorName,
  authorImage,
  publishedAt,
  createdAt,
  readingTime,
  viewCount,
}: PostHeaderProps) {
  const date = publishedAt ?? createdAt;

  return (
    <header className="relative">
      <div className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
      </div>

      <div className="relative -mt-48 mx-auto max-w-4xl px-4 pb-10 sm:px-6 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 text-xs text-muted-foreground"
        >
          <Link href="/" className="hover:text-amber-400">
            Ana Sayfa
          </Link>
          <ChevronRight className="size-3" />
          <Link href={`/${categorySlug}`} className="hover:text-amber-400">
            {categoryName}
          </Link>
          <ChevronRight className="size-3" />
          <span className="line-clamp-1 max-w-[240px] text-foreground/70">{title}</span>
        </nav>

        <div className="mb-5">
          <Link href={`/${categorySlug}`}>
            <Badge className="bg-amber-500 text-black hover:bg-amber-400">
              {categoryName}
            </Badge>
          </Link>
        </div>

        <h1 className="font-[family-name:var(--font-cinzel,serif)] text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          {title}
        </h1>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            {authorImage ? (
              <Image
                src={authorImage}
                alt={authorName ?? "Yazar"}
                width={36}
                height={36}
                className="rounded-full ring-1 ring-amber-500/40"
              />
            ) : (
              <div className="flex size-9 items-center justify-center rounded-full bg-amber-500/20 text-xs font-semibold text-amber-400 ring-1 ring-amber-500/40">
                {(authorName ?? "K").charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-foreground/80">{authorName ?? "Kadim Gizem"}</span>
          </div>
          <div className="inline-flex items-center gap-1.5">
            <Calendar className="size-4" />
            <time dateTime={new Date(date).toISOString()}>{formatDate(date)}</time>
          </div>
          {readingTime ? (
            <div className="inline-flex items-center gap-1.5">
              <Clock className="size-4" />
              <span>{readingTime} dk okuma</span>
            </div>
          ) : null}
          <div className="inline-flex items-center gap-1.5">
            <Eye className="size-4" />
            <span>{viewCount.toLocaleString("tr-TR")} okunma</span>
          </div>
        </div>
      </div>
    </header>
  );
}
