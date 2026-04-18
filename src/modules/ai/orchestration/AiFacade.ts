import { GenkitPromptRegistry } from "../prompts/registry/GenkitPromptRegistry";
import type { PromptRegistryPort } from "../prompts/registry/PromptRegistry";
import { PROMPT_KEYS } from "../prompts/versions";

interface GenerationPromptOutput {
  readonly text: string;
}

interface QueryExpansionPromptOutput {
  readonly queries: readonly string[];
}

/**
 * AiFacade is the orchestration entry for cross-subdomain AI prompt execution.
 * It keeps callers decoupled from prompt definitions by delegating all prompt
 * resolution and execution to the PromptRegistry boundary.
 */
export class AiFacade {
  constructor(private readonly promptRegistry: PromptRegistryPort = new GenkitPromptRegistry()) {}

  async generateText(input: { prompt: string; systemPrompt?: string }): Promise<string> {
    const runPrompt = this.promptRegistry.get<GenerationPromptOutput>(PROMPT_KEYS.GENERATION_GENERATE_TEXT);
    const result = await runPrompt({
      prompt: input.prompt,
      systemPrompt: input.systemPrompt,
    });

    return result.output.text;
  }

  async expandQuery(query: string): Promise<readonly string[]> {
    const runPrompt = this.promptRegistry.get<QueryExpansionPromptOutput>(PROMPT_KEYS.RETRIEVAL_QUERY_EXPANSION);
    const result = await runPrompt({ query });
    return result.output.queries;
  }
}
