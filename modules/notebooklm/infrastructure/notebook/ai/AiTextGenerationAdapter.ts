/**
 * Module: notebooklm/subdomains/notebook
 * Layer: infrastructure/ai
 * Purpose: Delegates shared text generation to the AI bounded-context API.
 */

import { generateAiText } from "@/modules/ai/api/server";
import type {
  GenerateNotebookResponseInput,
  GenerateNotebookResponseResult,
} from "../../../subdomains/notebook/domain/entities/AgentGeneration";
import type { NotebookRepository } from "../../../subdomains/notebook/domain/repositories/NotebookRepository";

export class AiTextGenerationAdapter implements NotebookRepository {
  async generateResponse(input: GenerateNotebookResponseInput): Promise<GenerateNotebookResponseResult> {
    try {
      const result = await generateAiText({
        prompt: input.prompt,
        ...(input.system ? { system: input.system } : {}),
        ...(input.model ? { model: input.model } : {}),
      });

      return {
        ok: true,
        data: {
          text: result.text,
          model: result.model,
          finishReason: result.finishReason,
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
