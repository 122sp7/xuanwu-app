export const ACCOUNT_STATUSES = ["active", "suspended", "closed"] as const;
export type AccountStatus = (typeof ACCOUNT_STATUSES)[number];

export function canSuspend(status: AccountStatus): boolean {
	return status === "active";
}

export function canClose(status: AccountStatus): boolean {
	return status !== "closed";
}

export function canReactivate(status: AccountStatus): boolean {
	return status === "suspended";
}
