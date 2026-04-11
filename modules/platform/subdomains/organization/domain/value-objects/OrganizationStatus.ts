export const ORGANIZATION_STATUSES = ["active", "suspended", "dissolved"] as const;
export type OrganizationStatus = (typeof ORGANIZATION_STATUSES)[number];

export function canSuspend(status: OrganizationStatus): boolean {
	return status === "active";
}

export function canDissolve(status: OrganizationStatus): boolean {
	return status !== "dissolved";
}

export function canReactivate(status: OrganizationStatus): boolean {
	return status === "suspended";
}
