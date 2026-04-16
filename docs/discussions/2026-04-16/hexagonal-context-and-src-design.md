# Hexagonal Context & src/ Architecture Design Discussion

**Date**: 2026-04-16  
**Context**: Post-distillation design review — `modules/` → `src/modules/` migration complete (commit 46dd39a3, 0 TS errors).  
**Scope**: 5 architectural decisions for the next development phase.

---

## 背景：現況快照

```
app/(shell)/_providers/AppProvider.tsx    ← 帳號生命週期 React Reducer
app/_providers/index.tsx                  ← AuthProvider → AppProvider → WorkspaceContextProvider
app/(shell)/_shell/ShellRootLayout.tsx    ← 龐大 Client Component，直接 useApp() + useWorkspaceContext()
app/(shell)/layout.tsx                    ← shim，轉發到 ShellRootLayout
app/layout.tsx                            ← RootLayout + Providers + fonts
```

問題：跨模組狀態組裝發生在 `app/` 內的特設文件夾中（`_providers/`、`_shell/`），不符合六邊形架構的 **inbound adapter** 定位。

---

## 問題一：src/modules 中如何實現等價上下文？

### 現況問題
`AppProvider` 混合了三件事：
1. **狀態機邏輯**（appReducer — accounts hydration, bootstrapPhase）
2. **副作用協調**（subscribeToAccountsForUser, localStorage sync）
3. **React 膠水**（useReducer, Context.Provider）

這導致業務邏輯洩漏到 `app/` 層。

### 六邊形解方：Context 是 Inbound Adapter

```
src/modules/platform/
  adapters/
    inbound/
      react/                           ← React 特定的 inbound adapter
        AccountScopeProvider.tsx       ← 取代 AppProvider.tsx
        useAccountScope.ts             ← 取代 useApp() hook
        ShellBootstrap.tsx             ← 取代 ShellRootLayout.tsx (組裝層)
  application/
    use-cases/
      ResolveActiveAccount.use-case.ts ← 業務邏輯：哪個 account 是 active
  domain/
    repositories/
      AccountScopePort.ts              ← 訂閱帳號列表的 port 介面
```

**原則：**
- `adapters/inbound/react/` 只做「把 React 生命週期翻譯成 use-case 呼叫」
- Reducer 邏輯（`resolveActiveAccount` 業務決策）提升到 `application/use-cases/`
- `AccountScopeProvider` 本身是薄殼：持有 Zustand store，訂閱 port，呼叫 use-case

```typescript
// src/modules/platform/adapters/inbound/react/AccountScopeProvider.tsx
"use client";

// 薄殼：協調副作用，業務決策委派給 use-case
export function AccountScopeProvider({ children }: { children: ReactNode }) {
  const { user, status } = useIamSession();                    // iam module hook
  const store = useAccountScopeStore();                        // zustand

  useEffect(() => {
    if (status === "initializing" || !user) {
      store.reset();
      return;
    }
    // 副作用協調 — port 訂閱
    return subscribeAccountsPort(user.id, (accounts) => {
      const resolved = resolveActiveAccountUseCase.execute({   // application use-case
        accounts, user,
        preferredId: readPersistedAccountId(),
        current: store.activeAccount,
      });
      store.setAccounts(accounts, resolved);
    });
  }, [status, user?.id]);

  return <>{children}</>;
}
```

### 結構對照

| 現況 | src/ 六邊形等價 |
|---|---|
| `app/(shell)/_providers/AppProvider.tsx` | `src/modules/platform/adapters/inbound/react/AccountScopeProvider.tsx` |
| `useApp()` from `modules/platform/api/ui` | `useAccountScope()` from `src/modules/platform/adapters/inbound/react/` |
| `app/_providers/index.tsx` Providers 組裝 | `src/app/layout.tsx` 只 import `<PlatformBootstrap>` (自包含) |
| `WorkspaceContextProvider` | `src/modules/workspace/adapters/inbound/react/WorkspaceScopeProvider.tsx` |

