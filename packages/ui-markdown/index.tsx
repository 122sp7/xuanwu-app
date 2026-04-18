/**
 * @module ui-markdown
 * Markdown rendering primitives.
 */

import type { ComponentPropsWithoutRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export interface MarkdownRendererProps
  extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  markdown: string;
}

export const MarkdownRenderer = ({ markdown, className, ...rest }: MarkdownRendererProps) => (
  <div className={["prose max-w-none", className].filter(Boolean).join(" ")} {...rest}>
    <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
  </div>
);
