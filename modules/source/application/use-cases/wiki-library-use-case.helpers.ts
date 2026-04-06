/**
 * Module: source
 * Layer: application/use-cases
 * Purpose: Private helper functions for wiki-library use cases.
 *          Extracted to keep use-case files focused on business workflow only.
 */

import { deriveSlugCandidate, isValidSlug } from "@/modules/shared/api";
import type { WikiLibrary } from "../../domain/entities/wiki-library.types";

export function generateId(): string {
  const randomUUID = globalThis.crypto?.randomUUID;
  if (typeof randomUUID === "function") {
    return randomUUID.call(globalThis.crypto);
  }
  return `wbl_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function normalizeName(name: string): string {
  const value = name.trim();
  if (!value) {
    throw new Error("library name is required");
  }
  return value.slice(0, 80);
}

export function normalizeFieldKey(key: string): string {
  const normalized = key.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
  if (!normalized) {
    throw new Error("field key is required");
  }
  return normalized.slice(0, 48);
}

export function ensureUniqueLibrarySlug(baseSlug: string, libraries: WikiLibrary[]): string {
  const normalizedBase = isValidSlug(baseSlug) ? baseSlug : "library-node";
  const existing = new Set(libraries.map((library) => library.slug));
  if (!existing.has(normalizedBase)) {
    return normalizedBase;
  }

  let index = 2;
  while (index < 5000) {
    const candidate = `${normalizedBase}-${index}`;
    if (!existing.has(candidate) && isValidSlug(candidate)) {
      return candidate;
    }
    index += 1;
  }

  throw new Error("cannot allocate a unique slug for this library name");
}

export { deriveSlugCandidate };
