/**
 * Module: notion/subdomains/knowledge
 * Layer: domain/aggregates
 * Purpose: BacklinkIndex — read model tracking which pages reference a given page.
 */

export interface BacklinkEntry {
  readonly sourcePageId: string;
  readonly sourcePageTitle: string;
  readonly blockId: string;
  readonly lastSeenAtISO: string;
}

export interface BacklinkIndexSnapshot {
  readonly targetPageId: string;
  readonly accountId: string;
  readonly entries: ReadonlyArray<BacklinkEntry>;
  readonly updatedAtISO: string;
}

export class BacklinkIndex {
  private constructor(private readonly _props: BacklinkIndexSnapshot) {}

  static reconstitute(snapshot: BacklinkIndexSnapshot): BacklinkIndex {
    return new BacklinkIndex({ ...snapshot });
  }

  get targetPageId(): string { return this._props.targetPageId; }
  get accountId(): string { return this._props.accountId; }
  get entries(): ReadonlyArray<BacklinkEntry> { return this._props.entries; }
  get updatedAtISO(): string { return this._props.updatedAtISO; }

  getSnapshot(): Readonly<BacklinkIndexSnapshot> {
    return Object.freeze({ ...this._props });
  }
}
