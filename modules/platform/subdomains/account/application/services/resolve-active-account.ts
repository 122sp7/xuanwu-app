import type { AccountEntity } from "../../domain/entities/Account";

export type AccountBootstrapPhase = "idle" | "seeded" | "hydrated";

interface PersonalAccountIdentity {
  readonly id: string;
}

export type SelectableActiveAccount = AccountEntity | PersonalAccountIdentity;

export interface ResolveActiveAccountInput {
  readonly currentActiveAccount: SelectableActiveAccount | null;
  readonly accounts: Record<string, AccountEntity>;
  readonly personalAccount: PersonalAccountIdentity;
  readonly preferredActiveAccountId?: string | null;
  readonly bootstrapPhase: AccountBootstrapPhase;
}

/**
 * Resolve the next active account from current selection, persisted preference,
 * and latest account snapshot while preserving optimistic bootstrap behavior.
 */
export function resolveActiveAccount(input: ResolveActiveAccountInput): SelectableActiveAccount {
  const {
    currentActiveAccount,
    accounts,
    personalAccount,
    preferredActiveAccountId,
    bootstrapPhase,
  } = input;

  const validIds = new Set([personalAccount.id, ...Object.keys(accounts)]);
  const currentActiveId = currentActiveAccount?.id;
  let currentActive: SelectableActiveAccount | null = null;

  if (currentActiveId && validIds.has(currentActiveId)) {
    currentActive = currentActiveId === personalAccount.id ? personalAccount : accounts[currentActiveId] ?? null;
  }

  let preferredActive: SelectableActiveAccount | null = null;
  if (preferredActiveAccountId && validIds.has(preferredActiveAccountId)) {
    preferredActive =
      preferredActiveAccountId === personalAccount.id
        ? personalAccount
        : accounts[preferredActiveAccountId] ?? null;
  }

  if (
    preferredActive &&
    (!currentActive || bootstrapPhase === "seeded" || currentActive.id === personalAccount.id)
  ) {
    return preferredActive;
  }

  return currentActive ?? personalAccount;
}