**關鍵轉變**：`app/` 不再知道「帳號」或「工作區」的存在，它只 mount 各模組的 inbound adapter 組件。

---

## 問題二：AI 相關功能的長遠開發性

### 現況
`src/modules/ai` 已有正確的 port 設計：
- `TextGenerationPort`、`ContentDistillationPort`、`TaskExtractionPort`（generation）
- `VectorRetrievalPort`、`RetrievalQueryPort`（retrieval）

### 長遠開發框架

#### 原則一：AI 永遠是外部不信任 Actor
```
Use Case → AI Port (interface) → [Adapter: Genkit / OpenAI / Local] → validate output → return typed result
```
AI output 未通過 Zod schema 之前，永遠不進入 domain。

#### 原則二：Provider 策略模式（可熱換）

```
src/modules/ai/
  adapters/outbound/
    genkit/                    ← production adapter
      GenkitGenerationAdapter.ts
      GenkitRetrievalAdapter.ts
    openai/                    ← alternative adapter (same ports)
      OpenAIGenerationAdapter.ts
    local/                     ← local/offline adapter
      LocalGenerationAdapter.ts
    mock/                      ← test adapter
      MockGenerationAdapter.ts
```

所有 adapter 實作相同的 port interface → 可在 DI 組裝時抽換，不影響任何 use-case 或 domain。

#### 原則三：Streaming 以 AsyncGenerator 為 port contract

```typescript
// domain port — 不含框架細節
export interface TextGenerationPort {
  generate(input: GenerationInput): Promise<GenerationOutput>;
  generateStream(input: GenerationInput): AsyncGenerator<GenerationChunk>;
}
```

React Server Component 消費 `generateStream`，透過 `ReadableStream` 傳到 client — Next.js 層細節，不進 domain。

#### 原則四：AI 子域的演化路徑

| 階段 | 重點 | 對應子域 |
|---|---|---|
| 現在 | Port 定義 + InMemory mock | generation, retrieval, chunk, embedding |
| 近期 | Genkit adapter 實作 | generation, pipeline |
| 中期 | RAG 評估回路 | evaluation, citation |
| 長期 | Multi-agent 協作 | context, memory, tool-calling |

每個子域獨立演化，不觸碰其他子域內部。

---

## 問題三：用六邊形模式取代 `_providers` / `_shell`

### 現況問題
```
app/(shell)/_providers/AppProvider.tsx   ← 混合業務邏輯 + React 膠水
app/(shell)/_shell/ShellRootLayout.tsx  ← 780+ 行 Client Component，直接消費多個 module 狀態
```

`ShellRootLayout.tsx` 直接 `useApp()` + `useWorkspaceContext()` + `useAuth()` + `subscribeToProfile()`，成為一個跨三個 bounded context 的耦合點。

### 六邊形解方

**核心思維**：Shell 是 `platform` 模組的 **inbound adapter 組合物**，不是 `app/` 的私有實作。

```
src/modules/platform/
  adapters/
    inbound/
      react/
        AccountScopeProvider.tsx         ← 取代 AppProvider
        ShellFrame.tsx                   ← 取代 ShellRootLayout（只組合下層 adapters）
        ShellAppRail.tsx                 ← 純 props-driven，無直接 useContext
        ShellSidebar.tsx                 ← 純 props-driven
        useAccountScope.ts               ← 取代 useApp()
        useShellNavigation.ts            ← 取代散落在 ShellRootLayout 的 routing logic

src/modules/workspace/
  adapters/
    inbound/
      react/
        WorkspaceScopeProvider.tsx       ← 取代 WorkspaceContextProvider
        useWorkspaceScope.ts             ← 取代 useWorkspaceContext()
```

**`ShellFrame` 的核心設計原則**：

