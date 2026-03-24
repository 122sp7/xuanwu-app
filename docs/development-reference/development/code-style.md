# 程式碼風格指南（Code Style Guide）

> **參考文件類型**：本文件定義 Xuanwu App 的 TypeScript、React、CSS 程式碼風格規範，保持全代碼庫一致性。
> 自動化工具：ESLint（`eslint.config.mjs`）與 TypeScript（`tsconfig.json`）為主要執行機制。

---

## 1. TypeScript

### 1.1 型別宣告原則

```typescript
// ✅ 優先使用 interface 定義物件形狀
interface UserProfile {
  readonly id: string;
  name: string;
  email: string;
}

// ✅ 使用 type 定義聯合型別、交叉型別、別名
type DocumentStatus = "processing" | "ready" | "error";
type CommandResult<T = void> = { success: true; data: T } | { success: false; error: DomainError };

// ✅ 從 @shared-types 匯入跨模組共用型別
import type { CommandResult, DomainError } from "@shared-types";

// ❌ 避免 any
const data: any = fetchData(); // 禁止

// ✅ 使用 unknown 代替 any
const data: unknown = fetchData();
```

### 1.2 命名規範

| 類型 | 格式 | 範例 |
|---|---|---|
| 介面（Interface） | `PascalCase` | `WorkspaceEntity` |
| 型別別名（Type alias） | `PascalCase` | `DocumentStatus` |
| 類別（Class） | `PascalCase` | `FirebaseDocumentRepository` |
| 函式 | `camelCase` | `uploadDocument` |
| 常數（模組級別） | `UPPER_SNAKE_CASE` | `MAX_FILE_SIZE_MB` |
| React 元件 | `PascalCase` | `WikiBetaDocumentsView` |
| 檔案：Domain Entity | `PascalCase.ts` | `WorkspaceEntity.ts` |
| 檔案：Repository | `MyRepository.ts` | `IDocumentRepository.ts` |
| 檔案：Firebase Repository | `FirebaseMyRepository.ts` | `FirebaseDocumentRepository.ts` |
| 檔案：Use Case | `verb-noun.use-case.ts` | `upload-document.use-case.ts` |
| 檔案：Server Action | `*.actions.ts` | `document.actions.ts` |
| 檔案：React 元件 | `PascalCase.tsx` | `WikiBetaDocumentsView.tsx` |

### 1.3 函式宣告風格

```typescript
// ✅ 匯出函式使用 function 宣告（可讀性較佳）
export function createWorkspace(input: CreateWorkspaceInput): Promise<CommandResult> {
  // ...
}

// ✅ 回呼、lambda 使用 arrow function
const items = list.map((item) => item.id);

// ✅ 元件使用 function 宣告
export function WikiBetaDocumentsView() {
  // ...
}

// ❌ 避免不必要的 default export（除了 page.tsx 和 layout.tsx）
export default function SomeComponent() {} // 僅適用 Next.js 要求的檔案
```

### 1.4 非同步處理

```typescript
// ✅ 使用 async/await，避免 Promise chain
async function fetchDocuments(accountId: string): Promise<DocumentEntity[]> {
  const snapshot = await getDocs(query(collection(db, `accounts/${accountId}/documents`)));
  return snapshot.docs.map(docToEntity);
}

// ✅ 統一 try/catch 在 use-case 或 Server Action 邊界
export async function reindexDocument(input: ReindexInput): Promise<CommandResult> {
  try {
    await triggerReindex(input);
    return { success: true };
  } catch (error) {
    return { success: false, error: toDomainError(error) };
  }
}

// ❌ 不在元件內 catch 後靜默吞錯誤
try {
  await doSomething();
} catch {
  // 靜默失敗 — 禁止
}
```

---

## 2. React 元件規範

### 2.1 元件結構順序

```tsx
"use client"; // 若需要（置頂）

import React, { useState, useEffect, useCallback } from "react";
// 外部函式庫
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";

// 內部 alias imports
import { Button } from "@ui-shadcn/ui/button";
import { cn } from "@shared-utils";

// 同模組 relative imports
import type { WikiBetaDocument } from "../../domain/entities/wiki-beta-document.entity";

// 型別定義
interface DocumentCardProps {
  readonly document: WikiBetaDocument;
  readonly onReindex: (docId: string) => Promise<void>;
}

// 元件主體
export function DocumentCard({ document, onReindex }: DocumentCardProps) {
  // 1. Hooks（useState、useEffect、custom hooks）
  const [isLoading, setIsLoading] = useState(false);

  // 2. Derived state / memoized values
  const canReindex = document.status === "ready";

  // 3. Event handlers（useCallback 包覆需傳遞給子元件的 handler）
  const handleReindex = useCallback(async () => {
    setIsLoading(true);
    try {
      await onReindex(document.id);
      toast.success("已觸發重整");
    } catch (err) {
      toast.error(`重整失敗：${String(err)}`);
    } finally {
      setIsLoading(false);
    }
  }, [document.id, onReindex]);

  // 4. Render
  return (
    <div className="flex items-center gap-4 rounded-lg border p-4">
      <span className="flex-1">{document.filename}</span>
      <Button
        size="sm"
        disabled={!canReindex || isLoading}
        onClick={handleReindex}
        aria-disabled={!canReindex || isLoading}
      >
        {isLoading ? <Loader2 className="size-4 animate-spin" /> : "手動重整"}
      </Button>
    </div>
  );
}
```

### 2.2 Props 設計規則

