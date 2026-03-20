import type { AccountEntity } from "@/modules/account/domain/entities/Account";
import type { ActiveAccount } from "@/app/providers/app-context";

export function isOrganizationAccount(
  activeAccount: ActiveAccount | null,
): activeAccount is AccountEntity & { accountType: "organization" } {
  return (
    activeAccount != null &&
    "accountType" in activeAccount &&
    activeAccount.accountType === "organization"
  );
}

export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(value instanceof Date ? value : new Date(value));
  } catch {
    return value instanceof Date ? value.toISOString() : String(value);
  }
}
