# Files

## File: src/app/(public)/page.tsx
````typescript
import { PublicLandingView } from "@/src/modules/iam/adapters/inbound/react";
⋮----
export default function PublicPage()
````

## File: src/app/(shell)/(account)/[accountId]/[[...slug]]/page.tsx
````typescript
import { AccountRouteDispatcher } from "@/src/modules/workspace/adapters/inbound/react";
⋮----
interface AccountSlugPageProps {
  params: Promise<{ accountId: string; slug?: string[] }>;
}
````

## File: src/app/(shell)/layout.tsx
````typescript
import { ShellFrame } from "@/src/modules/platform/adapters/inbound/react";
⋮----
export default function ShellLayout({
  children,
}: Readonly<
````

## File: src/app/globals.css
````css
@theme inline {
⋮----
:root {
⋮----
.dark {
⋮----
@layer base {
⋮----
* {
body {
html {
⋮----
@apply font-sans;
⋮----
/* ── Tiptap / ProseMirror editor styles ───────────────────────────────────── */
.tiptap-editor .ProseMirror {
.tiptap-editor .ProseMirror p.is-editor-empty:first-child::before {
.tiptap-editor .ProseMirror h1 { @apply text-3xl font-bold mb-3 mt-5; }
.tiptap-editor .ProseMirror h2 { @apply text-2xl font-semibold mb-2 mt-4; }
.tiptap-editor .ProseMirror h3 { @apply text-xl font-medium mb-2 mt-3; }
.tiptap-editor .ProseMirror p  { @apply mb-2 leading-relaxed; }
.tiptap-editor .ProseMirror ul { @apply list-disc pl-5 mb-2 space-y-0.5; }
.tiptap-editor .ProseMirror ol { @apply list-decimal pl-5 mb-2 space-y-0.5; }
.tiptap-editor .ProseMirror li { @apply leading-relaxed; }
.tiptap-editor .ProseMirror blockquote {
.tiptap-editor .ProseMirror hr {
.tiptap-editor .ProseMirror code {
.tiptap-editor .ProseMirror a {
.tiptap-editor .ProseMirror strong { @apply font-bold; }
.tiptap-editor .ProseMirror em { @apply italic; }
.tiptap-editor .ProseMirror u  { @apply underline; }
.tiptap-editor .ProseMirror s  { @apply line-through; }
/* ── Callout block ──────────────────────────────────────────────────────────── */
.tiptap-editor .ProseMirror .callout-block {
.tiptap-editor .ProseMirror .callout-emoji {
.tiptap-editor .ProseMirror .callout-content {
.tiptap-editor .ProseMirror .callout-content p { @apply mb-1; }
⋮----
/* ── Toggle (collapsible) block ─────────────────────────────────────────────── */
.tiptap-editor .ProseMirror .toggle-block {
.tiptap-editor .ProseMirror .toggle-block > summary {
.tiptap-editor .ProseMirror .toggle-block > summary::-webkit-details-marker { display: none; }
.tiptap-editor .ProseMirror .toggle-block > :not(summary) {
⋮----
/* ── Table of Contents block ─────────────────────────────────────────────────── */
.tiptap-editor .ProseMirror .toc-block {
.tiptap-editor .ProseMirror .toc-block::before {
````

## File: src/app/layout.tsx
````typescript
import { ThemeProvider } from "@packages";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { cn } from "@/packages/ui-shadcn";
⋮----
import { PlatformBootstrap } from "@/src/modules/platform/adapters/inbound/react";
⋮----
export default function RootLayout({
  children,
}: Readonly<
````

## File: src/app/AGENTS.md
````markdown
# src/app Agent Rules

## ROLE

- The agent MUST treat src/app as App Router composition surface.
- The agent MUST keep page, layout, and route wiring concerns in this subtree.
- The agent MUST keep business behavior outside src/app.

## DOMAIN BOUNDARIES

- The agent MUST NOT place use-case logic in route handlers or page components.
- The agent MUST route business operations through module public APIs.
- The agent MUST keep shared UI primitives in packages, not app-local duplicates.

## TOOL USAGE

- The agent MUST verify route ownership before editing any route group.
- The agent MUST verify imports resolve to public module boundaries.
- The agent MUST keep edits scoped to composition concerns only.

## EXECUTION FLOW

- The agent MUST follow this order:
	1. Read [../AGENTS.md](../AGENTS.md).
	2. Read this file and [README.md](README.md).
	3. Confirm change is composition-level.
	4. Implement route/layout updates.
	5. Validate links and build/lint impact.

## DATA CONTRACT

- The agent MUST keep route parameter naming consistent with owning context contracts.
- The agent MUST keep path references relative and valid.
- The agent MUST document only composition intent in app docs.

## CONSTRAINTS

- The agent MUST NOT access infrastructure adapters directly from app.
- The agent MUST NOT add cross-context coupling in route composition.
- The agent MUST NOT duplicate module documentation in this file.

## ERROR HANDLING

- The agent MUST fail fast when route ownership is unclear.
- The agent MUST report stale route links or invalid imports.
- The agent MUST stop and escalate when change requires architecture decision.

## CONSISTENCY

- The agent MUST keep AGENTS as routing contract and README as human overview.
- The agent MUST preserve one-way composition flow from app to module public APIs.

## SECURITY

- The agent MUST avoid exposing secrets or raw credentials in route examples.
- The agent MUST preserve auth boundaries by delegating checks to modules/use-cases.

## Route Here When

- You modify page, layout, route groups, parallel routes, loading/error composition.
- You adjust App Router slot composition and rendering boundaries.

## Route Elsewhere When

- Business rules, use cases, domain entities: [../modules/AGENTS.md](../modules/AGENTS.md)
- Shared UI primitives: [../../packages/AGENTS.md](../../packages/AGENTS.md)
- Heavy async ingestion/embedding pipelines: [../../fn/AGENTS.md](../../fn/AGENTS.md)

## Quick Links

- Parent: [../AGENTS.md](../AGENTS.md)
- Pair: [README.md](README.md)
- Module layer: [../modules/AGENTS.md](../modules/AGENTS.md)
- Strategic authority: [../../docs/README.md](../../docs/README.md)
````

## File: src/app/README.md
````markdown
# src/app

## PURPOSE

src/app 是 Next.js App Router 的 composition layer。
本層負責 page/layout/slot 組裝與 route-level rendering 邏輯。
業務規則不應落在本層，而應由 modules 提供公開能力。

## GETTING STARTED

從 repo 根目錄啟動：

```bash
npm install
npm run dev
```

進入 app 後，先閱讀：

1. [AGENTS.md](AGENTS.md)
2. [../AGENTS.md](../AGENTS.md)
3. [../../docs/README.md](../../docs/README.md)

## ARCHITECTURE

app 層只做 composition：

- route group 與 layout 編排
- loading/error/not-found 視圖組裝
- 對 modules 公開 API 的調用

## PROJECT STRUCTURE

- [AGENTS.md](AGENTS.md)：AI 路由與邊界規則
- [../modules](../modules)：業務能力提供層
- [../README.md](../README.md)：src 層總覽

## DEVELOPMENT RULES

- MUST keep business rules outside route components.
- MUST call modules through public boundaries.
- MUST keep command/query orchestration in modules, not in app routes.
- MUST preserve route parameter semantics from owning context contracts.

## AI INTEGRATION

AI 代理在 app 層只做組裝決策，不直接產生跨域業務邏輯。
若需求牽涉 bounded-context 所有權，先回到 docs 權威文件。

## DOCUMENTATION

- Routing rules: [AGENTS.md](AGENTS.md)
- src overview: [../README.md](../README.md)
- modules overview: [../modules/README.md](../modules/README.md)
- Strategic authority: [../../docs/README.md](../../docs/README.md)

## USABILITY

- 新開發者可在 5 分鐘內啟動並找到 app 層入口。
- 可在 3 分鐘內判斷改動應落在 app 還是 modules。
````