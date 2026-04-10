import type { Metadata } from 'next';
import { ContactForm } from './ContactForm';
import { Mail, Video, Camera, X } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Iletisim | Kadim Gizem',
  description:
    'Kadim Gizem ile iletisime gec. Sorularin, onerilerin veya is birligi tekliflerin icin bize ulasabilirsin.',
};

export default function IletisimPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black text-neutral-100">
      <section className="relative overflow-hidden border-b border-amber-500/10 py-24">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.12),transparent_60%)]"
        />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-amber-500/80">
            Iletisim
          </p>
          <h1
            className="font-[family-name:var(--font-cinzel),Cinzel,serif] text-5xl font-bold tracking-wider text-amber-400 sm:text-6xl"
            style={{ textShadow: '0 0 40px rgba(212,175,55,0.3)' }}
          >
            Bize Ulas
          </h1>
          <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
          <p className="mx-auto mt-6 max-w-2xl text-neutral-400">
            Sorularin, onerilerin veya is birligi tekliflerin icin bize
            yazabilirsin. Tum mesajlari dikkatle okuyoruz.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-6 py-16">
        <ContactForm />
      </section>

      <section className="border-t border-amber-500/10 bg-black/40 py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="mb-8 font-[family-name:var(--font-cinzel),Cinzel,serif] text-2xl tracking-wider text-amber-400 sm:text-3xl">
            Sosyal Medyada Bizi Takip Edin
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="mailto:iletisim@kadimgizem.com"
              className="group flex items-center gap-3 rounded-lg border border-amber-500/20 bg-neutral-900/60 px-5 py-3 text-neutral-300 transition-all hover:border-amber-500/60 hover:text-amber-300"
            >
              <Mail className="h-5 w-5 text-amber-400" />
              <span className="text-sm">iletisim@kadimgizem.com</span>
            </a>
            <a
              href="https://youtube.com/@kardinalastro"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-lg border border-amber-500/20 bg-neutral-900/60 px-5 py-3 text-neutral-300 transition-all hover:border-amber-500/60 hover:text-amber-300"
            >
              <Video className="h-5 w-5 text-amber-400" />
              <span className="text-sm">YouTube</span>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-lg border border-amber-500/20 bg-neutral-900/60 px-5 py-3 text-neutral-300 transition-all hover:border-amber-500/60 hover:text-amber-300"
            >
              <Camera className="h-5 w-5 text-amber-400" />
              <span className="text-sm">Instagram</span>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-lg border border-amber-500/20 bg-neutral-900/60 px-5 py-3 text-neutral-300 transition-all hover:border-amber-500/60 hover:text-amber-300"
            >
              <X className="h-5 w-5 text-amber-400" />
              <span className="text-sm">Twitter</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
