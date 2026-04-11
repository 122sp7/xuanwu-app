/**
 * Public API boundary for the account-profile subdomain.
 * Cross-module consumers must import through this entry point.
 */

import {
	getUserProfile as getLegacyUserProfile,
	subscribeToUserProfile as subscribeToLegacyUserProfile,
} from "../../account/api";
import {
	GetAccountProfileUseCase,
	SubscribeAccountProfileUseCase,
} from "../application";
import {
	createLegacyAccountProfileQueryRepository,
	type LegacyAccountProfileDataSource,
} from "../infrastructure";
import type { AccountProfile, Unsubscribe } from "../domain";

let _legacyDataSource: LegacyAccountProfileDataSource | undefined;
let _getAccountProfileUseCase: GetAccountProfileUseCase | undefined;
let _subscribeAccountProfileUseCase: SubscribeAccountProfileUseCase | undefined;

function getLegacyDataSource(): LegacyAccountProfileDataSource {
	if (_legacyDataSource) {
		return _legacyDataSource;
	}

	_legacyDataSource = {
		getUserProfile: getLegacyUserProfile,
		subscribeToUserProfile: subscribeToLegacyUserProfile,
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

export async function getAccountProfile(actorId: string): Promise<AccountProfile | null> {
	return getGetAccountProfileUseCase().execute(actorId);
}

export function subscribeToAccountProfile(
	actorId: string,
	onUpdate: (profile: AccountProfile | null) => void,
): Unsubscribe {
	return getSubscribeAccountProfileUseCase().execute(actorId, onUpdate);
}

// Legacy compatibility exports for migration window.
export const getUserProfile = getAccountProfile;
export const subscribeToUserProfile = subscribeToAccountProfile;

export * from "../application";
export * from "../domain";
export * from "../infrastructure";
export * from "../interfaces";
