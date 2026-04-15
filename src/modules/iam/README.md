# IAM Module

`src/modules/iam` 是蒸餾自 `modules/iam` 的精簡等價版，以 `src/modules/template` 骨架為基線。
保留 4 個 **core** 子域：**identity**（已驗證主體）、**access-control**（授權判定）、**session**（token / session lifecycle）、**authentication**（驗證流程），略過 federation、consent、secret-governance 等 gap subdomains。

## 蒸餾來源

`modules/iam`（11 個子域，其中 identity + access-control 最完整）→ `src/modules/iam`（4 core 概念）

## 目錄結構

```
src/modules/iam/
  index.ts                                    ← 模組對外唯一入口（具名匯出）
  domain/
    index.ts
    entities/
      Actor.ts                                ← 已驗證主體（core identity）
      Session.ts                              ← session lifecycle
    value-objects/
      ActorId.ts
      SessionId.ts
      TenantId.ts
      AccessDecision.ts                       ← allow | deny + reason
    services/
      AccessControlService.ts                 ← 授權判定邏輯（domain service）
    repositories/
      ActorRepository.ts                      ← domain port
      SessionRepository.ts                    ← domain port
    events/
      ActorAuthenticated.ts
      SessionCreated.ts
      SessionRevoked.ts
      AccessDenied.ts
  application/
    index.ts
    use-cases/
      authenticate-actor.use-case.ts
      authorize-access.use-case.ts
      create-session.use-case.ts
      revoke-session.use-case.ts
    dto/
      ActorDTO.ts
      SessionDTO.ts
      AccessDecisionDTO.ts
  adapters/
    inbound/
      index.ts
      http/                                   ← auth callback, session endpoints
      rpc/                                    ← tRPC routers
    outbound/
      index.ts
      firebase-auth/
        FirebaseActorAdapter.ts               ← implements ActorRepository
        FirebaseAuthenticationAdapter.ts      ← Firebase sign-in / verify token
      firestore/
        FirestoreSessionAdapter.ts            ← implements SessionRepository
```

## Barrel 結構

| Barrel | 覆蓋範圍 |
|---|---|
| `index.ts` | domain + application 的公開符號 |
| `domain/index.ts` | entities, value-objects, services, repositories, events |
| `application/index.ts` | use-cases + dto |
| `adapters/inbound/index.ts` | http, rpc |
| `adapters/outbound/index.ts` | firebase-auth/, firestore/ |

所有 barrel 使用 `export { X }` / `export type { X }`，嚴禁 `export *`。

## 蒸餾範圍

| src 概念 | 蒸餾自 modules/iam | 狀態 |
|---|---|---|
| Actor entity | subdomains/identity/domain/ | ✅ 保留 |
| Session entity | subdomains/session/domain/ | ✅ 保留 |
| AccessDecision value-object | subdomains/access-control/domain/ | ✅ 保留 |
| AccessControlService | subdomains/access-control/domain/ | ✅ 保留 |
| ActorRepository / SessionRepository | subdomains/ | ✅ 保留 |
| federation, consent, secret-governance | gap subdomains | ❌ 跳過 |
| authorization, tenant, security-policy | core-first stubs | ❌ 跳過（待需求） |

## 依賴方向

```
adapters/inbound → application → domain ← adapters/outbound
```

`domain/` 絕對不依賴 Firebase Auth SDK、Firestore SDK 或任何外部框架。

## Published Language Token

`Actor`（不是 `User`）是跨模組存取身份時使用的核心 token。
`AccessDecision`（不是 `Permission` 或 `Role`）是跨模組存取判定結果的 token。

## 外部消費方式

```ts
// types（client-safe）
import type { ActorDTO, AccessDecisionDTO } from "@/src/modules/iam";

// server-only
import { authorizeAccess, createSession } from "@/src/modules/iam";
```

原始 API 合約參考：`modules/iam/api/index.ts`。
