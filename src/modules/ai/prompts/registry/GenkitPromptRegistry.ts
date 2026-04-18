import { ai } from "@/packages/integration-ai/genkit";
import { z } from "genkit";

import { PROMPT_KEYS } from "../versions";
import type { PromptRegistryPort } from "./PromptRegistry";
import { loadPromptDefinitions } from "./prompt-loader";
import type { PromptKey, PromptRunner } from "./prompt-types";

const PromptExecutionSchema = z.object({
  output: z.unknown(),
  text: z.string().optional(),
});

export class GenkitPromptRegistry implements PromptRegistryPort {
  private readonly knownKeys: readonly PromptKey[];
  private readonly runners = new Map<PromptKey, PromptRunner<unknown>>();

  constructor(knownKeys: readonly PromptKey[] = Object.values(PROMPT_KEYS)) {
    this.knownKeys = knownKeys;
    loadPromptDefinitions();
  }

  get<TOutput = unknown>(key: PromptKey): PromptRunner<TOutput> {
    const cachedRunner = this.runners.get(key);
    if (cachedRunner) {
      return cachedRunner as PromptRunner<TOutput>;
    }

    const prompt = ai.prompt(key);
    const runner: PromptRunner<TOutput> = async (input) => {
      const response = await prompt(input);
      const parsed = PromptExecutionSchema.parse(response);
      return {
        output: parsed.output as TOutput,
        text: parsed.text,
      };
    };
    this.runners.set(key, runner as PromptRunner<unknown>);
    return runner;
  }

  list(): readonly PromptKey[] {
    return this.knownKeys;
  }

  resolve(key: string): PromptKey | null {
    return this.knownKeys.includes(key as PromptKey) ? (key as PromptKey) : null;
  }
}
