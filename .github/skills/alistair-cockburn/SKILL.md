---
name: alistair-cockburn
description: >
  Alistair Cockburn 風格開發技能書。凡涉及架構設計、使用案例分析、方法論選擇、
  協作流程規劃時適用。依據 Cockburn 的 Heart of Agile、六邊形架構（端口與適配器）、
  Use Case 撰寫、Crystal 方法論與協作遊戲原則，引導 Copilot 以人為本、目標導向、
  輕量適切地開發軟體。
user-invocable: true
---

# alistair-cockburn 人物技能書

Alistair Cockburn 是敏捷宣言共同起草人，以「軟體開發是一場協作遊戲」為核心理念，
提倡以人、溝通與學習為本，設計恰好夠用的方法論與架構。

---

## 核心哲學：協作遊戲 (Cooperative Game)

> "Software development is a cooperative game of invention and communication."
> — Alistair Cockburn, *Agile Software Development: The Cooperative Game* (2006)

每一個軟體專案都是一場限時的協作遊戲，有兩個目標：

1. **主要目標**：交付可運作的軟體。
2. **次要目標**：為「下一場遊戲」鋪路——保持系統可維護、可演化。

### 開發者行動原則

- 每次決策都問：「這個決策讓下一場遊戲更容易還是更難？」
- 優先讓**溝通暢通**，程式碼是溝通的媒介，不只是執行指令。
- 不要為了「可能的未來」過度設計；用**最輕量但足以完成任務**的方案。
- 技術文件的目的是**降低下一個人的認知負擔**，不是展示知識量。

---

## Heart of Agile（敏捷之心）

Cockburn 在 2016 年將敏捷精煉為四個字：

```
Collaborate → Deliver → Reflect → Improve
協作          交付      反思      改善
```

### 在 Xuanwu 專案中的對應實踐

| Heart of Agile | 實踐方式 |
|----------------|---------|
| **Collaborate** | 模組邊界使用 `api/` 合約讓協作意圖明確；跨模組透過領域事件通訊而非直接依賴 |
| **Deliver** | 每個 PR 只做一件事；Server Action 回傳一致的 `CommandResult` 確保交付可預測 |
| **Reflect** | 每次 Sprint 結束寫 Serena 記憶；PR Review 聚焦在「是否符合業務目標」 |
| **Improve** | 發現邊界違規就修正；Use Case 不符合現實就更新，而非累積技術債 |

---

## 六邊形架構（Hexagonal Architecture / Ports & Adapters）

Cockburn 在 2005 年提出六邊形架構，目標是讓**應用核心完全隔離於外部技術**。

### 核心概念

```
       [ UI / API / CLI ]            ← 主動端（Driving Side）
              ↓
    ┌─────────────────────────┐
    │        Application      │  ← 應用核心（Use Cases）
    │         Core            │
    │     (Domain Logic)      │
    └─────────────────────────┘
              ↓
  [ DB / Queue / External API ]     ← 被動端（Driven Side）
```

- **Port（端口）**：應用核心定義的**介面**，不知道誰來實作。
- **Adapter（適配器）**：外部技術實作 Port，可隨時替換而不影響核心。
- **應用核心**不依賴框架、資料庫或 HTTP——只依賴自己定義的 Port。

### 對應 Xuanwu MDDD 層次

| 六邊形架構概念 | Xuanwu 對應 |
|-------------|------------|
| Application Core | `modules/<context>/domain/` + `application/` |
| Driving Port (inbound) | `modules/<context>/api/facade.ts` (contracts.ts 定義 DTO) |
| Driving Adapter | `app/` Server Actions、`modules/<context>/interfaces/` |
| Driven Port (outbound) | `modules/<context>/domain/repositories/` 介面 |
| Driven Adapter | `modules/<context>/infrastructure/firebase/` 實作 |

### 程式碼模式：Driven Port 與 Adapter

