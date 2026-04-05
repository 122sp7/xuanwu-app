/**
 * Module: knowledge
 * Layer: domain/entity
 * Purpose: Page aggregate root — the central document unit in the Content domain.
 */

export type KnowledgePageStatus = "active" | "archived";
export type KnowledgePageApprovalState = "pending" | "approved";

export const KNOWLEDGE_PAGE_STATUSES = ["active", "archived"] as const satisfies readonly KnowledgePageStatus[];
export const KNOWLEDGE_PAGE_APPROVAL_STATES = ["pending", "approved"] as const satisfies readonly KnowledgePageApprovalState[];

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
  readonly createdByUserId: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface KnowledgePageTreeNode extends KnowledgePage {
  readonly children: readonly KnowledgePageTreeNode[];
}

export interface CreateKnowledgePageInput {
  readonly accountId: string;
  readonly workspaceId?: string;
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
