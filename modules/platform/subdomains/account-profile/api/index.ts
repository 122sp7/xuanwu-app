/**
 * Public API boundary for the account-profile subdomain.
 * Cross-module consumers must import through this entry point.
 *
 * Composition root lives in infrastructure/account-profile-service.ts;
 * this boundary is intentionally thin — it only re-exports public contracts.
 */

import {
	getAccountProfileFromService,
	subscribeToAccountProfileFromService,
	updateAccountProfileFromService,
	configureLegacyAccountProfileDataSource,
} from "../infrastructure";
import {
	getLegacyUserProfile,
	subscribeToLegacyUserProfile,
	updateLegacyUserProfile,
} from "../../account/api/legacy-account-profile.bridge";
import type { AccountProfile, Unsubscribe } from "../domain";
import type { UpdateAccountProfileInput } from "../application";
import type { CommandResult } from "@shared-types";

configureLegacyAccountProfileDataSource({
	getUserProfile: getLegacyUserProfile,
	subscribeToUserProfile: subscribeToLegacyUserProfile,
	updateUserProfile: updateLegacyUserProfile,
});

// ── Use-case delegators ──────────────────────────────────────────────────

export async function getAccountProfile(actorId: string): Promise<AccountProfile | null> {
	return getAccountProfileFromService(actorId);
}

export function subscribeToAccountProfile(
	actorId: string,
	onUpdate: (profile: AccountProfile | null) => void,
): Unsubscribe {
	return subscribeToAccountProfileFromService(actorId, onUpdate);
}

export async function updateAccountProfile(
	actorId: string,
	input: UpdateAccountProfileInput,
): Promise<CommandResult> {
	return updateAccountProfileFromService(actorId, input);
}

// Legacy compatibility exports for migration window.
export const getUserProfile = getAccountProfile;
export const subscribeToUserProfile = subscribeToAccountProfile;

export { getProfile, subscribeToProfile, updateProfile } from "../interfaces";

export * from "../application";
export * from "../domain";
export { SettingsProfileRouteScreen } from "../interfaces";
export type { LegacyAccountProfileDataSource } from "../infrastructure";
