"use server";

import type {
  GenerateAgentResponseInput,
  GenerateAgentResponseResult,
} from "@/modules/agent/api";
import type { AnswerRagQueryInput, AnswerRagQueryResult } from "@/modules/agent/api";
import { answerRagQuery, generateAgentResponse } from "@/modules/agent/api";

export async function generateAIResponse(
  input: GenerateAgentResponseInput,
): Promise<GenerateAgentResponseResult> {
  return generateAgentResponse(input);
}

export { answerRagQuery };
