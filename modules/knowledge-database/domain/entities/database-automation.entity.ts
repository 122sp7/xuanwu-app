/**
 * Module: knowledge-database
 * Layer: domain/entities
 * Purpose: DatabaseAutomation — rules that trigger actions when database records change.
 *
 * Notion-equivalent: "Automations" tab on a database.
 * Trigger + Action pairs. Execution is handled by a background worker (QStash).
 */

export type AutomationTrigger =
  | "record_created"
  | "record_updated"
  | "record_deleted"
  | "property_changed";

export type AutomationActionType =
  | "send_notification"
  | "update_property"
  | "create_record"
  | "webhook";

export interface AutomationCondition {
  /** Field name to evaluate */
  fieldId: string;
  operator: "equals" | "not_equals" | "is_empty" | "is_not_empty" | "contains";
  value?: string;
}

export interface AutomationAction {
  type: AutomationActionType;
  /** Payload depends on type:
   *  send_notification → { recipientId, message }
   *  update_property   → { fieldId, value }
   *  create_record     → { databaseId }
   *  webhook           → { url, method }
   */
  config: Record<string, string>;
}

export interface DatabaseAutomation {
  id: string;
  databaseId: string;
  accountId: string;
  name: string;
  enabled: boolean;
  trigger: AutomationTrigger;
  /** Field that must change — only relevant for "property_changed" trigger */
  triggerFieldId?: string;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  createdByUserId: string;
  createdAtISO: string;
  updatedAtISO: string;
}

export interface CreateAutomationInput {
  databaseId: string;
  accountId: string;
  name: string;
  trigger: AutomationTrigger;
  triggerFieldId?: string;
  conditions?: AutomationCondition[];
  actions?: AutomationAction[];
  createdByUserId: string;
}

export interface UpdateAutomationInput {
  id: string;
  accountId: string;
  name?: string;
  enabled?: boolean;
  trigger?: AutomationTrigger;
  triggerFieldId?: string;
  conditions?: AutomationCondition[];
  actions?: AutomationAction[];
}
