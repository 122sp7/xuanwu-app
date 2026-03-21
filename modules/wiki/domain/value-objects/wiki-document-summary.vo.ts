/**
 * Module: wiki-core
 * Layer: domain/value-object
 * Purpose: Immutable lightweight summary of a wiki document record.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
export interface WikiDocumentSummaryProps {
  id: string
  title: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
}

export class WikiDocumentSummary {
  constructor(public readonly props: WikiDocumentSummaryProps) {}

  toJSON(): WikiDocumentSummaryProps {
    return { ...this.props }
  }
}
