/**
 * Module: notion/subdomains/knowledge
 * Layer: infrastructure/firebase
 * Purpose: Firebase adapter implementing IBacklinkIndexRepository.
 * Firestore paths:
 *   accounts/{accountId}/backlinkIndex/{targetPageId}
 *   accounts/{accountId}/backlinkOutbound/{sourcePageId}
 */

import { doc, getDoc, getDocs, collection, getFirestore, writeBatch } from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { IBacklinkIndexRepository, UpsertBacklinkEntriesInput, RemoveBacklinksFromSourceInput } from "../../domain/repositories/IBacklinkIndexRepository";
import { BacklinkIndex } from "../../domain/aggregates/BacklinkIndex";
import type { BacklinkEntry, BacklinkIndexSnapshot } from "../../domain/aggregates/BacklinkIndex";

function backlinkIndexDoc(db: ReturnType<typeof getFirestore>, accountId: string, targetPageId: string) {
  return doc(db, "accounts", accountId, "backlinkIndex", targetPageId);
}
function backlinkOutboundDoc(db: ReturnType<typeof getFirestore>, accountId: string, sourcePageId: string) {
  return doc(db, "accounts", accountId, "backlinkOutbound", sourcePageId);
}

function toEntries(raw: unknown): BacklinkEntry[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((e): e is Record<string, unknown> => typeof e === "object" && e !== null)
    .map((e) => ({
      sourcePageId: typeof e.sourcePageId === "string" ? e.sourcePageId : "",
      sourcePageTitle: typeof e.sourcePageTitle === "string" ? e.sourcePageTitle : "",
      blockId: typeof e.blockId === "string" ? e.blockId : "",
      lastSeenAtISO: typeof e.lastSeenAtISO === "string" ? e.lastSeenAtISO : "",
    }));
}

export class FirebaseBacklinkIndexRepository implements IBacklinkIndexRepository {
  private get db() { return getFirestore(firebaseClientApp); }

  async upsertFromSource(input: UpsertBacklinkEntriesInput): Promise<void> {
    const { accountId, targetPageId, sourcePageId, entries } = input;
    const ref = backlinkIndexDoc(this.db, accountId, targetPageId);
    const snap = await getDoc(ref);
    const existing = snap.exists() ? toEntries((snap.data() as Record<string, unknown>).entries) : [];
    const nowISO = new Date().toISOString();
    const filtered = existing.filter((e) => !entries.some((ne) => e.blockId === ne.blockId && e.sourcePageId === sourcePageId));
    const newEntries: BacklinkEntry[] = entries.map((e) => ({ sourcePageId, sourcePageTitle: (e as BacklinkEntry).sourcePageTitle ?? "", blockId: e.blockId, lastSeenAtISO: nowISO }));
    const merged = [...filtered, ...newEntries];

    const batch = writeBatch(this.db);
    batch.set(ref, { targetPageId, accountId, entries: merged, updatedAtISO: nowISO }, { merge: true });

    // Update outbound index
    const outRef = backlinkOutboundDoc(this.db, accountId, sourcePageId);
    batch.set(outRef, { sourcePageId, accountId, targetPageIds: [targetPageId], updatedAtISO: nowISO }, { merge: true });
    await batch.commit();
  }

  async removeFromSource(input: RemoveBacklinksFromSourceInput): Promise<void> {
    const { accountId, sourcePageId } = input;
    const outRef = backlinkOutboundDoc(this.db, accountId, sourcePageId);
    const outSnap = await getDoc(outRef);
    const targetPageIds: string[] = outSnap.exists()
      ? ((outSnap.data() as Record<string, unknown>).targetPageIds as string[] ?? [])
      : [];

    const batch = writeBatch(this.db);
    const nowISO = new Date().toISOString();
    for (const targetPageId of targetPageIds) {
      const ref = backlinkIndexDoc(this.db, accountId, targetPageId);
      const snap = await getDoc(ref);
      if (!snap.exists()) continue;
      const entries = toEntries((snap.data() as Record<string, unknown>).entries).filter((e) => e.sourcePageId !== sourcePageId);
      batch.set(ref, { entries, updatedAtISO: nowISO }, { merge: true });
    }
    batch.set(outRef, { targetPageIds: [], updatedAtISO: nowISO }, { merge: true });
    await batch.commit();
  }

  async findByTargetPage(accountId: string, targetPageId: string): Promise<BacklinkIndex | null> {
    const snap = await getDoc(backlinkIndexDoc(this.db, accountId, targetPageId));
    if (!snap.exists()) return null;
    const d = snap.data() as Record<string, unknown>;
    const snapshot: BacklinkIndexSnapshot = {
      targetPageId,
      accountId,
      entries: toEntries(d.entries),
      updatedAtISO: typeof d.updatedAtISO === "string" ? d.updatedAtISO : "",
    };
    return BacklinkIndex.reconstitute(snapshot);
  }

  async listOutboundTargets(accountId: string, sourcePageId: string): Promise<ReadonlyArray<string>> {
    const snap = await getDoc(backlinkOutboundDoc(this.db, accountId, sourcePageId));
    if (!snap.exists()) return [];
    const d = snap.data() as Record<string, unknown>;
    return Array.isArray(d.targetPageIds) ? (d.targetPageIds as string[]) : [];
  }
}
