# Files

## File: packages/ui-shadcn/hooks/use-mobile.ts
````typescript
export function useIsMobile()
⋮----
const onChange = () =>
````

## File: packages/ui-shadcn/ui/sonner.tsx
````typescript
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"
````

## File: packages/integration-firebase/auth/.gitkeep
````

````

## File: packages/integration-firebase/firestore/.gitkeep
````

````

## File: packages/integration-firebase/functions/.gitkeep
````

````

## File: packages/integration-firebase/README.md
````markdown
# integration-firebase

Firebase Client SDK 封裝套件。提供 Firebase App、Auth、Firestore 的穩定介面，隔離 SDK 細節與 `src/modules/` 業務層。

## 套件結構

```
packages/integration-firebase/
  client.ts     ← Firebase App singleton 初始化
  auth.ts       ← Auth 操作（getAuth、onAuthStateChanged、signOut）
  firestore.ts  ← Firestore 操作原語（firestoreApi）
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
```

## 使用限制

| 規則 | 說明 |
|---|---|
| **只允許在 outbound adapters 使用** | ESLint boundary 限制 `src/modules/*/adapters/outbound/` |
| **禁止直接 import Firebase SDK** | 所有 Firebase 操作必須透過此套件 |
| **禁止加入業務邏輯** | 此套件只封裝 SDK，不含 domain rule |

## 設定來源

所有 Firebase 設定從 `NEXT_PUBLIC_FIREBASE_*` 環境變數讀取，詳見 `client.ts`。
````

## File: packages/integration-firebase/storage/.gitkeep
````

````

## File: packages/ui-shadcn/AGENTS.md
````markdown
# AGENTS.md — packages/ui-shadcn

## ⛔ 禁止直接修改此套件

`packages/ui-shadcn/` 是 **shadcn/ui 官方組件庫的原始輸出目錄**。
所有 `ui/` 下的組件皆由 `shadcn` CLI 生成，不得手動編輯。

---

## 為什麼禁止修改

| 理由 | 說明 |
|---|---|
| 官方組件來源 | `ui/` 下每個檔案都是由 `npx shadcn add <component>` 生成 |
| CLI 覆寫會 overwrite | 下次執行 `shadcn add` 或 `shadcn diff` 會直接覆寫手動修改 |
| 版本追蹤困難 | 手動修改混入 CLI 更新，導致 diff 不可讀、回退困難 |
| 架構邊界 | 此套件是 **pure UI primitive**，不承載業務邏輯 |

---

## 允許的操作

| 操作 | 方式 |
|---|---|
| 新增組件 | `npx shadcn add <component>` — 由 CLI 生成，不要手動建檔 |
| 升級組件 | `npx shadcn diff` 預覽差異，`npx shadcn update` 更新 |
| 查看可用組件 | `npx shadcn list` |
| 客製化樣式 | 在消費端（`src/app/`、`src/modules/*/interfaces/`）wrapping，不改本套件 |
| Provider / hooks | `provider/` 與 `hooks/` 為此套件的 thin wrapper，修改前需確認不是官方管理範圍 |

---

## 正確的客製化路徑

```
❌ 不對
packages/ui-shadcn/ui/button.tsx        ← 直接改官方組件
src/app/components/AppButton.tsx        ← 不應散落在 src/app

✅ 正確
packages/ui-shadcn/ui-custom/           ← 所有自訂 UI 組件的唯一存放位置
  AppButton.tsx                         ← wrap 官方組件，加入業務語意或設計系統層
  ...
src/modules/<context>/interfaces/       ← 組合 ui-custom 為模組業務 UI pattern
```

---

## Route Here / Route Elsewhere

| 任務 | 路由 |
|---|---|
| 新增 shadcn 原生組件 | 這裡（CLI 執行） |
| 修改組件 **外觀** | `packages/ui-shadcn/ui-custom/` — wrap 官方組件加設計語意 |
| 修改組件 **行為** | `packages/ui-shadcn/ui-custom/` — 同上，不直接改 `ui/` |
| 消費官方原件 | `import { Button } from "@ui-shadcn/ui/button"` |
| 消費自訂組件 | `import { AppButton } from "@ui-shadcn/ui-custom/AppButton"` |
| 主題 / design token | `src/app/globals.css` 的 CSS 變數層 |

