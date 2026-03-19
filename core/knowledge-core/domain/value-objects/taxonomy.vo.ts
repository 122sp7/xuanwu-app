/**
 * Module: knowledge-core
 * Layer: domain/value-object
 * Purpose: Semantic classification independent from content storage and retrieval index.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
export class Taxonomy {
  public readonly tags: string[]

  constructor(
    public readonly category: string,
    tags: string[],
    public readonly namespace: string = 'default',
  ) {
    this.tags = [...new Set(tags.map((t) => t.toLowerCase().trim()))]
  }

  equals(other: Taxonomy): boolean {
    return (
      this.category === other.category &&
      this.namespace === other.namespace &&
      this.tags.slice().sort().join(',') === other.tags.slice().sort().join(',')
    )
  }
}
