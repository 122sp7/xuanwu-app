# Context Map — knowledge

## 上游（依賴）

### identity → knowledge（Customer/Supplier）
- 頁面操作驗證 `createdByUserId`

### workspace → knowledge（Customer/Supplier）
- 頁面隸屬於 `workspaceId`，需驗證工作區歸屬

---

## 下游（被依賴）

### knowledge → workspace-flow（Published Language / Customer-Supplier）

**這是平台最重要的跨 BC 整合點。**

- 整合方式：`knowledge.page_approved` 領域事件（Published Language）
- `workspace-flow` 的 `KnowledgeToWorkflowMaterializer` Process Manager 訂閱此事件
- 從 `extractedTasks[]` 建立 Task，從 `extractedInvoices[]` 建立 Invoice

```
knowledge ─── knowledge.page_approved ───► workspace-flow
                                          (KnowledgeToWorkflowMaterializer)
```

### knowledge → ai（Customer/Supplier）

- `knowledge.page_approved` 觸發 `ai` 域的 IngestionJob
- RAG 攝入管線的起點

### knowledge → knowledge-database（Open Host Service / D1）

- `knowledge-database` 擁有 `spaceType="database"` 的完整 Schema + Record + View 能力
- `knowledge` 透過 `KnowledgeCollection.id` 作為 opaque reference，不擁有 database 結構化欄位
- 整合方式：`knowledge-database` 以 OHS 開放 DatabaseId API

```
knowledge ──(KnowledgeCollection.id)──► knowledge-database
                                        (Database / Record / View 管理)
```

### knowledge → knowledge-base（Customer/Supplier / D3 Promote）

- Promote 協議：使用者可將 `KnowledgePage` 提升為 `Article`（跨 BC 操作）
- `knowledge-base` 擁有 Promote 協議的業務規則（決定是否可提升、建立 Article）
- `knowledge` 發出 `knowledge.page_promoted` 事件，`knowledge-base` 訂閱後建立 Article

```
knowledge ─── knowledge.page_promoted ───► knowledge-base
                                           (Article 建立，Promote 協議完成)
```

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| identity → knowledge | identity | knowledge | Customer/Supplier |
| workspace → knowledge | workspace | knowledge | Customer/Supplier |
| knowledge → workspace-flow | knowledge | workspace-flow | Published Language (Events) |
| knowledge → ai | knowledge | ai | Customer/Supplier（Events） |
| knowledge → knowledge-database | knowledge | knowledge-database | Open Host Service |
| knowledge → knowledge-base | knowledge | knowledge-base | Customer/Supplier（Promote Events） |