---

## 別名

```ts
// tsconfig.json 中已配置
"@ui-shadcn/*": ["packages/ui-shadcn/*"]
```

消費端使用 `@ui-shadcn/ui/<component>` import，不用相對路徑。
````

## File: packages/ui-shadcn/lib/utils.ts
````typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
⋮----
export function cn(...inputs: ClassValue[])
````

## File: packages/ui-shadcn/provider/theme-provider.tsx
````typescript
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"
⋮----
function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>)
⋮----
function isTypingTarget(target: EventTarget | null)
⋮----
function ThemeHotkey()
⋮----
function onKeyDown(event: KeyboardEvent)
````

## File: packages/ui-shadcn/README.md
````markdown
# packages/ui-shadcn

官方 shadcn/ui 組件輸出目錄。**此套件由 shadcn CLI 管理，禁止手動修改 `ui/` 目錄下的任何檔案。**

---

## 用途

提供系統所有 UI primitive 的統一來源，供 `src/app/` 與 `src/modules/*/interfaces/` 組合消費。

---

## 套件結構

```
packages/ui-shadcn/
  ui/          ← 官方組件（CLI 生成，禁止手動修改）
  ui-custom/   ← ✅ 自訂組件唯一存放目錄（wrap 官方組件或設計系統擴充）
  hooks/       ← shadcn 配套 hooks（use-mobile 等）
  lib/         ← cn() 工具（tailwind-merge + clsx）
  provider/    ← ThemeProvider 等 thin wrapper
  index.ts     ← 統一 re-export
```

---

## ⛔ 禁止手動修改 `ui/`

`ui/` 下的所有組件皆由以下指令生成：

```bash
npx shadcn add <component-name>
```

手動修改 `ui/` 內的檔案會在次次 `shadcn add` / `shadcn update` 時被覆寫，且無法被 diff 追蹤。

---

## 組件管理

| 操作 | 指令 |
|---|---|
| 新增組件 | `npx shadcn add <component>` |
| 查看可用組件 | `npx shadcn list` |
| 檢視版本差異 | `npx shadcn diff` |
| 更新組件 | `npx shadcn update <component>` |

---

## 消費方式

所有消費端透過別名 import，不使用相對路徑：

```ts
// 官方組件
import { Button } from "@ui-shadcn/ui/button";
import { cn } from "@ui-shadcn/lib/utils";
import { useIsMobile } from "@ui-shadcn/hooks/use-mobile";

// 自訂組件（ui-custom 唯一存放點）
import { AppButton } from "@ui-shadcn/ui-custom/AppButton";
```

---

## 客製化原則

不修改 `ui/` 目錄下的官方組件。**所有自訂 UI 組件一律放在 `ui-custom/`**：

```
packages/ui-shadcn/
  ui/           ← 官方組件（CLI 管理，禁止修改）
  ui-custom/    ← ✅ 唯一允許放置自訂組件的目錄
```

- **樣式覆寫**：透過 `src/app/globals.css` CSS 變數（`--primary`、`--radius` 等）
- **行為擴充 / 業務語意**：在 `ui-custom/` 建立 wrapper，如 `AppButton`、`FormField`
- **模組級組合**：`src/modules/<context>/interfaces/` 消費 `ui-custom/` 組合為業務 pattern

---

## 相關配置

- `components.json` — shadcn CLI 配置（別名、style、baseColor）
- `tailwind.config.ts` — Tailwind CSS 4 設定
- `tsconfig.json` — `@ui-shadcn/*` path alias
````

## File: packages/ui-shadcn/ui-custom/form/.gitkeep
````

````

## File: packages/ui-shadcn/ui-custom/modal/.gitkeep
````

````

## File: packages/ui-shadcn/ui-custom/table/.gitkeep
````

````

