/**
 * modules/notebooklm — server-only API barrel.
 *
 * Exports concrete notebook implementations that depend on server-only
 * packages or infrastructure wiring.
 */

export { GenerateNotebookResponseUseCase, GenkitNotebookRepository } from "../subdomains/notebook/api";

// Q&A subdomain — AnswerRagQueryUseCase factory (replaces @/modules/search/api/server)
export { createAnswerRagQueryUseCase } from "../subdomains/ai/qa/server";
