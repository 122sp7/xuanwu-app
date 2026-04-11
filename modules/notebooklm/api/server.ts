/**
 * modules/notebooklm — server-only API barrel.
 *
 * Exports concrete notebook implementations that depend on server-only
 * packages or infrastructure wiring. Must only be imported in Server Actions,
 * route handlers, or server-side infrastructure.
 */

export { GenerateNotebookResponseUseCase, GenkitNotebookRepository } from "../subdomains/notebook/api/server";

// Q&A subdomain — AnswerRagQueryUseCase factory (replaces @/modules/search/api/server)
export { createAnswerRagQueryUseCase } from "../subdomains/ai/api/server";
