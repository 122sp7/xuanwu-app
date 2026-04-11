/**
 * Application-layer DTO re-exports for the notebook subdomain.
 * Interfaces must import from here, not from domain/ directly.
 */
export type {
  GenerateNotebookResponseInput,
  GenerateNotebookResponseResult,
} from "../../domain/entities/AgentGeneration";
