/**
 * Module: knowledge
 * Layer: domain/entity
 * Purpose: BacklinkIndex — Read Model tracking which pages reference a given page.
 *
 * Firestore: accounts/{accountId}/backlinkIndex/{targetPageId}
 */

export interface BacklinkEntry {
  readonly sourcePageId: string;
  readonly sourcePageTitle: string;
  readonly blockId: string;
  readonly lastSeenAtISO: string;
}

export interface BacklinkIndex {
  readonly targetPageId: string;
  readonly accountId: string;
  readonly entries: ReadonlyArray<BacklinkEntry>;
  readonly updatedAtISO: string;
}
