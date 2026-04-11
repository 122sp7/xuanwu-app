import { getUserProfile, subscribeToUserProfile } from "../../account/api";
import type { LegacyAccountProfileApplicationPort } from "../application";

export function createLegacyAccountProfileApplicationAdapter(): LegacyAccountProfileApplicationPort {
	return {
		getUserProfile,
		subscribeToUserProfile,
	};
}
