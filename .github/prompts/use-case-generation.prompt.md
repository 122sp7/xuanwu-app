---
name: use-case-generation
description: 將業務流程轉成 Application Layer Use Case，定義 orchestration logic、input/output DTO，並串連 domain entities 與 ports。
applyTo: 'src/modules/**/application/**/*.{ts,tsx}'
agent: Domain Lead
argument-hint: 提供 actor、業務目標（goal）、主要成功情境（main success scenario）、失敗分支、所屬模組與子域。
tools: ['serena/*', 'context7/*', 'read', 'edit', 'search', 'execute']
---

# Use Case 生成器

## 職責邊界

**負責**
- 業務流程 → application service orchestration
- input DTO / output DTO 定義
- Use Case 內的 port / repository 互動順序
- 事件發布時機（先持久化，再 `pullDomainEvents()`，再發布）
- `CommandResult` 標準回傳格式

**不負責**
- Firebase / infrastructure 實作
- UI state 或 React 元件
- AI flow 實作（Genkit flow 由 `implement-genkit-flow` 負責）

## 輸入

- **Actor**：誰發起這個 use case（例如 `AuthenticatedUser`、`SystemJob`）
- **Goal**：業務目標一句話描述
- **Main Success Scenario**：列點描述正常流程
- **Failure Branches**：列出失敗情況與對應錯誤
- **所屬模組 / 子域**：例如 `src/modules/workspace/subdomains/scheduling`
- **相關 Domain Entities / Aggregates**：例如 `WorkDemand`、`Workspace`

## 工作流程

1. 讀取 `docs/structure/domain/ubiquitous-language.md` 與對應 `docs/contexts/<context>/README.md`，確認語言與邊界。
2. 讀取 `.github/instructions/architecture-core.instructions.md`，確認 use case 決策規則。
3. 在 `src/modules/<context>/[subdomains/<sub>/]application/use-cases/` 建立：
   - 檔案命名：`verb-noun.use-case.ts`（例如 `create-work-demand.use-case.ts`）
4. Use Case 結構：
   - constructor 注入 repository / port 介面（非實作）
   - `execute(input: XxxInput): Promise<CommandResult>` 是唯一公開方法
   - 不直接呼叫 Firebase SDK；僅透過注入的 port
   - 業務規則交給 aggregate；use case 只負責 orchestration
5. 建立或更新 DTO 檔案：
   - `application/dto/<noun>.dto.ts`
   - DTO 只含型別宣告，runtime value 不得從 domain re-export
6. 更新 `application/use-cases/index.ts` barrel export。

## 輸出合約

- Use case TypeScript 類別（含完整 JSDoc）
- Input DTO 型別
- Output：`CommandResult`（從 `@shared-types` 引用）
- `application/use-cases/index.ts` barrel 更新

## 驗證

- `npm run lint` — 確認無 layer 違規
- `npm run build` — 確認型別一致

Tags: #use skill context7 #use skill serena-mcp #use skill repomix #use skill xuanwu-skill
#use skill hexagonal-ddd
