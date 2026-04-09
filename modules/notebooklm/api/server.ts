/**
 * modules/notebooklm — server-only API barrel.
 *
 * Exports concrete notebook implementations that depend on server-only
 * packages or infrastructure wiring.
 */

export { GenerateNotebookResponseUseCase } from "../application/use-cases/generate-agent-response.use-case";
export { GenkitNotebookRepository } from "../infrastructure/genkit/GenkitNotebookRepository";

// Q&A subdomain — AnswerRagQueryUseCase factory (replaces @/modules/search/api/server)
export { createAnswerRagQueryUseCase } from "../subdomains/ai/qa/server";
