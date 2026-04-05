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

export type { NotebookRepository } from "../domain/repositories/AgentRepository";

export { answerRagQuery, generateNotebookResponse } from "../interfaces/_actions/notebook.actions";
