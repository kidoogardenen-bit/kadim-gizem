"use client";

import * as React from "react";
import Link from "next/link";
import { MenuIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { NAV_ITEMS, SITE } from "@/lib/constants";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { SearchTrigger } from "@/components/search/SearchTrigger";

// import { UserMenu } from "@/components/auth/UserMenu";
// Placeholder until auth agent finishes UserMenu.
function UserMenuPlaceholder() {
  return (
    <Link
      href="/giris"
      className={cn(
        buttonVariants({ variant: "outline", size: "sm" }),
        "hidden sm:inline-flex border-gold/40 text-foreground hover:bg-gold/10 hover:text-gold"
      )}
    >
      Giriş
    </Link>
  );
}

export function Header() {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        "backdrop-blur-xl",
        scrolled
          ? "bg-background/80 border-b border-gold/20 shadow-[0_1px_0_0_rgba(184,137,58,0.15)]"
          : "bg-background/40 border-b border-transparent"
      )}
    >
      {/* Gold hairline accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px gold-divider opacity-60"
      />

      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6 lg:h-20">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2"
          aria-label={SITE.name}
        >
          <span className="font-display text-lg font-bold tracking-[0.18em] text-foreground transition-colors group-hover:text-gold md:text-xl">
            KADİM
          </span>
          <span className="font-display text-lg font-bold tracking-[0.18em] text-gold transition-colors md:text-xl">
            GİZEM
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative font-serif text-[15px] font-medium text-foreground/80 transition-colors hover:text-gold"
            >
              <span>{item.label}</span>
              <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-1 md:gap-2">
          <SearchTrigger />

          <ThemeToggle />

          <UserMenuPlaceholder />

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger
              aria-label="Menü"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "md:hidden text-foreground/80 hover:text-gold hover:bg-gold/10"
              )}
            >
              <MenuIcon className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[82vw] max-w-sm border-l border-gold/20 bg-background/95 backdrop-blur-xl"
            >
              <SheetHeader>
                <SheetTitle className="font-display tracking-[0.18em] text-gold">
                  KADİM GİZEM
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-1 px-2">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-md px-3 py-3 font-serif text-lg text-foreground/90 transition-colors hover:bg-gold/10 hover:text-gold"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="my-4 h-px w-full gold-divider opacity-50" />
                <Link
                  href="/giris"
                  className="rounded-md px-3 py-3 font-serif text-lg text-foreground/90 transition-colors hover:bg-gold/10 hover:text-gold"
                >
                  Giriş Yap
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
