import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { IdentityRepository } from "../../domain/repositories/IdentityRepository";
import type { SignInCredentials, RegistrationInput } from "../../domain/entities/Identity";

function toIdentityErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) return err.message;
  return fallback;
}

export class SignInUseCase {
  constructor(private readonly identityRepo: IdentityRepository) {}

  async execute(credentials: SignInCredentials): Promise<CommandResult> {
    try {
      const identity = await this.identityRepo.signInWithEmailAndPassword(credentials);
      return commandSuccess(identity.uid, 0);
    } catch (err) {
      return commandFailureFrom("SIGN_IN_FAILED", toIdentityErrorMessage(err, "Sign-in failed"));
    }
  }
}

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
