# Repositories — knowledge-database

---

## IDatabaseRepository

```typescript
export interface IDatabaseRepository {
  getById(databaseId: string): Promise<Database>;
  listByWorkspace(workspaceId: string, accountId: string): Promise<Database[]>;
  save(database: Database): Promise<void>;
  delete(databaseId: string): Promise<void>;
}
```

---

## IRecordRepository

```typescript
export interface IRecordRepository {
  getById(recordId: string): Promise<DatabaseRecord>;
  listByDatabase(params: {
    databaseId: string;
    filters?: FilterRule[];
    sorts?: SortRule[];
    limit?: number;
    cursor?: string;
  }): Promise<DatabaseRecord[]>;
  save(record: DatabaseRecord): Promise<void>;
  softDelete(recordId: string): Promise<void>;
  getByIds(recordIds: string[]): Promise<DatabaseRecord[]>;
}
```

---

## IViewRepository

```typescript
export interface IViewRepository {
  getById(viewId: string): Promise<View>;
  listByDatabase(databaseId: string): Promise<View[]>;
  save(view: View): Promise<void>;
  delete(viewId: string): Promise<void>;
}
```

---

## Firestore Collection 設計

| Collection | Document ID | 說明 |
|---|---|---|
| `knowledge_databases` | `{databaseId}` | Database documents（含 fields schema） |
| `knowledge_db_records` | `{recordId}` | Record documents |
| `knowledge_db_views` | `{viewId}` | View configuration documents |

### Index 需求（預計）

| Collection | Fields | Purpose |
|---|---|---|
| `knowledge_databases` | `workspaceId`, `createdAtISO` | Workspace database list |
| `knowledge_db_records` | `databaseId`, `order` | Default record ordering |
| `knowledge_db_views` | `databaseId` | Views per database |
