/**
 * modules/retrieval — domain port: IVectorStore
 *
 * Hexagonal architecture port that abstracts the underlying vector database
 * (e.g. Upstash Vector, Pinecone).  Infrastructure layer must implement this
 * interface; no concrete SDK details belong here.
 */

/** A document to index in the vector store */
export interface VectorDocument {
  /** Unique identifier (e.g. BlockId or PageId) */
  readonly id: string;
  /** Raw text content used to generate the embedding */
  readonly content: string;
  /** Arbitrary metadata for filtering (e.g. { pageId, workspaceId }) */
  readonly metadata?: Record<string, string | number | boolean>;
}

/** A search result returned by the vector store */
export interface VectorSearchResult {
  /** The matched document's ID */
  readonly id: string;
  /** Similarity score (0–1, higher is more similar) */
  readonly score: number;
  /** Metadata attached to the matched document */
  readonly metadata?: Record<string, string | number | boolean>;
}

/**
 * Port that every vector-store adapter must satisfy.
 * Domain and application layers depend ONLY on this interface.
 */
export interface IVectorStore {
  /**
   * Insert or update documents in the vector store.
   * Embeddings are computed by the adapter implementation.
   */
  upsert(documents: VectorDocument[]): Promise<void>;

  /**
   * Find the top-K documents most similar to the query text.
   * @param query   - Natural-language query string
   * @param k       - Number of results to return
   * @param filter  - Optional metadata filter
   */
  search(
    query: string,
    k: number,
    filter?: Record<string, string | number | boolean>,
  ): Promise<VectorSearchResult[]>;
}
