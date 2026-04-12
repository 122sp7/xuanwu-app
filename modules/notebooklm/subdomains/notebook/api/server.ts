/**
 * notebook subdomain — server-only API.
 *
 * Exports infrastructure implementations that depend on server-only packages.
 * Must only be imported in Server Actions, route handlers, or server-side infrastructure.
 */

export { PlatformTextGenerationAdapter } from "../infrastructure/platform/PlatformTextGenerationAdapter";
export { GenerateNotebookResponseUseCase } from "../application/use-cases/generate-notebook-response.use-case";
export { makeNotebookRepo } from "./factories";
