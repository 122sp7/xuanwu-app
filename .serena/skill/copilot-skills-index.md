# Copilot Skills Index

## 說明
以下是 `.github/skills/` 目錄下所有可用的 Copilot skill。
每個 skill 都有對應的 `SKILL.md`，需要時用 `read_file` 載入後再使用。

## 技能清單

### 架構 & 設計模式

| Skill | 路徑 | 觸發時機 |
|---|---|---|
| `hexagonal-ddd` | `.github/skills/hexagonal-ddd/SKILL.md` | 設計或審查 bounded-context、layer direction、ports/adapters、aggregate |
| `alistair-cockburn` | `.github/skills/alistair-cockburn/SKILL.md` | 選擇流程重量、撰寫 use case、簡化協作 |
| `occams-razor` | `.github/skills/occams-razor/SKILL.md` | 多方案競爭、抽象氾濫、決策精簡 |
| `zod-validation` | `.github/skills/zod-validation/SKILL.md` | 設計或審查三層 Zod 驗證邊界 |
| `zustand-xstate` | `.github/skills/zustand-xstate/SKILL.md` | 設計 Zustand store、XState machine、client/server 狀態分離 |

### Next.js & Frontend

| Skill | 路徑 | 觸發時機 |
|---|---|---|
| `app-router-parallel-routes` | `.github/skills/app-router-parallel-routes/SKILL.md` | 建立或重構 Next.js route slice、parallel-route UI block |
| `vercel-react-best-practices` | `.github/skills/vercel-react-best-practices/SKILL.md` | React/Next.js 效能最佳化、data fetching、bundle 優化 |
| `vercel-composition-patterns` | `.github/skills/vercel-composition-patterns/SKILL.md` | Next.js 組合模式設計 |
| `next-devtools-mcp` | `.github/skills/next-devtools-mcp/SKILL.md` | Next.js DevTools MCP 整合、效能診斷 |
| `deploy-to-vercel` | `.github/skills/deploy-to-vercel/SKILL.md` | 部署 Vercel |

### UI & 設計

| Skill | 路徑 | 觸發時機 |
|---|---|---|
| `shadcn` | `.github/skills/shadcn/SKILL.md` | 任何介面元件、shadcn/ui 組合、Mobile First 設計 |
| `frontend-design` | `.github/skills/frontend-design/SKILL.md` | 建立有質感的 UI 元件、landing page、dashboard |
| `web-design-guidelines` | `.github/skills/web-design-guidelines/SKILL.md` | 審查 UI 可及性、設計規範合規性 |
| `sleek-design-mobile-apps` | `.github/skills/sleek-design-mobile-apps/SKILL.md` | 行動裝置 App UI 設計 |

### Firebase & Backend

| Skill | 路徑 | 觸發時機 |
|---|---|---|
| `firebase-rules` | `.github/skills/firebase-rules/SKILL.md` | Firebase SDK 邊界、Firestore collection ownership、Security Rules |
| `genkit-ai` | `.github/skills/genkit-ai/SKILL.md` | Genkit flow 設計、tool calling、prompt pipeline、platform.ai governance |

### 文件驗證

| Skill | 路徑 | 觸發時機 |
|---|---|---|
| `context7` | `.github/skills/context7/SKILL.md` | library API 信心低於 99.99% 時驗證官方文件（必用） |

### 測試 & 瀏覽器

| Skill | 路徑 | 觸發時機 |
|---|---|---|
| `playwright-mcp-testing` | `.github/skills/playwright-mcp-testing/SKILL.md` | 用戶流程驗證、UI 缺陷偵測、截圖存證、E2E 自動化 |
| `agent-browser` | `.github/skills/agent-browser/SKILL.md` | 瀏覽器自動化 CLI、與網站互動、表單填寫、截圖、資料抓取 |
| `browser-use` | `.github/skills/browser-use/SKILL.md` | 網頁測試、form filling、資料擷取 |

### Codebase 探索

| Skill | 路徑 | 觸發時機 |
|---|---|---|
| `xuanwu-skill` | `.github/skills/xuanwu-skill/SKILL.md` | 了解 Xuanwu 結構、實作模式、程式碼細節（快速掃描首選） |
| `xuanwu-skill` | `.github/skills/xuanwu-skill/SKILL.md` | Xuanwu App codebase 參考（結構 + 技術棧） |
| `xuanwu-markdown-skill` | `.github/skills/xuanwu-markdown-skill/SKILL.md` | Xuanwu App markdown skill 參考 |
| `repomix` | `.github/skills/repomix/SKILL.md` | 透過 repomix output 分析 repo（搭配 xuanwu-skill） |
| `repomix-explorer` | `.github/skills/repomix-explorer/SKILL.md` | 分析或探索 codebase（本地或遠端 repo）結構 |

### Agent & 記憶

| Skill | 路徑 | 觸發時機 |
|---|---|---|
| `serena-mcp` | `.github/skills/serena-mcp/SKILL.md` | Serena MCP 操作、.serena memories、onboarding、bootstrap |
| `agent-memory` | `.github/skills/agent-memory/SKILL.md` | 儲存、回憶、整理記憶 |
| `contextual-commit` | `.github/skills/contextual-commit/SKILL.md` | 撰寫帶有 intent/decision/constraint 的 contextual commit |
| `find-skills` | `.github/skills/find-skills/SKILL.md` | 協助使用者發現與安裝 agent skills |

## 使用原則

1. **先 read_file 載入 SKILL.md，再執行任務**。不要只引用 skill 而不讀取。
2. 多個 skill 並行適用時，可同時載入多個 SKILL.md。
3. `context7` 是 API/框架驗證的預設第一步，凡信心不足就先查文件。
4. `xuanwu-skill` 是本 repo 快速掃描首選，避免手動 file hunting。
5. `shadcn` 適用於任何 UI 相關任務（自動觸發）。
