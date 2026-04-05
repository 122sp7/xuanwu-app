/**
 * @module modules/notebook/infrastructure/genkit
 */

export {
  agentClient,
  createGenkitClient,
  getConfiguredGenkitModel,
  type GenkitClientOptions,
} from "./client";
export { GenkitNotebookRepository } from "./GenkitAgentRepository";
export { GenkitRagGenerationRepository } from "@/modules/search/api/server";
