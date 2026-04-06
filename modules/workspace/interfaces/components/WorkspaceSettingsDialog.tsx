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
import { Input } from "@ui-shadcn/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui-shadcn/ui/select";
import type { WorkspaceSettingsDraft } from "../../application/workspace-settings";

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
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium text-foreground" htmlFor="workspace-detail-name">
                  工作區名稱
                </label>
                <Input
                  id="workspace-detail-name"
                  value={settingsDraft.name}
                  onChange={(event) =>
                    setSettingsDraft((current) =>
                      current ? { ...current, name: event.target.value } : current,
                    )
                  }
                  disabled={isSaving}
                  maxLength={80}
                />
              </div>

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

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-foreground">聯絡角色</p>
                <p className="text-xs text-muted-foreground">
                  個人與組織工作區都共用同一組工作區聯絡人欄位。
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground" htmlFor="workspace-manager-id">
                    Manager
                  </label>
                  <Input
                    id="workspace-manager-id"
                    value={settingsDraft.managerId}
                    onChange={(event) =>
                      setSettingsDraft((current) =>
                        current ? { ...current, managerId: event.target.value } : current,
                      )
                    }
                    disabled={isSaving}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground" htmlFor="workspace-supervisor-id">
                    Supervisor
                  </label>
                  <Input
                    id="workspace-supervisor-id"
                    value={settingsDraft.supervisorId}
                    onChange={(event) =>
                      setSettingsDraft((current) =>
                        current ? { ...current, supervisorId: event.target.value } : current,
                      )
                    }
                    disabled={isSaving}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground" htmlFor="workspace-safety-officer-id">
                    Safety officer
                  </label>
                  <Input
                    id="workspace-safety-officer-id"
                    value={settingsDraft.safetyOfficerId}
                    onChange={(event) =>
                      setSettingsDraft((current) =>
                        current ? { ...current, safetyOfficerId: event.target.value } : current,
                      )
                    }
                    disabled={isSaving}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-foreground">地址資訊</p>
                <p className="text-xs text-muted-foreground">
                  用於個人據點與組織營運工作區的基礎地址資料。
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium text-foreground" htmlFor="workspace-address-street">
                    Street
                  </label>
                  <Input
                    id="workspace-address-street"
                    value={settingsDraft.street}
                    onChange={(event) =>
                      setSettingsDraft((current) =>
                        current ? { ...current, street: event.target.value } : current,
                      )
                    }
                    disabled={isSaving}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground" htmlFor="workspace-address-city">
                    City
                  </label>
                  <Input
                    id="workspace-address-city"
                    value={settingsDraft.city}
                    onChange={(event) =>
                      setSettingsDraft((current) =>
                        current ? { ...current, city: event.target.value } : current,
                      )
                    }
                    disabled={isSaving}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground" htmlFor="workspace-address-state">
                    State
                  </label>
                  <Input
                    id="workspace-address-state"
                    value={settingsDraft.state}
                    onChange={(event) =>
                      setSettingsDraft((current) =>
                        current ? { ...current, state: event.target.value } : current,
                      )
                    }
                    disabled={isSaving}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground" htmlFor="workspace-address-postal-code">
                    Postal code
                  </label>
                  <Input
                    id="workspace-address-postal-code"
                    value={settingsDraft.postalCode}
                    onChange={(event) =>
                      setSettingsDraft((current) =>
                        current ? { ...current, postalCode: event.target.value } : current,
                      )
                    }
                    disabled={isSaving}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground" htmlFor="workspace-address-country">
                    Country
                  </label>
                  <Input
                    id="workspace-address-country"
                    value={settingsDraft.country}
                    onChange={(event) =>
                      setSettingsDraft((current) =>
                        current ? { ...current, country: event.target.value } : current,
                      )
                    }
                    disabled={isSaving}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium text-foreground" htmlFor="workspace-address-details">
                    Details
                  </label>
                  <Input
                    id="workspace-address-details"
                    value={settingsDraft.details}
                    onChange={(event) =>
                      setSettingsDraft((current) =>
                        current ? { ...current, details: event.target.value } : current,
                      )
                    }
                    disabled={isSaving}
                  />
                </div>
              </div>
            </div>

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
