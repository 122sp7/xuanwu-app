/**
 * Module: notion/subdomains/knowledge
 * Layer: domain/repositories
 * Purpose: Port interface for KnowledgePage persistence.
 */

import type { KnowledgePage, KnowledgePageSnapshot } from "../aggregates/KnowledgePage";

export interface IKnowledgePageRepository {
  save(page: KnowledgePage): Promise<void>;
  findById(accountId: string, pageId: string): Promise<KnowledgePage | null>;
  listByAccountId(accountId: string): Promise<KnowledgePage[]>;
  listByWorkspaceId(accountId: string, workspaceId: string): Promise<KnowledgePage[]>;
  /** Count pages at same parent level for ordering */
  countByParent(accountId: string, parentPageId: string | null): Promise<number>;
  /** Snapshot type for direct projection queries */
  findSnapshotById(accountId: string, pageId: string): Promise<KnowledgePageSnapshot | null>;
  listSnapshotsByAccountId(accountId: string): Promise<KnowledgePageSnapshot[]>;
  listSnapshotsByWorkspaceId(accountId: string, workspaceId: string): Promise<KnowledgePageSnapshot[]>;
}
