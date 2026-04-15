/** ai/domain — AI domain contracts. */

export type {
  GenerateAiTextInput,
  GenerateAiTextOutput,
  AiTextGenerationPort,
} from "./ports/AiTextGenerationPort";

export type {
  DistillationSource,
  DistillContentInput,
  DistillationItem,
  DistillationResult,
  ExtractedTaskItem,
  TaskExtractionPromptContext,
  TaskExtractionInput,
  TaskExtractionOutput,
  TaskExtractionPort,
  DistillationPort,
} from "./ports/DistillationPort";

export type {
  ToolDescriptor,
  ToolEnabledGenerationInput,
  ToolEnabledGenerationOutput,
  ToolRuntimePort,
} from "./ports/ToolRuntimePort";
