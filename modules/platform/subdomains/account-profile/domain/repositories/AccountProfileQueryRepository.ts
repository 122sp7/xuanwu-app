import type { AccountProfile, AccountProfileId } from "../entities/AccountProfile";

export type Unsubscribe = () => void;

export interface AccountProfileQueryRepository {
  getAccountProfile(actorId: AccountProfileId): Promise<AccountProfile | null>;
  subscribeToAccountProfile(
    actorId: AccountProfileId,
    onUpdate: (profile: AccountProfile | null) => void,
  ): Unsubscribe;
}
