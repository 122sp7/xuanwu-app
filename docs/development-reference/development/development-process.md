# 開發流程（Development Process）

> **操作指南類型**：本文件說明從需求建立到 PR 合併的端對端開發流程，適用於功能開發、錯誤修復與文件更新。

---

## 1. 流程總覽

```
需求確認 → 設計確認 → 開發環境 → 開發實作 → 本地驗證 → PR 建立 → Review → 合併 → 部署
```

---

## 2. 開發前準備

### 2.1 環境設置

```bash
# 1. 安裝相依套件
npm install

# 2. 啟動開發伺服器
npm run dev      # http://localhost:3000
```

> 需要 Node.js 24 與 npm（見 `.nvmrc` 或 `package.json.engines`）。

### 2.2 必讀文件

在開始任何功能開發前，請先確認：

- [ ] [`agents/knowledge-base.md`](../../../agents/knowledge-base.md) — 確認你的變更屬於哪個模組
- [ ] [`agents/README.md`](../../../agents/README.md) — 架構規則索引
- [ ] 若觸及 **契約邊界**（runtime boundary、API、資料模型），先讀 [`docs/development-reference/development-reference/reference/development-contracts/overview.md`](../reference/development-contracts/overview.md)

### 2.3 建立分支

```bash
# 從 main 建立功能分支
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

分支命名規則見 [branch-strategy.md](./branch-strategy.md)。

---

## 3. MDDD 開發七步驟

針對功能模組開發，遵循以下 MDDD（Module-Driven Domain Design）標準流程：

### Step 1：確認模組歸屬

找出你的功能屬於哪個模組（`modules/*/`）：

```
modules/
├── wiki-beta/    ← 知識庫、文件上傳、RAG
├── workspace/    ← 工作區管理
├── account/      ← 帳號管理
├── organization/ ← 組織管理
├── file/         ← 檔案生命週期
...（20 個模組）
```

若功能跨越多個模組，先確認**主要模組**為何，並在其 `index.ts` 定義跨模組的公開 API。

### Step 2：設計 Domain 層（entity / value object / repository interface）

```typescript
// modules/wiki-beta/domain/entities/wiki-beta-page.entity.ts
export interface WikiBetaPageEntity {
  readonly id: string;
  readonly title: string;
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}
```

> **原則**：domain 層不可匯入 React、Firebase SDK 或 HTTP 客戶端。

### Step 3：實作 Application Use Case

```typescript
// modules/wiki-beta/application/use-cases/create-wiki-beta-page.use-case.ts
export async function createWikiBetaPage(
  input: CreateWikiBetaPageInput,
  repo: IWikiBetaPageRepository
): Promise<CommandResult<string>> {
  // 業務邏輯在此
  const page = buildPageEntity(input);
  return repo.save(page);
}
```

### Step 4：實作 Infrastructure Adapter

```typescript
// modules/wiki-beta/infrastructure/repositories/firebase-wiki-beta-page.repository.ts
export class FirebaseWikiBetaPageRepository implements IWikiBetaPageRepository {
  async save(page: WikiBetaPageEntity): Promise<CommandResult<string>> {
    const ref = await addDoc(
      collection(db, `accounts/${page.accountId}/pages`),
      pageToFirestore(page)
    );
    return { success: true, data: ref.id };
  }
}
```

### Step 5：建立 Server Action（接口層）

```typescript
// modules/wiki-beta/interfaces/_actions/wiki-beta-page.actions.ts
"use server";

export async function createPageAction(input: CreatePageInput): Promise<CommandResult<string>> {
  return createWikiBetaPage(input, new FirebaseWikiBetaPageRepository());
}
```

### Step 6：實作 React 元件

```tsx
// modules/wiki-beta/interfaces/components/WikiBetaPagesView.tsx
"use client";

export function WikiBetaPagesView() {
  const [isCreating, setIsCreating] = useState(false);

  async function handleCreate() {
    setIsCreating(true);
    const result = await createPageAction({ title: "新頁面", accountId });
    if (result.success) {
      toast.success("已建立頁面");
      router.push(`/wiki-beta/pages/${result.data}`);
    } else {
      toast.error(`建立失敗：${result.error.message}`);
    }
    setIsCreating(false);
  }

  return (/* ... */);
}
```

### Step 7：更新 index.ts 公開 API

```typescript
// modules/wiki-beta/index.ts
export { WikiBetaPagesView } from "./interfaces/components/WikiBetaPagesView";
export type { WikiBetaPageEntity } from "./domain/entities/wiki-beta-page.entity";
```

---

## 4. 本地驗證清單

每次提交前，確保通過以下驗證：

```bash
# 1. ESLint — 必須 0 errors
npm run lint

