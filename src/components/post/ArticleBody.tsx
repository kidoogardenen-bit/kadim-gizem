interface ArticleBodyProps {
  html: string;
}

/**
 * Renders pre-rendered markdown HTML inside a styled prose container.
 * Tailwind v4 typography is approximated with custom utility classes
 * since the project does not depend on @tailwindcss/typography.
 */
export function ArticleBody({ html }: ArticleBodyProps) {
  return (
    <div
      className="article-prose mx-auto max-w-3xl text-lg leading-relaxed text-foreground/90
        [&>h1]:font-[family-name:var(--font-cinzel,serif)] [&>h1]:mt-12 [&>h1]:mb-6 [&>h1]:text-4xl [&>h1]:font-bold [&>h1]:tracking-tight [&>h1]:text-amber-400
        [&>h2]:font-[family-name:var(--font-cinzel,serif)] [&>h2]:mt-10 [&>h2]:mb-5 [&>h2]:text-3xl [&>h2]:font-semibold [&>h2]:tracking-tight [&>h2]:text-amber-400
        [&>h3]:font-[family-name:var(--font-cinzel,serif)] [&>h3]:mt-8 [&>h3]:mb-4 [&>h3]:text-2xl [&>h3]:font-semibold [&>h3]:text-foreground
        [&>h4]:font-[family-name:var(--font-cinzel,serif)] [&>h4]:mt-6 [&>h4]:mb-3 [&>h4]:text-xl [&>h4]:font-semibold [&>h4]:text-foreground
        [&>p]:my-6 [&>p]:leading-[1.85]
        [&>ul]:my-6 [&>ul]:list-disc [&>ul]:pl-6 [&>ul>li]:my-2
        [&>ol]:my-6 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol>li]:my-2
        [&>blockquote]:my-8 [&>blockquote]:border-l-4 [&>blockquote]:border-amber-500 [&>blockquote]:pl-6 [&>blockquote]:italic [&>blockquote]:text-foreground/80
        [&>hr]:my-12 [&>hr]:border-amber-500/20
        [&_a]:text-amber-400 [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-amber-300
        [&_strong]:text-foreground [&_strong]:font-semibold
        [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_code]:text-amber-300
        [&>pre]:my-6 [&>pre]:overflow-x-auto [&>pre]:rounded-lg [&>pre]:bg-zinc-950 [&>pre]:p-4 [&>pre]:text-sm
        [&_img]:my-8 [&_img]:rounded-xl [&_img]:ring-1 [&_img]:ring-foreground/10"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
