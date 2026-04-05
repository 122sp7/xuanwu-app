# ADR-002 通用語言與界限上下文修正計畫

<!-- status: accepted | date: 2026-04-04 -->

## 背景

在對 Xuanwu App 進行 DDD 健康度評估後，發現以下幾類問題：

1. **文件與代碼不一致**：`ubiquitous-language.md` 中的 `CommandResult` 定義錯誤（寫成 `{ok:true,data}`，實際為 `{success:true,aggregateId,version}`）。
2. **shared 模組定位不清**：`modules/shared/domain/events/` 存放 content 領域事件，但未說明這是 **Published Language** 模式的刻意設計，易被誤解為邊界污染。
3. **`ai` 模組過渡期未完成**：`modules/ai/domain/entities/graph-node.ts`、`link.ts` 已標記 `@deprecated`，指向 `modules/wiki/`，但尚未移除；`GraphRepository.ts` 在 `ai` 與 `wiki` 兩個模組中重複定義。（`modules/knowledge/domain/entities/` 中的同名檔案已於先前 PR 清理完畢。）
4. **Wiki 概念所有權不清**：「Wiki」前綴跨越 `knowledge`（pages 內容）、`source`（WikiLibrary 結構化文件庫）、`workspace`（WikiContentTree 導覽模型）三個模組，語意各異但命名相似，易造成混淆。
5. **核心聚合根缺乏 Domain Events**：`identity`、`account`、`workspace` 無事件 stream，下游模組無法響應狀態變更。
6. **`source.WikiLibrary` 語意偏移**：WikiLibrary 是結構化文件庫，語意偏向內容層，但目前定義在 `source` 模組中（`modules/source/domain/entities/wiki-library.types.ts`）。

## 決策

採用**循序漸進（incremental）**方式修正，先備妥文件再動代碼，分三個優先級處理。

---

## 修正計畫（按優先級）

### P0 — 文件正確性（✅ 已完成）

所有文件修正已在本 ADR 建立時完成，包含：修正 `CommandResult` 定義、在 `shared` 模組加入 Published Language 說明、標注 `ai/` 模組過渡期狀態、新增 Wiki 概念所有權對照表。

---

### P1 — 代碼清理（下一個 PR）

**目標：** 移除過渡期殘留，消除因兩個模組定義相同概念而產生的混淆。

#### P1-A：清除 `ai` 模組的 deprecated 實體（**注意：不是 `knowledge` 模組**）

**問題：** `modules/ai/domain/entities/graph-node.ts` 與 `link.ts` 為空殼，僅含 `@deprecated` 注解，指向 `modules/wiki/`。（`modules/knowledge/domain/entities/` 中的同名檔案已於先前 PR 清理完畢。）

**修正步驟：**
1. 確認 `ai/domain/entities/graph-node.ts` 和 `link.ts` 沒有任何 import 引用（用 `grep -r "ai/domain/entities/graph-node\|ai/domain/entities/link"` 確認）
2. 刪除 `modules/ai/domain/entities/graph-node.ts`
3. 刪除 `modules/ai/domain/entities/link.ts`
4. 確認 `modules/ai/domain/repositories/GraphRepository.ts` 也無引用後刪除（Graph 操作應透過 `wiki/api`）
5. 確認 `modules/ai/application/link-extractor.service.ts` 和 `modules/ai/infrastructure/InMemoryGraphRepository.ts` 無引用後刪除
6. 執行 `npm run lint && npm run build` 確認零錯誤

**影響範圍：** 僅 `ai` 模組內部；預期無其他模組使用這些 deprecated 路徑（eslint boundaries 已防止跨模組直接 import）。

---

#### P1-B：驗證 Published Language 合約的使用正確性

**問題：** `ContentPageCreatedEvent` 和 `KnowledgeUpdatedEvent`（實際名稱：`shared/domain/events/knowledge-page-created.event.ts` 和 `shared/domain/events/knowledge-updated.event.ts`）在 `shared` 中，但使用方式可能不一致。

**修正步驟：**
1. 搜尋所有 import `KnowledgePageCreatedEvent` 和 `KnowledgeUpdatedEvent` 的地方
2. 確認發佈者（publish）是 `knowledge` 模組
3. 確認消費者（subscribe）是 `knowledge-base` 和/或 `knowledge` 模組
4. 如發現其他模組直接使用這些事件，評估是否合理或需要重構

---

### P2 — Domain Events 補充（後續 Sprint）

**目標：** 讓核心聚合根能透過事件通知下游模組，減少跨模組手動協調。

#### 優先補充的 Domain Events

