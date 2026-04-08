/**
 * Module: knowledge-database
 * Layer: interfaces/_actions
 * Purpose: Barrel re-export for all knowledge-database server actions.
 *          Split by aggregate for IDDD single-responsibility:
 *  - database.actions.ts (Database aggregate)
 *  - record.actions.ts   (Record aggregate)
 *  - view.actions.ts     (View aggregate)
 */

export { createDatabase, updateDatabase, addDatabaseField, archiveDatabase } from "./database.actions";
export { createRecord, updateRecord, deleteRecord } from "./record.actions";
export { createView, updateView, deleteView } from "./view.actions";
