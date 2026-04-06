"use client";

/**
 * Module: knowledge-database
 * Layer: interfaces/components
 * Purpose: DatabaseFormView — public-facing form to collect one Record into a Database.
 *
 * Displays fields from the database and submits a new record via createRecord.
 */

import { useState, useTransition } from "react";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@ui-shadcn/ui/button";
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";
import { Textarea } from "@ui-shadcn/ui/textarea";

import { createRecord } from "../_actions/knowledge-database.actions";
import type { Database, Field } from "../../domain/entities/database.entity";

interface DatabaseFormViewProps {
  database: Database;
  accountId: string;
  workspaceId: string;
  /** The user submitting the form. Pass anonymous ID or guest token for public forms. */
  submitterId: string;
  /** Optional: restrict to a subset of fields. */
  fieldIds?: string[];
  title?: string;
  description?: string;
}

function FieldInput({
  field,
  value,
  onChange,
  disabled,
}: {
  field: Field;
  value: unknown;
  onChange: (v: unknown) => void;
  disabled: boolean;
}) {
  const strValue = value == null ? "" : String(value);

  if (field.type === "checkbox") {
    return (
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id={`field-${field.id}`}
          checked={Boolean(value)}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 rounded border-border"
        />
        <Label htmlFor={`field-${field.id}`}>{field.name}</Label>
      </div>
    );
  }

  if (field.type === "number") {
    return (
      <div className="space-y-1.5">
        <Label htmlFor={`field-${field.id}`}>
          {field.name}
          {field.required && <span className="ml-0.5 text-destructive">*</span>}
        </Label>
        <Input
          id={`field-${field.id}`}
          type="number"
          value={strValue}
          disabled={disabled}
          required={field.required}
          onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
        />
      </div>
    );
  }

  if (field.type === "date") {
    return (
      <div className="space-y-1.5">
        <Label htmlFor={`field-${field.id}`}>
          {field.name}
          {field.required && <span className="ml-0.5 text-destructive">*</span>}
        </Label>
        <Input
          id={`field-${field.id}`}
          type="date"
          value={strValue}
          disabled={disabled}
          required={field.required}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  }

  if (field.type === "url" || field.type === "email") {
    return (
      <div className="space-y-1.5">
        <Label htmlFor={`field-${field.id}`}>
          {field.name}
          {field.required && <span className="ml-0.5 text-destructive">*</span>}
        </Label>
        <Input
          id={`field-${field.id}`}
          type={field.type}
          value={strValue}
          disabled={disabled}
          required={field.required}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  }

  // Default: text / select / multi_select (text input for simplicity)
  return (
    <div className="space-y-1.5">
      <Label htmlFor={`field-${field.id}`}>
        {field.name}
        {field.required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      {field.type === "text" ? (
        <Textarea
          id={`field-${field.id}`}
          value={strValue}
          disabled={disabled}
          required={field.required}
          rows={2}
          className="resize-none text-sm"
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <Input
          id={`field-${field.id}`}
          type="text"
          value={strValue}
          disabled={disabled}
          required={field.required}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

export function DatabaseFormView({
  database,
  accountId,
  workspaceId,
  submitterId,
  fieldIds,
  title,
  description,
}: DatabaseFormViewProps) {
  const visibleFields = fieldIds && fieldIds.length > 0
    ? database.fields.filter((f) => fieldIds.includes(f.id))
    : database.fields;

  const [values, setValues] = useState<Record<string, unknown>>({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleChange(fieldId: string, value: unknown) {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await createRecord({
        databaseId: database.id,
        workspaceId,
        accountId,
        properties: values,
        createdByUserId: submitterId,
      });
      if (result.success) {
        setSubmitted(true);
        setValues({});
      } else {
        setError("提交失敗，請稍後再試。");
      }
    });
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
        <CheckCircle2 className="h-10 w-10 text-green-500" />
        <p className="text-lg font-semibold">提交成功！</p>
        <p className="text-sm text-muted-foreground">您的回應已記錄。</p>
        <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
          再次填寫
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6 py-8">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">{title ?? database.name}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {visibleFields.map((field) => (
          <FieldInput
            key={field.id}
            field={field}
            value={values[field.id]}
            onChange={(v) => handleChange(field.id, v)}
            disabled={isPending}
          />
        ))}

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "提交中…" : "送出表單"}
        </Button>
      </form>
    </div>
  );
}