## File: packages/ui-shadcn/ui/collapsible.tsx
````typescript
import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible"
⋮----
function CollapsibleTrigger(
⋮----
function CollapsibleContent(
````

## File: packages/ui-shadcn/ui/direction.tsx
````typescript

````

## File: packages/integration-firebase/AGENTS.md
````markdown
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
| 跨模組資料協調 | `src/modules/<context>/index.ts` |
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
````

## File: packages/integration-firebase/auth.ts
````typescript
/**
 * @module integration-firebase/auth
 * Firebase Authentication client helpers.
 */
⋮----
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  type User,
} from "firebase/auth";
import { firebaseClientApp } from "./client";
⋮----
export function getFirebaseAuth()
````

## File: packages/integration-firebase/client.ts
````typescript
/**
 * @module integration-firebase/client
 * Singleton Firebase app initialization for the web client.
 */
⋮----
import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
````

## File: packages/integration-firebase/firestore.ts
````typescript
/**
 * @module integration-firebase/firestore
 * Firebase Firestore client helpers.
 */
⋮----
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  runTransaction,
  writeBatch,
  type Firestore,
} from "firebase/firestore";
import { firebaseClientApp } from "./client";
⋮----
export function getFirebaseFirestore(): Firestore
````

## File: packages/integration-firebase/functions.ts
````typescript
/**
 * @module integration-firebase/functions
 * Firebase Cloud Functions (HTTPS Callable) client helpers.
 */
⋮----
import { getFunctions, httpsCallable, type Functions } from "firebase/functions";
import { firebaseClientApp } from "./client";
⋮----
export function getFirebaseFunctions(): Functions
````

## File: packages/integration-firebase/storage.ts
````typescript
/**
 * @module integration-firebase/storage
 * Firebase Cloud Storage client helpers.
 */
⋮----
import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  type FirebaseStorage,
  type StorageReference,
  type UploadResult,
  type UploadTask,
} from "firebase/storage";
import { firebaseClientApp } from "./client";
⋮----
export function getFirebaseStorage(): FirebaseStorage
````

## File: packages/AGENT.md
````markdown
# packages — Agent Rules

此目錄是所有 **外部 SDK 與共享能力的唯一封裝層**。修改或新增任何套件前，先確認責任歸屬。

---

## Route Here（放這裡）

| 類型 | 正確套件 |
|---|---|
| Firebase SDK 封裝 | `integration-firebase/` |
| AI SDK（Genkit / Google AI）封裝 | `integration-ai/` |
| HTTP 用戶端封裝 | `integration-http/` |
| tRPC 客戶端設定 | `integration-trpc/` |
| 官方 shadcn/ui 新增組件（`npx shadcn add`）| `ui-shadcn/ui/` |
| **自訂 UI 組件（wrap 官方 / 設計擴充）** | **`ui-shadcn/ui-custom/`（唯一允許位置）** |

## Route Elsewhere（不放這裡）

| 類型 | 正確位置 |
|---|---|
| 業務邏輯（use case、domain rule） | `src/modules/<context>/domain/` 或 `application/` |
| Repository 實作 | `src/modules/<context>/adapters/outbound/` |
| 頁面組合與路由 | `src/app/` |
| 模組業務 UI pattern | `src/modules/<context>/interfaces/` |

---

## 嚴禁

```ts
// ❌ 在任何 packages/ 套件中 import modules
import { something } from '@/modules/...'

// ❌ 在 src/modules/ 直接 import 第三方 library
import { getFirestore } from 'firebase/firestore'

// ❌ 直接修改 ui-shadcn/ui/ 的官方組件
// ui/button.tsx ← 禁止手動編輯

// ✅ 自訂組件放 ui-custom/
// ui-custom/AppButton.tsx ← 正確位置
```

- 不得在套件層加入業務判斷邏輯
- 每個套件的 `index.ts` 是唯一公開入口
- 不得洩漏第三方 SDK 型別至消費端（能 wrap 就 wrap）

---

## 每個套件都有自己的 AGENTS.md

進入任何套件子目錄前，先讀該目錄的 `AGENTS.md`：

- [integration-firebase/AGENTS.md](./integration-firebase/AGENTS.md)
- [integration-ai/AGENTS.md](./integration-ai/AGENTS.md)
- [integration-http/AGENTS.md](./integration-http/AGENTS.md)
- [integration-trpc/AGENTS.md](./integration-trpc/AGENTS.md)
- [ui-shadcn/AGENTS.md](./ui-shadcn/AGENTS.md)
````

