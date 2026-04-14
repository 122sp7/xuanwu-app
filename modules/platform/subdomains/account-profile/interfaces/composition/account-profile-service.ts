/**
 * AccountProfileService — Composition root for account-profile subdomain.
 *
 * Relocated from infrastructure/ to interfaces/composition/ to fix
 * the infrastructure → application dependency direction violation (HX-1-001).
 *
 * Wires the legacy account data-source (from the account subdomain bridge)
 * into domain-port-conforming adapters and use cases.
 */

import {
	GetAccountProfileUseCase,
	SubscribeAccountProfileUseCase,
	UpdateAccountProfileUseCase,
} from "../../application";
import {
	createLegacyAccountProfileCommandRepository,
	createLegacyAccountProfileQueryRepository,
	type LegacyAccountProfileDataSource,
} from "../../infrastructure/create-legacy-account-profile-application.adapter";
import type { AccountProfile, Unsubscribe } from "../../domain";
import type { UpdateAccountProfileInput } from "../../application";
import type { CommandResult } from "@shared-types";

// ── Lazy singletons ──────────────────────────────────────────────────────

let _legacyDataSource: LegacyAccountProfileDataSource | undefined;
let _getAccountProfileUseCase: GetAccountProfileUseCase | undefined;
let _subscribeAccountProfileUseCase: SubscribeAccountProfileUseCase | undefined;
let _updateAccountProfileUseCase: UpdateAccountProfileUseCase | undefined;

export function configureLegacyAccountProfileDataSource(
	legacyDataSource: LegacyAccountProfileDataSource,
): void {
	_legacyDataSource = legacyDataSource;
	_getAccountProfileUseCase = undefined;
	_subscribeAccountProfileUseCase = undefined;
	_updateAccountProfileUseCase = undefined;
}

function getLegacyDataSource(): LegacyAccountProfileDataSource {
	if (!_legacyDataSource) {
		// TODO(ADR-1300): This require() breaks a circular dependency — Chain D:
		//   account-profile/interfaces/composition/account-profile-service
		//   → account/api/legacy-account-profile.bridge → account/api
		//   → account/interfaces → account-profile (via profile-completion wiring).
		//
		// The lazy require() is intentional and must remain until the legacy bridge
		// is replaced by a proper DI-injected adapter (see ADR-1300).
		// Auto-configure: lazy-require from sibling subdomain bridge to avoid
		// import-time side effects in the account-profile api boundary.
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const bridge = require("../../../account/api/legacy-account-profile.bridge") as {
			getLegacyUserProfile?: LegacyAccountProfileDataSource["getUserProfile"];
			subscribeToLegacyUserProfile?: LegacyAccountProfileDataSource["subscribeToUserProfile"];
			updateLegacyUserProfile?: LegacyAccountProfileDataSource["updateUserProfile"];
		};
		if (
			typeof bridge.getLegacyUserProfile !== "function" ||
			typeof bridge.subscribeToLegacyUserProfile !== "function" ||
			typeof bridge.updateLegacyUserProfile !== "function"
		) {
			throw new Error(
				"account/api/legacy-account-profile.bridge missing required exports",
			);
		}
		_legacyDataSource = {
			getUserProfile: bridge.getLegacyUserProfile,
			subscribeToUserProfile: bridge.subscribeToLegacyUserProfile,
			updateUserProfile: bridge.updateLegacyUserProfile,
		};
	}
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

// ── Public service API ───────────────────────────────────────────────────

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
