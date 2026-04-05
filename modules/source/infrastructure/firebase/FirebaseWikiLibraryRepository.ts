/**
 * Module: source
 * Layer: infrastructure/firebase
 * Purpose: Firestore-backed implementation of WikiLibraryRepository.
 *
 * Paths:
 *   accounts/{accountId}/wikiLibraries/{libraryId}
 *   accounts/{accountId}/wikiLibraries/{libraryId}/fields/{fieldId}
 *   accounts/{accountId}/wikiLibraries/{libraryId}/rows/{rowId}
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type {
  WikiLibrary,
  WikiLibraryField,
  WikiLibraryFieldType,
  WikiLibraryRow,
  WikiLibraryStatus,
} from "../../domain/entities/wiki-library.types";
import type { WikiLibraryRepository } from "../../domain/repositories/WikiLibraryRepository";

// ── Firestore document shapes (ISO dates to avoid Timestamp serialisation issues) ──

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

// ── Path helpers ──────────────────────────────────────────────────────────────

function librariesCol(db: ReturnType<typeof getFirestore>, accountId: string) {
  return collection(db, "accounts", accountId, "wikiLibraries");
}

function libraryDoc(db: ReturnType<typeof getFirestore>, accountId: string, libraryId: string) {
  return doc(db, "accounts", accountId, "wikiLibraries", libraryId);
}

function fieldsCol(db: ReturnType<typeof getFirestore>, accountId: string, libraryId: string) {
  return collection(db, "accounts", accountId, "wikiLibraries", libraryId, "fields");
}

function fieldDoc(
  db: ReturnType<typeof getFirestore>,
  accountId: string,
  libraryId: string,
  fieldId: string,
) {
  return doc(db, "accounts", accountId, "wikiLibraries", libraryId, "fields", fieldId);
}

function rowsCol(db: ReturnType<typeof getFirestore>, accountId: string, libraryId: string) {
  return collection(db, "accounts", accountId, "wikiLibraries", libraryId, "rows");
}

function rowDoc(
  db: ReturnType<typeof getFirestore>,
  accountId: string,
  libraryId: string,
  rowId: string,
) {
  return doc(db, "accounts", accountId, "wikiLibraries", libraryId, "rows", rowId);
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

// ── Repository implementation ─────────────────────────────────────────────────

export class FirebaseWikiLibraryRepository implements WikiLibraryRepository {
  private db() {
    return getFirestore(firebaseClientApp);
  }

  async listByAccountId(accountId: string): Promise<WikiLibrary[]> {
    const db = this.db();
    const q = query(
      librariesCol(db, accountId),
      where("status", "==", "active"),
      orderBy("createdAtISO", "asc"),
    );
    const snaps = await getDocs(q);
    return snaps.docs.map((d) => toLibrary(d.id, d.data() as FsLibrary));
  }

  async findById(accountId: string, libraryId: string): Promise<WikiLibrary | null> {
    const db = this.db();
    const snap = await getDoc(libraryDoc(db, accountId, libraryId));
    if (!snap.exists()) return null;
    return toLibrary(snap.id, snap.data() as FsLibrary);
  }

  async create(library: WikiLibrary): Promise<void> {
    const db = this.db();
    const data: FsLibrary = {
      accountId: library.accountId,
      workspaceId: library.workspaceId,
      name: library.name,
      slug: library.slug,
      status: library.status,
      createdAtISO: library.createdAt.toISOString(),
      updatedAtISO: library.updatedAt.toISOString(),
    };
    if (data.workspaceId === undefined) {
      delete data.workspaceId;
    }
    await setDoc(libraryDoc(db, library.accountId, library.id), data);
  }

  async createField(accountId: string, field: WikiLibraryField): Promise<void> {
    const db = this.db();
    const data: FsField = {
      libraryId: field.libraryId,
      key: field.key,
      label: field.label,
      type: field.type,
      required: field.required,
      createdAtISO: field.createdAt.toISOString(),
    };
    if (field.options !== undefined) {
      data.options = field.options;
    }
    await setDoc(fieldDoc(db, accountId, field.libraryId, field.id), data);
  }

  async listFields(accountId: string, libraryId: string): Promise<WikiLibraryField[]> {
    const db = this.db();
    const q = query(fieldsCol(db, accountId, libraryId), orderBy("createdAtISO", "asc"));
    const snaps = await getDocs(q);
    return snaps.docs.map((d) => toField(d.id, d.data() as FsField));
  }

  async createRow(accountId: string, row: WikiLibraryRow): Promise<void> {
    const db = this.db();
    const data: FsRow = {
      libraryId: row.libraryId,
      values: row.values,
      createdAtISO: row.createdAt.toISOString(),
      updatedAtISO: row.updatedAt.toISOString(),
    };
    await setDoc(rowDoc(db, accountId, row.libraryId, row.id), data);
  }

  async listRows(accountId: string, libraryId: string): Promise<WikiLibraryRow[]> {
    const db = this.db();
    const q = query(rowsCol(db, accountId, libraryId), orderBy("createdAtISO", "asc"));
    const snaps = await getDocs(q);
    return snaps.docs.map((d) => toRow(d.id, d.data() as FsRow));
  }
}
