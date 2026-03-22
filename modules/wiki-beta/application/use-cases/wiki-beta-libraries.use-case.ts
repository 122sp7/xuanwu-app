import {
  InMemoryEventStoreRepository,
  NoopEventBusRepository,
  PublishDomainEventUseCase,
} from "@/modules/event";
import { deriveSlugCandidate, isValidSlug } from "@/modules/namespace";

import type {
  AddWikiBetaLibraryFieldInput,
  CreateWikiBetaLibraryInput,
  CreateWikiBetaLibraryRowInput,
  WikiBetaLibrary,
  WikiBetaLibraryField,
  WikiBetaLibraryRow,
} from "../../domain/entities/wiki-beta-library.types";
import type { WikiBetaLibraryRepository } from "../../domain/repositories/wiki-beta.repositories";
import { InMemoryWikiBetaLibraryRepository } from "../../infrastructure";

const defaultLibraryRepository: WikiBetaLibraryRepository = new InMemoryWikiBetaLibraryRepository();
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

function ensureUniqueLibrarySlug(baseSlug: string, libraries: WikiBetaLibrary[]): string {
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

export async function listWikiBetaLibraries(
  accountId: string,
  workspaceId?: string,
  libraryRepository: WikiBetaLibraryRepository = defaultLibraryRepository,
): Promise<WikiBetaLibrary[]> {
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

export async function createWikiBetaLibrary(
  input: CreateWikiBetaLibraryInput,
  libraryRepository: WikiBetaLibraryRepository = defaultLibraryRepository,
): Promise<WikiBetaLibrary> {
  if (!input.accountId) {
    throw new Error("accountId is required");
  }

  const name = normalizeName(input.name);
  const libraries = await libraryRepository.listByAccountId(input.accountId);
  const workspaceLibraries = libraries.filter((library) => (library.workspaceId ?? "") === (input.workspaceId ?? ""));

  const slug = ensureUniqueLibrarySlug(deriveSlugCandidate(name), workspaceLibraries);
  const now = new Date();
  const library: WikiBetaLibrary = {
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
    eventName: "wiki_beta.library.created",
    aggregateType: "wiki-library",
    aggregateId: library.id,
    payload: {
      accountId: library.accountId,
      workspaceId: library.workspaceId,
      slug: library.slug,
    },
  });

  return library;
}

export async function addWikiBetaLibraryField(
  input: AddWikiBetaLibraryFieldInput,
  libraryRepository: WikiBetaLibraryRepository = defaultLibraryRepository,
): Promise<WikiBetaLibraryField> {
  const library = await libraryRepository.findById(input.accountId, input.libraryId);
  if (!library) {
    throw new Error("library not found");
  }

  const key = normalizeFieldKey(input.key);
  const label = normalizeName(input.label);
  const fields = await libraryRepository.listFields(input.accountId, input.libraryId);
  if (fields.some((field) => field.key === key)) {
    throw new Error(`field key \"${key}\" already exists`);
  }

  const field: WikiBetaLibraryField = {
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
    eventName: "wiki_beta.library.field_added",
    aggregateType: "wiki-library",
    aggregateId: input.libraryId,
    payload: {
      accountId: input.accountId,
      fieldKey: field.key,
      fieldType: field.type,
    },
  });

  return field;
}

export async function createWikiBetaLibraryRow(
  input: CreateWikiBetaLibraryRowInput,
  libraryRepository: WikiBetaLibraryRepository = defaultLibraryRepository,
): Promise<WikiBetaLibraryRow> {
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
  const row: WikiBetaLibraryRow = {
    id: generateId(),
    libraryId: input.libraryId,
    values: input.values,
    createdAt: now,
    updatedAt: now,
  };

  await libraryRepository.createRow(input.accountId, row);
  await defaultEventPublisher.execute({
    id: generateId(),
    eventName: "wiki_beta.library.row_created",
    aggregateType: "wiki-library",
    aggregateId: input.libraryId,
    payload: {
      accountId: input.accountId,
      rowId: row.id,
      fields: Object.keys(row.values),
    },
  });

  return row;
}

export interface WikiBetaLibrarySnapshot {
  library: WikiBetaLibrary;
  fields: WikiBetaLibraryField[];
  rows: WikiBetaLibraryRow[];
}

export async function getWikiBetaLibrarySnapshot(
  accountId: string,
  libraryId: string,
  libraryRepository: WikiBetaLibraryRepository = defaultLibraryRepository,
): Promise<WikiBetaLibrarySnapshot> {
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
