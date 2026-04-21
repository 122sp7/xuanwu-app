import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import { FeatureFlag, type CreateFeatureFlagInput } from "../../domain/entities/FeatureFlag";
import type { FeatureFlagRepository, FeatureFlagQuery } from "../../domain/repositories/FeatureFlagRepository";

export class CreateFeatureFlagUseCase {
  constructor(private readonly repo: FeatureFlagRepository) {}

  async execute(input: CreateFeatureFlagInput): Promise<CommandResult> {
    try {
      const existing = await this.repo.findByKey(input.key);
      if (existing) return commandFailureFrom("FLAG_ALREADY_EXISTS", `Flag "${input.key}" already exists`);
      const flag = FeatureFlag.create(input);
      await this.repo.save(flag.getSnapshot());
      return commandSuccess(flag.id, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "CREATE_FLAG_FAILED",
        err instanceof Error ? err.message : "Failed to create feature flag",
      );
    }
  }
}

export class ToggleFeatureFlagUseCase {
  constructor(private readonly repo: FeatureFlagRepository) {}

  async execute(key: string, enabled: boolean): Promise<CommandResult> {
    try {
      const snapshot = await this.repo.findByKey(key);
      if (!snapshot) return commandFailureFrom("FLAG_NOT_FOUND", `Flag "${key}" not found`);
      const flag = FeatureFlag.reconstitute(snapshot);
      if (enabled) flag.enable(); else flag.disable();
      await this.repo.save(flag.getSnapshot());
      return commandSuccess(key, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "TOGGLE_FLAG_FAILED",
        err instanceof Error ? err.message : "Failed to toggle feature flag",
      );
    }
  }
}

export class QueryFeatureFlagsUseCase {
  constructor(private readonly repo: FeatureFlagRepository) {}

  async execute(params: FeatureFlagQuery) {
    return this.repo.query(params);
  }
}

export class ResolveFeatureFlagUseCase {
  constructor(private readonly repo: FeatureFlagRepository) {}

  /** Returns true when the flag is enabled; false when not found or disabled. */
  async execute(key: string, hashValue = 0): Promise<boolean> {
    const snapshot = await this.repo.findByKey(key);
    if (!snapshot) return false;
    const flag = FeatureFlag.reconstitute(snapshot);
    return flag.isEnabledFor(hashValue);
  }
}
