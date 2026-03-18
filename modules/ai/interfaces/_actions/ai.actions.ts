"use server";

import type {
  GenerateAIResponseInput,
  GenerateAIResponseResult,
} from "../../domain/entities/AIGeneration";
import { GenerateAIResponseUseCase } from "../../application/use-cases/generate-ai-response.use-case";
import { GenkitAIRepository } from "../../infrastructure/genkit/GenkitAIRepository";

export async function generateAIResponse(
  input: GenerateAIResponseInput,
): Promise<GenerateAIResponseResult> {
  const useCase = new GenerateAIResponseUseCase(new GenkitAIRepository());
  return useCase.execute(input);
}
