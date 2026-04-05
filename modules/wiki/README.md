# knowledge-graph — Knowledge Graph Layer

`modules/wiki` は Knowledge Graph Layer の中核モジュールです。Wiki スタイルのナレッジグラフを管理し、ノード（GraphNode）とエッジ（GraphEdge）のライフサイクルを定義します。

外界との互動規則：
- 外界は `api/` のみを通じてこのモジュールを使用してください
- UI は外部ページまたは他のモジュールが独自に組み立てます
- `domain/`, `application/`, `infrastructure/`, `interfaces/` への直接インポートは禁止です

## アーキテクチャ図

| ファイル | 内容 |
|---|---|
| [`./Graph-Flow.mermaid`](./Graph-Flow.mermaid) | ドメイン状態機械（GraphNode / GraphEdge ライフサイクル） |
| [`./Graph-UI.mermaid`](./Graph-UI.mermaid) | UI 組み立てと API 境界（App Router → api/ → Vis.js キャンバス） |
| [`./Graph-Tree.mermaid`](./Graph-Tree.mermaid) | MDDD ディレクトリ構造と境界ルール |
| [`./Graph-Sequence.mermaid`](./Graph-Sequence.mermaid) | ノード作成・エッジリンクの循環図 |
| [`./Graph-ERD.mermaid`](./Graph-ERD.mermaid) | エンティティ関聯図（GraphNode / GraphEdge / GraphMetadata） |

---

## コアプリンシプル

```
GraphNode   → 知識の単位 (Wiki ページに相当)
GraphEdge   → 知識間の関係 (Wiki リンクに相当)
GraphMetadata → 付加情報 (タグ / カテゴリ / カスタム属性)
```

**独立した 2 つの状態機械が、それぞれのライフサイクルを管理します。**

---

## 1. GraphNode State Machine

```
draft       --[ACTIVATE]-->   active
active      --[ARCHIVE]-->    archived    (guard: no pending or active edges)
archived    --[RESTORE]-->    active
```

| state | 説明 |
|---|---|
| `draft` | ノード作成済み、未公開 |
| `active` | 公開中・グラフに表示 |
| `archived` | アーカイブ済み |

---

## 2. GraphEdge State Machine

```
pending     --[ACTIVATE]-->    active      (guard: both nodes active)
active      --[DEACTIVATE]-->  inactive
inactive    --[ACTIVATE]-->    active
active      --[REMOVE]-->      removed
pending     --[REMOVE]-->      removed
```

| state | 説明 |
|---|---|
| `pending` | エッジ作成済み、未有効化 |
| `active` | 有効なエッジ |
| `inactive` | 一時的に非表示 |
| `removed` | 削除済み |

---

## 参照アーキテクチャ

`docs/decision-architecture/architecture/ai-knowledge-platform-architecture.md` の Knowledge Graph Layer に対応します。
