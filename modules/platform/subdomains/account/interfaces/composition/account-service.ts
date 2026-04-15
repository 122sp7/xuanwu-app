/**
 * AccountService — Composition root for account use cases.
 *
 * Relocated from infrastructure/ to interfaces/composition/ to fix
 * the infrastructure → application dependency direction violation (HX-1-001).
 * Wires repositories and ports; provides a unified service interface.
 */

import {
  CreateUserAccountUseCase,
  UpdateUserProfileUseCase,
  CreditWalletUseCase,
  DebitWalletUseCase,
  AssignAccountRoleUseCase,
  RevokeAccountRoleUseCase,
  GetAccountProfileUseCase,
  SubscribeAccountProfileUseCase,
  UpdateAccountProfileUseCase,
} from "../../application/use-cases/account.use-cases";
import {
  CreateAccountPolicyUseCase,
  UpdateAccountPolicyUseCase,
  DeleteAccountPolicyUseCase,
} from "../../application/use-cases/account-policy.use-cases";
import { FirebaseAccountRepository } from "../../infrastructure/firebase/FirebaseAccountRepository";
import { FirebaseAccountQueryRepository } from "../../infrastructure/firebase/FirebaseAccountQueryRepository";
import { FirebaseAccountPolicyRepository } from "../../infrastructure/firebase/FirebaseAccountPolicyRepository";
import { tokenRefreshAdapter } from "../../infrastructure/identity-token-refresh.adapter";
import type { UpdateProfileInput, OrganizationRole } from "../../domain/entities/Account";
import type { CreatePolicyInput, UpdatePolicyInput } from "../../domain/entities/AccountPolicy";
import type { AccountQueryRepository } from "../../domain/repositories/AccountQueryRepository";
import type { AccountProfile, UpdateAccountProfileInput } from "../../domain/entities/AccountProfile";
import type { Unsubscribe } from "../../domain/repositories/AccountQueryRepository";
import type { CommandResult } from "@shared-types";

let _accountRepo: FirebaseAccountRepository | undefined;
let _queryRepo: FirebaseAccountQueryRepository | undefined;
let _policyRepo: FirebaseAccountPolicyRepository | undefined;

function getAccountRepo(): FirebaseAccountRepository {
  if (!_accountRepo) _accountRepo = new FirebaseAccountRepository();
  return _accountRepo;
}

function getQueryRepo(): FirebaseAccountQueryRepository {
  if (!_queryRepo) _queryRepo = new FirebaseAccountQueryRepository();
  return _queryRepo;
}

function getAcctPolicyRepo(): FirebaseAccountPolicyRepository {
  if (!_policyRepo) _policyRepo = new FirebaseAccountPolicyRepository();
  return _policyRepo;
}

export const accountService = {
  createUserAccount: (userId: string, name: string, email: string): Promise<CommandResult> =>
    new CreateUserAccountUseCase(getAccountRepo()).execute(userId, name, email),

  updateUserProfile: (userId: string, data: UpdateProfileInput): Promise<CommandResult> =>
    new UpdateUserProfileUseCase(getAccountRepo()).execute(userId, data),

  creditWallet: (accountId: string, amount: number, description: string): Promise<CommandResult> =>
    new CreditWalletUseCase(getAccountRepo()).execute(accountId, amount, description),

  debitWallet: (accountId: string, amount: number, description: string): Promise<CommandResult> =>
    new DebitWalletUseCase(getAccountRepo()).execute(accountId, amount, description),

  assignRole: (accountId: string, role: OrganizationRole, grantedBy: string, traceId?: string): Promise<CommandResult> =>
    new AssignAccountRoleUseCase(getAccountRepo(), tokenRefreshAdapter).execute(accountId, role, grantedBy, traceId),

  revokeRole: (accountId: string): Promise<CommandResult> =>
    new RevokeAccountRoleUseCase(getAccountRepo(), tokenRefreshAdapter).execute(accountId),

  createPolicy: (input: CreatePolicyInput): Promise<CommandResult> =>
    new CreateAccountPolicyUseCase(getAcctPolicyRepo(), tokenRefreshAdapter).execute(input),

  updatePolicy: (policyId: string, accountId: string, data: UpdatePolicyInput, traceId?: string): Promise<CommandResult> =>
    new UpdateAccountPolicyUseCase(getAcctPolicyRepo(), tokenRefreshAdapter).execute(policyId, accountId, data, traceId),

  deletePolicy: (policyId: string, accountId: string): Promise<CommandResult> =>
    new DeleteAccountPolicyUseCase(getAcctPolicyRepo(), tokenRefreshAdapter).execute(policyId, accountId),

  updateAccountProfile: (actorId: string, input: UpdateAccountProfileInput): Promise<CommandResult> =>
    new UpdateAccountProfileUseCase(getAccountRepo()).execute(actorId, input),
};

/**
 * Creates a wired set of client-side account use cases.
 * Keeps infrastructure wiring in the module boundary rather than in UI files.
 */
export function createClientAccountUseCases() {
  const repo = new FirebaseAccountRepository();
  return {
    createUserAccountUseCase: new CreateUserAccountUseCase(repo),
  };
}

/** Factory that returns a wired AccountQueryRepository without leaking the concrete class. */
export function createAccountQueryRepository(): AccountQueryRepository {
  return new FirebaseAccountQueryRepository();
}

/** Returns a wired GetAccountProfileUseCase (read path). */
export function createGetAccountProfileUseCase(): GetAccountProfileUseCase {
  return new GetAccountProfileUseCase(getQueryRepo());
}

/** Returns a wired SubscribeAccountProfileUseCase (reactive read path). */
export function createSubscribeAccountProfileUseCase(): SubscribeAccountProfileUseCase {
  return new SubscribeAccountProfileUseCase(getQueryRepo());
}

// ── Profile shortcut helpers (interface-layer entry points) ──────────────────

export async function getAccountProfile(actorId: string): Promise<AccountProfile | null> {
  return createGetAccountProfileUseCase().execute(actorId);
}

export function subscribeToAccountProfile(
  actorId: string,
  onUpdate: (profile: AccountProfile | null) => void,
): Unsubscribe {
  return createSubscribeAccountProfileUseCase().execute(actorId, onUpdate);
}

export async function updateAccountProfile(
  actorId: string,
  input: UpdateAccountProfileInput,
): Promise<CommandResult> {
  return accountService.updateAccountProfile(actorId, input);
}
