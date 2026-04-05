# Context Map — workspace-feed

## 上游（依賴）

### workspace → workspace-feed（Conformist）

- `WorkspaceFeedPost.workspaceId` 隸屬工作區

## 下游（被依賴）

### workspace-feed → notification（Published Language）

- `WorkspaceFeedPostCreated` 可觸發通知

### workspace-feed → workspace-audit（Published Language）

- 貼文操作記錄稽核軌跡

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| workspace → workspace-feed | workspace | workspace-feed | Conformist |
| workspace-feed → notification | workspace-feed | notification | Published Language |
| workspace-feed → workspace-audit | workspace-feed | workspace-audit | Published Language |
