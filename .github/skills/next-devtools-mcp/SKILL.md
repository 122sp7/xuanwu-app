---
name: next-devtools-mcp
description: >
  Next.js 開發自動載入技能。每當任務涉及 Next.js App Router、頁面路由、
  平行路由（Parallel Routes）、攔截路由（Intercepting Routes）、
  Server Components、Server Actions、Streaming、效能分析或 Next.js 設定時自動觸發。
  使用 next-devtools MCP 查詢路由結構、分析效能、除錯 hydration 錯誤，
  並以平行路由作為複雜 UI 佈局的優先解法。
user-invocable: false
disable-model-invocation: false
---

# next-devtools MCP 整合技能

## 🎯 技能定位

這是一個 **Next.js 架構強制規範技能**，凡涉及任何路由設計、頁面渲染或效能優化，自動載入。
透過 next-devtools MCP 即時查詢路由樹、元件邊界與效能指標，
並強制以**平行路由**作為複雜佈局的首選架構模式。

---

## ⚡ 平行路由優先原則（Parallel Routes First）

### 🔴 強制觸發平行路由的場景

```
凡遇以下任一場景，必須優先評估平行路由方案：

  ✦ Dashboard 多區塊同時顯示不同資料來源
  ✦ AI 聊天介面 + 側邊工具列同時渲染
  ✦ Modal / Dialog 需要獨立 URL 且支援直連
  ✦ Tab 內容需要獨立 loading / error 邊界
  ✦ 同一頁面不同區塊需要各自 Suspense
  ✦ 條件式渲染不同的整頁佈局
```

### 平行路由 vs 一般元件選擇規則

```
使用平行路由，當：
  □ 需要獨立的 loading.tsx / error.tsx 邊界
  □ 區塊間路由狀態需要互相獨立
  □ 需要 URL 對應特定 slot 狀態（如 Modal with URL）
  □ 不同使用者角色看到不同的同一位置內容

使用一般元件，當：
  □ 純 UI 組合，無路由狀態需求
  □ 資料來源相同，只是視覺分區
  □ 不需要獨立 loading / error 處理
```

---

## 🔄 工作流程

### Step 1：路由結構查詢

```
next-devtools:get-routes()          → 取得完整路由樹
next-devtools:get-route({ path })   → 查詢特定路由詳情
```

任何新增路由前，先查詢現有結構，避免衝突。

### Step 2：效能分析（可選）

```
next-devtools:get-build-info()      → 確認 bundle 狀態
next-devtools:analyze-page({ path }) → 分析特定頁面效能
```

### Step 3：設計平行路由結構

遇到複雜佈局時，按以下流程設計：

```
1. 識別需要獨立渲染的 UI 區塊
2. 決定 slot 命名（@slotName）
3. 設計 default.tsx 的 fallback 內容
4. 規劃 loading.tsx 骨架屏
5. 規劃 error.tsx 錯誤邊界
```

---

## 📦 平行路由實作規範

### 基礎目錄結構

```
app/
└── dashboard/
    ├── layout.tsx              ← 接收所有 slot
    ├── page.tsx                ← 預設內容
    ├── @analytics/
    │   ├── page.tsx            ← 數據分析 slot
    │   ├── loading.tsx         ← 獨立 loading
    │   └── default.tsx         ← 非匹配時的 fallback
    ├── @notifications/
    │   ├── page.tsx            ← 通知 slot
    │   ├── loading.tsx
    │   └── default.tsx
    └── @team/
        ├── page.tsx            ← 團隊 slot
        └── default.tsx
```

### layout.tsx slot 接收

```typescript
// ✅ 正確：layout 接收並排列所有 slot
export default function DashboardLayout({
  children,
  analytics,
  notifications,
  team,
}: {
  children: React.ReactNode
  analytics: React.ReactNode
  notifications: React.ReactNode
  team: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <main className="lg:col-span-2">{children}</main>
      <aside className="space-y-4">
        {analytics}
        {notifications}
        {team}
      </aside>
    </div>
  )
}
```

### Modal Route（攔截路由）

