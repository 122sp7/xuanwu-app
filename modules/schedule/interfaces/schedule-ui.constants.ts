/**
 * Badge variant mapping for WorkspaceScheduleItem.type.
 * Shared between the organization schedule page and the workspace schedule tab.
 */
export const SCHEDULE_ITEM_TYPE_VARIANT_MAP: Record<
  "milestone" | "follow-up" | "maintenance",
  "default" | "secondary" | "outline"
> = {
  milestone: "default",
  "follow-up": "secondary",
  maintenance: "outline",
};
