/**
 * modules/agent — public API barrel.
 */

export type { Message, MessageRole } from "../domain/entities/message";
export type { Thread } from "../domain/entities/thread";

export type {
  AgentResponse,
  GenerateAgentResponseInput,
  GenerateAgentResponseResult,
} from "../domain/entities/AgentGeneration";

export type { AgentRepository } from "../domain/repositories/AgentRepository";
export { GenerateAgentResponseUseCase } from "../application/use-cases/generate-agent-response.use-case";
export { GenkitAgentRepository } from "../infrastructure/genkit/GenkitAgentRepository";

export type {
  AnswerRagQueryInput,
  AnswerRagQueryOutput,
  AnswerRagQueryResult,
  RagCitation,
  RagRetrievedChunk,
  RagRetrievalSummary,
  RagStreamEvent,
} from "@/modules/search/api";

export type {
  GenerateRagAnswerInput,
  GenerateRagAnswerOutput,
  GenerateRagAnswerResult,
  RagGenerationRepository,
} from "@/modules/search/api";

export type { RagRetrievalRepository, RetrieveRagChunksInput } from "@/modules/search/api";

export { AnswerRagQueryUseCase } from "@/modules/search/api/server";
export { FirebaseRagRetrievalRepository } from "@/modules/search/api/server";
export { GenkitRagGenerationRepository } from "@/modules/search/api/server";

export { answerRagQuery, generateAgentResponse } from "../interfaces/_actions/agent.actions";
