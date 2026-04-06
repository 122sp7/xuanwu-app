/**
 * knowledge-database public API boundary
 */

export type { Database, Field, FieldType } from "../domain/entities/database.entity";
export type { DatabaseRecord } from "../domain/entities/record.entity";
export type { View, ViewType, FilterRule, SortRule } from "../domain/entities/view.entity";
export type { CreateDatabaseInput, UpdateDatabaseInput, AddFieldInput } from "../domain/repositories/IDatabaseRepository";
export type { CreateRecordInput, UpdateRecordInput } from "../domain/repositories/IDatabaseRecordRepository";
export type { CreateViewInput, UpdateViewInput } from "../domain/repositories/IViewRepository";

export type DatabaseId = string;
export type RecordId = string;
export type ViewId = string;
export type FieldId = string;

// Server Actions
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
} from "../interfaces/_actions/knowledge-database.actions";

// Queries
export {
  getDatabases,
  getDatabase,
  getRecords,
  getViews,
} from "../interfaces/queries/knowledge-database.queries";

// UI Components
export { DatabaseDialog } from "../interfaces/components/DatabaseDialog";
export { DatabaseTableView } from "../interfaces/components/DatabaseTableView";
export { DatabaseBoardView } from "../interfaces/components/DatabaseBoardView";
export { DatabaseListView } from "../interfaces/components/DatabaseListView";
