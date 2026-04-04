---

name: shadcn-mcp
description: >
UI/UX 開發強制技能。凡涉及任何介面元件、視覺設計、互動模式、排版佈局、
響應式設計或行動裝置體驗時自動觸發。
使用 shadcn/ui 作為唯一 UI 系統，強制 Mobile First、最少代碼原則、
現代直覺操作設計。適用於 Dashboard、AI Console、表單、資料顯示等場景。
user-invocable: false
disable-model-invocation: false

🔥 shadcn MCP（工程規範完整版）

---

🎯 技能定位

此技能為 UI/UX 強制規範層（UI Governance Layer）

目標：

- UI 一致性
- 最少代碼
- 行動優先
- 可直接接 AI / Firebase / Server Actions

---

⚡ 核心設計原則（不可妥協）

📱 1. Mobile First（強制）

規則

- MUST：先設計 Mobile（≤ 640px）
- MUST：逐步擴展至 Desktop
- MUST NOT：先設計 Desktop 再縮小

Breakpoints

尺寸| 用途
sm 640px| 行動
md 768px| 平板
lg 1024px| 小筆電
xl 1280px| 桌機
2xl 1536px| 大螢幕

---

✨ 2. Modern Intuitive UX

優先順序

1. 無學習成本
2. 即時反饋（loading / error）
3. 視覺層次清晰
4. 觸控 ≥ 44px
5. 不依賴 hover

---

🧠 3. 最少代碼原則（關鍵🔥）

規則

- MUST NOT：建立 UI abstraction
- MUST NOT：包裝 shadcn component
- MUST NOT：自建 UI library
- SHOULD：直接使用 component
- SHOULD：使用 Tailwind utility

判斷準則

如果你想：
「要不要抽 component？」

→ 90% 不需要

---

🚫 4. UI 套件限制

允許

- shadcn/ui
- Tailwind CSS
- Radix UI

禁止

- MUI / Ant Design / Chakra / Mantine
- CSS Modules
- inline style（除 CSS 變數）

---

🧩 UI 架構分層（強制）

UI Layer (shadcn)
    ↓
Action Layer (Server Actions / Genkit)
    ↓
Data Layer (Firebase)

限制

行為| 是否允許
fetch| ❌
business logic| ❌
state 管理（非表單）| ❌

---

🔄 工作流程（標準化）

Step 1：辨識 UI 類型

類型| 元件
表單| Form / Input / Select
導航| Tabs / Sidebar
回饋| Dialog / Sheet / Toast
資料| Table / Card
AI UI| Card + Textarea

---

Step 2：查詢 MCP

shadcn:get-component({ name: "component" })

規則：

- MUST：每次使用前查詢
- MUST NOT：憑記憶寫 API

---

Step 3：最少代碼實作

- 不抽象
- 不封裝
- 不重寫

---

Step 4：行動裝置檢查

□ 375px 正常
□ 觸控 ≥ 44px
□ 無 hover 依賴
□ 不被鍵盤遮擋
□ Dialog → Sheet（mobile）
□ Dark mode 正常

---

📦 元件使用規範

---

🔄 Dialog vs Sheet

const isMobile = useMediaQuery("(max-width: 768px)")

return isMobile ? (
  <Sheet>
    <SheetContent side="bottom">...</SheetContent>
  </Sheet>
) : (
  <Dialog>
    <DialogContent>...</DialogContent>
  </Dialog>
)

---

🧾 表單（強制）

<Form {...form}>
  <form action={action}>
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <Button type="submit">Submit</Button>
  </form>
</Form>

---

⚡ Server Actions（強制推薦）

<form action={createPost}>
  <Input name="title" />
  <Button type="submit">Save</Button>
</form>

---

🤖 AI Console Pattern（新增🔥）

<div className="flex flex-col gap-4 md:flex-row">
  <Card className="flex-1 p-4 space-y-2">
    <Textarea name="prompt" />
    <Button type="submit">Run</Button>
  </Card>

  <Card className="flex-1 p-4">
    Output
  </Card>
</div>

---

📊 Data（RWD）

<div className="hidden md:block">
  <Table />
</div>

<div className="md:hidden space-y-2">
  {items.map(item => (
    <Card key={item.id}>{item.name}</Card>
  ))}
</div>

---

🔔 Toast（強制）

toast({ title: "成功" })

toast({
  variant: "destructive",
  title: "錯誤",
  description: error.message,
})

---

🎨 Design Token（強制）

bg-background
bg-card
text-foreground
text-muted-foreground
border-border
ring-ring
bg-primary
bg-destructive
bg-secondary
bg-accent

---

🚫 常見錯誤（禁止）

❌ 錯誤| ✅ 正確
grid-cols-4| grid-cols-1 sm:grid-cols-2
Dialog mobile| Sheet bottom
硬編碼顏色| Design Token
小按鈕| ≥44px

---

🔗 技能協作

情境| 技能
UI API| context7
Next.js| next-devtools
記憶| serena
AI| genkit

---

💣 強制限制

- UI 檔案 ≤ 150 行
- 禁止過度抽象
- 禁止 UI 邏輯耦合

---

🧠 最終原則

«shadcn = UI Lego
不是 UI framework»