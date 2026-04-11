import type {
	AccountProfileId,
	UpdateAccountProfileInput,
} from "../entities/AccountProfile";

export interface AccountProfileCommandRepository {
	updateAccountProfile(
		actorId: AccountProfileId,
		input: UpdateAccountProfileInput,
	): Promise<void>;
}
