# IAM

## Baseline Subdomains

| Subdomain | Responsibility |
|---|---|
| identity | 已驗證主體與身份信號治理 |
| access-control | 主體現在能做什麼的授權判定 |
| tenant | 多租戶隔離與 tenant-scoped 規則治理 |
| security-policy | 安全規則定義、版本化與發佈 |
| account | 帳號聚合根與帳號生命週期（原 platform/account，已遷入）|
| organization | 組織、成員與角色邊界（原 platform/organization，已遷入）|

## Recommended Gap Subdomains

| Subdomain | Responsibility |
|---|---|
| session | session、token 與 identity lifecycle 收斂 |
| consent | 同意與資料使用授權治理收斂 |
| secret-governance | secret 與 credential access policy 收斂 |

## Implementation Subdomains (Code Present, Not Yet Fully Aligned)

| Subdomain | Responsibility |
|---|---|
| authentication | sign-in、registration、credential recovery、provider bootstrap |
| authorization | higher-level policy orchestration and decision semantics |
| federation | external identity provider linking, SSO, and trust delegation |