**`workspace` 模組（影響最廣）：**

```typescript
// modules/workspace/domain/events/workspace.events.ts

export interface WorkspaceCreatedEvent extends DomainEvent {
  type: "workspace.created";
  workspaceId: string;
  accountId: string;
  name: string;
  actorId: string;
}

export interface WorkspaceMemberAddedEvent extends DomainEvent {
  type: "workspace.member_added";
  workspaceId: string;
  userId: string;
  role: string;
  actorId: string;
}

export interface WorkspaceArchivedEvent extends DomainEvent {
  type: "workspace.archived";
  workspaceId: string;
  actorId: string;
}
```

**`account` 模組：**

```typescript
// modules/account/domain/events/account.events.ts

export interface UserAccountCreatedEvent extends DomainEvent {
  type: "account.created";
  accountId: string;
  accountType: "user" | "organization";
  actorId: string;
}

export interface AccountProfileUpdatedEvent extends DomainEvent {
  type: "account.profile_updated";
  accountId: string;
  changes: Partial<{ name: string; theme: unknown }>;
  actorId: string;
}
```

**下游訂閱效益：**
- `WorkspaceCreatedEvent` → `workspace-audit` 自動初始化稽核追蹤
- `WorkspaceArchivedEvent` → `workspace-feed`、`workspace-flow` 可清理或封存相關資料
- `UserAccountCreatedEvent` → `notification` 可觸發歡迎通知

**實作步驟：**
1. 在各模組 `domain/events/` 新增 event 定義（按上述 discriminated-union 格式）
2. 在對應 use-case 中發佈事件（透過 `PublishDomainEventUseCase`）
3. 在下游模組中建立訂閱 handler（透過 `SimpleEventBus` 或 Firestore 事件觸發）
4. 更新 `docs/architecture/domain-events.md` 加入新事件

---

### P3 — 架構優化評估（未來 Quarter）

**目標：** 解決長期語意模糊，但影響範圍較大，需謹慎規劃。

#### P3-A：評估 `WikiLibrary` 歸屬

**問題：** `source.WikiLibrary`（`modules/source/domain/entities/wiki-library.types.ts`）是結構化文件庫（類資料庫），語意偏向內容層而非儲存層。

**選項 A（留在 source）：** 撰寫 ADR-004 明確說明「source 擁有所有結構化文件資產，包含檔案和資料庫結構（WikiLibrary）」，並更新術語表。

**選項 B（移至 knowledge）：** 將 WikiLibrary 移至 `knowledge` 模組，定義為 `KnowledgeDatabase`，並建立 migration。

**決策觸發條件：** 當 WikiLibrary 需要與 ContentPage 深度整合（如頁面嵌入資料庫視圖）時，再評估遷移。目前維持現狀。

---

## 不改動的設計決策

| 決策 | 理由 |
|------|------|
| `KnowledgePageCreatedEvent` / `KnowledgeUpdatedEvent` 繼續放在 `shared` | Published Language 模式，穩定跨模組整合契約，移動會破壞 `knowledge-base` 和 `knowledge` 的訂閱鏈 |
| `WikiContentTree` 留在 `workspace` | 它是 workspace 的導覽模型，不是 wiki 頁面內容本身 |
| `identity` 不添加 Domain Events | identity 是 Firebase Auth 的薄封裝，事件由 Firebase 本身管理（auth state change），非領域事件 |

---

## 後果

**正面影響：**
- 文件與代碼對齊，新進開發者不會被錯誤定義誤導
- Published Language 設計意圖明確，減少誤解「shared 被汙染」的疑慮
- knowledge 模組的過渡期清晰標注，避免繼續在 deprecated 路徑上新增代碼
- Wiki 概念所有權有官方定義，跨模組討論時有明確參考

**執行風險：**
- P1-A 刪除 deprecated 實體：風險極低，eslint boundaries 已防止跨模組 import
- P2 補充 Domain Events：需謹慎設計事件 schema，保持向後兼容
- P3 WikiLibrary 遷移：範圍最大，需待業務需求明確後再決策

---

## 相關文件

- [`ubiquitous-language.md`](../ubiquitous-language.md) — 通用語言字典
- [`bounded-contexts.md`](../bounded-contexts.md) — 界限上下文定義
- [`context-map.md`](../context-map.md) — 上下文關係圖
- [`domain-events.md`](../domain-events.md) — 領域事件目錄
- [`ADR-001-content-to-workflow-boundary.md`](./ADR-001-content-to-workflow-boundary.md) — content ↔ workspace-flow 邊界決策