```typescript
// ✅ Port：在 domain/ 定義介面——不依賴任何框架
// modules/knowledge/domain/repositories/KnowledgePageRepository.ts
export interface KnowledgePageRepository {
  findById(id: KnowledgePageId): Promise<KnowledgePage | null>;
  save(page: KnowledgePage): Promise<void>;
  listByWorkspace(workspaceId: WorkspaceId): Promise<KnowledgePage[]>;
}

// ✅ Adapter：在 infrastructure/ 實作——可替換
// modules/knowledge/infrastructure/firebase/FirebaseKnowledgePageRepository.ts
export class FirebaseKnowledgePageRepository implements KnowledgePageRepository {
  async findById(id: KnowledgePageId): Promise<KnowledgePage | null> {
    // Firebase 實作細節在這裡，domain/ 完全不知道
  }
}
```

### 違規警示（Anti-Pattern）

```typescript
// ❌ 違規：在 domain/ 直接依賴 Firebase
import { getFirestore } from 'firebase/firestore'; // 不應出現在 domain/

// ❌ 違規：application/ 直接建立 infrastructure 實例
const repo = new FirebaseKnowledgePageRepository(); // 應透過 DI 注入
```

---

## Use Case 撰寫方法

> "A use case captures a contract between the stakeholders of a system about its behavior."
> — Alistair Cockburn, *Writing Effective Use Cases* (2000)

### 目標層次（Goal Levels）

Cockburn 將 Use Case 分為三個層次，用**望遠鏡符號**標示：

| 符號 | 層次 | 說明 | 例子 |
|------|------|------|------|
| ☁️ 雲端 | Summary | 跨越多個工作階段的高層目標 | 建立知識庫管理系統 |
| 🌊 海浪 | User Goal | 使用者在單次會話中完成的目標 | 新增知識頁面 |
| 🐚 海螺 | Sub-function | 支撐 User Goal 的局部步驟 | 驗證頁面標題格式 |

**核心規則**：大多數 Use Case 應寫在「User Goal」層次（🌊）。

### Use Case 結構範本（應用於 Xuanwu）

```markdown
## UC-01: 新增知識頁面 🌊

**主要成功場景（Main Success Scenario）**
1. 使用者在工作區選擇「新增頁面」
2. 系統顯示頁面編輯器，預填預設標題
3. 使用者輸入標題與內容
4. 使用者選擇發布
5. 系統驗證內容，儲存頁面，並顯示成功訊息
6. 系統將頁面狀態標記為「已發布」

**延伸情況（Extensions）**
3a. 使用者未輸入標題：
  系統顯示錯誤提示，不允許繼續
5a. 儲存失敗（網路錯誤）：
  系統顯示重試提示，頁面草稿保留於本地
```

### 黑箱原則（Black-Box Perspective）

- Use Case 描述**系統「做什麼」**，不描述**系統「怎麼做」**。
- 不要在 Use Case 中提到資料庫、API 呼叫或框架細節。
- 好的 Use Case 對任何技術實作都有效。

### 利害關係人與利益（Stakeholders and Interests）

每個 Use Case 前先問：
1. **誰是主要執行者（Primary Actor）？** → 觸發 Use Case 的人
2. **誰是支援執行者（Supporting Actor）？** → 系統呼叫的外部服務
3. **所有利害關係人的利益是什麼？** → 不只是主要執行者

---

## Crystal 方法論思維

> "Use the heaviest methodology that will just barely work — or better, the lightest."
> — Alistair Cockburn

Crystal 方法論的核心：**方法論應該配合團隊，不是團隊配合方法論**。

### Crystal 屬性（適用於任何團隊）

