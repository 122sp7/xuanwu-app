# infrastructure/firebase — Firebase Adapters（Firebase 基礎設施適配器）

此目錄放 **workspace output ports 的 Firebase / Firestore / Storage / Genkit 實作**。

> 這裡的責任是 persistence 與外部整合，不是業務規則。

---

## ✅ 屬於此處

| 類型 | 範例 |
|------|------|
| Repository implementation | `FirebaseWorkspaceRepository`、`FirebaseWorkspaceQueryRepository` |
| Firestore converter / mapper | document ↔ domain snapshot / projection 轉換 |
| Transaction / batch persistence code | Firestore transaction、batch write |
| Firebase-specific adapter glue | Storage / Genkit / shared integration 的實作細節 |

---

## ❌ 禁止放入

| 禁止項目 | 原因 |
|----------|------|
| Domain rule / policy / invariant | 放 `domain/` |
| Use case orchestration | 放 `application/` |
| Route Handler / CLI / React hooks | 放 `interfaces/` |
| DTO 定義 | 放 `application/dtos/` |

---

## 依賴箭頭

```txt
application/use-cases|application/services
    -> ports/output
infrastructure/firebase
    -> ports/output
infrastructure/firebase
    -> domain/aggregates|entities|value-objects (mapping only)
```

`infrastructure/firebase` **不可**反向讓 Firebase 細節滲透進 `domain/`。