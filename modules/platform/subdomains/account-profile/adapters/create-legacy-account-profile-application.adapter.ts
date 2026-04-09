import { getUserProfile, subscribeToUserProfile } from "@/modules/account/api";
import type { LegacyAccountProfileApplicationPort } from "../application";

export function createLegacyAccountProfileApplicationAdapter(): LegacyAccountProfileApplicationPort {
	return {
		getUserProfile,
		subscribeToUserProfile,
	};
}
