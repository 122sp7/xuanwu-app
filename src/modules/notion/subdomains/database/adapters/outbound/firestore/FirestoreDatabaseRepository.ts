/**
 * FirestoreDatabaseRepository — Firestore adapter for the database subdomain.
 *
 * Collection: knowledgeDatabases (top-level, matching firestore.indexes.json collectionGroup)
 * Each document stores a DatabaseSnapshot directly.
 *
 * MUST be called from a client component, NOT from a Server Action.
 * The Firebase Web Client SDK requires a signed-in user in the browser context
 * so that Firestore Security Rules can evaluate request.auth.
 *
 * ESLint: @integration-firebase is allowed here — this file lives at
 * src/modules/notion/subdomains/database/adapters/outbound/firestore/
 * which matches the extended outbound glob.
 */

import { getFirebaseFirestore, firestoreApi, z } from "@packages";
import type { DatabaseSnapshot } from "../../../domain/entities/Database";
import type { DatabaseRepository } from "../../../domain/repositories/DatabaseRepository";

const COLLECTION = "knowledgeDatabases";

// ── Level 3 Zod schema: validates Firestore output at the adapter boundary ────

const FirestoreDatabasePropertySchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["text", "number", "select", "multi_select", "date", "checkbox", "url", "email", "file", "relation"]),
  options: z.array(z.string()).optional(),
});

const FirestoreDatabaseSnapshotSchema = z.object({
  id: z.string(),
  parentPageId: z.string().nullable(),
  workspaceId: z.string(),
  accountId: z.string(),
  title: z.string(),
  description: z.string().optional(),
  sourceDocumentId: z.string().optional(),
  sourceText: z.string().optional(),
  properties: z.array(FirestoreDatabasePropertySchema),
  status: z.enum(["active", "archived"]),
  createdByUserId: z.string(),
  createdAtISO: z.string(),
  updatedAtISO: z.string(),
});

function toSnapshot(raw: unknown): DatabaseSnapshot {
  return FirestoreDatabaseSnapshotSchema.parse(raw) as DatabaseSnapshot;
}

export class FirestoreDatabaseRepository implements DatabaseRepository {
  async save(snapshot: DatabaseSnapshot): Promise<void> {
    const db = getFirebaseFirestore();
    const { doc, setDoc } = firestoreApi;
    await setDoc(doc(db, COLLECTION, snapshot.id), { ...snapshot }, { merge: true });
  }

  async findById(id: string): Promise<DatabaseSnapshot | null> {
    const db = getFirebaseFirestore();
    const { doc, getDoc } = firestoreApi;
    const snap = await getDoc(doc(db, COLLECTION, id));
    if (!snap.exists()) return null;
    return toSnapshot({ id: snap.id, ...snap.data() });
  }

  async findByParentPageId(parentPageId: string): Promise<DatabaseSnapshot[]> {
    const db = getFirebaseFirestore();
    const { collection, query, where, getDocs } = firestoreApi;
    const q = query(collection(db, COLLECTION), where("parentPageId", "==", parentPageId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => toSnapshot({ id: d.id, ...d.data() }));
  }

  async findByWorkspaceId(workspaceId: string): Promise<DatabaseSnapshot[]> {
    const db = getFirebaseFirestore();
    const { collection, query, where, getDocs } = firestoreApi;
    const q = query(collection(db, COLLECTION), where("workspaceId", "==", workspaceId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => toSnapshot({ id: d.id, ...d.data() }));
  }

  async delete(id: string): Promise<void> {
    const db = getFirebaseFirestore();
    const { doc, deleteDoc } = firestoreApi;
    await deleteDoc(doc(db, COLLECTION, id));
  }
}
