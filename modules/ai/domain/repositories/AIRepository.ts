import type { GenerateAIResponseInput, GenerateAIResponseResult } from "../entities/AIGeneration";

export interface AIRepository {
  generateResponse(input: GenerateAIResponseInput): Promise<GenerateAIResponseResult>;
}
