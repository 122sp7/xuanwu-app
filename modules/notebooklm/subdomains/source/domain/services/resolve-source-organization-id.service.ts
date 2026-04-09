/**
 * Module: notebooklm/subdomains/source
 * Layer: domain/services
 * Service: resolveSourceOrganizationId — maps an account to its organization scope.
 *
 * Personal accounts get a synthetic org ID prefixed with "personal:" so they
 * can participate in the same org-scoped permission checks as org accounts
 * without sharing an org namespace.
 */

export function resolveSourceOrganizationId(
  accountType: "user" | "organization",
  accountId: string,
): string {
  return accountType === "organization" ? accountId : `personal:${accountId}`;
}
