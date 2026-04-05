/**
 * Module: knowledge
 * Layer: domain/entities
 * Purpose: Wiki-style page entity — lightweight page model used by the
 *          wiki interfaces.
 *          Lives in knowledge because pages are a knowledge-domain concern.
 */

export type WikiPageStatus = "active" | "archived";

export interface WikiPage {
  id: string;
  accountId: string;
  workspaceId?: string;
  title: string;
  slug: string;
  parentPageId: string | null;
  order: number;
  status: WikiPageStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface WikiPageTreeNode extends WikiPage {
  children: WikiPageTreeNode[];
}

export interface CreateWikiPageInput {
  accountId: string;
  workspaceId?: string;
  title: string;
  parentPageId?: string | null;
}

export interface RenameWikiPageInput {
  accountId: string;
  pageId: string;
  title: string;
}

export interface MoveWikiPageInput {
  accountId: string;
  pageId: string;
  targetParentPageId?: string | null;
}
