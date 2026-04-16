import type { CommandResult } from '../../../../../../shared';
import {
  GrantEntitlementUseCase,
  SuspendEntitlementUseCase,
  RevokeEntitlementUseCase,
  CheckFeatureEntitlementUseCase,
} from '../../../application/use-cases/EntitlementUseCases';
import type { EntitlementGrantRepository } from '../../../domain/repositories/EntitlementGrantRepository';

export class EntitlementController {
  private readonly grantUseCase: GrantEntitlementUseCase;
  private readonly suspendUseCase: SuspendEntitlementUseCase;
  private readonly revokeUseCase: RevokeEntitlementUseCase;
  private readonly checkUseCase: CheckFeatureEntitlementUseCase;

  constructor(repo: EntitlementGrantRepository) {
    this.grantUseCase = new GrantEntitlementUseCase(repo);
    this.suspendUseCase = new SuspendEntitlementUseCase(repo);
    this.revokeUseCase = new RevokeEntitlementUseCase(repo);
    this.checkUseCase = new CheckFeatureEntitlementUseCase(repo);
  }

  async handleGrant(body: {
    contextId: string;
    featureKey: string;
    quota?: number | null;
    expiresAt?: string | null;
  }): Promise<CommandResult> {
    return this.grantUseCase.execute(body);
  }

  async handleSuspend(entitlementId: string): Promise<CommandResult> {
    return this.suspendUseCase.execute(entitlementId);
  }

  async handleRevoke(entitlementId: string): Promise<CommandResult> {
    return this.revokeUseCase.execute(entitlementId);
  }

  async handleCheck(contextId: string, featureKey: string): Promise<CommandResult> {
    return this.checkUseCase.execute(contextId, featureKey);
  }
}
