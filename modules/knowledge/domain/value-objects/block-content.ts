/**
 * Module: knowledge
 * Layer: domain/value-object
 * Purpose: BlockContent — immutable typed content snapshot for a Block.
 *
 * BlockContent is a VALUE OBJECT: equality is determined by value, not identity.
 *
 * RichTextSpan models inline annotations (Notion-style rich text):
 *   - "text"         — plain text run
 *   - "mention_page" — inline @mention of another KnowledgePage
 *   - "mention_user" — inline @mention of a user (triggers notification)
 *   - "link"         — clickable hyperlink
 *
 * The domain layer keeps this type-only (no Zod) to remain framework-free.
 * Zod schemas live in the application/dto layer.
 */

// ── RichText Annotation Model ─────────────────────────────────────────────────

export type RichTextSpanType = "text" | "mention_page" | "mention_user" | "link";

export interface TextAnnotations {
  readonly bold?: boolean;
  readonly italic?: boolean;
  readonly underline?: boolean;
  readonly strikethrough?: boolean;
  readonly code?: boolean;
  readonly color?: string;
}

/** Base span — all spans carry optional formatting annotations. */
interface BaseRichTextSpan {
  readonly annotations?: TextAnnotations;
}

export interface TextSpan extends BaseRichTextSpan {
  readonly type: "text";
  /** The plain-text content of this run. */
  readonly plainText: string;
}

export interface MentionPageSpan extends BaseRichTextSpan {
  readonly type: "mention_page";
  /** ID of the referenced KnowledgePage. */
  readonly pageId: string;
  /** Display label (usually the page title at time of mention). */
  readonly label: string;
}

export interface MentionUserSpan extends BaseRichTextSpan {
  readonly type: "mention_user";
  /** User ID being mentioned. */
  readonly userId: string;
  /** Display name at time of mention. */
  readonly displayName: string;
}

export interface LinkSpan extends BaseRichTextSpan {
  readonly type: "link";
  readonly url: string;
  /** Visible link text. */
  readonly label: string;
}

export type RichTextSpan =
  | TextSpan
  | MentionPageSpan
  | MentionUserSpan
  | LinkSpan;

/** Extract all plain text from a rich-text array (for full-text search, previews). */
export function richTextToPlainText(spans: ReadonlyArray<RichTextSpan>): string {
  return spans
    .map((s) => {
      switch (s.type) {
        case "text": return s.plainText;
        case "mention_page": return s.label;
        case "mention_user": return `@${s.displayName}`;
        case "link": return s.label;
      }
    })
    .join("");
}

/** Collect all page IDs mentioned in a rich-text array (used for backlink indexing). */
export function extractMentionedPageIds(spans: ReadonlyArray<RichTextSpan>): ReadonlyArray<string> {
  return spans
    .filter((s): s is MentionPageSpan => s.type === "mention_page")
    .map((s) => s.pageId);
}

/** Collect all user IDs mentioned in a rich-text array (used for notification dispatch). */
export function extractMentionedUserIds(spans: ReadonlyArray<RichTextSpan>): ReadonlyArray<string> {
  return spans
    .filter((s): s is MentionUserSpan => s.type === "mention_user")
    .map((s) => s.userId);
}

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
  | "quote"
  | "callout"
  | "toggle"
  | "toc"
  | "synced";

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
  "callout",
  "toggle",
  "toc",
  "synced",
] as const satisfies readonly BlockType[];

export interface BlockContent {
  readonly type: BlockType;
  /**
   * Structured inline content — ordered array of rich-text spans.
   * For non-textual blocks (image, divider) this array is empty.
   */
  readonly richText: ReadonlyArray<RichTextSpan>;
  readonly properties?: Readonly<Record<string, unknown>>;
}

export function blockContentEquals(a: BlockContent, b: BlockContent): boolean {
  if (a.type !== b.type) return false;
  if (JSON.stringify(a.richText) !== JSON.stringify(b.richText)) return false;
  if (a.properties === undefined && b.properties === undefined) return true;
  if (a.properties === undefined || b.properties === undefined) return false;
  const sortedKeys = (obj: Record<string, unknown>): string =>
    JSON.stringify(obj, Object.keys(obj).sort());
  return sortedKeys(a.properties) === sortedKeys(b.properties);
}

export function emptyTextBlockContent(): BlockContent {
  return { type: "text", richText: [] };
}

/** Convenience factory for a plain-text block (single TextSpan). */
export function plainTextBlockContent(text: string, type: BlockType = "text"): BlockContent {
  return { type, richText: [{ type: "text", plainText: text }] };
}
