"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import type { AccountEntity, AuthUser } from "../../../../api";
import { useApp } from "../../../../api";
import { createOrganization } from "../_actions/organization.actions";
import { Button } from "@ui-shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui-shadcn/ui/dialog";
import { Input } from "@ui-shadcn/ui/input";

interface AccountSwitcherProps {
  personalAccount: AuthUser | null;
  organizationAccounts: AccountEntity[];
  activeAccountId: string | null;
  onSelectPersonal: () => void;
  onSelectOrganization: (account: AccountEntity) => void;
  onOrganizationCreated?: (account: AccountEntity) => void;
}

export function AccountSwitcher({
  personalAccount,
  organizationAccounts,
  activeAccountId,
  onSelectPersonal,
  onSelectOrganization,
  onOrganizationCreated,
}: AccountSwitcherProps) {
  const router = useRouter();
  const {
    state: { accountsHydrated, bootstrapPhase },
  } = useApp();
  const [isCreateOrganizationOpen, setIsCreateOrganizationOpen] = useState(false);
  const [organizationName, setOrganizationName] = useState("");
  const [organizationError, setOrganizationError] = useState<string | null>(null);
  const [isCreatingOrganization, setIsCreatingOrganization] = useState(false);

  function resetCreateOrganizationDialog() {
    setOrganizationName("");
    setOrganizationError(null);
    setIsCreatingOrganization(false);
  }

  async function handleCreateOrganization(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!personalAccount) {
      setOrganizationError("帳號資訊已失效，請重新登入後再建立組織。");
      return;
    }

    const nextOrganizationName = organizationName.trim();
    if (!nextOrganizationName) {
      setOrganizationError("請輸入組織名稱。");
      return;
    }

    setIsCreatingOrganization(true);
    setOrganizationError(null);

    const result = await createOrganization({
      organizationName: nextOrganizationName,
      ownerId: personalAccount.id,
      ownerName: personalAccount.name,
      ownerEmail: personalAccount.email,
    });

    if (!result.success) {
      setOrganizationError(result.error.message);
      setIsCreatingOrganization(false);
      return;
    }

    onOrganizationCreated?.({
      id: result.aggregateId,
      name: nextOrganizationName,
      accountType: "organization",
      ownerId: personalAccount.id,
    });

    resetCreateOrganizationDialog();
    setIsCreateOrganizationOpen(false);
    router.push(`/${encodeURIComponent(result.aggregateId)}/organization`);
  }

  return (
    <>
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          帳號情境
        </p>
        <select
          aria-label="切換帳號情境"
          value={activeAccountId ?? ""}
          onChange={(event) => {
            const nextId = event.target.value;
            if (nextId === "__create_organization__") {
              setIsCreateOrganizationOpen(true);
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
            <option value={personalAccount.id}>{personalAccount.name}（個人）</option>
          )}
          {organizationAccounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}（組織）
            </option>
          ))}
          <option value="__create_organization__">+建立組織</option>
        </select>
        {!accountsHydrated && (
          <p className="text-xs text-muted-foreground">
            {bootstrapPhase === "seeded" ? "正在同步組織上下文…" : "正在載入帳號上下文…"}
          </p>
        )}
      </div>

      <Dialog
        open={isCreateOrganizationOpen}
        onOpenChange={(open) => {
          setIsCreateOrganizationOpen(open);
          if (!open) {
            resetCreateOrganizationDialog();
          }
        }}
      >
        <DialogContent aria-describedby="create-organization-description">
          <DialogHeader>
            <DialogTitle>建立新組織</DialogTitle>
            <DialogDescription id="create-organization-description">
              輸入名稱後會直接建立組織並切換到新的組織內容。
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-4" onSubmit={handleCreateOrganization}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="organization-name">
                組織名稱
              </label>
              <Input
                id="organization-name"
                value={organizationName}
                onChange={(event) => {
                  setOrganizationName(event.target.value);
                  if (organizationError) {
                    setOrganizationError(null);
                  }
                }}
                placeholder="例如：Gig Team"
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
                disabled={isCreatingOrganization}
                maxLength={80}
              />
              {organizationError && <p className="text-sm text-destructive">{organizationError}</p>}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetCreateOrganizationDialog();
                  setIsCreateOrganizationOpen(false);
                }}
                disabled={isCreatingOrganization}
              >
                取消
              </Button>
              <Button type="submit" disabled={isCreatingOrganization || !personalAccount}>
                {isCreatingOrganization ? "建立中…" : "直接建立"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