| 屬性 | 說明 | Xuanwu 對應 |
|------|------|------------|
| **Frequent Delivery** | 頻繁交付，每次交付都是真實可用的 | PR 要可獨立合併；Server Action 要回傳可預期結果 |
| **Reflective Improvement** | 定期反思並改善工作方式 | Sprint 結束後更新 Serena 記憶；refactor 要有測試佐證 |
| **Osmotic Communication** | 團隊成員靠近工作，資訊自然流動 | 程式碼即文件；命名要讓意圖自明 |
| **Personal Safety** | 成員可以安全地提出問題或反對意見 | PR Review 聚焦在行為正確性，而非挑剔風格 |
| **Focus** | 每次只做一件重要的事 | 一個 PR 一個關注點；不混合架構重構與功能開發 |
| **Easy Access to Expert Users** | 開發者可隨時接觸真實使用者 | Use Case 撰寫需要業務語言，不是技術語言 |
| **Technical Environment** | 自動化測試、CI/CD、頻繁整合 | `npm run lint && npm run build && npm run test` 必須通過 |

### 方法論選擇原則（Fit for Purpose）

```
問問自己：
✓ 這個設計決策是「恰好夠用（barely sufficient）」嗎？
✓ 如果移除這一層抽象，有什麼具體風險？
✓ 添加這個介面後，真的讓下一個人更容易理解嗎？
```

---

## 溝通優先原則（Communication-First）

Cockburn 認為**溝通品質決定軟體品質**。

### 程式碼溝通規範

```typescript
// ✅ Cockburn 風格：命名表達意圖，不需要註解
export class CreateKnowledgePageUseCase {
  async execute(input: CreateKnowledgePageInput): Promise<CommandResult> {
    // 每個步驟都說明發生了什麼，讀者不需要猜
    const page = KnowledgePage.create(generateId(), input);
    await this.repository.save(page);
    const events = page.pullDomainEvents();
    await this.eventPublisher.publishAll(events);
    return { success: true, aggregateId: page.id };
  }
}

// ❌ 反模式：需要大量註解才能理解的程式碼
export async function handlePageOp(data: any, opts?: any) {
  // ... 複雜的業務邏輯散落各處
}
```

### 文件溝通規範

- 文件的目的是降低**下一個讀者的認知負擔**。
- 寫最重要的事，省略可從程式碼直接讀出的細節。
- 每個 `modules/<context>/README.md` 應回答：「這個模組負責什麼？邊界在哪裡？」
- 用具體的業務語言（通用語言），不用技術行話，除非讀者都是開發者。

---

## 本技能書的使用情境

| 情境 | 適用的 Cockburn 原則 |
|------|-------------------|
| 設計新模組邊界 | 六邊形架構、Port/Adapter 分離 |
| 撰寫 Use Case 或需求分析 | Use Case 撰寫方法、目標層次 |
| 決定要不要加一層抽象 | Crystal 適切性原則、協作遊戲次要目標 |
| PR Review 聚焦點 | Heart of Agile（Deliver、Reflect） |
| 命名類別、方法、變數 | 溝通優先原則、通用語言 |
| 規劃 Sprint 或迭代 | Crystal 頻繁交付、Focus 屬性 |
| 寫技術文件 | 協作遊戲、溝通優先 |

---

## 快速決策檢查清單

在提交任何設計決策前，用 Cockburn 視角審查：

```
□ 這個改動讓「下一場遊戲」更容易還是更難？
□ 應用核心（domain/ + application/）是否仍然框架無關？
□ 跨模組存取是否只透過 api/ 端口？
□ 命名是否直接表達業務意圖（不需要額外解釋）？
□ 這是「恰好夠用」的解法，還是過度設計？
□ 這個 PR 是否只做一件明確的事（Focus）？
□ Lint + Build + Test 是否通過（Technical Environment）？
```

---

## 延伸閱讀

- Alistair Cockburn, *Writing Effective Use Cases* (2000) — Use Case 寫法的權威參考
- Alistair Cockburn, *Agile Software Development: The Cooperative Game* (2006) — 協作遊戲理論
- Alistair Cockburn, "Hexagonal Architecture" (2005) — [alistair.cockburn.us/hexagonal-architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- Alistair Cockburn, "Heart of Agile" (2016) — [heartofagile.com](https://heartofagile.com)
- Agile Manifesto (2001) — [agilemanifesto.org](https://agilemanifesto.org)
