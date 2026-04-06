/**
 * Module: knowledge
 * Layer: domain/repositories
 * Purpose: Port interface for the BacklinkIndex read model.
 */

import type { BacklinkIndex, BacklinkEntry } from "../entities/backlink-index.entity";

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

export interface IBacklinkIndexRepository {
  upsertFromSource(input: UpsertBacklinkEntriesInput): Promise<void>;
  removeFromSource(input: RemoveBacklinksFromSourceInput): Promise<void>;
  findByTargetPage(accountId: string, targetPageId: string): Promise<BacklinkIndex | null>;
  listOutboundTargets(accountId: string, sourcePageId: string): Promise<ReadonlyArray<string>>;
}
