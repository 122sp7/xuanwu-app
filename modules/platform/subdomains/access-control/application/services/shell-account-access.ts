export interface ShellAccountActor {
  readonly id: string;
  readonly accountType?: string;
}

export function isOrganizationActor(
  account: ShellAccountActor | null | undefined,
): account is ShellAccountActor & { accountType: "organization" } {
  return account?.accountType === "organization";
}

/**
 * Type-narrowing guard for ActiveAccount (union of AccountEntity | AuthUser).
 * Returns true when the active account is an organization account.
 */
export function isActiveOrganizationAccount(
  activeAccount: { id: string; accountType?: string } | null,
): activeAccount is { id: string; accountType: "organization" } & Record<string, unknown> {
  return isOrganizationActor(activeAccount);
}

/**
 * Keep shell fallback behavior centralized so route access rules are not
 * duplicated across layout components.
 */
export function resolveOrganizationRouteFallback(
  pathname: string,
  account: ShellAccountActor | null | undefined,
): string | null {
  if (!account) {
    return null;
  }

  const segments = pathname.split("/").filter(Boolean);
  const isLegacyOrganizationPath = segments[0] === "organization";
  const isAccountScopedOrganizationPath =
    segments.length >= 2 && segments[1] === "organization";

  if ((isLegacyOrganizationPath || isAccountScopedOrganizationPath) && !isOrganizationActor(account)) {
    return `/${encodeURIComponent(account.id)}`;
  }

  return null;
}