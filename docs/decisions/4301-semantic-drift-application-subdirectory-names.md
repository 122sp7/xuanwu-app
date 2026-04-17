# 4301 Semantic Drift — `application/` 子目錄命名偏離職責語意

- Status: Accepted
- Date: 2026-04-13
- Category: Maintainability Smells > Semantic Drift

> **路徑說明**：此 ADR 中的路徑使用舊版 `modules/` 前綴（架構遷移前）。現行實作位置為 `src/modules/` 下的對應路徑。

> **路徑說明**：此 ADR 中的路徑使用舊版 `modules/` 前綴（架構遷移前）。現行實作位置為 `src/modules/` 下的對應路徑。

## Context

語意漂移（Semantic Drift）在目錄命名上的表現是：目錄名稱隨時間偏離其最初（或標準）語意，
使讀者無法從名稱推斷目錄的職責，或名稱暗示的職責與目錄的實際職責不符。

掃描 `application/` 層各子目錄，發現以下命名偏離了「Application 層 = Use-Case 編排」的語意：

### 漂移一：`event-handlers/`（在 `platform/application/`）

```
modules/platform/application/event-handlers/
  handleIngressAccountProfileAmended.ts
  handleIngressIdentitySubjectAuthenticated.ts
  handleIngressIntegrationCallbackReceived.ts
  handleIngressOrganizationMembershipChanged.ts
  handleIngressSubscriptionEntitlementChanged.ts
  handleIngressWorkflowExecutionCompleted.ts
```

**語意問題：**
- `event-handlers/` 這個名稱在 Application 層暗示「Application 層負責監聽並處理事件」，但在 Hexagonal Architecture 中，外部事件的「接收和訂閱」屬於 `interfaces/` 層（transport adapter）。
- `handleIngress*`（Ingress = 進入的）明確指出這些是外部系統流入的事件，是 **transport concern**，而非 **use-case orchestration**。
- Application 層可以有「對 domain event 的反應邏輯」，但這些邏輯應命名為 `event-reactions/` 或 `domain-event-subscribers/`，而非 `event-handlers/`（後者與 HTTP handler、message handler 的語意混淆）。

### 漂移二：`event-mappers/`（在 `platform/application/`）

```
modules/platform/application/event-mappers/
  mapDomainEventToPublishedEvent.ts     ← 序列化：domain → wire format
  mapExternalEventToPlatformEvent.ts    ← 解析：external → internal
  mapIngressEventToCommand.ts           ← ACL 轉換：ingress → command
```

**語意問題：**
- 資料格式轉換（serialization、deserialization、ACL translation）屬於 **infrastructure** 或 **interfaces** 的職責。
- `mapDomainEventToPublishedEvent` 是序列化，應在 `infrastructure/serializers/` 或 `infrastructure/messaging/`。
- `mapExternalEventToPlatformEvent` 是 Anti-Corruption Layer 轉換，應在 `infrastructure/translators/` 或 `interfaces/acl/`。
- 放在 `application/event-mappers/` 使 application 層承擔了「知道外部事件格式」的職責，破壞了 application 層的外部格式無知性（format-agnostic）。

### 漂移三：`handlers/`（在 `platform/application/`）

```
modules/platform/application/handlers/
  PlatformCommandDispatcher.ts
  PlatformQueryDispatcher.ts
```

**語意問題：**
- `handlers/` 是極度通用的名稱，在不同上下文分別指：
  - HTTP 路由處理器（Express/Next.js）
  - Message queue consumer
  - CQRS Command Handler
  - Event Handler
- 此目錄的實際內容是 CQRS **Dispatcher**（分派器），已在文件名上正確表達了語意（`PlatformCommandDispatcher`），但目錄名稱 `handlers/` 仍然模糊。
- 建議更名為 `dispatchers/` 或合併到 `application/` 根層（因為只有 2 個文件）。

### 漂移四：`process-managers/`（在 `workspace-workflow/application/`）

```
modules/workspace/subdomains/workspace-workflow/application/process-managers/
  knowledge-to-workflow-materializer.ts
```

**語意問題：**
- `process-managers/` 是 Saga/Process Manager 模式的術語，暗示有分散式交易協調。
- 該目錄只有一個文件 `knowledge-to-workflow-materializer.ts`，名稱中的 `materializer` 暗示這是資料具體化（materialization），而非流程協調（process management）。
- 職責語意（materializer）與目錄語意（process-managers）不匹配。

### 漂移五：`services/` 含義模糊

```
modules/platform/subdomains/account/application/services/
modules/platform/subdomains/platform-config/application/services/
modules/platform/subdomains/access-control/application/services/
modules/workspace/application/services/
modules/workspace/subdomains/lifecycle/application/services/
modules/workspace/subdomains/sharing/application/services/
```

- `services/` 在 DDD 中有三種意義：Domain Service、Application Service、Platform Service。
- 這 6 個 `application/services/` 目錄各自的內容需要逐一確認，但名稱本身無法分辨其與 `use-cases/` 的差異。

## Decision

1. **`event-handlers/` 重命名/移動**：外部事件訂閱 → `interfaces/event-subscribers/`；domain event 副作用 → `application/event-reactions/`。
2. **`event-mappers/` 移動**：序列化映射 → `infrastructure/mappers/` 或 `infrastructure/serializers/`；ACL 翻譯 → `interfaces/acl/` 或 `infrastructure/translators/`。
3. **`handlers/` 重命名**：→ `dispatchers/`（若保留 CQRS dispatcher pattern）或移至 `application/` 根層。
4. **`process-managers/` 重命名**：若內容是 materializer（讀模型投影），應命名為 `projections/`；若確為 process manager，則保留但補充文件說明協調的業務流程。
5. **`services/` 規範化**：在 `architecture-core.instructions.md` 中明確定義 `application/services/` 的允許內容（僅 Application Service 且無法成為 use-case 時才放此處）。

## Consequences

正面：
- 開發者可從目錄名稱直觀判斷文件的層次歸屬和職責。
- 新加入成員不需要逐一閱讀文件才能判斷放置位置。

代價：
- 6 個 event-handler 文件、3 個 event-mapper 文件、2 個 handler 文件的移動和 import 路徑更新。

## 關聯 ADR

- **3101** (Low Cohesion)：platform/application/ 低凝聚性與此語意漂移互相加強
- **4200** (Inconsistency)：應用層命名不一致的系統性問題
