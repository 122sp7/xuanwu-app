"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useMemo, useState } from "react";

import type { WorkspaceEntity, WorkspaceGrant } from "@/modules/workspace/api";
import { formatDate } from "@shared-utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@ui-shadcn/ui/avatar";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";
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
import { Separator } from "@ui-shadcn/ui/separator";
import { WorkspaceAuditTab } from "@/modules/workspace-audit/api";
import { WorkspaceFilesTab } from "@/modules/source/api";
import { WorkspaceSchedulingTab } from "@/modules/workspace-scheduling/api";
import { WorkspaceFlowTab } from "@/modules/workspace-flow/api";

import { updateWorkspaceSettings } from "../_actions/workspace.actions";
import { WorkspaceDailyTab } from "./WorkspaceDailyTab";
import { WorkspaceMembersTab } from "./WorkspaceMembersTab";
import { WorkspaceWikiView } from "./WorkspaceWikiView";
import { getWorkspaceByIdForAccount } from "../queries/workspace.queries";
import {
  getWorkspaceTabLabel,
  getWorkspaceTabStatus,
  getWorkspaceTabsByGroup,
  isWorkspaceTabValue,
  type WorkspaceTabGroup,
  type WorkspaceTabValue,
} from "../workspace-tabs";

const MOBILE_TAB_GROUP_ORDER: WorkspaceTabGroup[] = [
  "primary",
  "modules",
  "library",
  "spaces",
  "databases",
];

const lifecycleBadgeVariant: Record<
  WorkspaceEntity["lifecycleState"],
  "default" | "secondary" | "outline"
> = {
  active: "default",
  preparatory: "secondary",
  stopped: "outline",
};

function getWorkspaceInitials(name: string) {
  const tokens = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (tokens.length === 0) {
    return "WS";
  }

  return tokens.map((token) => token[0]?.toUpperCase() ?? "").join("");
}

function formatTimestamp(timestamp: WorkspaceEntity["createdAt"] | undefined) {
  if (!timestamp) {
    return "—";
  }

  try {
    return formatDate(timestamp.toDate());
  } catch {
    return "—";
  }
}

function describeGrant(grant: WorkspaceGrant) {
  if (grant.teamId) {
    return "Team grant";
  }

  if (grant.userId) {
    return "User grant";
  }

  return "Unscoped grant";
}

interface WorkspaceSettingsDraft {
  readonly name: string;
  readonly visibility: WorkspaceEntity["visibility"];
  readonly lifecycleState: WorkspaceEntity["lifecycleState"];
  readonly street: string;
  readonly city: string;
  readonly state: string;
  readonly postalCode: string;
  readonly country: string;
  readonly details: string;
  readonly managerId: string;
  readonly supervisorId: string;
  readonly safetyOfficerId: string;
}

function createSettingsDraft(workspace: WorkspaceEntity): WorkspaceSettingsDraft {
  return {
    name: workspace.name,
    visibility: workspace.visibility,
    lifecycleState: workspace.lifecycleState,
    street: workspace.address?.street ?? "",
    city: workspace.address?.city ?? "",
    state: workspace.address?.state ?? "",
    postalCode: workspace.address?.postalCode ?? "",
    country: workspace.address?.country ?? "",
    details: workspace.address?.details ?? "",
    managerId: workspace.personnel?.managerId ?? "",
    supervisorId: workspace.personnel?.supervisorId ?? "",
    safetyOfficerId: workspace.personnel?.safetyOfficerId ?? "",
  };
}

function trimOrUndefined(value: string) {
  const trimmed = value.trim();
  return trimmed || undefined;
}

interface WorkspaceDetailScreenProps {
  readonly workspaceId: string;
  readonly accountId: string | null | undefined;
  readonly accountsHydrated: boolean;
  /** Optional tab to activate on first render (e.g. from ?tab= URL param). */
  readonly initialTab?: string;
}

function renderWorkspacePlaceholderTab(tab: WorkspaceTabValue) {
  const status = getWorkspaceTabStatus(tab);
  return (
    <Card className="border border-border/50">
      <CardHeader>
        <CardTitle>{status} {getWorkspaceTabLabel(tab)}</CardTitle>
        <CardDescription>
          此分頁尚在開發中，功能將逐步開放。
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        目前僅提供基礎導覽，敬請期待後續版本。
      </CardContent>
    </Card>
  );
}

