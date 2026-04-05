# Domain Events — knowledge-database

---

## Database 事件

### knowledge-database.database_created

```typescript
interface DatabaseCreatedEvent {
  type: "knowledge-database.database_created";
  databaseId: string;
  workspaceId: string;
  accountId: string;
  name: string;
  createdByUserId: string;
  occurredAtISO: string;
}
```

### knowledge-database.database_renamed

```typescript
interface DatabaseRenamedEvent {
  type: "knowledge-database.database_renamed";
  databaseId: string;
  workspaceId: string;
  name: string;
  renamedByUserId: string;
  occurredAtISO: string;
}
```

### knowledge-database.field_added

```typescript
interface FieldAddedEvent {
  type: "knowledge-database.field_added";
  databaseId: string;
  fieldId: string;
  fieldName: string;
  fieldType: string;
  addedByUserId: string;
  occurredAtISO: string;
}
```

### knowledge-database.field_deleted

```typescript
interface FieldDeletedEvent {
  type: "knowledge-database.field_deleted";
  databaseId: string;
  fieldId: string;
  deletedByUserId: string;
  occurredAtISO: string;
}
```

---

## Record 事件

### knowledge-database.record_added

```typescript
interface RecordAddedEvent {
  type: "knowledge-database.record_added";
  recordId: string;
  databaseId: string;
  workspaceId: string;
  accountId: string;
  addedByUserId: string;
  occurredAtISO: string;
}
```

### knowledge-database.record_updated

```typescript
interface RecordUpdatedEvent {
  type: "knowledge-database.record_updated";
  recordId: string;
  databaseId: string;
  workspaceId: string;
  updatedFields: string[];              // fieldIds that changed
  updatedByUserId: string;
  occurredAtISO: string;
}
```

### knowledge-database.record_deleted

```typescript
interface RecordDeletedEvent {
  type: "knowledge-database.record_deleted";
  recordId: string;
  databaseId: string;
  workspaceId: string;
  deletedByUserId: string;
  occurredAtISO: string;
}
```

### knowledge-database.record_linked

```typescript
interface RecordLinkedEvent {
  type: "knowledge-database.record_linked";
  recordId: string;
  fieldId: string;
  targetRecordId: string;
  databaseId: string;
  workspaceId: string;
  linkedByUserId: string;
  occurredAtISO: string;
}
```

---

## View 事件

### knowledge-database.view_created

```typescript
interface ViewCreatedEvent {
  type: "knowledge-database.view_created";
  viewId: string;
  databaseId: string;
  workspaceId: string;
  viewName: string;
  viewType: string;
  createdByUserId: string;
  occurredAtISO: string;
}
```

### knowledge-database.view_updated

```typescript
interface ViewUpdatedEvent {
  type: "knowledge-database.view_updated";
  viewId: string;
  databaseId: string;
  workspaceId: string;
  changedSettings: string[];            // e.g. ["filters", "sorts", "groupBy"]
  updatedByUserId: string;
  occurredAtISO: string;
}
```
