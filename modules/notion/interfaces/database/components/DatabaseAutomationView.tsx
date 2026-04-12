"use client";

/**
 * Module: notion/subdomains/database
 * Layer: interfaces/components
 * Purpose: Manage automation rules for a database — list/create/toggle/delete.
 */

import { useEffect, useState, useTransition } from "react";
import type { DatabaseAutomationSnapshot, AutomationTrigger, AutomationActionType } from "../../../subdomains/database/application/dto/database.dto";
import { getAutomations } from "../queries";
import { createAutomation, updateAutomation, deleteAutomation } from "../_actions/database.actions";

interface Props {
  databaseId: string;
  accountId: string;
  currentUserId: string;
}

const TRIGGER_OPTIONS: { value: AutomationTrigger; label: string }[] = [
  { value: "record_created", label: "Record created" },
  { value: "record_updated", label: "Record updated" },
  { value: "record_deleted", label: "Record deleted" },
  { value: "property_changed", label: "Property changed" },
];

const ACTION_OPTIONS: { value: AutomationActionType; label: string }[] = [
  { value: "send_notification", label: "Send notification" },
  { value: "update_property", label: "Update property" },
  { value: "create_record", label: "Create record" },
  { value: "webhook", label: "Call webhook" },
];

export function DatabaseAutomationView({ databaseId, accountId, currentUserId }: Props) {
  const [automations, setAutomations] = useState<DatabaseAutomationSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [trigger, setTrigger] = useState<AutomationTrigger>("record_created");
  const [actionType, setActionType] = useState<AutomationActionType>("send_notification");
  const [, startTransition] = useTransition();

  useEffect(() => {
    getAutomations(accountId, databaseId)
      .then(setAutomations)
      .finally(() => setLoading(false));
  }, [accountId, databaseId]);

  function handleCreate() {
    if (!name.trim()) return;
    startTransition(async () => {
      const result = await createAutomation({
        databaseId,
        accountId,
        name: name.trim(),
        trigger,
        actions: [{ type: actionType, config: {} }],
        createdByUserId: currentUserId,
      });
      if (result.success) {
        const updated = await getAutomations(accountId, databaseId);
        setAutomations(updated);
        setName("");
        setShowForm(false);
      }
    });
  }

  function handleToggle(automation: DatabaseAutomationSnapshot) {
    startTransition(async () => {
      await updateAutomation({
        id: automation.id,
        accountId,
        databaseId,
        enabled: !automation.enabled,
      });
      setAutomations((prev) =>
        prev.map((a) => (a.id === automation.id ? { ...a, enabled: !a.enabled } : a)),
      );
    });
  }

  function handleDelete(automationId: string) {
    startTransition(async () => {
      await deleteAutomation(automationId, accountId, databaseId);
      setAutomations((prev) => prev.filter((a) => a.id !== automationId));
    });
  }

  if (loading) return <div className="p-4 text-sm text-muted-foreground">Loading automations…</div>;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Automations</h3>
        <button
          className="text-xs px-2 py-1 rounded bg-primary text-primary-foreground"
          onClick={() => setShowForm((v) => !v)}
        >
          + New automation
        </button>
      </div>

      {showForm && (
        <div className="border rounded p-3 space-y-2 text-sm">
          <input
            className="w-full border rounded px-2 py-1 text-sm"
            placeholder="Automation name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="flex gap-2">
            <select
              className="border rounded px-2 py-1 text-xs flex-1"
              value={trigger}
              onChange={(e) => setTrigger(e.target.value as AutomationTrigger)}
            >
              {TRIGGER_OPTIONS.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <select
              className="border rounded px-2 py-1 text-xs flex-1"
              value={actionType}
              onChange={(e) => setActionType(e.target.value as AutomationActionType)}
            >
              {ACTION_OPTIONS.map((a) => (
                <option key={a.value} value={a.value}>{a.label}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button
              className="text-xs px-3 py-1 rounded bg-primary text-primary-foreground"
              onClick={handleCreate}
            >
              Create
            </button>
            <button
              className="text-xs px-3 py-1 rounded border"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {automations.length === 0 ? (
        <p className="text-xs text-muted-foreground">No automations yet.</p>
      ) : (
        <ul className="space-y-2">
          {automations.map((a) => (
            <li key={a.id} className="flex items-center justify-between border rounded px-3 py-2 text-sm">
              <div className="space-y-0.5">
                <p className="font-medium">{a.name}</p>
                <p className="text-xs text-muted-foreground">
                  Trigger: {a.trigger} · Action: {a.actions[0]?.type ?? "—"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className={`text-xs px-2 py-0.5 rounded ${a.enabled ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}
                  onClick={() => handleToggle(a)}
                >
                  {a.enabled ? "Enabled" : "Disabled"}
                </button>
                <button
                  className="text-xs text-destructive"
                  onClick={() => handleDelete(a.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
