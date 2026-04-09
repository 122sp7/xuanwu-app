/**
 * Module: notion/subdomains/collaboration
 * Layer: domain/aggregates
 * Aggregate root: Comment
 *
 * Represents an inline or block-level comment on a knowledge page or article.
 * Supports threaded replies (parentCommentId) and rich-text selection anchors.
 */

export type ContentType = "page" | "article";

export interface SelectionRange {
  from: number;
  to: number;
}

export interface CommentSnapshot {
  readonly id: string;
  readonly contentId: string;
  readonly contentType: ContentType;
  readonly workspaceId: string;
  readonly accountId: string;
  readonly authorId: string;
  readonly body: string;
  readonly parentCommentId: string | null;
  readonly blockId: string | null;
  readonly selectionRange: SelectionRange | null;
  readonly resolvedAt: string | null;
  readonly resolvedByUserId: string | null;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export type CommentId = string;
