"use client";

import { type FormEvent } from "react";

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

interface CreateWorkspaceDialogProps {
  readonly open: boolean;
  readonly workspaceName: string;
  readonly createError: string | null;
  readonly isCreatingWorkspace: boolean;
  readonly accountId: string | null | undefined;
  readonly onOpenChange: (open: boolean) => void;
  readonly onWorkspaceNameChange: (name: string) => void;
  readonly onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function CreateWorkspaceDialog({
  open,
  workspaceName,
  createError,
  isCreatingWorkspace,
  accountId,
  onOpenChange,
  onWorkspaceNameChange,
  onSubmit,
}: CreateWorkspaceDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby="create-workspace-description">
        <DialogHeader>
          <DialogTitle>建立工作區</DialogTitle>
          <DialogDescription id="create-workspace-description">
            建立後會直接出現在目前帳號的工作區清單中。
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-foreground"
              htmlFor="workspace-name"
            >
              工作區名稱
            </label>
            <Input
              id="workspace-name"
              value={workspaceName}
              onChange={(event) => onWorkspaceNameChange(event.target.value)}
              placeholder="例如：北區營運中心"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              disabled={isCreatingWorkspace}
              maxLength={80}
            />
            {createError && (
              <p className="text-sm text-destructive">{createError}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isCreatingWorkspace}
            >
              取消
            </Button>
            <Button type="submit" disabled={isCreatingWorkspace || !accountId}>
              {isCreatingWorkspace ? "建立中…" : "直接建立"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
