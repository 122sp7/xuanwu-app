# domain/services — Domain Services（領域服務 = 邏輯）

> **Domain Service = 邏輯**
> 不自然屬於單一 Aggregate 或 Value Object 的**純業務規則**放在這裡。

---

## ✅ 屬於此處

| 類型 | 範例 |
|------|------|
| 跨 Aggregate invariant 驗證 | 工作區名稱全域唯一性規則 |
| Transition policy（狀態轉換規則） | `WorkspaceLifecycleTransitionPolicy`、`TaskTransitionPolicy` |
| Guard 函式（前置條件檢查） | `WorkspaceAccessGuard`、`task-guards.ts` |
| 複雜業務規則計算 | 無需持久化的純計算邏輯 |

**判斷準則**：規則自然屬於某個 Aggregate → 放入 Aggregate。
跨越 Aggregate 邊界，或 Aggregate 裡放了會讓它太胖 → 才放入此處。

---

## ❌ 禁止放入

| 禁止項目 | 原因 |
|----------|------|
| Firebase、HTTP、React 等框架 import | Domain 層必須 framework-free |
| Repository 呼叫（持久化）| 持久化是 infrastructure 的責任 |
| 流程協調（順序控制、多步驟 orchestration） | 那是 Application Service（`application/services/`）的責任 |
| Use case 邏輯 | Use case 放 `application/use-cases/` |
| `class` 持有狀態 | Domain Service 必須無狀態（stateless） |

---

## 命名慣例

```
<entity>-guards.ts              → 前置條件檢查
<entity>-transition-policy.ts   → 狀態轉換規則
<concept>-rules.ts              → 業務規則集合
```

## 依賴方向

```
application/use-cases → domain/services
application/services → domain/services
domain/services → domain/aggregates（型別或規則參照，如有需要）
domain/services → domain/entities
domain/services → domain/value-objects
domain/services → domain/events（只取型別）
```

`domain/services` **不可**依賴 `application/`、`infrastructure/`、`interfaces/`。

---

## Phase 3 預計移入

workspace-flow 合併後，以下檔案將搬入此目錄：
- `task-guards.ts`
- `task-transition-policy.ts`
- `issue-transition-policy.ts`
- `invoice-guards.ts`
- `invoice-transition-policy.ts`
