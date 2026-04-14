export const IDENTITY_STATUSES = ["active", "suspended"] as const;
export type IdentityStatus = (typeof IDENTITY_STATUSES)[number];

export function canSuspend(status: IdentityStatus): boolean {
	return status === "active";
}

export function canReactivate(status: IdentityStatus): boolean {
	return status === "suspended";
}
