import { getUserProfile, subscribeToUserProfile } from "../../account";

/**
 * Temporary compatibility port during migration from account profile concerns.
 */
export interface LegacyAccountProfileApplicationPort {
	getUserProfile: typeof getUserProfile;
	subscribeToUserProfile: typeof subscribeToUserProfile;
}
