"use client";

import { type FormEvent } from "react";
import type { WorkspaceEntity } from "@/modules/workspace/api";
import { Button } from "@ui-shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui-shadcn/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui-shadcn/ui/select";
import type { WorkspaceSettingsDraft } from "../workspace-settings";
import { WorkspaceSettingsInformationFields } from "./WorkspaceSettingsInformationFields";

interface WorkspaceSettingsDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly settingsDraft: WorkspaceSettingsDraft | null;
  readonly setSettingsDraft: React.Dispatch<React.SetStateAction<WorkspaceSettingsDraft | null>>;
  readonly isSaving: boolean;
  readonly saveError: string | null;
  readonly onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function WorkspaceSettingsDialog({
  open,
  onOpenChange,
  settingsDraft,
  setSettingsDraft,
  isSaving,
  saveError,
  onSubmit,
}: WorkspaceSettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>編輯工作區設定</DialogTitle>
          <DialogDescription>
            更新工作區基本資料、地址與聯絡角色，讓個人與組織工作區都能直接在內頁維護。
          </DialogDescription>
        </DialogHeader>

        {settingsDraft && (
          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <span className="text-sm font-medium text-foreground">可見性</span>
                <Select
                  value={settingsDraft.visibility}
                  onValueChange={(value: WorkspaceEntity["visibility"]) =>
                    setSettingsDraft((current) =>
                      current ? { ...current, visibility: value } : current,
                    )
                  }
                  disabled={isSaving}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visible">visible</SelectItem>
                    <SelectItem value="hidden">hidden</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <span className="text-sm font-medium text-foreground">生命週期</span>
                <Select
                  value={settingsDraft.lifecycleState}
                  onValueChange={(value: WorkspaceEntity["lifecycleState"]) =>
                    setSettingsDraft((current) =>
                      current ? { ...current, lifecycleState: value } : current,
                    )
                  }
                  disabled={isSaving}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="preparatory">preparatory</SelectItem>
                    <SelectItem value="active">active</SelectItem>
                    <SelectItem value="stopped">stopped</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <WorkspaceSettingsInformationFields
              settingsDraft={settingsDraft}
              setSettingsDraft={setSettingsDraft}
              isSaving={isSaving}
            />

            {saveError && <p className="text-sm text-destructive">{saveError}</p>}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSaving}
              >
                取消
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "儲存中…" : "儲存設定"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
