# DDD Strategic Design — Eric Evans Reference

> 本文件依據 *Domain-Driven Design: Tackling Complexity in the Heart of Software*（Eric Evans）整理規則句，並對應本系統的 bounded context、subdomain 與依賴方向設計。

---

# 🧠 一、核心戰略概念（Strategic Design Rules）

1. 通用語言（Ubiquitous Language）必須在團隊內部與程式碼中保持一致，任何領域概念的命名都應直接反映業務語意。
2. 界限上下文（Bounded Context）必須明確定義語言與模型的邊界，不同上下文之間不得共享模型語意。
3. 每個界限上下文內的模型必須保持一致性（Consistency），跨上下文則允許語意轉換（Translation）。
4. 子域（Subdomain）應依業務價值分類為核心域（Core）、支撐域（Supporting）、通用域（Generic），並依此分配設計與資源優先級。
5. 核心域（Core Domain）必須集中最強設計能力與抽象，避免被基礎設施或通用邏輯污染。
6. 支撐域（Supporting Subdomain）應服務核心域需求，但不承載關鍵競爭優勢。
7. 通用域（Generic Subdomain）應優先採用現成方案（如第三方服務），避免自行重複建造。
8. 上下文映射（Context Mapping）必須明確描述各界限上下文之間的關係與整合方式。
9. 不同上下文之間的整合必須選擇適當模式（如 Anti-Corruption Layer、Conformist、Open Host Service 等）。
10. 反腐層（Anti-Corruption Layer）必須用於隔離外部模型，防止污染內部核心模型。
11. 開放主機服務（Open Host Service）應提供穩定、公開的契約，供其他上下文整合使用。
12. 發佈語言（Published Language）應定義跨上下文共享的標準資料格式與語意。
13. 共享核心（Shared Kernel）僅應在高度信任的團隊之間使用，並需嚴格控制變更。
14. 客戶-供應者（Customer-Supplier）關係應明確定義需求與交付責任，以維持演進穩定。
15. 順從者（Conformist）模式應在無法影響上游模型時採用，接受其語意限制。
16. 分離方式（Separate Ways）應在整合成本過高時採用，允許上下文完全獨立演化。
17. 大泥球（Big Ball of Mud）應被避免，若存在則需逐步以界限上下文重構。
18. 戰略設計必須優先於戰術設計，先定義邊界與關係，再設計內部模型與程式結構。

---

# 🧩 二、戰略地圖（概念關係）

```
Subdomain（業務問題空間）
        ↓ 對應
Bounded Context（解決方案邊界）
        ↓
Context Mapping（上下文關係）
        ↓
Integration Patterns（整合模式）
```

---

# ⚡ 三、關鍵對照（很多人會混）

| 概念                  | 本質           |
| ------------------- | ------------ |
| Subdomain           | 業務問題分類（商業視角） |
| Bounded Context     | 技術模型邊界（系統視角） |
| Ubiquitous Language | 語意一致性        |
| Context Mapping     | 上下文關係圖       |

---

# 🔥 四、你這種 AI 系統的映射（直接對應）

```
Core Domain
  → prompt-pipeline / inference（核心能力）

Supporting Domain
  → memory-context / evaluation-policy

Generic Domain
  → models / embeddings / tokens（可外包）
```

---

# 🎯 五、最重要的總結（戰略層一句話）

> 先切邊界（Bounded Context），再談模型；先定關係（Context Map），再寫程式。

---

# 🏛 六、分層架構規則（Layered Architecture）

> Evans 第四章：將複雜系統分為四層，每層只依賴其下層，業務規則集中於 Domain Layer。

1. **UI / Interface Layer**：只負責輸入轉換與輸出呈現，不承載業務決策。
2. **Application Layer**：編排 Use Case 流程，不包含業務規則；它是薄的協調層，不是業務層。
3. **Domain Layer**：封裝所有業務規則、不變量與領域概念；是整個系統的核心，完全不依賴外部框架或技術。
4. **Infrastructure Layer**：實作持久化、訊息、外部服務等技術細節；實作 Domain 定義的介面，不反向依賴 Domain 實作。
5. **依賴方向固定**：`Interface → Application → Domain ← Infrastructure`；禁止 Domain 依賴任何外部層。
6. Application Layer 不得包含領域邏輯；若 Use Case 開始判斷業務條件，應下沉至 Domain。
7. Infrastructure Layer 的具體實作（如 Firestore、HTTP client）不得洩漏進 Application 或 Domain。

---

# 🧩 七、聚合根規則（Aggregate Rules）

> Evans 第六章：Aggregate 是一致性邊界，Aggregate Root 是唯一的對外入口。

