export default function PostLoading() {
  return (
    <article className="min-h-screen pb-24">
      {/* Header skeleton */}
      <header className="relative">
        <div className="relative h-[60vh] min-h-[420px] w-full bg-gradient-to-br from-zinc-900 via-black to-zinc-950" />
        <div className="relative -mt-48 mx-auto max-w-4xl px-4 pb-10 sm:px-6 lg:px-8">
          <div className="mb-6 h-3 w-64 animate-pulse rounded bg-foreground/10" />
          <div className="mb-5 h-5 w-20 animate-pulse rounded-full bg-amber-500/30" />
          <div className="space-y-4">
            <div className="h-12 w-full animate-pulse rounded bg-foreground/10" />
            <div className="h-12 w-3/4 animate-pulse rounded bg-foreground/10" />
          </div>
          <div className="mt-8 flex gap-6">
            <div className="h-9 w-32 animate-pulse rounded bg-foreground/10" />
            <div className="h-9 w-28 animate-pulse rounded bg-foreground/10" />
            <div className="h-9 w-24 animate-pulse rounded bg-foreground/10" />
          </div>
        </div>
      </header>

      {/* Body skeleton */}
      <div className="mx-auto mt-12 max-w-3xl space-y-4 px-4 sm:px-6 lg:px-8">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="h-4 animate-pulse rounded bg-foreground/10"
            style={{ width: `${60 + ((i * 13) % 40)}%` }}
          />
        ))}
      </div>
    </article>
  );
}
