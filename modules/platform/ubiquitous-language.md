# Ubiquitous Language — platform

本文件定義 platform blueprint 的穩定術語。這些詞用來讓 domain、application、ports、adapters 與子域文件保持一致，避免平台層隨著需求變動而出現多套互不相容的說法。

## 核心術語

| 術語 | 英文 | 定義 |
|---|---|---|
| 平台範圍 | PlatformContext | 一個受治理的 platform scope，擁有能力、政策、配置與訂閱邊界 |
| 驗證主體 | AuthenticatedSubject | 已完成身份驗證、可被映射成 platform subject scope 的主體 |
| 身份訊號 | IdentitySignal | 與主體登入、刷新、失效有關的事實訊號 |
| 平台能力 | PlatformCapability | 可被啟用、停用、限流或受 entitlement 約束的能力 |
| 能力開關 | CapabilityToggle | 某個 capability 在特定範圍中的生效狀態 |
| 主體邊界 | SubjectScope | actor、account、organization 的治理範圍 |
| 帳戶輪廓 | AccountProfile | 主體可被治理的屬性視圖 |
| 主體偏好 | SubjectPreference | 主體在通知、體驗或交付上的偏好 |
| 成員邊界 | MembershipBoundary | 主體在群組或組織中的歸屬邊界 |
| 角色指派 | RoleAssignment | 主體在某個範圍內被授予的角色 |
| 政策目錄 | PolicyCatalog | 權限、工作流、通知與稽核規則的版本化集合 |
| 規則 | PolicyRule | 以 `subject`, `condition`, `effect` 表達的政策條目 |
| 存取政策 | AccessPolicy | 用來推導 `PermissionDecision` 的政策集合或視圖 |
| 配置輪廓 | ConfigurationProfile | 一組可被套用的設定與策略值 |
| 配置輪廓參照 | ConfigurationProfileRef | 指向某份生效配置輪廓的參照 |
| 整合契約 | IntegrationContract | 與外部系統互動所需的 endpoint、協議與 delivery policy |
| 端點參照 | EndpointRef | 指向外部 endpoint 的穩定參照 |
| 憑證參照 | SecretReference | 指向秘密、憑證或 token 的穩定參照 |
| 派送政策 | DeliveryPolicy | timeout、retry、backoff、idempotency 的組合 |
| 方案限制 | PlanConstraint | 訂閱方案對能力、流程或交付所施加的限制 |
| 交付許可 | DeliveryAllowance | 在當前條件下某個交付是否被允許 |
| 權限決策 | PermissionDecision | 對某主體是否可執行某動作的明確判斷 |
| 訂閱協議 | SubscriptionAgreement | 方案、權益、限制與有效期間的商業邊界 |
| 權益 | Entitlement | 某方案允許使用的 capability 或額度 |
| 用量限制 | UsageLimit | 對使用量、頻率或配額的限制 |
| 生效區間 | EffectivePeriod | 某份協議、設定或規則的有效期間 |
| 平台生命週期狀態 | PlatformLifecycleState | `draft | active | suspended | retired` |
| 契約狀態 | ContractState | `draft | active | paused | revoked` |
| 計費狀態 | BillingState | `pending | active | delinquent | expired | cancelled` |
| 工作流觸發器 | WorkflowTrigger | 把某個平台事實轉成流程啟動點的語言 |
| 工作流政策 | WorkflowPolicy | 用來規定 trigger 何時啟動、延後、抑制或升級的規則 |
| 通知派送 | NotificationDispatch | 一次待交付的通知請求 |
| 通知路由 | NotificationRoute | 通知應走的通道與對象語言 |
| 派送結果 | DispatchOutcome | 一次交付成功、失敗、跳過或延後的結果 |
| 稽核訊號 | AuditSignal | 必須被永久記錄的決策或行為事實 |
| 稽核分類 | AuditClassification | 用來決定 audit signal 嚴重度與保留要求的分類 |
| 可觀測性訊號 | ObservabilitySignal | metrics、trace、alert 等診斷輸入的統一語言 |
| 健康指標 | HealthIndicator | 用來表達系統健康、退化或告警狀態的指標語言 |
| 資源描述子 | ResourceDescriptor | 權限或 workflow 決策所面向的資源描述 |
| 關聯上下文 | CorrelationContext | 用來串接 workflow、integration、notification、audit 的追蹤語言 |
| 輸入介面 | InputPort | 進入 application layer 的穩定契約 |
| 輸出介面 | OutputPort | 離開 domain / application 的依賴契約 |
| 適配器 | Adapter | 對 ports 的具體實作 |
| 發佈語言 | PublishedLanguage | 跨邊界共享的事件與契約語言 |
| 藍圖 | Blueprint | 對目標結構與語言的設計說明，而非既有實作聲明 |

## Port Vocabulary

| 術語 | 英文 | 定義 |
|---|---|---|
| 平台命令介面 | PlatformCommandPort | 接收命令型請求的 input port |
| 平台查詢介面 | PlatformQueryPort | 接收查詢型請求的 input port |
| 平台事件匯入介面 | PlatformEventIngressPort | 吸收外部或相鄰子域訊號的 input port |
| 事件發佈器 | DomainEventPublisher | 發佈 domain events 的 output port |
| 配置輪廓儲存介面 | ConfigurationProfileStore | 提供 configuration profile 的 support port |
| 主體目錄 | SubjectDirectory | 提供帳戶輪廓、偏好與角色資料的 support port |
| 工作流政策倉儲 | WorkflowPolicyRepository | 提供 workflow policy 的 query/support port |
| 工作流派送介面 | WorkflowDispatcherPort | 將 trigger 交給執行引擎的 output port |
| 通知閘道 | NotificationGateway | 對外派送通知的 output port |
| 稽核訊號儲存介面 | AuditSignalStore | 寫入不可變稽核紀錄的 output port |
| 可觀測性匯流介面 | ObservabilitySink | 發送 metrics、trace、alert 的 output port |
| 密鑰參照解析器 | SecretReferenceResolver | 解析憑證參照的 support port |

## 事件語言

platform 事件推薦使用：

```text
<subdomain>.<fact>
```

例如：

- `platform.context_registered`
- `policy.catalog_published`
- `workflow.trigger_fired`
- `notification.dispatch_requested`
- `audit.signal_recorded`

## 禁止替換術語

| 正確 | 不建議替換成 |
|---|---|
| `PlatformContext` | Tenant, Workspace, Environment |
| `PlatformCapability` | Feature, Switch, Module |
| `PolicyCatalog` | Settings Bag, Rule Dump |
| `IntegrationContract` | Webhook Config, Endpoint Settings |
| `SubscriptionAgreement` | Plan, Billing Row |
| `PermissionDecision` | Auth Result, Check Flag |
| `WorkflowTrigger` | background-job, Task Hook |
| `NotificationDispatch` | Message Send, Push Action |
| `AuditSignal` | Log Line, History Row |
| `ObservabilitySignal` | Error Message, Console Output |
| `InputPort` | Controller Method |
| `OutputPort` | SDK Call |

## 語言使用規則

- 若一個詞描述的是業務決策，應優先用 domain 語言，而不是 transport 語言
- 若一個詞描述的是跨邊界共享契約，應優先保持簡短、穩定且可序列化
- 若一個詞只在單一 adapter 有意義，不應升格成 platform 通用語言
- 若新詞與既有詞重疊，先擴充定義，再考慮新增術語

## 術語治理

任何新的 aggregate、port、event 或子域命名，都應先檢查是否已能被本文件的術語覆蓋。若不能覆蓋，再更新本文件，而不是先在實作或其他文件中發明第二套說法。
