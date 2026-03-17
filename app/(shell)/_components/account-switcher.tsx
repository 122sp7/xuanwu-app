"use client";

import type { AuthUser } from "@/app/providers/auth-context";
import type { AccountEntity } from "@/modules/account/domain/entities/Account";

interface AccountSwitcherProps {
  personalAccount: AuthUser | null;
  organizationAccounts: AccountEntity[];
  activeAccountId: string | null;
  onSelectPersonal: () => void;
  onSelectOrganization: (account: AccountEntity) => void;
}

export function AccountSwitcher({
  personalAccount,
  organizationAccounts,
  activeAccountId,
  onSelectPersonal,
  onSelectOrganization,
}: AccountSwitcherProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Account Context
      </p>
      <select
        aria-label="Switch account context"
        value={activeAccountId ?? ""}
        onChange={(event) => {
          const nextId = event.target.value;
          if (!nextId || nextId === personalAccount?.id) {
            onSelectPersonal();
            return;
          }

          const nextAccount = organizationAccounts.find((account) => account.id === nextId);
          if (nextAccount) {
            onSelectOrganization(nextAccount);
          }
        }}
        className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm text-foreground"
      >
        {personalAccount && (
          <option value={personalAccount.id}>{personalAccount.name} (Personal)</option>
        )}
        {organizationAccounts.map((account) => (
          <option key={account.id} value={account.id}>
            {account.name} (Organization)
          </option>
        ))}
      </select>
    </div>
  );
}
