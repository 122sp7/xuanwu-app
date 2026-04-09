import {
	createClientAccountUseCases,
	getActiveAccountPolicies,
	getAccountPolicies,
	getAccountRole,
	getUserProfile,
	subscribeToAccountRoles,
	subscribeToAccountsForUser,
	subscribeToUserProfile,
} from "@/modules/account/api";

/**
 * Temporary compatibility port during migration from modules/account.
 */
export interface LegacyAccountApplicationPort {
	createClientAccountUseCases: typeof createClientAccountUseCases;
	getUserProfile: typeof getUserProfile;
	subscribeToUserProfile: typeof subscribeToUserProfile;
	subscribeToAccountsForUser: typeof subscribeToAccountsForUser;
	getAccountRole: typeof getAccountRole;
	subscribeToAccountRoles: typeof subscribeToAccountRoles;
	getAccountPolicies: typeof getAccountPolicies;
	getActiveAccountPolicies: typeof getActiveAccountPolicies;
}
