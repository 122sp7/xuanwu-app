import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import {
	createAccountProfileId,
	createUpdateAccountProfileInput,
	type UpdateAccountProfileInput,
} from "../../domain/entities/AccountProfile";
import type { AccountProfileCommandRepository } from "../../domain/repositories/AccountProfileCommandRepository";

/**
 * Use Case Contract: UpdateAccountProfile
 * Actor: Authenticated Actor
 * Goal: Update account profile fields (name/bio/photo/theme).
 * Main Success Scenario:
 * 1. Validate actor identity input.
 * 2. Validate update payload.
 * 3. Persist profile updates via command repository.
 * 4. Return command success.
 * Failure Branches:
 * - Invalid actor id or payload -> validation error.
 * - Repository failure -> command failure.
 */
export class UpdateAccountProfileUseCase {
	constructor(
		private readonly accountProfileCommandRepository: AccountProfileCommandRepository,
	) {}

	async execute(actorId: string, input: UpdateAccountProfileInput): Promise<CommandResult> {
		try {
			const profileId = createAccountProfileId(actorId);
			const validatedInput = createUpdateAccountProfileInput(input);
			await this.accountProfileCommandRepository.updateAccountProfile(profileId, validatedInput);
			return commandSuccess(profileId, Date.now());
		} catch (err) {
			return commandFailureFrom(
				"UPDATE_ACCOUNT_PROFILE_FAILED",
				err instanceof Error ? err.message : "Failed to update account profile",
			);
		}
	}
}
