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
 * Keep shell fallback behavior centralized so route access rules are not
 * duplicated across layout components.
 */
export function resolveOrganizationRouteFallback(
  pathname: string,
  account: ShellAccountActor | null | undefined,
): string | null {
  if (pathname === "/organization" && !isOrganizationActor(account)) {
    return "/workspace";
  }

  return null;
}