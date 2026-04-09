import type { TokenRefreshReason } from "../domain";
import { EmitTokenRefreshSignalUseCase } from "./use-cases/token-refresh.use-cases";
import {
	RegisterUseCase,
	SendPasswordResetEmailUseCase,
	SignInAnonymouslyUseCase,
	SignInUseCase,
} from "./use-cases/identity.use-cases";
import { FirebaseIdentityRepository } from "../adapters/firebase/FirebaseIdentityRepository";
import { FirebaseTokenRefreshRepository } from "../adapters/firebase/FirebaseTokenRefreshRepository";

export interface EmitTokenRefreshSignalInput {
	accountId: string;
	reason: TokenRefreshReason;
	traceId?: string;
}

const tokenRefreshRepo = new FirebaseTokenRefreshRepository();
const emitUseCase = new EmitTokenRefreshSignalUseCase(tokenRefreshRepo);

export const identityApi = {
	async emitTokenRefreshSignal(input: EmitTokenRefreshSignalInput): Promise<void> {
		await emitUseCase.execute(input.accountId, input.reason, input.traceId);
	},
} as const;

export function createClientAuthUseCases() {
	const repo = new FirebaseIdentityRepository();
	return {
		signInUseCase: new SignInUseCase(repo),
		signInAnonymouslyUseCase: new SignInAnonymouslyUseCase(repo),
		registerUseCase: new RegisterUseCase(repo),
		sendPasswordResetEmailUseCase: new SendPasswordResetEmailUseCase(repo),
	};
}