# 2. TypeScript + 生產建置
npm run build

# 3. Python Worker（若有變更）
cd py_fn && python -m compileall -q .
cd py_fn && python -m pytest tests/ -v
```

**手動驗證**（依功能範圍）：

- [ ] 在瀏覽器執行完整使用者任務（例如：上傳文件 → 查看列表）
- [ ] 確認 Console 無 `error`（只有預期的 `warning`）
- [ ] 確認所有 Toast 正常顯示（成功 / 失敗）
- [ ] 確認 Loading 狀態正常（spinner + 禁用）
- [ ] 空狀態 / 載入狀態正確顯示

---

## 5. PR 建立與 Review

### 5.1 建立 PR

```bash
git push origin feature/your-feature-name
# 在 GitHub 建立 PR → main
```

PR 描述需包含：
- 目的（一句話說明）
- `Closes #N`（若有 issue）
- 變更內容清單
- 測試方式說明

### 5.2 Review 標準

Review 者確認：

| 項目 | 標準 |
|---|---|
| 架構一致性 | 遵循 MDDD 分層；無跨模組 internal import |
| 型別安全 | 無 `any`；使用正確型別 |
| 錯誤處理 | 失敗路徑有 toast；無靜默失敗 |
| 可近用性 | `aria-label`、鍵盤可操作 |
| 效能 | 無不必要的 re-render；資料載入有 loading 狀態 |
| 測試 | lint + build 通過 |

---

## 6. 特殊情境流程

### 6.1 跨 runtime 變更（Next.js + py_fn）

若你的功能需要 py_fn 端的配合（例如新增 callable、修改 Firestore schema）：

1. **先確認契約**：參閱 `docs/development-reference/development-reference/reference/development-contracts/` 中對應的契約文件。
2. **分步驟開發**：先在 py_fn 端實作並部署，再在 Next.js 端整合。
3. **更新契約文件**：若有 API 或資料模型變更，必須同步更新契約文件。

### 6.2 資料模型變更

修改 Firestore schema 時：

1. 評估**向後相容性**：舊資料是否需要 migration？
2. 更新 **Firestore 索引**（`firestore.indexes.json`）。
3. 更新 **Security Rules**（`firestore.rules`）。
4. 更新相關 ADR（`docs/decision-architecture/adr/`）。

### 6.3 文件變更

文件更新（`docs/` 目錄）使用 `docs/*` 分支，提交類型為 `docs:`：

```bash
git checkout -b docs/update-ui-ux-wireframes
git commit -m "docs(ui-ux): add wireframes for wiki-beta pages"
```

---

## 7. AI 輔助開發流程

本專案整合 GitHub Copilot Agent 輔助開發：

### 7.1 使用 Planner Agent（規劃階段）

對於**非顯而易見**的功能（跨模組、跨 runtime、有架構影響），使用 Planner Agent 先建立正式實作計畫：

```
在 Copilot Chat 輸入：
「使用 @planner 規劃 wiki-beta pages CRUD 功能」
```

計畫格式見 [`docs/development-reference/development-reference/reference/ai/implementation-plan-template.md`](../reference/ai/implementation-plan-template.md)。

### 7.2 使用 Implementer Agent（實作階段）

計畫審核後，交由 Implementer Agent 執行：

```
在 Copilot Chat 輸入：
「使用 @implementer 按照計畫實作步驟 1-3」
```

### 7.3 Delivery Chain

完整的 AI 輔助交付鏈：`Planner → Implementer → Reviewer → QA`

詳細說明見 [`docs/development-reference/development-reference/reference/ai/handoff-matrix.md`](../reference/ai/handoff-matrix.md)。
