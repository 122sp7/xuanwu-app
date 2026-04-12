/**
 * Module: notion/subdomains/knowledge
 * Layer: infrastructure/firebase
 * Purpose: Firebase adapter implementing IBacklinkIndexRepository.
 * Firestore paths:
 *   accounts/{accountId}/backlinkIndex/{targetPageId}
 *   accounts/{accountId}/backlinkOutbound/{sourcePageId}
 */

import { firestoreInfrastructureApi } from "@/modules/platform/api";
import type { IBacklinkIndexRepository, UpsertBacklinkEntriesInput, RemoveBacklinksFromSourceInput } from "../../../subdomains/knowledge/domain/repositories/IBacklinkIndexRepository";
import { BacklinkIndex } from "../../../subdomains/knowledge/domain/aggregates/BacklinkIndex";
import type { BacklinkEntry, BacklinkIndexSnapshot } from "../../../subdomains/knowledge/domain/aggregates/BacklinkIndex";

function backlinkIndexPath(accountId: string, targetPageId: string): string {
  return `accounts/${accountId}/backlinkIndex/${targetPageId}`;
}

function backlinkOutboundPath(accountId: string, sourcePageId: string): string {
  return `accounts/${accountId}/backlinkOutbound/${sourcePageId}`;
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
  async upsertFromSource(input: UpsertBacklinkEntriesInput): Promise<void> {
    const { accountId, targetPageId, sourcePageId, entries } = input;
    const existingIndex = await firestoreInfrastructureApi.get<Record<string, unknown>>(
      backlinkIndexPath(accountId, targetPageId),
    );
    const existing = existingIndex ? toEntries(existingIndex.entries) : [];
    const nowISO = new Date().toISOString();
    const filtered = existing.filter((e) => !entries.some((ne) => e.blockId === ne.blockId && e.sourcePageId === sourcePageId));
    const newEntries: BacklinkEntry[] = entries.map((e) => ({ sourcePageId, sourcePageTitle: (e as BacklinkEntry).sourcePageTitle ?? "", blockId: e.blockId, lastSeenAtISO: nowISO }));
    const merged = [...filtered, ...newEntries];

    const existingOut = await firestoreInfrastructureApi.get<Record<string, unknown>>(
      backlinkOutboundPath(accountId, sourcePageId),
    );
    const currentTargetIds = Array.isArray(existingOut?.targetPageIds)
      ? existingOut.targetPageIds.filter((item): item is string => typeof item === "string")
      : [];

    const nextTargetIds = Array.from(new Set([...currentTargetIds, targetPageId]));

    await firestoreInfrastructureApi.setMany([
      {
        path: backlinkIndexPath(accountId, targetPageId),
        data: { targetPageId, accountId, entries: merged, updatedAtISO: nowISO },
      },
      {
        path: backlinkOutboundPath(accountId, sourcePageId),
        data: { sourcePageId, accountId, targetPageIds: nextTargetIds, updatedAtISO: nowISO },
      },
    ]);
  }

  async removeFromSource(input: RemoveBacklinksFromSourceInput): Promise<void> {
    const { accountId, sourcePageId } = input;
    const outbound = await firestoreInfrastructureApi.get<Record<string, unknown>>(
      backlinkOutboundPath(accountId, sourcePageId),
    );
    const targetPageIds = Array.isArray(outbound?.targetPageIds)
      ? outbound.targetPageIds.filter((item): item is string => typeof item === "string")
      : [];

    const nowISO = new Date().toISOString();

    const writes: { path: string; data: Record<string, unknown> }[] = [];
    for (const targetPageId of targetPageIds) {
      const existing = await firestoreInfrastructureApi.get<Record<string, unknown>>(
        backlinkIndexPath(accountId, targetPageId),
      );
      if (!existing) continue;
      const entries = toEntries(existing.entries).filter((e) => e.sourcePageId !== sourcePageId);
      writes.push({
        path: backlinkIndexPath(accountId, targetPageId),
        data: {
          targetPageId,
          accountId,
          entries,
          updatedAtISO: nowISO,
        },
      });
    }
    writes.push({
      path: backlinkOutboundPath(accountId, sourcePageId),
      data: { sourcePageId, accountId, targetPageIds: [], updatedAtISO: nowISO },
    });
    await firestoreInfrastructureApi.setMany(writes);
  }

  async findByTargetPage(accountId: string, targetPageId: string): Promise<BacklinkIndex | null> {
    const d = await firestoreInfrastructureApi.get<Record<string, unknown>>(
      backlinkIndexPath(accountId, targetPageId),
    );
    if (!d) return null;
    const snapshot: BacklinkIndexSnapshot = {
      targetPageId,
      accountId,
      entries: toEntries(d.entries),
      updatedAtISO: typeof d.updatedAtISO === "string" ? d.updatedAtISO : "",
    };
    return BacklinkIndex.reconstitute(snapshot);
  }

  async listOutboundTargets(accountId: string, sourcePageId: string): Promise<ReadonlyArray<string>> {
    const d = await firestoreInfrastructureApi.get<Record<string, unknown>>(
      backlinkOutboundPath(accountId, sourcePageId),
    );
    if (!d) return [];
    return Array.isArray(d.targetPageIds) ? (d.targetPageIds as string[]) : [];
  }
}
