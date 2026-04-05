# Context Map ??source

## 銝虜嚗?鞈湛?

### identity ??source嚗ustomer/Supplier嚗?
- `ActorContextPort` ?? `identity/api` 撽?銝?澈??

### workspace ??source嚗ustomer/Supplier嚗?
- ?辣?詨惇 `workspaceId`嚗??? `WorkspaceGrantPort` 撽???

### organization ??source嚗ustomer/Supplier嚗?
- `OrganizationPolicyPort` 閫??蝯?撅斤?靽??輻?

---

## 銝虜嚗◤靘陷嚗?

### source ??ai嚗ustomer/Supplier嚗?

- `source.upload_completed` 閫貊 `ai` ?遣蝡?IngestionJob
- **Runtime ??**嚗ext.js 蝡臬銵?upload-init/complete嚗py_fn/` ?瑁? Embedding

### source ??knowledge嚗ublished Language嚗?

- ?辣??亥??? `knowledge` ??

---

## IDDD ?游?璅∪?蝮賜?

| ?? | 銝虜 | 銝虜 | 璅∪? |
|------|------|------|------|
| identity ??source | identity | source | Customer/Supplier嚗ort嚗?|
| workspace ??source | workspace | source | Customer/Supplier嚗ort嚗?|
| organization ??source | organization | source | Customer/Supplier嚗ort嚗?|
| source ??ai | source | ai | Published Language (Events) |
| source ??knowledge | source | knowledge | Published Language (Events) |
