/**
 * Public API boundary for this subdomain.
 * Cross-module consumers must import through this entry point.
 *
 * This barrel is client-safe — it exports only types and interfaces.
 * Server-only functions (generateAiText, summarize) live in ./server.ts.
 */

import type { GenerateAiTextInput, GenerateAiTextOutput } from "../domain/ports/AiTextGenerationPort";

// Re-export domain types through API boundary
export type {
	GenerateAiTextInput,
	GenerateAiTextOutput,
	AiTextGenerationPort,
} from "../domain/ports/AiTextGenerationPort";

export interface AIAPI {
	summarize(text: string, model?: string): Promise<string>;
	generateText(input: GenerateAiTextInput): Promise<GenerateAiTextOutput>;
}

