# UI 元件模式（Component Patterns）

> **參考文件類型**：本文件定義 Xuanwu App 中 UI 元件的使用規範、組合模式與常見陷阱。
> 元件實作以 **shadcn/ui** 為基礎，Lucide React 提供圖示。

---

## 1. 元件架構原則

### 1.1 元件分類

| 類型 | 分層 | 說明 |
|---|---|---|
| **基礎元件（Primitive）** | UI 元件庫層 | shadcn/ui 提供；不修改來源 |
| **功能元件（Feature）** | 模組介面層 | 業務功能元件；含狀態與資料 |
| **Shell 元件（Layout）** | 應用外殼層 | 版型元件；App Rail、Sidebar 等 |
| **頁面元件（Page）** | 頁面協調層 | 薄協調層；只組裝元件 |

### 1.2 Server vs Client 元件選擇

| 情況 | 選擇 |
|---|---|
| 靜態渲染、無互動 | `Server Component`（預設） |
| 需要 `useState`、`useEffect`、事件處理 | `'use client'` |
| 需要 Firestore `onSnapshot` 即時訂閱 | `'use client'` |
| 需要 `useRouter`、`useSearchParams` | `'use client'` |

---

## 2. 常用元件模式

### 2.1 卡片容器模式（Card Pattern）

用於包裝獨立功能區塊（上傳區、查詢區、結果區）。

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@ui-shadcn/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Upload File</CardTitle>
  </CardHeader>
  <CardContent>
    {/* 內容 */}
  </CardContent>
</Card>
```

**使用時機**：
- 功能明確邊界的操作區塊
- 統計摘要卡片
- 設定區塊

### 2.2 操作按鈕模式（Action Button Pattern）

主要操作（Primary Action）按鈕的標準 loading 狀態處理：

```tsx
import { Button } from "@ui-shadcn/ui/button";
import { Loader2 } from "lucide-react";

<Button
  onClick={handleAction}
  disabled={isLoading || !canSubmit}
>
  {isLoading ? (
    <>
      <Loader2 className="mr-2 size-4 animate-spin" />
      上傳中...
    </>
  ) : (
    "上傳並啟動解析 ↑"
  )}
</Button>
```

**規則**：
- loading 時必須同時 `disabled` 防止重複提交。
- loading 文字以進行式動詞結尾（「上傳中...」而非「上傳」）。
- disabled（非 loading）時加 Tooltip 說明原因。

### 2.3 骨架屏模式（Skeleton Pattern）

資料載入時的占位元件：

```tsx
import { Skeleton } from "@ui-shadcn/ui/skeleton";

// 列表骨架屏
{isLoading ? (
  <div className="space-y-2">
    {Array.from({ length: 5 }).map((_, i) => (
      <Skeleton key={i} className="h-12 w-full" />
    ))}
  </div>
) : (
  <DataTable data={data} />
)}
```

### 2.4 空狀態模式（Empty State Pattern）

```tsx
{data.length === 0 && (
  <div className="flex flex-col items-center gap-4 py-16 text-center">
    <FileX className="size-12 text-muted-foreground" />
    <div>
      <p className="font-semibold">目前還沒有文件</p>
      <p className="text-sm text-muted-foreground">
        試著上傳第一份檔案。
      </p>
    </div>
    <Button variant="outline" onClick={scrollToUpload}>
      前往上傳
    </Button>
  </div>
)}
```

### 2.5 Toast 通知模式

```tsx
import { toast } from "sonner";

// 成功
toast.success("已觸發重整，稍後觀察 rag status 更新");

// 失敗（含原因）
toast.error(`上傳失敗：${error.message}`);

// 背景任務提示
toast.info("正在處理中，請稍候…");
```

**注意**：`<Toaster />` 已由全域 Provider 掛載，無需重複掛載。

### 2.6 Dropdown 選單模式

```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui-shadcn/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="sm" aria-label="更多操作">
      <MoreHorizontal className="size-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem onClick={handleEdit}>編輯</DropdownMenuItem>
    <DropdownMenuItem
      className="text-destructive"
      onClick={handleDelete}
    >
      刪除
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### 2.7 狀態徽章模式（Status Badge Pattern）

```tsx
import { Badge } from "@ui-shadcn/ui/badge";

function StatusBadge({ status }: { status: "ready" | "processing" | "error" | "pending" }) {
  const map = {
    ready:      { label: "✓ ready",       variant: "success" },
    processing: { label: "⏳ processing",  variant: "secondary" },
    error:      { label: "✗ error",        variant: "destructive" },
    pending:    { label: "— pending",      variant: "outline" },
  };
  const { label, variant } = map[status];
  return <Badge variant={variant as never}>{label}</Badge>;
}
```

**規則**：狀態徽章必須同時包含圖示與文字（不可只用顏色）。

