"use server";

/**
 * Identity Server Actions — thin adapter: Next.js Server Actions → Application Use Cases.
 * Responsibilities: call use cases, NO business logic.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import {
  SignInUseCase,
  SignInAnonymouslyUseCase,
  RegisterUseCase,
  SendPasswordResetEmailUseCase,
  SignOutUseCase,
} from "../../application/use-cases/identity.use-cases";
import { toIdentityErrorMessage } from "../../application/identity-error-message";
import { FirebaseIdentityRepository } from "../../infrastructure/firebase/FirebaseIdentityRepository";

const identityRepo = new FirebaseIdentityRepository();

export async function signIn(email: string, password: string): Promise<CommandResult> {
  try {
    return await new SignInUseCase(identityRepo).execute({ email, password });
  } catch (err) {
    return commandFailureFrom("SIGN_IN_FAILED", toIdentityErrorMessage(err, "Unexpected error"));
  }
}

export async function signInAnonymously(): Promise<CommandResult> {
  try {
    return await new SignInAnonymouslyUseCase(identityRepo).execute();
  } catch (err) {
    return commandFailureFrom("SIGN_IN_ANONYMOUS_FAILED", toIdentityErrorMessage(err, "Unexpected error"));
  }
}

export async function register(
  email: string,
  password: string,
  name: string,
): Promise<CommandResult> {
  try {
    return await new RegisterUseCase(identityRepo).execute({ email, password, name });
  } catch (err) {
    return commandFailureFrom("REGISTRATION_FAILED", toIdentityErrorMessage(err, "Unexpected error"));
  }
}

export async function sendPasswordResetEmail(email: string): Promise<CommandResult> {
  try {
    return await new SendPasswordResetEmailUseCase(identityRepo).execute(email);
  } catch (err) {
    return commandFailureFrom("PASSWORD_RESET_FAILED", toIdentityErrorMessage(err, "Unexpected error"));
  }
}

export async function signOut(): Promise<CommandResult> {
  try {
    return await new SignOutUseCase(identityRepo).execute();
  } catch (err) {
    return commandFailureFrom("SIGN_OUT_FAILED", toIdentityErrorMessage(err, "Unexpected error"));
  }
}
