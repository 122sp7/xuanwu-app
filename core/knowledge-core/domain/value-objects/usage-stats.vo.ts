/**
 * Module: knowledge-core
 * Layer: domain/value-object
 * Purpose: Immutable usage snapshot for analytics integration boundaries.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
export class UsageStats {
  constructor(
    public readonly viewCount: number,
    public readonly lastAccessedAt: Date | null,
  ) {}
}
