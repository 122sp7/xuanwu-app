# Design Smell Taxonomy Index

本目錄收錄 Xuanwu App 的架構診斷記錄，依「smell 類型」編號分群，與原始 ADR（0001–0011）平行維護。

## 編號體系

| 前綴 | 類型 | 子類型 |
|------|------|-------|
| **1000** | **Architectural Smells** | 架構結構性問題 |
| 1100 | Layer Violation | 層次邊界穿越 |
| 1200 | Boundary Violation | 模組邊界穿越 |
| 1300 | Cyclic Dependency | 循環依賴 |
| 1400 | Dependency Leakage | 依賴洩漏 |
| **2000** | **Coupling Smells** | 耦合問題 |
| 2100 | Tight Coupling | 緊耦合 |
| 2200 | Hidden Coupling | 隱式耦合 |
| 2300 | Temporal Coupling | 時序耦合 |
| **3000** | **Modularity Smells** | 模組性問題 |
| 3100 | Low Cohesion | 低內聚 |
| 3200 | Duplication | 重複 |
| **4000** | **Maintainability Smells** | 可維護性問題 |
| 4100 | Change Amplification | 變更放大 |
| 4200 | Inconsistency | 不一致 |
| 4300 | Semantic Drift | 語意漂移 |
| **5000** | **Complexity Smells** | 複雜性問題 |
| 5100 | Accidental Complexity | 偶然複雜性 |
| 5200 | Cognitive Load | 認知負荷 |

## Decision Log (Smell Taxonomy)

| ID | File | Title | Status |
|----|------|-------|--------|
| 1100 | [1100-layer-violation.md](./1100-layer-violation.md) | Layer Violation | Accepted |
| 1200 | [1200-boundary-violation.md](./1200-boundary-violation.md) | Boundary Violation | Accepted |
| 1300 | [1300-cyclic-dependency.md](./1300-cyclic-dependency.md) | Cyclic Dependency | Accepted |
| 1400 | [1400-dependency-leakage.md](./1400-dependency-leakage.md) | Dependency Leakage | Accepted |
| 2100 | [2100-tight-coupling.md](./2100-tight-coupling.md) | Tight Coupling | Accepted |
| 2200 | [2200-hidden-coupling.md](./2200-hidden-coupling.md) | Hidden Coupling | Accepted |
| 2300 | [2300-temporal-coupling.md](./2300-temporal-coupling.md) | Temporal Coupling | Accepted |
| 3100 | [3100-low-cohesion.md](./3100-low-cohesion.md) | Low Cohesion | Accepted |
| 3200 | [3200-duplication.md](./3200-duplication.md) | Duplication | Accepted |
| 4100 | [4100-change-amplification.md](./4100-change-amplification.md) | Change Amplification | Accepted |
| 4200 | [4200-inconsistency.md](./4200-inconsistency.md) | Inconsistency | Accepted |
| 4300 | [4300-semantic-drift.md](./4300-semantic-drift.md) | Semantic Drift | Accepted |
| 5100 | [5100-accidental-complexity.md](./5100-accidental-complexity.md) | Accidental Complexity | Accepted |
| 5200 | [5200-cognitive-load.md](./5200-cognitive-load.md) | Cognitive Load | Accepted |

## 與 0001–0011 ADR 的對應關係

| Smell ADR | 對應 ADR |
|-----------|---------|
| 1100 Layer Violation | 0001 Hexagonal Architecture |
| 1200 Boundary Violation | 0002 Bounded Contexts, 0003 Context Map |
| 1300 Cyclic Dependency | 0001 Hexagonal Architecture |
| 1400 Dependency Leakage | 0007 Infrastructure in api/, 0008 Repository Interface |
| 2100 Tight Coupling | 0003 Context Map, 0007 Infrastructure in api/ |
| 2200 Hidden Coupling | 0010 Aggregate Domain Event Emission |
| 2300 Temporal Coupling | 0007 Infrastructure in api/ |
| 3100 Low Cohesion | 0011 Use Case Bundling |
| 3200 Duplication | 0004 Ubiquitous Language |
| 4100 Change Amplification | 0011 Use Case Bundling |
| 4200 Inconsistency | 0004 Ubiquitous Language, 0006 Domain Event Discriminant |
| 4300 Semantic Drift | 0004 Ubiquitous Language |
| 5100 Accidental Complexity | 0001 Hexagonal Architecture |
| 5200 Cognitive Load | 0009 Anemic Aggregates, 0011 Use Case Bundling |

## How To Use This Index

1. 識別問題所屬 smell 類型。
2. 查閱對應編號文件的 context + decision + consequences。
3. 參照「對應 ADR」確認架構規範根源。
4. 若 smell 尚未記錄，按此編號體系新增文件。
