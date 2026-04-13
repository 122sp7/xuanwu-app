/**
 * Module: notebooklm/subdomains/source
 * Layer: domain/ports
 * Port: SourceDocumentWatchPort — real-time document collection watching contract.
 *
 * Used by the useSourceDocumentsSnapshot hook to subscribe to document changes
 * without depending on platform infrastructure APIs directly.
 */

export interface WatchedDocument<T> {
  readonly id: string;
  readonly path: string;
  readonly data: T;
}

export interface SourceDocumentWatchPort {
  /** Subscribe to a Firestore collection and receive real-time updates. Returns an unsubscribe function. */
  watchCollection<T>(
    collectionPath: string,
    handlers: {
      onNext: (documents: readonly WatchedDocument<T>[]) => void;
      onError?: (error: unknown) => void;
    },
  ): () => void;
}
