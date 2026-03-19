/**
 * Module: knowledge-core
 * Layer: domain/value-object
 * Purpose: Immutable lightweight summary of a knowledge record.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
export interface KnowledgeSummaryProps {
  id: string
  title: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
}

export class KnowledgeSummary {
  constructor(public readonly props: KnowledgeSummaryProps) {}

  toJSON(): KnowledgeSummaryProps {
    return { ...this.props }
  }
}
