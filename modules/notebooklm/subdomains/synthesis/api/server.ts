/**
 * synthesis subdomain — server-only API.
 *
 * Factory functions and infrastructure adapters that depend on server-only
 * packages. Must only be imported in Server Actions, route handlers, or
 * server-side infrastructure.
 */

import { FirebaseRagRetrievalAdapter } from "../infrastructure/firebase/FirebaseRagRetrievalAdapter";
import { PlatformRagGenerationAdapter } from "../infrastructure/platform/PlatformRagGenerationAdapter";
import { AnswerRagQueryUseCase } from "../application/use-cases/answer-rag-query.use-case";

export { PlatformRagGenerationAdapter } from "../infrastructure/platform/PlatformRagGenerationAdapter";

export function createAnswerRagQueryUseCase(): AnswerRagQueryUseCase {
  return new AnswerRagQueryUseCase(
    new FirebaseRagRetrievalAdapter(),
    new PlatformRagGenerationAdapter(),
  );
}
