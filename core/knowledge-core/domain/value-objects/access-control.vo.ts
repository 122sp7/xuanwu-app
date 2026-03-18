export class AccessControl {
  constructor(
    public readonly ownerId: string,
    public readonly visibility: 'PUBLIC' | 'PRIVATE' | 'INTERNAL' = 'INTERNAL'
  ) {}

  canAccess(userId: string): boolean {
    return this.visibility === 'PUBLIC' || this.ownerId === userId;
  }
}