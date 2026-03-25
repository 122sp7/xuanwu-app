import type {
  GenerateAgentResponseInput,
  GenerateAgentResponseResult,
} from "../../domain/entities/AgentGeneration";
import type { AgentRepository } from "../../domain/repositories/AgentRepository";
import { agentClient, getConfiguredGenkitModel } from "./client";

export class GenkitAgentRepository implements AgentRepository {
  async generateResponse(input: GenerateAgentResponseInput): Promise<GenerateAgentResponseResult> {
    try {
      const response = await agentClient.generate({
        prompt: input.prompt,
        ...(input.system ? { system: input.system } : {}),
        ...(input.model ? { model: input.model } : {}),
      });

      return {
        ok: true,
        data: {
          text: response.text,
          model: getConfiguredGenkitModel(input.model),
          finishReason: response.finishReason ? String(response.finishReason) : undefined,
        },
      };
    } catch (error) {
      return {
        ok: false,
        error: {
          code: "AGENT_GENERATE_FAILED",
          message:
            error instanceof Error ? error.message : `Unexpected agent generation error: ${String(error)}`,
        },
      };
    }
  }
}
