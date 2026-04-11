import { type UpdateProfileInput } from "../application/dto/account.dto";
import { accountService, FirebaseAccountQueryRepository } from "../infrastructure/account-service";

let _accountQueryRepo: FirebaseAccountQueryRepository | undefined;

function getAccountQueryRepo(): FirebaseAccountQueryRepository {
  if (!_accountQueryRepo) {
    _accountQueryRepo = new FirebaseAccountQueryRepository();
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
