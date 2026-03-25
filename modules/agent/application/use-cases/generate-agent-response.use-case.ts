import type {
  GenerateAgentResponseInput,
  GenerateAgentResponseResult,
} from "../../domain/entities/AgentGeneration";
import type { AgentRepository } from "../../domain/repositories/AgentRepository";

export class GenerateAgentResponseUseCase {
  constructor(private readonly agentRepository: AgentRepository) {}

  async execute(input: GenerateAgentResponseInput): Promise<GenerateAgentResponseResult> {
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
