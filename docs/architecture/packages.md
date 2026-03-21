# MDDD packages/ — 架構分析與設計指南

> **關鍵詞**: MDDD · Hexagonal · Packages · cal.com · plane · 邊界設計 · 長期穩定性

---

## 1. 研究背景：分析兩大開源專案

### 1.1 cal.com 架構分析

cal.com 是一個開源排程平台，採用 **Turbo 單倉多包 (monorepo)** 架構：

```
cal.com/
├── apps/
│   ├── web/              ← Next.js 主應用
│   └── api/              ← API 服務
└── packages/
    ├── prisma/           ← 資料層（ORM schema + migrations）
    ├── trpc/             ← API 層（tRPC routers + 型別安全 API）
    ├── lib/              ← 共用工具函數和業務邏輯
    ├── features/         ← 功能模組（booking, calendar, routing...）
    ├── ui/               ← 共用 UI 元件
    ├── app-store/        ← 第三方整合（OAuth, 行事曆, 視訊會議）
    ├── types/            ← TypeScript 型別定義
    └── i18n/             ← 國際化
```

**cal.com 的設計優點：**
1. **明確的資料邊界**: `packages/prisma` 是唯一可以直接操作資料庫的地方
2. **型別安全的 API 邊界**: `packages/trpc` 集中所有 API 合約，前後端共用型別
3. **整合隔離**: `packages/app-store` 把所有第三方整合隔離，核心業務不直接依賴第三方
4. **功能模組化**: `packages/features` 每個功能 (booking, workflows, teams) 是獨立的子包

### 1.2 plane 架構分析

plane 是一個開源專案管理工具，同樣採用 **Turbo 單倉多包** 架構：

```
plane/
├── web/                  ← Next.js 主應用
├── apiserver/            ← Django REST API
└── packages/
    ├── types/            ← TypeScript 型別定義（最基礎層）
    ├── constants/        ← 應用常數（路由、狀態、配置）
    ├── utils/            ← 純工具函數（無副作用）
    ├── hooks/            ← 共用 React Hooks
    ├── ui/               ← 基礎 UI 元件（atoms）
    ├── propel/           ← 進階 UI 元件（molecules/organisms）
    ├── editor/           ← 富文字編輯器（複雜子系統）
    ├── services/         ← API 服務層（HTTP 請求）
    ├── shared-state/     ← MobX 狀態管理
    ├── i18n/             ← 國際化
    ├── logger/           ← 日誌系統
    ├── tailwind-config/  ← Tailwind CSS 配置
    └── typescript-config/← TypeScript 配置共用
```

**plane 的設計優點：**
1. **分層粒度細**: `packages/ui` (atoms) 和 `packages/propel` (molecules) 分開，視覺複雜度可控
2. **常數獨立**: `packages/constants` 獨立，常數改變只需更新一個地方
3. **服務層清晰**: `packages/services` 集中所有 API 呼叫，UI 不直接發 HTTP 請求
4. **編輯器自治**: `packages/editor` 是完整的子系統，有自己的 extensions, hooks, plugins

---

## 2. 共同架構模式分析

### 2.1 兩專案的共同架構優點

| 架構模式 | cal.com | plane | 共同優點 |
|---------|---------|-------|---------|
| **型別優先** | `packages/types` | `packages/types` | 型別是最基礎的依賴，循環依賴問題最少 |
| **UI 分離** | `packages/ui` | `packages/ui` + `packages/propel` | UI 不含業務邏輯，可獨立測試和替換 |
| **工具函數** | `packages/lib` 中 | `packages/utils` | 純函數，無副作用，最容易測試 |
| **常數集中** | `packages/lib` 中 | `packages/constants` | 應用行為由常數控制，容易調整 |
| **整合隔離** | `packages/app-store` | `packages/services` | 第三方變更不影響核心業務 |
| **明確 API 邊界** | `packages/trpc` | `packages/services` | API 合約集中，前後端共用 |

### 2.2 最重要的共同原則

```
所有成功的大型前端專案都遵循同一個法則：

「把不同速率變化的代碼放在不同的包中。」
                              — 包設計的基本原理
```

**變化速率分類：**

| 變化速率 | 代碼類型 | 範例 |
|---------|---------|------|
| 最低 (年) | 型別定義 | `CommandResult`, `DomainError` |
| 低 (月) | 工具函數 | `formatDate`, `generateId` |
| 中 (週) | UI 元件 | `Button`, `Dialog`, `Table` |
| 高 (天) | 業務功能 | 訂單流程、工作流、通知 |
| 最高 (隨時) | 配置/常數 | API endpoints, pagination limits |

