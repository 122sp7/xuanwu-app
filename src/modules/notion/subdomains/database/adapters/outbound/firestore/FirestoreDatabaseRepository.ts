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

import { getFirebaseFirestore, firestoreApi } from "@packages";
import type { DatabaseSnapshot } from "../../../domain/entities/Database";
import type { DatabaseRepository } from "../../../domain/repositories/DatabaseRepository";

const COLLECTION = "knowledgeDatabases";

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
    return snap.data() as DatabaseSnapshot;
  }

  async findByPageId(pageId: string): Promise<DatabaseSnapshot[]> {
    const db = getFirebaseFirestore();
    const { collection, query, where, getDocs } = firestoreApi;
    const q = query(collection(db, COLLECTION), where("pageId", "==", pageId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as DatabaseSnapshot);
  }

  async findByWorkspaceId(workspaceId: string): Promise<DatabaseSnapshot[]> {
    const db = getFirebaseFirestore();
    const { collection, query, where, getDocs } = firestoreApi;
    const q = query(collection(db, COLLECTION), where("workspaceId", "==", workspaceId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as DatabaseSnapshot);
  }

  async delete(id: string): Promise<void> {
    const db = getFirebaseFirestore();
    const { doc, deleteDoc } = firestoreApi;
    await deleteDoc(doc(db, COLLECTION, id));
  }
}
