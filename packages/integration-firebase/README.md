# integration-firebase

<!-- nested-index:start -->
## Navigation Index

- Pair: [AGENTS.md](AGENTS.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `auth.ts`
- `client.ts`
- `firestore.ts`
- `functions.ts`
- `index.ts`
- `storage.ts`

## Pair Contract

- `README.md` 保留最短概覽與實際目錄索引。
- `AGENTS.md` 保留 routing 與放置決策。
<!-- nested-index:end -->


Firebase Client SDK 封裝套件。提供 Firebase App、Auth、Firestore 的穩定介面，隔離 SDK 細節與 `src/modules/` 業務層。

## 套件結構

```
packages/integration-firebase/
  client.ts     ← Firebase App singleton 初始化
  auth.ts       ← Auth 操作（getAuth、onAuthStateChanged、signOut）
  firestore.ts  ← Firestore 操作原語（firestoreApi）
  functions.ts  ← Functions 操作（getFunctions、httpsCallable）
  storage.ts    ← Storage 操作（ref、uploadBytes、getDownloadURL）
  index.ts      ← 統一 re-export
  AGENTS.md     ← Agent 使用規則
```

## 公開 API

```ts
// Firebase App
import { firebaseClientApp } from '@integration-firebase'

// Auth
import {
  getFirebaseAuth,
  onFirebaseAuthStateChanged,
  signOutFirebase,
  type User,
} from '@integration-firebase'

// Firestore
import {
  getFirebaseFirestore,
  firestoreApi,
  type Firestore,
} from '@integration-firebase'

// Functions
import {
  getFirebaseFunctions,
  httpsCallable,
  type Functions,
} from '@integration-firebase'

// Storage
import {
  getFirebaseStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  type FirebaseStorage,
} from '@integration-firebase'
```

## 使用限制

| 規則 | 說明 |
|---|---|
| **只允許在 outbound adapters 使用** | ESLint boundary 限制 `src/modules/*/adapters/outbound/` |
| **禁止直接 import Firebase SDK** | 所有 Firebase 操作必須透過此套件 |
| **禁止加入業務邏輯** | 此套件只封裝 SDK，不含 domain rule |

## 設定來源

所有 Firebase 設定從 `NEXT_PUBLIC_FIREBASE_*` 環境變數讀取，詳見 `client.ts`。

## Context7 官方基線

- 文件來源：`/firebase/firebase-js-sdk`
- 實作原則：
  - 維持 modular import（`firebase/app`, `firebase/auth`, `firebase/firestore`, `firebase/storage`, `firebase/functions`）。
  - App 初始化維持 singleton（`getApps().length === 0 ? initializeApp(...) : getApp()`）。
  - 僅封裝 SDK 能力，不在此層加入業務規則。
