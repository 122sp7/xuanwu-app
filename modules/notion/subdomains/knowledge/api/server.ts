import "server-only";

/**
 * knowledge subdomain — server-only API.
 *
 * Exports infrastructure implementations and composition helpers that must only
 * run in Server Actions, route handlers, or other server-side entry points.
 */

import { GenerateKnowledgePageSummaryQuery } from "../application/queries/knowledge-summary.queries";
import type { KnowledgePageSummary } from "../application/dto/knowledge.dto";
import { SharedAiKnowledgeSummaryAdapter } from "../../../infrastructure/knowledge/ai/SharedAiKnowledgeSummaryAdapter";
import { FirebaseKnowledgePageRepository } from "../../../infrastructure/knowledge/firebase/FirebaseKnowledgePageRepository";
import { FirebaseContentBlockRepository } from "../../../infrastructure/knowledge/firebase/FirebaseContentBlockRepository";
import { FirebaseKnowledgeCollectionRepository } from "../../../infrastructure/knowledge/firebase/FirebaseKnowledgeCollectionRepository";
import { FirebaseBacklinkIndexRepository } from "../../../infrastructure/knowledge/firebase/FirebaseBacklinkIndexRepository";

export { FirebaseKnowledgePageRepository };
export { FirebaseContentBlockRepository };
export { FirebaseKnowledgeCollectionRepository };
export { FirebaseBacklinkIndexRepository };

export async function getKnowledgePageSummary(accountId: string, pageId: string): Promise<KnowledgePageSummary | null> {
  return new GenerateKnowledgePageSummaryQuery(
    new FirebaseKnowledgePageRepository(),
    new FirebaseContentBlockRepository(),
    new SharedAiKnowledgeSummaryAdapter(),
  ).execute(accountId, pageId);
}
