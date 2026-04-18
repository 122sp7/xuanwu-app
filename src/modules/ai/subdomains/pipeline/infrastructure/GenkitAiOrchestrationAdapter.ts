import { GenkitPromptRegistry } from "../../../prompts/registry/GenkitPromptRegistry";
import type { PromptRegistryPort } from "../../../prompts/registry/PromptRegistry";
import type { AiOrchestrationInput, AiOrchestrationPort, AiOrchestrationResult } from "../domain/ports/AiOrchestrationPort";

export class GenkitAiOrchestrationAdapter implements AiOrchestrationPort {
  constructor(private readonly promptRegistry: PromptRegistryPort = new GenkitPromptRegistry()) {}

  async runPrompt<TOutput = unknown>(input: AiOrchestrationInput): Promise<AiOrchestrationResult<TOutput>> {
    const promptKey = this.promptRegistry.resolve(input.promptKey);
    if (!promptKey) {
      throw new Error(`Unknown prompt key: ${input.promptKey}`);
    }

    const promptRunner = this.promptRegistry.get<TOutput>(promptKey);
    const response = await promptRunner(input.variables);

    return {
      output: response.output,
      text: response.text,
    };
  }
}
