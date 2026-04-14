/**
 * Public API boundary for the AI tool-runtime subdomain.
 * Cross-module consumers must import through this entry point.
 *
 * This barrel is client-safe — it exports only types and interfaces.
 * Server-only functions live in ./server.ts.
 */

export type {
  ToolDescriptor,
  ToolEnabledGenerationInput,
  ToolEnabledGenerationOutput,
  ToolRuntimePort,
} from "../domain/ports/ToolRuntimePort";

export interface ToolRuntimeAPI {
  generateWithTools(
    input: import("../domain/ports/ToolRuntimePort").ToolEnabledGenerationInput,
  ): Promise<import("../domain/ports/ToolRuntimePort").ToolEnabledGenerationOutput>;
  listAvailableTools(): ReadonlyArray<
    import("../domain/ports/ToolRuntimePort").ToolDescriptor
  >;
}
