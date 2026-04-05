/**
 * modules/notebook — server-only API barrel.
 *
 * Exports concrete notebook implementations that depend on server-only
 * packages or infrastructure wiring.
 */

export { GenerateNotebookResponseUseCase } from "../application/use-cases/generate-agent-response.use-case";
export { GenkitNotebookRepository } from "../infrastructure/genkit/GenkitNotebookRepository";
