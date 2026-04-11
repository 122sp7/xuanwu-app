# Platform

治理與營運支撐主域

## Implementation Structure

```text
modules/platform/
├── api/              # Public API boundary
├── application/      # Context-wide orchestration
├── domain/           # Context-wide domain concepts
├── infrastructure/   # Context-wide driven adapters
├── interfaces/       # Context-wide driving adapters
├── docs/             # Links to strategic documentation
└── subdomains/
    ├── account/
    ├── account-profile/
    ├── access-control/
    ├── analytics/
    ├── audit-log/
    ├── background-job/
    ├── billing/
    ├── compliance/
    ├── content/
    ├── feature-flag/
    ├── identity/
    ├── integration/
    ├── notification/
    ├── observability/
    ├── onboarding/
    ├── organization/
    ├── platform-config/
    ├── referral/
    ├── search/
    ├── security-policy/
    ├── subscription/
    ├── support/
    ├── team/
    └── workflow/
```

## Subdomains

| Subdomain | Status | Purpose |
|-----------|--------|---------|
| account | Active | 帳號管理與帳號生命週期 |
| identity | Active | 身份驗證與身份聯邦 |
| notification | Active | 通知治理與遞送 |
| organization | Active | 組織管理與租戶結構 |
| team | Active | 團隊管理與成員關係 |
| account-profile | Stub | 帳號個人檔案與偏好 |
| access-control | Stub | 存取控制與權限策略 |
| analytics | Stub | 平台級分析與指標 |
| audit-log | Stub | 平台稽核日誌 |
| background-job | Stub | 背景任務排程與管理 |
| billing | Stub | 計費與支付管理 |
| compliance | Stub | 合規與法遵管理 |
| content | Stub | 平台內容管理 |
| feature-flag | Stub | 功能旗標與漸進式發布 |
| integration | Stub | 外部系統整合 |
| observability | Stub | 觀測與監控 |
| onboarding | Stub | 使用者引導流程 |
| platform-config | Stub | 平台組態管理 |
| referral | Stub | 推薦與邀請機制 |
| search | Stub | 平台級搜尋能力 |
| security-policy | Stub | 安全策略管理 |
| subscription | Stub | 訂閱與方案管理 |
| support | Stub | 客戶支援管理 |
| workflow | Stub | 平台級工作流引擎 |

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

- `api/` is the only cross-module public boundary.
- Domain must not import infrastructure, interfaces, or external frameworks.
- Cross-module collaboration goes through `api/` only.

## Strategic Documentation

- [Context README](../../docs/contexts/platform/README.md)
- [Subdomains](../../docs/contexts/platform/subdomains.md)
- [Context Map](../../docs/contexts/platform/context-map.md)
- [Ubiquitous Language](../../docs/contexts/platform/ubiquitous-language.md)
- [Bounded Context Template](../../docs/bounded-context-subdomain-template.md)
