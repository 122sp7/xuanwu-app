/**
 * Module: namespace
 * Layer: domain/value-object
 * Purpose: Immutable slug value object — validates and normalises namespace identifiers.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */

const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/

export class NamespaceSlug {
  private constructor(public readonly value: string) {}

  static create(raw: string): NamespaceSlug {
    const normalised = raw.trim().toLowerCase()
    if (!SLUG_PATTERN.test(normalised)) {
      throw new Error(
        `Invalid namespace slug "${normalised}". Must be 3–63 chars, lowercase alphanumeric with hyphens, no leading/trailing hyphen.`,
      )
    }
    return new NamespaceSlug(normalised)
  }

  equals(other: NamespaceSlug): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}
