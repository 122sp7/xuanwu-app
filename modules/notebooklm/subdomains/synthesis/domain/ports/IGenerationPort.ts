/**
 * Module: notebooklm/subdomains/synthesis
 * Layer: domain/ports
 * Purpose: IGenerationPort — output port for AI answer generation.
 *
 * The platform AI adapter (infrastructure) implements this port.
 */

import type { GenerateAnswerInput, GenerateAnswerResult } from "../entities/SynthesisResult";

export interface IGenerationPort {
  generate(input: GenerateAnswerInput): Promise<GenerateAnswerResult>;
}
