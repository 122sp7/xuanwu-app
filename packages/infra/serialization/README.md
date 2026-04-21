# infra/serialization

<!-- nested-index:start -->
## Navigation Index

- Pair: [AGENTS.md](AGENTS.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `index.ts`

## Pair Contract

- `README.md` 保留最短概覽與實際目錄索引。
- `AGENTS.md` 保留 routing 與放置決策。
<!-- nested-index:end -->


序列化 / 反序列化工具。

## 公開 API

```ts
import {
  safeJsonParse,   // string -> { ok, value, error } (不拋出)
  toJsonString,    // unknown -> string
  encodeBase64,    // string -> base64 string
  decodeBase64,    // base64 string -> string
  type JsonParseResult,
} from '@infra/serialization'
```

## 使用規則

- 純工具函式，跨層可用（domain 層除外）。
- 複雜序列化（SuperJSON 含 Date/Map/Set）在 Server Action 邊界使用 `superjson` 直接操作。
