# infra/serialization — Agent Rules

<!-- nested-index:start -->
## Immediate Index

- Pair: [README.md](README.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `index.ts`

## Drift Guard

- `AGENTS.md` 擁有 `packages/infra/serialization/` 的 routing 與 nested index。
- `README.md` 保留同節點的人類可讀概覽。
<!-- nested-index:end -->


此套件提供 **序列化 / 反序列化工具**：JSON 解析、binary 編碼、資料格式轉換。

---

## Route Here

| 類型 | 說明 |
|---|---|
| JSON 解析 / 序列化 | 安全 JSON parse（捕捉 SyntaxError）、stringify |
| Binary 編碼工具 | Base64、ArrayBuffer 轉換 |
| 資料格式轉換 | Blob ↔ string、File ↔ binary 等 |

## Route Elsewhere

| 類型 | 正確位置 |
|---|---|
| 業務 DTO 轉換 | `src/modules/<context>/application/` mappers |
| Zod schema 驗證 | `packages/infra/zod/` |

---

## 嚴禁

- 不得依賴任何外部服務或 SDK
- 不得包含業務資料結構定義

## Alias

```ts
import { ... } from '@infra/serialization'
```
