# Domain Services — knowledge-database

---

## FieldValueValidator

驗證 Record 的 properties 值是否符合 Field 的類型規範。

```typescript
// modules/knowledge-database/domain/services/FieldValueValidator.ts

export class FieldValueValidator {
  validate(field: Field, value: unknown): void {
    switch (field.type) {
      case "number":
        if (value !== null && typeof value !== "number") {
          throw new Error(`Field "${field.name}" expects a number`);
        }
        break;
      case "checkbox":
        if (typeof value !== "boolean") {
          throw new Error(`Field "${field.name}" expects a boolean`);
        }
        break;
      case "date":
        if (value !== null && typeof value !== "string") {
          throw new Error(`Field "${field.name}" expects an ISO date string`);
        }
        break;
      case "select":
        const options: string[] = (field.config.options as string[]) ?? [];
        if (value !== null && !options.includes(value as string)) {
          throw new Error(`"${value}" is not a valid option for field "${field.name}"`);
        }
        break;
      default:
        // text, url, email, multi_select, relation, formula, rollup — validated at boundary
        break;
    }
  }
}
```

---

## ViewQueryBuilder

將 View 的 filter / sort / groupBy 配置轉換為查詢參數，供 Repository 執行。

```typescript
// modules/knowledge-database/domain/services/ViewQueryBuilder.ts

export class ViewQueryBuilder {
  buildQuery(view: View, records: DatabaseRecord[]): DatabaseRecord[] {
    let result = [...records];

    // Apply filters
    for (const filter of view.filters) {
      result = result.filter((record) =>
        this.applyFilter(record, filter)
      );
    }

    // Apply sorts
    for (const sort of [...view.sorts].reverse()) {
      result.sort((a, b) => {
        const aVal = a.properties.get(sort.fieldId);
        const bVal = b.properties.get(sort.fieldId);
        const cmp = String(aVal ?? "").localeCompare(String(bVal ?? ""));
        return sort.direction === "asc" ? cmp : -cmp;
      });
    }

    return result;
  }

  private applyFilter(record: DatabaseRecord, filter: FilterRule): boolean {
    const value = record.properties.get(filter.fieldId);
    switch (filter.operator) {
      case "eq": return value === filter.value;
      case "neq": return value !== filter.value;
      case "is_empty": return value === null || value === undefined || value === "";
      case "is_not_empty": return value !== null && value !== undefined && value !== "";
      default: return true;
    }
  }
}
```
