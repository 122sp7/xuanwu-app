"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { WorkspaceEntity } from "../../api/contracts";
import { getWorkspaceByIdForAccount, updateWorkspaceSettings } from "../../api/facades";
import type { WorkspaceSettingsDraft } from "../state/workspace-settings";
import { trimOrUndefined } from "../components/layout/workspace-detail-helpers";

interface UseWorkspaceSettingsSaveOptions {
  readonly workspace: WorkspaceEntity | null;
  readonly accountId: string | null | undefined;
  readonly onSaved: (updated: WorkspaceEntity) => void;
}

interface UseWorkspaceSettingsSaveResult {
  readonly isSaving: boolean;
  readonly saveError: string | null;
  readonly clearSaveError: () => void;
  readonly handleSave: (
    event: FormEvent<HTMLFormElement>,
    settingsDraft: WorkspaceSettingsDraft | null,
  ) => Promise<void>;
}

export function useWorkspaceSettingsSave({
  workspace,
  accountId,
  onSaved,
}: UseWorkspaceSettingsSaveOptions): UseWorkspaceSettingsSaveResult {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  async function handleSave(
    event: FormEvent<HTMLFormElement>,
    settingsDraft: WorkspaceSettingsDraft | null,
  ) {
    event.preventDefault();

    if (!workspace || !settingsDraft) return;

    if (!accountId) {
      setSaveError("帳號上下文尚未完成同步，請稍候再試。");
      return;
    }

    const nextWorkspaceName = settingsDraft.name.trim();
    if (!nextWorkspaceName) {
      setSaveError("請輸入工作區名稱。");
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    const hasAddressContent = Boolean(
      settingsDraft.street.trim() ||
        settingsDraft.city.trim() ||
        settingsDraft.state.trim() ||
        settingsDraft.postalCode.trim() ||
        settingsDraft.country.trim() ||
        settingsDraft.details.trim(),
    );
    const hasPersonnelContent = Boolean(
      settingsDraft.managerId.trim() ||
        settingsDraft.supervisorId.trim() ||
        settingsDraft.safetyOfficerId.trim() ||
        settingsDraft.customRoles.some((entry) => entry.roleName.trim() || entry.role.trim()),
    );

    const normalizedCustomRoles = settingsDraft.customRoles
      .map((entry) => ({
        roleId: entry.roleId,
        roleName: entry.roleName.trim(),
        role: entry.role.trim(),
      }))
      .filter((entry) => entry.roleName || entry.role);

    const result = await updateWorkspaceSettings({
      workspaceId: workspace.id,
      accountId,
      name: nextWorkspaceName,
      visibility: settingsDraft.visibility,
      lifecycleState: settingsDraft.lifecycleState,
      address:
        workspace.address != null || hasAddressContent
          ? {
              street: settingsDraft.street.trim(),
              city: settingsDraft.city.trim(),
              state: settingsDraft.state.trim(),
              postalCode: settingsDraft.postalCode.trim(),
              country: settingsDraft.country.trim(),
              details: trimOrUndefined(settingsDraft.details),
            }
          : undefined,
      personnel:
        workspace.personnel != null || hasPersonnelContent
          ? {
              managerId: trimOrUndefined(settingsDraft.managerId),
              supervisorId: trimOrUndefined(settingsDraft.supervisorId),
              safetyOfficerId: trimOrUndefined(settingsDraft.safetyOfficerId),
              customRoles: normalizedCustomRoles.length > 0 ? normalizedCustomRoles : undefined,
            }
          : undefined,
    });

    if (!result.success) {
      setSaveError(result.error.message);
      setIsSaving(false);
      return;
    }

    try {
      const detail = await getWorkspaceByIdForAccount(accountId, workspace.id);
      if (!detail) {
        router.replace("/workspace?context=unavailable");
        return;
      }
      onSaved(detail);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[useWorkspaceSettingsSave] Failed to refresh workspace after save:", error);
      }
      setSaveError("工作區已更新，但重新整理資料失敗。請稍後再試。");
    } finally {
      setIsSaving(false);
    }
  }

  return {
    isSaving,
    saveError,
    clearSaveError: () => setSaveError(null),
    handleSave,
  };
}
