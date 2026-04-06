export interface SelectionRange {
  /** Start character offset within the block's rich text (inclusive). */
  readonly from: number;
  /** End character offset within the block's rich text (exclusive). */
  readonly to: number;
}

export interface Comment {
  id: string;
  contentId: string;
  contentType: "page" | "article";
  workspaceId: string;
  accountId: string;
  authorId: string;
  body: string;
  parentCommentId: string | null;
  /**
   * Block this comment is anchored to (inline / block-level comment).
   * Null = page-level comment (not anchored to a specific block).
   */
  blockId: string | null;
  /**
   * Character-offset selection range within the block's rich text.
   * Only meaningful when blockId is set. Null = block-level (no text selection).
   */
  selectionRange: SelectionRange | null;
  resolvedAt: string | null;
  resolvedByUserId: string | null;
  createdAtISO: string;
  updatedAtISO: string;
}
