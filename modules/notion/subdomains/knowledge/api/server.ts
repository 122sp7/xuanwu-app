import "server-only";

/**
 * knowledge subdomain — server-only API.
 *
 * Exports infrastructure implementations and composition helpers that must only
 * run in Server Actions, route handlers, or other server-side entry points.
 */

import { GenerateKnowledgePageSummaryQuery } from "../application/queries/knowledge-summary.queries";
import type { KnowledgePageSummary } from "../application/dto/knowledge.dto";
import { makeKnowledgeSummaryPort } from "../../../interfaces/knowledge/composition/capabilities";
import { makePageRepo, makeBlockRepo, makeCollectionRepo } from "../../../interfaces/knowledge/composition/repositories";

export { FirebaseKnowledgePageRepository } from "../../../infrastructure/knowledge/firebase/FirebaseKnowledgePageRepository";
export { FirebaseContentBlockRepository } from "../../../infrastructure/knowledge/firebase/FirebaseContentBlockRepository";
export { FirebaseKnowledgeCollectionRepository } from "../../../infrastructure/knowledge/firebase/FirebaseKnowledgeCollectionRepository";
export { FirebaseBacklinkIndexRepository } from "../../../infrastructure/knowledge/firebase/FirebaseBacklinkIndexRepository";
export { makePageRepo, makeBlockRepo, makeCollectionRepo } from "../../../interfaces/knowledge/composition/repositories";
export type { KnowledgeUseCases } from "../../../interfaces/knowledge/composition/use-cases";
export { makeKnowledgeUseCases } from "../../../interfaces/knowledge/composition/use-cases";

export async function getKnowledgePageSummary(accountId: string, pageId: string): Promise<KnowledgePageSummary | null> {
  return new GenerateKnowledgePageSummaryQuery(
    makePageRepo(),
    makeBlockRepo(),
    makeKnowledgeSummaryPort(),
  ).execute(accountId, pageId);
}
