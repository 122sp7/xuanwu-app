/**
 * Module: knowledge-database
 * Layer: infrastructure/firebase
 * Firestore: accounts/{accountId}/knowledgeDatabases/{databaseId}/automations/{automationId}
 */

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import { v7 as generateId } from "@lib-uuid";

import type {
  DatabaseAutomation,
  AutomationCondition,
  AutomationAction,
  CreateAutomationInput,
  UpdateAutomationInput,
} from "../../domain/entities/database-automation.entity";
import type { IAutomationRepository } from "../../domain/repositories/IAutomationRepository";

function automationsCol(
  db: ReturnType<typeof getFirestore>,
  accountId: string,
  databaseId: string,
) {
  return collection(db, "accounts", accountId, "knowledgeDatabases", databaseId, "automations");
}

function automationDocRef(
  db: ReturnType<typeof getFirestore>,
  accountId: string,
  databaseId: string,
  automationId: string,
) {
  return doc(db, "accounts", accountId, "knowledgeDatabases", databaseId, "automations", automationId);
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
    type: (a.type as AutomationAction["type"]) ?? "send_notification",
    config:
      typeof a.config === "object" && a.config !== null
        ? (a.config as Record<string, string>)
        : {},
  };
}

function toAutomation(id: string, data: Record<string, unknown>): DatabaseAutomation {
  return {
    id,
    databaseId: typeof data.databaseId === "string" ? data.databaseId : "",
    accountId: typeof data.accountId === "string" ? data.accountId : "",
    name: typeof data.name === "string" ? data.name : "",
    enabled: data.enabled !== false,
    trigger: (data.trigger as DatabaseAutomation["trigger"]) ?? "record_created",
    triggerFieldId: typeof data.triggerFieldId === "string" ? data.triggerFieldId : undefined,
    conditions: Array.isArray(data.conditions)
      ? (data.conditions as Record<string, unknown>[]).map(toCondition)
      : [],
    actions: Array.isArray(data.actions)
      ? (data.actions as Record<string, unknown>[]).map(toAction)
      : [],
    createdByUserId: typeof data.createdByUserId === "string" ? data.createdByUserId : "",
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : new Date().toISOString(),
    updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : new Date().toISOString(),
  };
}

export class FirebaseAutomationRepository implements IAutomationRepository {
  private readonly db = getFirestore(firebaseClientApp);

  async create(input: CreateAutomationInput): Promise<DatabaseAutomation> {
    const id = generateId();
    const now = new Date().toISOString();
    const docRef = automationDocRef(this.db, input.accountId, input.databaseId, id);
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
      serverCreatedAt: serverTimestamp(),
    };
    await setDoc(docRef, payload);
    return toAutomation(id, payload);
  }

  async update(input: UpdateAutomationInput): Promise<DatabaseAutomation | null> {
    const { id, accountId, databaseId, ...fields } = input;
    const docRef = automationDocRef(this.db, accountId, databaseId, id);
    const updates: Record<string, unknown> = { ...fields, updatedAtISO: new Date().toISOString() };
    await updateDoc(docRef, updates);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return toAutomation(id, snap.data() as Record<string, unknown>);
  }

  async delete(id: string, accountId: string, databaseId: string): Promise<void> {
    const docRef = automationDocRef(this.db, accountId, databaseId, id);
    await deleteDoc(docRef);
  }

  async listByDatabase(accountId: string, databaseId: string): Promise<DatabaseAutomation[]> {
    const q = query(
      automationsCol(this.db, accountId, databaseId),
      where("databaseId", "==", databaseId),
      orderBy("createdAtISO", "asc"),
    );
    const snaps = await getDocs(q);
    return snaps.docs.map((d) => toAutomation(d.id, d.data() as Record<string, unknown>));
  }
}
