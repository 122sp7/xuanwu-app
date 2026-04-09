/**
 * Module: notebooklm/subdomains/ai/synthesis
 * Public boundary for the synthesis subdomain.
 *
 * Exports: domain types and infrastructure adapters for factory composition.
 */

// Domain types
export type {
  GenerateRagAnswerInput,
  GenerateRagAnswerOutput,
  GenerateRagAnswerResult,
  GenerationCitation,
} from "./domain/entities/generation.entities";
export type { IRagGenerationRepository } from "./domain/repositories/IRagGenerationRepository";

// Infrastructure adapters (server-side only)
export { GenkitRagGenerationAdapter } from "./infrastructure/genkit/GenkitRagGenerationAdapter";
