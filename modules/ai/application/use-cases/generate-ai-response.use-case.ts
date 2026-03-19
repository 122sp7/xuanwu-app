import type {
  GenerateAIResponseInput,
  GenerateAIResponseResult,
} from "../../domain/entities/AIGeneration";
import type { AIRepository } from "../../domain/repositories/AIRepository";

export class GenerateAIResponseUseCase {
  constructor(private readonly aiRepository: AIRepository) {}

  async execute(input: GenerateAIResponseInput): Promise<GenerateAIResponseResult> {
    const prompt = input.prompt.trim();
    if (!prompt) {
      return {
        ok: false,
        error: {
          code: "AI_PROMPT_REQUIRED",
          message: "AI prompt is required.",
        },
      };
    }

    return this.aiRepository.generateResponse({
      ...input,
      prompt,
      ...(typeof input.system === "string" ? { system: input.system.trim() } : {}),
    });
  }
}
