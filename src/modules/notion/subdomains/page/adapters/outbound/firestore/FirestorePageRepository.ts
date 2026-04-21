/**
 * FirestorePageRepository — Firestore adapter for the page subdomain.
 *
 * Collection: contentPages (top-level, matching firestore.indexes.json collectionGroup)
 * Each document stores a PageSnapshot directly.
 *
 * MUST be called from a client component, NOT from a Server Action.
 * The Firebase Web Client SDK requires a signed-in user in the browser context
 * so that Firestore Security Rules can evaluate request.auth.
 *
 * ESLint: @integration-firebase is allowed here — this file lives at
 * src/modules/notion/subdomains/page/adapters/outbound/firestore/
 * which matches the extended outbound glob.
 */

import { getFirebaseFirestore, firestoreApi } from "@packages";
import type { PageSnapshot, PageStatus } from "../../../domain/entities/Page";
import type { PageRepository, PageQuery } from "../../../domain/repositories/PageRepository";

const COLLECTION = "contentPages";

export class FirestorePageRepository implements PageRepository {
  async save(snapshot: PageSnapshot): Promise<void> {
    const db = getFirebaseFirestore();
    const { doc, setDoc } = firestoreApi;
    await setDoc(doc(db, COLLECTION, snapshot.id), { ...snapshot }, { merge: true });
  }

  async findById(id: string): Promise<PageSnapshot | null> {
    const db = getFirebaseFirestore();
    const { doc, getDoc } = firestoreApi;
    const snap = await getDoc(doc(db, COLLECTION, id));
    if (!snap.exists()) return null;
    return snap.data() as PageSnapshot;
  }

  async findBySlug(slug: string, accountId: string): Promise<PageSnapshot | null> {
    const db = getFirebaseFirestore();
    const { collection, query, where, getDocs } = firestoreApi;
    const q = query(
      collection(db, COLLECTION),
      where("slug", "==", slug),
      where("accountId", "==", accountId),
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return snap.docs[0].data() as PageSnapshot;
  }

  async findChildren(parentPageId: string): Promise<PageSnapshot[]> {
    const db = getFirebaseFirestore();
    const { collection, query, where, getDocs } = firestoreApi;
    const q = query(
      collection(db, COLLECTION),
      where("parentPageId", "==", parentPageId),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as PageSnapshot);
  }

  async query(params: PageQuery): Promise<PageSnapshot[]> {
    const db = getFirebaseFirestore();
    const { collection, query, where, getDocs } = firestoreApi;

    // Build equality constraints — no composite index required for equality-only filters.
    const constraints = [];
    if (params.accountId) constraints.push(where("accountId", "==", params.accountId));
    if (params.workspaceId) constraints.push(where("workspaceId", "==", params.workspaceId));
    if (params.parentPageId !== undefined)
      constraints.push(where("parentPageId", "==", params.parentPageId));
    if (params.status) constraints.push(where("status", "==", params.status as PageStatus));

    const q = query(collection(db, COLLECTION), ...constraints);
    const snap = await getDocs(q);

    const all = snap.docs.map((d) => d.data() as PageSnapshot);
    const offset = params.offset ?? 0;
    const lim = params.limit ?? 100;
    return all.slice(offset, offset + lim);
  }

  async delete(id: string): Promise<void> {
    const db = getFirebaseFirestore();
    const { doc, deleteDoc } = firestoreApi;
    await deleteDoc(doc(db, COLLECTION, id));
  }
}
