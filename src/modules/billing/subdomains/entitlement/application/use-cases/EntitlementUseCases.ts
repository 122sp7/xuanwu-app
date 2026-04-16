import { v4 as uuid } from 'uuid';
import { commandSuccess, commandFailureFrom, type CommandResult } from '../../../../../shared';
import { EntitlementGrant } from '../../domain/entities/EntitlementGrant';
import type { EntitlementGrantRepository } from '../../domain/repositories/EntitlementGrantRepository';

export class GrantEntitlementUseCase {
  constructor(private readonly repo: EntitlementGrantRepository) {}

  async execute(input: {
    contextId: string;
    featureKey: string;
    quota?: number | null;
    expiresAt?: string | null;
  }): Promise<CommandResult> {
    try {
      const id = uuid();
      const grant = EntitlementGrant.create(id, input);
      await this.repo.save(grant.getSnapshot());
      return commandSuccess(id, Date.now());
    } catch (err) {
      return commandFailureFrom(
        'GRANT_ENTITLEMENT_FAILED',
        err instanceof Error ? err.message : 'Failed to grant entitlement',
      );
    }
  }
}

export class SuspendEntitlementUseCase {
  constructor(private readonly repo: EntitlementGrantRepository) {}

  async execute(entitlementId: string): Promise<CommandResult> {
    try {
      const snapshot = await this.repo.findById(entitlementId);
      if (!snapshot) {
        return commandFailureFrom('ENTITLEMENT_NOT_FOUND', `Entitlement ${entitlementId} not found`);
      }
      const grant = EntitlementGrant.reconstitute(snapshot);
      grant.suspend();
      await this.repo.update(grant.getSnapshot());
      return commandSuccess(entitlementId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        'SUSPEND_ENTITLEMENT_FAILED',
        err instanceof Error ? err.message : 'Failed to suspend entitlement',
      );
    }
  }
}

export class RevokeEntitlementUseCase {
  constructor(private readonly repo: EntitlementGrantRepository) {}

  async execute(entitlementId: string): Promise<CommandResult> {
    try {
      const snapshot = await this.repo.findById(entitlementId);
      if (!snapshot) {
        return commandFailureFrom('ENTITLEMENT_NOT_FOUND', `Entitlement ${entitlementId} not found`);
      }
      const grant = EntitlementGrant.reconstitute(snapshot);
      grant.revoke();
      await this.repo.update(grant.getSnapshot());
      return commandSuccess(entitlementId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        'REVOKE_ENTITLEMENT_FAILED',
        err instanceof Error ? err.message : 'Failed to revoke entitlement',
      );
    }
  }
}

export class ResolveEntitlementsUseCase {
  constructor(private readonly repo: EntitlementGrantRepository) {}

  async execute(contextId: string): Promise<CommandResult> {
    try {
      const snapshots = await this.repo.findByContextId(contextId);
      const active = snapshots.filter((s) => s.status === 'active');
      return commandSuccess(JSON.stringify(active), Date.now());
    } catch (err) {
      return commandFailureFrom(
        'RESOLVE_ENTITLEMENTS_FAILED',
        err instanceof Error ? err.message : 'Failed to resolve entitlements',
      );
    }
  }
}

export class CheckFeatureEntitlementUseCase {
  constructor(private readonly repo: EntitlementGrantRepository) {}

  async execute(contextId: string, featureKey: string): Promise<CommandResult> {
    try {
      const snapshot = await this.repo.findActiveByContextAndFeature(contextId, featureKey);
      return commandSuccess(JSON.stringify({ entitled: snapshot !== null, snapshot }), Date.now());
    } catch (err) {
      return commandFailureFrom(
        'CHECK_ENTITLEMENT_FAILED',
        err instanceof Error ? err.message : 'Failed to check entitlement',
      );
    }
  }
}
