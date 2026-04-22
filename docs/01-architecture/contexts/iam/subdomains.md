# IAM

## Implemented Subdomains（程式碼已存在 — `src/modules/iam/subdomains/`）

| Subdomain | Responsibility |
|---|---|
| identity | 已驗證主體與身份信號治理 |
| access-control | 主體現在能做什麼的授權判定（policy 執行） |
| authentication | sign-in、registration、credential recovery、provider bootstrap |
| authorization | 高層政策編排與決策語意 |
| federation | 外部 identity provider 連結、SSO 與信任委派 |
| tenant | 多租戶隔離與 tenant-scoped 規則治理 |
| security-policy | 安全規則定義、版本化與發佈 |
| session | session、token 與 identity lifecycle（原列為 gap，現已實作） |
| account | 帳號聚合根與帳號生命週期（原 platform/account，已遷入） |
| organization | 組織、成員與角色邊界（原 platform/organization，已遷入） |

> **命名備注：** `authentication`、`authorization`、`federation` 原標注為「尚未完整對齊」，現已列為 baseline。
> `session` 原列為 recommended gap，現已實作，升為 baseline。

## Planned Subdomains（尚未實作）

| Subdomain | Why Needed |
|---|---|
| consent | 同意與資料使用授權治理收斂 |
| secret-governance | secret 與 credential access policy 收斂 |

## Anti-Patterns

- 不把 authentication 與 authorization 混為同一子域。
- 不把 session 混進 identity，失去 token lifecycle 獨立語言。
- 不把 federation 混成 integration（federation 是身份委派，不是資料整合）。
- 不讓 organization 從 iam 遷出到其他主域。

## Copilot Generation Rules

- 生成程式碼時，先確認需求屬於哪個 iam 子域（identity/auth/federation/session/account/org/tenant/policy）。
- 奧卡姆剃刀：authentication flow 歸 `authentication`；policy decision 歸 `access-control`；不混用。
