# Platform

本文件依 Context7 參考 DDD / Hexagonal 模組邊界與責任分離原則整理。以下缺口子域依本次任務前提，視為目前專案尚未落地但主域設計上應補齊的子域。

## Current Subdomains

| Subdomain | Role |
|---|---|
| identity | 已驗證主體與身份信號治理 |
| account | 帳號聚合根與帳號生命週期 |
| account-profile | 主體屬性、偏好與治理設定 |
| organization | 組織、成員與角色邊界 |
| access-control | 主體現在能做什麼的授權判定 |
| security-policy | 安全規則定義、版本化與發佈 |
| platform-config | 平台設定輪廓與配置管理 |
| feature-flag | 功能開關策略與發佈節點 |
| onboarding | 新主體初始設定與引導流程 |
| compliance | 資料保留、稽核與法規執行 |
| billing | 計費狀態、費率與財務證據 |
| subscription | 方案、權益、配額與續期治理 |
| referral | 推薦關係與獎勵追蹤 |
| integration | 外部系統整合邊界與契約 |
| workflow | 平台級流程編排與狀態驅動執行 |
| notification | 通知路由、偏好與投遞 |
| background-job | 背景任務提交、排程與監控 |
| content | 平台級內容資產管理與發布 |
| search | 跨域搜尋路由與查詢協調 |
| audit-log | 永久稽核軌跡與不可否認證據 |
| observability | 健康量測、追蹤與告警 |
| analytics | 平台使用行為量測與分析 |
| support | 客服工單、支援知識與處理流程 |

## Missing Gap Subdomains

| Proposed Subdomain | Why Needed | Gap If Missing |
|---|---|---|
| tenant | 承接租戶邊界、租戶生命週期、隔離與 tenant-scoped policy | organization 無法完整覆蓋個人租戶、企業租戶與多租戶隔離模型 |
| entitlement | 承接 subscription、feature-flag、policy 之後的有效權益解算 | 權益、配額、功能可用性會分散在多個子域，缺少統一決策點 |
| secret-management | 承接憑證、token、integration secret、rotation 與存取審計 | integration 與 security-policy 之間缺少敏感憑證的專責邊界 |
| consent | 承接通知同意、資料使用同意、隱私偏好與 lawful basis | compliance 會被迫承接過細的使用者同意語意，導致治理模型過重 |

## Recommended Order

1. tenant
2. entitlement
3. secret-management
4. consent