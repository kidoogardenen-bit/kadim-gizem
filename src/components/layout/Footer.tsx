import Link from "next/link";
import {
  AtSignIcon,
  CameraIcon,
  CodeIcon,
  MailIcon,
  PlayIcon,
} from "lucide-react";

import { SITE, FOOTER_LINKS, CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const socials = [
  { href: SITE.links.twitter, icon: AtSignIcon, label: "Twitter" },
  { href: SITE.links.instagram, icon: CameraIcon, label: "Instagram" },
  { href: SITE.links.youtube, icon: PlayIcon, label: "YouTube" },
  { href: SITE.links.github, icon: CodeIcon, label: "GitHub" },
  { href: `mailto:${SITE.links.email}`, icon: MailIcon, label: "E-posta" },
];

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-gold/20 bg-background">
      {/* Starfield backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-starfield opacity-40"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px gold-divider"
      />

      <div className="container relative mx-auto px-4 py-16 md:px-6 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="font-display text-xl font-bold tracking-[0.18em] text-foreground">
                KADİM
              </span>
              <span className="font-display text-xl font-bold tracking-[0.18em] text-gold">
                GİZEM
              </span>
            </Link>
            <p className="mt-4 max-w-xs font-serif text-[15px] leading-relaxed text-muted-foreground">
              {SITE.description}
            </p>
            <div className="mt-6 flex items-center gap-1">
              {socials.map(({ href, icon: Icon, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "text-muted-foreground hover:bg-gold/10 hover:text-gold"
                  )}
                >
                  <Icon className="h-[1.1rem] w-[1.1rem]" />
                </Link>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-gold">
              Kategoriler
            </h3>
            <ul className="mt-5 space-y-3">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/${cat.slug}`}
                    className="font-serif text-[15px] text-muted-foreground transition-colors hover:text-gold"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-gold">
              Kurumsal
            </h3>
            <ul className="mt-5 space-y-3">
              {FOOTER_LINKS.kurumsal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-serif text-[15px] text-muted-foreground transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-gold">
              Bülten
            </h3>
            <p className="mt-5 font-serif text-[15px] leading-relaxed text-muted-foreground">
              Kadim bilgeliği haftalık olarak mektup kutunuza gönderelim.
            </p>
            <form className="mt-5 flex flex-col gap-2 sm:flex-row">
              <Input
                type="email"
                placeholder="e-posta adresiniz"
                aria-label="E-posta"
                className="bg-card/50 border-gold/30 font-serif placeholder:text-muted-foreground/70 focus-visible:ring-gold/40"
              />
              <Button
                type="submit"
                className="bg-gold text-ink hover:bg-gold-light font-serif font-semibold tracking-wide"
              >
                Abone Ol
              </Button>
            </form>
          </div>
        </div>

        <Separator className="my-10 bg-gold/15" />

        <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <p className="font-serif text-sm text-muted-foreground">
            © {new Date().getFullYear()} {SITE.name}. Tüm hakları saklıdır.
          </p>
          <p className="font-serif text-xs italic text-muted-foreground/80">
            &ldquo;Bilgelik, zamanı aşan tek hazinedir.&rdquo;
          </p>
        </div>
      </div>
    </footer>
  );
}
