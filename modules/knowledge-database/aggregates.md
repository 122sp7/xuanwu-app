# Aggregates — knowledge-database

---

## Database（資料庫）— 聚合根

Database 持有欄位 Schema 定義與視圖清單，是整個 Database 一致性的邊界。

```typescript
type FieldType =
  | "text" | "number" | "select" | "multi_select"
  | "date" | "checkbox" | "url" | "email"
  | "relation" | "formula" | "rollup";

interface Field {
  id: string;
  name: string;
  type: FieldType;
  config: Record<string, unknown>;      // per-type config (e.g. select options)
  required: boolean;
  order: number;
}

interface Database {
  id: string;
  workspaceId: string;
  accountId: string;
  name: string;
  description: string | null;
  fields: Field[];                       // Schema definition
  viewIds: string[];                     // Ordered list of View IDs
  icon: string | null;
  coverImageUrl: string | null;
  createdByUserId: string;
  createdAtISO: string;
  updatedAtISO: string;
}
```

### Database 業務規則

- `fields` 至少一個欄位（預設 "Title" text 欄位）。
- 刪除 Field 前，所有 Record 的對應 `properties` 值需清除。
- `viewIds` 順序決定 UI 中的視圖顯示順序。

---

## Record（資料行）— 聚合根

```typescript
interface Record {
  id: string;
  databaseId: string;
  workspaceId: string;
  accountId: string;

  properties: Map<string, unknown>;     // fieldId → value (typed by Field.type)
  order: number;                        // display sort order

  createdByUserId: string;
  createdAtISO: string;
  updatedAtISO: string;
}
```

### Record 業務規則

- `properties` 的 key 必須是 Database.fields 中存在的 fieldId。
- `relation` 類型的 field value 是 `string[]`（關聯的 Record IDs）。
- Record 刪除（軟刪除）需保留 30 天供 Undo 操作。

---

## View（視圖）— 聚合根

```typescript
type ViewType = "table" | "board" | "list" | "calendar" | "timeline" | "gallery";

interface FilterRule {
  fieldId: string;
  operator: "eq" | "neq" | "contains" | "not_contains" | "is_empty" | "is_not_empty" | "gt" | "lt";
  value: unknown;
}

interface SortRule {
  fieldId: string;
  direction: "asc" | "desc";
}

interface GroupByConfig {
  fieldId: string;
  direction: "asc" | "desc";
}

interface View {
  id: string;
  databaseId: string;
  workspaceId: string;
  accountId: string;

  name: string;
  type: ViewType;

  filters: FilterRule[];
  sorts: SortRule[];
  groupBy: GroupByConfig | null;

  visibleFieldIds: string[];            // Which fields to show (all = empty array)
  hiddenFieldIds: string[];             // Explicitly hidden fields

  boardGroupFieldId: string | null;     // For board view: which select field to group by
  calendarDateFieldId: string | null;   // For calendar view: which date field is the X-axis
  timelineStartFieldId: string | null;  // For timeline: start date field
  timelineEndFieldId: string | null;    // For timeline: end date field

  createdByUserId: string;
  createdAtISO: string;
  updatedAtISO: string;
}
```
