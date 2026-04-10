import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-4 py-24 text-center">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.12),transparent_60%)]" />

      {/* Mystical sigil */}
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        className="mb-8 text-amber-500/70"
        aria-hidden="true"
      >
        <circle cx="60" cy="60" r="56" stroke="currentColor" strokeWidth="1" />
        <circle cx="60" cy="60" r="40" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" />
        <path
          d="M60 12 L92 96 L20 44 L100 44 L28 96 Z"
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
        />
        <circle cx="60" cy="60" r="6" fill="currentColor" />
      </svg>

      <h1 className="font-[family-name:var(--font-cinzel,serif)] text-7xl font-bold tracking-tight text-amber-400 drop-shadow-[0_4px_30px_rgba(245,158,11,0.4)] sm:text-9xl">
        404
      </h1>

      <h2 className="mt-6 font-[family-name:var(--font-cinzel,serif)] text-2xl font-semibold tracking-wide text-foreground sm:text-3xl">
        Bu sayfa kayıp...
      </h2>
      <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
        Aradığınız bilgi belki hiç var olmadı, belki de zamanın tozları arasında
        kayboldu. Yolunuza ana sayfadan devam edebilirsiniz.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-amber-500 px-6 text-sm font-semibold text-black ring-1 ring-amber-500 transition-all hover:bg-amber-400"
        >
          Ana sayfaya dön
        </Link>
        <Link
          href="/mitoloji"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-card px-6 text-sm font-medium text-foreground ring-1 ring-foreground/10 transition-all hover:ring-amber-500/40"
        >
          Mitolojiyi keşfet
        </Link>
      </div>
    </main>
  );
}
