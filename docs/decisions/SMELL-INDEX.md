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
| 1100 | [1100-layer-violation.md](./1100-layer-violation.md) | Layer Violation — `interfaces/api/` 子目錄與 Firebase SDK 在 `api/` 層 | Accepted |
| 1101 | [1101-layer-violation-crypto-in-domain.md](./1101-layer-violation-crypto-in-domain.md) | Layer Violation — `crypto.randomUUID()` 在 Domain 層（14 aggregates + 13 use-cases → @lib-uuid） | **Resolved** |
| 1102 | [1102-layer-violation-ports-in-application.md](./1102-layer-violation-ports-in-application.md) | Layer Violation — Port 介面定義於 `application/ports/` 而非 `domain/ports/`（部分解決） | Accepted |
| 1103 | [1103-layer-violation-firebase-sdk-in-api-layer.md](./1103-layer-violation-firebase-sdk-in-api-layer.md) | Layer Violation — Firebase SDK（`collectionGroup` 等）直接出現在 `platform/api/infrastructure-api.ts` | Accepted |
| 1200 | [1200-boundary-violation.md](./1200-boundary-violation.md) | Boundary Violation — Cross-module direct domain imports | Accepted |
| 1201 | [1201-boundary-violation-business-logic-in-infrastructure.md](./1201-boundary-violation-business-logic-in-infrastructure.md) | Boundary Violation — 業務規則（wallet balance check）漏入 Infrastructure 層 | Accepted |
| 1300 | [1300-cyclic-dependency.md](./1300-cyclic-dependency.md) | Cyclic Dependency — workspace ↔ platform circular module-evaluation | Partial |
| 1400 | [1400-dependency-leakage.md](./1400-dependency-leakage.md) | Dependency Leakage — platform/api 混合 infra/service/UI exports | Accepted |
| 1401 | [1401-dependency-leakage-infrastructure-api-in-platform-api.md](./1401-dependency-leakage-infrastructure-api-in-platform-api.md) | Dependency Leakage — Infrastructure API symbols (`firestoreInfrastructureApi` 等) 暴露在 platform/api/index.ts 公開邊界 | Accepted |
| 1402 | [1402-dependency-leakage-use-case-classes-in-platform-api.md](./1402-dependency-leakage-use-case-classes-in-platform-api.md) | Dependency Leakage — 17 個 use-case class 名稱透過 platform/api 公開（organization subdomain） | Accepted |
| 1403 | [1403-dependency-leakage-subdomain-api-exports-interfaces-wildcard.md](./1403-dependency-leakage-subdomain-api-exports-interfaces-wildcard.md) | Dependency Leakage — 4 個 platform subdomain api/index.ts 使用 `export * from "../interfaces"` 洩漏 React UI 元件與 server actions | Accepted |
| 2100 | [2100-tight-coupling.md](./2100-tight-coupling.md) | Tight Coupling — 78 files depending on monolithic platform/api | Accepted |
| 2101 | [2101-tight-coupling-crypto-runtime.md](./2101-tight-coupling-crypto-runtime.md) | Tight Coupling — Domain Aggregates 直接綁定 Node.js `crypto` Runtime → @lib-uuid | **Resolved** |
| 2200 | [2200-hidden-coupling.md](./2200-hidden-coupling.md) | Hidden Coupling | Accepted |
| 2201 | [2201-hidden-coupling-workspace-aggregate-no-domain-events.md](./2201-hidden-coupling-workspace-aggregate-no-domain-events.md) | Hidden Coupling — `Workspace` 聚合根未內部收集 Domain Events，事件由 use-case 外部組裝 | Accepted |
| 2300 | [2300-temporal-coupling.md](./2300-temporal-coupling.md) | Temporal Coupling | Accepted |
| 3100 | [3100-low-cohesion.md](./3100-low-cohesion.md) | Low Cohesion — use-case bundling | Accepted |
| 3101 | [3101-low-cohesion-platform-application-layer.md](./3101-low-cohesion-platform-application-layer.md) | Low Cohesion — `platform/application/` 層 9 個異質子目錄 | Accepted |
| 3200 | [3200-duplication.md](./3200-duplication.md) | Duplication | Accepted |
| 3201 | [3201-duplication-event-discriminant-format.md](./3201-duplication-event-discriminant-format.md) | Duplication — Domain Event 識別符號格式統一為 `kebab-case` | **Resolved** |
| 3202 | [3202-duplication-source-dto-reimplements-domain-service.md](./3202-duplication-source-dto-reimplements-domain-service.md) | Duplication — Source DTO re-implements domain service logic | **Resolved** |
| 3203 | [3203-duplication-shell-quick-create-orphaned-platform-copy.md](./3203-duplication-shell-quick-create-orphaned-platform-copy.md) | Duplication — 兩個 `shell-quick-create` 實作（platform/application 版本孤兒化，無消費者） | Accepted |
| 4100 | [4100-change-amplification.md](./4100-change-amplification.md) | Change Amplification | Accepted |
| 4101 | [4101-change-amplification-uuid-strategy.md](./4101-change-amplification-uuid-strategy.md) | Change Amplification — UUID 策略集中於 @lib-uuid | **Resolved** |
| 4200 | [4200-inconsistency.md](./4200-inconsistency.md) | Inconsistency | Accepted |
| 4201 | [4201-inconsistency-dto-vs-dtos.md](./4201-inconsistency-dto-vs-dtos.md) | Inconsistency — `dto` vs `dtos` 目錄命名不一致（11 vs 13 個模組） | **Resolved** |
| 4202 | [4202-inconsistency-uuid-v7-in-workspace-domain-events.md](./4202-inconsistency-uuid-v7-in-workspace-domain-events.md) | Inconsistency — `workspace/domain/events/workspace.events.ts` 使用 UUID v7，全 repo domain 層均為 v4 | Accepted |
| 4300 | [4300-semantic-drift.md](./4300-semantic-drift.md) | Semantic Drift — interfaces/api 子目錄與 application/event-handlers | Accepted |
| 4301 | [4301-semantic-drift-application-subdirectory-names.md](./4301-semantic-drift-application-subdirectory-names.md) | Semantic Drift — `event-handlers/`、`event-mappers/`、`handlers/`、`process-managers/` 命名偏離職責語意 | Accepted |
| 4302 | [4302-semantic-drift-notion-notebooklm-event-discriminant-format.md](./4302-semantic-drift-notion-notebooklm-event-discriminant-format.md) | Semantic Drift — Notion & NotebookLM event discriminant format snake_case → kebab-case | **Resolved** |
| 4303 | [4303-semantic-drift-workspace-event-discriminants-use-underscore.md](./4303-semantic-drift-workspace-event-discriminants-use-underscore.md) | Semantic Drift — `workspace.lifecycle_transitioned`、`workspace.visibility_changed`、`workspace.audit.*` 使用下劃線分隔符，違反 kebab-case 規範 | Accepted |
| 5100 | [5100-accidental-complexity.md](./5100-accidental-complexity.md) | Accidental Complexity | Accepted |
| 5101 | [5101-accidental-complexity-platform-domain-stubs.md](./5101-accidental-complexity-platform-domain-stubs.md) | Accidental Complexity — platform/domain/ 21 TODO stub → DESIGN.md | **Resolved** |
| 5200 | [5200-cognitive-load.md](./5200-cognitive-load.md) | Cognitive Load | Accepted |
| 5201 | [5201-cognitive-load-workspace-workflow-application.md](./5201-cognitive-load-workspace-workflow-application.md) | Cognitive Load — `workspace-workflow/application/` 混合 5 種子目錄慣例 | Accepted |
| 5202 | [5202-cognitive-load-workspace-dto-mixes-types-and-factory-functions.md](./5202-cognitive-load-workspace-dto-mixes-types-and-factory-functions.md) | Cognitive Load — `workspace-interfaces.dto.ts` 混合型別 export 與 domain event factory function export | Accepted |
| 5203 | [5203-cognitive-load-subdomain-api-unscoped-wildcard-exports.md](./5203-cognitive-load-subdomain-api-unscoped-wildcard-exports.md) | Cognitive Load — 12 個 subdomain `api/index.ts` 使用無選擇性 `export *` wildcard，API surface 不可讀 | Accepted |

