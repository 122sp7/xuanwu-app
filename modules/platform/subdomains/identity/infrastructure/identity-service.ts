/**
 * identity-service.ts — Adapter-layer composition root.
 *
 * Wires Firebase-backed repositories into identity use cases.
 * Lives in adapters/ because it instantiates infrastructure adapters.
 * Dependency direction: adapters/ -> application/ -> domain/ (correct, no violation).
 */

import type { TokenRefreshReason } from "../domain";
import type { IdentityRepository } from "../domain/repositories/IdentityRepository";
import type { TokenRefreshRepository } from "../domain/repositories/TokenRefreshRepository";
import { EmitTokenRefreshSignalUseCase } from "../application/use-cases/token-refresh.use-cases";
import {
	RegisterUseCase,
	SendPasswordResetEmailUseCase,
	SignInAnonymouslyUseCase,
	SignInUseCase,
} from "../application/use-cases/identity.use-cases";
import { FirebaseIdentityRepository } from "./firebase/FirebaseIdentityRepository";
import { FirebaseTokenRefreshRepository } from "./firebase/FirebaseTokenRefreshRepository";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface EmitTokenRefreshSignalInput {
	accountId: string;
	reason: TokenRefreshReason;
	traceId?: string;
}

// ─── Server-side token refresh signal emitter ─────────────────────────────────

let _tokenRefreshRepo: FirebaseTokenRefreshRepository | undefined;
let _emitUseCase: EmitTokenRefreshSignalUseCase | undefined;

function getEmitUseCase(): EmitTokenRefreshSignalUseCase {
	if (!_emitUseCase) {
		if (!_tokenRefreshRepo) _tokenRefreshRepo = new FirebaseTokenRefreshRepository();
		_emitUseCase = new EmitTokenRefreshSignalUseCase(_tokenRefreshRepo);
	}
	return _emitUseCase;
}

/**
 * identityApi — server-side operations for identity management.
 * Intended for use in Server Actions and server-side code paths.
 */
export const identityApi = {
	async emitTokenRefreshSignal(input: EmitTokenRefreshSignalInput): Promise<void> {
		await getEmitUseCase().execute(input.accountId, input.reason, input.traceId);
	},
} as const;

// ─── Repository factories ─────────────────────────────────────────────────────

/** Returns an IdentityRepository backed by Firebase. */
export function createIdentityRepository(): IdentityRepository {
	return new FirebaseIdentityRepository();
}

/** Returns a TokenRefreshRepository backed by Firebase. */
export function createTokenRefreshRepository(): TokenRefreshRepository {
	return new FirebaseTokenRefreshRepository();
}

// ─── Client-side use-case factory ─────────────────────────────────────────────

/**
 * createClientAuthUseCases — creates Firebase-wired client-side auth use cases.
 * Each call returns fresh use-case instances sharing one repository instance.
 * Use only in "use client" components or client-side hooks.
 */
export function createClientAuthUseCases() {
	const repo = new FirebaseIdentityRepository();
	return {
		signInUseCase: new SignInUseCase(repo),
		signInAnonymouslyUseCase: new SignInAnonymouslyUseCase(repo),
		registerUseCase: new RegisterUseCase(repo),
		sendPasswordResetEmailUseCase: new SendPasswordResetEmailUseCase(repo),
	};
}