---

## 3. MDDD packages/ 設計決策

### 3.1 為什麼不用完整 monorepo？

xuanwu-app 是單一 Next.js 應用，不是多 app 架構。使用完整 Turbo monorepo 會帶來：
- 每個 package 需要獨立的 `package.json` + `tsconfig.json` + 構建配置
- 需要處理跨包 symlinks 和版本管理
- CI/CD 複雜度大幅提升

**解決方案：TypeScript 路徑別名 packages**

我們用 **TypeScript `paths` 別名** 模擬 monorepo 的包邊界：

```jsonc
// tsconfig.json — 每個別名 = 一個邏輯包
{
  "paths": {
    "@shared-types":       ["./packages/shared-types/index.ts"],
    "@integration-firebase": ["./packages/integration-firebase/index.ts"],
    "@ui-shadcn":          ["./packages/ui-shadcn/index.ts"]
    // ...
  }
}
```

**效果等同於 monorepo 但零額外配置複雜度。**

### 3.2 packages/ 結構設計

```
packages/
├── README.md
│
├── ── Shared Kernel ───────────────────────────────────────────
├── shared-types/        @shared-types       CommandResult, DomainError, Timestamp
├── shared-utils/        @shared-utils       純工具函數
├── shared-validators/   @shared-validators  Zod 輸入驗證 schemas
├── shared-hooks/        @shared-hooks       Zustand app store
├── shared-constants/    @shared-constants   應用常數
│
├── ── Integrations ────────────────────────────────────────────
├── integration-firebase/ @integration-firebase  Firebase SDK (client + admin)
├── integration-upstash/  @integration-upstash   Redis, Vector, QStash, Workflow
│
├── ── UI Layer ────────────────────────────────────────────────
├── ui-shadcn/           @ui-shadcn          shadcn/ui 元件 + cn utility
│
├── ── Library Wrappers ────────────────────────────────────────
├── lib-date-fns/        @lib-date-fns       日期工具
├── lib-zod/             @lib-zod            Schema 驗證
├── lib-xstate/          @lib-xstate         狀態機
├── lib-tanstack/        @lib-tanstack       Query, Form, Table, Virtual
├── lib-superjson/       @lib-superjson      JSON 序列化
├── lib-vis/             @lib-vis            Vis.js 視覺化
├── lib-react-markdown/  @lib-react-markdown Markdown 渲染
├── lib-remark-gfm/      @lib-remark-gfm     GitHub Flavored Markdown
├── lib-uuid/            @lib-uuid           UUID 生成
├── lib-dragdrop/        @lib-dragdrop       拖放功能
├── lib-zustand/         @lib-zustand        Zustand 狀態
│
└── ── API Contracts ───────────────────────────────────────────
    api-contracts/       @api-contracts      API 介面和 DTO
```

### 3.3 依賴方向規則

```
依賴方向圖 (箭頭 = 允許依賴):

packages/lib-*         ──────────→  (只依賴 npm packages，不依賴內部)
packages/shared-types  ──────────→  (只依賴 npm packages，不依賴內部)
packages/shared-*      ──→  @shared-types (僅限)
packages/integration-* ──→  @shared-types, @lib-*
packages/ui-shadcn     ──→  @shared-types (僅 cn utility)
packages/api-contracts ──→  @shared-types

modules/*/domain       ──→  @shared-types (僅限)
modules/*/application  ──→  @shared-types, domain
modules/*/infrastructure ─→ @integration-*, @lib-*, domain
modules/*/interfaces   ──→  @ui-shadcn, @shared-*, application
```

**嚴禁：**
- `packages/shared-types` 依賴任何 `packages/integration-*`
- `packages/lib-*` 依賴任何 `packages/shared-*`
- `modules/*/domain` 依賴任何 UI 或 infrastructure

---

## 4. 如何降低複雜性、實現長期穩定

### 4.1 變更影響半徑最小化

**以前（沒有 packages 層）：**
```
改一個 Zod 版本 → 可能影響所有導入 "zod" 的文件
改 CommandResult 型別 → 需要全局搜索 @/shared/types
新增 Firebase 功能 → 不知道誰在使用哪個 Firebase API
```

**現在（有 packages 層）：**
```
改 Zod 版本 → 只改 packages/lib-zod/index.ts 的導出
改 CommandResult → 只改 packages/shared-types/index.ts
新增 Firebase 功能 → 只在 packages/integration-firebase/index.ts 加導出
```

