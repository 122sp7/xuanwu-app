/**
 * Module: notion/subdomains/knowledge
 * Layer: interfaces/queries
 * Purpose: Server-side read helpers for the knowledge subdomain.
 */

import { makeBlockRepo, makeCollectionRepo, makePageRepo } from "../../api/factories";
import {
  GetKnowledgePageUseCase,
  ListKnowledgePagesUseCase,
  ListKnowledgePagesByWorkspaceUseCase,
  GetKnowledgePageTreeUseCase,
  GetKnowledgePageTreeByWorkspaceUseCase,
} from "../../application/queries/knowledge-page.queries";
import { ListContentBlocksUseCase } from "../../application/queries/content-block.queries";
import {
  GetKnowledgeCollectionUseCase,
  ListKnowledgeCollectionsUseCase,
} from "../../application/queries/knowledge-collection.queries";
import type { KnowledgePageSnapshot, ContentBlockSnapshot, KnowledgeCollectionSnapshot } from "../../application/dto/knowledge.dto";

export async function getKnowledgePage(accountId: string, pageId: string): Promise<KnowledgePageSnapshot | null> {
  return new GetKnowledgePageUseCase(makePageRepo()).execute(accountId, pageId);
}

export async function getKnowledgePages(accountId: string): Promise<KnowledgePageSnapshot[]> {
  return new ListKnowledgePagesUseCase(makePageRepo()).execute(accountId);
}

export async function getKnowledgePagesByWorkspace(accountId: string, workspaceId: string): Promise<KnowledgePageSnapshot[]> {
  return new ListKnowledgePagesByWorkspaceUseCase(makePageRepo()).execute(accountId, workspaceId);
}

export async function getKnowledgePageTree(accountId: string) {
  return new GetKnowledgePageTreeUseCase(makePageRepo()).execute(accountId);
}

export async function getKnowledgePageTreeByWorkspace(accountId: string, workspaceId: string) {
  return new GetKnowledgePageTreeByWorkspaceUseCase(makePageRepo()).execute(accountId, workspaceId);
}

export async function getKnowledgeBlocks(accountId: string, pageId: string): Promise<ContentBlockSnapshot[]> {
  return new ListContentBlocksUseCase(makeBlockRepo()).execute(accountId, pageId);
}

export async function getKnowledgeCollection(accountId: string, collectionId: string): Promise<KnowledgeCollectionSnapshot | null> {
  return new GetKnowledgeCollectionUseCase(makeCollectionRepo()).execute(accountId, collectionId);
}

export async function getKnowledgeCollections(accountId: string): Promise<KnowledgeCollectionSnapshot[]> {
  return new ListKnowledgeCollectionsUseCase(makeCollectionRepo()).execute(accountId);
}
