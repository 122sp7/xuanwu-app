/**
 * @module libs/react-markdown
 * Thin wrapper for react-markdown.
 *
 * Provides a single import path for Markdown rendering in React with both
 * sync and async renderers, plus URL sanitization helper.
 *
 * Usage:
 *   import { ReactMarkdown, remarkPlugins } from "@/libs/react-markdown";
 *   import { remarkGfm } from "@/libs/remark-gfm";
 *
 *   <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
 */

export {
  default as ReactMarkdown,
  defaultUrlTransform,
  MarkdownAsync,
  MarkdownHooks,
} from "react-markdown";

export type {
  Components as ReactMarkdownComponents,
  ExtraProps as ReactMarkdownExtraProps,
  Options as ReactMarkdownOptions,
  UrlTransform as ReactMarkdownUrlTransform,
} from "react-markdown";
