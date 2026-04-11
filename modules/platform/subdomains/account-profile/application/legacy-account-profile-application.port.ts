import type { getUserProfile, subscribeToUserProfile } from "../../account/api";

/**
 * Temporary compatibility port during migration from account profile concerns.
 */
export interface LegacyAccountProfileApplicationPort {
	getUserProfile: typeof getUserProfile;
	subscribeToUserProfile: typeof subscribeToUserProfile;
}
