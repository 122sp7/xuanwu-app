export const ENTITLEMENT_STATUSES = ['active', 'suspended', 'expired', 'revoked'] as const;
export type EntitlementStatus = (typeof ENTITLEMENT_STATUSES)[number];

export function canSuspend(status: EntitlementStatus): boolean {
  return status === 'active';
}

export function canRevoke(status: EntitlementStatus): boolean {
  return status !== 'revoked';
}

export function isActiveStatus(status: EntitlementStatus): boolean {
  return status === 'active';
}
