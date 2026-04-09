/**
 * Module: notebooklm/subdomains/ai/qa
 * Server-only: factory for the AnswerRagQueryUseCase.
 *
 * Usage:
 *   import { createAnswerRagQueryUseCase } from "@/modules/notebooklm/api/server";
 *   const useCase = createAnswerRagQueryUseCase();
 *   const result = await useCase.execute(input);
 *
 * This file must only be imported in Server Actions, route handlers, or
 * server-side infrastructure. Never import in client components.
 */

import { FirebaseRagRetrievalAdapter } from "../grounding/infrastructure/firebase/FirebaseRagRetrievalAdapter";
import { GenkitRagGenerationAdapter } from "../synthesis/infrastructure/genkit/GenkitRagGenerationAdapter";
import { AnswerRagQueryUseCase } from "./application/use-cases/answer-rag-query.use-case";

export function createAnswerRagQueryUseCase(): AnswerRagQueryUseCase {
  return new AnswerRagQueryUseCase(
    new FirebaseRagRetrievalAdapter(),
    new GenkitRagGenerationAdapter(),
  );
}
