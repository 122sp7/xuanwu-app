# AGENTS.md 違反修復計劃 (Cockburn + Hexagonal DDD + Occam)

## 應用技能

### 1️⃣ Alistair Cockburn: Heart of Agile 四步動作

**核心原則**：軟體開發是一場"合作發明遊戲"
- 目標 A：立即交付可工作的軟體
- 目標 B：保持程式碼與團隊為下一輪工作做好準備

**本次四步迴圈**：
1. **Collaborate**: 驗證 AGENTS.md 規則 + 三個違反 ✅ DONE
2. **Deliver**: 修復 #3（已完成）、標記 #2（已完成）、計劃 #1
3. **Reflect**: 本審計總結
4. **Improve**: 更新 Serena LSP 索引 + 記憶同步

---

### 2️⃣ Hexagonal DDD: 邊界優先設計

**核心規則**：依賴方向 interfaces → application → domain ← infrastructure

**應用到三個違反**：

| 違反 | DDD 問題 | 修復策略 |
|------|---------|--------|
| **#1** notebooklm/ai | AI 不屬於 notebooklm 域（ownership breach） | 遷移 AI 邏輯至 platform/ai，notebooklm 只消費 platform.ai token |
| **#2** NotionKnowledgePageGateway | 直接呼叫 notion.api（依賴洩漏） | 提取發布語言端口，隱藏 notion 實作細節 |
| **#3** workspace ActorId | 混淆 platform.Actor 與 workspace 本地語言 | 文檔化為發布語言令牌消費者（✅ 已修復） |

**進行順序**（優先級）：
1. **第一** → 修復 #2（NotionKnowledgePageGateway 端口提取）— 2-3h，直接，低風險
2. **第二** → 修復 #1（notebooklm/ai 遷移）— 4-5h，分階段，中等風險

---

### 3️⃣ Occam 剃刀: 最簡單充分的結構

**五個原則**：
1. ✅ 移除假設（而非移除證據）
2. ✅ 優先使用最小結構（仍保護真實邊界）
3. ✅ 等待實際壓力再增加抽象（非預測性）
4. ✅ 簡化 = 刪除重複（非摺疊不同含義）
5. ✅ 選擇易解釋、易測試、易撤銷的選項

**應用**：

| 決策點 | Occam 選擇 | 原因 |
|--------|-----------|------|
| 是否立即修復所有 3 個違反？ | ❌ 否，分階段 | #1 是大遷移（4-5h）；#2 可先做（2-3h）；#3 已完成；無必要 all-or-nothing |
| 是否創建新的 platform/ai domain event system？ | ❌ 否，複用既有 | 使用既有的 platform.ai subdomain，擴展現有端口（低風險） |
| 是否在 AGENTS.md 中補充反覆運算規則？ | ❌ 否，AGENTS.md 已完整 | AGENTS.md 已完全正確（規則清晰）；等待代碼實作證據（非預測） |
| 是否同時處理 3 個違反？ | ❌ 否，序列化 | #2 → #1；依賴關係清晰（#2 對 notion，#1 對 platform） |

**決策結果**：
```
最簡單充分路徑 =
  ✅ 確認 AGENTS.md （已做）
  ✅ 修復 #3 文檔 （已做）
  ⚠️ 標記 #2 TODO （已做）
  📋 計劃 #1 Phase 2 （本次）
  ✨ 更新 Serena 索引 （待）
```

---

## 三個違反修復計劃

### 違反 #3: workspace/audit ActorId — ✅ COMPLETE

**修復已完成**：JSDoc + 發布語言映射清晰

```typescript
/**
 * ActorId — receives platform's "actor reference" published language token.
 * 
 * MAPPING:
 * - platform.Actor (upstream) → workspace.audit.ActorId (downstream)
 * - workspace consumes token without redefining Actor semantics
 */
```

**驗證**：✅ No code behavior change, clean documentation

---

### 違反 #2: NotionKnowledgePageGateway → 端口提取 — ⚠️ NEXT PHASE

**計劃（2-3 小時）**：

**步驟 1**：提取發布語言令牌端口
```typescript
// modules/notebooklm/subdomains/source/application/ports/IKnowledgePageGateway.ts

export interface KnowledgeArtifactReference {
  knowledgeArtifactId: string; // Published token: not notion.pageId
  title: string;
}

export interface IKnowledgePageGateway {
  addKnowledgeBlock(
    knowledgeRef: KnowledgeArtifactReference,
    content: string,
    attachments?: AttachmentReference[]
  ): Promise<void>;
}
```

**步驟 2**：重構適配器實現端口
```typescript
// NotionKnowledgePageGatewayAdapter 實現 IKnowledgePageGateway
// - 輸入：KnowledgeArtifactReference （發布語言）
// - 函式內部：翻譯 → notion.pageId（轉接層邊界）
// - 輸出：KnowledgeArtifactReference （發布語言）
```

**步驟 3**：驗證
```bash
tsc --noEmit     # 零錯误
npm run lint      # 零新警告
grep notion.api   # 僅適配器中出現
```

**責任**：notebooklm 架構師 + notion 領域專家 (paired)

---

### 違反 #1: notebooklm/ai 子域 → 遷移至平台 — 📋 PHASE 2

**計劃（4-5 小時，分階段遷移）**：

