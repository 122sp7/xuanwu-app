/**
 * Module: notebooklm/subdomains/ai/synthesis
 * Layer: domain/repositories
 * Purpose: IRagGenerationRepository — output port for AI answer generation.
 *
 * Domain owns this contract; the Genkit adapter (infrastructure) implements it.
 */

import type { GenerateRagAnswerInput, GenerateRagAnswerResult } from "../entities/generation.entities";

export interface IRagGenerationRepository {
  generate(input: GenerateRagAnswerInput): Promise<GenerateRagAnswerResult>;
}
