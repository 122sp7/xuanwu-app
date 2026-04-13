/**
 * Module: notebooklm/subdomains/source
 * Layer: application/use-cases
 * Use Cases: Wiki library management — create, add fields, add rows, list.
 *
 * Design notes:
 * - All functions take explicit repository injection (no module-scope singletons).
 * - Event publisher is created lazily to avoid import-time side effects.
 * - Event publishing uses @shared-events public boundary only.
 */

import {
  InMemoryEventStoreRepository,
  NoopEventBusRepository,
  PublishDomainEventUseCase,
} from "@shared-events";

import type {
  WikiLibrary,
  WikiLibraryField,
  WikiLibraryRow,
  CreateWikiLibraryInput,
  AddWikiLibraryFieldInput,
  CreateWikiLibraryRowInput,
} from "../../domain/entities/WikiLibrary";
import type { WikiLibraryRepository } from "../../domain/repositories/WikiLibraryRepository";
import {
  generateSourceId,
  normalizeLibraryName,
  normalizeFieldKey,
  ensureUniqueLibrarySlug,
  deriveSlugCandidate,
} from "./wiki-library.helpers";

// Lazy event publisher — only instantiated on first event emit.
let _eventPublisher: PublishDomainEventUseCase | undefined;

function getEventPublisher(): PublishDomainEventUseCase {
  if (!_eventPublisher) {
    _eventPublisher = new PublishDomainEventUseCase(
      new InMemoryEventStoreRepository(),
      new NoopEventBusRepository(),
    );
  }
  return _eventPublisher;
}

// ────────────────────────────────────────────────────────────────────────────

export async function listWikiLibraries(
  accountId: string,
  workspaceId: string | undefined,
  libraryRepository: WikiLibraryRepository,
): Promise<WikiLibrary[]> {
  if (!accountId) throw new Error("accountId is required");
  const libraries = await libraryRepository.listByAccountId(accountId);
  const activeLibraries = libraries.filter((lib) => lib.status === "active");
  if (!workspaceId) return activeLibraries;
  return activeLibraries.filter((lib) => lib.workspaceId === workspaceId);
}

export async function createWikiLibrary(
  input: CreateWikiLibraryInput,
  libraryRepository: WikiLibraryRepository,
): Promise<WikiLibrary> {
  if (!input.accountId) throw new Error("accountId is required");

  const name = normalizeLibraryName(input.name);
  const libraries = await libraryRepository.listByAccountId(input.accountId);
  const workspaceLibraries = libraries.filter(
    (lib) => (lib.workspaceId ?? "") === (input.workspaceId ?? ""),
  );

  const slug = ensureUniqueLibrarySlug(deriveSlugCandidate(name), workspaceLibraries);
  const now = new Date();
  const library: WikiLibrary = {
    id: generateSourceId(),
    accountId: input.accountId,
    workspaceId: input.workspaceId,
    name,
    slug,
    status: "active",
    createdAt: now,
    updatedAt: now,
  };

  await libraryRepository.create(library);
  await getEventPublisher().execute({
    id: generateSourceId(),
    eventName: "source.library_created",
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

export async function addWikiLibraryField(
  input: AddWikiLibraryFieldInput,
  libraryRepository: WikiLibraryRepository,
): Promise<WikiLibraryField> {
  const library = await libraryRepository.findById(input.accountId, input.libraryId);
  if (!library) throw new Error("library not found");

  const key = normalizeFieldKey(input.key);
  const label = normalizeLibraryName(input.label);
  const fields = await libraryRepository.listFields(input.accountId, input.libraryId);
  if (fields.some((f) => f.key === key)) throw new Error(`field key "${key}" already exists`);

  const field: WikiLibraryField = {
    id: generateSourceId(),
    libraryId: input.libraryId,
    key,
    label,
    type: input.type,
    required: input.required ?? false,
    options: input.options,
    createdAt: new Date(),
  };

  await libraryRepository.createField(input.accountId, field);
  await getEventPublisher().execute({
    id: generateSourceId(),
    eventName: "source.library_field_added",
    aggregateType: "wiki-library",
    aggregateId: input.libraryId,
    payload: { accountId: input.accountId, fieldKey: field.key, fieldType: field.type },
  });

  return field;
}

export async function createWikiLibraryRow(
  input: CreateWikiLibraryRowInput,
  libraryRepository: WikiLibraryRepository,
): Promise<WikiLibraryRow> {
  const library = await libraryRepository.findById(input.accountId, input.libraryId);
  if (!library) throw new Error("library not found");

  const fields = await libraryRepository.listFields(input.accountId, input.libraryId);
  for (const field of fields.filter((f) => f.required)) {
    if (!(field.key in input.values)) throw new Error(`missing required field: ${field.key}`);
  }

  const now = new Date();
  const row: WikiLibraryRow = {
    id: generateSourceId(),
    libraryId: input.libraryId,
    values: input.values,
    createdAt: now,
    updatedAt: now,
  };

  await libraryRepository.createRow(input.accountId, row);
  await getEventPublisher().execute({
    id: generateSourceId(),
    eventName: "source.library_row_created",
    aggregateType: "wiki-library",
    aggregateId: input.libraryId,
    payload: { accountId: input.accountId, rowId: row.id, fields: Object.keys(row.values) },
  });

  return row;
}

export interface WikiLibrarySnapshot {
  readonly library: WikiLibrary;
  readonly fields: WikiLibraryField[];
  readonly rows: WikiLibraryRow[];
}

export async function getWikiLibrarySnapshot(
  accountId: string,
  libraryId: string,
  libraryRepository: WikiLibraryRepository,
): Promise<WikiLibrarySnapshot> {
  const library = await libraryRepository.findById(accountId, libraryId);
  if (!library) throw new Error("library not found");

  const [fields, rows] = await Promise.all([
    libraryRepository.listFields(accountId, libraryId),
    libraryRepository.listRows(accountId, libraryId),
  ]);

  return { library, fields, rows };
}
