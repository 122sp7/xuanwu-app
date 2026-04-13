/**
 * Module: notion/subdomains/knowledge
 * Layer: domain/repositories
 * Purpose: Port interface for BacklinkIndex read model persistence.
 */

import type { BacklinkIndex, BacklinkEntry } from "../aggregates/BacklinkIndex";

export interface UpsertBacklinkEntriesInput {
  readonly accountId: string;
  readonly targetPageId: string;
  readonly sourcePageId: string;
  readonly entries: ReadonlyArray<Omit<BacklinkEntry, "sourcePageId">>;
}

export interface RemoveBacklinksFromSourceInput {
  readonly accountId: string;
  readonly sourcePageId: string;
}

export interface BacklinkIndexRepository {
  upsertFromSource(input: UpsertBacklinkEntriesInput): Promise<void>;
  removeFromSource(input: RemoveBacklinksFromSourceInput): Promise<void>;
  findByTargetPage(accountId: string, targetPageId: string): Promise<BacklinkIndex | null>;
  listOutboundTargets(accountId: string, sourcePageId: string): Promise<ReadonlyArray<string>>;
}