## File: packages/integration-firebase/index.ts
````typescript
/**
 * @module integration-firebase
 * Public surface for the Firebase client integration package.
 */
````

## File: packages/ui-shadcn/ui/accordion.tsx
````typescript
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
⋮----
import { cn } from "@/packages/ui-shadcn"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
⋮----
function Accordion(
⋮----
function AccordionItem(
⋮----
function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props)
⋮----
function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props)
````

## File: packages/ui-shadcn/ui/alert.tsx
````typescript
import { cva, type VariantProps } from "class-variance-authority"
⋮----
import { cn } from "@/packages/ui-shadcn"
⋮----
className=
````

## File: packages/ui-shadcn/ui/aspect-ratio.tsx
````typescript
import { cn } from "@/packages/ui-shadcn"
⋮----
className=
````

## File: packages/ui-shadcn/ui/avatar.tsx
````typescript
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar"
⋮----
import { cn } from "@/packages/ui-shadcn"
⋮----
className=
````

## File: packages/ui-shadcn/ui/badge.tsx
````typescript
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
⋮----
import { cn } from "@/packages/ui-shadcn"
⋮----
function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>)
````

## File: packages/ui-shadcn/ui/breadcrumb.tsx
````typescript
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
⋮----
import { cn } from "@/packages/ui-shadcn"
import { ChevronRightIcon, MoreHorizontalIcon } from "lucide-react"
⋮----
function Breadcrumb(
⋮----
className=
````

## File: packages/ui-shadcn/ui/button.tsx
````typescript
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
⋮----
import { cn } from "@/packages/ui-shadcn"
⋮----
className=
````

## File: packages/ui-shadcn/ui/card.tsx
````typescript
import { cn } from "@/packages/ui-shadcn"
⋮----
className=
````

## File: packages/ui-shadcn/ui/checkbox.tsx
````typescript
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
⋮----
import { cn } from "@/packages/ui-shadcn"
import { CheckIcon } from "lucide-react"
⋮----
function Checkbox(
````

## File: packages/ui-shadcn/ui/context-menu.tsx
````typescript
import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu"
⋮----
import { cn } from "@/packages/ui-shadcn"
import { ChevronRightIcon, CheckIcon } from "lucide-react"
⋮----
function ContextMenuPortal(
⋮----
function ContextMenuTrigger({
  className,
  ...props
}: ContextMenuPrimitive.Trigger.Props)
⋮----
className=
⋮----
return (
````

## File: packages/ui-shadcn/ui/drawer.tsx
````typescript
import { Drawer as DrawerPrimitive } from "vaul"
⋮----
import { cn } from "@/packages/ui-shadcn"
⋮----
className=
````

## File: packages/ui-shadcn/ui/empty.tsx
````typescript
import { cva, type VariantProps } from "class-variance-authority"
⋮----
import { cn } from "@/packages/ui-shadcn"
⋮----
className=
````

## File: packages/ui-shadcn/ui/hover-card.tsx
````typescript
import { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card"
⋮----
import { cn } from "@/packages/ui-shadcn"
⋮----
function HoverCardTrigger(
````

## File: packages/ui-shadcn/ui/input-otp.tsx
````typescript
import { OTPInput, OTPInputContext } from "input-otp"
⋮----
import { cn } from "@/packages/ui-shadcn"
import { MinusIcon } from "lucide-react"
⋮----
containerClassName=
className=
````

## File: packages/ui-shadcn/ui/input.tsx
````typescript
import { Input as InputPrimitive } from "@base-ui/react/input"
⋮----
import { cn } from "@/packages/ui-shadcn"
⋮----
className=
````

## File: packages/ui-shadcn/ui/kbd.tsx
````typescript
import { cn } from "@/packages/ui-shadcn"
⋮----
className=
````

## File: packages/ui-shadcn/ui/label.tsx
````typescript
import { cn } from "@/packages/ui-shadcn"
⋮----
className=
````

## File: packages/ui-shadcn/ui/native-select.tsx
````typescript
import { cn } from "@/packages/ui-shadcn"
import { ChevronDownIcon } from "lucide-react"
⋮----
type NativeSelectProps = Omit<React.ComponentProps<"select">, "size"> & {
  size?: "sm" | "default"
}
⋮----
function NativeSelect({
  className,
  size = "default",
  ...props
}: NativeSelectProps)
⋮----
className=
````

## File: packages/ui-shadcn/ui/navigation-menu.tsx
````typescript
import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu"
import { cva } from "class-variance-authority"
⋮----
import { cn } from "@/packages/ui-shadcn"
import { ChevronDownIcon } from "lucide-react"
⋮----
className=
⋮----
function NavigationMenuTrigger({
  className,
  children,
  ...props
}: NavigationMenuPrimitive.Trigger.Props)
````

## File: packages/ui-shadcn/ui/popover.tsx
````typescript
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
⋮----
import { cn } from "@/packages/ui-shadcn"
⋮----
className=
````

## File: packages/ui-shadcn/ui/progress.tsx
````typescript
import { Progress as ProgressPrimitive } from "@base-ui/react/progress"
⋮----
import { cn } from "@/packages/ui-shadcn"
⋮----
function Progress({
  className,
  children,
  value,
  ...props
}: ProgressPrimitive.Root.Props)
⋮----
className=
````

## File: packages/ui-shadcn/ui/radio-group.tsx
````typescript
import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"
⋮----
import { cn } from "@/packages/ui-shadcn"
⋮----
function RadioGroup(
⋮----
className=
````

## File: packages/ui-shadcn/ui/resizable.tsx
````typescript
import { cn } from "@/packages/ui-shadcn"
````

## File: packages/ui-shadcn/ui/scroll-area.tsx
````typescript
import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area"
⋮----
import { cn } from "@/packages/ui-shadcn"
⋮----
function ScrollArea({
  className,
  children,
  ...props
}: ScrollAreaPrimitive.Root.Props)
⋮----
function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: ScrollAreaPrimitive.Scrollbar.Props)
````

## File: packages/ui-shadcn/ui/select.tsx
````typescript
import { Select as SelectPrimitive } from "@base-ui/react/select"
⋮----
import { cn } from "@/packages/ui-shadcn"
import { ChevronDownIcon, CheckIcon, ChevronUpIcon } from "lucide-react"
⋮----
function SelectGroup(
⋮----
function SelectValue(
⋮----
function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: SelectPrimitive.Trigger.Props & {
  size?: "sm" | "default"
})
⋮----
className=
⋮----
function SelectLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props)
⋮----
function SelectItem({
  className,
  children,
  ...props
}: SelectPrimitive.Item.Props)
⋮----
function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props)
⋮----
function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>)
````

## File: packages/ui-shadcn/ui/separator.tsx
````typescript
import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"
⋮----
import { cn } from "@/packages/ui-shadcn"
⋮----
className=
````

## File: packages/ui-shadcn/ui/skeleton.tsx
````typescript
import { cn } from "@/packages/ui-shadcn"
⋮----
className=
````

## File: packages/ui-shadcn/ui/slider.tsx
````typescript
import { Slider as SliderPrimitive } from "@base-ui/react/slider"
⋮----
import { cn } from "@/packages/ui-shadcn"
⋮----
className=
````

## File: packages/ui-shadcn/ui/spinner.tsx
````typescript
import { cn } from "@/packages/ui-shadcn"
import { Loader2Icon } from "lucide-react"
⋮----
<Loader2Icon role="status" aria-label="Loading" className=
````

## File: packages/ui-shadcn/ui/switch.tsx
````typescript
import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
⋮----
import { cn } from "@/packages/ui-shadcn"
⋮----
function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default"
})
⋮----
className=
````

## File: packages/ui-shadcn/ui/table.tsx
````typescript
import { cn } from "@/packages/ui-shadcn"
⋮----
className=
````

## File: packages/ui-shadcn/ui/tabs.tsx
````typescript
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva, type VariantProps } from "class-variance-authority"
⋮----
import { cn } from "@/packages/ui-shadcn"
⋮----
className=
````

## File: packages/ui-shadcn/ui/textarea.tsx
````typescript
import { cn } from "@/packages/ui-shadcn"
⋮----
className=
````

## File: packages/ui-shadcn/ui/toggle.tsx
````typescript
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { cva, type VariantProps } from "class-variance-authority"
⋮----
import { cn } from "@/packages/ui-shadcn"
⋮----
className=
````

## File: packages/README.md
````markdown
# Packages Layer

此目錄是所有**共享平台能力**的唯一存放層。`src/modules/` 與 `src/app/` 不得直接依賴第三方 library，必須透過此層的套件存取外部能力。

---

## 層次位置

```
src/app / src/modules  →  packages  →  third-party libraries
```

規則：
- `src/modules/` 不得直接 import 第三方 library
- `src/modules/` 只能 import `packages/` 提供的套件
- `packages/` 是唯一允許直接依賴外部 library 的層

---

## 現有套件清單

### 🔌 integration-* — 外部服務封裝層

| 套件 | 封裝目標 | 文件 |
|---|---|---|
| `integration-firebase` | Firebase App / Auth / Firestore | [README](./integration-firebase/README.md) |
| `integration-ai` | Genkit / Google AI SDK | [README](./integration-ai/README.md) |
| `integration-http` | HTTP 用戶端（fetch / ky） | [README](./integration-http/README.md) |
| `integration-trpc` | tRPC 客戶端與 Provider | [README](./integration-trpc/README.md) |

職責：封裝 SDK、標準化設定、normalize API 介面。

---

### 🎨 ui-* — 設計系統與 UI 原語層

| 套件 | 說明 | 文件 |
|---|---|---|
| `ui-shadcn` | 官方 shadcn/ui 組件（CLI 管理，禁止修改）| [README](./ui-shadcn/README.md) |

> **自訂 UI 組件唯一存放位置**：`packages/ui-shadcn/ui-custom/`  
> 任何對官方組件的 wrap、設計系統擴充、業務語意層一律放入 `ui-custom/`，不放在 `src/modules/` 或 `src/app/`。

職責：共享 UI 組件、互動模式、設計 token。

---

## 硬性規則

### 1. modules 不得直接使用第三方 library

```ts
// ❌ 錯誤：在 modules 直接 import Firebase
import { getFirestore } from 'firebase/firestore'

// ✅ 正確：透過 packages 套件
import { firestoreApi } from '@integration-firebase'
```

### 2. 每個套件必須有穩定公開介面

- `index.ts` 是唯一公開入口
- 隱藏實作細節，不洩漏 SDK 型別
- 不洩漏第三方 API 至消費端

### 3. 不得加入業務邏輯

套件不得：
- 包含 domain rule 或 use case 邏輯
- 直接 import `src/modules/*`
- 對特定功能或模組有感知

---

## 判斷原則

| 問題 | 結果 |
|---|---|
| 可跨多個 modules 重用？ | → 放 `packages/` |
| 是業務邏輯或 domain rule？ | → 放 `src/modules/` |
| 是第三方 SDK 封裝？ | → 放 `packages/integration-*/` |
| 是 UI 組件（自訂）？ | → 放 `packages/ui-shadcn/ui-custom/` |
````

## File: packages/ui-shadcn/index.ts
````typescript
/**
 * @package ui-shadcn
 * shadcn/ui component library — public barrel export.
 *
 * All UI primitives are re-exported from this package.
 * Internal components use relative imports; external consumers use @ui-shadcn.
 */
⋮----
// ─── Utility ──────────────────────────────────────────────────────────────────
⋮----
// ─── Hooks ────────────────────────────────────────────────────────────────────
⋮----
// ─── Provider ─────────────────────────────────────────────────────────────────
⋮----
// ─── Components ───────────────────────────────────────────────────────────────
````

## File: packages/ui-shadcn/ui/alert-dialog.tsx
````typescript
import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog"
⋮----
import { cn } from "@/packages/ui-shadcn"
import { Button } from "@/packages/ui-shadcn/ui/button"
⋮----
function AlertDialogTrigger(
⋮----
function AlertDialogPortal(
⋮----
className=
⋮----
return (
    <Button
      data-slot="alert-dialog-action"
      className={cn(className)}
      {...props}
    />
  )
}

function AlertDialogCancel({
  className,
  variant = "outline",
  size = "default",
  ...props
}: AlertDialogPrimitive.Close.Props &
Pick<React.ComponentProps<typeof Button>, "variant" | "size">)
````

## File: packages/ui-shadcn/ui/button-group.tsx
````typescript
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
⋮----
import { cn } from "@/packages/ui-shadcn"
import { Separator } from "@/packages/ui-shadcn/ui/separator"
⋮----
return useRender(
⋮----
className=
````

## File: packages/ui-shadcn/ui/calendar.tsx
````typescript
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
  type Locale,
} from "react-day-picker"
⋮----
import { cn } from "@/packages/ui-shadcn"
import { Button, buttonVariants } from "@/packages/ui-shadcn/ui/button"
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from "lucide-react"
⋮----
className=
````

## File: packages/ui-shadcn/ui/carousel.tsx
````typescript
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"
⋮----
import { cn } from "@/packages/ui-shadcn"
import { Button } from "@/packages/ui-shadcn/ui/button"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
⋮----
type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]
⋮----
type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}
⋮----
type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps
⋮----
function useCarousel()
⋮----
function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & CarouselProps)
⋮----
className=
````

