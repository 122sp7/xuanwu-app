import type {
  GenerateNotebookResponseInput,
  GenerateNotebookResponseResult,
} from "../entities/AgentGeneration";

export interface NotebookRepository {
  generateResponse(input: GenerateNotebookResponseInput): Promise<GenerateNotebookResponseResult>;
}
