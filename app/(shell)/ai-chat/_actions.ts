"use server";

import type {
  GenerateAgentResponseInput,
  GenerateAgentResponseResult,
} from "@/modules/agent/api";
import { GenerateAgentResponseUseCase } from "@/modules/agent/api";
import { GenkitAgentRepository } from "@/modules/agent/api";

export async function sendChatMessage(
  input: GenerateAgentResponseInput,
): Promise<GenerateAgentResponseResult> {
  const useCase = new GenerateAgentResponseUseCase(new GenkitAgentRepository());
  return useCase.execute(input);
}