```typescript
// ✅ 使用 readonly 標記不可變 props
interface MyProps {
  readonly id: string;
  readonly onAction: () => void;
  className?: string; // 可選 className 用於樣式擴展
}

// ✅ 事件 handler 命名使用 on 前綴
onSubmit, onChange, onDelete, onSelect

// ✅ Boolean props 命名使用 is/has/can 前綴
isLoading, hasError, canEdit, isCollapsed

// ❌ 避免過於泛用的 props
data: any;          // 禁止
config: Record<string, unknown>; // 避免
```

### 2.3 Server Component vs Client Component

```typescript
// ✅ 頁面預設為 Server Component（無 "use client"）
export default async function DocumentsPage() {
  return <WikiBetaDocumentsView />;
}

// ✅ 只在需要時才加 "use client"
// 需要: useState, useEffect, onClick, onChange, browser APIs
"use client";
export function InteractiveUploader() {
  const [isDragOver, setIsDragOver] = useState(false);
  // ...
}

// ✅ 盡量在元件樹最末端（Leaf）加 "use client"，不在父元件或 layout 加
```

---

## 3. 匯入規範

### 3.1 匯入順序

```typescript
// 1. React（若使用 JSX 元素需明確匯入）
import React from "react";

// 2. Next.js 核心
import Link from "next/link";
import { useRouter } from "next/navigation";

// 3. 第三方函式庫
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// 4. @alias 套件匯入（@shared-*, @ui-*, @integration-*, @lib-*）
import type { CommandResult } from "@shared-types";
import { cn } from "@shared-utils";
import { Button } from "@ui-shadcn/ui/button";
import { getFirebaseFirestore } from "@integration-firebase";

// 5. @/ 模組匯入（app/ 和 modules/）
import type { WorkspaceEntity } from "@/modules/workspace";
import { createWorkspace } from "@/modules/workspace";

// 6. 相對路徑（同模組內部）
import type { DocumentEntity } from "../../domain/entities/document.entity";
import { useDocuments } from "../hooks/use-documents";
```

### 3.2 禁止使用的 Legacy 路徑

| 禁止 | 替代方案 |
|---|---|
| `@/shared/*` | `@shared-types`, `@shared-utils`, `@shared-constants` |
| `@/infrastructure/*` | `@integration-firebase`, `@integration-http` |
| `@/libs/*` | `@lib-*` 對應套件 |
| `@/ui/shadcn/*` | `@ui-shadcn/*` |
| `@/ui/vis*` | `@ui-vis` |
| `@/interfaces/*` | `@api-contracts` |

---

## 4. CSS 與 Tailwind 規範

### 4.1 Class 排列順序

遵循 Tailwind 官方推薦順序（由外到內、由結構到外觀）：

```tsx
// Layout → Position → Spacing → Sizing → Typography → Visual
<div className="flex items-center gap-4 px-4 py-2 w-full text-sm font-medium text-foreground bg-card rounded-lg border shadow-sm hover:bg-accent transition-colors">
```

建議安裝 `prettier-plugin-tailwindcss` 自動排列。

### 4.2 條件 Class 使用 cn()

```tsx
import { cn } from "@shared-utils"; // 或 @ui-shadcn/utils

<div
  className={cn(
    "rounded-lg border-2 border-dashed p-8",
    isDragOver && "border-primary bg-primary/5",
    isError && "border-destructive",
    className // 允許外部覆蓋
  )}
/>
```

### 4.3 避免 CSS 反模式

```tsx
// ❌ 避免 style prop（除非動態值無法用 Tailwind 表達）
<div style={{ backgroundColor: "#f00" }} />

// ✅ 使用 Tailwind 語義色
<div className="bg-destructive" />

// ❌ 避免 @apply（Tailwind 不推薦用於元件）
// @apply flex items-center;

// ✅ 使用元件封裝重用樣式
```

---

## 5. JSDoc 規範

函式與類別加 JSDoc 的時機：

```typescript
// ✅ 公開 API（export 的函式 / use-case）應加 JSDoc
/**
 * 上傳文件至 Firebase Storage，並將 metadata 寫入 Firestore。
 * @param input - 包含 file、accountId 與選填的 workspaceId。
 * @returns CommandResult，成功時包含 documentId。
 */
export async function uploadDocument(input: UploadDocumentInput): Promise<CommandResult<string>> {
  // ...
}

// ✅ 複雜業務邏輯加說明
// ❌ 簡單 getter / setter 無需 JSDoc
```

---

## 6. 測試風格

### 6.1 測試檔案命名

| 類型 | 格式 |
|---|---|
| Unit test | `*.test.ts` / `*.test.tsx` |
| Integration test | `*.integration.test.ts` |
| E2E test | `*.e2e.ts`（Playwright） |

### 6.2 測試命名

```typescript
describe("uploadDocument use case", () => {
  it("should return success with documentId when file is valid", async () => {
    // ...
  });

  it("should return error when accountId is missing", async () => {
    // ...
  });
});
```

---

## 7. ESLint 執行

```bash
# 執行 lint（必須 0 errors）
npm run lint

# 自動修復可修正的問題
npm run lint -- --fix
```

**常見 ESLint 規則**（`eslint.config.mjs`）：

- `no-unused-vars` — 未使用的變數
- `@typescript-eslint/no-explicit-any` — 禁止 any
- `jsdoc/*` — JSDoc 格式檢查
- `@typescript-eslint/naming-convention` — 命名規範
- 匯入路徑邊界（legacy path 封鎖）
