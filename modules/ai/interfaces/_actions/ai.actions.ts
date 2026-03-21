"use server";

import type {
  GenerateAIResponseInput,
  GenerateAIResponseResult,
} from "../../domain/entities/AIGeneration";
import type { AnswerRagQueryInput, AnswerRagQueryResult } from "../../domain/entities/RagQuery";
import { AnswerRagQueryUseCase } from "../../application/use-cases/answer-rag-query.use-case";
import { GenerateAIResponseUseCase } from "../../application/use-cases/generate-ai-response.use-case";
import { FirebaseRagRetrievalRepository } from "../../infrastructure/firebase/FirebaseRagRetrievalRepository";
import { GenkitAIRepository } from "../../infrastructure/genkit/GenkitAIRepository";
import { GenkitRagGenerationRepository } from "../../infrastructure/genkit/GenkitRagGenerationRepository";
import { GenkitRagRerankerRepository } from "../../infrastructure/genkit/GenkitRagRerankerRepository";

export async function generateAIResponse(
  input: GenerateAIResponseInput,
): Promise<GenerateAIResponseResult> {
  const useCase = new GenerateAIResponseUseCase(new GenkitAIRepository());
  return useCase.execute(input);
}

export async function answerRagQuery(input: AnswerRagQueryInput): Promise<AnswerRagQueryResult> {
  const useCase = new AnswerRagQueryUseCase(
    new FirebaseRagRetrievalRepository(),
    new GenkitRagGenerationRepository(),
    new GenkitRagRerankerRepository(),
  );
  return useCase.execute(input);
}
