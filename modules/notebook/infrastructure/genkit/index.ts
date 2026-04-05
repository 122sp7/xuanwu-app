/**
 * @module modules/agent/infrastructure/genkit
 */

export {
  agentClient,
  createGenkitClient,
  getConfiguredGenkitModel,
  type GenkitClientOptions,
} from "./client";
export { GenkitNotebookRepository } from "./GenkitNotebookRepository";
export { GenkitRagGenerationRepository } from "@/modules/search/api/server";
