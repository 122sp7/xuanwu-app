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
// NotebookLM root interfaces — Q&A UI
// ---------------------------------------------------------------------------
export { RagQueryView } from "../interfaces/components/RagQueryView";

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

// ---------------------------------------------------------------------------
// Context-wide published language (cross-module reference types)
// ---------------------------------------------------------------------------

export type {
  NotebookReference,
  SourceReference,
  ConversationReference,
} from "../domain/published-language";

export type { NotebookLmDomainEvent } from "../domain/events";

// ---------------------------------------------------------------------------
// Tier 2 — retrieval subdomain (migration target from ai)
// ---------------------------------------------------------------------------

export type {
  RetrievedChunk,
  RetrievalSummary,
  RetrieveChunksInput,
  IChunkRetrievalPort,
  RetrievalCompletedEvent,
  RetrievalFailedEvent,
} from "../subdomains/retrieval/api";

// ---------------------------------------------------------------------------
// Tier 2 — grounding subdomain (migration target from ai)
// ---------------------------------------------------------------------------

export type {
  Citation,
  GroundingEvidence,
  CitationBuilderInput,
  ICitationBuilder,
  GroundingCompletedEvent,
} from "../subdomains/grounding/api";

// ---------------------------------------------------------------------------
// Tier 2 — synthesis subdomain (migration target from ai)
// ---------------------------------------------------------------------------

export type {
  GenerationCitation,
  GenerateAnswerInput,
  GenerateAnswerOutput,
  GenerateAnswerResult,
  IGenerationPort,
  SynthesisCompletedEvent,
  SynthesisFailedEvent,
} from "../subdomains/synthesis/api";

// ---------------------------------------------------------------------------
// Tier 2 — evaluation subdomain (migration target from ai)
// ---------------------------------------------------------------------------

export type {
  FeedbackRating,
  QualityFeedback,
  SubmitFeedbackInput,
  IFeedbackPort,
  FeedbackSubmittedEvent,
} from "../subdomains/evaluation/api";
