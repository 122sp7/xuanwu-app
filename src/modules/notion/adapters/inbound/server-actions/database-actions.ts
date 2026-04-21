"use server";

/**
 * database-actions — notion database server actions.
 */

import { z } from "zod";
import { createClientNotionDatabaseUseCases } from "../../outbound/firebase-composition";

// ── Input schemas ─────────────────────────────────────────────────────────────

const QueryDatabasesInputSchema = z.object({
  workspaceId: z.string().uuid(),
  accountId: z.string().min(1),
});

const CreateDatabaseInputSchema = z.object({
  workspaceId: z.string().uuid(),
  accountId: z.string().min(1),
  parentPageId: z.string().uuid().nullable().optional(),
  name: z.string().min(1).max(200),
  description: z.string().max(500).optional(),
  createdByUserId: z.string().min(1).optional(),
});

// ── Actions ───────────────────────────────────────────────────────────────────

export async function queryDatabasesAction(rawInput: unknown) {
  const input = QueryDatabasesInputSchema.parse(rawInput);
  const { findByWorkspaceId } = createClientNotionDatabaseUseCases();
  return findByWorkspaceId(input.workspaceId);
}

export async function createDatabaseAction(rawInput: unknown) {
  const input = CreateDatabaseInputSchema.parse(rawInput);
  const { createDatabase } = createClientNotionDatabaseUseCases();
  return createDatabase.execute({
    workspaceId: input.workspaceId,
    accountId: input.accountId,
    parentPageId: input.parentPageId ?? null,
    title: input.name,
    description: input.description,
    createdByUserId: input.createdByUserId ?? input.accountId,
  });
}
