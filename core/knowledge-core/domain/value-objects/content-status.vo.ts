/**
 * Module: knowledge-core
 * Layer: domain/value-object
 * Purpose: Status constraints and semantic helper for content lifecycle.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
export type ContentStatusValue = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

export class ContentStatus {
  private static readonly VALID: ContentStatusValue[] = ['DRAFT', 'PUBLISHED', 'ARCHIVED']

  constructor(public readonly value: ContentStatusValue) {
    if (!ContentStatus.VALID.includes(value)) {
      throw new Error('Invalid status')
    }
  }

  get isSearchable(): boolean {
    return this.value === 'PUBLISHED'
  }
}
