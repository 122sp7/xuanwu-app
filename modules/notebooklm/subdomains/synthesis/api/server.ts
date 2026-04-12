/**
 * synthesis subdomain — server-only API.
 *
 * Factory functions and infrastructure adapters that depend on server-only
 * packages (genkit, google-genai). Must only be imported in Server Actions,
 * route handlers, or server-side infrastructure.
 */

import { FirebaseRagRetrievalAdapter } from "../infrastructure/firebase/FirebaseRagRetrievalAdapter";
import { GenkitRagGenerationAdapter } from "../infrastructure/genkit/GenkitRagGenerationAdapter";
import { AnswerRagQueryUseCase } from "../application/use-cases/answer-rag-query.use-case";

export { GenkitRagGenerationAdapter } from "../infrastructure/genkit/GenkitRagGenerationAdapter";

export function createAnswerRagQueryUseCase(): AnswerRagQueryUseCase {
  return new AnswerRagQueryUseCase(
    new FirebaseRagRetrievalAdapter(),
    new GenkitRagGenerationAdapter(),
  );
}
