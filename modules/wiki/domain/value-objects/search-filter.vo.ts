/**
 * Module: wiki
 * Layer: domain/value-object
 * Purpose: Search filter definition independent from vector provider SDKs.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
export interface DateRange {
  start: Date
  end: Date
}

export class SearchFilter {
  constructor(
    public readonly category?: string,
    public readonly tags: string[] = [],
    public readonly dateRange?: DateRange,
  ) {}
}
