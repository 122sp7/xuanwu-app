/**
 * Module: notion/subdomains/knowledge-database
 * Layer: api (public boundary)
 * Purpose: Exposes only what external consumers need.
 *          All cross-module access must go through this file only.
 *
 * Open Host Service contracts:
 *   - getDatabaseById  ??consumed by knowledge subdomain (opaque reference resolution)
 */

// Domain types
export type {
  DatabaseSnapshot,
  DatabaseSnapshot as Database,
  Field,
  FieldType,
  DatabaseId,
  FieldId,
} from "../domain/aggregates/Database";

export type {
  DatabaseRecordSnapshot,
  RecordId,
} from "../domain/aggregates/DatabaseRecord";

export type {
  ViewSnapshot,
  ViewType,
  FilterRule,
  SortRule,
  ViewId,
} from "../domain/aggregates/View";

export type {
  DatabaseAutomationSnapshot,
  AutomationTrigger,
  AutomationActionType,
  AutomationCondition,
  AutomationAction,
} from "../domain/aggregates/DatabaseAutomation";

// Repository input types
export type {
  CreateAutomationInput,
  UpdateAutomationInput,
} from "../domain/repositories/AutomationRepository";

// Application DTOs
export type {
  CreateDatabaseDto,
  UpdateDatabaseDto,
  AddFieldDto,
  ArchiveDatabaseDto,
  CreateRecordDto,
  UpdateRecordDto,
  DeleteRecordDto,
  CreateViewDto,
  UpdateViewDto,
  DeleteViewDto,
} from "../application/dto/DatabaseDto";

// Server actions
export {
  createDatabase,
  updateDatabase,
  addDatabaseField,
  archiveDatabase,
  createRecord,
  updateRecord,
  deleteRecord,
  createView,
  updateView,
  deleteView,
  createAutomation,
  updateAutomation,
  deleteAutomation,
} from "../../../interfaces/knowledge-database/_actions/knowledge-database.actions";

// Queries
export {
  getDatabases,
  getDatabase,
  getRecords,
  getViews,
  getAutomations,
} from "../../../interfaces/knowledge-database/queries";

// UI components are exported from ./ui to keep this barrel semantic-only.

