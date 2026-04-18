# infra/serialization

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
