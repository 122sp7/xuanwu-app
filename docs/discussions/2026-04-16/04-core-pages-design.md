# 問題四：四個核心頁面設計

**Date**: 2026-04-16  
**Context**: `src/app/` 目標結構 — 所有頁面都是純 Server Component shim。

---

## 設計原則

- `app/` 不包含業務邏輯，只做「把 URL 參數交給模組 inbound adapter」
- Server Component 優先；只在需要互動時在模組 adapter 層切到 `"use client"`
- layout 不做狀態管理，只做組裝
- 業務邏輯全在對應模組的 `adapters/inbound/react/` 內

---

## `src/app/layout.tsx` — Root Layout

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

`PlatformBootstrap` = 模組自包含的 provider tree（IamSession → AccountScope → WorkspaceScope + Toaster）。`app/layout.tsx` 不知道 Auth、Account、Workspace 的存在。

---

## `src/app/(public)/page.tsx` — 公開落地頁

```typescript
// Server Component — 靜態殼
import { PublicLandingView } from "@src/modules/iam/adapters/inbound/react";

export default function PublicPage() {
  return <PublicLandingView />;
}
```

`PublicLandingView` = iam 模組的 inbound adapter 組件，自行持有 `"use client"` 邊界，管理 auth 狀態、登入/註冊面板。`page.tsx` 是純 Server Component shim。

---

## `src/app/(shell)/layout.tsx` — Shell Layout

```typescript
// Server Component — 純結構 shim
import { ShellFrame } from "@src/modules/platform/adapters/inbound/react";

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  return <ShellFrame>{children}</ShellFrame>;
}
```

`ShellFrame` = platform 模組的 inbound adapter（見問題三）。整個 shell 的狀態邏輯、導覽邏輯都封裝在模組內。`layout.tsx` 只有 3 行。

---

## `src/app/(shell)/(account)/[accountId]/[[...slug]]/page.tsx` — 帳號路由分派器

```typescript
// Server Component — 讀取 params，委派給 workspace inbound adapter
import { AccountRouteDispatcher } from "@src/modules/workspace/adapters/inbound/react";

interface Props {
  params: Promise<{ accountId: string; slug?: string[] }>;
}

export default async function AccountSlugPage({ params }: Props) {
  const { accountId, slug } = await params;
  return <AccountRouteDispatcher accountId={accountId} slug={slug ?? []} />;
}
```

`AccountRouteDispatcher` = workspace + platform 模組的 `"use client"` 組件，自行消費 scope hooks，決定渲染哪個 screen。`page.tsx` 是純 props 傳遞，無任何業務邏輯。

---

## 四個頁面責任總表

| 檔案 | Component Type | 責任 | 業務邏輯 |
|---|---|---|---|
| `layout.tsx` | Server | 字型 + CSS + mount `PlatformBootstrap` | ❌ 無 |
| `(public)/page.tsx` | Server | mount `PublicLandingView` | ❌ 無 |
| `(shell)/layout.tsx` | Server | mount `ShellFrame` | ❌ 無 |
| `(shell)/…/page.tsx` | Server | 讀 params + mount `AccountRouteDispatcher` | ❌ 無 |

---

## Next.js App Router 關鍵規則

- `layout.tsx` 不能包含 `"use client"` — 永遠是 Server Component
- `params` 在 Next.js 16 是 `Promise<…>`，必須 `await params`
- `[[...slug]]` 的 optional catch-all 需要設 `slug ?? []` 預設值
- `generateStaticParams` 可在 page 層加入，不影響模組內部邏輯