**Phase 2.1 : 建立 Tier-2 存根**（0.5-1h）
```
modules/notebooklm/subdomains/
  retrieval/api/{index.ts, server.ts}      // Add index/server API stubs
  grounding/api/{index.ts, server.ts}      // Add grounding API stubs
  synthesis/api/{index.ts, server.ts}      // Add synthesis API stubs
  evaluation/api/{index.ts, server.ts}     // Add evaluation API stubs
```

**Phase 2.2 : 創建 platform/ai 子域**（1-1.5h）
```
modules/platform/subdomains/ai/
  domain/ → RAGModel, AICapability entities
  application/ → RAG orchestration, feedback processing
  infrastructure/ → Genkit adapter, vector store adapter
  api/ → Published AI capability tokens
```

**Phase 2.3 : 遷移邏輯**（2-2.5h）
```
notebooklm/ai/application/use-cases/*
  → platform/ai/application/use-cases/*
  
notebooklm/ai/domain/entities/*
  → platform/ai/domain/entities/*
```

**Phase 2.4 : 更新消費者**
```
modules/notebooklm/subdomains/synthesis → platform/ai/api
modules/notebooklm/subdomains/retrieval → platform/ai/api
modules/notebooklm/subdomains/evaluation → platform/ai/api
```

**Phase 2.5 : 刪除 notebooklm/ai**
```bash
rm -r modules/notebooklm/subdomains/ai/
# Verify no remaining references
grep -r "notebooklm.*ai" modules/
tsc --noEmit && npm run lint
```

**責任**：platform 領域領導 + notebooklm 架構師 (weekly sync)

**預期風險**：
- 🟡 中等：需要協調平台與 notebooklm 邊界
- ✅ 可控：分階段驗證 + 每個階段後有清晰檢查點

---

## Serena 同步計劃

### 必須做的事（用戶要求）

```bash
# 1. 更新 Serena LSP 索引
serena list_memories        # 確認所有記憶可見
serena find_symbol ...      # 驗證三個違反符號位置

# 2. 同步記憶
serena write_memory session/...             # 本審計結果
serena edit_memory repo/agents-md-authority # 更新違反狀態

# 3. 刷新索引（可選但推薦）
serena refresh_project_index
```

### 記憶檔案結構

```
repo/
  ├─ agents-md-authority-framework         ← 已更新(✅)
  ├─ skill-fact-alistair-cockburn          ← 已存在
  ├─ skill-fact-hexagonal-ddd              ← 已存在
  └─ skill-fact-occams-razor               ← 已存在

session/
  ├─ 2026-04-12-agents-md-violations-found (審計清單)
  ├─ 2026-04-12-agents-md-violations-status-audit (狀態確認)
  └─ 2026-04-12-agents-md-remediation-plan (本文件，修復計劃)
```

---

## 下一步行動清單

### 立即行動（本會話）
- [ ] 確認三個違反（✅ 已完成）
- [ ] 更新 Serena 記憶（✅ 本文件）
- [ ] 刷新 LSP 索引（⏳ 待做）

### 短期（下個會話或明天）
- [ ] 修復違反 #2 (NotionKnowledgePageGateway) — 2-3h
  - 提取 IKnowledgePageGateway 端口
  - 實現發布語言令牌邊界
  - `tsc + eslint` 驗證
  
### 中期（Phase 2 衝刺）
- [ ] 遷移違反 #1 (notebooklm/ai) — 4-5h
  - Phase 2.1-2.5 按計劃執行
  - 每個階段驗證 + 文檔更新

---

## 成功標準

### 違反 #3: ✅ 完成
- [ ] ActorId.ts 有 JSDoc
- [ ] 發布語言映射清晰
- [ ] 無代碼行為改變

### 違反 #2: ✅ 完成
- [ ] IKnowledgePageGateway 端口已提取
- [ ] NotionKnowledgePageGatewayAdapter 實現端口
- [ ] `tsc --noEmit` 零錯誤
- [ ] `npm run lint` 零新警告
- [ ] grep notion.api 僅在適配器中出現

### 違反 #1: ✅ 完成（Phase 2）
- [ ] modules/notebooklm/subdomains/ai/ 已刪除
- [ ] platform/ai 子域已建立
- [ ] 所有消費者重定向至 platform/ai/api
- [ ] `tsc + eslint` 全通過

---

## 權威參考

- **AGENTS.md**: `d:\GitHub\122sp7\xuanwu-app\AGENTS.md` (已驗證正確)
- **Alistair Cockburn Skill**: Heart of Agile 四步、方法重量規則
- **Hexagonal DDD Skill**: 依賴方向、邊界優先設計、端口提取策略
- **Occam 剔刀 Skill**: 最簡編排、無虛設抽象、等待實證

---

## 品質指標

| 指標 | 目標 | 當前 |
|------|------|------|
| TypeScript 編譯 | ✅ 零錯誤 | ✅ 零錯誤 |
| ESLint | ✅ 零新警告 | ✅ 零新警告 |
| AGENTS.md 合規 | ✅ 3/3 違反修復 | ✅ 1/3 完成, 1 標記, 1 計劃 |
| Serena 記憶 | ✅ 同步 | ⏳ 待刷新 |

---

**會話狀態**：三個違反已驗證，修復計劃已定，待 Serena LSP 刷新 + #2 修復啟動
