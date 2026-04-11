import { type UpdateProfileInput } from "../application/dto/account.dto";
import { accountService, createAccountQueryRepository } from "../infrastructure/account-service";
import type { AccountQueryRepository } from "../domain/repositories/AccountQueryRepository";

let _accountQueryRepo: AccountQueryRepository | undefined;

function getAccountQueryRepo(): AccountQueryRepository {
  if (!_accountQueryRepo) {
    _accountQueryRepo = createAccountQueryRepository();
  }
  return _accountQueryRepo;
}

export async function getLegacyUserProfile(userId: string) {
  return getAccountQueryRepo().getUserProfile(userId);
}

export function subscribeToLegacyUserProfile(
  userId: string,
  onUpdate: (profile: Awaited<ReturnType<typeof getLegacyUserProfile>>) => void,
) {
  return getAccountQueryRepo().subscribeToUserProfile(userId, onUpdate);
}

export async function updateLegacyUserProfile(userId: string, input: UpdateProfileInput): Promise<void> {
  await accountService.updateUserProfile(userId, input);
}
