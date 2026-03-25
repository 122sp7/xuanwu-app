import type { DomainError } from "@shared-types";

export interface GenerateAgentResponseInput {
  readonly prompt: string;
  readonly model?: string;
  readonly system?: string;
}

export interface AgentResponse {
  readonly text: string;
  readonly model: string;
  readonly finishReason?: string;
}

export type GenerateAgentResponseResult =
  | { ok: true; data: AgentResponse }
  | { ok: false; error: DomainError };
