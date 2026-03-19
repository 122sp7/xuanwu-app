/**
 * @module lib/remark-gfm
 * Thin wrapper for remark-gfm.
 *
 * Adds GitHub Flavored Markdown support for react-markdown / unified:
 * tables, autolinks, task lists, and strikethrough.
 */

export { default as remarkGfm } from "remark-gfm";
export { default } from "remark-gfm";

export type { Options as RemarkGfmOptions } from "remark-gfm";
