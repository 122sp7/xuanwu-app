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
} from "../../domain/entities/WikiLibrary";
import type { IWikiLibraryRepository } from "../../domain/repositories/IWikiLibraryRepository";

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

// ── Path helpers ──────────────────────────────────────────────────────────────

type Db = ReturnType<typeof getFirestore>;

const libCol = (db: Db, accountId: string) =>
  collection(db, "accounts", accountId, "wikiLibraries");
const libDoc = (db: Db, accountId: string, libraryId: string) =>
  doc(db, "accounts", accountId, "wikiLibraries", libraryId);
const fieldCol = (db: Db, accountId: string, libraryId: string) =>
  collection(db, "accounts", accountId, "wikiLibraries", libraryId, "fields");
const fieldDoc = (db: Db, accountId: string, libraryId: string, fieldId: string) =>
  doc(db, "accounts", accountId, "wikiLibraries", libraryId, "fields", fieldId);
const rowCol = (db: Db, accountId: string, libraryId: string) =>
  collection(db, "accounts", accountId, "wikiLibraries", libraryId, "rows");
const rowDoc = (db: Db, accountId: string, libraryId: string, rowId: string) =>
  doc(db, "accounts", accountId, "wikiLibraries", libraryId, "rows", rowId);

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
  private db() {
    return getFirestore(firebaseClientApp);
  }

  async listByAccountId(accountId: string): Promise<WikiLibrary[]> {
    const db = this.db();
    const snaps = await getDocs(
      query(libCol(db, accountId), where("status", "==", "active"), orderBy("createdAtISO", "asc")),
    );
    return snaps.docs.map((d) => toLibrary(d.id, d.data() as FsLibrary));
  }

  async findById(accountId: string, libraryId: string): Promise<WikiLibrary | null> {
    const snap = await getDoc(libDoc(this.db(), accountId, libraryId));
    if (!snap.exists()) return null;
    return toLibrary(snap.id, snap.data() as FsLibrary);
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
    await setDoc(libDoc(this.db(), library.accountId, library.id), data);
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
    await setDoc(fieldDoc(this.db(), accountId, field.libraryId, field.id), data);
  }

  async listFields(accountId: string, libraryId: string): Promise<WikiLibraryField[]> {
    const snaps = await getDocs(
      query(fieldCol(this.db(), accountId, libraryId), orderBy("createdAtISO", "asc")),
    );
    return snaps.docs.map((d) => toField(d.id, d.data() as FsField));
  }

  async createRow(accountId: string, row: WikiLibraryRow): Promise<void> {
    const data: FsRow = {
      libraryId: row.libraryId,
      values: row.values,
      createdAtISO: row.createdAt.toISOString(),
      updatedAtISO: row.updatedAt.toISOString(),
    };
    await setDoc(rowDoc(this.db(), accountId, row.libraryId, row.id), data);
  }

  async listRows(accountId: string, libraryId: string): Promise<WikiLibraryRow[]> {
    const snaps = await getDocs(
      query(rowCol(this.db(), accountId, libraryId), orderBy("createdAtISO", "asc")),
    );
    return snaps.docs.map((d) => toRow(d.id, d.data() as FsRow));
  }
}
