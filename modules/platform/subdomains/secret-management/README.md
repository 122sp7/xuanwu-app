# platform/subdomains/secret-management

## 子域職責

`secret-management` 子域負責憑證、token 與金鑰輪換的正典邊界（獨立於 `integration`）：

- 管理 API 金鑰、OAuth token、服務帳號憑證的安全儲存（`Secret`）
- 執行憑證輪換策略（`RotationPolicy`）與到期偵測
- 提供安全存取憑證的介面，不暴露明文給其他子域

## 核心語言

| 術語 | 說明 |
|---|---|
| `Secret` | 一個受保護的憑證或金鑰聚合根 |
| `SecretVersion` | 憑證的版本記錄（支援輪換歷程） |
| `RotationPolicy` | 定義憑證輪換頻率與觸發條件 |
| `SecretReference` | 其他子域安全引用 secret 的間接引用物件 |
| `SecretAccessLog` | 憑證存取的可稽核記錄 |

## Hexagonal shape

- `api/`: public 子域 boundary
- `application/`: use cases（`StoreSecret`、`RotateSecret`、`ResolveSecretRef`、`RevokeSecret`）
- `domain/`: `Secret`、`SecretVersion`、`RotationPolicy`
- `infrastructure/`: Google Secret Manager 適配器、加密層
- `interfaces/`: server action 接線（管理員限定）

## 整合規則

- `integration` 子域透過 `SecretReference` 間接取得憑證，不直接存取明文
- 憑證輪換後觸發 `platform.secret-rotated` 事件，通知依賴方更新引用
- 父模組 public API（`@/modules/platform/api`）是跨模組進入點

## Status

🔲 Gap — 尚未實作，依 docs/contexts/platform/subdomains.md 建議建立
