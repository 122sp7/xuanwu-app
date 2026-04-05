# Context Map ??knowledge

## 銝虜嚗?鞈湛?

### identity ??knowledge嚗ustomer/Supplier嚗?
- ???撽? `createdByUserId`

### workspace ??knowledge嚗ustomer/Supplier嚗?
- ??詨惇??`workspaceId`嚗?撽?撌乩??甇詨惇

---

## 銝虜嚗◤靘陷嚗?

### knowledge ??workspace-flow嚗ublished Language / Customer-Supplier嚗?

**?撟喳????楊 BC ?游?暺?*

- ?游??孵?嚗knowledge.page_approved` ??鈭辣嚗ublished Language嚗?
- `workspace-flow` ??`ContentToWorkflowMaterializer` Process Manager 閮甇支?隞?
- 敺?`extractedTasks[]` 撱箇? Task嚗? `extractedInvoices[]` 撱箇? Invoice

```
knowledge ??? knowledge.page_approved ?????workspace-flow
                                          (ContentToWorkflowMaterializer)
```

### knowledge ??wiki嚗ustomer/Supplier嚗?

- `wiki` 閮 `knowledge.page_created` / `knowledge.block_updated` 隞亙?甇?GraphNode
- `wiki.GraphNode.id` 撠? `knowledge.KnowledgePage.id`

### knowledge ??ai嚗ustomer/Supplier嚗?

- `knowledge.page_approved` 閫貊 `ai` ?? IngestionJob
- RAG ?蝞∠??絲暺?

---

## IDDD ?游?璅∪?蝮賜?

| ?? | 銝虜 | 銝虜 | 璅∪? |
|------|------|------|------|
| identity ??knowledge | identity | knowledge | Customer/Supplier |
| workspace ??knowledge | workspace | knowledge | Customer/Supplier |
| knowledge ??workspace-flow | knowledge | workspace-flow | Published Language (Events) |
| knowledge ??wiki | knowledge | wiki | Customer/Supplier嚗vents嚗?|
| knowledge ??ai | knowledge | ai | Customer/Supplier嚗vents嚗?|
