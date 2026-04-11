import {
  createAccountProfileId,
  type AccountProfile,
} from "../../domain/entities/AccountProfile";
import type {
  AccountProfileQueryRepository,
  Unsubscribe,
} from "../../domain/repositories/AccountProfileQueryRepository";

/**
 * Use Case Contract: GetAccountProfile
 * Actor: Authenticated Actor
 * Goal: Read the profile state of the target actor for UI rendering.
 * Main Success Scenario:
 * 1. Validate actor identity input.
 * 2. Load profile from query repository.
 * 3. Return profile snapshot or null when not found.
 * Failure Branches:
 * - Invalid actor id -> schema validation error.
 * - Repository failure -> upstream infrastructure error.
 */
export class GetAccountProfileUseCase {
  constructor(
    private readonly accountProfileQueryRepository: AccountProfileQueryRepository,
  ) {}

  async execute(actorId: string): Promise<AccountProfile | null> {
    const profileId = createAccountProfileId(actorId);
    return this.accountProfileQueryRepository.getAccountProfile(profileId);
  }
}

/**
 * Use Case Contract: SubscribeAccountProfile
 * Actor: Authenticated Actor / UI session
 * Goal: Observe profile updates reactively.
 */
export class SubscribeAccountProfileUseCase {
  constructor(
    private readonly accountProfileQueryRepository: AccountProfileQueryRepository,
  ) {}

  execute(
    actorId: string,
    onUpdate: (profile: AccountProfile | null) => void,
  ): Unsubscribe {
    const profileId = createAccountProfileId(actorId);
    return this.accountProfileQueryRepository.subscribeToAccountProfile(profileId, onUpdate);
  }
}
