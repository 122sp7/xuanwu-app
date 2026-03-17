"use client";

import { useRouter } from "next/navigation";

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
  const router = useRouter();

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
          if (nextId === "__create_organization__") {
            router.push("/organization");
            return;
          }

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
        <option value="__create_organization__">+ 建立組織</option>
      </select>
    </div>
  );
}
