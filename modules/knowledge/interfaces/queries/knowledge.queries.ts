/**
 * Module: knowledge
 * Layer: interfaces/queries
 * Purpose: Server-side query helpers for reading Content domain data.
 */

import type { KnowledgePage, KnowledgePageTreeNode } from "../../domain/entities/content-page.entity";
import type { KnowledgeBlock } from "../../domain/entities/content-block.entity";
import type { KnowledgeCollection } from "../../domain/entities/knowledge-collection.entity";
import {
  GetKnowledgePageUseCase,
  ListKnowledgePagesUseCase,
  GetKnowledgePageTreeUseCase,
} from "../../application/use-cases/knowledge-page.use-cases";
import { ListKnowledgeBlocksUseCase } from "../../application/use-cases/knowledge-block.use-cases";
import {
  GetKnowledgeCollectionUseCase,
  ListKnowledgeCollectionsByAccountUseCase,
} from "../../application/use-cases/knowledge-collection.use-cases";
import { FirebaseKnowledgePageRepository } from "../../infrastructure/firebase/FirebaseContentPageRepository";
import { FirebaseKnowledgeBlockRepository } from "../../infrastructure/firebase/FirebaseContentBlockRepository";
import { FirebaseKnowledgeCollectionRepository } from "../../infrastructure/firebase/FirebaseContentCollectionRepository";
import type { KnowledgeVersion } from "../../domain/entities/content-version.entity";

export async function getKnowledgePage(
  accountId: string,
  pageId: string,
): Promise<KnowledgePage | null> {
  return new GetKnowledgePageUseCase(new FirebaseKnowledgePageRepository()).execute(
    accountId,
    pageId,
  );
}

export async function getKnowledgePages(accountId: string): Promise<KnowledgePage[]> {
  return new ListKnowledgePagesUseCase(new FirebaseKnowledgePageRepository()).execute(accountId);
}

export async function getKnowledgePageTree(accountId: string): Promise<KnowledgePageTreeNode[]> {
  return new GetKnowledgePageTreeUseCase(new FirebaseKnowledgePageRepository()).execute(accountId);
}

export async function getKnowledgeBlocks(
  accountId: string,
  pageId: string,
): Promise<KnowledgeBlock[]> {
  return new ListKnowledgeBlocksUseCase(new FirebaseKnowledgeBlockRepository()).execute(
    accountId,
    pageId,
  );
}

export async function getKnowledgeVersions(
  _accountId: string,
  _pageId: string,
): Promise<KnowledgeVersion[]> {
  return [];
}

// ── Collection queries ────────────────────────────────────────────────────────

export async function getKnowledgeCollection(
  accountId: string,
  collectionId: string,
): Promise<KnowledgeCollection | null> {
  return new GetKnowledgeCollectionUseCase(new FirebaseKnowledgeCollectionRepository()).execute(
    accountId,
    collectionId,
  );
}

export async function getKnowledgeCollections(
  accountId: string,
): Promise<KnowledgeCollection[]> {
  return new ListKnowledgeCollectionsByAccountUseCase(new FirebaseKnowledgeCollectionRepository()).execute(
    accountId,
  );
}
