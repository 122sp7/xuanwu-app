"use client";

import { Button } from "@ui-shadcn/ui/button";
import { Input } from "@ui-shadcn/ui/input";

import {
  createWorkspaceCustomRoleDraft,
  type WorkspaceSettingsDraft,
} from "../../state/workspace-settings";
import { WorkspaceInformationCard } from "../cards/WorkspaceInformationCard";

interface WorkspaceSettingsInformationFieldsProps {
  readonly settingsDraft: WorkspaceSettingsDraft;
  readonly setSettingsDraft: React.Dispatch<React.SetStateAction<WorkspaceSettingsDraft | null>>;
  readonly isSaving: boolean;
}

export function WorkspaceSettingsInformationFields({
  settingsDraft,
  setSettingsDraft,
  isSaving,
}: WorkspaceSettingsInformationFieldsProps) {
  return (
    <WorkspaceInformationCard
      workspaceName={(
        <Input
          aria-label="工作區名稱"
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
      )}
      workspaceAddress={(
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
      )}
      workspaceRoles={[
        {
          id: "workspace-manager-role",
          roleName: <p className="text-sm font-medium text-foreground">Manager</p>,
          roleValue: (
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
          ),
        },
        {
          id: "workspace-supervisor-role",
          roleName: <p className="text-sm font-medium text-foreground">Supervisor</p>,
          roleValue: (
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
          ),
        },
        {
          id: "workspace-safety-officer-role",
          roleName: <p className="text-sm font-medium text-foreground">Safety officer</p>,
          roleValue: (
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
          ),
        },
        ...settingsDraft.customRoles.map((entry) => ({
          id: entry.roleId,
          roleName: (
            <Input
              aria-label="角色名稱"
              value={entry.roleName}
              onChange={(event) =>
                setSettingsDraft((current) =>
                  current
                    ? {
                        ...current,
                        customRoles: current.customRoles.map((role) =>
                          role.roleId === entry.roleId
                            ? { ...role, roleName: event.target.value }
                            : role,
                        ),
                      }
                    : current,
                )
              }
              disabled={isSaving}
              placeholder="例如：Site lead"
            />
          ),
          roleValue: (
            <Input
              aria-label="角色"
              value={entry.role}
              onChange={(event) =>
                setSettingsDraft((current) =>
                  current
                    ? {
                        ...current,
                        customRoles: current.customRoles.map((role) =>
                          role.roleId === entry.roleId
                            ? { ...role, role: event.target.value }
                            : role,
                        ),
                      }
                    : current,
                )
              }
              disabled={isSaving}
              placeholder="輸入角色內容"
            />
          ),
          roleActions: (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                setSettingsDraft((current) =>
                  current
                    ? {
                        ...current,
                        customRoles: current.customRoles.filter((role) => role.roleId !== entry.roleId),
                      }
                    : current,
                )
              }
              disabled={isSaving}
            >
              移除
            </Button>
          ),
        })),
      ]}
      rolesAction={(
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            setSettingsDraft((current) =>
              current
                ? {
                    ...current,
                    customRoles: [...current.customRoles, createWorkspaceCustomRoleDraft()],
                  }
                : current,
            )
          }
          disabled={isSaving}
        >
          新增角色
        </Button>
      )}
    />
  );
}