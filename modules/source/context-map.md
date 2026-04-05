# Context Map — source

## 上游（依賴）

### identity → source（Customer/Supplier）
- `ActorContextPort` 透過 `identity/api` 驗證上傳者身分

### workspace → source（Customer/Supplier）
- 文件隸屬 `workspaceId`，需透過 `WorkspaceGrantPort` 驗證授權

### organization → source（Customer/Supplier）
- `OrganizationPolicyPort` 解算組織層級保留政策

---

## 下游（被依賴）

### source → ai（Customer/Supplier）

- `source.upload_completed` 觸發 `ai` 域建立 IngestionJob
- **Runtime 邊界**：Next.js 端執行 upload-init/complete；`py_fn/` 執行 Embedding

### source → knowledge（Published Language）

- 文件關聯知識頁面時通知 `knowledge` 域

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| identity → source | identity | source | Customer/Supplier（Port） |
| workspace → source | workspace | source | Customer/Supplier（Port） |
| organization → source | organization | source | Customer/Supplier（Port） |
| source → ai | source | ai | Published Language (Events) |
| source → knowledge | source | knowledge | Published Language (Events) |
