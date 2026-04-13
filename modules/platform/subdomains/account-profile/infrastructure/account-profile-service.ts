/**
 * AccountProfileService — Backward-compatibility re-export shim.
 *
 * Composition logic has been relocated to
 * interfaces/composition/account-profile-service.ts to fix the
 * infrastructure → application dependency direction violation.
 */

export {
	getAccountProfile,
	subscribeToAccountProfile,
	updateAccountProfile,
	configureLegacyAccountProfileDataSource,
} from "../interfaces/composition/account-profile-service";

