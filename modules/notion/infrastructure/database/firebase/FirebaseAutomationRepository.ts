/**
 * Module: notion/subdomains/database
 * Layer: infrastructure/firebase
 * Firestore: accounts/{accountId}/knowledgeDatabases/{databaseId}/automations/{automationId}
 */

import { firestoreInfrastructureApi } from "@/modules/platform/api/infrastructure";
import { v7 as generateId } from "@lib-uuid";

import type {
  DatabaseAutomationSnapshot,
  AutomationCondition,
  AutomationAction,
} from "../../../subdomains/database/domain/aggregates/DatabaseAutomation";
import type { AutomationRepository, CreateAutomationInput, UpdateAutomationInput } from "../../../subdomains/database/domain/repositories/AutomationRepository";

function automationsPath(accountId: string, databaseId: string): string {
  return `accounts/${accountId}/knowledgeDatabases/${databaseId}/automations`;
}

function automationPath(accountId: string, databaseId: string, automationId: string): string {
  return `accounts/${accountId}/knowledgeDatabases/${databaseId}/automations/${automationId}`;
}

function toCondition(c: Record<string, unknown>): AutomationCondition {
  return {
    fieldId: typeof c.fieldId === "string" ? c.fieldId : "",
    operator: (c.operator as AutomationCondition["operator"]) ?? "equals",
    value: typeof c.value === "string" ? c.value : undefined,
  };
}

function toAction(a: Record<string, unknown>): AutomationAction {
  return {
    type: (a.type as AutomationAction["type"]) ?? "send-notification",
    config: typeof a.config === "object" && a.config !== null ? (a.config as Record<string, string>) : {},
  };
}

function toAutomation(id: string, data: Record<string, unknown>): DatabaseAutomationSnapshot {
  return {
    id,
    databaseId: typeof data.databaseId === "string" ? data.databaseId : "",
    accountId: typeof data.accountId === "string" ? data.accountId : "",
    name: typeof data.name === "string" ? data.name : "",
    enabled: data.enabled !== false,
    trigger: (data.trigger as DatabaseAutomationSnapshot["trigger"]) ?? "record-created",
    triggerFieldId: typeof data.triggerFieldId === "string" ? data.triggerFieldId : undefined,
    conditions: Array.isArray(data.conditions) ? (data.conditions as Record<string, unknown>[]).map(toCondition) : [],
    actions: Array.isArray(data.actions) ? (data.actions as Record<string, unknown>[]).map(toAction) : [],
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : new Date().toISOString(),
    updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : new Date().toISOString(),
  };
}

export class FirebaseAutomationRepository implements AutomationRepository {
  async create(input: CreateAutomationInput): Promise<DatabaseAutomationSnapshot> {
    const id = generateId();
    const now = new Date().toISOString();
    const payload = {
      databaseId: input.databaseId,
      accountId: input.accountId,
      name: input.name,
      enabled: true,
      trigger: input.trigger,
      triggerFieldId: input.triggerFieldId ?? null,
      conditions: input.conditions ?? [],
      actions: input.actions ?? [],
      createdByUserId: input.createdByUserId,
      createdAtISO: now,
      updatedAtISO: now,
    };
    await firestoreInfrastructureApi.set(automationPath(input.accountId, input.databaseId, id), payload);
    return toAutomation(id, payload);
  }

  async update(input: UpdateAutomationInput): Promise<DatabaseAutomationSnapshot | null> {
    const { id, accountId, databaseId, ...fields } = input;
    const path = automationPath(accountId, databaseId, id);
    const updates: Record<string, unknown> = { ...fields, updatedAtISO: new Date().toISOString() };
    await firestoreInfrastructureApi.update(path, updates);
    const snap = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!snap) return null;
    return toAutomation(id, snap);
  }

  async delete(id: string, accountId: string, databaseId: string): Promise<void> {
    await firestoreInfrastructureApi.delete(automationPath(accountId, databaseId, id));
  }

  async listByDatabase(accountId: string, databaseId: string): Promise<DatabaseAutomationSnapshot[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      automationsPath(accountId, databaseId),
      [{ field: "databaseId", op: "==", value: databaseId }],
      { orderBy: [{ field: "createdAtISO", direction: "asc" }] },
    );
    return docs.map((d) => toAutomation(d.id, d.data));
  }
}
