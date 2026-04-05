# Domain Services — knowledge-collaboration

---

## PermissionLevelComparator

比較 Permission 級別的大小，用於驗證授予者不可超過自身權限。

```typescript
// modules/knowledge-collaboration/domain/services/PermissionLevelComparator.ts

export type PermissionLevel = "view" | "comment" | "edit" | "full";

const LEVEL_RANK: Record<PermissionLevel, number> = {
  view: 1,
  comment: 2,
  edit: 3,
  full: 4,
};

export class PermissionLevelComparator {
  isHigherOrEqual(a: PermissionLevel, b: PermissionLevel): boolean {
    return LEVEL_RANK[a] >= LEVEL_RANK[b];
  }

  validateGrant(granterLevel: PermissionLevel, targetLevel: PermissionLevel): void {
    if (!this.isHigherOrEqual(granterLevel, targetLevel)) {
      throw new Error(
        `Cannot grant ${targetLevel} permission: granter only has ${granterLevel}`
      );
    }
  }

  highest(levels: PermissionLevel[]): PermissionLevel {
    return levels.reduce((best, cur) =>
      LEVEL_RANK[cur] > LEVEL_RANK[best] ? cur : best
    );
  }
}
```

---

## VersionRetentionPolicy

管理版本保留策略，自動清理超出限制的舊版本（具名版本除外）。

```typescript
// modules/knowledge-collaboration/domain/services/VersionRetentionPolicy.ts

export class VersionRetentionPolicy {
  private static readonly MAX_VERSIONS = 100;

  /**
   * 返回應被刪除的版本 ID（不含具名版本）。
   * @param versions 依 createdAtISO 升序排列的版本列表
   */
  getVersionsToDelete(
    versions: Array<{ id: string; label: string | null }>
  ): string[] {
    const unnamed = versions.filter((v) => v.label === null);
    const excess = unnamed.length - VersionRetentionPolicy.MAX_VERSIONS;
    if (excess <= 0) return [];
    return unnamed.slice(0, excess).map((v) => v.id);
  }
}
```
