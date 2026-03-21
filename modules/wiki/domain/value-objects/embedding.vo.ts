/**
 * Module: wiki
 * Layer: domain/value-object
 * Purpose: Immutable embedding value object — wraps a float vector with its model provenance.
 *          No provider dependency; provider details belong in infrastructure.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */

export interface EmbeddingProps {
  /** Float64 vector produced by the embedding model. */
  values: number[]
  /** Model identifier that produced this embedding, e.g. "text-embedding-3-small". */
  model: string
  /** Number of dimensions; must equal values.length. */
  dimensions: number
}

export class Embedding {
  public readonly values: number[]
  public readonly model: string
  public readonly dimensions: number

  constructor(props: EmbeddingProps) {
    if (props.values.length === 0) {
      throw new Error('Embedding values cannot be empty')
    }
    if (props.values.length !== props.dimensions) {
      throw new Error(
        `Embedding dimensions mismatch: declared ${props.dimensions} but got ${props.values.length}`,
      )
    }
    if (!props.model.trim()) {
      throw new Error('Embedding model identifier is required')
    }
    this.values = [...props.values]
    this.model = props.model
    this.dimensions = props.dimensions
  }

  /**
   * Returns true when this embedding is compatible with another (same model + dimensions).
   * Compatible embeddings can be compared by cosine or dot-product distance.
   */
  isCompatibleWith(other: Embedding): boolean {
    return this.model === other.model && this.dimensions === other.dimensions
  }
}
