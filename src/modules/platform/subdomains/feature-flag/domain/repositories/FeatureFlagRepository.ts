import type { FeatureFlagSnapshot, FlagScope } from "../entities/FeatureFlag";

export interface FeatureFlagQuery {
  readonly key?: string;
  readonly scope?: FlagScope;
  readonly organizationId?: string;
  readonly workspaceId?: string;
  readonly actorId?: string;
  readonly enabledOnly?: boolean;
}

export interface FeatureFlagRepository {
  save(snapshot: FeatureFlagSnapshot): Promise<void>;
  findByKey(key: string): Promise<FeatureFlagSnapshot | null>;
  query(params: FeatureFlagQuery): Promise<FeatureFlagSnapshot[]>;
  delete(id: string): Promise<void>;
}
