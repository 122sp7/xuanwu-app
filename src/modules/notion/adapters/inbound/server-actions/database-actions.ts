"use server";

/**
 * database-actions — notion database server actions.
 */

import { v4 as uuid } from "uuid";
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
  /** pageId is optional; a new UUID is auto-generated when omitted. */
  pageId: z.string().uuid().optional(),
  name: z.string().min(1).max(200),
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
    pageId: input.pageId ?? uuid(),
    title: input.name,
    createdByUserId: "",
  });
}
