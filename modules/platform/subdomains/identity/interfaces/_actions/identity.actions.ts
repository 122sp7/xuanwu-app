"use server";

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { toIdentityErrorMessage } from "../../application/identity-error-message";
import {
	RegisterUseCase,
	SendPasswordResetEmailUseCase,
	SignInAnonymouslyUseCase,
	SignInUseCase,
	SignOutUseCase,
} from "../../application/use-cases/identity.use-cases";
import { createIdentityRepository } from "../../api";

let _identityRepo: ReturnType<typeof createIdentityRepository> | undefined;

function getRepo(): ReturnType<typeof createIdentityRepository> {
	if (!_identityRepo) _identityRepo = createIdentityRepository();
	return _identityRepo;
}

export async function signIn(email: string, password: string): Promise<CommandResult> {
	try {
		return await new SignInUseCase(getRepo()).execute({ email, password });
	} catch (err) {
		return commandFailureFrom("SIGN_IN_FAILED", toIdentityErrorMessage(err, "Unexpected error"));
	}
}

export async function signInAnonymously(): Promise<CommandResult> {
	try {
		return await new SignInAnonymouslyUseCase(getRepo()).execute();
	} catch (err) {
		return commandFailureFrom(
			"SIGN_IN_ANONYMOUS_FAILED",
			toIdentityErrorMessage(err, "Unexpected error"),
		);
	}
}

export async function register(email: string, password: string, name: string): Promise<CommandResult> {
	try {
		return await new RegisterUseCase(getRepo()).execute({ email, password, name });
	} catch (err) {
		return commandFailureFrom("REGISTRATION_FAILED", toIdentityErrorMessage(err, "Unexpected error"));
	}
}

export async function sendPasswordResetEmail(email: string): Promise<CommandResult> {
	try {
		return await new SendPasswordResetEmailUseCase(getRepo()).execute(email);
	} catch (err) {
		return commandFailureFrom("PASSWORD_RESET_FAILED", toIdentityErrorMessage(err, "Unexpected error"));
	}
}

export async function signOut(): Promise<CommandResult> {
	try {
		return await new SignOutUseCase(getRepo()).execute();
	} catch (err) {
		return commandFailureFrom("SIGN_OUT_FAILED", toIdentityErrorMessage(err, "Unexpected error"));
	}
}
