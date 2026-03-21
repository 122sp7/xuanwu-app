/**
 * Module: namespace
 * Layer: domain/service
 * Purpose: Pure slug-validation helper — derives a safe slug candidate from a raw display name.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */

/**
 * Converts a human-readable display name into a slug candidate.
 * Pure function — no side effects.
 *
 * Rules:
 *   - Lower-case
 *   - Replace spaces / underscores / dots with hyphens
 *   - Strip non-alphanumeric / non-hyphen characters
 *   - Collapse consecutive hyphens
 *   - Trim leading and trailing hyphens
 *   - Truncate to 63 characters
 */
export function deriveSlugCandidate(displayName: string): string {
  return displayName
    .toLowerCase()
    .replace(/[\s_./\\]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 63)
}

/**
 * Returns true when the slug string passes namespace slug rules (without instantiating NamespaceSlug VO).
 * Pure function — no side effects.
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/.test(slug)
}
