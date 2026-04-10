"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { FileTextIcon, SearchIcon } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

export interface SearchResult {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  categorySlug: string | null;
  categoryName: string | null;
}

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [debounced, setDebounced] = React.useState("");
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [loading, setLoading] = React.useState(false);

  // Debounce the query
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  // Fetch results
  React.useEffect(() => {
    if (debounced.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(debounced)}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setResults(Array.isArray(data.results) ? data.results.slice(0, 8) : []);
      })
      .catch(() => {
        if (!cancelled) setResults([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debounced]);

  // Reset on close
  React.useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  const handleSelect = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };

  // Group by category
  const grouped = React.useMemo(() => {
    const map = new Map<string, SearchResult[]>();
    for (const r of results) {
      const key = r.categoryName ?? r.categorySlug ?? "Diğer";
      const arr = map.get(key) ?? [];
      arr.push(r);
      map.set(key, arr);
    }
    return Array.from(map.entries());
  }, [results]);

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Arama"
      description="Kadim Gizem arşivinde arama yapın"
    >
      <CommandInput
        placeholder="Mitoloji, tarih, gizem..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {debounced.length < 2 ? (
          <CommandEmpty>Aramaya başlamak için yazmaya devam edin.</CommandEmpty>
        ) : loading ? (
          <CommandEmpty>Aranıyor...</CommandEmpty>
        ) : results.length === 0 ? (
          <CommandEmpty>Sonuç bulunamadı.</CommandEmpty>
        ) : (
          <>
            {grouped.map(([categoryName, items]) => (
              <CommandGroup key={categoryName} heading={categoryName}>
                {items.map((item) => {
                  const href = `/${item.categorySlug ?? "genel"}/${item.slug}`;
                  return (
                    <CommandItem
                      key={item.id}
                      value={`${item.title}-${item.id}`}
                      onSelect={() => handleSelect(href)}
                    >
                      <FileTextIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                      <div className="flex flex-col">
                        <span className="font-medium">{item.title}</span>
                        {item.excerpt ? (
                          <span className="line-clamp-1 text-xs text-muted-foreground">
                            {item.excerpt}
                          </span>
                        ) : null}
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ))}
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                value="__see_all__"
                onSelect={() =>
                  handleSelect(`/arama?q=${encodeURIComponent(debounced)}`)
                }
              >
                <SearchIcon className="mr-2 h-4 w-4" />
                Tüm sonuçları göster
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
