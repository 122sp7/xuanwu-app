/**
 * ScheduleEventType – analogous to cal.com EventType.
 *
 * Represents a named, reusable template that describes what kind of schedule
 * item (milestone, follow-up, or maintenance) an organisation or workspace
 * intends to schedule.  Instances of this template map 1-to-many to concrete
 * WorkspaceScheduleItem records.
 */
export interface ScheduleEventType {
  readonly id: string;
  /** Owner organisation.  All event types belong to an org. */
  readonly organizationId: string;
  /**
   * Optional workspace scope.  When null the type is available org-wide
   * and can be instantiated in any workspace (analogous to a team-level
   * event type in cal.com).
   */
  readonly workspaceId: string | null;
  /** Human-readable label shown in the UI. */
  readonly title: string;
  /** URL-safe unique identifier within the org (e.g. "tech-review"). */
  readonly slug: string;
  /** What this schedule type is about. */
  readonly description: string;
  /**
   * Maps to WorkspaceScheduleItem.type.
   * Determines how the item is categorised in the schedule timeline.
   */
  readonly itemType: "milestone" | "follow-up" | "maintenance";
  /** Estimated duration displayed in the catalog (e.g. "1–2 小時"). */
  readonly durationLabel: string;
  /** Whether this event type is visible and selectable. */
  readonly isActive: boolean;
  /** Skill IDs that are typically required for this event type. */
  readonly requiredSkillIds: readonly string[];
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export const DEFAULT_SCHEDULE_EVENT_TYPES = {
  milestone: {
    slug: "milestone",
    itemType: "milestone",
    title: "里程碑排程",
    description: "專案生命週期中的關鍵檢查點，用於標記重要進度或交付物。",
    durationLabel: "1–2 小時",
  },
  followUp: {
    slug: "follow-up",
    itemType: "follow-up",
    title: "後續跟進",
    description: "定期追蹤工作區狀態與待辦事項的跟進會議。",
    durationLabel: "30–60 分鐘",
  },
  maintenance: {
    slug: "maintenance",
    itemType: "maintenance",
    title: "例行維護",
    description: "系統或流程的週期性維護排程，確保工作區持續穩定運行。",
    durationLabel: "2–4 小時",
  },
} as const satisfies Record<
  "milestone" | "followUp" | "maintenance",
  Pick<ScheduleEventType, "slug" | "itemType" | "title" | "description" | "durationLabel">
>;
