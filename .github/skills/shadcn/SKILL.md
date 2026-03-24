---
name: shadcn-mcp
description: >
  UI/UX 開發自動載入技能。每當任務涉及介面元件、視覺設計、互動模式、排版佈局、
  響應式設計或行動裝置體驗時自動觸發。使用 shadcn MCP 查詢最新元件 API 與用法，
  強制以現代化直覺操作為設計優先原則，行動設備友善為必要條件，
  禁止使用非 shadcn/ui 的 UI 套件。適用於 Dashboard、表單、對話框、
  導航、資料表格、AI Console 等所有 UI 場景。
user-invocable: false
disable-model-invocation: false
---

# shadcn MCP 整合技能

## 🎯 技能定位

這是一個 **UI/UX 強制規範技能**，凡涉及任何介面開發，自動載入。
透過 shadcn MCP 取得最新元件文件，並強制遵守現代化、直覺化、行動優先的設計原則。

---

## ⚡ 核心設計原則（不可妥協）

### 📱 Mobile First — 行動優先

```
所有元件與佈局，預設從行動裝置尺寸開始設計：

  sm:  640px  → 基礎行動設備
  md:  768px  → 平板豎向
  lg:  1024px → 平板橫向 / 小筆電
  xl:  1280px → 桌機
  2xl: 1536px → 大螢幕

禁止：只設計桌機版再「縮小」的逆向思維
必須：先確保行動版可用，再逐步擴展桌機功能
```

### ✨ 現代化直覺（Modern Intuitive）

```
設計決策優先順序：

  1. 使用者不需學習即能操作
  2. 互動反饋即時且明確（loading / disabled / error state）
  3. 視覺層次清晰（間距、字重、顏色對比）
  4. 觸控目標最小 44×44px
  5. 手勢操作優先於 hover 效果
```

### 🚫 唯一 UI 套件約束

```
✅ 允許：shadcn/ui + Tailwind CSS + Radix UI primitives
❌ 禁止：MUI、Ant Design、Chakra UI、Mantine 等任何其他 UI 套件
❌ 禁止：自行撰寫 CSS 模組（使用 Tailwind utility class）
❌ 禁止：inline style（除非 CSS 變數動態賦值）
```

---

## 🔄 工作流程

### Step 1：判斷元件需求

```
UI 任務開始時，Agent 先識別所需元件類型：

  表單類    → Form, Input, Select, Checkbox, RadioGroup, Switch, Textarea
  導航類    → NavigationMenu, Breadcrumb, Tabs, Sidebar
  回饋類    → Toast, Alert, Dialog, Sheet, Tooltip, Popover
  資料類    → Table, DataTable, Card, Badge, Avatar
  佈局類    → Separator, ScrollArea, AspectRatio, Collapsible
  行動優先  → Drawer（優先於 Dialog）, Sheet（從底部滑入）
```

### Step 2：查詢 shadcn MCP

```
shadcn:get-component({ name: "元件名稱" })
```

**每次使用元件前必查，不得依賴訓練記憶中的 API。**

### Step 3：行動友善檢查清單

實作完成前，逐項確認：

```
  □ 在 375px 寬度下是否正常顯示？
  □ 觸控目標是否 ≥ 44px？
  □ 表單在軟鍵盤彈出時是否不被遮擋？
  □ 列表/表格在小螢幕是否有水平捲動或改為卡片佈局？
  □ Dialog 在行動版是否改用 Drawer / Sheet？
  □ 圖示是否搭配文字標籤（不只依賴圖示傳遞意義）？
  □ Dark mode 是否正常？
```

---

## 📦 元件使用規範

### Dialog vs Drawer 選擇規則

```typescript
// ✅ 行動版用 Sheet（bottom），桌機版用 Dialog
const isMobile = useMediaQuery("(max-width: 768px)")

return isMobile
  ? <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="bottom">...</SheetContent>
    </Sheet>
  : <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>...</DialogContent>
    </Dialog>
```

### 表單必用 shadcn Form + Zod

```typescript
// ✅ 必須搭配 react-hook-form + zod
const form = useForm<z.infer<typeof schema>>({
  resolver: zodResolver(schema),
})

return (
  <Form {...form}>
    <FormField
      control={form.control}
      name="fieldName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>標籤</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage /> {/* 錯誤訊息必須呈現 */}
        </FormItem>
      )}
    />
  </Form>
)
```

### 資料表格行動版處理

```typescript
// ✅ 大螢幕用 DataTable，小螢幕改為 Card 列表
<div className="hidden md:block">
  <DataTable columns={columns} data={data} />
</div>
<div className="block md:hidden space-y-3">
  {data.map(item => <ItemCard key={item.id} item={item} />)}
</div>
```

### Toast 通知規範

```typescript
// ✅ 所有非同步操作結果必須有 toast 反饋
toast({ title: "儲存成功", description: "資料已更新" })

// ✅ 錯誤必須明確且可讀
toast({
  variant: "destructive",
  title: "操作失敗",
  description: error.message,
})
```

---

## 🎨 Design Token 規範

```css
/* ✅ 使用語意化 CSS 變數，自動支援 Dark mode */
bg-background          /* 頁面背景 */
bg-card                /* 卡片背景 */
text-foreground        /* 主要文字 */
text-muted-foreground  /* 次要文字、說明文字 */
border-border          /* 邊框 */
ring-ring              /* Focus ring */
bg-primary             /* 主要操作按鈕 */
bg-destructive         /* 危險/刪除操作 */
bg-secondary           /* 次要內容區塊 */
bg-accent              /* Hover 強調 */
```

---

## 🚫 常見錯誤行為（禁止）

```
# ❌ 只考慮桌機佈局
<div className="grid grid-cols-4 gap-6">

# ✅ 行動優先
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

# ❌ Dialog 在行動版彈出（遮擋操作）
<Dialog> 直接使用

# ✅ 行動版改 Sheet 從底部滑入
<Sheet side="bottom">

# ❌ 硬編碼顏色值
className="bg-[#1a1a2e] text-[#ffffff]"

# ✅ 使用 Design Token
className="bg-background text-foreground"

# ❌ 觸控目標過小
<button className="p-1 text-xs">

# ✅ 符合觸控規範
<Button size="sm" className="min-h-[44px] min-w-[44px]">
```

---

## 🔗 與其他技能協作

| 情境 | 協作技能 |
|---|---|
| 元件 API 不確定 | 同時觸發 `context7` 查詢 shadcn/ui 最新文件 |
| 元件涉及 Next.js 路由切換 | 同時觸發 `next-devtools-mcp` |
| 完成 UI 模組開發 | 透過 `serena-mcp` 更新語意記憶 |