# 1104 Layer Violation — `globalThis.crypto?.randomUUID` 出現在 application 層

- Status: Accepted
- Date: 2026-04-14
- Category: Architectural Smells > Layer Violation
- Extends: ADR 1101 (crypto.randomUUID in domain layer → @lib-uuid)

## Context

ADR 1101 解決了 14 個 domain aggregates 和 13 個 application use-cases 中使用
`crypto.randomUUID()` (Node.js `crypto` 模組) 的問題，將其遷移到 `@lib-uuid`。

掃描後發現新的 violation：`notebooklm/subdomains/source/application/use-cases/wiki-library.helpers.ts`
在 **application 層** 中直接使用 `globalThis.crypto?.randomUUID`：

```typescript
// modules/notebooklm/subdomains/source/application/use-cases/wiki-library.helpers.ts:13-19
export function generateSourceId(): string {
  const randomUUID = globalThis.crypto?.randomUUID;
  if (typeof randomUUID === "function") {
    return randomUUID.call(globalThis.crypto);
  }
  return `wbl_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}
```

### 問題分析

1. **繞過 `@lib-uuid` 抽象層**：ADR 4101 確立了 `@lib-uuid` 為全 repo 唯一 UUID 生成策略，
   直接使用 `globalThis.crypto?.randomUUID` 破壞了這個集中管理層。

2. **平台耦合**：`globalThis.crypto` 在 Node.js ≥ 19 才穩定，在舊版 Node.js 或某些 SSR 環境中可能為 `undefined`。
   `@lib-uuid` 的 `v4` 已處理跨環境兼容性。

3. **Fallback 邏輯洩入 application 層**：`wbl_${Date.now()}_${Math.random()}` 的 fallback
   表明開發者知道 `globalThis.crypto` 可能不可用，但選擇在 application use-case 中處理此運行環境問題，
   而不是透過 `@lib-uuid` 統一解決。

4. **Format inconsistency**：生成的 ID 格式非 UUID 標準（`wbl_...` prefix + hex），
   無法與系統其他地方的 UUID 比較，也無法作為 Zod `z.string().uuid()` 驗證的值。

## Problem

- **Layer boundary violation**: 直接使用 runtime Web Crypto API 是 infrastructure-level concern，
  不應出現在 application use-case helper 中。
- **Abstraction bypass**: 繞過 `@lib-uuid` centralized UUID strategy。
- **Non-standard ID format**: fallback 產生 `wbl_...` 格式 ID，不符合 UUID v4 規格。
- **Polyfill coupling**: application 層手動處理環境兼容性，本應是 `@lib-uuid` 的責任。

## Decision

1. 將 `generateSourceId()` 改為使用 `import { v4 as uuid } from "@lib-uuid"`。
2. 移除 `globalThis.crypto` 直接調用和 fallback 邏輯。
3. 統一 ID 格式為標準 UUID v4（與系統其他 entity ID 一致）。

```typescript
// After fix
import { v4 as uuid } from "@lib-uuid";

export function generateSourceId(): string {
  return uuid();
}
```

## Consequences

正面：
- 符合 ADR 1101 和 ADR 4101 規範，消除環境兼容性 fallback 邏輯。
- 生成的 sourceId 符合 UUID v4 格式，可用 `z.string().uuid()` 驗證。

代價：
- 舊有 `wbl_` 前綴 sourceId（若已存入 Firestore）與新格式不兼容，需確認是否存在歷史資料。

## 關聯 ADR

- **ADR 1101** (Layer Violation — crypto.randomUUID in domain layer) — 先驅修復
- **ADR 4101** (Change Amplification — UUID strategy → @lib-uuid) — 規範根源
- **ADR 1100** (Layer Violation) — 系列入口文件
