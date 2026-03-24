/**
 * Module: knowledge
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

/**
 * Ordered tuple for Zod enum usage in the application layer.
 * Must stay in sync with BlockType above.
 */
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

// ── Value Object ──────────────────────────────────────────────────────────────

/**
 * BlockContent (Value Object).
 *
 * Immutable snapshot of what a block contains. All properties are readonly.
 * `text` holds plain-text or rich-text content (markdown-compatible).
 * `properties` is an open bag for type-specific metadata (e.g. code language,
 * image URL, list depth). Kept as Record to avoid domain-layer dependencies.
 */
export interface BlockContent {
  readonly type: BlockType;
  /** Primary text content (empty string for types like "divider" or "image"). */
  readonly text: string;
  /** Type-specific metadata. Examples:
   *  - code block: { language: "typescript" }
   *  - image block: { url: "https://...", alt: "..." }
   *  - list item: { depth: 0 }
   */
  readonly properties?: Readonly<Record<string, unknown>>;
}

// ── Pure helpers ──────────────────────────────────────────────────────────────

/**
 * Returns true when two BlockContent values are structurally equal.
 * Safe to use for optimistic UI diff checks.
 */
export function blockContentEquals(a: BlockContent, b: BlockContent): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * Returns an empty text block — the default content for a newly inserted block.
 */
export function emptyTextBlockContent(): BlockContent {
  return { type: "text", text: "" };
}