```typescript
// src/modules/platform/adapters/inbound/react/ShellFrame.tsx
// 唯一責任：組合子組件，傳遞 props，不持有業務邏輯

export function ShellFrame({ children }: { children: ReactNode }) {
  // 只從同模組 inbound adapter hooks 取值
  const { activeAccount, accounts } = useAccountScope();
  const { activeWorkspaceId, workspaces } = useWorkspaceScope();   // workspace module hook
  const { user } = useIamSession();                                  // iam module hook
  const nav = useShellNavigation();

  return (
    <ShellGuard>
      <div className="flex h-screen overflow-hidden">
        <ShellAppRail {...nav.railProps(activeAccount, accounts, workspaces)} />
        <ShellSidebar {...nav.sidebarProps(activeAccount, workspaces)} />
        <main>{children}</main>
      </div>
    </ShellGuard>
  );
}
```

**Props 驅動，而非 Context 穿透**：子組件 (`ShellAppRail`, `ShellSidebar`) 收 props，不直接呼叫任何 `useContext`。這使它們可獨立測試。

### 替換前後對比

```
替換前：
  app/layout.tsx → <Providers>
    AuthProvider → AppProvider → WorkspaceContextProvider
      app/(shell)/layout.tsx → <ShellLayout> (ShellRootLayout.tsx, 780行)

替換後：
  src/app/layout.tsx → <PlatformBootstrap>     ← platform inbound adapter，自包含
    IamSessionProvider                          ← iam inbound adapter
    AccountScopeProvider                        ← platform inbound adapter
    WorkspaceScopeProvider                      ← workspace inbound adapter
      src/app/(shell)/layout.tsx → <ShellFrame> ← platform inbound adapter，80行
```

`app/` 層只知道「module 提供了什麼組件」，不知道模組內部怎麼管理狀態。

---

## 問題四：四個核心頁面的設計

### 設計原則
- `app/` 不包含業務邏輯，只做「把 URL 參數交給模組 inbound adapter」
- Server Component 優先；只在需要互動時切到 Client Component
- layout 不做狀態管理，只做組裝

### `src/app/layout.tsx` — Root Layout

```typescript
// Server Component — 字型、metadata、全域 CSS
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { cn } from "@shared-utils";
import { PlatformBootstrap } from "@src/modules/platform/adapters/inbound/react";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Xuanwu App",
  description: "Knowledge-management and AI-assisted workspace platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="antialiased">
        <PlatformBootstrap>{children}</PlatformBootstrap>
      </body>
    </html>
  );
}
```

**`PlatformBootstrap`** = 模組自包含的 provider tree（IamSession → AccountScope → WorkspaceScope + Toaster）。`app/layout.tsx` 不知道 Auth、Account、Workspace 的存在。

### `src/app/(public)/page.tsx` — 公開落地頁

```typescript
// Server Component — 靜態殼
import { PublicLandingView } from "@src/modules/iam/adapters/inbound/react";

export default function PublicPage() {
  return <PublicLandingView />;
}
```

**`PublicLandingView`** = iam 模組的 inbound adapter 組件，自行持有 `"use client"` 邊界，管理 auth 狀態、登入/註冊面板。`page.tsx` 是純 Server Component shim。

### `src/app/(shell)/layout.tsx` — Shell Layout

```typescript
// Server Component — 純結構 shim
import { ShellFrame } from "@src/modules/platform/adapters/inbound/react";

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  return <ShellFrame>{children}</ShellFrame>;
}
```

**`ShellFrame`** = platform 模組的 inbound adapter（見問題三）。整個 shell 的狀態邏輯、導覽邏輯都封裝在模組內。`layout.tsx` 只有 3 行。

### `src/app/(shell)/(account)/[accountId]/[[...slug]]/page.tsx` — 帳號路由分派器

```typescript
// Server Component — 讀取 params，委派給 workspace/platform inbound adapter
import { AccountRouteDispatcher } from "@src/modules/workspace/adapters/inbound/react";

interface Props {
  params: Promise<{ accountId: string; slug?: string[] }>;
}

export default async function AccountSlugPage({ params }: Props) {
  const { accountId, slug } = await params;
  return <AccountRouteDispatcher accountId={accountId} slug={slug ?? []} />;
}
```

