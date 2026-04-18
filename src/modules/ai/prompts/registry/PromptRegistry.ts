import type { PromptKey, PromptRunner } from "./prompt-types";

export interface PromptRegistryPort {
  get<TOutput = unknown>(key: PromptKey): PromptRunner<TOutput>;
  list(): readonly PromptKey[];
  resolve(key: string): PromptKey | null;
}
