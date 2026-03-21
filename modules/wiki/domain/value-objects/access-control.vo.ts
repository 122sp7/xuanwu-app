/**
 * Module: wiki-core
 * Layer: domain/value-object
 * Purpose: Access policy value object for owner and visibility rules.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
export type Visibility = 'PUBLIC' | 'PRIVATE' | 'INTERNAL'

export class AccessControl {
  constructor(
    public readonly ownerId: string,
    public readonly visibility: Visibility = 'INTERNAL',
  ) {}

  canAccess(userId: string): boolean {
    return this.visibility === 'PUBLIC' || this.ownerId === userId
  }
}
