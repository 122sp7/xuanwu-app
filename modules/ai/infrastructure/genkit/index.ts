/**
 * @deprecated AI genkit infrastructure moved to modules/agent.
 */
export {
  agentClient as aiClient,
  createGenkitClient,
  getConfiguredGenkitModel,
  type GenkitClientOptions,
} from "@/modules/agent/infrastructure/genkit";
export { GenkitAgentRepository as GenkitAIRepository } from "@/modules/agent/api";
export { GenkitRagGenerationRepository } from "@/modules/retrieval/api";
