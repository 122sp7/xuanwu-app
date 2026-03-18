/**
 * Module: knowledge-core
 * Layer: domain/entity
 * Purpose: Source-of-truth knowledge entity.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
export type KnowledgeStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

export class Knowledge {
  constructor(
    public readonly id: string,
    public title: string,
    public content: string,
    public status: KnowledgeStatus,
    public readonly createdAt: Date,
  ) {}

  publish(): void {
    this.status = 'PUBLISHED'
  }

  archive(): void {
    this.status = 'ARCHIVED'
  }
}
