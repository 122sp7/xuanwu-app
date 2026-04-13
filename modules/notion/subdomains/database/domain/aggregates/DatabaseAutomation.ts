/**
 * Module: notion/subdomains/database
 * Layer: domain/aggregates
 * Purpose: DatabaseAutomation aggregate — event-driven automation rules on a database.
 */

export type AutomationTrigger =
  | "record_created"
  | "record-updated"
  | "record-deleted"
  | "property_changed";

export type AutomationActionType =
  | "send_notification"
  | "update_property"
  | "create_record"
  | "webhook";

export interface AutomationCondition {
  fieldId: string;
  operator: "equals" | "not_equals" | "is_empty" | "is_not_empty" | "contains";
  value?: unknown;
}

export interface AutomationAction {
  type: AutomationActionType;
  config: Record<string, string>;
}

export interface DatabaseAutomationSnapshot {
  id: string;
  databaseId: string;
  accountId: string;
  name: string;
  enabled: boolean;
  trigger: AutomationTrigger;
  triggerFieldId?: string;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  createdAtISO: string;
  updatedAtISO: string;
}

export type AutomationId = string;
