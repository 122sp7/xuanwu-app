/**
 * Module: notion/subdomains/database
 * Layer: api (public boundary)
 * Purpose: Exposes only what external consumers need.
 *          All cross-module access must go through this file only.
 * Status: Migration-Pending — awaiting full migration from modules/knowledge-database/
 *
 * Open Host Service contracts:
 *   - GetDatabaseById  — consumed by knowledge subdomain (opaque reference resolution)
 *   - LinkArticleToRecord — consumed by authoring subdomain (Article-Record link)
 */

// TODO: export Database, Record, View snapshot types
// TODO: export FieldType, ViewType
// TODO: export AddRecordDto, UpdateRecordDto, CreateViewDto
// TODO: export server actions (createDatabase, addField, addRecord, createView, ...)
// TODO: export queries (getDatabaseById, getRecordsByDatabase)
// TODO: export UI components (DatabaseTableView, DatabaseBoardView, ...)
// TODO: export Open Host Service functions (getDatabaseById, linkArticleToRecord)

export {};
