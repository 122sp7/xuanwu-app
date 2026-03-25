"use server";

import type {
  GenerateAgentResponseInput,
  GenerateAgentResponseResult,
} from "../../domain/entities/AgentGeneration";
import type { AnswerRagQueryInput, AnswerRagQueryResult } from "@/modules/retrieval/api";
import { AnswerRagQueryUseCase } from "@/modules/retrieval/api";
import { GenerateAgentResponseUseCase } from "../../application/use-cases/generate-agent-response.use-case";
import { FirebaseRagRetrievalRepository } from "@/modules/retrieval/api";
import { GenkitAgentRepository } from "../../infrastructure/genkit/GenkitAgentRepository";
import { GenkitRagGenerationRepository } from "@/modules/retrieval/api";

export async function generateAgentResponse(
  input: GenerateAgentResponseInput,
): Promise<GenerateAgentResponseResult> {
  const useCase = new GenerateAgentResponseUseCase(new GenkitAgentRepository());
  return useCase.execute(input);
}

export async function answerRagQuery(input: AnswerRagQueryInput): Promise<AnswerRagQueryResult> {
  const useCase = new AnswerRagQueryUseCase(
    new FirebaseRagRetrievalRepository(),
    new GenkitRagGenerationRepository(),
  );
  return useCase.execute(input);
}
