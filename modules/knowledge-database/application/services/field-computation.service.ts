/**
 * Module: knowledge-database
 * Layer: application/services
 * Purpose: FieldComputationService — resolves computed field values for a record.
 *
 * Handles: relation (link resolution), formula (expression evaluation), rollup (aggregation).
 * This is pure application logic — no side effects, no I/O. Fully testable in isolation.
 */

import type { Field, FieldType } from "../../domain/entities/database.entity";
import type { DatabaseRecord } from "../../domain/entities/record.entity";

// ── Relation ──────────────────────────────────────────────────────────────────

export interface RelationFieldConfig {
  readonly targetDatabaseId: string;
  readonly syncReverse: boolean;
  readonly reverseFieldName?: string;
}

export type RelationValue = ReadonlyArray<string>;

export function resolveRelationValue(record: DatabaseRecord, field: Field): RelationValue {
  if (field.type !== "relation") return [];
  const raw = record.properties.get(field.id);
  if (!Array.isArray(raw)) return [];
  return raw.filter((v): v is string => typeof v === "string");
}

// ── Formula ───────────────────────────────────────────────────────────────────

export interface FormulaFieldConfig {
  readonly expression: string;
}

export type FormulaResult = string | number | boolean | null;

/**
 * Evaluates a formula for a record using a safe restricted expression evaluator.
 * Supports prop('FieldName') references, arithmetic, comparison, and boolean operators.
 * Returns null on evaluation error or unsafe expression.
 */
export function evaluateFormula(
  record: DatabaseRecord,
  field: Field,
  allFields: ReadonlyArray<Field>,
): FormulaResult {
  if (field.type !== "formula") return null;
  const config = field.config as Partial<FormulaFieldConfig>;
  if (!config.expression || typeof config.expression !== "string") return null;

  const props: Record<string, unknown> = {};
  for (const f of allFields) {
    if (f.type === "formula" || f.type === "rollup") continue;
    props[f.name] = record.properties.get(f.id) ?? null;
  }

  const resolved = config.expression.replace(
    /prop\(['"]([^'"]+)['"]\)/g,
    (_m, name: string) => {
      const val = props[name];
      if (val === null || val === undefined) return "null";
      if (typeof val === "string") return JSON.stringify(val);
      if (typeof val === "number" || typeof val === "boolean") return String(val);
      return "null";
    },
  );

  // Allowlist: digits, arithmetic operators, comparisons, booleans, null, spaces, parens, quotes, dots
  if (!/^[\d\s+\-*/()!&|<>=."'nulltruefals]+$/.test(resolved)) return null;

  try {
    const result = new Function(`"use strict"; return (${resolved});`)() as unknown;
    if (typeof result === "string" || typeof result === "number" || typeof result === "boolean") return result;
    return null;
  } catch {
    return null;
  }
}

// ── Rollup ────────────────────────────────────────────────────────────────────

export type RollupAggregation =
  | "count" | "count_values" | "count_unique"
  | "sum" | "average" | "min" | "max" | "range"
  | "percent_checked" | "percent_unchecked";

export interface RollupFieldConfig {
  readonly relationFieldId: string;
  readonly rollupFieldId: string;
  readonly aggregation: RollupAggregation;
}

export type RollupResult = number | string | null;

export function computeRollup(
  record: DatabaseRecord,
  field: Field,
  relatedRecords: ReadonlyArray<DatabaseRecord>,
  _relatedFields: ReadonlyArray<Field>,
): RollupResult {
  if (field.type !== "rollup") return null;
  const config = field.config as Partial<RollupFieldConfig>;
  if (!config.rollupFieldId || !config.aggregation) return null;

  const values = relatedRecords.map((r) => r.properties.get(config.rollupFieldId!));

  switch (config.aggregation) {
    case "count": return relatedRecords.length;
    case "count_values": return values.filter((v) => v !== null && v !== undefined && v !== "").length;
    case "count_unique": return new Set(values.map((v) => JSON.stringify(v))).size;
    case "sum": {
      const nums = values.filter((v): v is number => typeof v === "number");
      return nums.reduce((a, n) => a + n, 0);
    }
    case "average": {
      const nums = values.filter((v): v is number => typeof v === "number");
      return nums.length === 0 ? null : nums.reduce((a, n) => a + n, 0) / nums.length;
    }
    case "min": {
      const nums = values.filter((v): v is number => typeof v === "number");
      return nums.length === 0 ? null : Math.min(...nums);
    }
    case "max": {
      const nums = values.filter((v): v is number => typeof v === "number");
      return nums.length === 0 ? null : Math.max(...nums);
    }
    case "range": {
      const nums = values.filter((v): v is number => typeof v === "number");
      return nums.length === 0 ? null : Math.max(...nums) - Math.min(...nums);
    }
    case "percent_checked": {
      if (relatedRecords.length === 0) return 0;
      return Math.round((values.filter((v) => v === true).length / relatedRecords.length) * 100);
    }
    case "percent_unchecked": {
      if (relatedRecords.length === 0) return 0;
      return Math.round((values.filter((v) => v !== true).length / relatedRecords.length) * 100);
    }
    default: return null;
  }
}

// ── Unified entry point ───────────────────────────────────────────────────────

export type ComputedFieldValue = RelationValue | FormulaResult | RollupResult;

export function resolveComputedFields(input: {
  readonly record: DatabaseRecord;
  readonly fields: ReadonlyArray<Field>;
  readonly relatedRecordsMap?: ReadonlyMap<string, ReadonlyArray<DatabaseRecord>>;
  readonly relatedFieldsMap?: ReadonlyMap<string, ReadonlyArray<Field>>;
}): Map<string, ComputedFieldValue> {
  const { record, fields, relatedRecordsMap = new Map(), relatedFieldsMap = new Map() } = input;
  const result = new Map<string, ComputedFieldValue>();
  const computedTypes: ReadonlyArray<FieldType> = ["relation", "formula", "rollup"];

  for (const field of fields) {
    if (!computedTypes.includes(field.type)) continue;
    switch (field.type) {
      case "relation":
        result.set(field.id, resolveRelationValue(record, field));
        break;
      case "formula":
        result.set(field.id, evaluateFormula(record, field, fields));
        break;
      case "rollup": {
        const cfg = field.config as Partial<RollupFieldConfig>;
        const relField = cfg.relationFieldId ? fields.find((f) => f.id === cfg.relationFieldId) : undefined;
        result.set(field.id, computeRollup(
          record, field,
          relField ? (relatedRecordsMap.get(relField.id) ?? []) : [],
          relField ? (relatedFieldsMap.get(relField.id) ?? []) : [],
        ));
        break;
      }
    }
  }
  return result;
}
