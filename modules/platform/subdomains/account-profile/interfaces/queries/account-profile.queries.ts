/**
 * Account Profile Read Queries — thin wrappers over account-profile API use cases.
 * NOT Server Actions — callable from React components/hooks directly.
 */

import { getAccountProfile, subscribeToAccountProfile } from "../../api";
import type {
  AccountProfile,
  Unsubscribe,
} from "../../application/dto/account-profile.dto";

export async function getProfile(actorId: string): Promise<AccountProfile | null> {
  return getAccountProfile(actorId);
}

export function subscribeToProfile(
  actorId: string,
  onUpdate: (profile: AccountProfile | null) => void,
): Unsubscribe {
  return subscribeToAccountProfile(actorId, onUpdate);
}
