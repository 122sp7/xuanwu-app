/**
 * Module: notebooklm
 * Layer: domain (context-wide published language)
 * Purpose: Reference types consumed by downstream or upstream modules.
 *
 * These types represent the notebooklm bounded context's public vocabulary.
 * Consumers receive opaque references — never raw aggregates.
 *
 * Context Map tokens:
 *   - NotebookReference: identifies a notebook container
 *   - SourceReference: identifies a source document
 *   - ConversationReference: identifies a conversation thread
 */

/** Opaque reference to a Notebook aggregate (cross-module token) */
export interface NotebookReference {
  readonly notebookId: string;
  readonly accountId: string;
  readonly workspaceId?: string;
}

/** Opaque reference to a Source document (cross-module token) */
export interface SourceReference {
  readonly sourceId: string;
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly displayName: string;
  readonly mimeType: string;
}

/** Opaque reference to a Conversation thread (cross-module token) */
export interface ConversationReference {
  readonly threadId: string;
  readonly accountId: string;
}
