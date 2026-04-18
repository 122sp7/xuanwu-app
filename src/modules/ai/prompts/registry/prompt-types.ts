export type PromptKey = `${string}.${string}`;

export type PromptRegistryInput = Readonly<Record<string, unknown>>;

export interface PromptRegistryResult<TOutput = unknown> {
  readonly output: TOutput;
  readonly text?: string;
}

export type PromptRunner<TOutput = unknown> = (input: PromptRegistryInput) => Promise<PromptRegistryResult<TOutput>>;
