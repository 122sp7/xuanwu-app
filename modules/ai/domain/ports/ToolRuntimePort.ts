/**
 * Tool Runtime domain port — framework-free contract for AI tool registration
 * and tool-enabled generation.
 *
 * This layer is intentionally framework-agnostic. No Genkit, Firebase, or
 * HTTP client imports are permitted here.
 */

export interface ToolDescriptor {
  readonly name: string;
  readonly description: string;
}

export interface ToolEnabledGenerationInput {
  readonly prompt: string;
  readonly system?: string;
  /** Names of registered tools to expose to the model during generation. */
  readonly toolNames: ReadonlyArray<string>;
  readonly model?: string;
}

export interface ToolEnabledGenerationOutput {
  readonly text: string;
  /** Number of tool invocations that occurred during generation. */
  readonly toolCallsCount: number;
  readonly model: string;
  readonly traceId: string;
  readonly completedAt: string;
}

export interface ToolRuntimePort {
  /**
   * Run AI generation with access to the specified registered tools.
   * The model may invoke zero or more tools during the generation loop.
   */
  generateWithTools(
    input: ToolEnabledGenerationInput,
  ): Promise<ToolEnabledGenerationOutput>;

  /** Returns metadata for all tools registered in this runtime. */
  listAvailableTools(): ReadonlyArray<ToolDescriptor>;
}
