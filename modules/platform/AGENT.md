# AGENT.md — platform blueprint

> **強制開發規範**
> 本 BC 領域開發必須使用 Serena 指令：
>
> ```
> serena
> #use skill serena-mcp
> #use skill alistair-cockburn
> #use skill context7
> #use skill shadcn
> #use skill next-devtools-mcp
> ```

其中 `shadcn` 與 `next-devtools-mcp` 只在 platform 變更實際觸及 driving adapters、web UI 或 Next.js route composition 時適用。若工作只限於 `domain/`、`application/`、`ports/` 或本地架構文件，這兩個技能不得反向主導平台邊界。

## 模組定位

`platform` 在這裡是平台基礎能力的六邊形架構藍圖。它的任務是保護 platform language、ports/adapters 邊界與子域協作方式，而不是把所有跨領域邏輯集中成單一巨型模組。

## Canonical Subdomain Inventory

platform 的正式子域清單已固定為：

- `identity`
- `account-profile`
- `organization`
- `access-control`
- `security-policy`
- `platform-config`
- `feature-flag`
- `integration`
- `workflow`
- `notification`
- `audit-log`
- `observability`
- `billing`
- `subscription`

這份 inventory 預設為 closed by default。代理人必須先把需求映射到這 14 個子域之一，不能為了方便再建立新的資料夾別名。

## 禁用舊名稱

以下舊子域名稱已退休，不得重新建立或重新引用：

- `account`
- `organization`
- `config`
- `permission`
- `integration`
- `workflow`
- `notification`
- `audit`
- `subscription`

## 代理人工作契約

任何在 `modules/platform/` 的變更，都應遵守以下順序：

1. 先確認變更屬於哪一個平台子域
2. 再確認它是 domain rule、application orchestration、port contract，還是 adapter concern
3. 只有在語言與邊界已經穩定時，才擴張資料結構或事件名稱

## 必須維持的六邊形規則

- domain 只擁有模型與規則，不直接呼叫外部系統
- application 只協調 use cases，不定義 persistence 或 transport 細節
- input ports 定義進入系統的請求語言
- output ports 定義離開系統的依賴語言
- adapters 只實作 ports，不改寫業務語意

## 通用語言守則

在 platform 文件與未來實作中，應優先使用這些詞：

- `PlatformContext`
- `PolicyCatalog`
- `IntegrationContract`
- `SubscriptionAgreement`
- `PlatformCapability`
- `PermissionDecision`
- `WorkflowTrigger`
- `NotificationDispatch`
- `AuditSignal`
- `ObservabilitySignal`

不要把這些術語隨意替換成籠統字眼，如 `settings`、`background-job`、`hook`、`status log`、`feature`、`auth result`。

## 允許的修改

- 新增或細化 platform 子域的語言與責任
- 新增 input ports / output ports 以描述新的 I/O 邊界
- 新增 application services 以表達新的 use case handlers
- 新增 aggregates、值物件或 domain services 以承載純業務規則
- 新增 adapters 來實作既有 output ports

## 禁止的修改

- 在 domain 中混入 HTTP、SQL、message bus、email、metrics SDK 細節
- 在 adapter 中定義平台政策或聚合不變數
- 直接讓一個子域的 adapter 呼叫另一個子域的 adapter
- 讓事件名稱承載命令語氣，例如 `please_send_notification`
- 用臨時欄位或臨時語言繞過 `ubiquitous-language.md`

## 文件更新規則

若變更影響聚合、語言或邊界，至少同步更新以下文件：

- 變更聚合或值物件：同步更新 `aggregates.md` 與 `ubiquitous-language.md`
- 變更 use case handler：同步更新 `application-services.md`
- 變更 repository/output port：同步更新 `repositories.md`
- 變更 input port、support port 或 decision object：同步更新 `application-services.md`、`repositories.md` 與 `ubiquitous-language.md`
- 變更事件名稱或 payload：同步更新 `domain-events.md`
- 變更子域責任：同步更新 `subdomains.md` 與 `context-map.md`
- 變更 platform 邊界：同步更新 `bounded-context.md` 與 `README.md`

## 代理人交付標準

- 優先維持語言一致性，而不是追求一次塞入所有能力
- 優先讓 ports 穩定，再讓 adapters 成長
- 優先用事件與契約描述跨邊界協作，而不是共享內部資料結構
- 任何新術語都應能在 `ubiquitous-language.md` 落地

## 最終檢查

在交付前，代理人至少自問四件事：

1. 這個變更有沒有把 platform policy 泄漏到 adapter？
2. 這個 I/O 邊界是否已經先表達成 port？
3. 事件名稱是否描述事實而非命令？
4. 子域責任是否仍然清楚，沒有回到大泥球結構？
