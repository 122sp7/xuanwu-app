# 3101 Low Cohesion — `platform/application/` 層 9 個異質子目錄

- Status: Accepted
- Date: 2026-04-13
- Category: Modularity Smells > Low Cohesion

## Context

凝聚性（Cohesion）指一個目錄（或模組）內的所有元素是否服務於同一職責。
`application/` 層的職責應是「Use-Case 編排（Orchestration）」——協調 domain 物件完成業務目標。

掃描 `platform/application/` 目錄，發現包含以下 9 個子目錄，且各自承載不同性質的概念：

```
modules/platform/application/
  dtos/              ← 資料轉換型別（Data Transfer）
  event-handlers/    ← 外部事件訂閱處理器（可能是 interfaces 職責）
  event-mappers/     ← 事件格式轉換（infrastructure/mappers 職責？）
  handlers/          ← 命令/查詢分派器（屬於 application 但與 use-cases 重複概念）
  index.ts
  queries/           ← 查詢 handler（與 use-cases 並列）
  services/          ← application service（與 use-cases 概念重疊）
  use-cases/         ← use-case orchestration（application 本職）
  application.instructions.md
```

### 各子目錄職責分析

| 子目錄 | 內容範例 | 正確歸屬 |
|--------|----------|----------|
| `dtos/` | 輸入/輸出 DTO 型別 | ✅ application（可接受） |
| `use-cases/` | use-case orchestration 類別 | ✅ application（本職） |
| `queries/` | read-model query handlers | ✅ application（可接受） |
| `services/` | application service 包裝 | ⚠️ 與 use-cases 職責重疊，需釐清 |
| `handlers/` | `PlatformCommandDispatcher`, `PlatformQueryDispatcher` | ⚠️ 是 CQRS 入口，職責模糊 |
| `event-handlers/` | `handleIngressIdentitySubjectAuthenticated`, `handleIngressSubscriptionEntitlementChanged`, ... | ⚠️ 處理外部系統事件，應屬 `interfaces/event-subscribers/` |
| `event-mappers/` | `mapDomainEventToPublishedEvent`, `mapExternalEventToPlatformEvent`, `mapIngressEventToCommand` | ⚠️ 格式映射屬於 infrastructure/mappers 或 interfaces 職責 |

### event-handlers 的特別問題

```
platform/application/event-handlers/
  handleIngressAccountProfileAmended.ts
  handleIngressIdentitySubjectAuthenticated.ts
  handleIngressIntegrationCallbackReceived.ts
  handleIngressOrganizationMembershipChanged.ts
  handleIngressSubscriptionEntitlementChanged.ts
  handleIngressWorkflowExecutionCompleted.ts
```

這 6 個 handler 名稱包含 `Ingress`，表示它們處理**從外部系統流入**的事件（Identity provider callback、Integration webhook 等）。
外部事件訂閱屬於 `interfaces/` 的 transport/adapter 職責，不應放在 `application/`。

### event-mappers 的特別問題

```
platform/application/event-mappers/
  mapDomainEventToPublishedEvent.ts    ← 序列化轉換 → infrastructure/serializers/
  mapExternalEventToPlatformEvent.ts   ← 外部格式解析 → infrastructure/translators/ 或 ACL
  mapIngressEventToCommand.ts          ← 轉換進入命令 → 可在 interfaces/ 中
```

這三個 mapper 做的都是「外部格式 ↔ 內部格式」的轉換，是 Anti-Corruption Layer (ACL) 的工作，
應放在 `infrastructure/translators/` 或 `interfaces/acl/`，而非 `application/event-mappers/`。

### 與其他模組對比

```
modules/notion/application/    → dtos/, use-cases/                     (2 子目錄)
modules/notebooklm/application/ → dtos/, use-cases/                    (2 子目錄)
modules/workspace/application/  → dtos/, queries/, services/, use-cases/ (4 子目錄)
modules/platform/application/   → 9 子目錄                             (最高複雜度)
```

`notion` 和 `notebooklm` 都維持了精簡的 `application/` 結構，
`platform` 的 9 子目錄是全域最複雜的 application 層，暗示職責邊界失守。

## Decision

1. **`event-handlers/` → `interfaces/event-subscribers/`**：外部系統事件訂閱屬於 interfaces 層（transport wiring），移至 `interfaces/event-subscribers/`。
2. **`event-mappers/` → `infrastructure/translators/`（或 `interfaces/acl/`）**：格式轉換/映射屬於 ACL/infrastructure 職責。
3. **`handlers/` → 整合至 `application/` 根層**：`PlatformCommandDispatcher` 和 `PlatformQueryDispatcher` 若是 application 入口，可作為 `application/` 根層類別，或合併進 use-cases 入口。
4. **`services/` 與 `use-cases/` 職責釐清**：`services/` 內容若與 use-cases 重複，應合併；若是薄薄的 facade，應移至 `interfaces/composition/`。
5. **目標結構**（`platform/application/`）：
   ```
   application/
     dtos/           ← DTO 型別
     use-cases/      ← orchestration use cases
     queries/        ← read-model queries
   ```

## Consequences

正面：
- `platform/application/` 職責清晰，與 `notion` 和 `notebooklm` 的 application 層結構對齊。
- Event 訂閱邏輯可在 `interfaces/` 中被替換（如從 QStash 改為 Pub/Sub），不需修改 application 層。

代價：
- 6 個 event-handler 文件和 3 個 event-mapper 文件需要移動並更新所有 import 路徑。
- 需要重新分析 `services/` 內容是否可合併至 use-cases 或移至 composition root。

## 關聯 ADR

- **4301** (Semantic Drift)：event-handlers、event-mappers 命名語意漂移
- **5201** (Cognitive Load)：platform application 9 子目錄也增加認知負荷
