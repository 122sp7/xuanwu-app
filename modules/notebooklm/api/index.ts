/**
 * modules/notebooklm — public API barrel.
 *
 * Stable cross-module semantic surface for notebooklm.
 * Browser-facing route composition should prefer workspace/api when workspace
 * is the orchestration owner.
 */

export type { Message, MessageRole, Thread, ThreadRepository } from "../subdomains/conversation/api";

export type {
  NotebookResponse,
  GenerateNotebookResponseInput,
  GenerateNotebookResponseResult,
  NotebookRepository,
} from "../subdomains/notebook/api";

export { generateNotebookResponse } from "../subdomains/notebook/api";
export { saveThread, loadThread } from "../subdomains/conversation/api";

// ---------------------------------------------------------------------------
// NotebookLM downstream UI surface
// Consumed by workspace as the composition owner for browser-facing flows.
// ---------------------------------------------------------------------------
export { RagQueryPanel } from "../subdomains/synthesis/api";

// ---------------------------------------------------------------------------
// Source subdomain — semantic downstream capability surface
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
  SourceDocumentsPanel,
  WorkspaceFilesTab,
  LibrariesPanel,
  LibraryTablePanel,
  FileProcessingDialog,
} from "../subdomains/source/api";

// ---------------------------------------------------------------------------
// conversation subdomain — AI chat UI and helpers
// ---------------------------------------------------------------------------

export { ConversationPanel } from "../subdomains/conversation/api";
export type { ConversationPanelProps, ChatMessage } from "../subdomains/conversation/api";

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
// Synthesis subdomain — complete RAG pipeline
// (retrieval → grounding → synthesis → evaluation)
// ---------------------------------------------------------------------------

export type {
  RetrievedChunk,
  RetrievalSummary,
  RetrieveChunksInput,
  ChunkRetrievalPort,
  RetrievalCompletedEvent,
  RetrievalFailedEvent,
} from "../subdomains/synthesis/api";

export type {
  Citation,
  GroundingEvidence,
  CitationBuilderInput,
  ICitationBuilder,
  GroundingCompletedEvent,
} from "../subdomains/synthesis/api";

export type {
  GenerationCitation,
  GenerateAnswerInput,
  GenerateAnswerOutput,
  GenerateAnswerResult,
  GenerationPort,
  SynthesisCompletedEvent,
  SynthesisFailedEvent,
} from "../subdomains/synthesis/api";

export type {
  FeedbackRating,
  QualityFeedback,
  SubmitFeedbackInput,
  FeedbackPort,
  FeedbackSubmittedEvent,
} from "../subdomains/synthesis/api";
