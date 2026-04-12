"use server";

import { runKnowledgeRagQuery } from "../../../subdomains/synthesis/api/server";
import type { KnowledgeRagQueryResult } from "../../../subdomains/synthesis/domain/repositories/IKnowledgeContentRepository";

function isBlank(value: string): boolean {
  return value.trim().length === 0;
}

export interface RunKnowledgeRagQueryInput {
  query: string;
  accountId: string;
  workspaceId: string;
  topK?: number;
  requireReady?: boolean;
  maxAgeDays?: number;
}

export async function runKnowledgeRagQueryAction(
  input: RunKnowledgeRagQueryInput,
): Promise<KnowledgeRagQueryResult> {
  if (
    isBlank(input.query)
    || isBlank(input.accountId)
    || isBlank(input.workspaceId)
  ) {
    throw new Error("Invalid rag query input.");
  }

  return runKnowledgeRagQuery(
    input.query,
    input.accountId,
    input.workspaceId,
    input.topK ?? 4,
    {
      requireReady: input.requireReady,
      maxAgeDays: input.maxAgeDays,
    },
  );
}
