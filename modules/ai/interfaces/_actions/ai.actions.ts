"use server";

import type {
  GenerateAIResponseInput,
  GenerateAIResponseResult,
} from "../../domain/entities/AIGeneration";
import type { AnswerRagQueryInput, AnswerRagQueryResult } from "@/modules/retrieval/api";
import { AnswerRagQueryUseCase } from "@/modules/retrieval/api";
import { GenerateAIResponseUseCase } from "../../application/use-cases/generate-ai-response.use-case";
import { FirebaseRagRetrievalRepository } from "@/modules/retrieval/api";
import { GenkitAIRepository } from "../../infrastructure/genkit/GenkitAIRepository";
import { GenkitRagGenerationRepository } from "@/modules/retrieval/api";

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
  );
  return useCase.execute(input);
}
