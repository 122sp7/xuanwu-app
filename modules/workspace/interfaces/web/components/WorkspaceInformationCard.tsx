"use client";

import type { ReactNode } from "react";

import { Badge } from "@ui-shadcn/ui/badge";

export interface WorkspaceInformationRoleItem {
  readonly id: string;
  readonly roleName: ReactNode;
  readonly roleValue: ReactNode;
  readonly roleActions?: ReactNode;
}

interface WorkspaceInformationCardProps {
  readonly workspaceName: ReactNode;
  readonly workspaceAddress: ReactNode;
  readonly workspaceRoles: WorkspaceInformationRoleItem[];
  readonly rolesAction?: ReactNode;
  readonly emptyRolesState?: ReactNode;
  readonly className?: string;
}

export function WorkspaceInformationCard({
  workspaceName,
  workspaceAddress,
  workspaceRoles,
  rolesAction,
  emptyRolesState,
  className,
}: WorkspaceInformationCardProps) {
  return (
    <div className={["space-y-6", className].filter(Boolean).join(" ")}>
      <section className="space-y-2">
        <p className="text-sm font-medium text-foreground">工作區名稱</p>
        <div className="rounded-xl border border-border/40 bg-card/70 p-4 shadow-sm">
          {workspaceName}
        </div>
      </section>

      <section className="space-y-2">
        <p className="text-sm font-medium text-foreground">工作區地址</p>
        <div className="rounded-xl border border-border/40 bg-card/70 p-4 shadow-sm">
          {workspaceAddress}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-foreground">工作區角色</p>
            <Badge variant="secondary">{workspaceRoles.length}</Badge>
          </div>
          {rolesAction}
        </div>

        <div className="space-y-3 rounded-xl border border-border/40 bg-card/70 p-4 shadow-sm">
          {workspaceRoles.length > 0 ? (
            workspaceRoles.map((item) => (
              <div
                key={item.id}
                className="grid gap-3 rounded-lg border border-border/30 bg-background/80 p-3 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)_auto]"
              >
                <div className="min-w-0 space-y-1.5">
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    角色名稱
                  </p>
                  <div className="min-w-0">{item.roleName}</div>
                </div>

                <div className="min-w-0 space-y-1.5">
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    角色
                  </p>
                  <div className="min-w-0">{item.roleValue}</div>
                </div>

                {item.roleActions ? (
                  <div className="flex items-start justify-end">{item.roleActions}</div>
                ) : null}
              </div>
            ))
          ) : (
            emptyRolesState ?? (
              <p className="text-sm text-muted-foreground">尚未設定任何工作區角色。</p>
            )
          )}
        </div>
      </section>
    </div>
  );
}