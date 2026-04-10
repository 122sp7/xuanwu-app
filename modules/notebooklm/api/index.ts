/**
 * modules/notebooklm — public API barrel.
 */

export type { Message, MessageRole, Thread, IThreadRepository } from "../subdomains/conversation/api";

export type {
  NotebookResponse,
  GenerateNotebookResponseInput,
  GenerateNotebookResponseResult,
  NotebookRepository,
} from "../subdomains/notebook/api";

export { generateNotebookResponse } from "../subdomains/notebook/api";
export { saveThread, loadThread } from "../subdomains/conversation/api";

// ---------------------------------------------------------------------------
// Q&A subdomain — types and UI (replaces @/modules/search/api)
// ---------------------------------------------------------------------------

export type {
  AnswerRagQueryInput,
  AnswerRagQueryResult,
  RagCitation,
  RagRetrievalSummary,
} from "../subdomains/ai/api";
export { RagQueryView } from "../subdomains/ai/api";

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
} from "../subdomains/source/api";

export type {
  SourceDocument,
  SourceLiveDocument,
  AssetDocument,
  AssetLiveDocument,
} from "../subdomains/source/api";

export {
  useSourceDocumentsSnapshot,
  mapToSourceLiveDocument,
  mapToAssetLiveDocument,
} from "../subdomains/source/api";

export {
  listWikiLibraries,
  createWikiLibrary,
  addWikiLibraryField,
  createWikiLibraryRow,
  getWikiLibrarySnapshot,
} from "../subdomains/source/api";

export {
  SourceDocumentsView,
  WorkspaceFilesTab,
  LibrariesView,
  LibraryTableView,
  FileProcessingDialog,
} from "../subdomains/source/api";

// ---------------------------------------------------------------------------
// conversation subdomain — AI chat UI and helpers
// ---------------------------------------------------------------------------

export { AiChatPage } from "../subdomains/conversation/api";
export type { AiChatPageProps, ChatMessage } from "../subdomains/conversation/api";