1. Aggregate 是一組領域物件的一致性邊界，確保內部不變量始終成立。
2. Aggregate Root 是唯一允許外部引用的實體；外部物件不得直接持有 Aggregate 內部實體的引用。
3. 跨 Aggregate 的引用只能透過 Aggregate Root 的全域唯一識別碼（ID），不得持有直接物件引用。
4. 每個 Aggregate 對應一個 Repository；不為 Aggregate 內部的 non-root 實體建立 Repository。
5. 跨 Aggregate 的狀態變更應透過 Domain Event，不得在一個事務內同時修改兩個 Aggregate（最終一致性）。
6. Aggregate 邊界應設計得越小越好；大型 Aggregate 導致鎖爭搶與效能問題。
7. Aggregate 必須在物件建立時即驗證並保護不變量，不得讓不合法的狀態進入存在。

---

# 🔷 八、實體與值對象規則（Entity & Value Object Rules）

> Evans 第五章：以身份 vs 值特性區分兩種核心領域物件。

**實體（Entity）**

1. 實體以身份（Identity）定義相等，兩個屬性相同但 ID 不同的物件視為不同實體。
2. 實體必須封裝狀態變更；不得對外暴露裸 setter，所有狀態轉換應透過具業務語意的行為方法。
3. 實體必須主動保護其不變量（Invariants），不依賴外部呼叫方自行確保合法狀態。
4. 實體的生命週期由 Repository 管理；不在 Entity 內部直接呼叫持久化邏輯。

**值對象（Value Object）**

5. 值對象以屬性值定義相等，相同屬性值的兩個值對象視為相等。
6. 值對象必須是不可變的（Immutable）；修改代表建立新的值對象，不原地修改。
7. 值對象的方法不得有副作用（Side Effect Free）；計算結果返回新值對象。
8. 優先使用值對象替代基本型別（Primitive Obsession），封裝業務語意與驗證規則。

---

# 📦 九、Repository 規則（Repository Rules）

> Evans 第六章：Repository 提供物件導向的集合語意，隱藏持久化技術細節。

1. Repository 對外提供集合語意（如 `findByEmail`、`add`、`remove`），不暴露 SQL、查詢語法或技術細節。
2. Repository 介面定義在 **Domain Layer**；實作放在 **Infrastructure Layer**。
3. 每個 Aggregate Root 對應一個 Repository；不為 Aggregate 內部實體建立獨立 Repository。
4. Repository 返回完整重建的 Aggregate，不返回局部數據結構或 ORM model。
5. Repository 不承載業務邏輯；複雜查詢條件應以規範物件（Specification）或具名方法封裝。
6. 跨 Aggregate 的查詢應建立獨立的 Read Model（Query Handler），不強迫 Repository 承擔讀模型職責。

---

# ⚙️ 十、領域服務規則（Domain Service Rules）

> Evans 第五章：無法自然歸屬於任何 Entity 或 Value Object 的領域操作，放入 Domain Service。

1. 只有當操作不屬於任何單一 Entity 或 Value Object 時，才建立 Domain Service。
2. Domain Service 是無狀態的（Stateless），不持有成員變數（除非是被注入的 Port 介面）。
3. Domain Service 以業務語意命名（如 `PriceCalculator`、`PolicyEvaluator`），不以技術術語命名。
4. 若 Domain Service 開始依賴外部技術（如資料庫、HTTP），應將依賴抽象為 Port，由 Infrastructure 實作。
5. Domain Service 與 Application Service 的區別：Domain Service 持有業務規則；Application Service 持有流程協調。

---

# 🧱 十一、邊界設計規則（Boundary Rules）

> Evans 第十四~十六章：Bounded Context 是語意邊界，不是技術邊界；邊界內的語言必須一致。

1. Bounded Context 的邊界由業務語言一致性決定，不由資料庫表、微服務部署或 UI 模組劃定。
2. 同一個領域概念在不同 Bounded Context 中可以有不同的語意與模型；跨邊界的語意轉換必須顯式。
3. Bounded Context 之間的模型絕不直接共享；跨上下文的數據交換必須透過 Published Language 或 ACL。
4. Anti-Corruption Layer（ACL）是防止外部語意污染內部核心語言的強制屏障；每個 downstream 消費 upstream 模型時都應評估是否需要 ACL。
5. Context Map 必須記錄每對上下文之間的整合模式（ACL、Conformist、OHS、Shared Kernel 等），不允許隱式整合。
6. Upstream context 有責任維護穩定的 Published Language；Downstream 不得假設 upstream 內部實作不變。

---

# 🎯 五（補）、Evans 核心原則總覽

| 原則 | 一句話 |
|------|--------|
| Aggregate | 一致性邊界；Root 是唯一入口 |
| Entity | 以 Identity 存在；封裝狀態與不變量 |
| Value Object | 以 Value 存在；不可變、無副作用 |
| Repository | 集合語意；介面在 Domain，實作在 Infrastructure |
| Domain Service | 無家可歸的業務規則；無狀態、業務命名 |
| Bounded Context | 語意一致性邊界；不是技術部署邊界 |
| Ubiquitous Language | 同一詞在同一 Context 內只有一個意思 |
| Anti-Corruption Layer | 保護內部語意不被外部模型污染的翻譯層 |
| Core Domain | 集中最強設計能力；不允許基礎設施邏輯污染 |
