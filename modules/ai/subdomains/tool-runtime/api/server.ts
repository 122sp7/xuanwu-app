import "server-only";

import { GenerateWithToolsUseCase } from "../application/use-cases/generate-with-tools.use-case";
import { GenkitToolRuntimeAdapter } from "../infrastructure/genkit/GenkitToolRuntimeAdapter";
import { extractTasksFromContent as extractTasksFromDistillation } from "../../content-distillation/api/server";
import type {
  ToolDescriptor,
  ToolEnabledGenerationInput,
  ToolEnabledGenerationOutput,
} from "../domain/ports/ToolRuntimePort";
import type {
  TaskExtractionInput,
  TaskExtractionOutput,
} from "../domain/ports/TaskExtractionPort";

let _useCase: GenerateWithToolsUseCase | undefined;

function getUseCase(): GenerateWithToolsUseCase {
  if (_useCase) return _useCase;
  _useCase = new GenerateWithToolsUseCase(new GenkitToolRuntimeAdapter());
  return _useCase;
}

export async function generateWithTools(
  input: ToolEnabledGenerationInput,
): Promise<ToolEnabledGenerationOutput> {
  return getUseCase().execute(input);
}

export function listAvailableTools(): ReadonlyArray<ToolDescriptor> {
  return new GenkitToolRuntimeAdapter().listAvailableTools();
}

/**
 * @deprecated Task extraction ownership has moved to ai/content-distillation.
 * Keep this wrapper temporarily to preserve the stable server API.
 */
export async function extractTasksFromContent(
  input: TaskExtractionInput,
): Promise<TaskExtractionOutput> {
  return extractTasksFromDistillation(input);
}
