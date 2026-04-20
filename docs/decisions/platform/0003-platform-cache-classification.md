# ADR 0003 — platform `cache` 子域歸屬評估

## Status

Accepted

## Date

2025-02-11

## Context

`src/modules/platform/subdomains/` 目前存在 `cache` 子域，但 `docs/structure/domain/subdomains.md` 的 platform baseline **不包含** `cache`。問題：

1. **Cache 是 infrastructure concern**：快取策略（TTL、invalidation、storage backend）屬於技術實作細節，不是業務能力。
2. **DDD 原則**：Subdomain 應代表業務能力（Business Capability），不是技術機制。
3. **Baseline 不認可**：baseline 定義的 platform 子域是 notification、search、audit-log 等有業務語言的能力，沒有 cache。
4. **`packages/infra/` 已有對應位置**：共用 infrastructure 能力（query、http、serialization 等）統一放在 `packages/infra/`，cache 屬於同類。

此外，若 `cache` 子域只是包裝了 Redis 或 in-memory 快取客戶端，它沒有 domain model、沒有 aggregate、沒有業務事件，本質上是 infrastructure adapter 而非子域。

## Decision

### 將 `platform/subdomains/cache/` 移除，重定位至 infrastructure

**方案：移至 `packages/infra/cache/`**

```
packages/infra/cache/
  AGENTS.md
  index.ts             # 暴露 CacheAdapter interface + 實作
  README.md
  adapters/
    MemoryCacheAdapter.ts
    FirestoreCacheAdapter.ts    # 若需要持久化快取
```

`platform` module 若有自己的快取需求，透過 `@infra/cache` alias 引入，並在各自的 `infrastructure/` adapter 中使用，不建立 platform subdomain。

### 邊界確認

| 問題 | 結論 |
|---|---|
| cache 有業務規則嗎？ | 否，TTL 是技術配置 |
| cache 有 aggregate 或 domain event 嗎？ | 否 |
| cache 屬於業務語言嗎？ | 否，不在 ubiquitous-language.md |
| baseline subdomains 包含 cache 嗎？ | 否 |

**結論：cache 是 infrastructure 能力，不是 platform 子域。**

### 遷移步驟

1. 確認 `platform/subdomains/cache/` 的現有程式碼內容
2. 若只有 adapter 代碼 → 直接移至 `packages/infra/cache/`
3. 若有業務邏輯（如快取失效策略） → 評估是否屬於某個有業務語言的子域
4. 更新所有 `import from '@/modules/platform/subdomains/cache'` 改為 `import from '@infra/cache'`
5. 刪除 `platform/subdomains/cache/` 目錄

## Consequences

**正面：** platform module 的子域清單對齊 baseline；cache 能力在 packages/infra 統一管理，所有模組都可使用。  
**負面：** 需要遷移現有 import；若其他模組已依賴 `platform/cache` 需全部更新。  
**中性：** `packages/infra/cache` 是新目錄，需在 `tsconfig.json` 和 `eslint.config.mjs` 增加 `@infra/cache` alias。

## References

- `docs/structure/domain/subdomains.md` — platform baseline（不含 cache）
- `src/modules/platform/subdomains/cache/` — 待評估遷移的現有子域
- `packages/infra/` — 目標位置
- ADR architecture/0001 — subdomain boundary governance（extra subdomains evaluation 規則）
