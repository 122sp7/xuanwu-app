# Platform

本文件整理 platform 主域在跨子域治理時必須共用的語言。全域術語入口見 [../../ubiquitous-language.md](../../ubiquitous-language.md)；本文件只定義 platform 主域層級的治理語彙，不取代更細的子域術語文件。

## Scope

platform 是四個主域之一，負責身份、組織、存取控制、政策、商業、通知、搜尋、觀測與支援等跨切面能力。此主域的語言必須讓其他三個主域能穩定消費其 published language。

## Canonical Terms

| Term | Definition | Usage |
|---|---|---|
| Actor | 被平台辨識與治理的主體 | 指身份、授權、偏好與商業能力所作用的對象 |
| Identity | 證明 Actor 是誰的訊號集合 | 指登入、驗證與身份連結語意 |
| Account | Actor 的帳號生命週期聚合根 | 指帳號存在、狀態與基礎權益 |
| Account Profile | 帳號附屬屬性與偏好 | 指非核心身份、但屬於帳號治理的資料 |
| Organization | 多主體協作的治理邊界 | 指組織、成員、角色與權責範疇 |
| Access Control | 對 Actor 現在能做什麼的判定能力 | 指授權決策，不指內容本身 |
| Security Policy | 版本化安全規則集合 | 指約束平台行為與風險管控的政策 |
| Feature Flag | 功能暴露與 rollout 的治理開關 | 指能力是否可用，而非商業權益本身 |
| Subscription | 方案、權益、配額與續期契約 | 指商業權益與配額模型 |
| Billing | 計價、收費與財務證據 | 指金流與帳務事件，不等同於 entitlement |
| Notification | 平台級訊息投遞與通知記錄 | 指路由、偏好與投遞結果 |
| Background Job | 非同步或延後執行的工作單位 | 指背景流程、排程與執行監控 |
| Audit Log | 平台級永久稽核證據 | 指合規、調查與不可否認紀錄 |

## Language Rules

- 使用 Actor，不使用 User 作為平台治理的通用詞。
- 使用 Organization 表示治理邊界；若語意是協作容器，應改由 workspace 處理。
- 使用 Access Control 表示授權判定；不要用 Permission 泛稱整個決策能力。
- 使用 Subscription 表示方案與 entitlement；使用 Billing 表示計價與財務證據，兩者不可混用。
- 使用 Audit Log 表示平台永久稽核證據；工作區層面的操作追蹤應使用 workspace 的 Audit Trail。

## Avoid

| Avoid | Use Instead | Reason |
|---|---|---|
| User | Actor | 平台主語應保持一致 |
| Team | Organization 或 Workspace | 需先辨識是治理邊界還是協作容器 |
| Config | Platform Config 或 Security Policy | config 過度模糊，需明確治理語意 |
| Plan | Subscription | 商業權益模型應使用 subscription 語彙 |