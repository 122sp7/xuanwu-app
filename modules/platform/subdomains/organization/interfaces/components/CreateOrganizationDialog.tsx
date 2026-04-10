"use client";

import { type FormEvent, useState } from "react";

import type { AuthUser } from "@/modules/platform/api";
import type { AccountEntity } from "../../../account/domain/entities/Account";
import { createOrganization } from "../../adapters/server-actions/organization.actions";
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

interface CreateOrganizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AuthUser | null;
  onOrganizationCreated?: (account: AccountEntity) => void;
  onNavigate: (href: string) => void;
}

export function CreateOrganizationDialog({
  open,
  onOpenChange,
  user,
  onOrganizationCreated,
  onNavigate,
}: CreateOrganizationDialogProps) {
  const [orgName, setOrgName] = useState("");
  const [orgError, setOrgError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  function reset() {
    setOrgName("");
    setOrgError(null);
    setIsCreating(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) {
      setOrgError("帳號資訊已失效，請重新登入後再建立組織。");
      return;
    }
    const name = orgName.trim();
    if (!name) {
      setOrgError("請輸入組織名稱。");
      return;
    }
    setIsCreating(true);
    setOrgError(null);
    const result = await createOrganization({
      organizationName: name,
      ownerId: user.id,
      ownerName: user.name,
      ownerEmail: user.email,
    });
    if (!result.success) {
      setOrgError(result.error.message);
      setIsCreating(false);
      return;
    }
    const newAccount: AccountEntity = {
      id: result.aggregateId,
      name,
      accountType: "organization",
      ownerId: user.id,
    };
    onOrganizationCreated?.(newAccount);
    reset();
    onOpenChange(false);
    onNavigate("/organization");
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) reset();
      }}
    >
      <DialogContent aria-describedby="rail-create-org-description">
        <DialogHeader>
          <DialogTitle>建立新組織</DialogTitle>
          <DialogDescription id="rail-create-org-description">
            輸入名稱後會直接建立組織並切換到新的組織內容。
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="rail-organization-name">
              組織名稱
            </label>
            <Input
              id="rail-organization-name"
              value={orgName}
              onChange={(e) => {
                setOrgName(e.target.value);
                if (orgError) setOrgError(null);
              }}
              placeholder="例如：Gig Team"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              disabled={isCreating}
              maxLength={80}
            />
            {orgError && <p className="text-sm text-destructive">{orgError}</p>}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
              disabled={isCreating}
            >
              取消
            </Button>
            <Button type="submit" disabled={isCreating || !user}>
              {isCreating ? "建立中…" : "直接建立"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
