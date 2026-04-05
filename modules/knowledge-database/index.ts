/**
 * knowledge-database module — public barrel export
 */

export type { Database, Field, FieldType } from "./domain/entities/database.entity";
export type { DatabaseRecord } from "./domain/entities/record.entity";
export type { View, ViewType, FilterRule, SortRule } from "./domain/entities/view.entity";

export * from "./api";

// TODO: Server Actions
// export { createDatabase } from "./interfaces/_actions/database.actions";
// export { addRecord } from "./interfaces/_actions/record.actions";
// export { createView } from "./interfaces/_actions/view.actions";

// TODO: Queries
// export { useDatabase } from "./interfaces/queries/useDatabase";
// export { useRecords } from "./interfaces/queries/useRecords";
// export { useViews } from "./interfaces/queries/useViews";
