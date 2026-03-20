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

export const SCHEDULE_REQUEST_CANCEL_REASON_LABEL = "工作區取消";
export const SCHEDULE_REQUEST_CANCEL_CONFIRM_TITLE = "確定要取消這筆資源請求嗎？";
export const SCHEDULE_REQUEST_CANCEL_CONFIRM_DESCRIPTION =
  "取消後，這筆請求會立即標記為已取消，並從組織端的待分派清單中移除。";
export const SCHEDULE_REQUEST_REFRESH_ERROR_MESSAGE =
  "資源請求列表更新失敗，請重新整理頁面後再試。";
export const SCHEDULE_REQUEST_CANCEL_KEEP_LABEL = "保留請求";
export const SCHEDULE_REQUEST_CANCEL_CONFIRM_ACTION_LABEL = "確認取消";
export const SCHEDULE_REQUEST_CANCEL_PENDING_LABEL = "取消中…";
