/**
 * Module: wiki-core
 * Layer: domain/port
 * Purpose: Embedding generation contract — converts text chunks to Embedding value objects.
 *          No provider dependency; OpenAI / local model adapters live in infrastructure.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import type { Embedding } from '../value-objects/embedding.vo'

export interface EmbedTextDTO {
  /** The text content to embed. */
  text: string
  /** Optional document id for tracing/logging. */
  documentId?: string
}

export interface IEmbeddingRepository {
  /**
   * Converts a single text chunk into an Embedding.
   * Implementers must handle rate-limiting and retry internally.
   */
  embed(dto: EmbedTextDTO): Promise<Embedding>

  /**
   * Batch-converts up to `batchSize` text chunks into Embeddings.
   * Results are returned in the same order as the input.
   * Max batch size: 20 (aligned with OpenAI text-embedding-3-small limit).
   */
  embedBatch(dtos: EmbedTextDTO[]): Promise<Embedding[]>
}
