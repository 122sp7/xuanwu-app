/**
 * Module: knowledge
 * Layer: infrastructure/firebase
 * Purpose: Firebase Firestore implementation of IBacklinkIndexRepository.
 *
 * Data model:
 *   accounts/{accountId}/backlinkIndex/{targetPageId}
 *     entries: BacklinkEntry[]
 *     updatedAtISO: string
 *
 * accounts/{accountId}/backlinkOutbound/{sourcePageId}
 *     targetPageIds: string[]
 *     updatedAtISO: string
 */

import {
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { BacklinkIndex, BacklinkEntry } from "../../domain/entities/backlink-index.entity";
import type {
  IBacklinkIndexRepository,
  UpsertBacklinkEntriesInput,
  RemoveBacklinksFromSourceInput,
} from "../../domain/repositories/IBacklinkIndexRepository";

function backlinkIndexDoc(db: ReturnType<typeof getFirestore>, accountId: string, targetPageId: string) {
  return doc(db, "accounts", accountId, "backlinkIndex", targetPageId);
}

function backlinkOutboundDoc(db: ReturnType<typeof getFirestore>, accountId: string, sourcePageId: string) {
  return doc(db, "accounts", accountId, "backlinkOutbound", sourcePageId);
}

function toBacklinkIndex(targetPageId: string, accountId: string, data: Record<string, unknown>): BacklinkIndex {
  const rawEntries = Array.isArray(data.entries) ? (data.entries as unknown[]) : [];
  const entries: BacklinkEntry[] = rawEntries
    .filter((e): e is Record<string, unknown> => typeof e === "object" && e !== null)
    .map((e) => ({
      sourcePageId: typeof e.sourcePageId === "string" ? e.sourcePageId : "",
      sourcePageTitle: typeof e.sourcePageTitle === "string" ? e.sourcePageTitle : "",
      blockId: typeof e.blockId === "string" ? e.blockId : "",
      lastSeenAtISO: typeof e.lastSeenAtISO === "string" ? e.lastSeenAtISO : "",
    }));
  return {
    targetPageId,
    accountId,
    entries,
    updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : "",
  };
}

export class FirebaseBacklinkIndexRepository implements IBacklinkIndexRepository {
  private get db() { return getFirestore(firebaseClientApp); }

  async upsertFromSource(input: UpsertBacklinkEntriesInput): Promise<void> {
    const { accountId, targetPageId, sourcePageId, entries } = input;
    const nowISO = new Date().toISOString();
    const db = this.db;

    const indexRef = backlinkIndexDoc(db, accountId, targetPageId);
    const indexSnap = await getDoc(indexRef);
    const existing = indexSnap.exists()
      ? (indexSnap.data() as Record<string, unknown>)
      : { entries: [], updatedAtISO: nowISO };

    const currentEntries: BacklinkEntry[] = Array.isArray(existing.entries)
      ? (existing.entries as unknown[])
          .filter((e): e is Record<string, unknown> => typeof e === "object" && e !== null)
          .map((e) => ({
            sourcePageId: typeof e.sourcePageId === "string" ? e.sourcePageId : "",
            sourcePageTitle: typeof e.sourcePageTitle === "string" ? e.sourcePageTitle : "",
            blockId: typeof e.blockId === "string" ? e.blockId : "",
            lastSeenAtISO: typeof e.lastSeenAtISO === "string" ? e.lastSeenAtISO : "",
          }))
      : [];

    const filtered = currentEntries.filter((e) => e.sourcePageId !== sourcePageId);
    const newEntries: BacklinkEntry[] = entries.map((e) => ({
      sourcePageId,
      sourcePageTitle: e.sourcePageTitle,
      blockId: e.blockId,
      lastSeenAtISO: e.lastSeenAtISO,
    }));
    const merged = [...filtered, ...newEntries];

    const batch = writeBatch(db);
    batch.set(indexRef, { entries: merged, updatedAtISO: nowISO, _updatedAt: serverTimestamp() }, { merge: true });

    const outboundRef = backlinkOutboundDoc(db, accountId, sourcePageId);
    const outboundSnap = await getDoc(outboundRef);
    const existingTargets: string[] = outboundSnap.exists()
      ? ((outboundSnap.data() as Record<string, unknown>).targetPageIds as string[] ?? [])
      : [];
    if (!existingTargets.includes(targetPageId)) {
      batch.set(outboundRef, {
        targetPageIds: [...existingTargets, targetPageId],
        updatedAtISO: nowISO,
        _updatedAt: serverTimestamp(),
      }, { merge: true });
    }

    await batch.commit();
  }

  async removeFromSource(input: RemoveBacklinksFromSourceInput): Promise<void> {
    const { accountId, sourcePageId } = input;
    const nowISO = new Date().toISOString();
    const db = this.db;

    const outboundRef = backlinkOutboundDoc(db, accountId, sourcePageId);
    const outboundSnap = await getDoc(outboundRef);
    if (!outboundSnap.exists()) return;

    const targetIds: string[] = (outboundSnap.data() as Record<string, unknown>).targetPageIds as string[] ?? [];
    const batch = writeBatch(db);

    for (const targetPageId of targetIds) {
      const indexRef = backlinkIndexDoc(db, accountId, targetPageId);
      const indexSnap = await getDoc(indexRef);
      if (!indexSnap.exists()) continue;
      const data = indexSnap.data() as Record<string, unknown>;
      const entries: BacklinkEntry[] = Array.isArray(data.entries)
        ? (data.entries as BacklinkEntry[]).filter((e) => e.sourcePageId !== sourcePageId)
        : [];
      batch.set(indexRef, { entries, updatedAtISO: nowISO, _updatedAt: serverTimestamp() }, { merge: true });
    }

    batch.set(outboundRef, { targetPageIds: [], updatedAtISO: nowISO, _updatedAt: serverTimestamp() }, { merge: true });
    await batch.commit();
  }

  async findByTargetPage(accountId: string, targetPageId: string): Promise<BacklinkIndex | null> {
    const snap = await getDoc(backlinkIndexDoc(this.db, accountId, targetPageId));
    if (!snap.exists()) return null;
    return toBacklinkIndex(targetPageId, accountId, snap.data() as Record<string, unknown>);
  }

  async listOutboundTargets(accountId: string, sourcePageId: string): Promise<ReadonlyArray<string>> {
    const snap = await getDoc(backlinkOutboundDoc(this.db, accountId, sourcePageId));
    if (!snap.exists()) return [];
    const data = snap.data() as Record<string, unknown>;
    return Array.isArray(data.targetPageIds)
      ? (data.targetPageIds as unknown[]).filter((v): v is string => typeof v === "string")
      : [];
  }
}
