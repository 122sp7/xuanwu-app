/**
 * Module: notebooklm/subdomains/notebook
 * Layer: infrastructure/platform
 * Purpose: Delegates text generation to platform AI API.
 *
 * The notebook subdomain owns its NotebookRepository port; this adapter
 * satisfies it by calling the platform AI capability instead of importing
 * Genkit directly. All Genkit wiring lives exclusively in
 * modules/platform/subdomains/ai/infrastructure.
 */

import { generateAiText } from "@/modules/platform/api/server";
import type {
  GenerateNotebookResponseInput,
  GenerateNotebookResponseResult,
} from "../../domain/entities/AgentGeneration";
import type { NotebookRepository } from "../../domain/repositories/NotebookRepository";

export class PlatformTextGenerationAdapter implements NotebookRepository {
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
