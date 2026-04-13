/**
 * Module: notebooklm/subdomains/synthesis
 * Layer: domain/ports
 * Purpose: VectorStore — hexagonal output port for vector database operations.
 *
 * Design notes:
 * - Domain owns this interface; infrastructure implements it.
 * - No SDK-specific types leak through this boundary.
 * - Embedding computation is the adapter's responsibility, not the port's.
 */

/** A document to index in the vector store */
export interface VectorDocument {
  readonly id: string;
  readonly content: string;
  readonly metadata?: Record<string, string | number | boolean>;
}

/** A result from a similarity search */
export interface VectorSearchResult {
  readonly id: string;
  /** Similarity score in [0, 1]; higher is closer */
  readonly score: number;
  readonly metadata?: Record<string, string | number | boolean>;
}

/**
 * Output port for any vector-store adapter (Upstash Vector, Pinecone, etc.).
 * Domain and application layers depend only on this interface.
 */
export interface VectorStore {
  /** Insert or update documents; adapter handles embedding generation */
  upsert(documents: VectorDocument[]): Promise<void>;

  /**
   * Find the top-k documents most similar to the query.
   * @param query  - Natural-language query string
   * @param k      - Number of results to return
   * @param filter - Optional metadata predicate
   */
  search(
    query: string,
    k: number,
    filter?: Record<string, string | number | boolean>,
  ): Promise<VectorSearchResult[]>;

  /** Remove documents by ID */
  delete(ids: string[]): Promise<void>;
}
