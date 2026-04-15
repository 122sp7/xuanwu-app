// shared/utils — shared utility functions

/**
 * Strips leading/trailing whitespace and collapses inner whitespace.
 * Useful for normalising user-supplied template names.
 */
export function normaliseWhitespace(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

/**
 * Returns true when the given string is a non-empty, non-whitespace value.
 */
export function isNonBlank(value: string): boolean {
  return value.trim().length > 0;
}
