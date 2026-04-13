"use server";

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { updateAccountProfile } from "../composition/account-profile-service";
import type { UpdateAccountProfileInput } from "../../application/dto/account-profile.dto";

export async function updateProfile(
	actorId: string,
	input: UpdateAccountProfileInput,
): Promise<CommandResult> {
	try {
		return await updateAccountProfile(actorId, input);
	} catch (err) {
		return commandFailureFrom(
			"UPDATE_ACCOUNT_PROFILE_FAILED",
			err instanceof Error ? err.message : "Unexpected error",
		);
	}
}
