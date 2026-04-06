import type { WorkspaceEntity } from "@/modules/workspace/api";
import { formatDate } from "@shared-utils";
import type { WorkspaceTabGroup } from "../workspace-tabs";

export const MOBILE_TAB_GROUP_ORDER: WorkspaceTabGroup[] = [
  "primary",
  "modules",
  "library",
  "spaces",
  "databases",
];

export const lifecycleBadgeVariant: Record<
  WorkspaceEntity["lifecycleState"],
  "default" | "secondary" | "outline"
> = {
  active: "default",
  preparatory: "secondary",
  stopped: "outline",
};

export function getWorkspaceInitials(name: string): string {
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

export function formatTimestamp(
  timestamp: WorkspaceEntity["createdAt"] | undefined,
): string {
  if (!timestamp) {
    return "—";
  }
  try {
    return formatDate(timestamp.toDate());
  } catch {
    return "—";
  }
}

export function trimOrUndefined(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed || undefined;
}

