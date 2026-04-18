export interface AiOrchestrationInput {
  readonly promptKey: string;
  readonly variables: Readonly<Record<string, unknown>>;
}

export interface AiOrchestrationResult<TOutput = unknown> {
  readonly output: TOutput;
  readonly text?: string;
}

export interface AiOrchestrationPort {
  runPrompt<TOutput = unknown>(input: AiOrchestrationInput): Promise<AiOrchestrationResult<TOutput>>;
}
