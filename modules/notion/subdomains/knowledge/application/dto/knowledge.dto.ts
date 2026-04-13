/**
 * Application-layer DTO re-exports for the knowledge subdomain.
 * Interfaces must import from here, not from domain/ directly.
 */
export type { KnowledgePageSnapshot, KnowledgePageTreeNode } from "../../domain/aggregates/KnowledgePage";
export type { ContentBlockSnapshot } from "../../domain/aggregates/ContentBlock";
export type { KnowledgeCollectionSnapshot } from "../../domain/aggregates/KnowledgeCollection";
export type { BlockContent, RichTextSpan } from "../../domain/value-objects/BlockContent";

import type { RichTextSpan } from "../../domain/value-objects/BlockContent";

/**
 * richTextToPlainText — converts rich-text spans to a plain string.
 *
 * Application-layer utility that mirrors the domain value-object helper.
 * Defined here so interfaces/ do not depend directly on domain/.
 */
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