## File: packages/ui-shadcn/ui/chart.tsx
````typescript
type TooltipValueType = number | string | Array<number | string>
⋮----
import { cn } from "@/packages/ui-shadcn"
⋮----
// Format: { THEME_NAME: CSS_SELECTOR }
⋮----
type TooltipNameType = number | string
⋮----
export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
>
⋮----
type ChartContextProps = {
  config: ChartConfig
}
⋮----
function useChart()
⋮----
className=
⋮----
<div className=
⋮----
return <div className=
````

## File: packages/ui-shadcn/ui/combobox.tsx
````typescript
import { Combobox as ComboboxPrimitive } from "@base-ui/react"
⋮----
import { cn } from "@/packages/ui-shadcn"
import { Button } from "@/packages/ui-shadcn/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/packages/ui-shadcn/ui/input-group"
import { ChevronDownIcon, XIcon, CheckIcon } from "lucide-react"
⋮----
function ComboboxTrigger({
  className,
  children,
  ...props
}: ComboboxPrimitive.Trigger.Props)
⋮----
className=
````

## File: packages/ui-shadcn/ui/command.tsx
````typescript
import { Command as CommandPrimitive } from "cmdk"
⋮----
import { cn } from "@/packages/ui-shadcn"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/packages/ui-shadcn/ui/dialog"
import {
  InputGroup,
  InputGroupAddon,
} from "@/packages/ui-shadcn/ui/input-group"
import { SearchIcon, CheckIcon } from "lucide-react"
⋮----
className=
````

