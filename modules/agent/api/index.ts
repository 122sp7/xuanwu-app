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
} from "@/modules/retrieval/api";

export type {
  GenerateRagAnswerInput,
  GenerateRagAnswerOutput,
  GenerateRagAnswerResult,
  RagGenerationRepository,
} from "@/modules/retrieval/api";

export type { RagRetrievalRepository, RetrieveRagChunksInput } from "@/modules/retrieval/api";

export { AnswerRagQueryUseCase } from "@/modules/retrieval/api";
export { FirebaseRagRetrievalRepository } from "@/modules/retrieval/api";
export { GenkitRagGenerationRepository } from "@/modules/retrieval/api";

export { answerRagQuery, generateAgentResponse } from "../interfaces/_actions/agent.actions";
