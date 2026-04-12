/**
 * Module: notion/subdomains/database
 * Layer: api (public boundary)
 * Purpose: Exposes only what external consumers need.
 *          All cross-module access must go through this file only.
 *
 * Open Host Service contracts:
 *   - getDatabaseById  — consumed by knowledge subdomain (opaque reference resolution)
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
} from "../domain/repositories/IAutomationRepository";

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
export { DatabaseTableView } from "../../../interfaces/database/components/DatabaseTableView";
export { DatabaseBoardView } from "../../../interfaces/database/components/DatabaseBoardView";
export { DatabaseListView } from "../../../interfaces/database/components/DatabaseListView";
export { DatabaseCalendarView } from "../../../interfaces/database/components/DatabaseCalendarView";
export { DatabaseGalleryView } from "../../../interfaces/database/components/DatabaseGalleryView";
export { DatabaseFormView } from "../../../interfaces/database/components/DatabaseFormView";
export { DatabaseAutomationView } from "../../../interfaces/database/components/DatabaseAutomationView";
export { KnowledgeDatabasesPanel } from "../../../interfaces/database/components/KnowledgeDatabasesRouteScreen";
export type { KnowledgeDatabasesPanelProps } from "../../../interfaces/database/components/KnowledgeDatabasesRouteScreen";
export { AddFieldDialog, FIELD_TYPES } from "../../../interfaces/database/components/DatabaseAddFieldDialog";
export { DatabaseDetailPanel } from "../../../interfaces/database/components/DatabaseDetailPanel";
export type { DatabaseDetailPanelProps } from "../../../interfaces/database/components/DatabaseDetailPanel";
export { DatabaseFormsPanel } from "../../../interfaces/database/components/DatabaseFormsPanel";
export type { DatabaseFormsPanelProps } from "../../../interfaces/database/components/DatabaseFormsPanel";
