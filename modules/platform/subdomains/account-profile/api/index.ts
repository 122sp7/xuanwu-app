/**
 * Public API boundary for the account-profile subdomain.
 * Cross-module consumers must import through this entry point.
 */

import {
	getLegacyUserProfile,
	subscribeToLegacyUserProfile,
	updateLegacyUserProfile,
} from "../../account/api/legacy-account-profile.bridge";
import {
	GetAccountProfileUseCase,
	SubscribeAccountProfileUseCase,
	UpdateAccountProfileUseCase,
} from "../application";
import {
	createLegacyAccountProfileCommandRepository,
	createLegacyAccountProfileQueryRepository,
	type LegacyAccountProfileDataSource,
} from "../infrastructure";
import type { AccountProfile, Unsubscribe } from "../domain";
import type { UpdateAccountProfileInput } from "../application";
import type { CommandResult } from "@shared-types";

let _legacyDataSource: LegacyAccountProfileDataSource | undefined;
let _getAccountProfileUseCase: GetAccountProfileUseCase | undefined;
let _subscribeAccountProfileUseCase: SubscribeAccountProfileUseCase | undefined;
let _updateAccountProfileUseCase: UpdateAccountProfileUseCase | undefined;

function getLegacyDataSource(): LegacyAccountProfileDataSource {
	if (_legacyDataSource) {
		return _legacyDataSource;
	}

	_legacyDataSource = {
		getUserProfile: getLegacyUserProfile,
		subscribeToUserProfile: subscribeToLegacyUserProfile,
		updateUserProfile: updateLegacyUserProfile,
	};
	return _legacyDataSource;
}

function getGetAccountProfileUseCase(): GetAccountProfileUseCase {
	if (_getAccountProfileUseCase) {
		return _getAccountProfileUseCase;
	}

	const repository = createLegacyAccountProfileQueryRepository(getLegacyDataSource());
	_getAccountProfileUseCase = new GetAccountProfileUseCase(repository);
	return _getAccountProfileUseCase;
}

function getSubscribeAccountProfileUseCase(): SubscribeAccountProfileUseCase {
	if (_subscribeAccountProfileUseCase) {
		return _subscribeAccountProfileUseCase;
	}

	const repository = createLegacyAccountProfileQueryRepository(getLegacyDataSource());
	_subscribeAccountProfileUseCase = new SubscribeAccountProfileUseCase(repository);
	return _subscribeAccountProfileUseCase;
}

function getUpdateAccountProfileUseCase(): UpdateAccountProfileUseCase {
	if (_updateAccountProfileUseCase) {
		return _updateAccountProfileUseCase;
	}

	const repository = createLegacyAccountProfileCommandRepository(getLegacyDataSource());
	_updateAccountProfileUseCase = new UpdateAccountProfileUseCase(repository);
	return _updateAccountProfileUseCase;
}

export async function getAccountProfile(actorId: string): Promise<AccountProfile | null> {
	return getGetAccountProfileUseCase().execute(actorId);
}

export function subscribeToAccountProfile(
	actorId: string,
	onUpdate: (profile: AccountProfile | null) => void,
): Unsubscribe {
	return getSubscribeAccountProfileUseCase().execute(actorId, onUpdate);
}

export async function updateAccountProfile(
	actorId: string,
	input: UpdateAccountProfileInput,
): Promise<CommandResult> {
	return getUpdateAccountProfileUseCase().execute(actorId, input);
}

// Legacy compatibility exports for migration window.
export const getUserProfile = getAccountProfile;
export const subscribeToUserProfile = subscribeToAccountProfile;

export { getProfile, subscribeToProfile, updateProfile } from "../interfaces";

export * from "../application";
export * from "../domain";
export * from "../infrastructure";
export * from "../interfaces";
