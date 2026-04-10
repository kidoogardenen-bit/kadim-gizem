"use client";

import { useState } from "react";
import { Link as LinkIcon, Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M22 12a10 10 0 1 0-11.563 9.876v-6.987H7.898V12h2.539V9.797c0-2.506 1.492-3.89 3.776-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.563V12h2.773l-.443 2.889h-2.33v6.987A10.002 10.002 0 0 0 22 12Z" />
    </svg>
  );
}

interface ShareButtonsProps {
  url: string;
  title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs uppercase tracking-wider text-muted-foreground mr-2">
        Paylaş
      </span>
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Twitter'da paylaş"
        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
      >
        <TwitterIcon className="size-4" />
        <span>Twitter</span>
      </a>
      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook'ta paylaş"
        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
      >
        <FacebookIcon className="size-4" />
        <span>Facebook</span>
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
      >
        {copied ? <Check className="size-4" /> : <LinkIcon className="size-4" />}
        <span>{copied ? "Kopyalandı" : "Linki kopyala"}</span>
      </button>
    </div>
  );
}
