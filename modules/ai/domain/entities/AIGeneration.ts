import type { DomainError } from "@shared-types";

export interface GenerateAIResponseInput {
  readonly prompt: string;
  readonly model?: string;
  readonly system?: string;
}

export interface AIResponse {
  readonly text: string;
  readonly model: string;
  readonly finishReason?: string;
}

export type GenerateAIResponseResult =
  | { ok: true; data: AIResponse }
  | { ok: false; error: DomainError };
