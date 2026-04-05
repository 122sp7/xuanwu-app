# Context Map — identity

## 此 BC 的整合模式

### 上游（依賴）

`identity` 是最基礎的 Generic Subdomain，不依賴任何其他業務 BC。

**外部依賴：** Firebase Authentication SDK（第三方服務，Anti-Corruption Layer 在 infrastructure 層）

---

### 下游（被依賴）

#### `account` ← identity（Customer/Supplier）

- **模式：** Customer/Supplier
- **方向：** `identity` 是 Supplier（上游），`account` 是 Customer（下游）
- **整合方式：** `account` application use-cases 在 server 端 import `identity/api` 取得身份上下文
- **關鍵規則：** `identity/api` 不得含任何 `"use client"` 匯出

```
identity/api ──import──► account/application/use-cases/*.ts（server-side）
```

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| identity → account | identity | account | Customer/Supplier |
| Firebase Auth → identity | Firebase | identity | Anti-Corruption Layer |
