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
} from "../interfaces/_actions/database.actions";

export {
  createRecord,
  updateRecord,
  deleteRecord,
} from "../interfaces/_actions/record.actions";

export {
  createView,
  updateView,
  deleteView,
} from "../interfaces/_actions/view.actions";

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
export { DatabaseCalendarView } from "../interfaces/components/DatabaseCalendarView";
export { DatabaseGalleryView } from "../interfaces/components/DatabaseGalleryView";
export { DatabaseFormView } from "../interfaces/components/DatabaseFormView";

// Form entity types
export type { DatabaseForm, CreateDatabaseFormInput, UpdateDatabaseFormInput } from "../domain/entities/database-form.entity";

// Automation entity types
export type {
  DatabaseAutomation,
  AutomationTrigger,
  AutomationActionType,
  AutomationCondition,
  AutomationAction,
  CreateAutomationInput,
  UpdateAutomationInput,
} from "../domain/entities/database-automation.entity";

// UI Components (automation)
export { DatabaseAutomationView } from "../interfaces/components/DatabaseAutomationView";

// Automation server actions
export {
  createAutomation,
  updateAutomation,
  deleteAutomation,
} from "../interfaces/_actions/knowledge-database-automation.actions";

// Automation queries
export { getAutomations } from "../interfaces/queries/knowledge-database-automation.queries";

// ── FieldComputationService ────────────────────────────────────────────────────
export type {
  RelationFieldConfig,
  RelationValue,
  FormulaFieldConfig,
  FormulaResult,
  RollupFieldConfig,
  RollupAggregation,
  RollupResult,
  ComputedFieldValue,
} from "../application/services/field-computation.service";
export {
  resolveRelationValue,
  evaluateFormula,
  computeRollup,
  resolveComputedFields,
} from "../application/services/field-computation.service";
