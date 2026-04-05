"use server";

import type {
  GenerateAgentResponseInput,
  GenerateAgentResponseResult,
} from "@/modules/notebook/api";
import { GenerateAgentResponseUseCase } from "@/modules/notebook/api";
import { GenkitAgentRepository } from "@/modules/notebook/api";

export async function sendChatMessage(
  input: GenerateAgentResponseInput,
): Promise<GenerateAgentResponseResult> {
  const useCase = new GenerateAgentResponseUseCase(new GenkitAgentRepository());
  return useCase.execute(input);
}
