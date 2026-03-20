/**
 * Module: wiki-core
 * Layer: domain/value-object
 * Purpose: Immutable result of a RAG query — answer text, source references, and confidence score.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */

export interface RAGSource {
  readonly documentId: string
  readonly title: string
  readonly excerpt: string
  readonly score: number
  readonly taxonomy: string
}

export interface RAGQueryResultProps {
  readonly answer: string
  readonly sources: readonly RAGSource[]
  readonly confidence: number
  readonly queryLatencyMs?: number
}

/** Minimum retrieval confidence score required for a result to be surfaced to users. */
const HIGH_CONFIDENCE_THRESHOLD = 0.7

export class RAGQueryResult {
  constructor(public readonly props: RAGQueryResultProps) {
    if (props.confidence < 0 || props.confidence > 1) {
      throw new Error('RAGQueryResult confidence must be between 0 and 1')
    }
  }

  /** Returns true when the retrieval confidence meets the production threshold (≥0.7). */
  get hasHighConfidence(): boolean {
    return this.props.confidence >= HIGH_CONFIDENCE_THRESHOLD
  }

  toJSON(): RAGQueryResultProps {
    return { ...this.props }
  }
}
