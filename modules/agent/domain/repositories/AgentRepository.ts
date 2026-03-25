import type {
  GenerateAgentResponseInput,
  GenerateAgentResponseResult,
} from "../entities/AgentGeneration";

export interface AgentRepository {
  generateResponse(input: GenerateAgentResponseInput): Promise<GenerateAgentResponseResult>;
}
