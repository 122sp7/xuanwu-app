# datasets — 訓練集、驗證集與合成資料存儲

## 子域目的

定義 Training/Validation Set 的結構契約、資料清洗後的快照（Data Snapshot），以及蒸餾過程（Distillation）生成的合成資料存儲（Synthetic Data Store）。此子域是 `ai` bounded context 對「AI 訓練材料與合成輸出的正典資料結構」的知識邊界。

## 業務能力邊界

**負責：**
- Training Set 與 Validation Set 的結構定義與版本化
- 資料清洗後快照（Snapshot）的建立、追蹤與不可變性保護
- 蒸餾過程生成的合成資料（Synthetic Data）存儲與目錄管理
- Dataset 的 lineage 追溯（從來源到快照的可追溯鏈）

**不負責：**
- 資料清洗與正規化的執行（屬於 `py_fn/` runtime 的 ingestion pipeline）
- 模型訓練的觸發與監控（外部系統，非本 bounded context 職責）
- 原始來源文件管理（屬於 `notebooklm/source` 子域）
- Embedding 向量的生成與存儲（屬於 `embeddings` 子域）
- Chunking 策略（屬於 `py_fn/` runtime）

## datasets vs embeddings vs py_fn 分工

| 關注點 | datasets | embeddings | py_fn |
|--------|----------|------------|-------|
| 訓練/驗證集結構 | ✅ 正典所有者 | 不關心 | 消費者 |
| 清洗後快照 | ✅ 正典所有者 | 不關心 | 寫入者 |
| 合成資料存儲 | ✅ 正典所有者 | 不關心 | 不關心 |
| Embedding 向量 | 不關心 | ✅ 正典所有者 | 寫入者 |
| Chunking 執行 | 不關心 | 不關心 | ✅ 正典所有者 |

## 核心概念

| 概念 | 說明 |
|------|------|
| Dataset | 訓練或驗證用的資料集聚合根，含 split 類型、版本與 lineage 引用 |
| DataSplit | `training` / `validation` / `test` 的資料集分割標記 |
| DataSnapshot | 資料清洗完成後的不可變快照；攜帶清洗版本、來源引用與時間戳 |
| SyntheticRecord | 蒸餾過程生成的合成資料單筆記錄，含生成模型版本與品質分數 |
| DataLineage | 從原始來源到快照的可追溯鏈值對象 |

## 架構層級

```
datasets/
  api/              ← 對外公開 Dataset 查詢與 Snapshot 上架能力
  domain/
    entities/       ← Dataset, DataSnapshot, SyntheticRecord
    value-objects/  ← DataSplit, DataLineage, SnapshotVersion, QualityScore
    repositories/   ← DatasetRepository, DataSnapshotRepository（介面）
    events/         ← DataSnapshotCreated, SyntheticDataStored, DatasetVersioned
  application/
    use-cases/      ← RegisterDataSnapshot, StoreSyntheticData, GetDataset, ListSnapshots
```

## py_fn 邊界說明

- `py_fn` 的 ingestion pipeline 負責執行清洗並**寫入** `DataSnapshot`
- 本子域定義 `DataSnapshot` 的**結構合約**，`py_fn` 依此合約寫入，不自行定義結構
- 交接點：`py_fn` 寫完後發出 Firestore 事件或直接呼叫 `RegisterDataSnapshot` use case

## Ubiquitous Language

- **Dataset**：訓練材料的正典聚合根（不是 Firestore collection 名稱）
- **DataSnapshot**：清洗完成後的不可變事實記錄（不是 DB backup）
- **SyntheticRecord**：蒸餾輸出的合成資料單元，攜帶生成可追溯性（不是隨機生成資料）
- **DataLineage**：從原始來源 → 清洗 → 快照的完整追溯路徑（不等於 audit log）
- **DataSplit**：資料集的語意用途分割（training/validation/test），不是技術分頁
