/**
 * Module: notion/subdomains/knowledge
 * Layer: domain/repositories
 * Purpose: Port interface for KnowledgeCollection persistence.
 */

import type { KnowledgeCollection } from "../aggregates/KnowledgeCollection";

export interface IKnowledgeCollectionRepository {
  save(collection: KnowledgeCollection): Promise<void>;
  findById(accountId: string, collectionId: string): Promise<KnowledgeCollection | null>;
  listByAccountId(accountId: string): Promise<KnowledgeCollection[]>;
  listByWorkspaceId(accountId: string, workspaceId: string): Promise<KnowledgeCollection[]>;
}
