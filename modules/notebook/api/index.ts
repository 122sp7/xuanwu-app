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
export type { IThreadRepository } from "../domain/repositories/IThreadRepository";

export { answerRagQuery, generateNotebookResponse, saveThread, loadThread } from "../interfaces/_actions/notebook.actions";
