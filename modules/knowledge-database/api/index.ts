/**
 * knowledge-database public API boundary
 */

export type { Database, Field, FieldType } from "../domain/entities/database.entity";
export type { DatabaseRecord } from "../domain/entities/record.entity";
export type { View, ViewType, FilterRule, SortRule } from "../domain/entities/view.entity";

export type DatabaseId = string;
export type RecordId = string;
export type ViewId = string;
export type FieldId = string;
