# IAM Module — 精簡蒸餾骨架

> **⚠ 蒸餾作業進行中**：`src/modules/iam/` 正在從 `modules/iam/`（完整 HEX+DDD 實作層）蒸餾而來，並整合了已從 `modules/platform/` 遷入的 account / organization 子域。

**蒸餾狀態：** 🔨 進行中（account / organization 已從 platform 遷入 iam）

---

## 子域對照表（modules → src/modules）

| 子域 | 蒸餾來源 | 狀態 | 說明 |
|---|---|---|---|
| `account` | `modules/iam/subdomains/account/`（原 platform/account）| 🔨 進行中 | AccountProfile read-model |
| `access-control` | `modules/iam/subdomains/access-control/` | 📋 待蒸餾 | 存取控制規則 |
| `authentication` | `modules/iam/subdomains/authentication/` | 📋 待蒸餾 | 認證流程 |
| `authorization` | `modules/iam/subdomains/authorization/` | 📋 待蒸餾 | 授權決策 |
| `federation` | `modules/iam/subdomains/federation/` | 📋 待蒸餾 | SSO / 聯合身份 |
| `identity` | `modules/iam/subdomains/identity/` | 📋 待蒸餾 | 身份核心（Actor）|
| `organization` | `modules/iam/subdomains/organization/`（原 platform/org）| 🔨 進行中 | 組織 / 成員 / 團隊 |
| `security-policy` | `modules/iam/subdomains/security-policy/` | 📋 待蒸餾 | 安全策略 |
| `session` | `modules/iam/subdomains/session/` | 📋 待蒸餾 | 會話管理 |
| `tenant` | `modules/iam/subdomains/tenant/` | 📋 待蒸餾 | 租戶隔離 |

### 已遷入說明

`modules/platform/subdomains/account/` 與 `modules/platform/subdomains/organization/` 已完全遷移至 `src/modules/iam/`：
- `src/modules/iam/` 公開入口（`index.ts`）提供 account 與 org API

---

## 預期目錄結構（蒸餾後）

```
src/modules/iam/
  index.ts
  README.md
  AGENT.md
  orchestration/
    IamFacade.ts
    IamCoordinator.ts
  shared/
    domain/index.ts             ← Actor value object（跨子域共用）
    events/index.ts             ← Published Language Events
    types/index.ts
  subdomains/
    account/                    ← 優先蒸餾（已有完整 modules/ 實作）
      domain/
      application/
      adapters/outbound/
    organization/               ← 優先蒸餾（OrganizationTeam aggregate）
      domain/
      application/
      adapters/outbound/
    authentication/
    authorization/
    access-control/
    session/
    tenant/
    identity/
    security-policy/
    federation/
```

---

## 依賴方向

```
adapters/inbound → application → domain ← adapters/outbound
```

跨子域協調只能透過 `orchestration/` 或 `shared/events/`。

---

## 衝突防護

| 禁止行為 | 原因 |
|---|---|
| 在 `modules/platform/subdomains/` 下新增 account / org 程式碼 | 已遷入 iam，禁止回寫 |
| 混用 Actor（身份）與 Membership（工作區參與）術語 | 違反 Ubiquitous Language |
| 把 `src/modules/iam/` 當成 `modules/iam/` 的別名 | 兩層職責不同 |

---

## 文件網絡

- [AGENT.md](AGENT.md) — Agent / Copilot 使用規則
- [src/modules/README.md](../README.md) — 蒸餾層總覽
- [modules/iam/](../../../modules/iam/) — 完整 HEX+DDD 實作層
- [docs/bounded-contexts.md](../../../docs/bounded-contexts.md) — 主域所有權地圖
