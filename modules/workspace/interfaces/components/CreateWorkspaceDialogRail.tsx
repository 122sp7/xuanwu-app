"use client";

import { type FormEvent, useState } from "react";

import { createWorkspace } from "../api/facade";
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

interface CreateWorkspaceDialogRailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountId: string | null;
  accountType: "user" | "organization" | null;
  onNavigate: (href: string) => void;
}

export function CreateWorkspaceDialogRail({
  open,
  onOpenChange,
  accountId,
  accountType,
  onNavigate,
}: CreateWorkspaceDialogRailProps) {
  const [workspaceName, setWorkspaceName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  function reset() {
    setWorkspaceName("");
    setError(null);
    setIsCreating(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = workspaceName.trim();
    if (!name) {
      setError("請輸入工作區名稱。");
      return;
    }
    if (!accountId || !accountType) {
      setError("帳號資訊已失效，請重新登入後再建立工作區。");
      return;
    }

    setIsCreating(true);
    setError(null);
    const result = await createWorkspace({
      name,
      accountId,
      accountType,
    });

    if (!result.success) {
      setError(result.error.message);
      setIsCreating(false);
      return;
    }

    reset();
    onOpenChange(false);
    onNavigate("/workspace");
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) reset();
      }}
    >
      <DialogContent aria-describedby="rail-create-workspace-description">
        <DialogHeader>
          <DialogTitle>建立新工作區</DialogTitle>
          <DialogDescription id="rail-create-workspace-description">
            輸入名稱後會直接建立工作區並加入目前帳號的工作區清單中。
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="rail-workspace-name">
              工作區名稱
            </label>
            <Input
              id="rail-workspace-name"
              value={workspaceName}
              onChange={(e) => {
                setWorkspaceName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="例如：Project Alpha"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              disabled={isCreating}
              maxLength={80}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
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
            <Button type="submit" disabled={isCreating || !accountId || !accountType}>
              {isCreating ? "建立中…" : "直接建立"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
