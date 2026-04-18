# IAM Module

## 子域清單

| 子域 | 狀態 | 說明 |
|---|---|---|
| `account` | ✅ 完成 | AccountProfile read-model |
| `access-control` | ✅ 完成 | 存取控制規則 |
| `authentication` | ✅ 完成 | 認證流程 |
| `authorization` | ✅ 完成 | 授權決策 |
| `federation` | ✅ 完成 | SSO / 聯合身份 |
| `identity` | ✅ 完成 | 身份核心（Actor）|
| `organization` | ✅ 完成 | 組織 / 成員 / 團隊（原 platform/org）|
| `security-policy` | ✅ 完成 | 安全策略 |
| `session` | ✅ 完成 | 會話管理 |
| `tenant` | ✅ 完成 | 租戶隔離 |

### account / organization 遷入說明

`platform/account` 與 `platform/organization` 子域已完全遷移至 `src/modules/iam/`：
- `src/modules/iam/` 公開入口（`index.ts`）提供 account 與 org API

---

## 目錄結構

```
src/modules/iam/
  index.ts
  README.md
  AGENTS.md
  orchestration/
    IamFacade.ts
    IamCoordinator.ts
  shared/
    domain/index.ts             ← Actor value object（跨子域共用）
    events/index.ts             ← Published Language Events
    types/index.ts
  subdomains/
    account/
      domain/
      application/
      adapters/outbound/
    organization/
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
| 在 `src/modules/platform/subdomains/` 下新增 account / org 程式碼 | 已遷入 iam，禁止回寫 |
| 混用 Actor（身份）與 Membership（工作區參與）術語 | 違反 Ubiquitous Language |

---

## 文件網絡

- [AGENTS.md](AGENTS.md) — Agent / Copilot 使用規則
- [src/modules/README.md](../README.md) — 模組層總覽
- [docs/structure/domain/bounded-contexts.md](../../../docs/structure/domain/bounded-contexts.md) — 主域所有權地圖
