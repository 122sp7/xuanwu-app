/**
 * Entitlement — Value Object
 *
 * Describes which capability and usage quota a plan allows.
 * Entitlements are derived from planCode; they must not deviate from plan definition.
 *
 * Used by: SubscriptionAgreement aggregate, entitlement subdomain
 */

export const ENTITLEMENT_TYPES = ["capability", "quota", "feature_flag"] as const;
export type EntitlementType = (typeof ENTITLEMENT_TYPES)[number];

export interface Entitlement {
  readonly featureKey: string;
  readonly type: EntitlementType;
  readonly quota: number | null; // null = unlimited
  readonly isEnabled: boolean;
}

export function createEntitlement(input: {
  featureKey: string;
  type: EntitlementType;
  quota?: number | null;
  isEnabled?: boolean;
}): Entitlement {
  if (!input.featureKey || input.featureKey.trim().length === 0) {
    throw new Error("Entitlement featureKey must not be empty");
  }
  return {
    featureKey: input.featureKey.trim(),
    type: input.type,
    quota: input.quota ?? null,
    isEnabled: input.isEnabled ?? true,
  };
}

export function isUnlimited(entitlement: Entitlement): boolean {
  return entitlement.quota === null;
}
