/**
 * Public API boundary for the AI content-distillation subdomain.
 * Cross-module consumers must import through this entry point.
 *
 * This barrel is client-safe — it exports only types and interfaces.
 * Server-only functions live in ./server.ts.
 */

import type {
  DistillContentInput,
  DistillationResult,
  TaskExtractionInput,
  TaskExtractionOutput,
} from "../domain/ports/DistillationPort";

export type {
  DistillContentInput,
  DistillationItem,
  DistillationPort,
  DistillationResult,
  DistillationSource,
  ExtractedTaskItem,
  TaskExtractionInput,
  TaskExtractionOutput,
  TaskExtractionPort,
  TaskExtractionPromptContext,
} from "../domain/ports/DistillationPort";

export interface DistillationAPI {
  distillContent(input: DistillContentInput): Promise<DistillationResult>;
  extractTasksFromContent(input: TaskExtractionInput): Promise<TaskExtractionOutput>;
}
