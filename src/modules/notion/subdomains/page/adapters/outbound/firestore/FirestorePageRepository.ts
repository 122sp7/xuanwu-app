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

import { getFirebaseFirestore, firestoreApi, z } from "@packages";
import type { PageSnapshot, PageStatus } from "../../../domain/entities/Page";
import type { PageRepository, PageQuery } from "../../../domain/repositories/PageRepository";

const COLLECTION = "contentPages";

// ── Level 3 Zod schema: validates Firestore output at the adapter boundary ────

const FirestorePageSnapshotSchema = z.object({
  id: z.string(),
  accountId: z.string(),
  workspaceId: z.string().optional(),
  title: z.string(),
  slug: z.string(),
  parentPageId: z.string().nullable(),
  order: z.number(),
  blockIds: z.array(z.string()),
  status: z.enum(["active", "archived"]),
  ownerId: z.string().optional(),
  iconUrl: z.string().optional(),
  coverUrl: z.string().optional(),
  createdByUserId: z.string(),
  createdAtISO: z.string(),
  updatedAtISO: z.string(),
});

function toSnapshot(raw: unknown): PageSnapshot {
  return FirestorePageSnapshotSchema.parse(raw) as PageSnapshot;
}

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
    return toSnapshot({ id: snap.id, ...snap.data() });
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
    const d = snap.docs[0];
    return toSnapshot({ id: d.id, ...d.data() });
  }

  async findChildren(parentPageId: string): Promise<PageSnapshot[]> {
    const db = getFirebaseFirestore();
    const { collection, query, where, getDocs } = firestoreApi;
    const q = query(
      collection(db, COLLECTION),
      where("parentPageId", "==", parentPageId),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => toSnapshot({ id: d.id, ...d.data() }));
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

    const all = snap.docs.map((d) => toSnapshot({ id: d.id, ...d.data() }));
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
