# System Layer

## PURPOSE

系統層是全域架構決策與整合規範的權威。定義八個 bounded context 的關係、依賴方向、共用設計模式、交付里程碑與強制遵守的非議規則。

## KEY CONCEPTS

### 8 個 Bounded Context

| Context | 角色 | 擁有的語言 |
|---------|------|----------|
| **iam** | 治理上游 | Actor、Identity、Tenant、Access Decision、Security Policy、Account、Organization |
| **billing** | 商業上游 | Subscription、Entitlement、Billing Event、Referral |
| **ai** | 共享能力上游 | Generation、Orchestration、Distillation、Retrieval、Memory、Safety、Tool-Calling、Reasoning、Conversation |
| **analytics** | 分析下游 | Metric、Report、Dashboard、Projection |
| **platform** | 平台營運支撐 | Notification、Search、Audit-Log、Observability、Feature-Flag |
| **workspace** | 協作容器 | Workspace、Membership、Sharing、Task、Issue、Settlement、Feed、Audit |
| **notion** | 正典知識 | Knowledge Artifact、Taxonomy、Relations、Publication、Knowledge-Versioning |
| **notebooklm** | 推理輸出 | Notebook、Source、Synthesis、Conversation、Conversation-Versioning |

### Hexagonal Architecture + DDD 基線

- Domain Layer（獨立、無框架）
- Application Layer（流程協調）
- Infrastructure Layer（adapter 實作）
- Interfaces Layer（UI / API 入口）
- 依賴方向：`interfaces → application → domain ← infrastructure`

### Runtime 分割

| Runtime | 職責 |
|---------|------|
| **Next.js** | 瀏覽器 UX、伺服器 action、路由協調、會話管理 |
| **fn/** | 重型 ingestion、parsing、chunking、embedding、worker job |

### Published Language 與 Context Map

- Upstream context 定義 published language
- Downstream context 使用 ACL（Anti-Corruption Layer）或 Conformist 模式轉譯
- 強制方向：不允許雙向依賴、不允許同層直接共用

## BASELINE RESPONSIBILITIES

### 1. Architecture Overview
全域系統形狀、8 主域、層級基線、技術棧。

### 2. Context Map
8 個 context 的上下游關係、依賴方向、published language token、strategic patterns 圖。

### 3. Strategic Patterns
共用設計決策、模式啟動規則、反模式、禁止組合。

### 4. Integration Guidelines
跨域協作契約、API 邊界定義、事件契約、ACL 與 Conformist 選擇。

### 5. Project Delivery Milestones
Domain-first 開發順序、里程碑 M0-M9、legacy convergence（strangler pattern）工作流。

### 6. Hard Rules Consolidated
20 條強制規則、ESLint 對應、與 Mandatory Compliance Rules 映射。

### 7. Source to Task Flow
來源文件 → 解析 → 分塊 → 嵌入 → 任務物化的完整管道。

### 8. Module Graph System-Wide
全系統模組依賴圖、禁止 import 清單、boundary violation 偵測。

### 9. UI/UX Closed Loop
用戶故事、UI 迴路、反饋流、設計決策軌跡。

## RECOMMENDED GAP TOPICS

- Provider routing 與 model policy（ai context 延伸治理）
- Consent 與 secret governance（iam context 延伸）
- Quota policy（billing context 延伸）
- Experimentation 與 decision support（analytics 延伸）

## DOCUMENTATION

所有系統層文件列表與快速連結：

1. [architecture-overview.md](./architecture-overview.md)
2. [context-map.md](./context-map.md)
3. [strategic-patterns.md](./strategic-patterns.md)
4. [integration-guidelines.md](./integration-guidelines.md)
5. [project-delivery-milestones.md](./project-delivery-milestones.md)
6. [hard-rules-consolidated.md](./hard-rules-consolidated.md)
7. [source-to-task-flow.md](./source-to-task-flow.md)
8. [module-graph.system-wide.md](./module-graph.system-wide.md)
9. [ui-ux-closed-loop.md](./ui-ux-closed-loop.md)

## USABILITY

- **新加入開發者** 可在 10 分鐘內讀完 `architecture-overview.md` 和 `context-map.md`，理解系統全景與 context 關係
- **架構決策** 可在 5 分鐘內查到相關 strategic pattern 或 integration guideline
- **交付規劃** 可在 3 分鐘內定位正確的里程碑與 domain-first 順序
- **規則檢查** 可在 2 分鐘內查詢是否違反強制規則

## QUICK LINKS

- [.github/AGENTS.md](../../AGENTS.md) — Copilot 治理規則
- [docs/01-architecture/domain/AGENTS.md](../AGENTS.md) — 領域層（術語、ownership）
- [docs/README.md](../../README.md) — 文檔入口
- [docs/05-tooling/commands-reference.md](../../05-tooling/commands-reference.md) — 開發命令
