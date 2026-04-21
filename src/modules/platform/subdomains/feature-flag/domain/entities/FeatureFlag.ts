/**
 * FeatureFlag — domain entity for controlled feature release.
 *
 * Owned by platform/feature-flag subdomain.
 * Flags gate features per organization, workspace, or actor, enabling
 * incremental rollout without a code deploy.
 */
import { v4 as uuid } from "uuid";

export type FlagScope = "global" | "organization" | "workspace" | "actor";

export interface FeatureFlagSnapshot {
  readonly id: string;
  readonly key: string;
  readonly enabled: boolean;
  readonly scope: FlagScope;
  /** Fraction 0–100; only evaluated when enabled=true and scope needs rollout. */
  readonly rolloutPercentage: number;
  readonly description?: string;
  readonly organizationId?: string;
  readonly workspaceId?: string;
  readonly actorId?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface CreateFeatureFlagInput {
  readonly key: string;
  readonly enabled?: boolean;
  readonly scope?: FlagScope;
  readonly rolloutPercentage?: number;
  readonly description?: string;
  readonly organizationId?: string;
  readonly workspaceId?: string;
  readonly actorId?: string;
}

export class FeatureFlag {
  private constructor(private _props: FeatureFlagSnapshot) {}

  static create(input: CreateFeatureFlagInput): FeatureFlag {
    if (!input.key.trim()) throw new Error("FeatureFlag key cannot be empty");
    const rollout = input.rolloutPercentage ?? 100;
    if (rollout < 0 || rollout > 100) throw new Error("rolloutPercentage must be 0–100");
    const now = new Date().toISOString();
    return new FeatureFlag({
      id: uuid(),
      key: input.key.trim().toLowerCase(),
      enabled: input.enabled ?? false,
      scope: input.scope ?? "global",
      rolloutPercentage: rollout,
      description: input.description,
      organizationId: input.organizationId,
      workspaceId: input.workspaceId,
      actorId: input.actorId,
      createdAtISO: now,
      updatedAtISO: now,
    });
  }

  static reconstitute(snapshot: FeatureFlagSnapshot): FeatureFlag {
    return new FeatureFlag(snapshot);
  }

  enable(): void {
    this._props = { ...this._props, enabled: true, updatedAtISO: new Date().toISOString() };
  }

  disable(): void {
    this._props = { ...this._props, enabled: false, updatedAtISO: new Date().toISOString() };
  }

  setRollout(percentage: number): void {
    if (percentage < 0 || percentage > 100) throw new Error("rolloutPercentage must be 0–100");
    this._props = { ...this._props, rolloutPercentage: percentage, updatedAtISO: new Date().toISOString() };
  }

  /** Returns true when the flag is enabled and the given hash falls within rollout. */
  isEnabledFor(hashValue: number): boolean {
    if (!this._props.enabled) return false;
    return (hashValue % 100) < this._props.rolloutPercentage;
  }

  get id(): string { return this._props.id; }
  get key(): string { return this._props.key; }
  get enabled(): boolean { return this._props.enabled; }
  get rolloutPercentage(): number { return this._props.rolloutPercentage; }
  get scope(): FlagScope { return this._props.scope; }

  getSnapshot(): Readonly<FeatureFlagSnapshot> {
    return Object.freeze({ ...this._props });
  }
}
