import type { DomainError } from "@shared-types";

export interface GenerateNotebookResponseInput {
  readonly prompt: string;
  readonly model?: string;
  readonly system?: string;
}

export interface NotebookResponse {
  readonly text: string;
  readonly model: string;
  readonly finishReason?: string;
}

export type GenerateNotebookResponseResult =
  | { ok: true; data: NotebookResponse }
  | { ok: false; error: DomainError };
