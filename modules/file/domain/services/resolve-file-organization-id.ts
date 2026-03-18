export function resolveFileOrganizationId(
  accountType: "user" | "organization",
  accountId: string,
): string {
  return accountType === "organization" ? accountId : `personal:${accountId}`;
}

