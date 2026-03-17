/**
 * Identity Use Cases — pure business workflows.
 * No React, no Firebase SDK, no UI framework.
 * Depends only on the IdentityRepository port.
 */

import { commandSuccess, commandFailureFrom, type CommandResult } from "@/shared/types";
import type { IdentityRepository } from "../../domain/repositories/IdentityRepository";
import type { SignInCredentials, RegistrationInput } from "../../domain/entities/Identity";
import { toIdentityErrorMessage } from "../identity-error-message";

// ─── Sign In ──────────────────────────────────────────────────────────────────

export class SignInUseCase {
  constructor(private readonly identityRepo: IdentityRepository) {}

  async execute(credentials: SignInCredentials): Promise<CommandResult> {
    try {
      const identity = await this.identityRepo.signInWithEmailAndPassword(credentials);
      return commandSuccess(identity.uid, 0);
    } catch (err) {
      return commandFailureFrom(
        "SIGN_IN_FAILED",
        toIdentityErrorMessage(err, "Sign-in failed"),
      );
    }
  }
}

// ─── Anonymous Sign In ────────────────────────────────────────────────────────

export class SignInAnonymouslyUseCase {
  constructor(private readonly identityRepo: IdentityRepository) {}

  async execute(): Promise<CommandResult> {
    try {
      const identity = await this.identityRepo.signInAnonymously();
      return commandSuccess(identity.uid, 0);
    } catch (err) {
      return commandFailureFrom(
        "SIGN_IN_ANONYMOUS_FAILED",
        toIdentityErrorMessage(err, "Anonymous sign-in failed"),
      );
    }
  }
}

// ─── Register ─────────────────────────────────────────────────────────────────

export class RegisterUseCase {
  constructor(private readonly identityRepo: IdentityRepository) {}

  async execute(input: RegistrationInput): Promise<CommandResult> {
    try {
      const identity = await this.identityRepo.createUserWithEmailAndPassword(input);
      await this.identityRepo.updateDisplayName(identity.uid, input.name);
      return commandSuccess(identity.uid, 0);
    } catch (err) {
      return commandFailureFrom(
        "REGISTRATION_FAILED",
        toIdentityErrorMessage(err, "Registration failed"),
      );
    }
  }
}

// ─── Password Reset ───────────────────────────────────────────────────────────

export class SendPasswordResetEmailUseCase {
  constructor(private readonly identityRepo: IdentityRepository) {}

  async execute(email: string): Promise<CommandResult> {
    try {
      await this.identityRepo.sendPasswordResetEmail(email);
      return commandSuccess(email, 0);
    } catch (err) {
      return commandFailureFrom(
        "PASSWORD_RESET_FAILED",
        toIdentityErrorMessage(err, "Password reset failed"),
      );
    }
  }
}

// ─── Sign Out ─────────────────────────────────────────────────────────────────

export class SignOutUseCase {
  constructor(private readonly identityRepo: IdentityRepository) {}

  async execute(): Promise<CommandResult> {
    const currentUser = this.identityRepo.getCurrentUser();
    const aggregateId = currentUser?.uid ?? "anonymous";
    try {
      await this.identityRepo.signOut();
      return commandSuccess(aggregateId, 0);
    } catch (err) {
      return commandFailureFrom(
        "SIGN_OUT_FAILED",
        toIdentityErrorMessage(err, "Sign-out failed"),
      );
    }
  }
}
