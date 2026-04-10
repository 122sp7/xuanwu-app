/**
 * notebooklm/subdomains/source — slug utilities
 * Pure slug derivation and validation helpers for wiki library names.
 */

/**
 * Converts a human-readable display name into a slug candidate.
 * Pure function — no side effects.
 */
export function deriveSlugCandidate(displayName: string): string {
  return displayName
    .toLowerCase()
    .replace(/[\s_./\\]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 63);
}

/**
 * Returns true when the slug string passes namespace slug rules.
 * Pure function — no side effects.
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/.test(slug);
}
