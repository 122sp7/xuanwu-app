/**
 * Module: source
 * Layer: application/use-cases
 * Purpose: Wiki-style library use-cases — create, add fields, add rows, list.
 *          Direct-function API kept for backward compatibility with wiki
 *          interfaces during transitional decomposition.
 */

import {
  InMemoryEventStoreRepository,
  NoopEventBusRepository,
  PublishDomainEventUseCase,
  deriveSlugCandidate,
  isValidSlug,
} from "@/modules/shared/api";

import type {
  AddWikiLibraryFieldInput,
  CreateWikiLibraryInput,
  CreateWikiLibraryRowInput,
  WikiLibrary,
  WikiLibraryField,
  WikiLibraryRow,
} from "../../domain/entities/wiki-library.types";
import type { WikiLibraryRepository } from "../../domain/repositories/WikiLibraryRepository";
const defaultEventPublisher = new PublishDomainEventUseCase(
  new InMemoryEventStoreRepository(),
  new NoopEventBusRepository(),
);

function generateId(): string {
  const randomUUID = globalThis.crypto?.randomUUID;
  if (typeof randomUUID === "function") {
    return randomUUID.call(globalThis.crypto);
  }
  return `wbl_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

function normalizeName(name: string): string {
  const value = name.trim();
  if (!value) {
    throw new Error("library name is required");
  }
  return value.slice(0, 80);
}

function normalizeFieldKey(key: string): string {
  const normalized = key.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
  if (!normalized) {
    throw new Error("field key is required");
  }
  return normalized.slice(0, 48);
}

function ensureUniqueLibrarySlug(baseSlug: string, libraries: WikiLibrary[]): string {
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

export async function listWikiLibraries(
  accountId: string,
  workspaceId: string | undefined,
  libraryRepository: WikiLibraryRepository,
): Promise<WikiLibrary[]> {
  if (!accountId) {
    throw new Error("accountId is required");
  }

  const libraries = await libraryRepository.listByAccountId(accountId);
  const activeLibraries = libraries.filter((library) => library.status === "active");
  if (!workspaceId) {
    return activeLibraries;
  }
  return activeLibraries.filter((library) => library.workspaceId === workspaceId);
}

export async function createWikiLibrary(
  input: CreateWikiLibraryInput,
  libraryRepository: WikiLibraryRepository,
): Promise<WikiLibrary> {
  if (!input.accountId) {
    throw new Error("accountId is required");
  }

  const name = normalizeName(input.name);
  const libraries = await libraryRepository.listByAccountId(input.accountId);
  const workspaceLibraries = libraries.filter((library) => (library.workspaceId ?? "") === (input.workspaceId ?? ""));

  const slug = ensureUniqueLibrarySlug(deriveSlugCandidate(name), workspaceLibraries);
  const now = new Date();
  const library: WikiLibrary = {
    id: generateId(),
    accountId: input.accountId,
    workspaceId: input.workspaceId,
    name,
    slug,
    status: "active",
    createdAt: now,
    updatedAt: now,
  };

  await libraryRepository.create(library);
  await defaultEventPublisher.execute({
    id: generateId(),
    eventName: "asset.library_created",
    aggregateType: "asset-library",
    aggregateId: library.id,
    payload: {
      accountId: library.accountId,
      workspaceId: library.workspaceId,
      slug: library.slug,
    },
  });

  return library;
}

export async function addWikiLibraryField(
  input: AddWikiLibraryFieldInput,
  libraryRepository: WikiLibraryRepository,
): Promise<WikiLibraryField> {
  const library = await libraryRepository.findById(input.accountId, input.libraryId);
  if (!library) {
    throw new Error("library not found");
  }

  const key = normalizeFieldKey(input.key);
  const label = normalizeName(input.label);
  const fields = await libraryRepository.listFields(input.accountId, input.libraryId);
  if (fields.some((field) => field.key === key)) {
    throw new Error(`field key "${key}" already exists`);
  }

  const field: WikiLibraryField = {
    id: generateId(),
    libraryId: input.libraryId,
    key,
    label,
    type: input.type,
    required: input.required ?? false,
    options: input.options,
    createdAt: new Date(),
  };

  await libraryRepository.createField(input.accountId, field);
  await defaultEventPublisher.execute({
    id: generateId(),
    eventName: "asset.library_field_added",
    aggregateType: "asset-library",
    aggregateId: input.libraryId,
    payload: {
      accountId: input.accountId,
      fieldKey: field.key,
      fieldType: field.type,
    },
  });

  return field;
}

export async function createWikiLibraryRow(
  input: CreateWikiLibraryRowInput,
  libraryRepository: WikiLibraryRepository,
): Promise<WikiLibraryRow> {
  const library = await libraryRepository.findById(input.accountId, input.libraryId);
  if (!library) {
    throw new Error("library not found");
  }

  const fields = await libraryRepository.listFields(input.accountId, input.libraryId);
  const requiredFields = fields.filter((field) => field.required);
  for (const field of requiredFields) {
    if (!(field.key in input.values)) {
      throw new Error(`missing required field: ${field.key}`);
    }
  }

  const now = new Date();
  const row: WikiLibraryRow = {
    id: generateId(),
    libraryId: input.libraryId,
    values: input.values,
    createdAt: now,
    updatedAt: now,
  };

  await libraryRepository.createRow(input.accountId, row);
  await defaultEventPublisher.execute({
    id: generateId(),
    eventName: "asset.library_row_created",
    aggregateType: "asset-library",
    aggregateId: input.libraryId,
    payload: {
      accountId: input.accountId,
      rowId: row.id,
      fields: Object.keys(row.values),
    },
  });

  return row;
}

export interface WikiLibrarySnapshot {
  library: WikiLibrary;
  fields: WikiLibraryField[];
  rows: WikiLibraryRow[];
}

export async function getWikiLibrarySnapshot(
  accountId: string,
  libraryId: string,
  libraryRepository: WikiLibraryRepository,
): Promise<WikiLibrarySnapshot> {
  const library = await libraryRepository.findById(accountId, libraryId);
  if (!library) {
    throw new Error("library not found");
  }

  const [fields, rows] = await Promise.all([
    libraryRepository.listFields(accountId, libraryId),
    libraryRepository.listRows(accountId, libraryId),
  ]);

  return { library, fields, rows };
}
