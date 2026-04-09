import { getUserProfile, subscribeToUserProfile } from "../../account";
import type { LegacyAccountProfileApplicationPort } from "../application";

export function createLegacyAccountProfileApplicationAdapter(): LegacyAccountProfileApplicationPort {
	return {
		getUserProfile,
		subscribeToUserProfile,
	};
}
