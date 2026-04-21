/**
 * Notebooklm Module — public API surface.
 * All cross-module consumers must import from here only.
 */

// document
export * from "./subdomains/document/domain";
export * from "./subdomains/document/application";
export { InMemoryDocumentRepository } from "./subdomains/document/adapters/outbound/memory/InMemoryDocumentRepository";

// notebook
export * from "./subdomains/notebook/domain";
export * from "./subdomains/notebook/application";
export { InMemoryNotebookRepository } from "./subdomains/notebook/adapters/outbound/memory/InMemoryNotebookRepository";

// conversation
export * from "./subdomains/conversation/domain";
export * from "./subdomains/conversation/application";
export { InMemoryConversationRepository } from "./subdomains/conversation/adapters/outbound/memory/InMemoryConversationRepository";

// source (canonical ubiquitous-language term for ingested document)
export * from "./subdomains/source/domain";
export * from "./subdomains/source/application";
export { InMemoryIngestionSourceRepository } from "./subdomains/source/adapters/outbound/memory/InMemoryIngestionSourceRepository";

// synthesis (RAG answer generation)
export * from "./subdomains/synthesis/domain";
export * from "./subdomains/synthesis/application";

// orchestration — source processing workflow
export type {
  TaskMaterializationWorkflowPort,
  MaterializeTasksInput,
  MaterializeTasksResult,
  TaskCandidate,
} from "./orchestration/TaskMaterializationWorkflowPort";
export {
  ProcessSourceDocumentWorkflowUseCase,
  type ProcessSourceDocumentWorkflowInput,
  type ProcessSourceDocumentWorkflowResult,
  type CreateKnowledgePagePort,
  type StepStatus,
} from "./orchestration/ProcessSourceDocumentWorkflowUseCase";
