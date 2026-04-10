export default function CategoryLoading() {
  return (
    <main className="min-h-screen">
      {/* Hero skeleton */}
      <section className="relative h-[60vh] min-h-[460px] w-full overflow-hidden bg-gradient-to-br from-zinc-900 via-black to-zinc-950">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-4 text-center">
          <div className="h-6 w-24 animate-pulse rounded-full bg-amber-500/20" />
          <div className="h-16 w-72 animate-pulse rounded-lg bg-foreground/10 sm:w-96" />
          <div className="h-4 w-80 animate-pulse rounded bg-foreground/10" />
        </div>
      </section>

      {/* Grid skeleton */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
          <div>
            <div className="mb-8 flex items-center justify-between">
              <div className="h-4 w-32 animate-pulse rounded bg-foreground/10" />
              <div className="h-7 w-64 animate-pulse rounded-full bg-foreground/10" />
            </div>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10"
                >
                  <div className="aspect-[16/10] w-full animate-pulse bg-foreground/10" />
                  <div className="space-y-3 p-5">
                    <div className="h-5 w-3/4 animate-pulse rounded bg-foreground/10" />
                    <div className="h-4 w-full animate-pulse rounded bg-foreground/10" />
                    <div className="h-4 w-2/3 animate-pulse rounded bg-foreground/10" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-10">
            <div>
              <div className="mb-4 h-3 w-24 animate-pulse rounded bg-foreground/10" />
              <div className="h-64 animate-pulse rounded-xl bg-foreground/10" />
            </div>
            <div>
              <div className="mb-4 h-3 w-24 animate-pulse rounded bg-foreground/10" />
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-4 w-full animate-pulse rounded bg-foreground/10" />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
