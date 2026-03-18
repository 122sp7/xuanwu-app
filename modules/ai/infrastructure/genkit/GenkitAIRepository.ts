import type {
  GenerateAIResponseInput,
  GenerateAIResponseResult,
} from "../../domain/entities/AIGeneration";
import type { AIRepository } from "../../domain/repositories/AIRepository";
import { aiClient, getConfiguredGenkitModel } from "./client";

export class GenkitAIRepository implements AIRepository {
  async generateResponse(input: GenerateAIResponseInput): Promise<GenerateAIResponseResult> {
    try {
      const response = await aiClient.generate({
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
          code: "AI_GENERATE_FAILED",
          message: error instanceof Error ? error.message : "Unexpected AI generation error.",
        },
      };
    }
  }
}
