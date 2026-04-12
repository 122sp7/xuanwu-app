/**
 * Module: notebooklm/subdomains/source
 * Layer: infrastructure/firebase
 * Adapter: FirebaseWikiLibraryAdapter — Firestore implementation of IWikiLibraryRepository.
 *
 * Paths:
 *   accounts/{accountId}/wikiLibraries/{libraryId}
 *   accounts/{accountId}/wikiLibraries/{libraryId}/fields/{fieldId}
 *   accounts/{accountId}/wikiLibraries/{libraryId}/rows/{rowId}
 */

import { firestoreInfrastructureApi } from "@/modules/platform/api";

import type {
  WikiLibrary,
  WikiLibraryField,
  WikiLibraryFieldType,
  WikiLibraryRow,
  WikiLibraryStatus,
} from "../../../subdomains/source/domain/entities/WikiLibrary";
import type { IWikiLibraryRepository } from "../../../subdomains/source/domain/repositories/IWikiLibraryRepository";

// ── Firestore shapes (ISO strings; no Timestamp to avoid serialisation issues)

interface FsLibrary {
  accountId: string;
  workspaceId?: string;
  name: string;
  slug: string;
  status: WikiLibraryStatus;
  createdAtISO: string;
  updatedAtISO: string;
}

interface FsField {
  libraryId: string;
  key: string;
  label: string;
  type: WikiLibraryFieldType;
  required: boolean;
  options?: string[];
  createdAtISO: string;
}

interface FsRow {
  libraryId: string;
  values: Record<string, unknown>;
  createdAtISO: string;
  updatedAtISO: string;
}

function libraryCollectionPath(accountId: string): string {
  return `accounts/${accountId}/wikiLibraries`;
}

function libraryDocumentPath(accountId: string, libraryId: string): string {
  return `accounts/${accountId}/wikiLibraries/${libraryId}`;
}

function fieldCollectionPath(accountId: string, libraryId: string): string {
  return `accounts/${accountId}/wikiLibraries/${libraryId}/fields`;
}

function fieldDocumentPath(accountId: string, libraryId: string, fieldId: string): string {
  return `accounts/${accountId}/wikiLibraries/${libraryId}/fields/${fieldId}`;
}

function rowCollectionPath(accountId: string, libraryId: string): string {
  return `accounts/${accountId}/wikiLibraries/${libraryId}/rows`;
}

function rowDocumentPath(accountId: string, libraryId: string, rowId: string): string {
  return `accounts/${accountId}/wikiLibraries/${libraryId}/rows/${rowId}`;
}

// ── Mappers ───────────────────────────────────────────────────────────────────

function toLibrary(id: string, data: FsLibrary): WikiLibrary {
  return {
    id,
    accountId: data.accountId,
    workspaceId: data.workspaceId,
    name: data.name,
    slug: data.slug,
    status: data.status ?? "active",
    createdAt: new Date(data.createdAtISO),
    updatedAt: new Date(data.updatedAtISO),
  };
}

function toField(id: string, data: FsField): WikiLibraryField {
  return {
    id,
    libraryId: data.libraryId,
    key: data.key,
    label: data.label,
    type: data.type ?? "text",
    required: data.required === true,
    options: Array.isArray(data.options) ? data.options : undefined,
    createdAt: new Date(data.createdAtISO),
  };
}

function toRow(id: string, data: FsRow): WikiLibraryRow {
  return {
    id,
    libraryId: data.libraryId,
    values:
      typeof data.values === "object" && data.values !== null
        ? (data.values as Record<string, unknown>)
        : {},
    createdAt: new Date(data.createdAtISO),
    updatedAt: new Date(data.updatedAtISO),
  };
}

// ── Implementation ────────────────────────────────────────────────────────────

export class FirebaseWikiLibraryAdapter implements IWikiLibraryRepository {
  async listByAccountId(accountId: string): Promise<WikiLibrary[]> {
    const documents = await firestoreInfrastructureApi.queryDocuments<FsLibrary>(
      libraryCollectionPath(accountId),
      [{ field: "status", op: "==", value: "active" }],
      { orderBy: [{ field: "createdAtISO", direction: "asc" }] },
    );
    return documents.map((document) => toLibrary(document.id, document.data));
  }

  async findById(accountId: string, libraryId: string): Promise<WikiLibrary | null> {
    const data = await firestoreInfrastructureApi.get<FsLibrary>(
      libraryDocumentPath(accountId, libraryId),
    );
    if (!data) return null;
    return toLibrary(libraryId, data);
  }

  async create(library: WikiLibrary): Promise<void> {
    const data: FsLibrary = {
      accountId: library.accountId,
      ...(library.workspaceId !== undefined ? { workspaceId: library.workspaceId } : {}),
      name: library.name,
      slug: library.slug,
      status: library.status,
      createdAtISO: library.createdAt.toISOString(),
      updatedAtISO: library.updatedAt.toISOString(),
    };
    await firestoreInfrastructureApi.set(libraryDocumentPath(library.accountId, library.id), data);
  }

  async createField(accountId: string, field: WikiLibraryField): Promise<void> {
    const data: FsField = {
      libraryId: field.libraryId,
      key: field.key,
      label: field.label,
      type: field.type,
      required: field.required,
      createdAtISO: field.createdAt.toISOString(),
      ...(field.options !== undefined ? { options: [...field.options] } : {}),
    };
    await firestoreInfrastructureApi.set(fieldDocumentPath(accountId, field.libraryId, field.id), data);
  }

  async listFields(accountId: string, libraryId: string): Promise<WikiLibraryField[]> {
    const documents = await firestoreInfrastructureApi.queryDocuments<FsField>(
      fieldCollectionPath(accountId, libraryId),
      [],
      { orderBy: [{ field: "createdAtISO", direction: "asc" }] },
    );
    return documents.map((document) => toField(document.id, document.data));
  }

  async createRow(accountId: string, row: WikiLibraryRow): Promise<void> {
    const data: FsRow = {
      libraryId: row.libraryId,
      values: row.values,
      createdAtISO: row.createdAt.toISOString(),
      updatedAtISO: row.updatedAt.toISOString(),
    };
    await firestoreInfrastructureApi.set(rowDocumentPath(accountId, row.libraryId, row.id), data);
  }

  async listRows(accountId: string, libraryId: string): Promise<WikiLibraryRow[]> {
    const documents = await firestoreInfrastructureApi.queryDocuments<FsRow>(
      rowCollectionPath(accountId, libraryId),
      [],
      { orderBy: [{ field: "createdAtISO", direction: "asc" }] },
    );
    return documents.map((document) => toRow(document.id, document.data));
  }
}
