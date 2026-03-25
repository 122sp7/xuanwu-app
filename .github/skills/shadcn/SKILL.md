---

name: shadcn-mcp
description: >
UI/UX 開發強制技能。凡涉及任何介面元件、視覺設計、互動模式、排版佈局、
響應式設計或行動裝置體驗時自動觸發。
使用 shadcn/ui 作為唯一 UI 系統，強制 Mobile First、最少代碼原則、
現代直覺操作設計。適用於 Dashboard、AI Console、表單、資料顯示等場景。
user-invocable: false
disable-model-invocation: false

shadcn MCP（極簡強化版）

🎯 技能定位

UI 最少代碼 + 現代體驗 + AI SaaS 專用設計規範

---

⚡ 核心原則

1️⃣ Mobile First（強制）

設計順序：
Mobile → Tablet → Desktop

禁止：

- 先設計 Desktop 再縮小
- hover 驅動 UI

必須：

- 可點擊操作
- 單手可用（底部優先）

---

2️⃣ 最少代碼原則

目標：UI 層代碼減少 40%

禁止：

- UI abstraction
- 自訂 UI wrapper
- 二次封裝 component

允許：

- 直接使用 shadcn component
- Tailwind utility 排版
- Server Actions

---

3️⃣ 現代直覺 UX

優先順序：

1. 無學習成本
2. 即時反饋
3. 視覺清晰
4. 觸控 ≥ 44px
5. 操作可預期

---

4️⃣ UI 套件限制

允許：

- shadcn/ui
- Tailwind CSS
- Radix UI

禁止：

- MUI / Antd / Chakra
- CSS module
- inline style（除 CSS 變數）

---

🧠 UI 架構

UI Layer（shadcn）
↓
Action Layer（Server Actions / Genkit）
↓
Data Layer（Firebase）

限制：

- UI 不得包含 fetch
- 不得包含 business logic

---

🔄 工作流程

Step 1：辨識 UI 類型
Step 2：直接使用 shadcn component
Step 3：最少代碼實作
Step 4：行動裝置檢查

---

📦 核心模式

Dialog / Sheet

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

表單

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

Server Actions

<form action={createPost}>
  <Input name="title" />
  <Button type="submit">Save</Button>
</form>

---

AI Console

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

Data（RWD）

<div className="hidden md:block">
  <Table />
</div>

<div className="md:hidden space-y-2">
  {items.map(item => (
    <Card key={item.id}>{item.name}</Card>
  ))}
</div>

---

Toast

toast({ title: "成功" })

toast({
  variant: "destructive",
  title: "錯誤",
  description: error.message,
})

---

🎨 Design Token

bg-background
bg-card
text-foreground
text-muted-foreground
border-border
bg-primary
bg-destructive

---

🚫 禁止事項

- 自建 UI library
- CustomButton
- Layout component（Grid/Flex）
- UI 寫邏輯
- 過度 useState

---

🧠 最終原則

shadcn = UI Lego，不是 UI framework

---

❗ Anti-Overengineering

如果你想「要不要抽 component」

👉 通常不需要

---

🚀 協作技能

AI UI → genkit
資料 → firebase
路由 → next
記憶 → serena

---

💣 限制

UI 檔案不得超過 150 行