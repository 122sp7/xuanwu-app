import { v4 as uuid } from "@lib-uuid";

import type {
  ToolDescriptor,
  ToolEnabledGenerationInput,
  ToolEnabledGenerationOutput,
  ToolRuntimePort,
} from "../../domain/ports/ToolRuntimePort";
import { BUILT_IN_TOOLS } from "../../../../infrastructure/llm/built-in-tools";
import { aiClient, configuredModel } from "../../../../infrastructure/llm/genkit-shared";

// ── Tool registry (delegated to shared built-in-tools) ────────────────────────

const REGISTERED_TOOLS = BUILT_IN_TOOLS;

// ── Adapter ───────────────────────────────────────────────────────────────────

export class GenkitToolRuntimeAdapter implements ToolRuntimePort {
  listAvailableTools(): ReadonlyArray<ToolDescriptor> {
    return REGISTERED_TOOLS.map(({ descriptor }) => descriptor);
  }

  async generateWithTools(
    input: ToolEnabledGenerationInput,
  ): Promise<ToolEnabledGenerationOutput> {
    const traceId = uuid();
    const completedAt = new Date().toISOString();

    const selectedTools = REGISTERED_TOOLS.filter(({ descriptor }) =>
      input.toolNames.includes(descriptor.name),
    ).map(({ instance }) => instance);

    const response = await aiClient.generate({
      prompt: input.prompt,
      ...(input.system ? { system: input.system } : {}),
      ...(input.model ? { model: input.model } : {}),
      tools: selectedTools,
    });

    // Count tool invocations by inspecting conversation messages.
    // Each message with a toolRequest part represents one model-initiated call.
    const toolCallsCount = Array.isArray(response.messages)
      ? response.messages.reduce((count: number, msg: { content: unknown[] }) => {
          return (
            count +
            msg.content.filter(
              (part: unknown) =>
                typeof part === "object" &&
                part !== null &&
                "toolRequest" in part,
            ).length
          );
        }, 0)
      : 0;

    return {
      text: response.text,
      toolCallsCount,
      model: input.model ?? configuredModel,
      traceId,
      completedAt,
    };
  }
}
