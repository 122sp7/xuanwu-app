/**
 * Module: notion/subdomains/database
 * Layer: domain/aggregates
 * Purpose: DatabaseAutomation aggregate — event-driven automation rules on a database.
 */

export type AutomationTrigger =
  | "record-created"
  | "record-updated"
  | "record-deleted"
  | "property-changed";

export type AutomationActionType =
  | "send-notification"
  | "update-property"
  | "create-record"
  | "webhook";

export interface AutomationCondition {
  fieldId: string;
  operator: "equals" | "not-equals" | "is-empty" | "is-not-empty" | "contains";
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
