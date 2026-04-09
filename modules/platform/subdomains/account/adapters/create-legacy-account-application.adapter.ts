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
import type { LegacyAccountApplicationPort } from "../application";

export function createLegacyAccountApplicationAdapter(): LegacyAccountApplicationPort {
	return {
		createClientAccountUseCases,
		getUserProfile,
		subscribeToUserProfile,
		subscribeToAccountsForUser,
		getAccountRole,
		subscribeToAccountRoles,
		getAccountPolicies,
		getActiveAccountPolicies,
	};
}
