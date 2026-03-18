# functions-python ADR 規範與索引

本目錄是 `lib/firebase/functions-python` 的 **Architecture Decision Record (ADR)** 集中管理區。

目標不是累積抽象文件，而是把會影響後續設計、實作、重構、遷移與 Copilot 判斷的決策，固定成可追蹤的規範。

---

## 1. 本目錄回答什麼問題

對 `functions-python` 而言，ADR 應優先回答以下問題：

1. `functions-python` 的**定位**是什麼？
2. 它和 **Next.js / Genkit / Firestore / Firebase Storage** 的**責任邊界**是什麼？
3. 依賴套件為什麼這樣選？哪些可以用、哪些不要引入？
4. 目錄結構、層次依賴、觸發方式、資料流應該如何設計？
5. 如何從 `lib/firebase/functions` 遷移到 `lib/firebase/functions-python`？

如果一個技術決策會直接影響以上任一題，就應該寫成 ADR，而不是只留在註解或 README 片段裡。

---

## 2. functions-python 的 ADR 寫作硬規則

### 2.1 基本定位

`functions-python` 必須被視為：

- **Firebase worker runtime**
- **ingestion / parsing / embedding / backfill / reprocess 的基礎設施**
- **不是** 第二個產品 API server
- **不是** 直接承接瀏覽器流量的主要入口

若 ADR 與這個定位衝突，必須在文件中明確寫出衝突點與替代方案，不能默默偏離。

### 2.2 檔名規則

- 檔名格式：`ADR-XXX-short-name.md`
- `XXX` 為三位數遞增編號
- `short-name` 使用英文 kebab-case，方便搜尋與穩定引用

範例：

- `ADR-001-document-parsing.md`
- `ADR-002-runtime-boundary-and-infrastructure-role.md`

### 2.3 狀態規則

每份 ADR 必須有狀態，且只能使用以下值：

- `Proposed`
- `Accepted`
- `Superseded`
- `Deprecated`

### 2.4 內容規則

每份 ADR 至少應包含：

1. **狀態 (Status)**
2. **背景 / 問題 (Context)**
3. **決策 (Decision)**
4. **設計細節 (Design / Interaction / Structure)**
5. **後果 (Consequences)**

若該 ADR 與依賴套件、資料流、遷移規劃有關，還應補上：

- **Alternatives Considered**
- **Package Selection**
- **Migration Impact**
- **Operational Notes**

### 2.5 Copilot 可執行規則

ADR 不應只寫「概念」，必須讓 Copilot 能直接用來判斷：

- 哪些 API 應該放在 **Next.js**
- 哪些 entrypoint 應該放在 **functions-python**
- 哪些套件可以引入
- 哪些層不可直接相依
- 若要取代 `lib/firebase/functions`，下一步應該先做什麼

如果文件寫完後，Copilot 仍然無法判斷「這個功能該放哪個 runtime」，表示 ADR 寫得還不夠具體。

---

## 3. 寫 ADR 時的分層原則

`functions-python` 內部沿用本倉庫的 MDDD / Hexagonal 原則：

```text
interfaces -> application -> domain <- infrastructure
```

因此，ADR 必須同時檢查：

- `domain` 是否保持純 Python、純模型、純 ports
- `application` 是否只負責協調 use case
- `interfaces` 是否只接 trigger / callable / request payload
- `infrastructure` 是否只處理 Firebase / Google Cloud / 外部 SDK

若某決策會讓 SDK 直接滲透到 `domain`，該決策應被視為違規設計。

---

## 4. 與 Next.js / Node Functions 的邊界規範

### 應該留在 Next.js 的內容

- 瀏覽器直接呼叫的 API
- Upload UI / Server Action / Route Handler
- 使用者 auth/session/cookies
- Query orchestration
- Genkit prompt assembly
- Streaming answer response
- Feedback submit

### 應該放在 functions-python 的內容

- 背景 ingestion pipeline
- 解析、清洗、taxonomy、chunk、embedding
- Firestore / Storage 驅動的 worker
- reprocess / backfill / maintenance
- 管理用途 callable / internal endpoints

### Node Functions 遷移原則

`lib/firebase/functions` 的既有能力**不能直接硬切移除**。

ADR 必須使用以下遷移邏輯：

1. **共存**
2. **能力對齊**
3. **流量切換**
4. **觀測與回滾確認**
5. **正式淘汰**

---

## 5. 目前 ADR 清單

| ADR | 主題 | 目的 |
| --- | --- | --- |
| [ADR-001](./ADR-001-document-parsing.md) | 文件解析策略 | 決定使用 Google Cloud Document AI 作為核心解析能力 |
| [ADR-002](./ADR-002-runtime-boundary-and-infrastructure-role.md) | runtime 邊界與基礎設施定位 | 明確定義 functions-python 是 worker / infrastructure runtime |
| [ADR-003](./ADR-003-dependency-selection-policy.md) | 依賴套件選型規則 | 說明要保留、避免與延後引入的依賴 |
| [ADR-004](./ADR-004-structure-and-interaction-design.md) | 結構與交互設計 | 定義目錄、層次、資料流、觸發方式與交互模型 |
| [ADR-005](./ADR-005-migration-from-typescript-functions.md) | 從 `lib/firebase/functions` 遷移 | 說明共存、替換與下線策略 |

---

## 6. 新 ADR 範本

```md
# ADR XXX: Title

## 狀態 (Status)
Accepted

## 背景 (Context)
- 問題是什麼
- 現況限制是什麼
- 不做決策會造成什麼混亂

## 決策 (Decision)
- 明確寫出採用方案
- 明確寫出不採用什麼

## 設計細節 (Design)
- 模組邊界
- 互動方式
- 資料流
- 依賴方向

## 套件選型 (Package Selection)
- 為什麼選
- 為什麼不選其他方案

## 後果 (Consequences)
- 正面影響
- 負面影響
- 維運影響

## 遷移影響 (Migration Impact)
- 對現有 Node Functions / Next.js / Firestore 的影響
```

---

## 7. 維護規則

- 當 README、AGENTS、實際程式結構與 ADR 衝突時，應優先修正文件，使其重新一致。
- 若新決策會取代舊 ADR，請把舊文件標記為 `Superseded`，不要直接刪除歷史。
- 若只是實作進度落後，不要修改 ADR 結論；應另外補充 migration 或 implementation note。
