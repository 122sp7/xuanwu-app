/**
 * Module: notion/subdomains/knowledge
 * Layer: interfaces/queries
 * Purpose: Server-side read helpers for the knowledge subdomain.
 */

import { FirebaseKnowledgePageRepository } from "../../infrastructure/firebase/FirebaseKnowledgePageRepository";
import { FirebaseContentBlockRepository } from "../../infrastructure/firebase/FirebaseContentBlockRepository";
import { FirebaseKnowledgeCollectionRepository } from "../../infrastructure/firebase/FirebaseKnowledgeCollectionRepository";
import {
  GetKnowledgePageUseCase,
  ListKnowledgePagesUseCase,
  ListKnowledgePagesByWorkspaceUseCase,
  GetKnowledgePageTreeUseCase,
  GetKnowledgePageTreeByWorkspaceUseCase,
} from "../../application/use-cases/KnowledgePageUseCases";
import { ListContentBlocksUseCase } from "../../application/use-cases/ContentBlockUseCases";
import {
  GetKnowledgeCollectionUseCase,
  ListKnowledgeCollectionsUseCase,
} from "../../application/use-cases/KnowledgeCollectionUseCases";
import type { KnowledgePageSnapshot } from "../../domain/aggregates/KnowledgePage";
import type { ContentBlockSnapshot } from "../../domain/aggregates/ContentBlock";
import type { KnowledgeCollectionSnapshot } from "../../domain/aggregates/KnowledgeCollection";

const makePageRepo = () => new FirebaseKnowledgePageRepository();
const makeBlockRepo = () => new FirebaseContentBlockRepository();
const makeCollRepo = () => new FirebaseKnowledgeCollectionRepository();

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
  return new GetKnowledgeCollectionUseCase(makeCollRepo()).execute(accountId, collectionId);
}

export async function getKnowledgeCollections(accountId: string): Promise<KnowledgeCollectionSnapshot[]> {
  return new ListKnowledgeCollectionsUseCase(makeCollRepo()).execute(accountId);
}
