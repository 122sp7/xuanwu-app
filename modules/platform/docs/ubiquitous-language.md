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
| 推薦連結 | ReferralLink | 推薦關係的識別與追蹤語言 |
| 推薦獎勵 | ReferralReward | 推薦成功後可被核算與發放的獎勵語言 |
| 生效區間 | EffectivePeriod | 某份協議、設定或規則的有效期間 |
| 平台生命週期狀態 | PlatformLifecycleState | `draft | active | suspended | retired` |
| 契約狀態 | ContractState | `draft | active | paused | revoked` |
| 計費狀態 | BillingState | `pending | active | delinquent | expired | cancelled` |
| 工作流觸發器 | WorkflowTrigger | 把某個平台事實轉成流程啟動點的語言 |
| 工作流政策 | WorkflowPolicy | 用來規定 trigger 何時啟動、延後、抑制或升級的規則 |
| 作業排程 | JobSchedule | 背景任務何時執行與重試策略的語言 |
| 作業執行 | JobExecution | 背景任務一次執行結果與狀態的語言 |
| 通知派送 | NotificationDispatch | 一次待交付的通知請求 |
| 通知路由 | NotificationRoute | 通知應走的通道與對象語言 |
| 派送結果 | DispatchOutcome | 一次交付成功、失敗、跳過或延後的結果 |
| 內容資產 | ContentAsset | 可被治理、發布與檢索的內容單位語言 |
| 發布狀態 | PublicationState | 內容在草稿、審核、發布等狀態中的語言 |
| 搜尋結果 | SearchResult | 對 `SearchQuery` 的可消費回應語言 |
| 稽核訊號 | AuditSignal | 必須被永久記錄的決策或行為事實 |
| 稽核分類 | AuditClassification | 用來決定 audit signal 嚴重度與保留要求的分類 |
| 可觀測性訊號 | ObservabilitySignal | metrics、trace、alert 等診斷輸入的統一語言 |
| 健康指標 | HealthIndicator | 用來表達系統健康、退化或告警狀態的指標語言 |
| 分析事件 | AnalyticsEvent | 可被聚合與分析的行為訊號語言 |
| 支援工單 | SupportTicket | 客服互動與追蹤案件的語言 |
| 知識文章 | KnowledgeArticle | 支援流程中引用的知識內容語言 |
| 資源描述子 | ResourceDescriptor | 權限或 workflow 決策所面向的資源描述 |
| 關聯上下文 | CorrelationContext | 用來串接 workflow、integration、notification、audit 的追蹤語言 |
| 公開邊界 | PublicBoundary | 對其他模組暴露的穩定 boundary，於 platform 中即 `api/` |
| 發佈語言 | PublishedLanguage | 跨邊界共享的事件與契約語言 |
| 藍圖 | Blueprint | 對目標結構與語言的設計說明，而非既有實作聲明 |

## Port Vocabulary

| 術語 | 英文 | 定義 |
|---|---|---|
| 平台命令介面 | PlatformCommandPort | 接收命令型請求的 input port |
| 平台查詢介面 | PlatformQueryPort | 接收查詢型請求的 input port |
| 平台事件匯入介面 | PlatformEventIngressPort | 吸收外部或相鄰子域訊號的 input port |
| 使用案例處理器 | UseCaseHandler | 實作 input port、協調 domain 與 output ports 的 application service |
| 倉儲介面 | RepositoryPort | 載入與保存聚合狀態的 output port |
| 查詢介面 | QueryPort | 提供 read model / projection 的 output port |
| 支援介面 | SupportPort | 提供查表、設定或目錄資料的 output port |
| 事件發佈器 | DomainEventPublisher | 發佈 domain events 的 output port |
| 配置輪廓儲存介面 | ConfigurationProfileStore | 提供 configuration profile 的 support port |
| 主體目錄 | SubjectDirectory | 提供帳戶輪廓、偏好與角色資料的 support port |
| 帳戶倉儲 | AccountRepository | 提供 account 聚合狀態存取的 repository port |
| 啟用引導倉儲 | OnboardingRepository | 提供 onboarding 流程狀態存取的 repository port |
| 合規政策儲存介面 | CompliancePolicyStore | 提供 compliance 規則與保留策略的 support port |
| 推薦倉儲 | ReferralRepository | 提供推薦關係與獎勵狀態存取的 repository port |
| 工作流政策倉儲 | WorkflowPolicyRepository | 提供 workflow policy 的 query/support port |
| 工作流派送介面 | WorkflowDispatcherPort | 將 trigger 交給執行引擎的 output port |
| 通知閘道 | NotificationGateway | 對外派送通知的 output port |
| 作業佇列介面 | JobQueuePort | 提交與追蹤背景作業的 output port |
| 內容倉儲 | ContentRepository | 提供 content 資產狀態存取的 repository port |
| 搜尋索引介面 | SearchIndexPort | 提供索引寫入與搜尋查詢的 output/query port |
| 稽核訊號儲存介面 | AuditSignalStore | 寫入不可變稽核紀錄的 output port |
| 可觀測性匯流介面 | ObservabilitySink | 發送 metrics、trace、alert 的 output port |
| 分析匯流介面 | AnalyticsSink | 發送分析事件與行為指標的 output port |
| 支援倉儲 | SupportRepository | 提供支援工單與知識關聯的 repository port |
| 密鑰參照解析器 | SecretReferenceResolver | 解析憑證參照的 support port |
| 驅動適配器 | DrivingAdapter | 把 HTTP、CLI、scheduler、webhook 等輸入翻譯成 input port 語言的 adapter |
| 受驅動適配器 | DrivenAdapter | 實作 repository、gateway、sink 等 output ports 的 adapter |

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

