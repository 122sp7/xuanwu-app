/**
 * Module: knowledge
 * Layer: domain/entity
 * Purpose: Page aggregate root — the central document unit in the Content domain.
 */

export type KnowledgePageStatus = "active" | "archived";
export type KnowledgePageApprovalState = "pending" | "approved";
/** Notion Wiki page verification state */
export type PageVerificationState = "verified" | "needs_review";

export const KNOWLEDGE_PAGE_STATUSES = ["active", "archived"] as const satisfies readonly KnowledgePageStatus[];
export const KNOWLEDGE_PAGE_APPROVAL_STATES = ["pending", "approved"] as const satisfies readonly KnowledgePageApprovalState[];
export const PAGE_VERIFICATION_STATES = ["verified", "needs_review"] as const satisfies readonly PageVerificationState[];

export interface KnowledgePage {
  readonly id: string;
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly title: string;
  readonly slug: string;
  readonly parentPageId: string | null;
  readonly order: number;
  readonly blockIds: readonly string[];
  readonly status: KnowledgePageStatus;
  /** Approval state for AI-parsed draft pages. Populated when the page originates from an ingestion pipeline. */
  readonly approvalState?: KnowledgePageApprovalState;
  /** ISO timestamp when this page was approved by an actor (approvalState = "approved"). */
  readonly approvedAtISO?: string;
  /** Actor who approved the page. */
  readonly approvedByUserId?: string;
  // ── Wiki / Knowledge Base fields (Notion-equivalent) ────────────────────────
  /**
   * Verification state for Wiki (Knowledge Base) pages.
   * undefined = page is not in wiki verification mode.
   * "verified" = marked as up-to-date by a verifier.
   * "needs_review" = flagged for review (may be stale).
   */
  readonly verificationState?: PageVerificationState;
  /** User responsible for keeping this page accurate. */
  readonly ownerId?: string;
  /** User who last set verificationState to "verified". */
  readonly verifiedByUserId?: string;
  /** ISO timestamp when the page was last verified. */
  readonly verifiedAtISO?: string;
  /** ISO timestamp after which the page auto-transitions to "needs_review". */
  readonly verificationExpiresAtISO?: string;
  // ── Visual identity (Notion-equivalent) ─────────────────────────────────────
  /** Emoji or image URL used as the page icon (shown next to title). */
  readonly iconUrl?: string;
  /** URL of the cover image displayed at the top of the page. */
  readonly coverUrl?: string;
  readonly createdByUserId: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface KnowledgePageTreeNode extends KnowledgePage {
  readonly children: readonly KnowledgePageTreeNode[];
}

export interface CreateKnowledgePageInput {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly title: string;
  readonly parentPageId?: string | null;
  readonly createdByUserId: string;
}

export interface RenameKnowledgePageInput {
  readonly accountId: string;
  readonly pageId: string;
  readonly title: string;
}

export interface MoveKnowledgePageInput {
  readonly accountId: string;
  readonly pageId: string;
  readonly targetParentPageId: string | null;
}

export interface ReorderKnowledgePageBlocksInput {
  readonly accountId: string;
  readonly pageId: string;
  readonly blockIds: readonly string[];
}

export interface ArchiveKnowledgePageInput {
  readonly accountId: string;
  readonly pageId: string;
}

export interface ApproveKnowledgePageInput {
  readonly accountId: string;
  readonly pageId: string;
  readonly approvedByUserId: string;
  readonly approvedAtISO: string;
}

export interface VerifyKnowledgePageInput {
  readonly accountId: string;
  readonly pageId: string;
  readonly verifiedByUserId: string;
  readonly verificationExpiresAtISO?: string;
}

export interface RequestPageReviewInput {
  readonly accountId: string;
  readonly pageId: string;
  readonly requestedByUserId: string;
}

export interface AssignPageOwnerInput {
  readonly accountId: string;
  readonly pageId: string;
  readonly ownerId: string;
}

export interface UpdatePageIconInput {
  readonly accountId: string;
  readonly pageId: string;
  /** Emoji character or image URL. Pass empty string to clear. */
  readonly iconUrl: string;
}

export interface UpdatePageCoverInput {
  readonly accountId: string;
  readonly pageId: string;
  /** Image URL for the cover. Pass empty string to clear. */
  readonly coverUrl: string;
}
