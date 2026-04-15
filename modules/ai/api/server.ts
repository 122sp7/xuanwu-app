/**
 * AI bounded context — server-only API composition root.
 *
 * This is the single composition point that wires use-cases to infrastructure
 * adapters.  Only import this in Server Actions, route handlers, or
 * server-side infrastructure adapters; never in client bundles.
 */
import "server-only";

import { GenerateAiTextUseCase } from "../application/use-cases/generate-ai-text.use-case";
import { DistillContentUseCase } from "../application/use-cases/distill-content.use-case";
import { ExtractTasksFromContentUseCase } from "../application/use-cases/extract-tasks-from-content.use-case";
import { GenerateWithToolsUseCase } from "../application/use-cases/generate-with-tools.use-case";
import { GenkitAiTextGenerationAdapter } from "../infrastructure/generation/genkit/GenkitAiTextGenerationAdapter";
import { GenkitDistillationAdapter } from "../infrastructure/llm/GenkitDistillationAdapter";
import { GenkitToolRuntimeAdapter } from "../infrastructure/genkit/GenkitToolRuntimeAdapter";
import type { GenerateAiTextInput, GenerateAiTextOutput } from "../domain/ports/AiTextGenerationPort";
import type {
  DistillContentInput,
  DistillationResult,
  TaskExtractionInput,
  TaskExtractionOutput,
} from "../domain/ports/DistillationPort";
import type {
  ToolDescriptor,
  ToolEnabledGenerationInput,
  ToolEnabledGenerationOutput,
} from "../domain/ports/ToolRuntimePort";

// ── Singletons ────────────────────────────────────────────────────────────────

let _generateAiTextUseCase: GenerateAiTextUseCase | undefined;
let _distillUseCase: DistillContentUseCase | undefined;
let _taskExtractionUseCase: ExtractTasksFromContentUseCase | undefined;
let _generateWithToolsUseCase: GenerateWithToolsUseCase | undefined;

function getGenerateAiTextUseCase(): GenerateAiTextUseCase {
  if (_generateAiTextUseCase) return _generateAiTextUseCase;
  _generateAiTextUseCase = new GenerateAiTextUseCase(new GenkitAiTextGenerationAdapter());
  return _generateAiTextUseCase;
}

function getDistillUseCase(): DistillContentUseCase {
  if (_distillUseCase) return _distillUseCase;
  _distillUseCase = new DistillContentUseCase(new GenkitDistillationAdapter());
  return _distillUseCase;
}

function getTaskExtractionUseCase(): ExtractTasksFromContentUseCase {
  if (_taskExtractionUseCase) return _taskExtractionUseCase;
  _taskExtractionUseCase = new ExtractTasksFromContentUseCase(new GenkitDistillationAdapter());
  return _taskExtractionUseCase;
}

function getGenerateWithToolsUseCase(): GenerateWithToolsUseCase {
  if (_generateWithToolsUseCase) return _generateWithToolsUseCase;
  _generateWithToolsUseCase = new GenerateWithToolsUseCase(new GenkitToolRuntimeAdapter());
  return _generateWithToolsUseCase;
}

// ── Public server functions ───────────────────────────────────────────────────

export async function generateAiText(
  input: GenerateAiTextInput,
): Promise<GenerateAiTextOutput> {
  return getGenerateAiTextUseCase().execute(input);
}

export async function summarize(text: string, model?: string): Promise<string> {
  const result = await generateAiText({
    prompt: text,
    model,
    system: "You are a concise summarizer. Return only the summary text.",
  });
  return result.text;
}

export async function distillContent(
  input: DistillContentInput,
): Promise<DistillationResult> {
  return getDistillUseCase().execute(input);
}

export async function extractTasksFromContent(
  input: TaskExtractionInput,
): Promise<TaskExtractionOutput> {
  return getTaskExtractionUseCase().execute(input);
}

export async function generateWithTools(
  input: ToolEnabledGenerationInput,
): Promise<ToolEnabledGenerationOutput> {
  return getGenerateWithToolsUseCase().execute(input);
}

export function listAvailableTools(): ReadonlyArray<ToolDescriptor> {
  return new GenkitToolRuntimeAdapter().listAvailableTools();
}

