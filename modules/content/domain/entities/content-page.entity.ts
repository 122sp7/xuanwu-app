/**
 * Module: content
 * Layer: domain/entity
 * Purpose: Page aggregate root — the central document unit in the Content domain.
 */

export type ContentPageStatus = "active" | "archived";

export const CONTENT_PAGE_STATUSES = ["active", "archived"] as const satisfies readonly ContentPageStatus[];

export interface ContentPage {
  readonly id: string;
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly title: string;
  readonly slug: string;
  readonly parentPageId: string | null;
  readonly order: number;
  readonly blockIds: readonly string[];
  readonly status: ContentPageStatus;
  readonly createdByUserId: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface ContentPageTreeNode extends ContentPage {
  readonly children: readonly ContentPageTreeNode[];
}

export interface CreateContentPageInput {
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly title: string;
  readonly parentPageId?: string | null;
  readonly createdByUserId: string;
}

export interface RenameContentPageInput {
  readonly accountId: string;
  readonly pageId: string;
  readonly title: string;
}

export interface MoveContentPageInput {
  readonly accountId: string;
  readonly pageId: string;
  readonly targetParentPageId: string | null;
}

export interface ReorderContentPageBlocksInput {
  readonly accountId: string;
  readonly pageId: string;
  readonly blockIds: readonly string[];
}

export interface ArchiveContentPageInput {
  readonly accountId: string;
  readonly pageId: string;
}
