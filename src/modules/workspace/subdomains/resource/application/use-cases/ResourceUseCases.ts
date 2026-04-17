import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { ResourceQuotaRepository } from "../../domain/repositories/ResourceQuotaRepository";
import { ResourceQuota } from "../../domain/entities/ResourceQuota";
import type { ProvisionResourceQuotaInput, ResourceKind } from "../../domain/entities/ResourceQuota";

export class ProvisionResourceQuotaUseCase {
  constructor(private readonly quotaRepo: ResourceQuotaRepository) {}

  async execute(input: ProvisionResourceQuotaInput): Promise<CommandResult> {
    try {
      const quota = ResourceQuota.provision(uuid(), input);
      await this.quotaRepo.save(quota.getSnapshot());
      return commandSuccess(quota.id, Date.now());
    } catch (err) {
      return commandFailureFrom("RESOURCE_PROVISION_FAILED", err instanceof Error ? err.message : "Failed to provision quota.");
    }
  }
}

export class ConsumeResourceQuotaUseCase {
  constructor(private readonly quotaRepo: ResourceQuotaRepository) {}

  async execute(workspaceId: string, resourceKind: ResourceKind, amount: number): Promise<CommandResult> {
    try {
      const snapshot = await this.quotaRepo.findByWorkspaceAndKind(workspaceId, resourceKind);
      if (!snapshot) return commandFailureFrom("RESOURCE_QUOTA_NOT_FOUND", "Quota not found.");
      const quota = ResourceQuota.reconstitute(snapshot);
      quota.consume(amount);
      await this.quotaRepo.updateUsage(snapshot.id, quota.current, new Date().toISOString());
      return commandSuccess(snapshot.id, Date.now());
    } catch (err) {
      return commandFailureFrom("RESOURCE_CONSUME_FAILED", err instanceof Error ? err.message : "Failed to consume quota.");
    }
  }
}