### 2.8 Tooltip 模式

```tsx
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ui-shadcn/ui/tooltip";

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button disabled aria-disabled>
        手動重整
      </Button>
    </TooltipTrigger>
    <TooltipContent>文件尚未完成解析</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

---

## 3. 表單元件模式

### 3.1 基本輸入框

```tsx
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";

<div className="space-y-2">
  <Label htmlFor="title">標題</Label>
  <Input
    id="title"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    placeholder="請輸入標題..."
    aria-invalid={!!error}
  />
  {error && (
    <p className="text-sm text-destructive" role="alert">
      {error}
    </p>
  )}
</div>
```

### 3.2 拖曳上傳區（Drop Zone）

Drop Zone 的可近用性規格：

```tsx
<div
  role="button"
  tabIndex={0}
  aria-label="點擊選擇檔案，或拖曳檔案至此上傳"
  className={cn(
    "rounded-lg border-2 border-dashed p-8 text-center transition-colors",
    isDragOver && "border-primary bg-primary/5",
    "focus:outline-none focus:ring-2 focus:ring-ring"
  )}
  onDragOver={handleDragOver}
  onDragLeave={handleDragLeave}
  onDrop={handleDrop}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") handleClick();
  }}
>
  {isDragOver ? "放開以上傳" : "點擊或拖曳上傳"}
</div>
```

---

## 4. 資料表格模式（Data Table Pattern）

使用 TanStack Table（`@lib-tanstack`）實作資料表格：

```tsx
// 簡易表格（列表較短時）
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>檔名</TableHead>
      <TableHead>狀態</TableHead>
      <TableHead>操作</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {documents.map((doc) => (
      <TableRow key={doc.id}>
        <TableCell>{doc.filename}</TableCell>
        <TableCell><StatusBadge status={doc.status} /></TableCell>
        <TableCell>
          <ActionButton doc={doc} />
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

**選用 TanStack Table 時機**：
- 需要排序功能
- 需要列選取（多選刪除）
- 需要虛擬化（列數 > 100）

---

## 5. 頁面組裝模式（Page Composition Pattern）

`page.tsx` 應保持薄協調，只組裝元件：

```tsx
// ✅ 正確：薄協調層
export default async function WikiDocumentsPage() {
  return <WikiDocumentsView />;
}

// ✅ 正確：有少量 Server-side data fetch
export default async function WorkspacePage({ params }: { params: { workspaceId: string } }) {
  const workspace = await getWorkspaceById(params.workspaceId);
  if (!workspace) notFound();
  return <WorkspaceOverview workspace={workspace} />;
}

// ❌ 錯誤：page 內有業務邏輯
export default async function DocumentsPage() {
  const db = getFirestore();
  const docs = await db.collection("documents").get(); // 直接在 page 呼叫 Firebase
  return <div>{/* ... */}</div>;
}
```

---

## 6. 常見反模式（Anti-patterns）

| 反模式 | 問題 | 正確做法 |
|---|---|---|
| 直接在 page 使用 Firebase SDK | 違反 MDDD 分層 | 透過 use-case 或 Server Action |
| 在元件內直接 `new FirebaseXxxRepository()` | 難以測試 | 由 use-case 透過 constructor injection |
| 只用顏色區分狀態 | 色盲使用者無法識別 | 同時包含圖示與文字 |
| Toast 成功但無失敗處理 | 靜默失敗 | try/catch 包覆，失敗也顯示 toast |
| Disabled 按鈕無 Tooltip | 使用者不知為何不可用 | 加 `Tooltip` 說明原因 |
| 空狀態顯示空白頁面 | 使用者困惑 | 實作 Empty State 元件 |
| `'use client'` 加在 layout 或不必要的元件 | 阻止 Server Component 優化 | 只在必要的最小範圍加 `'use client'` |

---

## 7. 元件命名規範

| 元件類型 | 命名格式 | 範例 |
|---|---|---|
| Feature 元件 | `{Module}{Feature}View` | `WikiDocumentsView` |
| 子元件（列表項） | `{Feature}Row` / `{Feature}Card` | `DocumentRow` |
| 表單元件 | `{Action}{Resource}Form` | `UploadDocumentForm` |
| Dialog 元件 | `{Action}{Resource}Dialog` | `CreateWorkspaceDialog` |
| 頁面 Shell 元件 | `{Module}Shell` | `WikiShell` |

---

## 8. 匯入規則

```tsx
// ✅ 正確
import { Button } from "@ui-shadcn/ui/button";
import { Card } from "@ui-shadcn/ui/card";
import { cn } from "@shared-utils";
import { Plus, Loader2 } from "lucide-react";

// ❌ 錯誤：使用 legacy 路徑
import { Button } from "@/ui/shadcn/ui/button";
import { cn } from "@/shared/utils";
```
