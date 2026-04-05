"use server";

import type {
  GenerateNotebookResponseInput,
  GenerateNotebookResponseResult,
} from "../../domain/entities/AgentGeneration";
import type { AnswerRagQueryInput, AnswerRagQueryResult } from "@/modules/search/api";
import { AnswerRagQueryUseCase } from "@/modules/search/api/server";
import { GenerateNotebookResponseUseCase } from "../../application/use-cases/generate-agent-response.use-case";
import { FirebaseRagRetrievalRepository } from "@/modules/search/api/server";
import { GenkitNotebookRepository } from "../../infrastructure/genkit/GenkitNotebookRepository";
import { GenkitRagGenerationRepository } from "@/modules/search/api/server";

export async function generateNotebookResponse(
  input: GenerateNotebookResponseInput,
): Promise<GenerateNotebookResponseResult> {
  const useCase = new GenerateNotebookResponseUseCase(new GenkitNotebookRepository());
  return useCase.execute(input);
}

export async function answerRagQuery(input: AnswerRagQueryInput): Promise<AnswerRagQueryResult> {
  const useCase = new AnswerRagQueryUseCase(
    new FirebaseRagRetrievalRepository(),
    new GenkitRagGenerationRepository(),
  );
  return useCase.execute(input);
}
