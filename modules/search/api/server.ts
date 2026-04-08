/**
 * modules/search — server-only API barrel.
 *
 * Exports concrete implementation classes that depend on server-only packages
 * (genkit, gRPC, google-auth-library, etc.).
 * MUST NOT be imported by client components or the client-side bundle.
 * Server actions and server-only modules use this barrel.
 *
 * Prefer the factory function `createAnswerRagQueryUseCase()` over importing
 * the raw classes — it keeps infrastructure composition inside this bounded
 * context and prevents callers from manually wiring foreign adapters.
 */

export { AnswerRagQueryUseCase } from "../application/use-cases/answer-rag-query.use-case";
export { FirebaseRagRetrievalRepository } from "../infrastructure/firebase/FirebaseRagRetrievalRepository";
export { GenkitRagGenerationRepository } from "../infrastructure/genkit/GenkitRagGenerationRepository";

import { AnswerRagQueryUseCase } from "../application/use-cases/answer-rag-query.use-case";
import { FirebaseRagRetrievalRepository } from "../infrastructure/firebase/FirebaseRagRetrievalRepository";
import { GenkitRagGenerationRepository } from "../infrastructure/genkit/GenkitRagGenerationRepository";

/**
 * Factory that returns a fully-wired `AnswerRagQueryUseCase`.
 * Callers across bounded-context boundaries (e.g. notebook module) MUST use
 * this factory so infrastructure composition stays inside `modules/search`.
 */
export function createAnswerRagQueryUseCase(): AnswerRagQueryUseCase {
  return new AnswerRagQueryUseCase(
    new FirebaseRagRetrievalRepository(),
    new GenkitRagGenerationRepository(),
  );
}
