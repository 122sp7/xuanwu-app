# Skills Index

Skills 是工具型執行手冊，不是架構權威。

## Core Skills

| Skill | Use for |
|---|---|
| `serena-mcp` | session orchestration, memory, symbol/file/project query |
| `context7` | 官方文件驗證（API / schema / version） |
| `hexagonal-ddd` | 模組邊界與依賴方向設計 |
| `xuanwu-skill` | codebase reference lookup |

## Selection Rule

- 不確定 API / 設定行為：先 `context7`
- 需要專案記憶或索引：先 `serena-mcp`
- 需要邊界設計決策：加 `hexagonal-ddd`

## Boundary

- Strategy truth 在 `docs/**/*`
- Behavior rules 在 `instructions/`
- Workflow templates 在 `prompts/`
