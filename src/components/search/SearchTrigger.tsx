"use client";

import * as React from "react";
import { SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SearchDialog } from "@/components/search/SearchDialog";

export function SearchTrigger() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Ara"
        onClick={() => setOpen(true)}
        className="text-foreground/80 hover:text-gold hover:bg-gold/10 md:hidden"
      >
        <SearchIcon className="h-[1.1rem] w-[1.1rem]" />
      </Button>

      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Ara"
        className="hidden md:inline-flex items-center gap-2 rounded-md border border-foreground/10 bg-background/40 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-gold/40 hover:text-gold"
      >
        <SearchIcon className="h-4 w-4" />
        <span>Ara...</span>
        <kbd className="ml-2 hidden items-center gap-0.5 rounded border border-foreground/15 bg-muted/50 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground lg:inline-flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <SearchDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
