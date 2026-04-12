import "server-only";

/**
 * modules/notebooklm — server-only API barrel.
 *
 * Exports concrete notebook implementations that depend on server-only
 * packages or infrastructure wiring. Must only be imported in Server Actions,
 * route handlers, or server-side infrastructure.
 * This surface exists for server-side orchestrators; browser-facing
 * composition still goes through workspace/api when workspace owns the flow.
 */

export { GenerateNotebookResponseUseCase, PlatformTextGenerationAdapter } from "../subdomains/notebook/api/server";

// Q&A subdomain — AnswerRagQueryUseCase factory (now in synthesis subdomain)
export { createAnswerRagQueryUseCase } from "../subdomains/synthesis/api/server";
