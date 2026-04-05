/**
 * modules/notebook — public API barrel.
 */

export type { Message, MessageRole } from "../domain/entities/message";
export type { Thread } from "../domain/entities/thread";

export type {
  NotebookResponse,
  GenerateNotebookResponseInput,
  GenerateNotebookResponseResult,
} from "../domain/entities/AgentGeneration";

export type { NotebookRepository } from "../domain/repositories/NotebookRepository";
export { GenerateNotebookResponseUseCase } from "../application/use-cases/generate-agent-response.use-case";
export { GenkitNotebookRepository } from "../infrastructure/genkit/GenkitNotebookRepository";

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

export { answerRagQuery, generateNotebookResponse } from "../interfaces/_actions/notebook.actions";
