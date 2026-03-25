/**
 * Module: content
 * Layer: domain/entities
 * Purpose: WikiBeta-style page entity — lightweight page model used by the
 *          wiki-beta interfaces during the transitional decomposition period.
 *          Lives in content because pages are a content-domain concern.
 */

export type WikiBetaPageStatus = "active" | "archived";

export interface WikiBetaPage {
  id: string;
  accountId: string;
  workspaceId?: string;
  title: string;
  slug: string;
  parentPageId: string | null;
  order: number;
  status: WikiBetaPageStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface WikiBetaPageTreeNode extends WikiBetaPage {
  children: WikiBetaPageTreeNode[];
}

export interface CreateWikiBetaPageInput {
  accountId: string;
  workspaceId?: string;
  title: string;
  parentPageId?: string | null;
}

export interface RenameWikiBetaPageInput {
  accountId: string;
  pageId: string;
  title: string;
}

export interface MoveWikiBetaPageInput {
  accountId: string;
  pageId: string;
  targetParentPageId?: string | null;
}
