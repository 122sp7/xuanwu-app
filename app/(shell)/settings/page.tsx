"use client";

/**
 * Account Settings Page — /settings
 * Displays user profile and account management options.
 * Wired to the account module via subscribeToUserProfile.
 */

import { useEffect, useState } from "react";
import { useAuth } from "@/app/providers/auth-provider";
import { subscribeToUserProfile } from "@/modules/account/interfaces/queries/account.queries";
import type { AccountEntity } from "@/modules/account/domain/entities/Account";

export default function SettingsPage() {
  const { state: authState, logout } = useAuth();
  const { user } = authState;
  const [profile, setProfile] = useState<AccountEntity | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    const unsub = subscribeToUserProfile(user.id, setProfile);
    return () => unsub();
  }, [user?.id]);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your profile and account preferences.
        </p>
      </div>

      {/* Profile Card */}
      <section className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold">Profile</h2>
        <dl className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Name</dt>
            <dd className="font-medium">{profile?.name ?? user?.name ?? "—"}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Email</dt>
            <dd className="font-medium">{profile?.email ?? user?.email ?? "—"}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Account Type</dt>
            <dd className="font-medium capitalize">{profile?.accountType ?? "user"}</dd>
          </div>
          {profile?.wallet && (
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Wallet Balance</dt>
              <dd className="font-medium">{profile.wallet.balance}</dd>
            </div>
          )}
        </dl>
      </section>

      {/* Sign Out */}
      <section className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold">Session</h2>
        <button
          type="button"
          onClick={() => void logout()}
          className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10"
        >
          Sign Out
        </button>
      </section>
    </div>
  );
}
