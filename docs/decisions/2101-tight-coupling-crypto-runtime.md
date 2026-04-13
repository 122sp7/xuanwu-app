# 2101 Tight Coupling — Domain Aggregates 直接綁定 Node.js `crypto` Runtime

- Status: Resolved
- Date: 2026-04-13
- Resolved: 2026-04-13
- Category: Coupling Smells > Tight Coupling

## Context

緊耦合不僅發生在模組之間，也發生在程式碼與執行環境（Runtime）之間。
Domain 聚合根直接呼叫 `crypto.randomUUID()` 或 `import { randomUUID } from "node:crypto"`，
使 domain 層與特定執行環境（Node.js）產生 **Runtime Tight Coupling**。

掃描結果（見 ADR 1101）：
- **43 個 domain aggregates** 直接使用 `crypto.randomUUID()` global
- **6 個 application use-cases** 使用 `node:crypto` 直接 import
- **唯一正確範例**：`OrganizationTeam.ts` 使用 `import { v4 as randomUUID } from "@lib-uuid"`

### 耦合層次分析

| 耦合類型 | 耦合目標 | 解耦策略 |
|----------|----------|----------|
| `crypto` global | Node.js / Web Crypto API global 物件 | 使用 `@lib-uuid` 套件（跨環境相容）|
| `node:crypto` import | Node.js 特定模組（有 `node:` 協議） | 使用 `@lib-uuid` 或注入 port |
| `randomBytes` | 加密強度隨機（Node.js-only） | 若 domain 真需要，定義 port，由 infra 提供 |

### Runtime Coupling 的具體風險

**Edge Runtime 相容性問題：**

Next.js App Router 的 Server Components 和 Middleware 可以在 Edge Runtime 執行。
Edge Runtime 沒有 `node:crypto`，但有 Web `crypto` global。
若 domain aggregates 被 server action 呼叫（透過 use-case），
且 Next.js 決定在 Edge Runtime 執行，`import { randomUUID } from "node:crypto"` 將直接失敗。

**測試環境問題：**

Vitest/Jest 的 `jsdom` 環境中：
- `crypto.randomUUID()` global 在較舊版本可能未定義，需要 polyfill。
- `node:crypto` 在 `browser` mode 的測試中不可用。

`@lib-uuid` 封裝了這些差異，提供統一接口。

### 為何選擇 `@lib-uuid` 而非直接用 crypto

```
packages/lib-uuid/  ← @lib-uuid 套件（已存在）
```

`@lib-uuid` 是本 repo 已建立的跨環境 UUID 工具套件，
存在的意義就是作為 domain 對 UUID 生成能力的抽象，
隱藏底層是 `uuid` npm 包、Web Crypto 還是 Node.js crypto 的實作細節。

只有 `OrganizationTeam` 正確使用了這個套件，其他 43 個 aggregates 繞過了這個抽象，
在全域重用「`crypto.randomUUID()`」的情況下，整個 domain 層實際上與 runtime 緊耦合。

### 已發現的直接 node:crypto 用例（application 層）

```typescript
// upload-init-source-file.use-case.ts:11
import { randomBytes, randomUUID } from "node:crypto";
// 用途：生成 storage 路徑用的唯一 token
```

此處 `randomBytes` 用於生成 storage path token，是 infrastructure 關注點（storage path generation），
不應出現在 application use-case 中，應透過 StoragePath port 封裝。

## Decision

1. **所有 domain aggregates 改用 `@lib-uuid`**：  
   `crypto.randomUUID()` → `import { v4 as uuid } from "@lib-uuid"` then `uuid()`
2. **application use-cases 的 `randomUUID` 同樣改用 `@lib-uuid`**  
3. **`randomBytes` 用於 storage path**：定義 `StoragePathGeneratorPort` 或 `UniqueTokenPort`，由 infrastructure 提供實作；或在 infrastructure adapter 層直接使用 `node:crypto`（不進入 application）。
4. **建議 ESLint rule**（同 ADR 1101）：限制 domain 和 application 層從 `node:crypto` 直接 import。

## Consequences

正面：
- Domain 可在 Edge Runtime、browser、Node.js 任意環境下執行。
- 若未來升級 UUID 版本（v7 有時間排序優勢），只需修改 `@lib-uuid` 一處。

代價：
- 14 個 domain aggregates + 13 個 application use-cases + 7 個 infra/interfaces 文件需要機械性 import 替換（無邏輯變更）。

## Resolution

**已解決（2026-04-13）**

與 ADR 1101 同步解決。所有 `crypto.randomUUID()` 和 `import { randomUUID } from "node:crypto"` 已替換為 `import { v4 as uuid } from "@lib-uuid"`。Domain 層現在完全 runtime-agnostic，可在 Edge Runtime、browser、Node.js 任意環境下執行。

### 原始證據修正

原 ADR 記錄「43 個 aggregates + 6 個 use-cases」，實際為 **14 個 domain aggregate 文件 + 13 個 application 文件 + 7 個其他層文件**。

## 關聯 ADR

- **1101**：這是層次違規的同一實例（同步解決）
- **4101**：UUID 策略分散 = Change Amplification（解決後策略集中於 `@lib-uuid`）