## 與 0001–0011 ADR 的對應關係

| Smell ADR | 對應 ADR |
|-----------|---------|
| 1100 Layer Violation | 0001 Hexagonal Architecture |
| 1101 Layer Violation — crypto in domain | 0001 Hexagonal Architecture |
| 1102 Layer Violation — ports in application | 0001 Hexagonal Architecture, 0008 Repository Interface |
| 1103 Layer Violation — Firebase SDK in api/ layer | 0001 Hexagonal Architecture, 0007 Infrastructure in api/ |
| 1200 Boundary Violation | 0002 Bounded Contexts, 0003 Context Map |
| 1201 Boundary Violation — business logic in infra | 0001 Hexagonal Architecture, 0009 Anemic Aggregates |
| 1300 Cyclic Dependency | 0001 Hexagonal Architecture |
| 1400 Dependency Leakage | 0007 Infrastructure in api/, 0008 Repository Interface |
| 1401 Dependency Leakage — infrastructure-api in platform/api | 0001 Hexagonal Architecture, 0007 Infrastructure in api/ |
| 1402 Dependency Leakage — use-case classes in platform/api | 0007 Infrastructure in api/, 0011 Use Case Bundling |
| 1403 Dependency Leakage — subdomain api exports * from interfaces | 0001 Hexagonal Architecture, 0007 Infrastructure in api/ |
| 2100 Tight Coupling | 0003 Context Map, 0007 Infrastructure in api/ |
| 2101 Tight Coupling — crypto runtime | 0001 Hexagonal Architecture |
| 2200 Hidden Coupling | 0010 Aggregate Domain Event Emission |
| 2201 Hidden Coupling — workspace aggregate no domain events | 0010 Aggregate Domain Event Emission, 0009 Anemic Aggregates |
| 2300 Temporal Coupling | 0007 Infrastructure in api/ |
| 3100 Low Cohesion | 0011 Use Case Bundling |
| 3101 Low Cohesion — platform application layer | 0001 Hexagonal Architecture, 0011 Use Case Bundling |
| 3200 Duplication | 0004 Ubiquitous Language |
| 3201 Duplication — event discriminant format | 0004 Ubiquitous Language, 0006 Domain Event Discriminant |
| 3202 Duplication — source DTO logic | 0004 Ubiquitous Language |
| 3203 Duplication — shell-quick-create orphaned copy | 0001 Hexagonal Architecture, 0011 Use Case Bundling |
| 4100 Change Amplification | 0011 Use Case Bundling |
| 4101 Change Amplification — UUID strategy | 0001 Hexagonal Architecture |
| 4200 Inconsistency | 0004 Ubiquitous Language, 0006 Domain Event Discriminant |
| 4201 Inconsistency — dto vs dtos | 0004 Ubiquitous Language |
| 4202 Inconsistency — UUID v7 in workspace domain events | 0001 Hexagonal Architecture, 0006 Domain Event Discriminant |
| 4300 Semantic Drift | 0004 Ubiquitous Language |
| 4301 Semantic Drift — application subdirectory names | 0001 Hexagonal Architecture, 0004 Ubiquitous Language |
| 4302 Semantic Drift — notion/notebooklm event discriminant format | 0004 Ubiquitous Language, 0006 Domain Event Discriminant |
| 4303 Semantic Drift — workspace event discriminants use underscore | 0004 Ubiquitous Language, 0006 Domain Event Discriminant |
| 5100 Accidental Complexity | 0001 Hexagonal Architecture |
| 5101 Accidental Complexity — platform domain stubs | 0001 Hexagonal Architecture, 0010 Aggregate Domain Event Emission |
| 5200 Cognitive Load | 0009 Anemic Aggregates, 0011 Use Case Bundling |
| 5201 Cognitive Load — workspace-workflow application | 0001 Hexagonal Architecture, 0011 Use Case Bundling |
| 5202 Cognitive Load — workspace DTO mixes types and factories | 0009 Anemic Aggregates, 0010 Aggregate Domain Event Emission |
| 5203 Cognitive Load — subdomain api unscoped wildcard exports | 0001 Hexagonal Architecture, 0007 Infrastructure in api/ |

## How To Use This Index

1. 識別問題所屬 smell 類型。
2. 查閱對應編號文件的 context + decision + consequences。
3. 參照「對應 ADR」確認架構規範根源。
4. 若 smell 尚未記錄，按此編號體系新增文件。
