import type {
  ToolEnabledGenerationInput,
  ToolEnabledGenerationOutput,
  ToolRuntimePort,
} from "../../domain/ports/ToolRuntimePort";

export class GenerateWithToolsUseCase {
  constructor(private readonly toolRuntimePort: ToolRuntimePort) {}

  async execute(
    input: ToolEnabledGenerationInput,
  ): Promise<ToolEnabledGenerationOutput> {
    if (input.toolNames.length === 0) {
      throw new Error(
        "At least one tool name must be specified for tool-enabled generation.",
      );
    }

    const knownToolNames = this.toolRuntimePort
      .listAvailableTools()
      .map((t) => t.name);

    const unknownTools = input.toolNames.filter(
      (name) => !knownToolNames.includes(name),
    );

    if (unknownTools.length > 0) {
      throw new Error(
        `Unknown tools: ${unknownTools.join(", ")}. Available: ${knownToolNames.join(", ")}`,
      );
    }

    return this.toolRuntimePort.generateWithTools(input);
  }
}
