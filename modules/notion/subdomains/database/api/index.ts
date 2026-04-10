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
} from "../interfaces/_actions/database.actions";

// Queries
export {
  getDatabases,
  getDatabase,
  getRecords,
  getViews,
  getAutomations,
} from "../interfaces/queries";

// UI components
export { DatabaseDialog } from "../interfaces/components/DatabaseDialog";
export { DatabaseTableView } from "../interfaces/components/DatabaseTableView";
export { DatabaseBoardView } from "../interfaces/components/DatabaseBoardView";
export { DatabaseListView } from "../interfaces/components/DatabaseListView";
export { DatabaseCalendarView } from "../interfaces/components/DatabaseCalendarView";
export { DatabaseGalleryView } from "../interfaces/components/DatabaseGalleryView";
export { DatabaseFormView } from "../interfaces/components/DatabaseFormView";
export { DatabaseAutomationView } from "../interfaces/components/DatabaseAutomationView";
export { KnowledgeDatabasesRouteScreen } from "../interfaces/components/KnowledgeDatabasesRouteScreen";
export { AddFieldDialog, FIELD_TYPES } from "../interfaces/components/DatabaseAddFieldDialog";
export { DatabaseDetailPage } from "../interfaces/components/DatabaseDetailPage";
export type { DatabaseDetailPageProps } from "../interfaces/components/DatabaseDetailPage";
export { DatabaseFormsPage } from "../interfaces/components/DatabaseFormsPage";
export type { DatabaseFormsPageProps } from "../interfaces/components/DatabaseFormsPage";
