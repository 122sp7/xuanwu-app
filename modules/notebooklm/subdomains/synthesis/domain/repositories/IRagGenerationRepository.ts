/**
 * Module: notebooklm/subdomains/synthesis
 * Layer: domain/repositories
 * Purpose: IRagGenerationRepository — output port for AI answer generation.
 *
 * Domain owns this contract; the platform-delegating adapter (infrastructure) implements it.
 */

import type { GenerateRagAnswerInput, GenerateRagAnswerResult } from "../entities/generation.entities";

export interface IRagGenerationRepository {
  generate(input: GenerateRagAnswerInput): Promise<GenerateRagAnswerResult>;
}