**`AccountRouteDispatcher`** = workspace + platform 模組的 `"use client"` 組件，自行消費 scope hooks，決定渲染哪個 screen。`page.tsx` 是純 props 傳遞，無任何業務邏輯。

### 四個頁面責任總表

| 檔案 | Component Type | 責任 | 業務邏輯 |
|---|---|---|---|
| `layout.tsx` | Server | 字型 + CSS + mount `PlatformBootstrap` | ❌ 無 |
| `(public)/page.tsx` | Server | mount `PublicLandingView` | ❌ 無 |
| `(shell)/layout.tsx` | Server | mount `ShellFrame` | ❌ 無 |
| `(shell)/…/page.tsx` | Server | 讀 params + mount `AccountRouteDispatcher` | ❌ 無 |

所有業務邏輯都在對應模組的 `adapters/inbound/react/` 內。

---

## 問題五：packages 設計（簡易討論）

### 現況 packages 分類

```
packages/
  shared-*         → 純型別/工具，無框架依賴
  integration-*    → Firebase/HTTP 外部整合
  ui-*             → UI 元件庫 (shadcn, vis)
  lib-*            → 第三方庫 thin wrappers
  api-contracts    → 跨服務 API 型別契約
```

### src/ 架構後的 packages 設計方向

**原則：packages 只服務兩種目的**

| 類型 | 定位 | 使用層 | 規則 |
|---|---|---|---|
| **Shared Primitives** (`@shared-*`) | 純工具，無 DDD 概念 | 任何層 | 零業務邏輯，無模組依賴 |
| **Infrastructure Adapters** (`@integration-*`) | 外部系統實作 | `adapters/outbound/` 只 | 不能進 `domain/` 或 `application/` |
| **UI Primitives** (`@ui-*`) | 純 UI 元件庫 | `adapters/inbound/react/` 只 | 不包含業務語意 |
| **Lib Wrappers** (`@lib-*`) | 第三方包薄包裝 | 任何層（按各 lib 規則） | 不加業務語意 |

**關鍵決策：api-contracts 的去向**

`api-contracts` 目前混合了「跨模組 API 型別」。在 src/ 架構後：
- 若是 cross-module published language tokens → 遷移到對應 `src/modules/<context>/api/` 
- 若是純 HTTP wire 型別 → 留在 `@api-contracts` 或遷移到 `@integration-http`

**packages 不應增加的東西**：
- 業務規則（屬於 `src/modules/<context>/domain/`）
- 模組間狀態協調邏輯（屬於 `src/modules/<context>/adapters/inbound/react/`）
- 任何對 `src/modules/` 的 import（packages 是下游，不是上游）

**長遠：考慮 npm workspaces 本地連結**，但目前 tsconfig paths alias 方案已足夠，不應過早引入複雜度（Occam's Razor）。

---

## 結論：遷移路徑

```
Step 1 (基礎)  src/modules/ 完整 + 0 TS 錯誤  ✅ 已完成 (commit 46dd39a3)

Step 2 (上下文) 每個 module 建立 adapters/inbound/react/ folder
               platform: AccountScopeProvider, ShellFrame, useAccountScope
               iam: IamSessionProvider, PublicLandingView, useIamSession
               workspace: WorkspaceScopeProvider, AccountRouteDispatcher, useWorkspaceScope

Step 3 (app/)   src/app/ 四個核心頁面重寫（純 shim，業務邏輯全移模組）

Step 4 (AI)     src/modules/ai adapters/outbound/genkit/ 實作 TextGenerationPort + VectorRetrievalPort

Step 5 (packages) 評估 api-contracts 遷移；@integration-firebase 確保只被 adapters/outbound 使用
```

每個 Step 可獨立交付，不阻塞其他步驟。

---

*文件由 Copilot 依代碼審查生成，基於 commit 46dd39a3 的 src/modules/ 狀態。*
