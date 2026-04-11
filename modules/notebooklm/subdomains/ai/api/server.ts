/**
 * ai subdomain — server-only API.
 *
 * Factory functions for server-side use-case composition.
 * Must only be imported in Server Actions, route handlers, or server-side infrastructure.
 */

import { FirebaseRagRetrievalAdapter } from "../infrastructure/firebase/FirebaseRagRetrievalAdapter";
import { GenkitRagGenerationAdapter } from "../infrastructure/genkit/GenkitRagGenerationAdapter";
import { AnswerRagQueryUseCase } from "../application/use-cases/answer-rag-query.use-case";

export function createAnswerRagQueryUseCase(): AnswerRagQueryUseCase {
  return new AnswerRagQueryUseCase(
    new FirebaseRagRetrievalAdapter(),
    new GenkitRagGenerationAdapter(),
  );
}
