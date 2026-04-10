import { remark } from "remark";
import remarkHtml from "remark-html";

/**
 * Convert markdown string to HTML.
 * Headings, links, lists are wrapped in HTML; consumers apply prose styles.
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  if (!markdown) return "";
  const result = await remark().use(remarkHtml, { sanitize: false }).process(markdown);
  return result.toString();
}

/**
 * Estimate reading time (words / 200wpm), in minutes (min 1).
 */
export function estimateReadingTime(text: string): number {
  if (!text) return 1;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}
