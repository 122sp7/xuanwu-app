# 4300 Semantic Drift

- Status: Accepted
- Date: 2026-04-13
- Category: Maintainability Smells > Semantic Drift

## Context

語意漂移（Semantic Drift）指代碼中使用的名稱或結構隨時間偏離了其原始語意，使得名稱不再準確描述所承載的職責。

掃描後發現三類語意漂移問題：

### 漂移一：`interfaces/` 目錄內嵌 `api/` 子目錄

```
modules/workspace/interfaces/api/       ← interfaces 內部有 api
modules/platform/interfaces/api/
```

`interfaces/` 的語意是「輸入/輸出轉換層（UI、route handler、input translation）」。
`api/` 的語意是「跨模組公開邊界合約」。

在 `interfaces/` 下建立 `api/` 子目錄，使得「interfaces 這一層變成也承擔 api 職責」——字面上是 interfaces 的子結構，語意上卻是 api 層的工作（facades、actions、公開合約）。任何閱讀 `workspace/interfaces/api/facades/workspace.facade.ts` 的開發者都需要解讀兩層語意。

### 漂移二：`application/` 層包含 `event-handlers/`、`event-mappers/`

```
modules/platform/application/
  event-handlers/     ← 這應是 infrastructure 或 interfaces 的職責？
  event-mappers/      ← 轉換邏輯屬於 infrastructure/mappers
  handlers/           ← generic handlers（含義模糊）
```

`application/` 的語意是「use-case 編排層，不含框架依賴」。
- `event-handlers/`：若是處理外部消息系統（QStash、Pub/Sub）的訂閱，應屬 `interfaces/`；若是 domain event 的副作用處理，可以在 `application/` 但應命名為 `application/event-subscribers/` 或在 use-case 中內嵌。
- `event-mappers/`：資料轉換（映射外部格式 ↔ 內部 DTO）是 infrastructure 的職責。
- `handlers/`：命名不明確，無法從名稱判斷這是 command handler、event handler 還是 HTTP handler。

### 漂移三：`services/` 放置位置不一致

```
# Application Services（正確）
modules/workspace/subdomains/lifecycle/application/services/
modules/platform/subdomains/account/application/services/

# Platform Service Facades（在 api/ 層）
modules/platform/api/platform-service.ts     ← 是 api/ 層還是 application/ 層？
modules/platform/api/service-api.ts          ← api/ 層的 service？
```

「service」在 DDD 中可指 Domain Service、Application Service 或 Platform Service，但文件所在位置（`api/platform-service.ts`）使讀者不清楚這是 api 合約還是 application 服務。

## Decision

1. **`interfaces/api/` 子目錄語意修正**（見 ADR 1100）：
   - 將 facades、actions、queries 升移至 module 根的 `api/` 或保留在 `interfaces/` 但不命名 `api/`。
   - `interfaces/` 內只允許：`web/`、`cli/`（技術渠道）或子域名稱，不允許 `api/`。
2. **application 層子目錄語意規範**：
   - `event-handlers/` → 若處理外部消息 → 移至 `interfaces/event-subscribers/`；若是 domain event reaction → 移至 `application/event-reactions/` 或 use-case 中
   - `event-mappers/` → 移至 `infrastructure/mappers/`
   - `handlers/` → 重命名為明確的 `command-handlers/` 或 `query-handlers/`
3. **Service 命名歸屬規範**：
   - Domain Service → `domain/services/`
   - Application Service（use-case orchestration） → `application/services/`
   - Platform Facade（api 層的合約協調者） → `api/<name>-facade.ts` 或 `api/<name>-service.ts`（需在模組文件中說明是 api-layer coordinator，非 application service）

## Consequences

正面：
- 開發者讀到目錄名稱即可準確推斷其職責，無需進入文件才能確認。
- 跨模組 code review 時，語意偏移在 PR 中可被快速辨識。

代價：
- `event-handlers/` 和 `event-mappers/` 移動需要追蹤其在 interfaces 或 infrastructure 的完整依賴鏈，避免移動後出現循環。
- 修正語意的同時可能觸發其他 ADR（如 1300 循環依賴、1100 層次違規）需要一起處理。
