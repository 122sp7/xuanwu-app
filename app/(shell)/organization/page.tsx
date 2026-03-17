"use client";

/**
 * Organization Overview Page — /organization
 * Lists organizations visible to the current user and allows switching
 * to an organization account context.
 * Wired to organization module queries.
 */

import { useApp } from "@/app/providers/app-provider";
import { useAuth } from "@/app/providers/auth-provider";
import type { AccountEntity } from "@/modules/account/domain/entities/Account";

export default function OrganizationPage() {
  const { state: appState, dispatch } = useApp();
  const { state: authState } = useAuth();
  const { user } = authState;
  const { accounts, activeAccount } = appState;

  const orgList = Object.values(accounts);

  function handleSwitch(account: AccountEntity) {
    dispatch({ type: "SET_ACTIVE_ACCOUNT", payload: account });
  }

  function handleSwitchToPersonal() {
    if (user) dispatch({ type: "SET_ACTIVE_ACCOUNT", payload: user });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Organizations</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Switch between your personal account and your organizations.
        </p>
      </div>

      {/* Personal account */}
      <section className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold">Personal Account</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{user?.name ?? "—"}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          {activeAccount?.id === user?.id ? (
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Active
            </span>
          ) : (
            <button
              type="button"
              onClick={handleSwitchToPersonal}
              className="rounded-lg border border-border/50 px-3 py-1 text-xs font-semibold transition-colors hover:bg-muted"
            >
              Switch
            </button>
          )}
        </div>
      </section>

      {/* Organizations */}
      <section className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold">
          Organizations
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            ({orgList.length})
          </span>
        </h2>

        {orgList.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            You are not a member of any organization yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {orgList.map((org) => (
              <li
                key={org.id}
                className="flex items-center justify-between rounded-xl border border-border/40 px-4 py-3"
              >
                <div>
                  <p className="font-medium">{org.name}</p>
                  {org.description && (
                    <p className="text-xs text-muted-foreground">{org.description}</p>
                  )}
                </div>
                {activeAccount?.id === org.id ? (
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    Active
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSwitch(org)}
                    className="rounded-lg border border-border/50 px-3 py-1 text-xs font-semibold transition-colors hover:bg-muted"
                  >
                    Switch
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
