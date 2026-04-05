/**
 * modules/retrieval — server-only API barrel.
 *
 * Exports concrete implementation classes that depend on server-only packages
 * (genkit, gRPC, google-auth-library, etc.).
 * MUST NOT be imported by client components or the client-side bundle.
 * Server actions and server-only modules use this barrel.
 */

export { AnswerRagQueryUseCase } from "../application/use-cases/answer-rag-query.use-case";
export { FirebaseRagRetrievalRepository } from "../infrastructure/firebase/FirebaseRagRetrievalRepository";
export { GenkitRagGenerationRepository } from "../infrastructure/genkit/GenkitRagGenerationRepository";
