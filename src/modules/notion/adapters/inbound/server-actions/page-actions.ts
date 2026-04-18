"use server";

/**
 * page-actions — notion page server actions.
 */

import { z } from "zod";
import { createClientNotionPageUseCases } from "../../outbound/firebase-composition";

// ── Input schemas ─────────────────────────────────────────────────────────────

const QueryPagesInputSchema = z.object({
  workspaceId: z.string().uuid(),
  accountId: z.string().min(1),
  parentPageId: z.string().nullable().optional(),
});

const CreatePageInputSchema = z.object({
  workspaceId: z.string().uuid(),
  accountId: z.string().min(1),
  title: z.string().min(1).max(500),
  parentPageId: z.string().nullable().optional(),
  createdByUserId: z.string().min(1),
});

const RenamePageInputSchema = z.object({
  pageId: z.string().uuid(),
  title: z.string().min(1).max(500),
});

const ArchivePageInputSchema = z.object({
  pageId: z.string().uuid(),
});

// ── Actions ───────────────────────────────────────────────────────────────────

export async function queryPagesAction(rawInput: unknown) {
  const input = QueryPagesInputSchema.parse(rawInput);
  const { queryPages } = createClientNotionPageUseCases();
  return queryPages.execute({
    workspaceId: input.workspaceId,
    parentPageId: input.parentPageId ?? undefined,
  });
}

export async function createPageAction(rawInput: unknown) {
  const input = CreatePageInputSchema.parse(rawInput);
  const { createPage } = createClientNotionPageUseCases();
  return createPage.execute({
    accountId: input.accountId,
    workspaceId: input.workspaceId,
    title: input.title,
    parentPageId: input.parentPageId ?? undefined,
    createdByUserId: input.createdByUserId,
  });
}

export async function renamePageAction(rawInput: unknown) {
  const input = RenamePageInputSchema.parse(rawInput);
  const { renamePage } = createClientNotionPageUseCases();
  return renamePage.execute(input.pageId, input.title);
}

export async function archivePageAction(rawInput: unknown) {
  const input = ArchivePageInputSchema.parse(rawInput);
  const { archivePage } = createClientNotionPageUseCases();
  return archivePage.execute(input.pageId);
}
