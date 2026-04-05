import type {
  GenerateNotebookResponseInput,
  GenerateNotebookResponseResult,
} from "../../domain/entities/AgentGeneration";
import type { NotebookRepository } from "../../domain/repositories/NotebookRepository";

export class GenerateNotebookResponseUseCase {
  constructor(private readonly agentRepository: NotebookRepository) {}

  async execute(input: GenerateNotebookResponseInput): Promise<GenerateNotebookResponseResult> {
    const prompt = input.prompt.trim();
    if (!prompt) {
      return {
        ok: false,
        error: {
          code: "AGENT_PROMPT_REQUIRED",
          message: "Agent prompt is required.",
        },
      };
    }

    return this.agentRepository.generateResponse({
      ...input,
      prompt,
      ...(typeof input.system === "string" ? { system: input.system.trim() } : {}),
    });
  }
}
