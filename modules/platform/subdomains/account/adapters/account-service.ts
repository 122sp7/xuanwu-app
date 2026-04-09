/**
 * AccountService — Composition root for account use cases.
 * Wires repositories and ports; provides a unified service interface.
 */

import {
  CreateUserAccountUseCase,
  UpdateUserProfileUseCase,
  CreditWalletUseCase,
  DebitWalletUseCase,
  AssignAccountRoleUseCase,
  RevokeAccountRoleUseCase,
} from "../application/use-cases/account.use-cases";
import {
  CreateAccountPolicyUseCase,
  UpdateAccountPolicyUseCase,
  DeleteAccountPolicyUseCase,
} from "../application/use-cases/account-policy.use-cases";
import { FirebaseAccountRepository } from "./firebase/FirebaseAccountRepository";
import { FirebaseAccountQueryRepository } from "./firebase/FirebaseAccountQueryRepository";
import { FirebaseAccountPolicyRepository } from "./firebase/FirebaseAccountPolicyRepository";
import { tokenRefreshAdapter } from "./identity-token-refresh.adapter";
import type { UpdateProfileInput, OrganizationRole } from "../domain/entities/Account";
import type { CreatePolicyInput, UpdatePolicyInput } from "../domain/entities/AccountPolicy";
import type { CommandResult } from "@shared-types";

const accountRepo = new FirebaseAccountRepository();
const policyRepo = new FirebaseAccountPolicyRepository();

export const accountService = {
  createUserAccount: (userId: string, name: string, email: string): Promise<CommandResult> =>
    new CreateUserAccountUseCase(accountRepo).execute(userId, name, email),

  updateUserProfile: (userId: string, data: UpdateProfileInput): Promise<CommandResult> =>
    new UpdateUserProfileUseCase(accountRepo).execute(userId, data),

  creditWallet: (accountId: string, amount: number, description: string): Promise<CommandResult> =>
    new CreditWalletUseCase(accountRepo).execute(accountId, amount, description),

  debitWallet: (accountId: string, amount: number, description: string): Promise<CommandResult> =>
    new DebitWalletUseCase(accountRepo).execute(accountId, amount, description),

  assignRole: (accountId: string, role: OrganizationRole, grantedBy: string, traceId?: string): Promise<CommandResult> =>
    new AssignAccountRoleUseCase(accountRepo, tokenRefreshAdapter).execute(accountId, role, grantedBy, traceId),

  revokeRole: (accountId: string): Promise<CommandResult> =>
    new RevokeAccountRoleUseCase(accountRepo, tokenRefreshAdapter).execute(accountId),

  createPolicy: (input: CreatePolicyInput): Promise<CommandResult> =>
    new CreateAccountPolicyUseCase(policyRepo, tokenRefreshAdapter).execute(input),

  updatePolicy: (policyId: string, accountId: string, data: UpdatePolicyInput, traceId?: string): Promise<CommandResult> =>
    new UpdateAccountPolicyUseCase(policyRepo, tokenRefreshAdapter).execute(policyId, accountId, data, traceId),

  deletePolicy: (policyId: string, accountId: string): Promise<CommandResult> =>
    new DeleteAccountPolicyUseCase(policyRepo, tokenRefreshAdapter).execute(policyId, accountId),
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

export { FirebaseAccountQueryRepository };
