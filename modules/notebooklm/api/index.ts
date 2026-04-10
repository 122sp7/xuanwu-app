/**
 * modules/notebooklm — public API barrel.
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

// ---------------------------------------------------------------------------
// Q&A subdomain — types and UI (replaces @/modules/search/api)
// ---------------------------------------------------------------------------

export type {
  AnswerRagQueryInput,
  AnswerRagQueryResult,
  RagCitation,
  RagRetrievalSummary,
} from "../subdomains/ai/qa";
export { RagQueryView } from "../subdomains/ai/qa";

// ---------------------------------------------------------------------------
// Source subdomain — types, hooks, and UI (replaces @/modules/source/api)
// ---------------------------------------------------------------------------

export type {
  WikiLibrary,
  WikiLibraryField,
  WikiLibraryFieldType,
  WikiLibraryRow,
  WikiLibraryStatus,
  WikiLibrarySnapshot,
  CreateWikiLibraryInput,
  AddWikiLibraryFieldInput,
  CreateWikiLibraryRowInput,
} from "../subdomains/source";

export type {
  SourceDocument,
  SourceLiveDocument,
  AssetDocument,
  AssetLiveDocument,
} from "../subdomains/source";

export {
  useSourceDocumentsSnapshot,
  mapToSourceLiveDocument,
  mapToAssetLiveDocument,
} from "../subdomains/source";

export {
  listWikiLibraries,
  createWikiLibrary,
  addWikiLibraryField,
  createWikiLibraryRow,
  getWikiLibrarySnapshot,
} from "../subdomains/source";

export {
  SourceDocumentsView,
  WorkspaceFilesTab,
  LibrariesView,
  LibraryTableView,
  FileProcessingDialog,
} from "../subdomains/source";

// ---------------------------------------------------------------------------
// conversation subdomain — AI chat UI and helpers
// ---------------------------------------------------------------------------

export { AiChatPage } from "../subdomains/conversation";
export type { AiChatPageProps, ChatMessage } from "../subdomains/conversation";
