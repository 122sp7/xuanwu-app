import type { PromptRegistryPort } from "./PromptRegistry";
import type { PromptKey, PromptRunner } from "./prompt-types";

export interface PromptRegistryEntry<TOutput = unknown> {
  readonly key: PromptKey;
  readonly runner: PromptRunner<TOutput>;
}

export class InMemoryPromptRegistry implements PromptRegistryPort {
  private readonly entries = new Map<PromptKey, PromptRunner<unknown>>();

  constructor(entries: readonly PromptRegistryEntry[] = []) {
    for (const entry of entries) {
      this.entries.set(entry.key, entry.runner);
    }
  }

  register<TOutput = unknown>(entry: PromptRegistryEntry<TOutput>): void {
    this.entries.set(entry.key, entry.runner);
  }

  get<TOutput = unknown>(key: PromptKey): PromptRunner<TOutput> {
    const runner = this.entries.get(key);
    if (!runner) {
      throw new Error(`Prompt key not found: ${key}`);
    }
    return runner as PromptRunner<TOutput>;
  }

  list(): readonly PromptKey[] {
    return [...this.entries.keys()];
  }

  resolve(key: string): PromptKey | null {
    return this.entries.has(key as PromptKey) ? (key as PromptKey) : null;
  }
}