## Migration-Pending 術語（計畫吸收模組）

下列術語目前由對應的**獨立模組**定義，在合并進 platform 後應以本表的定義為準。若與獨立模組現有命名有差異，合并時以本表為遷移目標。

### 來自 `modules/identity/`

| 術語 | 英文 | platform 對應概念 | 定義 |
|---|---|---|---|
| 身份 | Identity | `AuthenticatedSubject` | Firebase Auth 驗證後的使用者記錄，以 `uid` 為唯一識別碼；合并後以 `AuthenticatedSubject` 作為 platform 語言 |
| 唯一身份碼 | uid | SubjectId | Firebase Authentication 產生的使用者全域唯一 ID |
| Token 刷新訊號 | TokenRefreshSignal | IdentitySignal | 代表 Firebase ID token 需要更新的訊號；合并後作為 `IdentitySignal` 的一種 |

### 來自 `modules/account/`

| 術語 | 英文 | platform 對應概念 | 定義 |
|---|---|---|---|
| 帳戶 | Account | Account（同名） | 使用者在平台的業務記錄，含 profile 資訊與狀態 |
| 帳戶政策 | AccountPolicy | PolicyRule（account context） | 附加到帳戶的存取控制政策，決定 Firebase custom claims 內容 |
| 帳戶 ID | accountId | SubjectScope 的組成部分 | Account 的業務主鍵（對應 Firebase uid，但在業務層使用 accountId 術語） |
| 自訂宣告 | customClaims | — | Firebase ID token 中的自訂 claims；合并後以 platform `Entitlement` 語言統一表達 |

### 來自 `modules/organization/`

| 術語 | 英文 | platform 對應概念 | 定義 |
|---|---|---|---|
| 組織 | Organization | Organization（同名） | 頂層多租戶單元，代表一個企業或團隊 |
| 成員參照 | MemberReference | MembershipBoundary 的組成 | 組織成員的輕量參照（含 accountId、role、presence） |
| 隊伍 | Team | — | 組織內的子群組（internal / external 類型） |
| 合作夥伴邀請 | PartnerInvite | — | 邀請外部合作夥伴加入隊伍的邀請記錄 |
| 組織角色 | OrganizationRole | RoleAssignment 的值域 | `Owner \| Admin \| Member \| Guest` |
| 在線狀態 | Presence | — | `active \| away \| offline` |
| 邀請狀態 | InviteState | — | `pending \| accepted \| expired` |

### 來自 `modules/notification/`

| 術語 | 英文 | platform 對應概念 | 定義 |
|---|---|---|---|
| 通知實體 | NotificationEntity | NotificationDispatch（合并後） | 一則系統通知記錄（含標題、內容、類型、讀取狀態） |
| 接收者 ID | recipientId | NotificationRoute 的對象語言 | 接收此通知的帳戶 ID |
| 通知類型 | NotificationType | — | `info \| alert \| success \| warning` |

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
| `PublicBoundary` | Barrel File |

## 語言使用規則

- 若一個詞描述的是業務決策，應優先用 domain 語言，而不是 transport 語言
- 若一個詞描述的是跨邊界共享契約，應優先保持簡短、穩定且可序列化
- 若一個詞只在單一 adapter 有意義，不應升格成 platform 通用語言
- 若新詞與既有詞重疊，先擴充定義，再考慮新增術語
- 若一個詞其實是 boundary 角色，應明確區分 `PublicBoundary`、`InputPort`、`OutputPort` 與 `Adapter`