export function WorkspaceDetailScreen({
  workspaceId,
  accountId,
  accountsHydrated,
  initialTab,
}: WorkspaceDetailScreenProps) {
  const router = useRouter();
  const [workspace, setWorkspace] = useState<WorkspaceEntity | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [isEditWorkspaceOpen, setIsEditWorkspaceOpen] = useState(false);
  const [isSavingWorkspace, setIsSavingWorkspace] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [settingsDraft, setSettingsDraft] = useState<WorkspaceSettingsDraft | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadWorkspace() {
      if (!workspaceId) {
        setLoadState("error");
        return;
      }

      if (!accountId || !accountsHydrated) {
        setWorkspace(null);
        setLoadState("loading");
        return;
      }

      setLoadState("loading");
      try {
        const detail = await getWorkspaceByIdForAccount(accountId, workspaceId);
        if (cancelled) return;
        if (!detail) {
          router.replace("/workspace?context=unavailable");
          return;
        }
        setWorkspace(detail);
        setLoadState("loaded");
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[WorkspaceDetailScreen] Failed to load workspace:", error);
        }
        if (!cancelled) {
          setWorkspace(null);
          setLoadState("error");
        }
      }
    }

    void loadWorkspace();

    return () => {
      cancelled = true;
    };
  }, [accountId, accountsHydrated, router, workspaceId]);
  const personnelEntries = useMemo(() => {
    if (!workspace?.personnel) {
      return [];
    }

    return [
      { label: "Manager", value: workspace.personnel.managerId },
      { label: "Supervisor", value: workspace.personnel.supervisorId },
      { label: "Safety officer", value: workspace.personnel.safetyOfficerId },
    ].filter((entry) => Boolean(entry.value));
  }, [workspace]);

  const addressLines = useMemo(() => {
    if (!workspace?.address) {
      return [];
    }

    const { street, city, state, postalCode, country, details } = workspace.address;

    return [
      street,
      [city, state, postalCode].filter(Boolean).join(", "),
      country,
      details,
    ].filter(Boolean);
  }, [workspace]);

  function renderTabContent(tab: WorkspaceTabValue) {
    if (!workspace) {
      return null;
    }

    switch (tab) {
      case "Overview":
        return (
          <>
            <Card className="border border-border/50">
              <CardContent className="flex flex-col gap-6 px-6 py-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-start gap-4">
                  <Avatar size="lg">
                    <AvatarImage src={workspace.photoURL} alt={workspace.name} />
                    <AvatarFallback>{getWorkspaceInitials(workspace.name)}</AvatarFallback>
                  </Avatar>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <p className="text-2xl font-semibold tracking-tight">{workspace.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {workspace.accountType === "organization" ? "Organization" : "Personal"} workspace ·
                        account {workspace.accountId}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={lifecycleBadgeVariant[workspace.lifecycleState]}>
                        {workspace.lifecycleState}
                      </Badge>
                      <Badge variant="outline">{workspace.visibility}</Badge>
                      <Badge variant="outline">Created {formatTimestamp(workspace.createdAt)}</Badge>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSettingsDraft(createSettingsDraft(workspace));
                        setSaveError(null);
                        setIsEditWorkspaceOpen(true);
                      }}
                    >
                      編輯工作區
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[20rem]">
                  <div className="rounded-xl border border-border/40 px-4 py-3">
                    <p className="text-xs text-muted-foreground">Capabilities</p>
                    <p className="mt-1 text-xl font-semibold">{workspace.capabilities.length}</p>
                  </div>
                  <div className="rounded-xl border border-border/40 px-4 py-3">
                    <p className="text-xs text-muted-foreground">Teams</p>
                    <p className="mt-1 text-xl font-semibold">{workspace.teamIds.length}</p>
                  </div>
                  <div className="rounded-xl border border-border/40 px-4 py-3">
                    <p className="text-xs text-muted-foreground">Locations</p>
                    <p className="mt-1 text-xl font-semibold">{workspace.locations?.length ?? 0}</p>
                  </div>
                  <div className="rounded-xl border border-border/40 px-4 py-3">
                    <p className="text-xs text-muted-foreground">Grants</p>
                    <p className="mt-1 text-xl font-semibold">{workspace.grants.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
              <Card className="border border-border/50 xl:col-span-2">
                <CardHeader>
                  <CardTitle>Workspace Product Spine</CardTitle>
                  <CardDescription>
                    從這個工作區穩定分流到 Knowledge、Wiki、Notebook / AI；Search、Source、Sync
                    則作為底層支撐能力。
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 xl:grid-cols-[1fr_1fr_1fr_0.9fr]">
                  <div className="rounded-xl border border-border/40 px-4 py-4">
                    <p className="text-sm font-semibold text-foreground">Knowledge</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      先用文件、來源與資料庫建立工作區知識基底，再讓後續 Wiki / AI 消費。
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/workspace/${workspace.id}?tab=Files`}>Files 分頁</Link>
                      </Button>
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/wiki/documents?workspaceId=${encodeURIComponent(workspace.id)}`}>
                          文件
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border/40 px-4 py-4">
                    <p className="text-sm font-semibold text-foreground">Wiki</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      以工作區內容樹、頁面與結構化導覽承接知識脈絡，避免回到平行產品入口。
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/workspace/${workspace.id}?tab=Wiki`}>工作區 Wiki</Link>
                      </Button>
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/wiki/pages?workspaceId=${encodeURIComponent(workspace.id)}`}>
                          頁面
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border/40 px-4 py-4">
                    <p className="text-sm font-semibold text-foreground">Notebook / AI</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      用 AI 對話與 RAG 查詢消費這個工作區的知識，不再把 AI 當成獨立產品島。
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/ai-chat?workspaceId=${encodeURIComponent(workspace.id)}`}>AI 對話</Link>
                      </Button>
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/wiki/rag-query?workspaceId=${encodeURIComponent(workspace.id)}`}>
                          RAG Query
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-xl border border-dashed border-border/50 px-4 py-4">
                    <p className="text-sm font-semibold text-foreground">Supporting layers</p>
                    <ul className="mt-2 space-y-2 text-xs leading-relaxed text-muted-foreground">
                      <li>
                        <span className="font-medium text-foreground">Search</span>：用 RAG Query
                        承接查詢、引用與回答。
                      </li>
                      <li>
                        <span className="font-medium text-foreground">Source</span>：Files / Documents
                        是來源接入與 metadata 宿主。
                      </li>
                      <li>
                        <span className="font-medium text-foreground">Sync</span>：upload → ingest →
                        index 流程持續把來源同步成可查詢知識。
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/50">
                <CardHeader>
                  <CardTitle>Capabilities</CardTitle>
                  <CardDescription>
                    Runtime features currently mounted on this workspace.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {workspace.capabilities.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No capability bindings have been added yet.
                    </p>
                  ) : (
                    workspace.capabilities.map((capability) => (
                      <div
                        key={capability.id}
                        className="rounded-xl border border-border/40 px-4 py-4"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-foreground">
                            {capability.name}
                          </p>
                          <Badge variant="outline">{capability.type}</Badge>
                          <Badge
                            variant={capability.status === "stable" ? "secondary" : "outline"}
                          >
                            {capability.status}
                          </Badge>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {capability.description}
                        </p>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card className="border border-border/50">
                <CardHeader>
                  <CardTitle>Access Model</CardTitle>
                  <CardDescription>
                    Team scopes and direct grants applied to this workspace.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Team access</p>
                    {workspace.teamIds.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No team access assigned.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {workspace.teamIds.map((teamId) => (
                          <Badge key={teamId} variant="secondary">
                            {teamId}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Direct grants</p>
                    {workspace.grants.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No direct grants recorded.</p>
                    ) : (
                      workspace.grants.map((grant, index) => (
                        <div
                          key={`grant-${grant.role}-${grant.teamId ?? "none"}-${grant.userId ?? "none"}-${grant.protocol ?? "none"}-${index}`}
                          className="rounded-xl border border-border/40 px-4 py-3"
                        >
                          <p className="text-sm font-medium text-foreground">
                            {describeGrant(grant)}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Role: {grant.role}
                            {grant.teamId ? ` · Team: ${grant.teamId}` : ""}
                            {grant.userId ? ` · User: ${grant.userId}` : ""}
                            {grant.protocol ? ` · Protocol: ${grant.protocol}` : ""}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <Card className="border border-border/50">
                <CardHeader>
                  <CardTitle>Locations</CardTitle>
                  <CardDescription>
                    Physical or logical locations linked to the workspace.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {workspace.locations == null || workspace.locations.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No locations have been configured yet.
                    </p>
                  ) : (
                    workspace.locations.map((location) => (
                      <div
                        key={location.locationId}
                        className="rounded-xl border border-border/40 px-4 py-4"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-foreground">
                            {location.label}
                          </p>
                          <Badge variant="outline">{location.locationId}</Badge>
                        </div>
                        {location.description && (
                          <p className="mt-2 text-sm text-muted-foreground">
                            {location.description}
                          </p>
                        )}
                        <p className="mt-2 text-xs text-muted-foreground">
                          Capacity: {location.capacity ?? "—"}
                        </p>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card className="border border-border/50">
                <CardHeader>
                  <CardTitle>Workspace Profile</CardTitle>
                  <CardDescription>
                    Operational contacts and registered workspace address.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Personnel</p>
                    {personnelEntries.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No personnel roles assigned.
                      </p>
                    ) : (
                      personnelEntries.map((entry) => (
                        <div
                          key={entry.label}
                          className="flex items-center justify-between rounded-xl border border-border/40 px-4 py-3 text-sm"
                        >
                          <span className="text-muted-foreground">{entry.label}</span>
                          <span className="font-medium text-foreground">{entry.value}</span>
                        </div>
                      ))
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Address</p>
                    {addressLines.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No address information has been provided.
                      </p>
                    ) : (
                      <div className="rounded-xl border border-border/40 px-4 py-4 text-sm text-muted-foreground">
                        {addressLines.map((line, index) => (
                          <p key={`${line}-${index}`}>{line}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        );
      case "Members":
        return <WorkspaceMembersTab workspace={workspace} />;
      case "Daily":
        return <WorkspaceDailyTab workspace={workspace} />;
      case "Files":
        return <WorkspaceFilesTab workspace={workspace} />;
      case "Wiki":
        return <WorkspaceWikiView workspace={workspace} />;
      case "Schedule":
        return (
          <WorkspaceSchedulingTab
            workspace={workspace}
            accountId={accountId ?? workspace.accountId}
            currentUserId={accountId ?? "anonymous"}
          />
        );
      case "Audit":
        return <WorkspaceAuditTab workspaceId={workspace.id} />;
      case "Tasks":
        return <WorkspaceFlowTab workspaceId={workspace.id} currentUserId={accountId ?? "anonymous"} />;
      default:
        return renderWorkspacePlaceholderTab(tab);
    }
  }

  async function handleSaveWorkspaceSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!workspace || !settingsDraft) {
      return;
    }

    if (!accountId) {
      setSaveError("帳號上下文尚未完成同步，請稍候再試。");
      return;
    }

    const nextWorkspaceName = settingsDraft.name.trim();
    if (!nextWorkspaceName) {
      setSaveError("請輸入工作區名稱。");
      return;
    }

    setIsSavingWorkspace(true);
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
        settingsDraft.safetyOfficerId.trim(),
    );

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
            }
          : undefined,
    });

    if (!result.success) {
      setSaveError(result.error.message);
      setIsSavingWorkspace(false);
      return;
    }

    try {
      const detail = await getWorkspaceByIdForAccount(accountId, workspace.id);
      if (!detail) {
        router.replace("/workspace?context=unavailable");
        return;
      }
      setWorkspace(detail);
      setLoadState("loaded");
      setSettingsDraft(detail ? createSettingsDraft(detail) : null);
      setIsEditWorkspaceOpen(false);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[WorkspaceDetailScreen] Failed to refresh workspace after save:", error);
      }
      setSaveError("工作區已更新，但重新整理資料失敗。請稍後再試。");
    } finally {
      setIsSavingWorkspace(false);
    }
  }

  const resolvedTab: WorkspaceTabValue = initialTab && isWorkspaceTabValue(initialTab)
    ? initialTab
    : "Overview";

  return (
    <div className="space-y-6">
      <Link href="/workspace" className="inline-flex text-sm font-medium text-primary hover:underline md:hidden">
        ← 返回 Workspace Hub
      </Link>

      {!accountsHydrated && (
        <div className="rounded-xl border border-border/40 px-4 py-3 text-sm text-muted-foreground">
          正在同步帳號內容…
        </div>
      )}

      {loadState === "loading" && (
        <Card className="border border-border/50">
          <CardContent className="px-6 py-5 text-sm text-muted-foreground">
            Loading workspace detail…
          </CardContent>
        </Card>
      )}

      {loadState === "error" && (
        <Card className="border border-destructive/30">
          <CardContent className="px-6 py-5 text-sm text-destructive">
            無法載入工作區資料，請返回清單後重試。
          </CardContent>
        </Card>
      )}

      {loadState === "loaded" && !workspace && (
        <Card className="border border-border/50">
          <CardContent className="px-6 py-5 text-sm text-muted-foreground">
            找不到此工作區。
          </CardContent>
        </Card>
      )}

      {workspace && (
        <div className="space-y-6">
          {/* Mobile tab navigation – hidden on md+ where sidebar handles navigation */}
          <nav
            aria-label="Workspace tab navigation"
            className="md:hidden -mx-6 overflow-x-auto border-b border-border/50 px-4 pb-2"
          >
            <div className="flex min-w-max items-center gap-0.5">
              {MOBILE_TAB_GROUP_ORDER.flatMap((group, groupIndex) => {
                const tabs = getWorkspaceTabsByGroup(group);
                const links = tabs.map((tab) => {
                  const isActive = resolvedTab === tab;
                  return (
                    <Link
                      key={tab}
                      href={`/workspace/${workspaceId}?tab=${encodeURIComponent(tab)}`}
                      aria-current={isActive ? "page" : undefined}
                      className={`whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {getWorkspaceTabLabel(tab)}
                    </Link>
                  );
                });
                if (groupIndex > 0) {
                  return [
                    <div
                      key={`sep-${group}`}
                      aria-hidden="true"
                      className="mx-1.5 h-3.5 w-px shrink-0 bg-border/60"
                    />,
                    ...links,
                  ];
                }
                return links;
              })}
            </div>
          </nav>

          <div className="flex items-center gap-2">
            <Badge variant="outline">{getWorkspaceTabStatus(resolvedTab)} {getWorkspaceTabLabel(resolvedTab)}</Badge>
          </div>
          {renderTabContent(resolvedTab)}
        </div>
      )}

      <Dialog
        open={isEditWorkspaceOpen}
        onOpenChange={(open) => {
          setIsEditWorkspaceOpen(open);
          if (!open) {
            setSaveError(null);
            if (workspace) {
              setSettingsDraft(createSettingsDraft(workspace));
            }
          }
        }}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>編輯工作區設定</DialogTitle>
            <DialogDescription>
              更新工作區基本資料、地址與聯絡角色，讓個人與組織工作區都能直接在內頁維護。
            </DialogDescription>
          </DialogHeader>

          {settingsDraft && (
            <form className="space-y-6" onSubmit={handleSaveWorkspaceSettings}>
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
                    disabled={isSavingWorkspace}
                    maxLength={80}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">可見性</label>
                  <Select
                    value={settingsDraft.visibility}
                    onValueChange={(value: WorkspaceEntity["visibility"]) =>
                      setSettingsDraft((current) =>
                        current ? { ...current, visibility: value } : current,
                      )
                    }
                    disabled={isSavingWorkspace}
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
                  <label className="text-sm font-medium text-foreground">生命週期</label>
                  <Select
                    value={settingsDraft.lifecycleState}
                    onValueChange={(value: WorkspaceEntity["lifecycleState"]) =>
                      setSettingsDraft((current) =>
                        current ? { ...current, lifecycleState: value } : current,
                      )
                    }
                    disabled={isSavingWorkspace}
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
                      disabled={isSavingWorkspace}
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
                      disabled={isSavingWorkspace}
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
                      disabled={isSavingWorkspace}
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
                      disabled={isSavingWorkspace}
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
                      disabled={isSavingWorkspace}
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
                      disabled={isSavingWorkspace}
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
                      disabled={isSavingWorkspace}
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
                      disabled={isSavingWorkspace}
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
                      disabled={isSavingWorkspace}
                    />
                  </div>
                </div>
              </div>

              {saveError && <p className="text-sm text-destructive">{saveError}</p>}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditWorkspaceOpen(false)}
                  disabled={isSavingWorkspace}
                >
                  取消
                </Button>
                <Button type="submit" disabled={isSavingWorkspace}>
                  {isSavingWorkspace ? "儲存中…" : "儲存設定"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
