# 分支策略（Branch Strategy）

> **參考文件類型**：本文件定義 Xuanwu App 的 Git 分支模型、命名規則、生命週期與分支保護策略。

---

## 1. 分支模型概覽

Xuanwu App 採用 **Trunk-Based Development（主幹開發）** 為基礎，搭配功能分支（Feature Branch）工作流。

```
main ←──────────────────────────────────────────────
         ↑          ↑            ↑           ↑
         PR          PR           PR          PR
      feature/  bugfix/     docs/      copilot/
      add-xyz   fix-abc     update-api  create-xyz
```

| 分支 | 說明 | 保護規則 |
|---|---|---|
| `main` | 主幹；永遠可部署 | ✅ 需 PR、需通過 CI |
| `feature/*` | 功能開發 | ❌ 無額外保護 |
| `bugfix/*` | 錯誤修復 | ❌ 無額外保護 |
| `docs/*` | 文件更新 | ❌ 無額外保護 |
| `refactor/*` | 重構（不改行為） | ❌ 無額外保護 |
| `hotfix/*` | 緊急修復（從 main 分出） | ❌ 無額外保護 |
| `copilot/*` | AI Agent 自動建立的分支 | ❌ 無額外保護 |

---

## 2. 分支命名規範

### 格式

```
{類型}/{簡短描述}
```

**類型**：

| 類型 | 說明 | 範例 |
|---|---|---|
| `feature` | 新功能 | `feature/wiki-beta-pages-crud` |
| `bugfix` | 錯誤修復 | `bugfix/upload-mime-validation` |
| `docs` | 文件更新 | `docs/how-to-user/ui-ux-wireframes` |
| `refactor` | 重構 | `refactor/extract-document-use-case` |
| `hotfix` | 緊急修復 | `hotfix/auth-token-refresh` |
| `chore` | 工具、設定、依賴更新 | `chore/update-tailwind-v4` |
| `copilot` | AI Agent 建立 | `copilot/create-ui-ux-documentation` |

### 命名規則

- 使用 **kebab-case**（全小寫，以 `-` 分隔）。
- 描述部分 ≤ 50 個字元。
- 包含 Issue 編號（如有）：`feature/issue-123-wiki-pages`。
- 禁止在描述中使用特殊符號（`/`、`#`、`@` 除外）。

---

## 3. 開發流程

### 3.1 功能開發流程

```
1. 從 main 建立功能分支
   git checkout -b feature/my-feature main

2. 開發、頻繁提交（Atomic Commits）
   git commit -m "feat: add document upload use case"

3. 保持與 main 同步
   git fetch origin && git rebase origin/main

4. 推送並開 PR
   git push origin feature/my-feature
   → 開 Pull Request to main

5. PR Review → CI 通過 → 合併
   → 使用 Squash and Merge 或 Rebase and Merge

6. 分支自動刪除（或手動刪除）
```

### 3.2 緊急修復流程（Hotfix）

```
1. 從 main 建立 hotfix 分支
   git checkout -b hotfix/auth-fix main

2. 修復、測試
   git commit -m "fix: resolve auth token refresh race condition"

3. 快速 PR → Review → 合併
   → 目標：當天完成

4. 確認 main 部署成功後刪除分支
```

---

## 4. Commit 訊息規範

遵循 **Conventional Commits** 規範：

```
{類型}({範圍}): {描述}

[選填] 本文說明（為什麼，而非是什麼）

[選填] Footer（Breaking Changes、Closes #N）
```

### 類型

| 類型 | 說明 | 範例 |
|---|---|---|
| `feat` | 新功能 | `feat(wiki-beta): add document upload` |
| `fix` | 錯誤修復 | `fix(auth): resolve token refresh race` |
| `docs` | 文件 | `docs(ui-ux): add wireframes document` |
| `refactor` | 重構（無行為變更） | `refactor(wiki-beta): extract use case` |
| `chore` | 工具、設定更新 | `chore: update next.js to 16.2` |
| `test` | 測試 | `test(documents): add upload validation` |
| `style` | 格式化（無邏輯變更） | `style: format imports` |
| `perf` | 效能優化 | `perf(documents): add pagination` |

### 範例

```
feat(wiki-beta): add quick-create button to Documents nav item

Users can now click '+' next to Documents in the sidebar to quickly
create a new page or library without navigating away.

Closes #123
```

### 禁止事項

- 禁止 `misc`、`update`、`changes` 等無意義描述。
- 禁止描述超過 72 個字元。
- 禁止在 main 直接 commit（必須透過 PR）。

---

## 5. Pull Request 規範

### 5.1 PR 標題

PR 標題遵循與 Commit 相同的 Conventional Commits 格式。

### 5.2 PR 描述範本

```markdown
## 目的

本 PR 的變更目標（一句話說明）。

Closes #N 或 Refs #N

## 變更內容

- 新增 XxxUseCase 支援 yyy 操作
- 更新 ZzzView 加入 loading skeleton
- ...

## 測試方式

- [ ] `npm run lint` — 0 errors
- [ ] `npm run build` — 成功
- [ ] 手動測試：{描述測試路徑}
```

### 5.3 PR 大小原則

- **一個 PR = 一個關注點**（One Concern per PR）。
- 行數指引：`≤ 400 行`（不含測試與文件）為佳。
- 大型功能拆分為一系列「可獨立 review 且可合併」的小 PR。

---

## 6. 分支保護規則

### `main` 分支保護

| 規則 | 設定 |
|---|---|
| 禁止直接 push | ✅ 啟用 |
| 需要 PR | ✅ 啟用 |
| 需要通過所有 CI Status Checks | ✅ 啟用 |
| 禁止 force push | ✅ 啟用 |
| 合併前需要最新（up to date） | ✅ 建議啟用 |

---

## 7. 版本發布策略

Xuanwu App 目前採用 **Firebase App Hosting** 自動部署，不維護獨立版本標籤。

- 每次合併至 `main` 後，CI/CD Pipeline 自動部署至暫存或生產環境。
- 若需要回滾，使用 Firebase App Hosting 的版本歷史還原功能。
- 若未來需要語義版本（Semantic Versioning），以 `vX.Y.Z` Git tag 為準。
