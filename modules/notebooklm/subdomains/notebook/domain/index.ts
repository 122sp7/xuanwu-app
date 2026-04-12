/**
 * notebooklm/notebook domain — public exports.
 */
export type { NotebookRepository } from "./repositories/NotebookRepository";
export * from "./ports";
export type {
  NotebookResponseGeneratedEvent,
  NotebookResponseFailedEvent,
} from "./events/NotebookEvents";
