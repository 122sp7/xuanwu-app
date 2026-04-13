# 0009 Anemic Aggregates

- Status: Accepted
- Date: 2026-04-13

## Context

架構規範要求 `domain/aggregates/` 目錄只放**聚合根（Aggregate Root）類別**：必須封裝狀態與行為、保護不變數（invariants）、透過工廠方法建立，並在狀態變更時記錄領域事件。

掃描後發現 `domain/aggregates/` 目錄下共有 **11 個文件**只包含 `interface`、`type`、`export type` 宣告，完全沒有 `class` 定義——即典型的**貧血領域模型（Anemic Domain Model）**。這些文件名稱暗示是聚合根，但實際上是純資料結構：

### 違規文件清單

| 文件 | 包含內容 | 應有形態 |
|------|---------|---------|
| `modules/platform/domain/aggregates/PlatformContext.ts` | `interface PlatformContextSnapshot`，`type PlatformContextId` | 聚合根 class 封裝平台配置不變數 |
| `modules/platform/domain/aggregates/SubscriptionAgreement.ts` | `interface SubscriptionAgreementSnapshot` | 聚合根 class 管理訂閱合約生命週期 |
| `modules/platform/domain/aggregates/IntegrationContract.ts` | `interface IntegrationContractSnapshot` | 聚合根 class 管理整合合約 |
| `modules/platform/domain/aggregates/PolicyCatalog.ts` | `interface PolicyCatalogSnapshot` | 聚合根 class 管理政策目錄 |
| `modules/notion/subdomains/database/domain/aggregates/Database.ts` | `interface DatabaseSnapshot`, `interface Field`, `type FieldType` | 聚合根 class 封裝資料庫欄位不變數 |
| `modules/notion/subdomains/database/domain/aggregates/DatabaseRecord.ts` | `interface DatabaseRecordSnapshot` | 聚合根 class 管理記錄欄位值型別驗證 |
| `modules/notion/subdomains/database/domain/aggregates/View.ts` | `interface ViewSnapshot`, `interface FilterRule`, `interface SortRule` | 聚合根 class 管理過濾排序規則不變數 |
| `modules/notion/subdomains/database/domain/aggregates/DatabaseAutomation.ts` | `interface DatabaseAutomationSnapshot`, `type AutomationTrigger` | 聚合根 class 管理自動化規則不變數 |
| `modules/notion/subdomains/collaboration/domain/aggregates/Version.ts` | `interface VersionSnapshot` | 聚合根 class 管理版本生命週期 |
| `modules/notion/subdomains/collaboration/domain/aggregates/Permission.ts` | `interface PermissionSnapshot`, `type PermissionLevel` | 聚合根 class 管理權限授予不變數 |
| `modules/notion/subdomains/collaboration/domain/aggregates/Comment.ts` | `interface CommentSnapshot`, `interface SelectionRange` | 聚合根 class 管理留言生命週期 |

### 危害

- Use-case 直接操作裸資料結構，業務邏輯外洩至 application 層。
- 「新增欄位需有最大欄位數」等不變數無法在 aggregate 內保護，只能在 use-case 重複實作。
- 缺乏 `pullDomainEvents` → 無法觸發 domain event → 下游訂閱者收不到變更信號。
- `*Snapshot` interface 與 `*class` 邊界混淆，讀者無法分辨哪個是真正的聚合根。

### 與現有正確實作的對比

正確的聚合根（如 `KnowledgePage`、`OrganizationTeam`、`Subscription`）使用：

```typescript
export class KnowledgePage {
  private _domainEvents: DomainEvent[] = [];
  private constructor(readonly id: string, private _state: KnowledgePageState) {}
  static create(...): KnowledgePage { ... }
  static reconstitute(snapshot: KnowledgePageSnapshot): KnowledgePage { ... }
  rename(title: string): void { /* enforce invariant + emit event */ }
  pullDomainEvents(): DomainEvent[] { ... }
  getSnapshot(): Readonly<KnowledgePageState> { ... }
}
```

## Decision

確立以下規則：

1. **`domain/aggregates/` 只放 class**：`*.ts` 文件必須 `export class`，不允許只放 `interface` / `type` / `export type`。
2. **純資料快照（Snapshot）interface 位置**：應放在同一 class 文件中（作為 `export interface XxxSnapshot`），或移入 `domain/entities/` 目錄（若是子實體）。
3. **class-less 資料結構的遷移路徑**：
   - 若業務行為確實不存在（例如 `ViewSnapshot` 只是持久化格式）→ 移至 `domain/entities/` 並改名為 entity。
   - 若業務行為存在但尚未實作 → 新建對應 class，`*Snapshot` interface 保留在同一文件。
4. **判斷條件**：業務行為包括但不限於：
   - 狀態轉移（生命週期）
   - 不變數保護（欄位驗證、數量上限、狀態前置條件）
   - 事件記錄（`_domainEvents`）

## Consequences

正面影響：

- domain/aggregates/ 目錄的意圖明確：進入此目錄的開發者知道裡面只有含業務行為的聚合根。
- 不變數集中在 aggregate class，use-case 職責縮減為純 orchestration。

代價與限制：

- 11 個文件需重構，需判斷哪些應成為真正的 aggregate class，哪些應降格為 entity。
- notion/database 的 4 個聚合根（Database、Record、View、Automation）都有對應的 `DatabaseEvents.ts` → 遷移時需同步確認事件觸發路徑。
- `PermissionLevel`、`ContentType` 等型別目前放在 collaboration/aggregates，遷移後應移入 `domain/value-objects/`。

## Conflict Resolution

- 若現有 infrastructure repository（如 `FirebaseDatabaseRepository`）使用 `*Snapshot` interface 作為 Firestore 序列化格式，snapshot interface 可以保留在 class 文件中作為 `export interface`，但不得取代 class 本身。
- 遷移期間 use-case 可先繼續使用 snapshot interface 建立實例，逐步改為呼叫 class factory，不需要一次全部替換。
