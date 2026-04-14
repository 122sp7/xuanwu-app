/**
 * Module: notebooklm/subdomains/synthesis
 * Layer: domain/ports
 * Purpose: GenerationPort — output port for AI answer generation.
 *
 * The AI bounded-context adapter (infrastructure) implements this port.
 */

import type { GenerateAnswerInput, GenerateAnswerResult } from "../entities/SynthesisResult";

export interface GenerationPort {
  generate(input: GenerateAnswerInput): Promise<GenerateAnswerResult>;
}
