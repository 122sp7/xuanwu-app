import type { DomainError } from "@shared-types";

import type { RagCitation, RagRetrievedChunk } from "../entities/RagQuery";

export interface GenerateRagAnswerInput {
  readonly traceId: string;
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly userQuery: string;
  readonly chunks: readonly RagRetrievedChunk[];
  readonly model?: string;
}

export interface GenerateRagAnswerOutput {
  readonly answer: string;
  readonly citations: readonly RagCitation[];
  readonly model: string;
}

export type GenerateRagAnswerResult =
  | { ok: true; data: GenerateRagAnswerOutput }
  | { ok: false; error: DomainError };

export interface RagGenerationRepository {
  generate(input: GenerateRagAnswerInput): Promise<GenerateRagAnswerResult>;
}
