/**
 * Public API boundary for the AI generation subdomain.
 * Cross-module consumers must import through this entry point.
 *
 * This barrel is client-safe — it exports only types and interfaces.
 * Server-only functions live in ./server.ts.
 */

import type { GenerateAiTextInput, GenerateAiTextOutput } from "../domain/ports/AiTextGenerationPort";

export type {
  GenerateAiTextInput,
  GenerateAiTextOutput,
  AiTextGenerationPort,
} from "../domain/ports/AiTextGenerationPort";

export interface AIAPI {
  summarize(text: string, model?: string): Promise<string>;
  generateText(input: GenerateAiTextInput): Promise<GenerateAiTextOutput>;
}