## File: packages/ui-shadcn/ui/dialog.tsx
````typescript
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
⋮----
import { cn } from "@/packages/ui-shadcn"
import { Button } from "@/packages/ui-shadcn/ui/button"
import { XIcon } from "lucide-react"
⋮----
className=
````

## File: packages/ui-shadcn/ui/dropdown-menu.tsx
````typescript
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
⋮----
import { cn } from "@/packages/ui-shadcn"
import { ChevronRightIcon, CheckIcon } from "lucide-react"
⋮----
className=
````

## File: packages/ui-shadcn/ui/field.tsx
````typescript
import { useMemo } from "react"
import { cva, type VariantProps } from "class-variance-authority"
⋮----
import { cn } from "@/packages/ui-shadcn"
import { Label } from "@/packages/ui-shadcn/ui/label"
import { Separator } from "@/packages/ui-shadcn/ui/separator"
⋮----
className=
````

## File: packages/ui-shadcn/ui/input-group.tsx
````typescript
import { cva, type VariantProps } from "class-variance-authority"
⋮----
import { cn } from "@/packages/ui-shadcn"
import { Button } from "@/packages/ui-shadcn/ui/button"
import { Input } from "@/packages/ui-shadcn/ui/input"
import { Textarea } from "@/packages/ui-shadcn/ui/textarea"
⋮----
className=
⋮----
if ((e.target as HTMLElement).closest("button"))
````

