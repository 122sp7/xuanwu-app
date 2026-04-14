/**
 * EntitlementGrantRepository — Write-side persistence port (CQRS).
 * Domain owns the contract; Infrastructure implements it.
 */
import type { EntitlementGrantSnapshot } from "../aggregates/EntitlementGrant";

export interface EntitlementGrantRepository {
  findById(id: string): Promise<EntitlementGrantSnapshot | null>;
  findByContextId(contextId: string): Promise<EntitlementGrantSnapshot[]>;
  findActiveByContextAndFeature(
    contextId: string,
    featureKey: string,
  ): Promise<EntitlementGrantSnapshot | null>;
  save(snapshot: EntitlementGrantSnapshot): Promise<void>;
  update(snapshot: EntitlementGrantSnapshot): Promise<void>;
}