```
app/
├── photos/
│   └── [id]/
│       └── page.tsx            ← 直連時的完整頁面
└── @modal/
    └── (.)photos/
        └── [id]/
            └── page.tsx        ← 列表頁點擊時的 Modal 版本
```

```typescript
// ✅ 在 Modal 版使用 Dialog，直連版使用完整頁面
// app/@modal/(.)photos/[id]/page.tsx
export default function PhotoModal({ params }: { params: { id: string } }) {
  return (
    <Dialog defaultOpen>
      <DialogContent>
        <PhotoDetail id={params.id} />
      </DialogContent>
    </Dialog>
  )
}
```

### default.tsx 必須提供

```typescript
// ✅ 每個 slot 必須有 default.tsx 避免 404
// app/dashboard/@analytics/default.tsx
export default function AnalyticsDefault() {
  return null // 或骨架屏
}
```

---

## 🛠️ Server Components 規範

### 資料獲取位置

```typescript
// ✅ 在 Server Component 直接 fetch，不需 useEffect
// app/dashboard/@analytics/page.tsx
export default async function AnalyticsSlot() {
  const data = await fetchAnalytics() // 直接 async/await
  return <AnalyticsChart data={data} />
}

// ✅ 需要互動的部分才降級為 Client Component
"use client"
export function AnalyticsChart({ data }: { data: ChartData }) {
  // 互動邏輯
}
```

### Streaming 與 Suspense

```typescript
// ✅ 搭配 loading.tsx 自動 Suspense
// app/dashboard/@analytics/loading.tsx
export default function AnalyticsLoading() {
  return <Skeleton className="h-48 w-full" />
}

// ✅ 細粒度 Suspense（在 Server Component 中）
export default async function Page() {
  return (
    <div>
      <Suspense fallback={<Skeleton />}>
        <SlowComponent />
      </Suspense>
    </div>
  )
}
```

### Server Actions 規範

```typescript
// ✅ Server Action 放在獨立 actions.ts 檔案
"use server"

export async function updateRecord(
  orgId: string,
  data: UpdateData
): Promise<ActionResult> {
  // Firestore 路徑必須含 tenant 邊界
  const ref = doc(db, `orgs/${orgId}/records/${data.id}`)
  await updateDoc(ref, data)
  revalidatePath(`/dashboard`)
}
```

---

## 🚫 常見錯誤行為（禁止）

```
# ❌ 在 Client Component 做資料獲取
"use client"
export function Dashboard() {
  const [data, setData] = useState(null)
  useEffect(() => { fetch('/api/data').then(...) }, [])
}

# ✅ 改為 Server Component
export default async function Dashboard() {
  const data = await fetchData()
  return <DashboardUI data={data} />
}

# ❌ 複雜 Dashboard 全部塞進單一 page.tsx
export default function Dashboard() {
  return (
    <div>
      <Analytics />   {/* 各自獨立 loading 但無法分離 */}
      <Notifications />
      <TeamStatus />
    </div>
  )
}

# ✅ 改用平行路由，各 slot 獨立 Suspense
// layout.tsx 接收 @analytics @notifications @team

# ❌ default.tsx 缺失導致路由切換 404
（平行路由 slot 缺少 default.tsx）

# ✅ 每個 slot 都提供 default.tsx
```

---

## 📊 效能優化規範

```typescript
// ✅ 動態導入重型元件
const HeavyChart = dynamic(() => import("@/components/heavy-chart"), {
  loading: () => <Skeleton className="h-48" />,
  ssr: false, // 純客戶端圖表
})

// ✅ 圖片優化
import Image from "next/image"
<Image
  src={url}
  alt={alt}
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
  priority={isAboveFold}
/>
```

---

## 🔗 與其他技能協作

| 情境 | 協作技能 |
|---|---|
| 路由頁面涉及 UI 元件 | 同時觸發 `shadcn-mcp` |
| Next.js API 不確定 | 同時觸發 `context7` 查詢官方文件 |
| 完成路由架構設計 | 透過 `serena-mcp` 更新路由記憶 |