### 4.2 可替換性（Replaceability）

每個 package 的 `index.ts` 是一個**抽象門面（Facade）**：

```typescript
// 今天：使用 Upstash Vector
// packages/integration-upstash/index.ts
export * from "@/libs/upstash";

// 未來：如果要換成 Pinecone，只改這一個文件：
// packages/integration-upstash/index.ts  ← 改成 Pinecone 的實現
// 所有使用 @integration-upstash 的模組不需要改！
```

### 4.3 邊界清晰化帶來的好處

| 問題 | 沒有 packages | 有 packages |
|------|--------------|-------------|
| 新人 onboarding | 需要理解整個 libs/ 結構 | 看 packages/README.md 即可 |
| Code review | 不知道變更影響範圍 | 看別名就知道（`@shared-types` 是公共合約）|
| 重構 | 全局搜索替換，風險高 | 修改 package index.ts，影響範圍可控 |
| 測試 | 難以 mock 深層依賴 | 每個 package 可獨立 mock |
| 循環依賴 | 容易意外引入 | 別名命名規範讓違規立即顯眼 |

---

## 5. 模組特定包（Module-Specific Packages）

對於複雜的核心業務邏輯，可進一步抽取成 module packages：

### 5.1 計劃中的 module packages

```
packages/
├── task-core/        @task-core        Task 實體、VO、Repository 介面
├── task-service/     @task-service     Task use cases（應用層）
├── skill-core/       @skill-core       Skill 實體、VO、Repository 介面
├── matching-engine/  @matching-engine  純匹配算法（無副作用）
└── matching-service/ @matching-service MatchTask, AssignTask use cases
```

### 5.2 模組包的設計原則（參考 cal.com features 包）

```typescript
// packages/task-core/index.ts
// 只導出：實體、值物件、Repository 介面（ports）
// 絕不導出：Firebase 實現、React hooks、Server Actions
export type { Task, TaskStatus, TaskPriority } from "./entities/task.entity";
export type { ITaskRepository } from "./repositories/task.repository.port";
```

```typescript
// packages/task-service/index.ts  
// 只導出：use cases（應用層編排）
// 依賴：@task-core（domain）、@shared-types
export { CreateTaskUseCase } from "./use-cases/create-task.use-case";
export { UpdateTaskStatusUseCase } from "./use-cases/update-task-status.use-case";
```

---

## 6. 與 ARCHITECTURE.md 的關係

packages/ 層是 MDDD + Hexagonal 架構的**補充層**，不是替換：

```
ARCHITECTURE.md 定義：         packages/ 實現：
─────────────────────────────────────────────────────────
Domain Layer (純 TS)         ←── @shared-types, module packages
Application Layer (用例)     ←── module service packages
Infrastructure Layer (適配器) ←── @integration-firebase, @integration-upstash
Interface Layer (Next.js)    ←── @ui-shadcn, @shared-validators
Shared Kernel               ←── @shared-types, @shared-utils, @shared-constants
```

---

## 7. 遷移進度追蹤

### 已完成 ✅

- [x] **Phase 1**: 建立 packages/ 目錄結構（20 個邏輯包）
- [x] **Phase 2**: 所有包的 `index.ts` 建立（source of truth）
- [x] **Phase 3**: `shared/` 和 `libs/` 轉為 backward-compat shims
- [x] **Phase 4**: `tsconfig.json` 加入所有路徑別名
- [x] **Phase 5**: `packages/README.md` 建立
- [x] Lint + Build clean

### 下一步 📋

- [ ] **Phase 6**: 模組層 — 建立 `packages/task-core`, `packages/task-service`
- [ ] **Phase 7**: 模組層 — 建立 `packages/skill-core`, `packages/matching-engine`
- [ ] **Phase 8**: 新代碼統一使用 `@shared-types` 替代 `@/shared/types`
- [ ] **Phase 9**: 審計 — 移除 `@/shared/` 和 `@/libs/` 的舊式引用
- [ ] **Phase 10**: 考慮升級為真正的 Turbo workspace（如果多 app 需求出現）

---

## 附錄：參考資料

- [cal.com repository](https://github.com/calcom/cal.com) — packages/ 設計範例
- [plane repository](https://github.com/makeplane/plane) — packages/ 設計範例
- [Turbo monorepo docs](https://turbo.build/repo/docs) — monorepo 架構
- [ARCHITECTURE.md](../../ARCHITECTURE.md) — MDDD + Hexagonal 架構指南
- [packages/README.md](../../packages/README.md) — 包層使用指南
