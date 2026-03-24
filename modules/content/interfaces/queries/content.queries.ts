/**
 * Module: content
 * Layer: interfaces/queries
 * Purpose: Server-side query helpers for reading Content domain data.
 */

import type { ContentPage, ContentPageTreeNode } from "../../domain/entities/content-page.entity";
import type { ContentBlock } from "../../domain/entities/content-block.entity";
import {
  GetContentPageUseCase,
  ListContentPagesUseCase,
  GetContentPageTreeUseCase,
} from "../../application/use-cases/content-page.use-cases";
import { ListContentBlocksUseCase } from "../../application/use-cases/content-block.use-cases";
import { FirebaseContentPageRepository } from "../../infrastructure/firebase/FirebaseContentPageRepository";
import { FirebaseContentBlockRepository } from "../../infrastructure/firebase/FirebaseContentBlockRepository";
import type { ContentVersion } from "../../domain/entities/content-version.entity";

export async function getContentPage(
  accountId: string,
  pageId: string,
): Promise<ContentPage | null> {
  return new GetContentPageUseCase(new FirebaseContentPageRepository()).execute(
    accountId,
    pageId,
  );
}

export async function getContentPages(accountId: string): Promise<ContentPage[]> {
  return new ListContentPagesUseCase(new FirebaseContentPageRepository()).execute(accountId);
}

export async function getContentPageTree(accountId: string): Promise<ContentPageTreeNode[]> {
  return new GetContentPageTreeUseCase(new FirebaseContentPageRepository()).execute(accountId);
}

export async function getContentBlocks(
  accountId: string,
  pageId: string,
): Promise<ContentBlock[]> {
  return new ListContentBlocksUseCase(new FirebaseContentBlockRepository()).execute(
    accountId,
    pageId,
  );
}

export async function getContentVersions(
  _accountId: string,
  _pageId: string,
): Promise<ContentVersion[]> {
  return [];
}
