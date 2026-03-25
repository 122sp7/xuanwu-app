# Modules Implementation Guide

> **摘要**: 如何在 Xuanwu App 建立或修改 MDDD 模組，涵蓋目錄結構、命名慣例、層次職責與常見模式速查。

---

## 新模組建立步驟

1. 在 `modules/<context-name>/` 建立目錄。
2. 依四層結構建立子目錄（僅建立需要的層）。
3. 建立 `modules/<context-name>/api/index.ts` 作為跨模組公開邊界。
4. 建立 `modules/<context-name>/index.ts` 作為同模組內部 barrel（選用）。
5. 在 `tsconfig.json` 的 `paths` 新增對應 `@alias`（如需要）。
6. 更新 [agents/knowledge-base.md](../../../agents/knowledge-base.md) 的 Module Inventory。

---

## 四層結構

```text
modules/<context>/
├── api/             ← 跨模組公開 API（唯一對外入口）
├── domain/
│   ├── entities/    ← Aggregate roots, value objects
│   ├── repositories/← Repository 介面（只有 interface，不含實作）
│   ├── services/    ← 純邏輯 domain services（無 side effects）
│   └── value-objects/
├── application/
│   ├── use-cases/   ← 每個 use case 一個檔案
│   └── dto/
├── infrastructure/
│   └── firebase/    ← Firestore repository 實作
└── interfaces/
    ├── components/  ← React UI 元件
    ├── queries/     ← TanStack Query hooks（read-side）
    ├── _actions/    ← Next.js Server Actions（write-side）
    └── hooks/
```

---

## 依賴方向規則

```
interfaces/ → application/ → domain/ ← infrastructure/
```

- `domain/` 不可匯入 `infrastructure/`、`application/`、`interfaces/`。
- `application/` 不可匯入 `infrastructure/`、`interfaces/`。
- `infrastructure/` 不可匯入 `interfaces/`。

---

## 命名慣例

| 類型 | 命名 | 範例 |
|------|------|------|
| Domain entity | `PascalCase.ts` | `WorkspacePage.ts` |
| Repository interface | `IMyRepository.ts` | `IKnowledgeRepository.ts` |
| Firebase repository | `FirebaseMyRepository.ts` | `FirebaseKnowledgeRepository.ts` |
| Use case | `verb-noun.use-case.ts` | `create-knowledge-node.use-case.ts` |
| Server Action | `*.actions.ts` | `knowledge.actions.ts` |
| React component | `PascalCase.tsx` | `KnowledgeCard.tsx` |

---

## 跨模組互動

```typescript
// ✅ 正確：透過目標模組的 api/ 邊界
import { getKnowledgeNode } from "@/modules/knowledge/api";

// ❌ 錯誤：直接讀取另一模組的內部
import { KnowledgeNode } from "@/modules/knowledge/domain/entities/KnowledgeNode";
```

---

## 目前模組清單

見 [agents/knowledge-base.md — Module Inventory](../../../agents/knowledge-base.md#module-inventory)。

---

## 相關文件

- [agents/knowledge-base.md](../../../agents/knowledge-base.md)
- [.github/instructions/architecture-mddd.instructions.md](../../../.github/instructions/architecture-mddd.instructions.md)
- [.github/instructions/architecture-modules.instructions.md](../../../.github/instructions/architecture-modules.instructions.md)
- [development-contracts/overview.md](../reference/development-contracts/overview.md)
