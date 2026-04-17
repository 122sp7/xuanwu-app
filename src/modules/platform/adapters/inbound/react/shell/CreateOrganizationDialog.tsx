"use client";

/**
 * CreateOrganizationDialog — platform inbound adapter (React).
 *
 * Dialog for creating a new organisation.
 * Uses CreateOrganizationUseCase via the iam Firebase composition root.
 *
 * On success, the new organisation document is written to Firestore with the
 * creator listed in `ownerId` and `memberIds`.  The existing
 * `subscribeToAccountsForUser` query picks it up automatically, so the
 * AccountSwitcher refreshes without an explicit refetch.
 */

import { useState, useMemo } from "react";
import { Building2, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@ui-shadcn/ui/dialog";

import { createClientOrganizationUseCases } from "../../../../../iam/adapters/outbound/firebase-composition";
import type { AuthUser } from "../../../../../iam/adapters/inbound/react/AuthContext";
import type { AccountEntity } from "../AppContext";

// ── Types ─────────────────────────────────────────────────────────────────────

interface CreateOrganizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AuthUser | null;
  onOrganizationCreated?: (account: AccountEntity) => void;
  onNavigate?: (href: string) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function CreateOrganizationDialog({
  open,
  onOpenChange,
  user,
  onOrganizationCreated,
  onNavigate,
}: CreateOrganizationDialogProps): React.ReactElement | null {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { createOrganizationUseCase } = useMemo(
    () => createClientOrganizationUseCases(),
    [],
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setError(null);
    setIsLoading(true);
    try {
      const result = await createOrganizationUseCase.execute({
        organizationName: name.trim(),
        ownerId: user.id,
        ownerName: user.name ?? "",
        ownerEmail: user.email ?? "",
      });

      if (!result.success) {
        setError(result.error.message);
        return;
      }

      const orgId = result.aggregateId;
      const newAccount: AccountEntity = {
        id: orgId,
        name: name.trim(),
        accountType: "organization",
        email: undefined,
        photoURL: undefined,
      };

      onOrganizationCreated?.(newAccount);
      setName("");

      if (onNavigate) {
        onNavigate(`/${orgId}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "組織建立失敗");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
              <Building2 className="size-5 text-primary" />
            </div>
            <div>
              <DialogTitle>新增組織</DialogTitle>
              <DialogDescription className="mt-0.5 text-xs">
                建立一個組織帳號以管理成員與工作區。
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="org-name"
              className="text-sm font-medium text-foreground"
            >
              組織名稱
            </label>
            <input
              id="org-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例：Acme Corp"
              required
              minLength={2}
              maxLength={80}
              autoComplete="organization"
              className="h-10 rounded-lg border border-border/50 bg-background/70 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="h-9 rounded-lg border border-border/50 px-4 text-sm text-muted-foreground transition hover:bg-muted"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/20 transition hover:brightness-105 disabled:opacity-60"
            >
              {isLoading && <Loader2 className="size-4 animate-spin" />}
              建立組織
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  ) as React.ReactElement;
}
