/**
 * notebook subdomain — server-only API.
 *
 * Exports infrastructure implementations that depend on server-only packages
 * (genkit, google-genai). Must only be imported in Server Actions, route
 * handlers, or server-side infrastructure.
 */

export { GenkitNotebookRepository } from "../infrastructure/genkit/GenkitNotebookRepository";
export { GenerateNotebookResponseUseCase } from "../application/use-cases/generate-notebook-response.use-case";
export { makeNotebookRepo } from "./factories";