## File: packages/ui-shadcn/ui/item.tsx
````typescript
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
⋮----
import { cn } from "@/packages/ui-shadcn"
import { Separator } from "@/packages/ui-shadcn/ui/separator"
⋮----
className=
````

## File: packages/ui-shadcn/ui/menubar.tsx
````typescript
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { Menubar as MenubarPrimitive } from "@base-ui/react/menubar"
⋮----
import { cn } from "@/packages/ui-shadcn"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/packages/ui-shadcn/ui/dropdown-menu"
import { CheckIcon } from "lucide-react"
⋮----
className=
````

## File: packages/ui-shadcn/ui/pagination.tsx
````typescript
import { cn } from "@/packages/ui-shadcn"
import { Button } from "@/packages/ui-shadcn/ui/button"
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react"
⋮----
className=
⋮----
function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps)
⋮----
function PaginationPrevious({
  className,
  text = "Previous",
  ...props
}: React.ComponentProps<typeof PaginationLink> &
⋮----
function PaginationNext({
  className,
  text = "Next",
  ...props
}: React.ComponentProps<typeof PaginationLink> &
⋮----
function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">)
````

## File: packages/ui-shadcn/ui/sheet.tsx
````typescript
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog"
⋮----
import { cn } from "@/packages/ui-shadcn"
import { Button } from "@/packages/ui-shadcn/ui/button"
import { XIcon } from "lucide-react"
⋮----
className=
````

## File: packages/ui-shadcn/ui/toggle-group.tsx
````typescript
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group"
import { type VariantProps } from "class-variance-authority"
⋮----
import { cn } from "@/packages/ui-shadcn"
import { toggleVariants } from "@/packages/ui-shadcn/ui/toggle"
⋮----
function ToggleGroup({
  className,
  variant,
  size,
  spacing = 0,
  orientation = "horizontal",
  children,
  ...props
}: ToggleGroupPrimitive.Props &
  VariantProps<typeof toggleVariants> & {
    spacing?: number
    orientation?: "horizontal" | "vertical"
})
⋮----
className=
⋮----
function ToggleGroupItem({
  className,
  children,
  variant = "default",
  size = "default",
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>)
````

## File: packages/ui-shadcn/ui/tooltip.tsx
````typescript
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"
⋮----
import { cn } from "@/packages/ui-shadcn"
⋮----
function TooltipContent({
  className,
  side = "top",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  children,
  ...props
}: TooltipPrimitive.Popup.Props &
  Pick<
    TooltipPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
>)
⋮----
className=
````

## File: packages/ui-shadcn/ui/sidebar.tsx
````typescript
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
⋮----
import { useIsMobile } from "@/packages/ui-shadcn/hooks/use-mobile"
import { cn } from "@/packages/ui-shadcn"
import { Button } from "@/packages/ui-shadcn/ui/button"
import { Input } from "@/packages/ui-shadcn/ui/input"
import { Separator } from "@/packages/ui-shadcn/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/packages/ui-shadcn/ui/sheet"
import { Skeleton } from "@/packages/ui-shadcn/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/packages/ui-shadcn/ui/tooltip"
import { PanelLeftIcon } from "lucide-react"
⋮----
type SidebarContextProps = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}
⋮----
function useSidebar()
⋮----
// This is the internal state of the sidebar.
// We use openProp and setOpenProp for control from outside the component.
⋮----
// This sets the cookie to keep the sidebar state.
⋮----
// Helper to toggle the sidebar.
⋮----
// Adds a keyboard shortcut to toggle the sidebar.
⋮----
const handleKeyDown = (event: KeyboardEvent) =>
⋮----
// We add a state so that we can do data-state="expanded" or "collapsed".
// This makes it easier to style the sidebar with Tailwind classes.
⋮----
className=
⋮----
{/* This is what handles the sidebar gap on desktop */}
⋮----
// Adjust the padding for floating and inset variants.
⋮----
function SidebarGroupAction({
  className,
  render,
  ...props
}: useRender.ComponentProps<"button"> & React.ComponentProps<"button">)
⋮----
function SidebarMenuAction({
  className,
  render,
  showOnHover = false,
  ...props
}: useRender.ComponentProps<"button"> &
  React.ComponentProps<"button"> & {
    showOnHover?: boolean
})
⋮----
// Random width between 50 to 90%.
````