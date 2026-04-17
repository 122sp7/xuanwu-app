# integration-firebase — Agent Rules

此套件是 **Firebase Client SDK 的唯一封裝層**。所有與 Firebase 服務的互動必須透過這個套件提供的介面，不得在 `src/modules/` 或 `src/app/` 中直接 import Firebase SDK。

---

## Route Here（放這裡）

| 類型 | 說明 |
|---|---|
| Firebase App 初始化 | `client.ts` — singleton `firebaseClientApp` |
| Firebase Auth 操作 | `auth.ts` — `getFirebaseAuth`, `onFirebaseAuthStateChanged`, `signOutFirebase` |
| Firestore 操作原語 | `firestore.ts` — `firestoreApi`, `getFirebaseFirestore` |
| Firebase Storage 操作 | 新增 `storage.ts`（遵循同樣封裝模式）|
| 新增 Firebase 服務封裝 | 在此套件新增對應 `.ts` 並從 `index.ts` re-export |

## Route Elsewhere（不放這裡）

| 類型 | 正確位置 |
|---|---|
| 業務邏輯（use case、domain rule） | `src/modules/<context>/domain/` 或 `application/` |
| Repository 實作（Firestore CRUD 業務查詢） | `src/modules/<context>/adapters/outbound/` |
| 跨模組資料協調 | `src/modules/<context>/api/` |
| UI 組件 | `packages/ui-shadcn/ui-custom/` |

---

## 嚴禁

```ts
// ❌ 直接在 modules 或 app 中 import Firebase SDK
import { getFirestore } from 'firebase/firestore'

// ✅ 必須透過此套件
import { firestoreApi, getFirebaseFirestore } from '@integration-firebase'
```

- 不得在此套件加入業務判斷邏輯
- 不得 import `src/modules/*` 任何路徑
- 不得在此套件處理認證 session 狀態（由 iam module 負責）
- 環境設定只能來自 `NEXT_PUBLIC_FIREBASE_*` env vars

---

## Alias

```ts
import { ... } from '@integration-firebase'
import { ... } from '@integration-firebase/auth'
import { ... } from '@integration-firebase/firestore'
```

`@integration-firebase` alias 定義在 `tsconfig.json`，只允許在 `src/modules/*/adapters/outbound/` 使用（ESLint boundary 規則）。
