import type {
  GenerateNotebookResponseInput,
  GenerateNotebookResponseResult,
} from "../../domain/entities/AgentGeneration";
import type { NotebookRepository } from "../../domain/repositories/AgentRepository";
import { agentClient, getConfiguredGenkitModel } from "./client";

export class GenkitNotebookRepository implements NotebookRepository {
  async generateResponse(input: GenerateNotebookResponseInput): Promise<GenerateNotebookResponseResult> {
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
