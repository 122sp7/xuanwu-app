---
description: 'Platform 主域與子域互動規範：以意圖驅動的 Command / Query / Event 模型取代舊式 API 邊界概念。'
applyTo: 'modules/platform/api/**/*.{ts,tsx}'
---

# Platform 主域互動規範

本文件取代舊制「api 作為跨模組進入點」的概念。
完整架構參考 `.github/instructions/architecture-core.instructions.md` 及 `docs/contexts/platform/context-map.md`。

## 主域與子域互動規則

1. **主域為唯一協調者**：platform 主域作為流程與用例的唯一協調者，負責定義跨子域的行為順序，但不得包含具體領域實作。

2. **子域封裝原則**：每個子域必須封裝其內部領域模型與業務規則，僅透過明確定義的介面對外暴露能力，不得洩漏內部實作細節。

3. **跨子域禁止直接依賴**：任一子域不得直接依賴或呼叫另一子域的內部實作，所有跨子域互動必須透過明確的契約（Contract）進行。

4. **意圖驅動互動**：主域與子域之間的交互必須以意圖為導向，使用 Command 表達行為請求，使用 Query 表達資料存取，使用 Event 表達已發生之事實。

5. **Command 由主域發起**：Command 必須由主域發起，用於驅動子域執行狀態變更；子域不得自行發起跨域 Command。

6. **Query 為唯讀操作**：Query 必須為唯讀操作，不得產生副作用，並應優先透過專用讀模型（Read Model）取得資料。

7. **Event 由子域發佈**：Event 必須由子域發佈，用以宣告領域內已發生之事實，且不得包含控制流程的意圖。

8. **最終一致性**：主域或其他子域可訂閱 Event 並轉化為後續 Command，但不得假設事件一定被處理（eventual consistency）。

9. **語言邊界隔離**：每個子域必須維持邊界上下文（Bounded Context），其語言（Ubiquitous Language）不得與其他子域混用。

10. **跨子域資料傳遞使用 DTO**：跨子域的資料傳遞必須使用明確定義的 DTO 或 Contract，避免共享內部 Entity 或 Value Object。

11. **禁止繞過子域直接操作資料**：主域不得繞過子域直接操作其資料儲存（如資料庫），所有狀態變更必須經由子域行為完成。

12. **子域可替換原則**：子域應被設計為可替換（Replaceable），其對外契約穩定，而內部實作可獨立演化。

13. **主域避免成為胖服務**：主域應避免成為胖服務（God Object），僅負責流程協調，將業務規則下放至子域。

14. **複雜流程建模為應用層流程**：若跨子域流程複雜，應明確建模為應用層的流程（Application Service / Orchestration），而非隱藏於子域內。

15. **系統邊界僅與主域互動**：系統邊界（Interface / API）僅能與主域互動，不得直接操作子域，以維持整體一致性與控制力。

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
