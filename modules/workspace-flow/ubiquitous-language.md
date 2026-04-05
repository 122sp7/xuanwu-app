# workspace-flow — Ubiquitous Language

> **Canonical DDD reference:** `../../docs/ddd/workspace-flow/ubiquitous-language.md`

本文件是 `workspace-flow` 的模組就地導覽版本，命名、術語與定義以 `docs/ddd/workspace-flow/ubiquitous-language.md` 為準。

## 使用規則

- 新增 class / type / variable 前，先對照 canonical 術語
- 跨模組傳遞的公開名詞，必須與 `docs/ddd/workspace-flow/` 保持一致
- 若術語變更，先更新 `docs/ddd/workspace-flow/ubiquitous-language.md`，再同步此文件

## Code Anchors

### Entities
- `domain/entities/Invoice.ts`
- `domain/entities/InvoiceItem.ts`
- `domain/entities/Issue.ts`
- `domain/entities/Task.ts`

### Events
- `domain/events/InvoiceEvent.ts`
- `domain/events/IssueEvent.ts`
- `domain/events/TaskEvent.ts`

### Value Objects
- `domain/value-objects/InvoiceId.ts`
- `domain/value-objects/InvoiceItemId.ts`
- `domain/value-objects/InvoiceStatus.ts`
- `domain/value-objects/IssueId.ts`
- `domain/value-objects/IssueStage.ts`
- `domain/value-objects/IssueStatus.ts`
- `domain/value-objects/SourceReference.ts`
- `domain/value-objects/TaskId.ts`
- `domain/value-objects/TaskStatus.ts`
- `domain/value-objects/UserId.ts`
