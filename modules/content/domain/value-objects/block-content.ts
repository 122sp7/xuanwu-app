/**
 * Module: content
 * Layer: domain/value-object
 * Purpose: BlockContent — immutable typed content snapshot for a Block.
 *
 * BlockContent is a VALUE OBJECT: equality is determined by value, not identity.
 * Changing any property produces a conceptually new BlockContent.
 *
 * Supported block types follow the Notion-like content model:
 *   text, heading-1/2/3, image, code, bullet-list, numbered-list, divider, quote.
 *
 * The domain layer keeps this type-only (no Zod) to remain framework-free.
 * Zod schemas live in the application/dto layer.
 */

// ── Block types ───────────────────────────────────────────────────────────────

export type BlockType =
  | "text"
  | "heading-1"
  | "heading-2"
  | "heading-3"
  | "image"
  | "code"
  | "bullet-list"
  | "numbered-list"
  | "divider"
  | "quote";

export const BLOCK_TYPES = [
  "text",
  "heading-1",
  "heading-2",
  "heading-3",
  "image",
  "code",
  "bullet-list",
  "numbered-list",
  "divider",
  "quote",
] as const satisfies readonly BlockType[];

export interface BlockContent {
  readonly type: BlockType;
  readonly text: string;
  readonly properties?: Readonly<Record<string, unknown>>;
}

export function blockContentEquals(a: BlockContent, b: BlockContent): boolean {
  if (a.type !== b.type || a.text !== b.text) return false;
  if (a.properties === undefined && b.properties === undefined) return true;
  if (a.properties === undefined || b.properties === undefined) return false;
  const sortedKeys = (obj: Record<string, unknown>): string =>
    JSON.stringify(obj, Object.keys(obj).sort());
  return sortedKeys(a.properties) === sortedKeys(b.properties);
}

export function emptyTextBlockContent(): BlockContent {
  return { type: "text", text: "" };
}
