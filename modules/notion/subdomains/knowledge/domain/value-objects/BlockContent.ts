/**
 * Module: notion
 * Layer: domain/value-objects
 * Purpose: BlockContent value object — immutable typed content snapshot for a Block.
 *
 * Re-implementation of the original knowledge domain block-content.
 * This is a VALUE OBJECT: equality is determined by value, not identity.
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

interface BaseRichTextSpan {
  readonly annotations?: TextAnnotations;
}

export interface TextSpan extends BaseRichTextSpan {
  readonly type: "text";
  readonly plainText: string;
}

export interface MentionPageSpan extends BaseRichTextSpan {
  readonly type: "mention_page";
  readonly pageId: string;
  readonly label: string;
}

export interface MentionUserSpan extends BaseRichTextSpan {
  readonly type: "mention_user";
  readonly userId: string;
  readonly displayName: string;
}

export interface LinkSpan extends BaseRichTextSpan {
  readonly type: "link";
  readonly url: string;
  readonly label: string;
}

export type RichTextSpan = TextSpan | MentionPageSpan | MentionUserSpan | LinkSpan;

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

export function extractMentionedPageIds(spans: ReadonlyArray<RichTextSpan>): ReadonlyArray<string> {
  return spans
    .filter((s): s is MentionPageSpan => s.type === "mention_page")
    .map((s) => s.pageId);
}

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

export function plainTextBlockContent(text: string, type: BlockType = "text"): BlockContent {
  return { type, richText: [{ type: "text", plainText: text }] };
}
