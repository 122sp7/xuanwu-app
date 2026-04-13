/**
 * Module: notion/subdomains/database
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
} from "../../../interfaces/database/_actions/database.actions";

// Queries
export {
  getDatabases,
  getDatabase,
  getRecords,
  getViews,
  getAutomations,
} from "../../../interfaces/database/queries";

// UI components
export { DatabaseDialog } from "../../../interfaces/database/components/DatabaseDialog";
export { DatabaseTablePanel } from "../../../interfaces/database/components/DatabaseTablePanel";
export { DatabaseBoardPanel } from "../../../interfaces/database/components/DatabaseBoardPanel";
export { DatabaseListPanel } from "../../../interfaces/database/components/DatabaseListPanel";
export { DatabaseCalendarPanel } from "../../../interfaces/database/components/DatabaseCalendarPanel";
export { DatabaseGalleryPanel } from "../../../interfaces/database/components/DatabaseGalleryPanel";
export { DatabaseFormPanel } from "../../../interfaces/database/components/DatabaseFormPanel";
export { DatabaseAutomationPanel } from "../../../interfaces/database/components/DatabaseAutomationPanel";
export { KnowledgeDatabasesPanel } from "../../../interfaces/database/components/KnowledgeDatabasesPanel";
export type { KnowledgeDatabasesPanelProps } from "../../../interfaces/database/components/KnowledgeDatabasesPanel";
export { AddFieldDialog, FIELD_TYPES } from "../../../interfaces/database/components/DatabaseAddFieldDialog";
export { DatabaseDetailPanel } from "../../../interfaces/database/components/DatabaseDetailPanel";
export type { DatabaseDetailPanelProps } from "../../../interfaces/database/components/DatabaseDetailPanel";
export { DatabaseFormsPanel } from "../../../interfaces/database/components/DatabaseFormsPanel";
export type { DatabaseFormsPanelProps } from "../../../interfaces/database/components/DatabaseFormsPanel";

